// Shared types for the harness.

/**
 * Declarative auth flow for capture targets behind a login wall.
 *
 * Runs Playwright actions (NOT page.evaluate) before the main capture, so it
 * can fill/click/wait at the test-runner level. Steps are executed in order
 * inside the same browser context, so cookies/storage from the login persist
 * for the subsequent capture.
 */
export type AuthStep =
  | { type: 'fill'; selector: string; value: string }
  | { type: 'click'; selector: string }
  | { type: 'press'; selector: string; key: string }
  | { type: 'waitForSelector'; selector: string; timeout?: number }
  | { type: 'waitForURL'; pattern: string; timeout?: number }
  | { type: 'waitForLoadState'; state?: 'load' | 'domcontentloaded' | 'networkidle' }
  | { type: 'waitForTimeout'; ms: number };

export type AuthFlow = {
  /** URL to navigate to before running steps. Defaults to the capture URL. */
  loginUrl?: string;
  steps: AuthStep[];
};

export type Computed = Record<string, string>;

export type Node = {
  tag: string;
  classes: string[];
  text: string | null;
  computed: Computed;
  children: Node[];
};

export type A11y = {
  headings: { level: number; text: string }[];
  landmarks: { tag: string; label: string | null }[];
  imgs: { alt: string | null; hasAlt: boolean; decorative: boolean }[];
};

export type Capture = {
  slug: string;
  breakpoint: number;
  capturedAt: string;
  sourceUrl: string;
  bbox: { x: number; y: number; w: number; h: number };
  dom: Node;
  a11y: A11y;
};
