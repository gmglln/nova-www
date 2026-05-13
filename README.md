# rebuild-base

Template repo for fidelity-driven rebuilds of a live URL into React.

Components are captured from the live with Playwright, hand-written (or auto-generated) into the React app, and scored against the live with a 4-dimension harness (DOM, computed CSS, accessibility tree, pixel diff) until the rebuild matches within a configurable threshold.

Use this repo as a starting point for any rebuild project — clone, set the target URL, run wave 1.

---

## Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS v3 (token recovery via the harness — config starts empty, grows with each capture)
- Playwright + pixelmatch (fidelity harness)
- sharp (build-time image optimization)

## Quick start

```bash
npm install
npm run dev
# open http://localhost:5173
```

The scaffold ships empty — no example components. Wave 1 is yours to build.

## Harness

```bash
cd tools/harness
npm install
npx playwright install chromium

# Capture a component from your live target
npx tsx src/capture-multi-bp.ts multi-bp-configs/<slug>.json .captures/<slug>.json

# Validate your rebuild against the live
npx tsx src/cli.ts validate fixtures/<slug>.json
```

See `tools/harness/README.md` for the full 5-phase discovery flow, scoring details, and the convergence loop.

---

## Methodology

The harness measures four dimensions per breakpoint, weighted:

| Dimension      | Threshold | Weight (full) | Weight (no-pixel) |
|----------------|-----------|---------------|-------------------|
| domStructural  | 100%      | 0.30          | 0.353             |
| computedCss    | ≥99%      | 0.30          | 0.353             |
| a11yTree       | 100%      | 0.25          | 0.294             |
| pixelDiff      | ≤2%       | 0.15          | (skipped)         |

Aggregate ≥98% required for acceptance.

Captures are organized as **waves** — one wave per component, each on its own branch + PR. The Tailwind config grows wave by wave as the harness surfaces token mismatches (e.g., wave 1 captures FilterPill and the harness reports `bg-secondary` resolves to `#F5F3F0` on the live but is missing from the config — add it and re-validate).

See `CLAUDE.md` for the operational guide and recurring patterns.

---

## Project layout

```
rebuild-base/
├── public/                       # static assets (committed)
├── src/
│   ├── components/               # rebuilt React components (start empty)
│   ├── routes/                   # one isolation page per component (start empty)
│   ├── screens/                  # composed full-page screens (later phase)
│   ├── lib/cms/adapter.ts        # filesystem CMS adapter (extend with types as you go)
│   ├── App.tsx                   # hash router
│   ├── main.tsx
│   └── styles.css
├── content/                      # JSON content fixtures (create as types are defined)
├── tools/
│   ├── harness/                  # fidelity harness (capture + score + converge)
│   └── scripts/optimize-images.mjs
├── docs/
│   └── research/                 # cloning-tools comparison + recommended pipeline
├── .claude/                      # Claude Code project commands + skills (OpenSpec workflow)
├── openspec/                     # OpenSpec config (spec-driven workflow scaffold)
├── CLAUDE.md                     # operational reference (read first)
└── tailwind.config.js            # design tokens (grow wave by wave)
```

---

## Starting a new rebuild

1. **Set the target URL** in your first `multi-bp-config.json` and `fixture.json`. If the target has an auth wall, populate the `auth` / `referenceAuth` field (see `tools/harness/README.md` § Auth handling).
2. **Pick a simple component** on the target (a filter pill, a header, a card). Inspect its DOM, write the multi-bp-config, capture, hand-write the React, validate.
3. **Document recovered tokens** in `tailwind.config.js` with a `wave N — ComponentName:` comment block.
4. **Iterate.** Skim CLAUDE.md § Recurring patterns before each wave to apply known patterns preemptively.

---

## Origin

Methodology developed across two prior rebuilds:
- **nahum-www** — Casa Nahum product catalog (origin of the harness + the 5-phase flow).
- **saydi-www** — Mexican community app for school moms (proved the methodology scales to interactive apps with auth + state).
