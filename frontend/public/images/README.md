# Site photography

Real, photorealistic consulting photography for the marketing site — supplied
separately, never fabricated (no SVG illustrations, no stock photos, no
AI-generated substitutes committed in their place). Format: `.webp`, kebab-case
filenames.

**2026-08-21 (SEO fixes pass):** every file previously delivered as
`*.webp.png` (real PNG data despite the filename) has been converted to a
genuine, compressed WebP at the same path minus the erroneous `.png` suffix,
plus an `-800w.webp` mobile variant for responsive `srcSet` — see
`frontend/scripts/optimize-images.mjs`. All code references were updated to
match. Total weight for these files dropped from ~37.5MB to ~2.9MB.

**Also found and fixed in this pass:** several files have fabricated content
baked into the photo itself — invented performance/KPI numbers presented as
if real (`inventory/`, `digital-marketing/`, `strategy/`, and the
`hospitals`/`diagnostic-centres` entries in `industries/`), a fabricated
named doctor (`clinics`), and a fabricated distributor company name/logo
(`pharma-distributors`). These violate the site's no-fake-statistics/
no-fake-claims rule. Compression alone doesn't fix this — the pixels are
unchanged — so the affected files have been **unwired from the pages that
referenced them** (components fall back to a text-only layout) rather than
deleted. See each subfolder's `README.md` for the specific file and the
component comment that documents the removal. Full detail in
`NAC_SEO_READINESS_AUDIT.md`.

Each subfolder holds one image referenced by a specific homepage section. See
the `README.md` inside each subfolder for the exact filename and component
that consumes it. Until a file is dropped in, the referencing component shows
a dev-only "Image pending" placeholder (see `frontend/src/shared/components/ResponsiveImage.tsx`)
— visible only while running the dev server, not in production.

Character rule (per project brief): every image uses a different person —
never reuse the same consultant/model across photos. No NAC logo or large
text baked into the photograph itself; the site provides branding and copy.
This rule is exactly why the fabricated-content files above are disqualified
— it was already the house rule, just not enforced before this pass.

`blog/` and `pharmacy/` are leftover exploratory folders from earlier work,
not currently referenced by any component — ignore until repurposed or
removed in a later cleanup pass.
