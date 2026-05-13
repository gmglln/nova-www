# fidelity-harness

A build-time tool that drives the rebuild of a live URL into React. Given a target, it discovers reusable patterns, captures their ground truth across breakpoints, generates Tailwind components, and scores rebuild fidelity dimension-by-dimension. Includes a convergence loop that closes back to a real LLM agent for self-healing.

This copy was bootstrapped from the nahum-www project (Casa Nahum rebuild). The saydi target is at `https://distort-chant-39053293.figma.site/` — see the project README for context-specific notes (auth wall, Figma-hashed CSS, app-shape capture differences).

---

## The 5-phase discovery flow

This isn't a single command. Each pattern goes through five short phases, each with its own tool. Per-component cycle time: 5–25 min depending on layout-context complexity.

### Phase 1 · DISCOVER — what's on this page?

```bash
npx tsx src/inspect.ts <TARGET_URL>
```

Walks the live DOM, clusters elements by structural signature (`<tag>.{sorted-classes}[child-tags]`), ranks by frequency, fuzzy-matches against existing `src/components/*.tsx`. Output: ranked list of unique patterns with status `✓ <ComponentName>` or `✗ NEW`.

> **Note for saydi:** Figma-generated sites use hashed/auto-generated class names. The class-based clustering signature degrades — many true-duplicate elements may show as distinct. Plan to add a tag+structure-only signature mode if this becomes a blocker.

### Phase 2 · CAPTURE — what does the live actually compute?

```bash
npx tsx src/capture-multi-bp.ts multi-bp-configs/<slug>.json .captures/<slug>.json
```

Drives Playwright through the configured breakpoints (default `[375, 768, 1440]`). At each breakpoint it does a **triple-read** of computed CSS:
- with all classes (`computed`)
- without legacy/cascade-only classes (`minusLegacy`)
- without any classes (`stripped`, browser default baseline)

Output: per-element multi-breakpoint fixture consumed by phase 3.

The `multi-bp-configs/<slug>.json` describes the capture target — selector, breakpoints, reference URL, optional `setupScript` that tags the wrapper with `id="harness-target"`, optional `legacyClasses`.

> **Note for saydi:** the target has a login wall (accepts any email). The current `setupScript` field is intended for wrapper tagging only — for auth, either extend it to also handle the login flow, or persist Playwright `storageState` after a one-time manual login. See the scaffold `multi-bp-configs/logo.json` for the auth TODO sketch.

### Phase 3 · GENERATE — emit React + Tailwind

```bash
npx tsx ../../docs/experiments/06-automate-fast-path/scripts/dom-to-jsx-v4.ts \
  .captures/<slug>.json src/components/<Name>.tsx
```

> **Note:** the dom-to-jsx-v4 script is in nahum-www's `docs/experiments/` folder, NOT copied here. If you need it, copy it over from `/Users/mm/Projects/ciudades/web/nahum-www/docs/experiments/06-automate-fast-path/scripts/`. For early waves you can hand-write the component from the capture JSON instead.

Reconciles the per-bp computed values against the recovered Tailwind config. Emits responsive utilities — e.g., `fontSize` of 16/18/20px at 375/768/1440 → `text-base md:text-lg lg:text-xl`. Outputs a ready-to-use `.tsx` file with literal text from the capture.

### Phase 4 · WIRE — props + isolation route

Manual edit (1–2 min):
- swap captured literals for `{prop}` placeholders
- add an `id?: string` prop so the harness can target the wrapper
- create `src/routes/<name>.tsx` for the isolation page
- add a hash route in `src/App.tsx`
- write the harness fixture `fixtures/<slug>.json`

### Phase 5 · VALIDATE — A/B scoring

```bash
npx tsx src/cli.ts validate fixtures/<slug>.json
```

For each breakpoint: captures the live and the localhost render at the same viewport, scores them across four dimensions, and writes the artifacts.

If **PASS** → commit, move on.
If **FAIL** → the score JSON tells you exactly what to fix (`h4 lineHeight ref=26px ren=20px`). Apply the fix. Re-validate. Either iterate manually or kick off the convergence loop (see below).

---

## Quick start

```bash
cd tools/harness
npm install
npx playwright install chromium
# replace logo.json with a real fixture once you have one
npx tsx src/cli.ts validate fixtures/logo.json
```

Fixture format:

```json
{
  "slug": "<name>",
  "selector": "#harness-target",
  "breakpoints": [375, 768, 1440],
  "referenceUrl": "<TARGET_URL>",
  "renderedUrl":  "http://localhost:5173/#/<name>",
  "renderedSourcePath": "../../src/components/<Name>.tsx",
  "referenceSetup": "() => { /* JS that tags the live wrapper with id='harness-target' */ }",
  "renderedSetup":  "() => {}"
}
```

Setup scripts run after navigation. Use them to mark the wrapper element with the same `id` on both sides so a single `selector` matches both.

---

## Auth handling (login walls)

For targets behind a login wall, declare an `AuthFlow` on the fixture (`referenceAuth` / `renderedAuth`) or on the multi-bp-config (`auth`). Steps run at the **Playwright level** before the capture navigation — distinct from `setupScript`, which runs in `page.evaluate` afterwards. Cookies set during auth persist into the capture goto.

```json
{
  "referenceAuth": {
    "loginUrl": "https://target.example/",
    "steps": [
      { "type": "fill", "selector": "input[type=email]", "value": "harness@test.local" },
      { "type": "click", "selector": "button[type=submit]" },
      { "type": "waitForTimeout", "ms": 2000 }
    ]
  }
}
```

`loginUrl` is optional and defaults to the capture URL. Available step types: `fill`, `click`, `press`, `waitForSelector`, `waitForURL`, `waitForLoadState`, `waitForTimeout`. End the steps with a wait that confirms login completed (a post-auth selector or a timeout). The harness calls `auth` once per capture (i.e., per breakpoint per side); for high-volume runs, consider persisting `storageState` instead — not implemented yet.

The rendered side is localhost so `renderedAuth` is almost always omitted.

---

## Scoring

Four dimensions, weighted:

| Dimension      | Threshold | Weight (full) | Weight (no-pixel) |
|----------------|-----------|---------------|-------------------|
| domStructural  | 100%      | 0.30          | 0.353             |
| computedCss    | ≥99%      | 0.30          | 0.353             |
| a11yTree       | 100%      | 0.25          | 0.294             |
| pixelDiff      | ≤2%       | 0.15          | (skipped)         |

Aggregate ≥98% required for acceptance. Per-dimension floors apply independently.

**Conditional pixelDiff:** when `fontFamily` differs between reference and rendered (font substitution), pixelDiff is skipped and the aggregate is computed from the remaining 3 dimensions with renormalized weights.

---

## Output structure

```
validation/<slug>/
├── reference/<slug>-<bp>.{dom.json,png}     ← the live, captured at each bp
├── rendered/<slug>-<bp>.{dom.json,png}      ← the rebuild, captured at each bp
├── scores/<slug>-<bp>.score.json            ← 4-dim score + mismatch list
└── diff.html                                ← optional A/B viewer
```

---

## Visual A/B diff viewer

```bash
npx tsx src/diff-viewer.ts <slug>
open validation/<slug>/diff.html
```

Generates a single HTML page showing reference vs rendered screenshots side-by-side per breakpoint, with score badges and an expandable mismatch table.

---

## Convergence loop

```bash
npx tsx src/cli.ts converge fixtures/<slug>.json --agent <stub|synthetic|anthropic>
```

The loop:

1. Render the current state (the file at `renderedSourcePath`), score against the captured reference.
2. If `allPass` → **ACCEPTED**.
3. Else if iteration < cap (default 5) → call the agent's `propose()` with the current TSX + structured mismatches + per-dimension status. Write the agent's `nextTsx` back to disk. Go to 1.
4. Else → exit with reason `cap-reached` or `no-progress` (if agent returns identical TSX).

Per-iteration history is written to `validation/<slug>/converge-<bp>/run-<i>.{json,score.json}`.

### Agent providers

- **`stub`** — does nothing. Useful for debugging the loop.
- **`synthetic`** — deterministic rules-based agent. Limited to className edits via lookup tables.
- **`anthropic`** — calls Claude (default `claude-sonnet-4-6`) via `@anthropic-ai/sdk`. Activate with `ANTHROPIC_API_KEY` in env.

```bash
ANTHROPIC_API_KEY=sk-... \
  npx tsx src/cli.ts converge fixtures/<slug>.json --agent anthropic
```

---

## Limitations / known issues

- **Setup scripts are evaluated as strings** — passed to `page.evaluate` literally. They cannot import or share helpers.
- **Auth flows not built in** — `setupScript` is for wrapper tagging. The saydi target needs auth handling; this is a v2 extension item.
- **Figma site CSS clustering** — `inspect.ts` clusters by sorted class names; auto-generated/hashed classes degrade clustering quality. Tag-only signature mode is a v2 extension item.
- **Pixel diff is conservative** — font substitution skips pixelDiff. To unblock real pixel-level scoring, serve a copy of the live font from localhost.
- **Layout-context-dependent components** require the isolation route to reproduce the live's containing-block parent — not just the captured wrapper.
