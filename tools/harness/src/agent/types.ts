/**
 * Agent provider contract for the convergence loop.
 *
 * The loop calls `propose()` with the current TSX/HTML state and the
 * structured diff against the reference. The agent returns the next
 * iteration's content. The loop scores it and decides whether to accept.
 *
 * Providers swap behind this interface — the loop logic is provider-agnostic.
 */

export type DiffMismatch = {
  path: string;       // e.g. "div>h4"
  prop: string;       // e.g. "color"
  ref: string;        // expected value
  rendered: string;   // observed value
};

export type AgentInput = {
  componentName: string;
  iteration: number;
  /** Current TSX source (what the rebuild emits). */
  currentTsx: string;
  /** Structured per-element CSS mismatches from the harness. */
  mismatches: DiffMismatch[];
  /** Pass/fail per dimension. */
  dimensions: {
    domStructural: boolean;
    computedCss: boolean;
    a11yTree: boolean;
    pixelDiff: boolean | 'skipped';
  };
  /** Path to the recovered Tailwind config (for utility lookup). */
  tailwindConfigPath?: string;
  /** Path to the legacy CSS inventory. */
  legacyInventoryPath?: string;
};

export type AgentOutput = {
  /** New TSX source. The loop writes this to disk and re-renders. */
  nextTsx: string;
  /** Optional commentary about what the agent changed and why. */
  rationale?: string;
  /** Optional cost telemetry. */
  tokens?: { input: number; output: number };
};

export interface AgentProvider {
  name: string;
  propose(input: AgentInput): Promise<AgentOutput>;
}
