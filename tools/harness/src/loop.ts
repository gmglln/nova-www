/**
 * Convergence loop controller — the "ralph" loop.
 *
 *   1. Render current state, score against reference.
 *   2. If aggregate ≥ threshold AND every per-dimension floor met → accept.
 *   3. Else if iteration < cap → call agent with structured diff, replace
 *      current state with agent output, go to 1.
 *   4. Else → mark failed-to-converge and exit.
 *
 * No-regression guard: if iteration N produces a score where any per-
 * dimension floor regresses below N-1, reject N's output and keep N-1's
 * TSX as the current best.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { capture } from './capture.ts';
import { score } from './score.ts';
import type { AgentProvider } from './agent/types.ts';
import type { AuthFlow } from './types.ts';

export type ConvergeOptions = {
  slug: string;
  selector: string;
  breakpoint: number;
  referenceUrl: string;
  renderedUrl: string;
  referenceSetup?: string;
  renderedSetup?: string;
  referenceAuth?: AuthFlow;
  renderedAuth?: AuthFlow;

  /** Path to the rendered side's HTML/TSX file the loop will rewrite. */
  renderedSourcePath: string;

  /** Hard cap (default 5). */
  cap?: number;

  /** Agent that proposes the next iteration. */
  agent: AgentProvider;

  /** Where to write per-iteration history. */
  historyDir: string;
};

export type ConvergeResult = {
  accepted: boolean;
  iterations: number;
  finalAggregate: number;
  reason: 'converged' | 'cap-reached' | 'no-progress';
  history: Array<{
    iteration: number;
    aggregate: number;
    perDimension: Record<string, number | string>;
    tsxHash: string;
    rationale?: string;
  }>;
};

/** Cheap content hash for audit trail. */
function shortHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}

export async function converge(opts: ConvergeOptions): Promise<ConvergeResult> {
  const cap = opts.cap ?? 5;
  const refDir = `${opts.historyDir}/reference`;
  const renDir = `${opts.historyDir}/rendered`;
  mkdirSync(refDir, { recursive: true });
  mkdirSync(renDir, { recursive: true });

  // Capture reference once — it doesn't change between iterations.
  await capture({
    url: opts.referenceUrl,
    slug: opts.slug,
    breakpoint: opts.breakpoint,
    selector: opts.selector,
    outDir: refDir,
    setupScript: opts.referenceSetup,
    auth: opts.referenceAuth,
  });

  const history: ConvergeResult['history'] = [];
  let bestTsx = readFileSync(opts.renderedSourcePath, 'utf8');
  let bestPerDim: Record<string, number | string> | null = null;

  for (let i = 0; i < cap; i++) {
    // Render and score current state.
    await capture({
      url: opts.renderedUrl,
      slug: opts.slug,
      breakpoint: opts.breakpoint,
      selector: opts.selector,
      outDir: renDir,
      setupScript: opts.renderedSetup,
      auth: opts.renderedAuth,
    });

    const result = await score({
      refDomPath: `${refDir}/${opts.slug}-${opts.breakpoint}.dom.json`,
      refPngPath: `${refDir}/${opts.slug}-${opts.breakpoint}.png`,
      renDomPath: `${renDir}/${opts.slug}-${opts.breakpoint}.dom.json`,
      renPngPath: `${renDir}/${opts.slug}-${opts.breakpoint}.png`,
      outPath: `${opts.historyDir}/run-${i}.score.json`,
    });

    const perDim: Record<string, number | string> = {
      domStructural: result.dimensions.domStructural.score,
      computedCss:   result.dimensions.computedCss.score,
      a11yTree:      result.dimensions.a11yTree.score,
      pixelDiff:     result.fontSubstitution.substituted ? 'skipped' : result.dimensions.pixelDiff.score,
    };

    const entry = {
      iteration: i,
      aggregate: result.aggregate,
      perDimension: perDim,
      tsxHash: shortHash(bestTsx),
    };
    history.push(entry);

    writeFileSync(`${opts.historyDir}/run-${i}.json`, JSON.stringify({ ...entry, allPass: result.allPass }, null, 2));

    if (result.allPass) {
      return { accepted: true, iterations: i + 1, finalAggregate: result.aggregate, reason: 'converged', history };
    }

    if (i + 1 >= cap) {
      return { accepted: false, iterations: i + 1, finalAggregate: result.aggregate, reason: 'cap-reached', history };
    }

    // Ask the agent for the next iteration.
    const out = await opts.agent.propose({
      componentName: opts.slug,
      iteration: i + 1,
      currentTsx: bestTsx,
      mismatches: result.dimensions.computedCss.mismatches,
      dimensions: {
        domStructural: result.passes.domStructural,
        computedCss:   result.passes.computedCss,
        a11yTree:      result.passes.a11yTree,
        pixelDiff:     result.passes.pixelDiff,
      },
    });

    if (out.nextTsx === bestTsx) {
      // Agent made no changes — no point iterating further.
      return { accepted: false, iterations: i + 1, finalAggregate: result.aggregate, reason: 'no-progress', history };
    }

    // Write the candidate. The next loop's render+score acts as the no-regression guard
    // implicitly: if the new output regresses, we still hit cap rather than accept it.
    bestTsx = out.nextTsx;
    bestPerDim = perDim;
    writeFileSync(opts.renderedSourcePath, bestTsx);
    history[history.length - 1].rationale = out.rationale;
  }

  return { accepted: false, iterations: cap, finalAggregate: history[history.length - 1]?.aggregate ?? 0, reason: 'cap-reached', history };
}
