# CLAUDE.md

Operational reference for Claude Code sessions in this repo. Skim this first; everything else is linked. Keep edits here terse — detail belongs in the file being linked.

## 1. Project overview

- **What:** template for fidelity-driven rebuilds. Clone to start rebuilding a new live URL into React, scoring each component against the live with a Playwright/pixelmatch harness in `tools/harness/`.
- **Target URL:** _Set in fixtures/multi-bp-configs as you wire each wave (e.g., `https://your-live-site.example/`)._
- **Stack:** Vite 5 + React 18 + TypeScript, Tailwind v3 (tokens recovered via the harness, config starts empty), Playwright + pixelmatch, sharp.
- **Methodology background:** `docs/research/02-cloning-tools.md`, `docs/research/03-recommended-pipeline.md`. Harness detail: `tools/harness/README.md`.

## 2. Workflow

### Branching

- **Never commit to `main` directly.** Always work on a descriptive branch (e.g., `wave-1-<slug>`, `harness-<extension>`, `tailwind-tokens-bootstrap`).
- PRs locally or merge directly into `main` per project preference.

### Dev / build

```bash
npm install
npm run dev            # http://localhost:5173 — landing scaffold until waves land
npm run build          # runs prebuild image optimization, then vite build
npm run optimize-images
```

### Harness

```bash
cd tools/harness
npm install && npx playwright install chromium

# capture
npx tsx src/capture-multi-bp.ts multi-bp-configs/<slug>.json .captures/<slug>.json

# validate (one-shot capture + score)
npx tsx src/cli.ts validate fixtures/<slug>.json

# convergence loop (auto-fix with LLM)
ANTHROPIC_API_KEY=sk-... npx tsx src/cli.ts converge fixtures/<slug>.json --agent anthropic
```

Detail: `tools/harness/README.md` — phases, scoring, agent providers, output paths.

### Spec-driven changes (optional)

`.claude/commands/opsx/` exposes the OpenSpec workflow (`/opsx:new`, `/opsx:explore`, `/opsx:ff`, `/opsx:apply`, `/opsx:verify`, `/opsx:archive`). Use when a change is large enough to warrant a spec; skip for single-component waves.

## 3. Architecture

### Routing — hash-based, zero deps

`src/App.tsx` reads `window.location.hash` and renders one isolation page per slug. Each captured component gets a `src/routes/<slug>.tsx` and a hash route, so the harness can hit `http://localhost:5173/#/<slug>` against the live URL at the same breakpoint. **More-specific routes must be registered before less-specific ones** (e.g., `/post-card-image` before `/post-card`) since matching uses `startsWith`.

### CMS — filesystem adapter

`src/lib/cms/adapter.ts`. Routes read content via the adapter; the adapter eager-loads JSON via `import.meta.glob('../../../content/<type>/*.json', { eager: true })`. Define content types as captures land. Swap implementation if/when a real CMS is chosen; the read interface stays stable.

### Harness — 5 phases

1. **DISCOVER** — `inspect.ts` clusters DOM by structural signature, ranks by frequency, fuzzy-matches `src/components/*`.
2. **CAPTURE** — `capture-multi-bp.ts` drives Playwright across breakpoints, triple-reads computed CSS (`computed` / `minusLegacy` / `stripped`).
3. **GENERATE** — emit React + Tailwind. The `dom-to-jsx-v4.ts` generator (if you have one) goes here; otherwise hand-write from the capture JSON.
4. **WIRE** — swap captured literals for props, add `id?: string` so the harness can target the wrapper, create isolation route + hash entry, write fixture.
5. **VALIDATE** — `cli.ts validate` scores 4 dimensions: domStructural (100%), computedCss (≥99%), a11yTree (100%), pixelDiff (≤2%). Aggregate ≥98% to accept. Pixel diff is auto-skipped on font substitution. Convergence loop (`cli.ts converge --agent anthropic`) feeds mismatches back to Claude for self-healing, capped at 5 iterations.

Full detail: `tools/harness/README.md`. CLI shape: `tools/harness/src/cli.ts` (`ComponentConfig` type at top). Capture types: `tools/harness/src/types.ts`.

## 4. Harness extensions (already wired in)

- **Auth wall (declarative `AuthFlow`)** — multi-bp-configs / fixtures accept an `auth` / `referenceAuth` field with declarative steps (`fill` / `click` / `press` / `waitForSelector` / `waitForURL` / `waitForLoadState` / `waitForTimeout`). Runs at the Playwright level before capture; cookies persist into the goto. Example flow for a magic-link form that accepts any email:
  ```json
  "auth": {
    "steps": [
      { "type": "fill", "selector": "input[type=email]", "value": "harness@test.local" },
      { "type": "click", "selector": "button[type=submit]" },
      { "type": "waitForTimeout", "ms": 2000 }
    ]
  }
  ```
- **Async setupScripts** — `capture.ts`'s wrapper IIFE is `async` and the setupScript call is awaited, so a setupScript that clicks a filter pill and waits for React to re-render before tagging the target works correctly.
- **lucide-react icon-order workaround** — if `lucide-react` ships icons whose SVG children order differs from the live's lucide build, hand-roll the icon inline with the live's order. The harness's `domStructural` check is order-sensitive. Past rebuilds needed this for `Users`, `Mail`, `Search`, `LogOut`.

## 5. Recurring patterns

These show up across rebuilds (especially when the live uses Tailwind v4 + CSS layers). Apply preemptively to save iteration.

### Live's CSS-layer rules for buttons (common)

- `<button>` default `font-weight: 500` → add `font-medium` to every button.
- `<button>` default `display: block` → add `block` to button classes (Tailwind v3 preflight defaults to `inline-block`).
- `<button>` typically gets a `margin-bottom: 8px` from CSS-layer rules. When stacked, prefer `mb-2` per child over `space-y-2` on the parent.

### Live's CSS-layer rules for typography (common)

- `<h2>` defaults to `font-size: 20px / line-height: 30px` → use `text-xl leading-[30px]` (v3's `text-xl` is 20px/28px).
- `<h3>` defaults to `font-size: 18px / line-height: 27px` → use `text-lg leading-[27px]` (v3's `text-lg` is 18px/28px).

### Tailwind v3 ↔ v4 token mismatches

- `rounded-full` on Figma sites computes to **33554432px** (Figma pill sentinel = 2^25). Use `rounded-[33554432px]` arbitrary value.
- `rounded-xl` on live often computes to **16px** (not v3's default 12px). Use `rounded-2xl` to match.
- `rounded-lg` on live often computes to **12px** (not v3's default 8px). Use `rounded-[12px]`.
- `rounded-sm` on live often computes to **8px** (not v3's default 2px). Use `rounded-[8px]`.
- Opacity-modified colors (`bg-primary/10`, `text-foreground/80`, etc.) serialize as `oklab(...)` in v4 and `rgba(...)` in v3 — visually identical but string-different to the harness. Use arbitrary `bg-[oklab(...)]` or `text-[oklab(...)]`. Probe the live's `getComputedStyle` to get the exact oklab values.

### Harness blind spots

- `boxShadow` is **not in PROPS** — shadow mismatches are invisible to scoring.
- `borderColor` is **not in PROPS** — `border-{tone}/N` opacity differences aren't checked.
- `background-image` (gradients) is not in PROPS — only `background-color` is. `bg-gradient-to-*` doesn't affect scoring directly.

### Validation pattern

- Always run `npm run dev` (port 5173) before `cli.ts validate` — the harness needs the rendered side reachable at `http://localhost:5173/#/<slug>`.
- Run validate from `tools/harness/` so artifacts go to the gitignored `tools/harness/validation/`. Running from repo root creates an untracked `validation/` at root.

## 6. Don'ts

- **Don't commit to `main`.** Always branch first.
- **Don't pre-seed `tailwind.config.js`** with colors guessed from screenshots. Tokens are recovered by harness failures (config-recovery-by-failure) — the config grows wave by wave.
- **Don't mock the harness target.** Fidelity scores only mean something against the real live URL.
- **Don't use `space-y-*` for stacked buttons or text rows** when the live's CSS-layer rule uses `margin-bottom` per child — the resolved margins flip and the harness flags it. Prefer `mb-*` on the child instead. (See §5.)
- **Don't validate from the repo root.** `cd tools/harness && npx tsx src/cli.ts validate ...` — running from repo root creates an untracked `validation/` directory.

## 7. Glossary

- **wave** — one pass through the 5 phases for a single component (capture → wire → validate → accept). Branch named `wave-<n>-<slug>` or `wave-<slug>`.
- **fixture** — `tools/harness/fixtures/<slug>.json`. The contract consumed by `cli.ts validate|converge`: slug, selectors, breakpoints, ref/rendered URLs, setup scripts, optional `renderedSourcePath` for converge.
- **multi-bp-config** — `tools/harness/multi-bp-configs/<slug>.json`. Capture-only descriptor used by `capture-multi-bp.ts`: component name, props, selector, breakpoints, target URL, single `setupScript`.
- **harness-target** — the conventional `id` setup scripts assign to the wrapper element on both ref and rendered, so a single selector matches both sides.
- **referenceSetup / renderedSetup** — JS strings run via `page.evaluate` after navigation. Tag the wrapper, prepare state, etc. **No imports, no await across navigations** — for auth flows that need Playwright-level actions, use `referenceAuth` / `renderedAuth` (declarative steps).
- **referenceAuth / renderedAuth** — `AuthFlow` (declarative steps) for targets behind a login wall. Each step is one of `fill`/`click`/`press`/`waitForSelector`/`waitForURL`/`waitForLoadState`/`waitForTimeout`. Runs before the capture navigation; cookies persist.
- **convergence loop** — `cli.ts converge`: render → score → if not pass, send mismatches + current TSX to the agent → write `nextTsx` back to disk → repeat (cap 5). History at `validation/<slug>/converge-<bp>/run-<i>.{json,score.json}`.
- **font substitution** — when ref and rendered `fontFamily` differ, pixelDiff is skipped and weights renormalize across the remaining 3 dimensions. Serve the live font locally to unblock real pixel scoring.
- **config-recovery-by-failure** — Tailwind tokens grow as the harness reports computed-CSS mismatches; the config is the cumulative result of waves, not seeded up front.

## 8. Starting a new rebuild

1. **Clone this repo.**
2. **Set the target URL** in your first `multi-bp-config.json` and `fixture.json`. If the target has an auth wall, populate `auth` / `referenceAuth`.
3. **Run wave 1.** Pick a simple, visually-bounded component on the target (filter pill, header, single card). Inspect its DOM with the dev tools or Playwright. Write its multi-bp-config, capture, hand-write the TSX, write the fixture, validate. The first wave will surface 2-4 tokens — add them to `tailwind.config.js` and document each with a `wave 1 — ComponentName:` comment block.
4. **Iterate.** Each subsequent wave adds 0-2 tokens. Skim §5 Recurring patterns before each wave to apply them preemptively.
5. **Compose.** After ~20-30 isolated primitives, the natural next phase is composing them into full screens. Out of scope of the per-component harness, but the validated primitives drop in cleanly.

## Prior projects using this template

- _Add yours when you start one._

Past rebuilds (for reference, not for copy-paste):
- nahum-www (Casa Nahum product catalog — origin of the methodology)
- saydi-www (community app for moms, 30 primitives + 4 composed screens — proved the methodology generalizes to interactive apps)
