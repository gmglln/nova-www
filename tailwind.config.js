/**
 * Tailwind config for a fidelity-driven rebuild.
 *
 * Tokens are recovered from the live target via the harness
 * "config-recovery-by-failure" mechanism — each component capture surfaces
 * missing utilities, which get added here with the live's exact computed
 * values.
 *
 * Start empty on purpose. Wave 1 will surface the first 1-2 tokens; the
 * config grows wave by wave from there. Document each addition with a
 * `wave N — ComponentName` comment so future waves can trace back to
 * which capture introduced each token.
 *
 * Common patterns to expect (from prior rebuilds):
 *   - The live likely uses Tailwind v4 + CSS layers. Some computed values
 *     won't match v3 defaults out of the box:
 *       rounded-full   → 33554432px (Figma pill sentinel = 2^25)
 *       rounded-xl     → 16px (v3 default is 12px) — use rounded-2xl to match
 *       rounded-lg     → 12px (v3 default is 8px)  — use rounded-[12px]
 *       rounded-sm     → 8px  (v3 default is 2px)  — use rounded-[8px]
 *   - Opacity-modified colors (bg-primary/10, text-foreground/80) serialize
 *     as `oklab(...)` in v4 but `rgba(...)` in v3. Match exactly with
 *     arbitrary `bg-[oklab(...)]` classes.
 *   - <button> defaults to `font-weight: 500`, `display: block`, and
 *     `margin-bottom: 8px` from the live's CSS-layer rules. Add these
 *     classes preemptively to match without iteration.
 *   - <h2> = 20px/30px; <h3> = 18px/27px from CSS-layer rules. Use
 *     `text-xl leading-[30px]` and `text-lg leading-[27px]` respectively.
 *
 * See CLAUDE.md § Recurring patterns for the full catalog.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Wave 1+ will populate. Example:
        // primary: '#xxxxxx',
        // secondary: '#xxxxxx',
      },
    },
  },
  plugins: [],
};
