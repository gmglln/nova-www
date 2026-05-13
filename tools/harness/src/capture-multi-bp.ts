#!/usr/bin/env -S npx tsx
/**
 * Multi-breakpoint triple-capture for the fast-path v4 script.
 *
 * Drives Playwright through configured breakpoints (default [375, 768, 1440])
 * for a single component, captures triple-read (computed/minusLegacy/stripped)
 * + documentDefaults at each, emits a fixture consumable by dom-to-jsx-v4.ts.
 *
 * Usage:
 *   npx tsx src/capture-multi-bp.ts <fixture-config.json> <out-fixture.json>
 *
 * <fixture-config.json>:
 *   {
 *     "componentName": "StatBlock",
 *     "props": [...],
 *     "selector": "#harness-target",
 *     "breakpoints": [375, 768, 1440],
 *     "referenceUrl": "https://www.ndc-md.org/what-we-do",
 *     "setupScript": "() => { ... add id='harness-target' to wrapper }"
 *   }
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { AuthFlow } from './types.ts';

type Config = {
  componentName: string;
  props?: Array<{ name: string; type: string }>;
  selector: string;
  breakpoints: number[];
  referenceUrl: string;
  setupScript?: string;
  /** Login flow for targets behind an auth wall. Runs before the capture. */
  auth?: AuthFlow;
  legacyClasses?: string[];
};

/** Run a declarative auth flow at the Playwright level (not page.evaluate). */
async function runAuth(page: any, auth: AuthFlow): Promise<void> {
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
];

const LEGACY_DEFAULT = ['typography','white','hanging','hanging-12'];

/** Page-side body — passed to page.evaluate as a string to avoid swc-generated
 * __name() helper injection that fails in browser context. */
const evalBody = `
  (sel, props, legacyArr) => {
    const LEGACY = new Set(legacyArr);
    const ROOT = document.querySelector(sel);
    if (!ROOT) return { error: 'selector not found: ' + sel };

    const read = function (el) {
      const cs = getComputedStyle(el);
      const out = {};
      for (let i = 0; i < props.length; i++) { const p = props[i]; out[p] = cs[p]; }
      return out;
    };

    const tripleRead = function (el) {
      const original = el.getAttribute('class');
      const computed = read(el);
      let minusLegacy = null;
      if (original) {
        const tokens = original.split(/\\s+/).filter(Boolean);
        const hasLegacy = tokens.some(function (t) { return LEGACY.has(t.split(':').pop()); });
        if (hasLegacy) {
          const kept = tokens.filter(function (t) { return !LEGACY.has(t.split(':').pop()); }).join(' ');
          el.setAttribute('class', kept);
          minusLegacy = read(el);
          el.setAttribute('class', original);
        }
      }
      el.removeAttribute('class');
      const stripped = read(el);
      if (original !== null) el.setAttribute('class', original);
      return { computed: computed, minusLegacy: minusLegacy, stripped: stripped };
    };

    const ser = function (el, depth) {
      if (!el || el.nodeType !== 1) return null;
      const tr = tripleRead(el);
      const node = {
        tag: el.tagName.toLowerCase(),
        classes: (el.getAttribute('class') || '').split(/\\s+/).filter(Boolean),
        text: el.children.length === 0 ? ((el.textContent || '').trim() || null) : null,
        computed: tr.computed,
        minusLegacy: tr.minusLegacy,
        stripped: tr.stripped,
        children: depth < 10 ? Array.from(el.children).map(function (c) { return ser(c, depth + 1); }).filter(Boolean) : [],
      };
      return node;
    };

    const docDefaults = {};
    const captureDefault = function (tag) {
      if (docDefaults[tag]) return;
      const e = document.createElement(tag);
      document.body.appendChild(e);
      docDefaults[tag] = read(e);
      e.remove();
    };
    // Walk to find tags used; capture defaults
    const walker = document.createTreeWalker(ROOT, NodeFilter.SHOW_ELEMENT);
    let n; while ((n = walker.nextNode())) captureDefault(n.tagName.toLowerCase());
    captureDefault(ROOT.tagName.toLowerCase());

    return { tree: ser(ROOT, 0), documentDefaults: docDefaults };
  }
`;

async function captureAt(browser: any, url: string, bp: number, selector: string, setupScript: string | undefined, legacy: string[], auth: AuthFlow | undefined) {
  const ctx = await browser.newContext({ viewport: { width: bp, height: 900 } });
  const page = await ctx.newPage();
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
    await page.waitForTimeout(800);
  }
  if (setupScript) await page.evaluate(`(${setupScript})()`);

  const result: any = await page.evaluate(`(${evalBody})('${selector}', ${JSON.stringify(PROPS)}, ${JSON.stringify(legacy)})`);
  await ctx.close();
  if (result.error) throw new Error(result.error);
  return result;
}

const [, , configArg, outArg] = process.argv;
if (!configArg || !outArg) {
  console.error('usage: npx tsx src/capture-multi-bp.ts <config.json> <out-fixture.json>');
  process.exit(1);
}

const cfg: Config = JSON.parse(readFileSync(resolve(configArg), 'utf8'));
const legacy = cfg.legacyClasses ?? LEGACY_DEFAULT;
const browser = await chromium.launch();

console.log(`capturing ${cfg.componentName} from ${cfg.referenceUrl} at ${cfg.breakpoints.join(', ')}`);

// Capture per breakpoint, accumulate into per-element multi-bp data
const captures: Record<number, any> = {};
for (const bp of cfg.breakpoints) {
  captures[bp] = await captureAt(browser, cfg.referenceUrl, bp, cfg.selector, cfg.setupScript, legacy, cfg.auth);
  console.log(`  @${bp} captured (${captures[bp].tree.tag} subtree)`);
}
await browser.close();

/** Merge same-shape trees from each breakpoint into one with computedByBp etc. */
function mergeTree(treesByBp: Record<number, any>): any {
  const breakpoints = Object.keys(treesByBp).map(n => parseInt(n, 10)).sort((a,b)=>a-b);
  const refTree = treesByBp[breakpoints[0]];

  const merge = (paths: number[][], baseRef: any): any => {
    const node: any = {
      tag: baseRef.tag,
      classes: baseRef.classes,
      text: baseRef.text,
      computedByBp: {},
      minusLegacyByBp: {},
      strippedByBp: {},
      children: [],
    };
    for (const bp of breakpoints) {
      // navigate to this node in treesByBp[bp]
      let cur = treesByBp[bp].tree;
      for (const idx of paths) cur = cur.children[idx[0]];
      node.computedByBp[bp]    = cur.computed;
      node.minusLegacyByBp[bp] = cur.minusLegacy;
      node.strippedByBp[bp]    = cur.stripped;
    }
    for (let i = 0; i < (baseRef.children?.length ?? 0); i++) {
      node.children.push(merge([...paths, [i]], baseRef.children[i]));
    }
    return node;
  };

  return merge([], refTree.tree);
}

const merged = mergeTree(captures);

// documentDefaults: same across breakpoints (browser default for a fresh tag)
const fixture = {
  componentName: cfg.componentName,
  props: cfg.props ?? [],
  legacyClasses: legacy,
  breakpoints: cfg.breakpoints,
  documentDefaults: captures[cfg.breakpoints[0]].documentDefaults,
  tree: merged,
  capturedAt: new Date().toISOString(),
  source: { url: cfg.referenceUrl, selector: cfg.selector },
};

mkdirSync(dirname(resolve(outArg)), { recursive: true });
writeFileSync(resolve(outArg), JSON.stringify(fixture, null, 2));
console.log(`✓ wrote ${outArg}`);
