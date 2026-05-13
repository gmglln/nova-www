#!/usr/bin/env -S npx tsx
/**
 * Visual A/B viewer — generates a single HTML file showing the reference
 * (live) vs rendered (rebuild) screenshots side-by-side at each breakpoint,
 * with score / mismatch summary.
 *
 * Usage:
 *   npx tsx src/diff-viewer.ts <slug>                — single component
 *   npx tsx src/diff-viewer.ts <slug> <slug> ...     — combined index of N
 *   npx tsx src/diff-viewer.ts --combined <name> <slug> <slug> ...
 *                                                    — combined with custom name
 *
 * Reads:
 *   validation/<slug>/{reference,rendered}/<slug>-<bp>.png
 *   validation/<slug>/scores/<slug>-<bp>.score.json
 *
 * Writes:
 *   validation/<slug>/diff.html                      — single
 *   validation/<combinedName>.html                   — combined (default
 *                                                       combinedName = "combined")
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

type Score = {
  breakpoint: number;
  aggregate: number;
  passes: { domStructural: boolean; computedCss: boolean; a11yTree: boolean; pixelDiff: boolean | string; aggregate: boolean };
  allPass: boolean;
  fontSubstitution: { substituted: boolean; reason?: string; refFont?: string; renFont?: string };
  dimensions: {
    domStructural: { score: number };
    computedCss: { score: number; propsTotal: number; propsMatched: number; mismatches: Array<{ path: string; prop: string; ref: string; rendered: string }> };
    a11yTree: { score: number };
    pixelDiff: { score?: number; skipped?: boolean; reason?: string };
  };
};

const args = process.argv.slice(2);
let combinedName: string | null = null;
let slugs: string[];
const dashIdx = args.indexOf('--combined');
if (dashIdx >= 0) {
  combinedName = args[dashIdx + 1];
  slugs = args.filter((_, i) => i !== dashIdx && i !== dashIdx + 1);
  if (!combinedName || slugs.length === 0) {
    console.error('usage: npx tsx src/diff-viewer.ts --combined <name> <slug> <slug> ...');
    process.exit(1);
  }
} else {
  slugs = args;
}
if (slugs.length === 0) {
  console.error('usage: npx tsx src/diff-viewer.ts <slug> [<slug> ...] | --combined <name> <slug> ...');
  process.exit(1);
}

const pct = (n: number) => (n * 100).toFixed(2) + '%';
const tag = (pass: boolean) => pass ? '<span class="ok">PASS</span>' : '<span class="fail">FAIL</span>';

/** Render the per-breakpoint sections for a single slug. When `pathPrefix` is
 * set (combined mode), it's prepended to every image src so the combined HTML
 * (which lives one directory above the slug folders) can resolve relative
 * paths correctly. */
function renderSlug(slug: string, root: string, pathPrefix = ''): { html: string; scores: Score[] } {
  const scoresDir = `${root}/scores`;
  const scoreFiles = readdirSync(scoresDir).filter(f => f.endsWith('.score.json')).sort();
  const scores: Score[] = scoreFiles.map(f => JSON.parse(readFileSync(`${scoresDir}/${f}`, 'utf8')));

  const sections = scores.map(s => {
    const refPath = `${pathPrefix}reference/${slug}-${s.breakpoint}.png`;
    const renPath = `${pathPrefix}rendered/${slug}-${s.breakpoint}.png`;
    const pixelStatus = s.dimensions.pixelDiff.skipped
      ? `<span class="skip">⊘ ${s.dimensions.pixelDiff.reason ?? 'skipped'}</span>`
      : pct(1 - (s.dimensions.pixelDiff.score ?? 0)) + ' match';
    const mismatchRows = s.dimensions.computedCss.mismatches.map(m =>
      `<tr><td><code>${m.path}</code></td><td>${m.prop}</td><td><code>${m.ref}</code></td><td><code>${m.rendered}</code></td></tr>`
    ).join('\n');
    return `
      <section>
        <h3>@${s.breakpoint}px ${tag(s.allPass)} <small>aggregate ${pct(s.aggregate)}</small></h3>
        <div class="scores">
          <span>DOM ${pct(s.dimensions.domStructural.score)}</span>
          <span>CSS ${pct(s.dimensions.computedCss.score)} (${s.dimensions.computedCss.propsMatched}/${s.dimensions.computedCss.propsTotal})</span>
          <span>a11y ${pct(s.dimensions.a11yTree.score)}</span>
          <span>pixel ${pixelStatus}</span>
        </div>
        <div class="ab">
          <figure><figcaption>reference (live)</figcaption><img src="${refPath}" alt="ref @${s.breakpoint}"></figure>
          <figure><figcaption>rendered (rebuild)</figcaption><img src="${renPath}" alt="ren @${s.breakpoint}"></figure>
        </div>
        ${mismatchRows ? `<details><summary>${s.dimensions.computedCss.mismatches.length} CSS mismatches</summary>
          <table><thead><tr><th>path</th><th>prop</th><th>ref</th><th>rendered</th></tr></thead><tbody>${mismatchRows}</tbody></table>
        </details>` : ''}
      </section>
    `;
  }).join('\n');

  return { html: sections, scores };
}

const STYLES = `
  body { font: 14px/1.5 -apple-system, system-ui, sans-serif; margin: 0 auto; padding: 24px; background: #0e0e10; color: #ddd; max-width: 1600px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h1 small { color: #888; font-weight: normal; font-size: 14px; }
  h2 { font-size: 20px; margin: 40px 0 12px; padding: 16px 0 8px; border-top: 2px solid #444; }
  h2 .badge { font-size: 12px; padding: 2px 8px; border-radius: 3px; margin-left: 12px; vertical-align: middle; }
  h3 { font-size: 16px; margin: 24px 0 8px; padding-top: 12px; border-top: 1px solid #2a2a2e; font-weight: 500; }
  h3 small { color: #888; font-weight: normal; font-size: 13px; margin-left: 12px; }
  .ok { background: #1f5f3a; color: #b6f0c4; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600; }
  .fail { background: #6a1a1a; color: #fcb6b6; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600; }
  .skip { color: #aaa; }
  .scores { color: #aaa; font-size: 13px; margin-bottom: 12px; }
  .scores span { margin-right: 16px; }
  .ab { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  figure { margin: 0; background: #1a1a1d; border: 1px solid #2a2a2e; border-radius: 4px; padding: 8px; }
  figcaption { font-size: 12px; color: #888; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  img { width: 100%; height: auto; display: block; background: white; border-radius: 2px; }
  details { margin-top: 12px; }
  summary { cursor: pointer; color: #aaa; padding: 6px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
  th, td { padding: 6px 10px; text-align: left; border-bottom: 1px solid #2a2a2e; }
  th { color: #888; font-weight: normal; }
  code { font-family: ui-monospace, monospace; color: #e8e8e8; }
  nav.toc { background: #1a1a1d; border: 1px solid #2a2a2e; border-radius: 4px; padding: 12px 16px; margin-bottom: 16px; }
  nav.toc a { color: #b6f0c4; text-decoration: none; margin-right: 16px; font-size: 13px; }
  nav.toc a:hover { text-decoration: underline; }
`;

const cwd = process.cwd();
const ts = new Date().toISOString().slice(0, 16).replace('T', ' ');

if (slugs.length === 1 && combinedName === null) {
  // Single-slug mode — same behavior as before, writes to <slug>/diff.html
  const slug = slugs[0];
  const root = `${cwd}/validation/${slug}`;
  const { html: sections } = renderSlug(slug, root);
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${slug} — fidelity diff</title>
<style>${STYLES}</style>
</head>
<body>
<h1>${slug} <small>· fidelity diff · ${ts}</small></h1>
${sections}
</body>
</html>`;
  writeFileSync(`${root}/diff.html`, html);
  console.log(`✓ wrote validation/${slug}/diff.html`);
} else {
  // Combined mode — one HTML at validation/<combinedName>.html linking N slugs
  const name = combinedName ?? 'combined';
  const parts = slugs.map(slug => {
    const root = `${cwd}/validation/${slug}`;
    const { html, scores } = renderSlug(slug, root, `${slug}/`);
    const overallPass = scores.every(s => s.allPass);
    const minAggregate = Math.min(...scores.map(s => s.aggregate));
    return `
      <article id="${slug}">
        <h2>${slug}
          <span class="badge ${overallPass ? 'ok' : 'fail'}">${overallPass ? 'PASS' : 'FAIL'}</span>
          <small>min aggregate ${pct(minAggregate)} across ${scores.length} bps</small>
        </h2>
        ${html}
      </article>
    `;
  }).join('\n');
  const toc = `<nav class="toc">${slugs.map(s => `<a href="#${s}">${s}</a>`).join('')}</nav>`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${name} — fidelity diff</title>
<style>${STYLES}</style>
</head>
<body>
<h1>${name} <small>· fidelity diff · ${ts} · ${slugs.length} components</small></h1>
${toc}
${parts}
</body>
</html>`;
  writeFileSync(`${cwd}/validation/${name}.html`, html);
  console.log(`✓ wrote validation/${name}.html (${slugs.length} components)`);
}
