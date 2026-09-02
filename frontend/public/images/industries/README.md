All 12 industry files, previously delivered as `*.webp.png` (real PNG data despite the filename),
were converted 2026-08-21 to genuine, compressed WebP at the same path minus the erroneous `.png`
suffix, plus `-800w.webp` mobile variants — see `../README.md` and
`frontend/scripts/optimize-images.mjs`.

Every one of the 12 is a pre-composited graphic-design card, not raw photography: each has a
rounded, drop-shadowed text panel baked into a corner (industry name + subtitle + icon badge),
and the same recurring consultant model appears in most of them. That styling issue alone was
previously flagged (2026-08-20 note, now superseded) but not treated as a hard blocker.

**2026-08-21: 4 of the 12 also contain outright fabricated claims and are unwired from
`industries.data.ts` as a result** (file kept on disk, optimized, just not referenced — falls back
to the existing text-only industry hero layout):

| Industry | File | Problem |
|---|---|---|
| Hospitals | `nac-hospital-operations-consulting.webp` | Fabricated "Hospital Operations Overview" dashboard (325 patients, 78% bed occupancy, 32 min avg wait, 24 discharges) |
| Diagnostic Centres | `nac-diagnostic-centre-operations-consulting.webp` | Fabricated "Daily Operations Overview" dashboard (128 test count, 45 min avg TAT, 92% within TAT) |
| Clinics | `clinic-operations-consulting.webp` | Fabricated named doctor badge ("Dr. Rohan Mehta") |
| Pharma Distributors | `nac-pharma-distributor-warehouse-consulting.webp` | Fabricated distributor company name/logo ("SUREMED DISTRIBUTORS") on staff uniforms |

A prior pass tried to work around the Hospitals/Diagnostic-Centres dashboards with a tight
`objectPosition` crop (see git history on `industries.data.ts`) — that only hides the fabricated
panel in the rendered page. The raw file is still directly and publicly servable at its full
resolution with the numbers fully legible (e.g. to an image crawler or anyone opening the file
URL directly), so it doesn't actually resolve a no-fake-statistics violation. Unwiring is the
correct fix.

**The remaining 8 are kept, wired in as-is** (Retail Pharmacy, Hospital Pharmacy, Chain Pharmacy,
Medical Stores, Pathology Labs, Dental Clinics, Physiotherapy Centres, Medical Equipment &
Surgical Suppliers) — they have baked-in headline/tagline text (a styling redundancy with the
page's own on-page heading, not a factual fabrication) but no fabricated numbers or names.

This also documents the two industry-photo entries from an earlier pass
(`retail-pharmacy`, `hospitals`) that briefly pointed at two now-deleted files
(`nac-pharmacy-business-consulting.webp.png`, `nac-hospital-healthcare-consulting.webp.png`) and
were reverted to text-only at the time — since superseded by the current 12-file set described
above.
