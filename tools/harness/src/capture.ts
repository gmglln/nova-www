import { chromium, type Page } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Capture, AuthFlow } from './types.ts';

/**
 * Run a declarative auth flow (login form fill/submit) before capture.
 * Runs at the Playwright level so it can fill/click/wait — `setupScript`
 * is browser-side eval and can't do these.
 */
async function runAuth(page: Page, auth: AuthFlow): Promise<void> {
  console.log(`  auth: ${auth.steps.length} step(s)`);
  for (const step of auth.steps) {
    switch (step.type) {
      case 'fill': await page.fill(step.selector, step.value); break;
      case 'click': await page.click(step.selector); break;
      case 'press': await page.press(step.selector, step.key); break;
      case 'waitForSelector': await page.waitForSelector(step.selector, { timeout: step.timeout }); break;
      case 'waitForURL': await page.waitForURL(step.pattern, { timeout: step.timeout }); break;
      case 'waitForLoadState': await page.waitForLoadState(step.state ?? 'networkidle'); break;
      case 'waitForTimeout': await page.waitForTimeout(step.ms); break;
    }
  }
}

const PROPS = [
  'fontFamily','fontSize','fontWeight','color','lineHeight','letterSpacing','textTransform','textAlign',
  'marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft',
  'backgroundColor','display','position','borderRadius',
  'borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth',
  'width','height',
];

/**
 * Capture a single component subtree from a URL at a given breakpoint width.
 * `selector` is a CSS selector for the wrapper element to score; everything
 * outside that subtree is ignored.
 */
export async function capture(opts: {
  url: string;
  slug: string;
  breakpoint: number;
  selector: string;
  outDir: string;
  /** Optional JS to run after navigation, before scoring. Useful to add an id
   * to the live-site element so a single CSS selector can match both sides. */
  setupScript?: string;
  /** Optional declarative login flow run BEFORE the capture goto. Cookies set
   * during auth persist into the subsequent capture navigation. */
  auth?: AuthFlow;
  reuseBrowser?: { page: Page };
}): Promise<Capture> {
  const { url, slug, breakpoint, selector, outDir, setupScript, auth } = opts;

  const browser = opts.reuseBrowser ? null : await chromium.launch();
  const page = opts.reuseBrowser?.page ?? await browser!.newContext({ viewport: { width: breakpoint, height: 900 } }).then(c => c.newPage());
  if (!opts.reuseBrowser) await page.setViewportSize({ width: breakpoint, height: 900 });

  // Auth first if configured. If `loginUrl` is omitted, the harness logs in
  // at `url` itself and skips the post-auth navigation — many SPAs (Figma
  // sites among them) keep auth state in React memory, not cookies, so a
  // redundant goto(url) reload would kick us back to the login wall.
  if (auth) {
    await page.goto(auth.loginUrl ?? url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await runAuth(page, auth);
    if (auth.loginUrl && auth.loginUrl !== url) {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
    }
  } else {
    await page.goto(url, { waitUntil: 'networkidle' });
    // give CDN-injected styles (Tailwind shim case) a tick
    await page.waitForTimeout(800);
  }

  // Inline the evaluate body as a string to bypass tsx/swc compilation
  // (which would inject __name(...) helper not defined in the browser).
  // The setupScript is now run INSIDE this same evaluate call rather than
  // as a separate page.evaluate(), to avoid the cross-call round-trip
  // window where a re-render can wipe out an id/data-attr tag set during
  // setup. (Observed on React/Next live sites that aggressively re-render
  // on hydration completion.)
  const evaluateBody = `
    (sel, props) => {
      const ROOT = document.querySelector(sel);
      if (!ROOT) return { error: 'selector not found: ' + sel };
      const read = function (el) {
        const cs = getComputedStyle(el);
        const out = {};
        for (let i = 0; i < props.length; i++) { const p = props[i]; out[p] = cs[p]; }
        return out;
      };
      const ser = function (el, depth) {
        if (!el || el.nodeType !== 1) return null;
        return {
          tag: el.tagName.toLowerCase(),
          classes: (el.getAttribute('class') || '').split(/\\s+/).filter(Boolean),
          text: el.children.length === 0 ? ((el.textContent || '').trim() || null) : null,
          computed: read(el),
          children: depth < 10 ? Array.from(el.children).map(function (c) { return ser(c, depth + 1); }).filter(Boolean) : [],
        };
      };
      const a11y = function (root) {
        const r = { headings: [], landmarks: [], imgs: [] };
        const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        let n;
        while ((n = w.nextNode())) {
          const tag = n.tagName.toLowerCase();
          if (/^h[1-6]$/.test(tag)) r.headings.push({ level: parseInt(tag[1], 10), text: (n.textContent || '').trim().slice(0, 80) });
          if (['nav','main','header','footer','aside','section','article'].indexOf(tag) >= 0)
            r.landmarks.push({ tag: tag, label: n.getAttribute('aria-label') || null });
          if (tag === 'img')
            r.imgs.push({ alt: n.getAttribute('alt'), hasAlt: n.hasAttribute('alt'), decorative: n.getAttribute('alt') === '' });
        }
        return r;
      };
      ROOT.scrollIntoView({ block: 'center' });
      const r = ROOT.getBoundingClientRect();
      // Detect if the FIRST declared font in the cascade is actually loaded.
      // Lets the scorer flag font-substitution when both sides declare the
      // same family but only one has the @font-face loaded.
      const cs = getComputedStyle(ROOT);
      const firstFont = (cs.fontFamily || '').split(',')[0].trim().replace(/['"]/g, '');
      let fontLoaded = false;
      try { fontLoaded = !!document.fonts && document.fonts.check('16px "' + firstFont + '"'); } catch (e) {}
      return {
        bbox: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
        dom: ser(ROOT, 0),
        a11y: a11y(ROOT),
        firstFont: firstFont,
        fontLoaded: fontLoaded,
      };
    }
  `;
  // Compose the setup + capture into a single evaluate call by inlining the
  // setupScript SOURCE directly (rather than passing it as a string and using
  // new Function — that approach silently drops DOM mutations on some pages,
  // possibly due to strict CSP / Trusted Types). Inlining the source keeps it
  // in the same lexical scope as the evaluate body.
  //
  // The wrapper IIFE is async + the setup call is awaited, so async setupScripts
  // (e.g., click a filter pill, wait for React re-render, then tag the card)
  // complete before evaluateBody reads the DOM. Sync setupScripts still work —
  // awaiting a non-Promise resolves immediately.
  const setupInline = setupScript ? `await (${setupScript})();` : '';
  const evalSrc = `(async () => { ${setupInline} return (${evaluateBody})(${JSON.stringify(selector)}, ${JSON.stringify(PROPS)}); })()`;
  const result: any = await page.evaluate(evalSrc);

  if ('error' in result) {
    if (browser) await browser.close();
    throw new Error(result.error);
  }

  const cap: Capture & { firstFont?: string; fontLoaded?: boolean } = {
    slug, breakpoint,
    capturedAt: new Date().toISOString(),
    sourceUrl: url,
    bbox: result.bbox,
    dom: result.dom,
    a11y: result.a11y,
    firstFont: result.firstFont,
    fontLoaded: result.fontLoaded,
  };

  const domPath = `${outDir}/${slug}-${breakpoint}.dom.json`;
  const pngPath = `${outDir}/${slug}-${breakpoint}.png`;
  mkdirSync(dirname(domPath), { recursive: true });
  writeFileSync(domPath, JSON.stringify(cap));
  await page.screenshot({ path: pngPath });

  if (browser) await browser.close();
  return cap;
}
