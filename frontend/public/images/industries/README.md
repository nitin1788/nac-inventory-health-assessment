**2026-08-20: 12 new files landed here (one per industry) but none are wired in.**

Every file (`nac-retail-pharmacy-inventory-consulting.webp.png`, `hospital-pharmacy-inventory-consulting.webp.png`,
`nac-chain-pharmacy-performance-consulting.webp.png`, `nac-medical-store-inventory-consulting.webp.png`,
`clinic-operations-consulting.webp.png`, `nac-hospital-operations-consulting.webp.png`,
`nac-diagnostic-centre-operations-consulting.webp.png`, `pathology-lab-workflow-consulting.webp.png`,
`nac-dental-clinic-operations-consulting.webp.png`, `physiotherapy-centre-workflow-consulting.webp.png`,
`nac-pharma-distributor-warehouse-consulting.webp.png`, `nac-medical-equipment-surgical-suppliers-consulting.webp.png`)
is a pre-composited graphic-design card, not raw photography: every one has a rounded, drop-shadowed
text panel baked into the bottom-left corner (industry name + subtitle + a circular icon badge,
identical template across all 12), several also have a fabricated on-screen dashboard with invented
numbers (e.g. Hospitals: "Hospital Operations Overview" with fake KPI charts; Diagnostic Centres:
"128 Test Count / 45 min Average TAT / 92% Within TAT"). The same male consultant model (glasses,
beard) is also the recurring lead figure in essentially all 12.

Using these as delivered would mean the site's own real heading/copy sits next to a second,
conflicting baked-in heading on the photo itself — this conflicts with "real photography as the
primary visual language," "do not put text over faces / no text overlays," and "no fake
statistics." Not wired into `industries.data.ts` for that reason — flagged for the user rather
than implemented. See the 2026-08-20 implementation report for detail.

This also broke the two industry-photo entries from the previous pass (`retail-pharmacy`,
`hospitals`), which pointed at two now-deleted files
(`nac-pharmacy-business-consulting.webp.png`, `nac-hospital-healthcare-consulting.webp.png`).
Both entries were reverted to the text-only layout (same as the other 10 industries) to avoid a
broken image on those two pages.
