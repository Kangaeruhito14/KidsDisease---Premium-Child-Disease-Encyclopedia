# PediaCare — Child Disease Encyclopedia

An educational reference for parents and caregivers covering **115 pediatric
conditions** across **18 body systems**: staged symptoms, home care, prevention,
and exactly when to call a doctor.

> **PediaCare is not medical advice.** It lists generic active ingredients only
> (never brands, never doses) and always defers to qualified clinicians. In an
> emergency, call your local emergency number.

## Stack

- [Astro 6](https://astro.build) — fully static output; every disease has its own
  indexable URL (`/diseases/{slug}/`) with `MedicalCondition` + `BreadcrumbList`
  JSON-LD, unique titles/descriptions, sitemap, and robots.txt.
- [Tailwind CSS 4](https://tailwindcss.com) via PostCSS (`postcss.config.mjs`).
  Brand tokens live in `src/styles/global.css` under `@theme`.
- No client framework. The triage scorer and search run as small vanilla scripts.

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Static build into `dist/` (145 pages) |
| `npm run preview` | Serve the production build locally |
| `npm run build:legacy-db` | Regenerate the legacy SPA's database payload |

## Editing disease content

`data/database.source.json` is the single source of truth. After editing, run
`node build_db.js` — it validates referential integrity (systems, categories,
duplicate ids, image files) and regenerates the legacy payload. The Astro site
imports the JSON directly; just rebuild.

When adding a disease: place its SVG in `public/illustrations/`, keep
`related_diseases` names matching existing `name` fields exactly to make them
clickable links (non-matching names render as plain differential-diagnosis
chips — never dead links).

## Deployment

1. Buy the domain, then change **one line** — `site` in `astro.config.mjs` —
   and the URL in `public/robots.txt`. Canonical URLs and the sitemap
   regenerate automatically.
2. `npm run build` and deploy `dist/` to any static host (Netlify, Vercel,
   Cloudflare Pages, GitHub Pages).
3. Submit `sitemap-index.xml` in Google Search Console.

## Repository layout

```
data/database.source.json   # editable disease database (source of truth)
src/pages/                  # routes (115 disease pages generated from data)
src/components/             # header, footer, SEO head, cards, breadcrumbs
src/lib/db.ts               # typed data access + slug/URL helpers
public/illustrations/       # 148 condition/system illustrations
docs/seo-strategy.md        # keyword research and content rules
legacy/                     # previous Vue SPA, kept runnable for reference
```

## Content rules (do not break these)

1. Generic active ingredients only — no brands, no doses.
2. Every page carries the medical disclaimer and urgency labelling.
3. Guidance-level claims cite AAP / CDC / WHO / NHS / Nemours with visible links.
4. No fabricated data (the legacy "live outbreak map" was removed for this reason).
5. Machine-translated medical content is not statically published.
