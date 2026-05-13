#!/usr/bin/env -S npx tsx
/**
 * Page inspector — given a URL, identifies unique UI patterns on the page
 * and reports which are covered by existing src/components/*.tsx.
 *
 * Algorithm:
 *   1. Walk DOM, collect candidate elements (sections, layout containers,
 *      anything that "looks like a component").
 *   2. For each candidate, compute a structural signature:
 *      `<tag>.{sorted-classes}[child-tags]`.
 *   3. Cluster candidates by signature; one cluster = one pattern.
 *   4. Read every `src/components/*.tsx`, extract the wrapper className.
 *   5. For each cluster, fuzzy-match against components by class overlap.
 *   6. Report: pattern signature, occurrence count, status (covered or not),
 *      sample bbox.
 *
 * Usage:
 *   npx tsx src/inspect.ts <url> [--components-dir=../../src/components]
 */

import { chromium } from 'playwright';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';

type Candidate = {
  signature: string;
  tag: string;
  classes: string[];
  childTags: string[];
  bbox: { x: number; y: number; w: number; h: number };
  textSample: string;
};

type Cluster = {
  signature: string;
  count: number;
  sample: Candidate;
};

type ComponentInfo = {
  name: string;
  filePath: string;
  rootTag: string;
  rootClasses: string[];
};

const evalBody = `
  () => {
    const SKIP_CLASSES = ['transition','duration-200','ease-in-out','group-hover:opacity-0',
      'opacity-85','absolute','top-0','bottom-0','left-0','right-0','inset-0','z-1','z-10'];
    const isLayoutClass = function (c) {
      return /^(flex|grid|container|max-w-|w-|h-|min-h|p[trblxy]?-|m[trblxy]?-|justify-|items-|gap-|space-|bg-|border)/.test(c);
    };
    const interesting = function (el) {
      if (el.children.length === 0) return false;
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') return false;
      const cls = ((el.getAttribute && el.getAttribute('class')) || '').split(/\\s+/).filter(Boolean);
      if (cls.length === 0) return false;
      // Has at least one layout-relevant class
      if (!cls.some(isLayoutClass)) return false;
      const r = el.getBoundingClientRect();
      // Skip tiny elements
      if (r.width < 100 || r.height < 50) return false;
      return true;
    };
    const candidates = [];
    const all = document.querySelectorAll('*');
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      if (!interesting(el)) continue;
      const classes = ((el.getAttribute && el.getAttribute('class')) || '').split(/\\s+/).filter(function (c) {
        return c.length > 0 && !SKIP_CLASSES.includes(c);
      }).sort();
      const childTags = Array.from(el.children).map(function (c) { return c.tagName.toLowerCase(); });
      const r = el.getBoundingClientRect();
      candidates.push({
        signature: el.tagName.toLowerCase() + '.' + classes.join('.') + '[' + childTags.join(',') + ']',
        tag: el.tagName.toLowerCase(),
        classes: classes,
        childTags: childTags,
        bbox: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
        textSample: (el.textContent || '').trim().slice(0, 60).replace(/\\s+/g, ' '),
      });
    }
    return candidates;
  }
`;

function clusterBySignature(candidates: Candidate[]): Cluster[] {
  const byKey: Record<string, Cluster> = {};
  for (const c of candidates) {
    const key = c.signature;
    if (!byKey[key]) byKey[key] = { signature: key, count: 0, sample: c };
    byKey[key].count++;
  }
  return Object.values(byKey).sort((a, b) => b.count - a.count);
}

function readComponents(dir: string): ComponentInfo[] {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter(f => f.endsWith('.tsx'));
  const result: ComponentInfo[] = [];
  for (const f of files) {
    const filePath = `${dir}/${f}`;
    const src = readFileSync(filePath, 'utf8');
    // naïve: find first className="..." in the JSX
    const match = src.match(/<(\w+)[^>]*\s+className="([^"]*)"/);
    if (!match) continue;
    result.push({
      name: basename(f, '.tsx'),
      filePath,
      rootTag: match[1].toLowerCase(),
      rootClasses: match[2].split(/\s+/).filter(Boolean),
    });
  }
  return result;
}

/** Jaccard-like overlap between two class sets (ignoring responsive prefixes
 * and arbitrary values for fuzzy matching). */
function overlap(a: string[], b: string[]): number {
  const norm = (c: string) => c.split(':').pop()!.replace(/\[[^\]]+\]/, '[]');
  const A = new Set(a.map(norm));
  const B = new Set(b.map(norm));
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

function matchCluster(c: Cluster, comps: ComponentInfo[]): { name: string; score: number } | null {
  let best: { name: string; score: number } | null = null;
  for (const comp of comps) {
    if (comp.rootTag !== c.sample.tag) continue;
    const score = overlap(c.sample.classes, comp.rootClasses);
    if (score > 0.5 && (!best || score > best.score)) best = { name: comp.name, score };
  }
  return best;
}

const url = process.argv[2];
if (!url) {
  console.error('usage: npx tsx src/inspect.ts <url> [--components-dir=PATH]');
  process.exit(1);
}
const compsArg = process.argv.find(a => a.startsWith('--components-dir='));
const compsDir = compsArg ? compsArg.split('=')[1] : resolve(process.cwd(), '../../src/components');

console.log(`\ninspecting: ${url}`);
console.log(`components: ${compsDir}\n`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const candidatesRaw: any = await page.evaluate(`(${evalBody})()`);
await browser.close();
const candidates: Candidate[] = Array.isArray(candidatesRaw) ? candidatesRaw : [];
if (!Array.isArray(candidatesRaw)) {
  console.error('evaluate returned non-array:', candidatesRaw);
  process.exit(1);
}

const clusters = clusterBySignature(candidates);
const comps = readComponents(compsDir);

console.log(`${candidates.length} candidate elements → ${clusters.length} unique patterns`);
console.log(`${comps.length} existing components in ${compsDir}\n`);

let covered = 0;
const top = clusters.slice(0, 25);

console.log('rank  count  status   pattern (sample bbox · sample text)');
console.log('────  ─────  ───────  ─────────────────────────────────────────');
for (let i = 0; i < top.length; i++) {
  const c = top[i];
  const match = matchCluster(c, comps);
  const status = match ? `✓ ${match.name}` : '✗ NEW    ';
  if (match) covered++;
  const sigShort = c.signature.length > 80 ? c.signature.slice(0, 77) + '...' : c.signature;
  console.log(
    String(i + 1).padStart(4) + '  ' +
    String(c.count).padStart(5) + '  ' +
    status.padEnd(20) + '  ' +
    sigShort
  );
  console.log(' '.repeat(42) + `${c.sample.bbox.w}×${c.sample.bbox.h}px · "${c.sample.textSample}"`);
}

console.log(`\ncoverage: ${covered}/${top.length} top patterns matched`);
console.log(`\nNEW patterns (not covered) — capture these to add to src/components/:`);
for (const c of top) {
  if (!matchCluster(c, comps)) {
    console.log(`  ${c.sample.tag}.{${c.sample.classes.slice(0, 4).join(',')}${c.sample.classes.length > 4 ? ',...' : ''}}  — "${c.sample.textSample}"`);
  }
}
