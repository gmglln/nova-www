# Cloning-tool evaluation

_Evaluated 2026-04-22 against the concrete task of rebuilding ndc-md.org into React components starting from the live URL only._

## Summary matrix

| Tool | Input | React output | Content extraction | Assets | i18n | Cost | Verdict |
|---|---|---|---|---|---|---|---|
| Chrome DevTools MCP | Live browser | No (LLM emits code) | DOM + network | Via network tab | N/A | Free (Apache-2.0) | Great observer; not a codegen |
| Playwright MCP | Live browser | No (LLM emits code) | A11y snapshot (token-cheap) | Yes, via routes | N/A | Free (Apache-2.0) | **Best scraper** |
| Firecrawl | URL | No | **Best-in-class** markdown + structured | Image URL list | N/A | Free → $333/mo | **Best for content** |
| builder.io Visual Copilot | Figma only | High (shadcn/Tailwind/CSS) | From design only | From design | N/A | Paid | Excluded — no Figma |
| v0 (Vercel) | Prompt + image | **Highest quality** (shadcn + Tailwind) | Partial | Partial | N/A | Token-based | **Best for generation** |
| Locofy.ai | Figma only | Good (React/Next/Vue) | From design | From design | N/A | Paid | Excluded — no Figma |
| Anima | Figma only | Good (React/Vue, clean) | From design | From design | N/A | $24/mo+ | Excluded — no Figma |
| screenshot-to-code | Image | Decent HTML/Tailwind/React | None | None | N/A | Free (OSS) + LLM API | OSS fallback for v0 |
| `tap` (internal) | URL → Figma → React | Via Figma hop | Inherits Figma | Inherits Figma | N/A | Internal | Optional design-review checkpoint |

## Details

### Chrome DevTools MCP (Google, official)
Drives a live Chrome session for an LLM — 29 tools across input, navigation, performance, network, debugging, emulation, memory. Weekly release cadence (v0.21.0, Apr 2026). Strong for observation (network waterfalls, computed CSS, JS evaluation) but does not generate components on its own — the LLM driving it does.

### Playwright MCP (Microsoft, official)
Cross-browser (Chromium/Firefox/WebKit), 143 device emulations. 2026 added accessibility-snapshot mode (~4× token reduction vs full DOM dump) and `--vision auto` hybrid mode that mixes a11y snapshots with screenshots. More portable than Chrome DevTools MCP for agent pipelines. Pick one of the two — overlapping scope.

### Firecrawl
URL-to-clean-markdown SaaS. `/crawl` walks a site with depth + path filters; `/extract` does LLM-based structured extraction via natural-language prompts. Renders JS, handles SPAs. Pricing: Free (500 lifetime credits), Starter $16/mo (3k credits), Standard $83/mo (100k), Growth $333/mo (500k). Starter covers ndc-md.org end-to-end.

### builder.io Visual Copilot
**Figma-only input** as of Apr 2026 docs — no URL import path. High-quality React/Vue/Svelte/Angular output via in-house LLM + Visual Copilot CLI. Excluded by the no-Figma constraint.

### v0 (Vercel)
Best-reviewed React codegen in 2026. Feb 2026 update added Git integration, VS Code-style editor, DB connectivity, agentic workflows, and token-based pricing. Opinionated output: shadcn/ui + Tailwind. Best quality on that stack; if the team does not plan to use shadcn, the output needs translation. Takes prompts + images (not URLs) as input.

### Locofy.ai
Figma-first. Lightning (one-click AI) + Classic (step-by-step tagging) modes. Good for complex UIs. Excluded by constraint.

### Anima
Figma-first. Preserves Figma component structure and breakpoints. $24/mo plans. Excluded by constraint.

### screenshot-to-code (abi, GitHub)
Open-source. Supports Gemini 3 and Claude Opus 4.5 as of 2026. Accuracy benchmark (2024, now stale): Claude Sonnet 3.5 at ~70% visual replication on a 16-screenshot dataset — expect meaningful gains from newer models but no updated benchmark. Useful as a local, zero-lock-in fallback when v0 output misses.

### `tap` (user's internal URL → Figma → React)
Inserts a Figma step between URL and code. Valuable when the team wants a design-review checkpoint before committing to code — otherwise adds a hop that v0 or screenshot-to-code skip. Recommend keeping in reserve, not as the default path.

## Takeaways

Three tools do the real work here; the rest are either Figma-bound (excluded) or observers that overlap with the picks:

1. **Firecrawl** — content model + copy extraction. `/crawl` walks the site; `/extract` produces per-page structured JSON (case studies, resources, news, team, services). This is what feeds the new CMS integration regardless of which CMS you choose.
2. **Playwright MCP** — visual capture (responsive screenshots at 3 breakpoints), accessibility snapshots, computed-CSS pulls for design tokens. Use this over Chrome DevTools MCP because it is cross-browser and the a11y-snapshot mode is cheaper on tokens. Chrome DevTools MCP is a reasonable substitute if the team is already Chrome-locked.
3. **v0** — component generation from screenshots. Fall back to **screenshot-to-code** locally for components where v0's shadcn opinion does not match, or where licensing/cost matters.

Keep `tap` as an *optional* detour: if any page needs designer review in Figma before code, route it through `tap`; otherwise go URL → screenshots → React directly.

Do not invest time evaluating Locofy, Anima, or Visual Copilot for this project — they all require Figma input that the user has explicitly ruled out.
