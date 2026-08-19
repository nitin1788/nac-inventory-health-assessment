# NAC Website Reconstruction Plan (Proposal — Not Implemented)

**Date:** 2026-08-18
**Status:** Proposal only. Nothing in this document has been built. See `NAC_CURRENT_WEBSITE_AUDIT.md` for the as-is state this plan builds on.

---

## 1. Positioning summary (as given)

NAC = Nitin Anand Consulting, repositioning into **two clearly separate service verticals** for a **pharmacy, healthcare & allied businesses** niche:

- **Vertical 1 — Inventory & Operations Consulting**: audits, reconciliation, ABC/FSN/expiry/dead-stock/slow-moving analysis, stock optimization, FEFO, reorder/min-max, purchase analysis, operations audits, SOP development, process improvement, KPI/MIS/dashboards, pharmacy/store/warehouse operations.
- **Vertical 2 — Digital Marketing & Digital Services**: websites, landing pages, SEO/local SEO, Google Business Profile, social media management/content, AI content creation, Google Ads, Meta Ads, PPC, performance marketing, analytics, conversion tracking, digital growth.

Target customers: retail/hospital/chain pharmacies and medical stores primarily; hospitals, clinics, diagnostic centres, pathology labs, dental clinics, physiotherapy centres, pharma distributors, medical equipment/surgical suppliers secondarily.

Website goal: **informative, trust-building, lead-generation** site — not an e-commerce/payment flow. The two verticals must stay visually and structurally distinct, not blended into one generic "services" page.

---

## 2. What's directly reusable from the current build

This is not a rebuild from zero. Reusable as-is or with light modification (see audit §16):

- React/Vite/Tailwind/Router shell, `Navbar`, `Footer`, `Button`, form components, layouts.
- `useSeo.ts` / `useJsonLd.ts` — the SEO mechanism is sound and extensible to blog schema types.
- The `ServiceLandingView` + data-driven `SERVICE_CATEGORIES` pattern — this is the template to fork for both verticals' service pages, so 12+ service pages don't require 12+ bespoke components.
- Express/TS backend shell, Supabase repository pattern, Resend email layer, Render deployment.
- The `/blog` route slot and nav entry already reserved (currently a placeholder).

---

## 3. Proposed site map / URL structure

```
/                                    Homepage
/about                               About NAC
/contact                             Contact / lead generation (rename from /contact-us for consistency; keep old as 301 if live traffic exists)

/inventory-operations-consulting                        Vertical 1 hub
/inventory-operations-consulting/inventory-audit
/inventory-operations-consulting/stock-verification
/inventory-operations-consulting/inventory-reconciliation
/inventory-operations-consulting/abc-analysis
/inventory-operations-consulting/fsn-analysis
/inventory-operations-consulting/expiry-near-expiry-analysis
/inventory-operations-consulting/dead-stock-analysis
/inventory-operations-consulting/slow-moving-stock-analysis
/inventory-operations-consulting/stock-optimization
/inventory-operations-consulting/fefo-implementation
/inventory-operations-consulting/reorder-min-max
/inventory-operations-consulting/purchase-analysis
/inventory-operations-consulting/operations-audit
/inventory-operations-consulting/sop-development
/inventory-operations-consulting/process-improvement
/inventory-operations-consulting/kpi-mis-dashboards
/inventory-operations-consulting/pharmacy-store-warehouse-operations

/digital-marketing-services                              Vertical 2 hub
/digital-marketing-services/website-development
/digital-marketing-services/landing-pages
/digital-marketing-services/seo
/digital-marketing-services/local-seo
/digital-marketing-services/google-business-profile
/digital-marketing-services/social-media-management
/digital-marketing-services/social-media-content
/digital-marketing-services/ai-content-creation
/digital-marketing-services/google-ads
/digital-marketing-services/meta-ads
/digital-marketing-services/ppc-performance-marketing
/digital-marketing-services/analytics-conversion-tracking

/industries                          Industries hub (optional overview)
/industries/pharmacies                Retail/chain/hospital pharmacies
/industries/hospitals
/industries/clinics
/industries/diagnostic-centres
/industries/pathology-labs
/industries/dental-clinics
/industries/physiotherapy-centres
/industries/pharma-distributors
/industries/medical-equipment-suppliers

/blog                                 Blog index
/blog/<seo-friendly-slug>             Blog article (per spec)
/blog/category/<category-slug>        Optional category archive
/blog/tag/<tag-slug>                  Optional tag archive

/privacy-policy
/terms-and-conditions
```

**Notes on URL design:**
- Industry × service combination pages (e.g. "Inventory Audit for Retail Pharmacies") are deliberately **not** proposed as a full matrix of static routes up front — that's 17 services × 9 industries = 153 pages, most with thin content, which is an SEO liability (thin/duplicate content) rather than an asset. Recommend starting with the 2 vertical hubs + their service pages + industry pages, and adding specific combination landing pages only where there's a genuine content angle and search-volume justification (e.g. `/inventory-operations-consulting/pharmacy-inventory-audit` as a single high-value combined page, not a full matrix). This is a call for the user to make with SEO keyword research, not an automatic build-out.
- `/inventory-operations-consulting` and `/digital-marketing-services` as URL prefixes (rather than flat top-level slugs) make the two-vertical separation visible in the URL itself, reinforcing "these are different service categories" per the explicit positioning requirement.
- Existing indexed URLs (`/about`, `/faq`, `/privacy-policy`, `/terms-and-conditions`) should be preserved or 301-redirected, not silently broken, to protect whatever existing search equity exists.

---

## 4. Page-by-page plan

### Homepage (`/`)
Replaces the current assessment-funnel homepage. Structure: hero (pharmacy/healthcare-specific trust statement, not generic), two clearly separated vertical panels (Inventory & Operations Consulting / Digital Marketing & Digital Services) each with its own CTA, industries-served strip, trust signals (the existing `TRUST_STATS`/`WHY_CHOOSE_NAC` pattern can be repurposed with healthcare-specific stats), featured blog posts (once blog exists), primary lead-gen CTA (contact/consultation form, not a payment flow).

### About (`/about`)
Reusable structure (`MarketingPageLayout`, already exists) — rewrite copy for the healthcare/pharmacy niche and the two-vertical story; drop the assessment-product framing.

### Vertical hub pages (`/inventory-operations-consulting`, `/digital-marketing-services`)
New page type: a vertical overview page listing its own services as cards linking to individual service pages, distinct hero/visual identity per vertical (per instruction: must not look like a single generic "services" page). Both hubs share a layout component but with a vertical-specific color/icon accent so a visitor immediately understands which of the two they're looking at.

### Individual service pages (17 + 12 = 29 pages)
Fork the existing `ServiceLandingView` pattern: one shared component, driven by a data array per vertical (e.g. `INVENTORY_SERVICES`, `DIGITAL_SERVICES` replacing/extending `SERVICE_CATEGORIES`), each entry carrying slug, title, description, benefits, process steps, relevant industries, and CTA. This avoids hand-building 29 React components.

### Industry pages (`/industries/*`)
New page type, one per target industry, explaining NAC's relevant offerings (drawn from both verticals) for that specific business type (e.g. a pathology lab cares about expiry/dead-stock analysis and Google Business Profile/local SEO more than, say, Meta Ads). Same data-driven-template approach as service pages.

### Blog (`/blog`, `/blog/<slug>`)
See §6 below — full architecture proposal.

### Contact / lead generation (`/contact`)
Replaces payment as the primary conversion action. A single lead form (name, business name, business type/industry dropdown, which vertical they're interested in, message) posting to a **new**, simple backend endpoint (e.g. `POST /api/v1/leads`) that reuses the existing Resend email layer to alert NAC — directly replacing the lead-alert email currently triggered by assessment submission. This is the single most important functional replacement identified in the audit: removing the assessment product removes NAC's only working lead-capture mechanism, so this should be built **before or alongside** removing the assessment flow, not after.

### Legal pages (`/privacy-policy`, `/terms-and-conditions`)
Keep structure; rewrite copy to remove assessment/payment-specific language (current privacy policy explicitly names Supabase/Resend as sub-processors for assessment data — needs revisiting once the assessment product is gone) and reflect the new lead-form data flow instead.

---

## 5. Navigation & footer

**Header nav:** Home, Inventory & Operations Consulting (dropdown of its services), Digital Marketing & Digital Services (dropdown of its services), Industries (dropdown), Blog, About, Contact — with a persistent "Get a Free Consultation" CTA button (replacing "Start Free Assessment"). The existing `Navbar.tsx` dropdown pattern (already used for "Services"/"Resources") extends directly to this — no new interaction pattern needed, just new data.

**Footer:** Keep the existing 5-column structure (`Footer.tsx`) — swap "Services" column for two mini-columns or a combined list clearly labeled by vertical, update Quick Links to include Blog/Industries, keep contact info block, keep legal links.

**CTA strategy:** Every service/industry/blog page should end in a consistent, low-friction CTA — "Book a Free Consultation" (form or WhatsApp deep link, reusing the existing `whatsapp.ts` utility pattern already built for the consultation upsell) rather than a purchase button. No pricing/checkout CTAs anywhere per the repositioning goal.

---

## 6. Blog architecture proposal

**Goal:** scalable, SEO-first, content-file-based — new posts addable without touching React components.

**Recommended approach: Markdown-file-based, no CMS/database dependency.**

Rationale: this is a Vite SPA with no existing content-management/admin surface, and the user explicitly asked for a markdown/content-file approach if compatible. A markdown-based static content system is fully compatible with the existing Vite + React Router setup:

- Content lives in `frontend/src/content/blog/<slug>.md` (or `.mdx` if inline React components in posts are ever wanted), one file per article, using frontmatter for all structured fields the user listed: title, slug, description, date, author, category, tags, primary keyword, secondary keywords, featured image, image alt text, canonical URL override (optional — normally derived), OG type/image overrides (optional).
- Loaded at build time via Vite's `import.meta.glob` (no runtime fetch, no server round-trip, fully static-generation-friendly) — a small `blog.registry.ts` module reads all markdown files, parses frontmatter (e.g. via `gray-matter` or a minimal custom parser to avoid a heavy dependency), and exposes a typed list sorted by date.
- `/blog` (index) renders the list with pagination/category/tag filtering, using the same `MarketingPageLayout` + `useSeo` pattern already in place.
- `/blog/:slug` (detail) renders one parsed article, auto-generating: `<title>`/meta description from frontmatter via `useSeo()`, canonical URL from the slug, OG/Twitter tags (with featured image), `Article` JSON-LD + `BreadcrumbList` JSON-LD via `useJsonLd()` (extending the existing hook — it already supports arbitrary schema objects, per the FAQ/Service page usage), a related-articles block (simple same-category/shared-tag matching, computed client-side from the loaded post list — no extra infra needed at this scale), and inline internal links (author-authored within the markdown body, plus an automated "see also" block from category/tag matching).
- Images: featured image referenced by frontmatter path, inline images referenced directly in markdown body — see §7 for the supporting image pipeline this requires.
- Sitemap generation extends to loop over all blog posts, not just static routes — needs `sitemap.xml` to become generated (build script) rather than hand-maintained once post count grows past a handful. This is a build-time Node script reading the same `blog.registry.ts` data, not a runtime dependency.

**Why not a headless CMS (Sanity/Contentful/etc.) or a database-backed blog:** Both are viable alternatives and worth revisiting if non-technical staff need to publish without a git-based workflow, or if editorial volume grows significantly. But they add infrastructure (an external service or new Supabase tables + an authenticated admin UI, which the site currently has zero authentication infrastructure for) that isn't justified yet. The markdown approach can migrate to either later without changing the frontend's rendering contract, since the post list/detail components would just switch their data source.

**What "adding a new blog post" looks like once built:** author drops a new `.md` file with frontmatter + body + image references into `frontend/src/content/blog/`, commits it — no component code changes, no redeploction logic beyond the normal build.

---

## 7. Image system proposal

Current state (per audit §11) is essentially a blank slate for this — no responsive images, no WebP/AVIF, almost no lazy-loading. Proposed for the blog/site image pipeline:

- **Storage:** images live alongside content, e.g. `frontend/src/content/blog/images/<slug>/` or `frontend/public/blog-images/<slug>/`, referenced by relative path in frontmatter/markdown. Vite's asset pipeline (already used for the logo images) handles hashing/optimization at build time for imported assets.
- **Featured image + inline images:** both supported via frontmatter (`featuredImage`, `featuredImageAlt`) and standard markdown image syntax (`![alt text](path)`) for inline images — alt text is mandatory by convention (lint rule or content-review checklist), not automatically enforced by code initially.
- **SEO-friendly filenames:** convention (documented, not code-enforced initially): `kebab-case-descriptive-name.ext`, no `IMG_1234.jpg`-style names.
- **Responsive images:** a small `<ResponsiveImage>` component wrapping `<img>` with `srcSet`/`sizes`, used by both the blog renderer and (eventually) other pages — this is new code, doesn't exist today.
- **Lazy loading:** default `loading="lazy"` on all inline/below-the-fold images via the same component; featured/hero images above the fold should stay eager.
- **WebP/AVIF:** either a Vite image-optimization plugin (e.g. `vite-imagetools` or `@vitejs/plugin-legacy`-adjacent tooling) generating modern formats at build time with a `<picture>` fallback, or pre-converting source images before commit if simplicity is preferred over tooling. This is a decision point — recommend the build-time plugin approach so content authors don't need to manually export multiple formats per image.
- This same component/pipeline should also be applied to any hero imagery introduced on the new homepage/vertical hub pages, not just blog content.

---

## 8. SEO architecture proposal

Building on what already works (audit §10):

- **Global tags (`index.html`):** full rewrite of title/description/keywords/OG/Twitter/JSON-LD for the pharmacy/healthcare positioning — `ProfessionalService` schema's `makesOffer` list rebuilt from the two verticals' actual service lists, `areaServed` reconsidered if the target market is broader than the current Mumbai-only framing.
- **Per-page SEO:** keep `useSeo()`/`useJsonLd()` as the mechanism; extend `useJsonLd` usage to blog `Article` schema (straightforward — it already accepts arbitrary JSON-LD objects per its FAQ/Service page usage).
- **Sitemap/robots:** move from a hand-maintained static `sitemap.xml` to a build-time-generated one once the route count grows (service pages + industry pages + blog posts will quickly exceed a size worth hand-editing); `robots.txt` stays hand-maintained (it rarely changes) but needs its `Disallow` list revisited once assessment routes are gone.
- **Internal linking:** service pages should cross-link to relevant industry pages and blog posts (e.g. an ABC Analysis service page linking to a "ABC Analysis for Pharmacies" blog post); this is a content/authoring discipline more than a code feature, but the blog's related-articles/tag system (§6) supports it structurally.
- **Heading structure & keyword targeting:** each service/industry/blog page should target one primary keyword (e.g. "pharmacy inventory audit") reflected in H1/title/meta description, with secondary keywords woven into H2s/body — this is a content strategy input the user should supply per page/post, not something to invent unilaterally here.
- **Analytics/tracking:** none exists today; recommend adding GA4 (and Meta Pixel if Meta Ads are actually run per Vertical 2's own service list) as part of this rebuild, with a lightweight cookie-consent banner if required by applicable law for the target market — this is a new build-out, flagged as a decision point for the user (which analytics stack, consent requirements) rather than assumed.

---

## 9. What happens to the old Inventory Assessment / PayU system

Per instruction, **not removed in this pass**. Recommended sequencing for a future, separate removal task (informed by the dependency trace in audit §7):

1. Build the new lead-capture endpoint/form first (§4 Contact page), so NAC never loses its only working lead-capture mechanism mid-migration.
2. Decide the fate of the free assessment tool itself — fully remove, or keep as a secondary/optional lead magnet under a new URL. (Not specified by the user yet — worth confirming before deleting the question bank/scoring engine, which is a large, self-contained body of work that may still have value as a lead magnet even without paid PDF upsell.)
3. Remove payment-gating from `assessment.controller.ts`'s PDF route (or remove the route if the assessment itself is going).
4. Remove `payment` module, `report.service.ts`, PayU env vars from `render.yaml`/`.env.example`/`env.ts`, frontend payment UI/routes, `REPORT_TIERS`/`TIER_PRICING`/`CONSULTATION` constants.
5. Retire `payment_orders` table (migration/backup as appropriate) and decide whether `companies`/`assessments`/`assessment_answers`/`module_scores` tables are retired too or repurposed for the new lead form.
6. Refresh `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API.md`, `README.md` to reflect the new site (these are already stale today, independent of this migration).

This sequencing is a recommendation for a **future planning conversation**, not an instruction to execute now.

---

## 10. Open decisions for the user (not assumed in this plan)

- Does the free assessment tool survive in any form (as a lead magnet, without payment), or is it fully retired?
- Full industry × service combination page matrix, or a curated subset based on keyword research?
- Markdown-in-repo blog (recommended) vs. headless CMS — confirm this fits editorial workflow (who writes posts, technical comfort level)?
- Which analytics/tracking stack (GA4, Meta Pixel, both, neither yet) and any consent-banner requirement?
- Keep `/contact-us` URL or migrate to `/contact` (redirect either way)?
- Target geography: still Mumbai/Andheri-focused (`areaServed` in current schema) or broader?
