import type { AgentProvider, AgentInput, AgentOutput, DiffMismatch } from './types.ts';

/**
 * Deterministic "agent" used for self-tests. Walks the structured diff and
 * applies obvious fixes — for each mismatch it knows how to map back to a
 * Tailwind utility, it appends or replaces classes on the matching element.
 *
 * NOT a substitute for a real LLM: only handles a handful of common drifts
 * (color, font-weight, font-size, text-transform). Sufficient to prove the
 * loop machinery converges when the agent makes the right call.
 */

const COLOR_MAP: Record<string, string> = {
  'rgb(255, 255, 255)': 'text-white',
  'rgb(0, 0, 0)': 'text-black',
  'rgb(249, 157, 33)': 'text-brand-orange',
  'rgb(112, 191, 74)': 'text-brand-green',
};

const FONT_WEIGHT_MAP: Record<string, string> = {
  '200': 'font-extralight',
  '300': 'font-light',
  '400': 'font-normal',
  '500': 'font-medium',
  '600': 'font-semibold',
  '700': 'font-bold',
  '800': 'font-extrabold',
  '900': 'font-black',
};

const FONT_SIZE_MAP: Record<string, string> = {
  '14px': 'text-sm', '16px': 'text-base', '18px': 'text-lg',
  '20px': 'text-xl', '24px': 'text-2xl', '30px': 'text-3xl',
  '36px': 'text-4xl', '48px': 'text-5xl', '52px': 'text-5p5xl',
  '128px': 'text-7xl',
};

function utilityFor(prop: string, value: string): string | null {
  if (prop === 'color') return COLOR_MAP[value] ?? null;
  if (prop === 'fontWeight') return FONT_WEIGHT_MAP[value] ?? null;
  if (prop === 'fontSize') return FONT_SIZE_MAP[value] ?? null;
  if (prop === 'textTransform') return value === 'uppercase' ? 'uppercase' : null;
  if (prop === 'letterSpacing' && value !== 'normal') return `tracking-[${value}]`;
  if (prop === 'lineHeight' && value !== 'normal') return `leading-[${value}]`;
  return null;
}

/**
 * Find the className=" ... " block whose content is most likely to belong to
 * the path indicated by the mismatch. Heuristic — not a real JSX parser.
 *
 * For the synthetic agent we limit ourselves to single-element fixes: pick
 * the LAST className (deepest leaf) and patch it. For multi-leaf components
 * a real JSX parser or LLM does better — out of scope here.
 */
function patchClassname(tsx: string, addUtilities: string[]): string {
  if (addUtilities.length === 0) return tsx;
  // Match both JSX `className="..."` and HTML `class="..."`.
  const re = /\b(className|class)="([^"]*)"/g;
  const matches = [...tsx.matchAll(re)];
  if (matches.length === 0) return tsx;
  const last = matches[matches.length - 1];
  const attrName = last[1];
  const existing = last[2];
  const newClass = [existing, ...addUtilities].join(' ');
  return tsx.slice(0, last.index!) + `${attrName}="${newClass}"` + tsx.slice(last.index! + last[0].length);
}

export const syntheticAgent: AgentProvider = {
  name: 'synthetic',
  async propose(input: AgentInput): Promise<AgentOutput> {
    const additions = new Set<string>();
    for (const m of input.mismatches) {
      const u = utilityFor(m.prop, m.ref);
      if (u) additions.add(u);
    }
    const nextTsx = patchClassname(input.currentTsx, [...additions]);
    return {
      nextTsx,
      rationale: additions.size === 0
        ? 'synthetic agent — no mismatches with known utility mappings; no changes'
        : `synthetic agent — appended utilities to deepest className: ${[...additions].join(' ')}`,
    };
  },
};
