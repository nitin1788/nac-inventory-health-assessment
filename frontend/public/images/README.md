# Site photography

Real, photorealistic consulting photography for the marketing site — supplied
separately, never fabricated (no SVG illustrations, no stock photos, no
AI-generated substitutes committed in their place). Format: `.webp`, kebab-case
filenames.

Each subfolder holds one image referenced by a specific homepage section. See
the `README.md` inside each subfolder for the exact filename and component
that consumes it. Until a file is dropped in, the referencing component shows
a dev-only "Image pending" placeholder (see `frontend/src/shared/components/ResponsiveImage.tsx`)
— visible only while running the dev server, not in production.

Character rule (per project brief): every image uses a different person —
never reuse the same consultant/model across photos. No NAC logo or large
text baked into the photograph itself; the site provides branding and copy.

`blog/` and `pharmacy/` are leftover exploratory folders from earlier work,
not currently referenced by any component — ignore until repurposed or
removed in a later cleanup pass.
