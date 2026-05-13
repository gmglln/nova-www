# Recommended cloning pipeline

_End-to-end workflow to rebuild ndc-md.org in React from the live URL. Assumes React; agnostic on Vite vs Next.js (team's call)._

## Pipeline at a glance

```
ndc-md.org
   │
   ▼
(1) Firecrawl /crawl + /extract  ─► content/ (markdown + structured JSON)
   │
   ▼
(2) Playwright MCP  ─► screenshots/ (3 breakpoints) + a11y-snapshots/ + design-tokens.json
   │
   ▼
(3) Component matrix (manual + LLM-assisted)  ─► docs/component-matrix.md
   │
   ▼
(4) v0 (primary) / screenshot-to-code (fallback)  ─► src/components/*.tsx drafts
   │
   ▼
(5) Human refinement + wire to content + CMS integration
   │
   ▼
(6) Asset pipeline  ─► public/ or CDN
```

## Stage 1 — Content & structure (Firecrawl)

- Run `/crawl` on `https://www.ndc-md.org` with depth 3, max pages ~50 — captures every URL in the audit plus case-study/news detail pages.
- Run `/extract` with a prompt per content type (Case Study, Service, Resource, News Story, Event, Team Member). Each returns structured JSON that becomes the shape of the new CMS content model.
- Persist outputs as versioned files in the repo for reproducibility:
  - `content/pages/*.md` — plain pages
  - `content/case-studies/*.json`
  - `content/resources/*.json`
  - `content/news/*.json`
  - `assets/manifest.json` — image URLs, PDF URLs
- Cost: Starter plan ($16) is sufficient — ~50 pages, handful of re-runs.

## Stage 2 — Visual capture (Playwright MCP)

For every URL from Stage 1:

- Three responsive screenshots: `375` (mobile), `768` (tablet), `1440` (desktop). Output: `screenshots/{slug}/{breakpoint}.png`.
- Accessibility snapshot: `a11y-snapshots/{slug}.json` — semantic structure cheaper than DOM.
- Computed-CSS pull on a small set of representative components (hero, stat block, card, button, body copy). Feed those to an LLM pass that outputs `design-tokens.json` (colors, font stacks, scale, spacing rhythm, radii).

This stage is scriptable and re-runnable; treat it as a build step.

## Stage 3 — Component matrix

Walk the outputs from Stages 1–2 and produce `docs/component-matrix.md` — one row per unique UI pattern with:

- Name (e.g., `HeroBanner`, `StatBlock`, `ImageTextBand`, `CardGrid`, `CaseStudyArticle`, `ResourceCarousel`, `CTABand`, `NewsletterForm`, `AccordionSection`, `Footer`)
- Pages that use it
- Content fields (props)
- Breakpoint behavior notes
- Interactive states (if any)
- Priority (model case-study detail first — most structure-heavy)

This is the contract for Stage 4. Small investment (~half a day) that prevents regenerating the same component five times.

## Stage 4 — Component generation

**Primary: v0.**
For each row in the matrix, feed v0 the relevant screenshot(s) + a prompt describing purpose and content props. Output lands in `src/components/{Name}.tsx` as a first draft — React + Tailwind + shadcn/ui by default.

**Fallback: screenshot-to-code (local, Claude Opus 4.5).**
Use when v0's shadcn opinion conflicts with the team's preferred primitives, or when the component is so bespoke (carousels, ArcGIS embed wrapper) that v0 under-performs. Outputs plain React + Tailwind without shadcn lock-in.

**Optional detour: `tap`.**
For any component the team wants design-reviewed before code (e.g., the case-study template, the hero), route the URL through `tap` to produce a Figma artifact, iterate in Figma with the designer, then export to React. Skip for simple patterns.

## Stage 5 — Human refinement + integration

This is where engineering time actually goes. Per component:

- Match against `design-tokens.json` — replace hardcoded values from the AI draft.
- Verify responsive behavior against the 3 breakpoints captured in Stage 2.
- A11y check against the snapshot (heading levels, landmarks, alt text).
- Extract repeated values into props; merge near-duplicate variants.
- Wire to content JSON from Stage 1 via a thin CMS client (choice of CMS is out of this doc's scope — the content shape is already defined by Stage 1's schemas).

Page assembly: compose components according to the matrix. Copy comes from Stage 1's markdown.

## Stage 6 — Asset pipeline

- Download all images referenced in `assets/manifest.json`, compress (e.g., `sharp`), place in `public/assets/` or upload to chosen media host.
- Preserve PDFs as-is; the site links to them inline.
- Re-embed the ArcGIS map via iframe — do not rebuild.
- Socials and newsletter form are vendor integrations; swap or keep depending on the team's newsletter provider.

## Fallbacks & risk notes

- **If Firecrawl `/extract` misses nested structure on case studies,** fall back to a Playwright MCP + custom extractor script for that content type only. Keep Firecrawl for everything else.
- **If v0's hit-rate is inconsistent,** narrow its role to "first draft of static markup" and budget more human time; do not add more tools to the chain.
- **Donation link** goes to an external processor — identify it during Stage 2, decide whether to keep the same vendor or switch.
- **ArcGIS embed** — verify the iframe still works headlessly; if not, capture a static fallback image.

## Rough time budget

- Stages 1–2: **~1 day** (largely automated; babysit reruns).
- Stage 3: **~0.5 day** (matrix authoring).
- Stage 4: **2–4 days** (varies with v0 hit-rate).
- Stage 5: **1–2 weeks** (refinement is the bulk of engineering effort).
- Stage 6: **~1–2 days**.

Total first-pass buildable site: ~2–3 weeks engineering time after Stages 1–2 hand off to the team.
