import type { AgentProvider, AgentInput, AgentOutput } from './types.ts';

/**
 * No-op agent. Returns the input TSX unchanged. Useful when you only want
 * to exercise the loop scaffolding without invoking an LLM (e.g., to verify
 * that iteration 0 = pass means the loop exits immediately).
 */
export const stubAgent: AgentProvider = {
  name: 'stub',
  async propose(input: AgentInput): Promise<AgentOutput> {
    return { nextTsx: input.currentTsx, rationale: 'stub agent — no-op' };
  },
};
