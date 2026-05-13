import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AgentProvider, AgentInput, AgentOutput } from './types.ts';

/**
 * Anthropic provider — calls Claude with the current TSX + structured
 * mismatch list, asks for a corrected TSX. Single-turn, plain text I/O.
 *
 * Activation: set ANTHROPIC_API_KEY in env.
 *   ANTHROPIC_API_KEY=sk-... npx tsx src/cli.ts converge fixtures/<slug>.json --agent anthropic
 *
 * Model choice: claude-sonnet-4-6 — Sonnet handles targeted className edits
 * well with low latency. Switch to opus for complex layout-context fixes.
 */

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are a Tailwind CSS expert helping rebuild a website with bit-perfect fidelity to the live reference.

You receive:
- The current React component source (TSX)
- A list of computed-CSS mismatches between the live reference and the rendered rebuild
- Each mismatch tells you the element path, CSS property, the live's value, and the rebuild's value

Your job: edit the TSX className attributes (or wrapper HTML structure if absolutely required) so the rebuild's computed CSS matches the live. Prefer Tailwind utility classes from the project's recovered config. When a value isn't in the standard scale, use arbitrary-value syntax \`leading-[26px]\`, \`tracking-[0.5px]\`, etc.

Common patterns:
- \`lineHeight\` mismatch → add \`leading-X\` or \`leading-[Npx]\`
- \`letterSpacing\` mismatch → add \`tracking-X\` or \`tracking-[Npx]\`
- \`marginBottom\` mismatch → add \`mb-X\`
- \`fontSize\` mismatch → add \`text-X\` (the rebuild's tailwind config uses single-string fontSize values, no paired line-height)
- \`color\` or \`backgroundColor\` mismatch → use brand tokens (\`text-brand-orange\` etc.) when the value matches a brand color

Output format: respond with ONLY the updated TSX inside a fenced code block:
\`\`\`tsx
<the entire updated component source>
\`\`\`
Then on a new line a one-sentence rationale starting with "Rationale:". No other prose.`;

function buildUserPrompt(input: AgentInput): string {
  const mismatchTable = input.mismatches
    .map(m => `  ${m.path.padEnd(30)} ${m.prop.padEnd(18)} ref=${m.ref}  rendered=${m.rendered}`)
    .join('\n');

  const passLines = Object.entries(input.dimensions)
    .map(([dim, pass]) => `  ${dim}: ${pass === true ? 'PASS' : pass === false ? 'FAIL' : pass}`)
    .join('\n');

  return `Component: ${input.componentName}
Iteration: ${input.iteration}

Per-dimension status:
${passLines}

CSS mismatches:
${mismatchTable || '  (none — likely structural or a11y issue)'}

Current TSX:
\`\`\`tsx
${input.currentTsx}
\`\`\`

Return the updated TSX in a fenced \`\`\`tsx block, followed by a "Rationale:" line.`;
}

function extractTsx(text: string): { tsx: string; rationale?: string } {
  const fenceMatch = text.match(/```tsx\s*\n([\s\S]*?)```/);
  if (!fenceMatch) {
    throw new Error('anthropic agent: response had no ```tsx fenced block');
  }
  const tsx = fenceMatch[1].trimEnd() + '\n';
  const rationaleMatch = text.match(/Rationale:\s*(.+?)(?:\n|$)/);
  return { tsx, rationale: rationaleMatch?.[1]?.trim() };
}

export const anthropicAgent: AgentProvider = {
  name: 'anthropic',
  async propose(input: AgentInput): Promise<AgentOutput> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        'anthropic agent: ANTHROPIC_API_KEY not set — export it before running converge'
      );
    }

    const client = new Anthropic();
    const userPrompt = buildUserPrompt(input);

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('anthropic agent: response had no text content');
    }

    const { tsx, rationale } = extractTsx(textBlock.text);

    return {
      nextTsx: tsx,
      rationale,
      tokens: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    };
  },
};
