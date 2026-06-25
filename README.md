# Nova Impulsa

React + Tailwind v3 rebuild of the Nova Impulsa education platform, scored at **≥99% pixel fidelity** against the Figma prototype across all 12 sections.

## Stack

- **Vite 5** + **React 18** + **TypeScript**
- **Tailwind v3** — tokens recovered wave-by-wave via harness failures
- **Playwright + pixelmatch** fidelity harness (`tools/harness/`)
- **sharp** — build-time image optimization

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & deploy

```bash
npm run build      # prebuild image optimization → vite build → dist/
```

Deployed on Vercel. No special config needed — routing is hash-based so no server rewrites required.

## Sections

12 sections, each available at an isolation route for harness validation:

| Section | Route |
|---|---|
| Hero | `/#/hero` |
| Navbar | `/#/navbar` |
| Features | `/#/features` |
| About | `/#/about` |
| Courses | `/#/courses` |
| Lecture Hall | `/#/lecture-hall` |
| Marquee | `/#/marquee` |
| Team | `/#/team` |
| Testimonial | `/#/testimonial` |
| News | `/#/news` |
| Newsletter | `/#/newsletter` |
| Footer | `/#/footer` |

## Fidelity harness

```bash
cd tools/harness
npm install && npx playwright install chromium

# Score a section against the Figma prototype
npx tsx src/cli.ts validate fixtures/<slug>.json

# Full-page pixel diff (Figma or any reference URL)
npx tsx src/full-page-diff.ts 1280
npx tsx src/full-page-diff.ts 1280 https://uni.themerex.net
```

See `tools/harness/README.md` for capture, scoring, and convergence loop docs.
