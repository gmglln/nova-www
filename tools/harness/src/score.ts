import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Capture, Computed, Node, A11y } from './types.ts';

const VISIBLE_PROPS = [
  'fontSize','fontWeight','color','lineHeight','letterSpacing','textTransform','textAlign',
  'marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft',
  'backgroundColor','display','position','borderRadius',
  'borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth',
  'borderTopColor','borderRightColor','borderBottomColor','borderLeftColor',
];

const WEIGHTS_FULL = { domStructural: 0.30, computedCss: 0.30, a11yTree: 0.25, pixelDiff: 0.15 };
const WEIGHTS_NO_PIXEL = { domStructural: 0.353, computedCss: 0.353, a11yTree: 0.294 };

function flattenAll(n: Node, path: string[] = [], acc: Array<{ path: string[]; node: Node }> = []) {
  acc.push({ path: [...path, n.tag], node: n });
  for (const c of n.children ?? []) flattenAll(c, [...path, n.tag], acc);
  return acc;
}

function tagTree(n: Node): string {
  if (!n.children || n.children.length === 0) return n.tag;
  return `${n.tag}[${n.children.map(tagTree).join(',')}]`;
}

function normalizeFontStack(ff?: string): string {
  if (!ff) return '';
  return ff.toLowerCase().replace(/["']/g, '').split(',').map(s => s.trim()).join('|');
}

/** Fonts that are proprietary / licensed-per-domain. The rebuild won't have
 * them loaded (no @font-face) unless the team licenses + serves them. So
 * pixel-level rendering will always differ between live and rebuild for
 * components using these fonts — pixelDiff dimension is unreliable. */
const PROPRIETARY_FONTS = new Set([
  'helveticanowdisplay', 'helveticanowtext', 'helveticanowmicro',
]);

function detectFontSubstitution(
  ref: Node, ren: Node,
  refRoot?: { firstFont?: string; fontLoaded?: boolean },
  renRoot?: { firstFont?: string; fontLoaded?: boolean }
): { substituted: boolean; refFont?: string; renFont?: string; reason?: string } {
  // Strongest signal: document.fonts.check() captured at page level. If the
  // ref says "font is loaded" and rendered says "font is NOT loaded" (or
  // vice-versa), the rendering will differ even when fontFamily strings match.
  if (refRoot?.fontLoaded !== undefined && renRoot?.fontLoaded !== undefined
      && refRoot.fontLoaded !== renRoot.fontLoaded) {
    return {
      substituted: true,
      refFont: `${refRoot.firstFont} (loaded=${refRoot.fontLoaded})`,
      renFont: `${renRoot.firstFont} (loaded=${renRoot.fontLoaded})`,
      reason: 'fontLoaded differs',
    };
  }

  // Secondary signal: fontFamily cascade strings differ.
  const refLeaves = flattenAll(ref).filter(x => x.node.text != null);
  const renLeaves = flattenAll(ren).filter(x => x.node.text != null);
  const n = Math.min(refLeaves.length, renLeaves.length);
  for (let i = 0; i < n; i++) {
    const refFF = normalizeFontStack((refLeaves[i].node.computed as any).fontFamily);
    const renFF = normalizeFontStack((renLeaves[i].node.computed as any).fontFamily);
    if (refFF && renFF && refFF !== renFF) {
      return {
        substituted: true,
        refFont: (refLeaves[i].node.computed as any).fontFamily?.split(',').slice(0, 2).join(', '),
        renFont: (renLeaves[i].node.computed as any).fontFamily?.split(',').slice(0, 2).join(', '),
        reason: 'fontFamily cascade differs',
      };
    }
  }

  // Tertiary signal: first font is in the known-proprietary list. Even if
  // document.fonts.check() returns true on the developer's machine (because
  // the font is system-installed), the live site relies on @font-face served
  // from its domain — the rebuild doesn't have it. Treat as substituted to
  // skip pixelDiff on these components.
  const refFirst = (refRoot?.firstFont || '').toLowerCase();
  if (PROPRIETARY_FONTS.has(refFirst)) {
    return {
      substituted: true,
      refFont: refRoot?.firstFont,
      renFont: renRoot?.firstFont,
      reason: 'proprietary font family — rebuild lacks @font-face',
    };
  }

  return { substituted: false };
}

function scoreDomStructural(ref: Node, ren: Node) {
  const refTree = tagTree(ref);
  const renTree = tagTree(ren);
  return { score: refTree === renTree ? 1 : 0, refTree, renTree, pass: refTree === renTree };
}

/** Normalize a CSS color string to canonical "rgba(r,g,b,a)" form so that
 * equivalent values in different notations compare as equal.
 *
 * Handles:
 *   - rgb()/rgba() — both legacy `r, g, b, a` and modern `r g b / a` syntaxes.
 *   - oklab(L A B / alpha) — narrow fast-path for pure black (L≈0, A≈0,
 *     B≈0) and pure white (L≈1, A≈0, B≈0). These are the common Tailwind v4
 *     outputs for `text-black/N` and `text-white/N`. Intermediate gray
 *     values fall through to string compare so real differences surface
 *     (collapsing the whole gray ramp would risk false PASSes when both
 *     sides emit different oklab grays).
 *   - oklch(L C H / alpha) — same narrow fast-path: black at L≈0,C≈0 and
 *     white at L≈1,C≈0 (chroma is irrelevant when L is at either extreme).
 *   - hex (#rgb, #rrggbb, #rrggbbaa).
 *
 * Falls back to the original string when parsing fails or the value isn't
 * one of the recognized notations. The fallback is intentional: harness
 * mismatches surface non-obvious cases rather than silently masking them.
 *
 * For full chromatic oklab/oklch support, plug in a real colorspace library
 * (e.g., `culori` or `colorjs.io`); the narrow fast-path here is a deliberate
 * minimum that avoids false positives at the cost of some real mismatches
 * on intermediate grays.
 */
function normalizeColor(v?: string): string {
  if (!v) return '';
  const s = v.trim();
  // rgb/rgba — supports both `rgb(0, 0, 0)` legacy and `rgb(0 0 0 / 0.5)` modern.
  const rgbMatch = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*|\s+)([\d.]+)?\s*\)$/i);
  if (rgbMatch) {
    const r = Math.round(parseFloat(rgbMatch[1]));
    const g = Math.round(parseFloat(rgbMatch[2]));
    const b = Math.round(parseFloat(rgbMatch[3]));
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return `rgba(${r},${g},${b},${a.toFixed(3)})`;
  }
  // Plain rgb(r, g, b) / rgb(r g b) without alpha.
  const rgbNoAlpha = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*\)$/i);
  if (rgbNoAlpha) {
    const r = Math.round(parseFloat(rgbNoAlpha[1]));
    const g = Math.round(parseFloat(rgbNoAlpha[2]));
    const b = Math.round(parseFloat(rgbNoAlpha[3]));
    return `rgba(${r},${g},${b},${(1).toFixed(3)})`;
  }
  // oklab(L A B / alpha) — narrow fast-path for pure black and pure white
  // ONLY. Intermediate grays fall through to string compare so they surface
  // as mismatches rather than silently passing.
  const oklabMatch = s.match(/^oklab\(\s*([\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i);
  if (oklabMatch) {
    const L = parseFloat(oklabMatch[1]);
    const A = parseFloat(oklabMatch[2]);
    const B = parseFloat(oklabMatch[3]);
    const alpha = oklabMatch[4] !== undefined ? parseFloat(oklabMatch[4]) : 1;
    if (Math.abs(A) < 0.001 && Math.abs(B) < 0.001) {
      if (L < 0.01) return `rgba(0,0,0,${alpha.toFixed(3)})`;
      if (L > 0.99) return `rgba(255,255,255,${alpha.toFixed(3)})`;
    }
  }
  // oklch(L C H / alpha) — same narrow black/white fast-path. C≈0 means
  // achromatic; combined with L at either extreme reduces to black/white.
  const oklchMatch = s.match(/^oklch\(\s*([\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i);
  if (oklchMatch) {
    const L = parseFloat(oklchMatch[1]);
    const C = parseFloat(oklchMatch[2]);
    const alpha = oklchMatch[4] !== undefined ? parseFloat(oklchMatch[4]) : 1;
    if (Math.abs(C) < 0.001) {
      if (L < 0.01) return `rgba(0,0,0,${alpha.toFixed(3)})`;
      if (L > 0.99) return `rgba(255,255,255,${alpha.toFixed(3)})`;
    }
  }
  // Hex shortform (#rgb / #rrggbb / #rrggbbaa).
  const hexMatch = s.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const expand = (h: string) => h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const full = expand(hex);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    const a = full.length >= 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1;
    return `rgba(${r},${g},${b},${a.toFixed(3)})`;
  }
  return s;
}

const COLOR_PROPS = new Set(['color', 'backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']);

function valuesMatch(prop: string, refV: string | undefined, renV: string | undefined): boolean {
  if (refV === renV) return true;
  if (COLOR_PROPS.has(prop)) return normalizeColor(refV) === normalizeColor(renV);
  return false;
}

function scoreComputedCss(ref: Node, ren: Node) {
  const refLeaves = flattenAll(ref);
  const renLeaves = flattenAll(ren);
  const n = Math.min(refLeaves.length, renLeaves.length);
  let total = 0; let matched = 0;
  const mismatches: any[] = [];
  for (let i = 0; i < n; i++) {
    const r = refLeaves[i].node.computed;
    const c = renLeaves[i].node.computed;
    for (const p of VISIBLE_PROPS) {
      total++;
      if (valuesMatch(p, r[p], c[p])) matched++;
      else mismatches.push({ path: refLeaves[i].path.join('>'), prop: p, ref: r[p], rendered: c[p] });
    }
  }
  return { score: total === 0 ? 1 : matched / total, propsTotal: total, propsMatched: matched, mismatches: mismatches.slice(0, 30) };
}

function scoreA11y(ref: A11y, ren: A11y) {
  const refH = ref.headings.map(h => h.level).join(',');
  const renH = ren.headings.map(h => h.level).join(',');
  const headingsMatch = refH === renH;
  // Alt comparison: rendered should have at LEAST as many imgs with alt as
  // reference. Rendered improving on the live site (e.g. live img has no
  // alt attr but rendered has alt="" marking it decorative) is allowed —
  // this is an a11y upgrade, not a regression.
  const refAltCount = ref.imgs.filter(i => i.hasAlt).length;
  const renAltCount = ren.imgs.filter(i => i.hasAlt).length;
  const altsMatch = renAltCount >= refAltCount;
  const score = headingsMatch && altsMatch ? 1 : 0;
  return { score, refHeadings: refH, renHeadings: renH, headingsMatch, refAltCount, renAltCount, altsMatch };
}

async function scorePixel(refPath: string, renPath: string, refBbox: any, renBbox: any) {
  const sharp = (await import('sharp')).default;
  const { PNG } = await import('pngjs');
  const pixelmatch = (await import('pixelmatch')).default;

  const w = Math.min(refBbox.w, renBbox.w);
  const h = Math.min(refBbox.h, renBbox.h);
  const cropToBuffer = async (path: string, bbox: any) =>
    await sharp(path).extract({ left: bbox.x, top: bbox.y, width: w, height: h }).png().toBuffer();

  try {
    const refBuf = await cropToBuffer(refPath, refBbox);
    const renBuf = await cropToBuffer(renPath, renBbox);
    const refPng = PNG.sync.read(refBuf);
    const renPng = PNG.sync.read(renBuf);
    const diff = new PNG({ width: w, height: h });
    const diffPixels = pixelmatch(refPng.data, renPng.data, diff.data, w, h, { threshold: 0.1, includeAA: true });
    const totalPixels = w * h;
    return { score: diffPixels / totalPixels, diffPixels, totalPixels, bboxUsed: { w, h } };
  } catch (e) {
    return { score: 1, error: String(e) };
  }
}

export async function score(opts: {
  refDomPath: string;
  refPngPath: string;
  renDomPath: string;
  renPngPath: string;
  outPath?: string;
  /** Skip pixelDiff dimension entirely. Use when pixel-level rendering is
   * inherently unreliable for the component (e.g., webfont with cross-domain
   * hinting variance — both sides load the same family with same computed
   * CSS, but pixelmatch still reports >2% diff from antialiasing alone). */
  skipPixelDiff?: boolean;
}) {
  const ref: Capture = JSON.parse(readFileSync(opts.refDomPath, 'utf8'));
  const ren: Capture = JSON.parse(readFileSync(opts.renDomPath, 'utf8'));

  const dom = scoreDomStructural(ref.dom, ren.dom);
  const css = scoreComputedCss(ref.dom, ren.dom);
  const a11y = scoreA11y(ref.a11y, ren.a11y);
  const fontSub = detectFontSubstitution(
    ref.dom, ren.dom,
    { firstFont: (ref as any).firstFont, fontLoaded: (ref as any).fontLoaded },
    { firstFont: (ren as any).firstFont, fontLoaded: (ren as any).fontLoaded }
  );

  // Skip pixelDiff if either auto-detected font-substitution OR the fixture
  // explicitly opted out (skipPixelDiff). Both reuse the same no-pixel
  // weighting and aggregate path.
  const skipPixel = fontSub.substituted || !!opts.skipPixelDiff;
  const skipReason = fontSub.substituted ? 'font-substitution' : 'fixture skipPixelDiff flag';

  let pixel: any = { skipped: true, reason: skipReason, refFont: fontSub.refFont, renFont: fontSub.renFont };
  // pixel.score from scorePixel() is the DIFF fraction (0 = perfect, 1 = total
  // mismatch). The aggregate calculation needs the inverse — match fraction —
  // so we keep that under a clearly named local. The stored pixel.score in the
  // output JSON keeps the diff-fraction convention (display layers must invert
  // for "% match" output).
  let pixelMatchFraction = 1;
  if (!skipPixel) {
    pixel = await scorePixel(opts.refPngPath, opts.renPngPath, ref.bbox, ren.bbox);
    pixelMatchFraction = Math.max(0, 1 - pixel.score);
  }

  const aggregate = skipPixel
    ? dom.score * WEIGHTS_NO_PIXEL.domStructural + css.score * WEIGHTS_NO_PIXEL.computedCss + a11y.score * WEIGHTS_NO_PIXEL.a11yTree
    : dom.score * WEIGHTS_FULL.domStructural + css.score * WEIGHTS_FULL.computedCss + a11y.score * WEIGHTS_FULL.a11yTree + pixelMatchFraction * WEIGHTS_FULL.pixelDiff;

  const passes = {
    domStructural: dom.score >= 1.0,
    computedCss:   css.score >= 0.99,
    a11yTree:      a11y.score >= 1.0,
    pixelDiff:     skipPixel ? 'skipped' as const : pixel.score <= 0.02,
    aggregate:     aggregate >= 0.98,
  };
  const allPass = passes.domStructural && passes.computedCss && passes.a11yTree && passes.aggregate
    && (skipPixel ? true : passes.pixelDiff === true);

  const out = {
    slug: ref.slug, breakpoint: ref.breakpoint, scoredAt: new Date().toISOString(),
    aggregate: Number(aggregate.toFixed(4)),
    passes, allPass,
    fontSubstitution: fontSub,
    pixelSkipped: skipPixel ? { skipped: true, reason: skipReason } : undefined,
    dimensions: {
      domStructural: dom,
      computedCss: { score: Number(css.score.toFixed(4)), propsTotal: css.propsTotal, propsMatched: css.propsMatched, mismatches: css.mismatches },
      a11yTree: a11y,
      pixelDiff: pixel,
    },
    weights: skipPixel ? WEIGHTS_NO_PIXEL : WEIGHTS_FULL,
  };

  if (opts.outPath) {
    mkdirSync(dirname(opts.outPath), { recursive: true });
    writeFileSync(opts.outPath, JSON.stringify(out, null, 2));
  }
  return out;
}
