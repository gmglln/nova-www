#!/usr/bin/env -S npx tsx
/**
 * fidelity-harness CLI
 *
 *   harness validate <component.json>           — one-shot capture + score
 *   harness converge <component.json> [--agent stub|synthetic|anthropic]
 *                                                — ralph loop with cap
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { capture } from './capture.ts';
import { score } from './score.ts';
import { converge } from './loop.ts';
import { stubAgent } from './agent/stub.ts';
import { syntheticAgent } from './agent/synthetic.ts';
import { anthropicAgent } from './agent/anthropic.ts';
import type { AuthFlow } from './types.ts';

type ComponentConfig = {
  slug: string;
  /** Default selector used by both ref and ren. Can be overridden per-side
   * with `referenceSelector` / `renderedSelector` — useful when the live
   * page has CSP / SW / React reconciliation that prevents the setupScript
   * from tagging an element with id, so we must select it by its native
   * class signature instead. */
  selector: string;
  referenceSelector?: string;
  renderedSelector?: string;
  breakpoints: number[];
  referenceUrl: string;
  renderedUrl: string;
  referenceSetup?: string;
  renderedSetup?: string;
  /** Login flow for the reference (live) side. Use when the target is behind
   * an auth wall. Rendered side is localhost so it almost never needs auth. */
  referenceAuth?: AuthFlow;
  renderedAuth?: AuthFlow;
  /** Path to the rendered-side source file the converge loop rewrites. */
  renderedSourcePath?: string;
  /** Skip pixelDiff dimension. Use when pixel-level rendering is inherently
   * unreliable for the component (font hinting variance, etc.). */
  skipPixelDiff?: boolean;
};

const [, , cmd, configArg, ...rest] = process.argv;
if ((cmd !== 'validate' && cmd !== 'converge') || !configArg) {
  console.error('usage: npx tsx src/cli.ts (validate|converge) <component.json> [--agent stub|synthetic|anthropic]');
  process.exit(1);
}

const config: ComponentConfig = JSON.parse(readFileSync(resolve(configArg), 'utf8'));
const root = process.cwd();

if (cmd === 'converge') {
  const agentArgIdx = rest.indexOf('--agent');
  const agentName = agentArgIdx >= 0 ? rest[agentArgIdx + 1] : 'stub';
  const agent = agentName === 'synthetic' ? syntheticAgent
    : agentName === 'anthropic' ? anthropicAgent
    : stubAgent;
  if (!config.renderedSourcePath) {
    console.error('converge requires `renderedSourcePath` in the component config');
    process.exit(1);
  }
  const bp = config.breakpoints[0];
  const historyDir = `${root}/validation/${config.slug}/converge-${bp}`;
  mkdirSync(historyDir, { recursive: true });
  console.log(`\n=== converge ${config.slug} @${bp} (agent=${agent.name}, cap=5) ===\n`);
  const result = await converge({
    slug: config.slug,
    selector: config.selector,
    breakpoint: bp,
    referenceUrl: config.referenceUrl,
    renderedUrl: config.renderedUrl,
    referenceSetup: config.referenceSetup,
    renderedSetup: config.renderedSetup,
    referenceAuth: config.referenceAuth,
    renderedAuth: config.renderedAuth,
    renderedSourcePath: resolve(config.renderedSourcePath),
    historyDir,
    agent,
  });
  for (const h of result.history) {
    console.log(`  iter ${h.iteration}  agg=${(h.aggregate * 100).toFixed(2)}%  ${JSON.stringify(h.perDimension)}${h.rationale ? '  → ' + h.rationale : ''}`);
  }
  console.log(`\n${result.accepted ? '✓ ACCEPTED' : '✗ ' + result.reason} after ${result.iterations} iteration(s)  final agg ${(result.finalAggregate * 100).toFixed(2)}%`);
  process.exit(result.accepted ? 0 : 1);
}

const refDir = `${root}/validation/${config.slug}/reference`;
const renDir = `${root}/validation/${config.slug}/rendered`;
const scoreDir = `${root}/validation/${config.slug}/scores`;
mkdirSync(refDir, { recursive: true });
mkdirSync(renDir, { recursive: true });
mkdirSync(scoreDir, { recursive: true });

console.log(`\n=== ${config.slug} ===`);
console.log(`reference:   ${config.referenceUrl}`);
console.log(`rendered:    ${config.renderedUrl}`);
console.log(`selector:    ${config.selector}`);
console.log(`breakpoints: ${config.breakpoints.join(', ')}\n`);

let allPass = true;
const summary: Record<number, any> = {};

for (const bp of config.breakpoints) {
  console.log(`-- @${bp} --`);
  // sequential: reference first (so live ndc-md.org isn't hit twice in parallel), then rendered
  const refSel = config.referenceSelector ?? config.selector;
  const renSel = config.renderedSelector ?? config.selector;
  await capture({ url: config.referenceUrl, slug: config.slug, breakpoint: bp, selector: refSel, outDir: refDir, setupScript: config.referenceSetup, auth: config.referenceAuth });
  await capture({ url: config.renderedUrl, slug: config.slug, breakpoint: bp, selector: renSel, outDir: renDir, setupScript: config.renderedSetup, auth: config.renderedAuth });

  const result = await score({
    refDomPath: `${refDir}/${config.slug}-${bp}.dom.json`,
    refPngPath: `${refDir}/${config.slug}-${bp}.png`,
    renDomPath: `${renDir}/${config.slug}-${bp}.dom.json`,
    renPngPath: `${renDir}/${config.slug}-${bp}.png`,
    outPath:    `${scoreDir}/${config.slug}-${bp}.score.json`,
    skipPixelDiff: config.skipPixelDiff,
  });

  summary[bp] = result.aggregate;
  const tag = result.allPass ? '✓' : '✗';
  const pixelSkipped = result.fontSubstitution.substituted || result.pixelSkipped;
  const pixelStatus = pixelSkipped
    ? `pixel ⊘ (${result.fontSubstitution.substituted ? 'font sub' : 'fixture skip'})`
    : `pixel ${((1 - result.dimensions.pixelDiff.score) * 100).toFixed(1)}% match`;
  console.log(`   ${tag} aggregate ${(result.aggregate * 100).toFixed(2)}%  DOM ${result.dimensions.domStructural.score} CSS ${result.dimensions.computedCss.score} a11y ${result.dimensions.a11yTree.score} ${pixelStatus}`);
  if (!result.allPass) allPass = false;
}

console.log(`\n${allPass ? '✓ PASS' : '✗ FAIL'} — ${config.slug}`);
process.exit(allPass ? 0 : 1);
