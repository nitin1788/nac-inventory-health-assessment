# NAC Phase 1 Implementation Plan — Frontend Reconstruction

**Date:** 2026-08-18
**Status (2026-08-19):** Implemented. Routing, nav/footer, two-vertical homepage sections, service/industry data, the blog engine, and SEO foundation (§1–§10) described below were all built in the working tree (uncommitted). Lint/typecheck/build are clean. See the `2026-08-19 addendum` at the bottom of this file for what changed after this plan was written, and for the real-photography image-architecture work that followed as a separate, explicitly-scoped pass.
**Scope:** `frontend/` only. No backend, Supabase, PayU, or Render changes of any kind.
**Builds on:** `NAC_CURRENT_WEBSITE_AUDIT.md` (as-is state) and `NAC_WEBSITE_RECONSTRUCTION_PLAN.md` (long-term proposal). This plan is the concrete, sequenced Phase 1 slice of that larger plan.

---

## 0. Guardrails carried into this plan

- **Nothing is deleted.** Every existing file stays in the repo. "Removal" in this phase always means *unlinked from navigation/sitemap*, never *deleted from disk*.
- **`backend/` is not touched at all** — not one file. The assessment↔payment coupling documented in the audit (§7) is a backend concern; Phase 1 doesn't need to resolve it because Phase 1 doesn't remove any backend code.
- The assessment flow (`/assessment/start` → `/assessment/questions` → `/assessment/results` → `/assessment/payment` → `/assessment/thank-you`) keeps working end-to-end at the code level — its pages, components, and API calls are untouched. It simply stops being linked from anywhere in the new navigation, homepage, footer, or sitemap.
- No new backend endpoints are introduced in this phase (see §9 — the Contact page stays a static contact-info page in Phase 1, not a wired lead-capture form, because a real form needs a new backend route).
- One new frontend dependency is proposed (a markdown renderer for the blog) — flagged explicitly in §6 and §11, not installed silently.

---

## 1. Routing changes

### 1a. New routes (added to `frontend/src/app/routes.tsx`)

| Path | Page | Notes |
|---|---|---|
| `/inventory-operations-consulting` | `InventoryHubPage` (new) | Vertical 1 hub |
| `/inventory-operations-consulting/:slug` | `InventoryServicePage` (new) | dynamic, one template for all Vertical 1 services |
| `/digital-marketing-services` | `DigitalMarketingHubPage` (new) | Vertical 2 hub |
| `/digital-marketing-services/:slug` | `DigitalServicePage` (new) | dynamic, one template for all Vertical 2 services |
| `/industries` | `IndustriesHubPage` (new) | industries overview |
| `/industries/:slug` | `IndustryPage` (new) | dynamic, one template for all 12 industries |
| `/blog/:slug` | `BlogPostPage` (new) | blog article detail |

`/blog` already exists as a route — it stays, but `BlogPage.tsx` is modified to render the new `BlogIndexView` instead of `ResourceComingSoonView`.

Using **dynamic `:slug` routes with one shared page/template per vertical**, instead of one static file+route per service (the current pattern for the 6 existing service pages), is a deliberate change: with 17 + 12 = 29 service pages and 12 industry pages, one-file-per-page would mean 41 new files and 41 new route entries. A slug-driven template (data array → `useParams().slug` → lookup → render) keeps this at 6 new page/template files total. This is the same pattern the audit and reconstruction plan already recommended for the blog.

### 1b. Old service routes — redirected, not deleted

| Old path | New behavior |
|---|---|
| `/inventory-consulting` | `<Navigate to="/inventory-operations-consulting" replace />` |
| `/warehouse-consulting` | `<Navigate to="/inventory-operations-consulting" replace />` |
| `/operations-consulting` | `<Navigate to="/inventory-operations-consulting" replace />` |
| `/sop-development` | `<Navigate to="/inventory-operations-consulting" replace />` |
| `/business-analytics` | `<Navigate to="/inventory-operations-consulting" replace />` |
| `/training-implementation` | `<Navigate to="/inventory-operations-consulting" replace />` |

**Why redirect instead of leaving them live or deleting them:** these 6 URLs may already be indexed (they're in the current `sitemap.xml`) or bookmarked. A client-side redirect avoids a dead 404 for anyone who lands there, while the new URL structure takes over as canonical. The existing page files (`InventoryConsultingPage.tsx`, etc.) and `ServiceLandingView.tsx` are **not deleted** — only `routes.tsx` changes what element each old path renders. If preferred, this redirect step can be skipped entirely and the old routes left rendering their current content unchanged (100% zero-risk option) — flagged as an open decision in §12.

### 1c. Existing routes — unchanged, just unlinked

`/assessment/start`, `/assessment/questions`, `/assessment/results`, `/assessment/payment`, `/assessment/thank-you`, `/faq`, `/case-studies`, `/free-downloads`, `/checklists`, `/templates` all stay exactly as they are in `routes.tsx` — no code change. They simply won't appear in the new Navbar, Footer, homepage, or sitemap (see §5, §7).

---

## 2. Navigation reconstruction

**New primary nav** (per your spec): Home · Services · Industries · About · Insights · Contact.

`Services` and the new `Industries` become mega-menu dropdowns (reusing the existing `DropdownPanel` mechanism already in `Navbar.tsx` — no new interaction pattern, just restructured data):
- **Services dropdown**: two clearly labeled groups — "Inventory & Operations Consulting" (its own heading + services) and "Digital Marketing Services" (its own heading + services) — rendered as two visually distinct columns/sections in the same panel, not one merged list. This directly satisfies "must appear as two separate service categories throughout the website."
- **Industries dropdown**: the 12 industries listed, linking to `/industries/:slug`.
- `Insights` links straight to `/blog` (no dropdown needed).
- Primary CTA button changes from **"Start Free Assessment"** → **"Book a Free Consultation"**, linking to `/contact` (or the existing WhatsApp deep link — see §9).
- `FAQ` moves out of primary nav (not in your spec) into the Footer only — page and content untouched, just relocated in the link hierarchy.

### File: `frontend/src/features/landing/components/Navbar.tsx` — MODIFY
Restructure the `serviceDropdownItems` construction to render two grouped sections (Vertical 1 / Vertical 2) instead of one flat `SERVICE_CATEGORIES.map(...)`, add an `Industries` dropdown following the exact same `DropdownPanel`/ref/outside-click/escape pattern already built for Services and Resources, swap the CTA `Link`/label. The mobile disclosure menu gets the same two-group treatment for Services plus a new Industries disclosure section, mirroring the existing `isMobileServicesOpen`/`isMobileResourcesOpen` pattern.

---

## 3. Footer reconstruction

### File: `frontend/src/features/landing/components/Footer.tsx` — MODIFY
- Brand blurb (currently "Start with a FREE Inventory Health Assessment") rewritten for the two-vertical pharmacy/healthcare positioning.
- "Services" column split into two short lists (or one column per vertical if width allows) instead of `FOOTER_SERVICE_LINKS` (which currently prepends "Inventory Health Assessment" + the 6 old categories).
- New "Industries" column or merged into Company column, linking to `/industries` and/or a few flagship industry pages.
- "Quick Links" column: drop the `/#services`/`/#why-nac`/`/#how-it-works` in-page anchors tied to the old homepage sections (being restructured anyway, see §4) and the "Start Free Assessment" link; add Blog/Insights, Case Studies/Free Downloads/Checklists/Templates (the old Resources dropdown entries move here now that Resources is no longer a primary-nav dropdown).
- "Company" column keeps About, FAQ, Contact, Privacy Policy, Terms & Conditions unchanged.
- Contact block (email/phone) unchanged.

---

## 4. Homepage reconstruction

### File: `frontend/src/features/landing/LandingView.tsx` — MODIFY
New section order, replacing the assessment-funnel narrative with a trust/two-vertical narrative:

```
Navbar
Hero                    (rewritten — see below)
TrustStatistics         (rewritten stats — see below)
TwoVerticalsSection     (NEW — the two service categories, side by side, distinct visual treatment)
WhyChooseNAC            (rewritten copy — pharmacy/healthcare + digital growth framing)
IndustriesServed        (rewritten — pharmacy/healthcare industries instead of manufacturing/FMCG/etc.)
InsightsTeaser          (NEW — latest 3 blog posts once the blog has content; renders nothing / a "coming soon" placeholder if the post list is empty, so this ships even before content exists)
Testimonials            (kept structurally; copy reviewed — currently illustrative/role-attributed placeholders per existing convention, will be re-attributed to the new positioning without inventing specific client outcomes)
FinalCTABanner          (rewritten — see below)
Footer
```

`Services.tsx`, `HowItWorks.tsx`, and `ReportPreview.tsx` are **removed from the composition** (not deleted from disk): `HowItWorks.tsx` describes the 4-step assessment flow (company info → 52 questions → instant scoring → PDF report) and `ReportPreview.tsx` mocks the sample PDF/KPI dashboard the assessment produces — both are inherently assessment-specific and have no equivalent in the new positioning. `Services.tsx` (the flat 7-item list including "Inventory Health Assessment") is superseded by the new `TwoVerticalsSection`.

### Files to MODIFY (content rewrite, component structure mostly kept):
- `frontend/src/features/landing/components/Hero.tsx` — headline ("Know Exactly Where Your Inventory Operations Stand"), the "Free 52-Question Diagnostic" badge, the intro paragraph, and the "Start Free Assessment" CTA all need rewriting for the pharmacy/healthcare + two-vertical positioning. `HeroVisual.tsx` (not yet inspected in detail) should be reviewed for assessment-specific content during implementation — kept if it's a generic brand visual, adapted if not.
- `frontend/src/features/landing/components/TrustStatistics.tsx` — `TRUST_STATS` currently reads "52 Diagnostic Questions" / "9+ Industries Assessed" — needs stats that hold up without the assessment product (e.g. years of experience, service lines, industries served, confidentiality — reusing verifiable facts, not inventing numbers).
- `frontend/src/features/landing/components/WhyChooseNAC.tsx` — `WHY_CHOOSE_NAC` currently framed around "Data-Driven Diagnostics"/"Rule-Based Recommendations" (assessment-engine features) — rewritten around the two-vertical value proposition (pharmacy/healthcare operational expertise + digital growth expertise).
- `frontend/src/features/landing/components/IndustriesServed.tsx` — `INDUSTRIES_SERVED` currently lists Manufacturing/Electrical/FMCG/E-commerce — replaced with the pharmacy/healthcare industry set.
- `frontend/src/features/landing/components/FinalCTABanner.tsx` — headline ("Ready to Improve Your Inventory Operations?"), CTA buttons ("Start Free Assessment" + "Book Consultation – ₹499") replaced with a single consistent Contact/Consultation CTA (no price shown — see §9 on the ₹499 consultation fee).
- `frontend/src/features/landing/components/Testimonials.tsx` — review copy only; structure/attribution convention (role-only, no fabricated named clients) is kept as-is per existing practice.

### File to CREATE: `frontend/src/features/landing/components/TwoVerticalsSection.tsx`
New homepage section presenting Vertical 1 and Vertical 2 as two clearly distinct panels (different accent color/icon per the design direction), each summarizing 4-5 headline services with a link through to its hub page. This is the single most important new homepage element for satisfying "must appear as two separate service categories throughout the website."

### File to CREATE: `frontend/src/features/landing/components/InsightsTeaser.tsx`
Pulls the latest posts from the new blog registry (§6); renders a "New on the blog" section, or nothing/a subtle placeholder if zero posts exist yet, so the homepage never ships with an empty-looking section.

---

## 5. Service structure (Vertical 1 & Vertical 2)

### File to CREATE: `frontend/src/config/services.inventory.data.ts`
`INVENTORY_SERVICES: ServiceCategory[]` — the 17 Vertical 1 services (Inventory Audit, Stock Verification, Inventory Reconciliation, Inventory Analysis, ABC Analysis, FSN Analysis, Expiry/Near-Expiry Analysis, Dead Stock Analysis, Slow Moving Stock Analysis, Stock Optimization, FEFO Implementation, Reorder/Min-Max, Purchase Analysis, Operations Audit, SOP Development, Process Improvement, KPI/MIS/Dashboards, Pharmacy/Store/Warehouse Operations — note the list you gave has 17 named items with the last one being a combined "Pharmacy / Store / Warehouse Operations" entry), each with `slug`, `title`, `description`, `intro`, `services` (bullet list), 2-3 `benefits`, 2-3 `faqs` — reusing the exact `ServiceCategory` shape already defined in `landing.data.ts`, so `ServiceLandingView.tsx` needs no structural changes.

### File to CREATE: `frontend/src/config/services.digital.data.ts`
`DIGITAL_SERVICES: ServiceCategory[]` — the 12 Vertical 2 services (Website Development, Landing Pages, SEO, Local SEO, Google Business Profile, Social Media Management, Social Media Content, AI Content Creation, Google Ads, Meta Ads, PPC/Performance Marketing, Analytics/Conversion Tracking), same shape.

### File to MODIFY: `frontend/src/features/landing/landing.data.ts`
- `SERVICE_CATEGORIES` (the old 6-item array) is **removed from this file's exports** — its content is superseded by the two new files above; nothing of substance is lost (SOP Development, Business Analytics-equivalent KPI/MIS work, and Process Improvement all carry over into `INVENTORY_SERVICES`). `getServiceBySlug()` is removed/replaced by the new dynamic-route lookup logic in the new page templates (§1a), which returns `undefined` on a miss (redirecting to `NotFoundPage`) instead of throwing — a small, necessary behavior change since slugs are now runtime route params, not compile-time-guaranteed static routes.
- `NAV_LINKS` simplified (Home/About/Contact remain; FAQ removed per §2).
- `RESOURCE_LINKS` kept (Blog/Case Studies/Free Downloads/Checklists/Templates) but no longer rendered as a Navbar dropdown — moved into Footer only (§3). `RESOURCE_LINKS`'s Blog entry description updated to reflect it's now a real, populated section.
- `SERVICES` (flat 7-item list used by `AboutPage.tsx` and the old `Services.tsx` homepage section) — superseded by the two new service data files; `AboutPage.tsx` updated to reference the new lists instead (§8).
- `TRUST_STATS`, `TRUST_PILLARS`, `WHY_CHOOSE_NAC`, `PROCESS_STEPS`, `INDUSTRIES`, `INDUSTRIES_SERVED`, `TESTIMONIALS` — content rewritten in place (same export shape, new values) per §4.

### File to CREATE: `frontend/src/config/industries.data.ts`
`INDUSTRIES_LIST: IndustryPage[]` — the 12 industries you listed (Retail Pharmacy, Hospital Pharmacy, Chain Pharmacy, Medical Stores, Clinics, Hospitals, Diagnostic Centres, Pathology Labs, Dental Clinics, Physiotherapy, Pharma Distributors, Medical Equipment & Surgical Suppliers), each with `slug`, `title`, `description`, `intro`, a short list of "most relevant services" (cross-linking into both verticals — this is the internal-linking mechanism the SEO plan calls for), and 2-3 FAQs.

### Components to REUSE (structurally unchanged, only fed new data):
- `frontend/src/features/services/ServiceLandingView.tsx` — becomes the render target for both `InventoryServicePage` and `DigitalServicePage` (currently only used by the 6 old pages). **One CTA change required**: its "Start Free Assessment" + "Book Consultation – ₹499" buttons are replaced with the new Contact/Consultation CTA (no pricing shown), matching `FinalCTABanner`'s change.
- The `MarketingPageLayout`/`useSeo`/`useJsonLd` pattern underneath it — fully reused, zero changes needed.

### Components to CREATE:
- `frontend/src/pages/InventoryHubPage.tsx`, `DigitalMarketingHubPage.tsx` — thin page wrappers (existing convention) around a new shared `frontend/src/features/services/ServiceVerticalHubView.tsx` (lists that vertical's services as cards, vertical-specific hero/accent).
- `frontend/src/pages/InventoryServicePage.tsx`, `DigitalServicePage.tsx` — thin wrappers using `useParams<{ slug: string }>()`, looking up the slug in the corresponding data array, rendering `ServiceLandingView`, and rendering `NotFoundPage`'s content (or redirecting to `/404`-equivalent) on a miss.
- `frontend/src/pages/IndustriesHubPage.tsx`, `IndustryPage.tsx` + `frontend/src/features/industries/IndustryHubView.tsx`, `IndustryLandingView.tsx` (the latter modeled closely on `ServiceLandingView.tsx`, cross-linking to relevant services).

---

## 6. Blog foundation

### Content structure — CREATE `frontend/src/content/blog/`
One markdown file per post, e.g. `frontend/src/content/blog/pharmacy-inventory-audit-checklist.md`, with YAML-style frontmatter:

```markdown
---
title: "A Practical Pharmacy Inventory Audit Checklist"
slug: "pharmacy-inventory-audit-checklist"
description: "A step-by-step checklist for running an inventory audit in a retail pharmacy, from expiry checks to reconciliation."
date: "2026-08-18"
author: "Nitin Anand Consulting"
category: "Inventory & Operations"
tags: ["pharmacy", "inventory audit", "reconciliation"]
primaryKeyword: "pharmacy inventory audit"
secondaryKeywords: ["retail pharmacy stock check", "pharmacy inventory reconciliation"]
featuredImage: "/blog-images/pharmacy-inventory-audit-checklist/featured.jpg"
imageAlt: "Pharmacist checking shelf stock against an inventory list"
---

Article body in Markdown, including inline images via standard
`![alt text](/blog-images/.../inline-1.jpg)` syntax.
```

One seed/example post is created as part of Phase 1 to prove the pipeline end-to-end (content reviewed for accuracy, no medical claims — operational/inventory content only, well within NAC's actual expertise).

### Files to CREATE (blog engine — all new, nothing existing is touched except the two integration points below):
- `frontend/src/features/blog/blog.types.ts` — `BlogPostMeta`/`BlogPost` types matching the frontmatter fields you listed exactly (title, slug, description, date, author, category, tags, primaryKeyword, secondaryKeywords, featuredImage, imageAlt).
- `frontend/src/features/blog/parseFrontmatter.ts` — a small, dependency-free parser for this specific, fixed frontmatter schema (simple `key: value` + two string-array fields) — avoids adding a general-purpose YAML/frontmatter package for a schema this constrained.
- `frontend/src/features/blog/blog.registry.ts` — loads all `.md` files at build time via Vite's `import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true })`, parses each with `parseFrontmatter`, sorts by date, and exposes `getAllPosts()`, `getPostBySlug(slug)`, `getRelatedPosts(post, limit)` (same-category/shared-tag matching, computed in-memory — no new infra needed at this content volume).
- `frontend/src/features/blog/BlogIndexView.tsx` — replaces `ResourceComingSoonView` as `BlogPage.tsx`'s content; lists posts as cards (using the new `ResponsiveImage` component, §7), with category/tag filtering.
- `frontend/src/features/blog/BlogPostView.tsx` — renders one post: featured image, title/meta (author/date/category), rendered markdown body, inline images, related-articles block, breadcrumbs.
- `frontend/src/features/blog/components/BlogCard.tsx`, `RelatedArticles.tsx` — supporting presentational components.
- `frontend/src/pages/BlogPostPage.tsx` — thin wrapper, `useParams<{ slug: string }>()` → `BlogPostView`.

### Files to MODIFY:
- `frontend/src/pages/BlogPage.tsx` — renders `BlogIndexView` instead of `ResourceComingSoonView`.
- `frontend/src/app/routes.tsx` — add the `/blog/:slug` route (§1a).

### SEO auto-generation per post (uses only existing hooks, no new SEO mechanism):
- `useSeo({ title, description, path: '/blog/'+slug, ogType: 'article', image: featuredImage })` — title/description/canonical/OG/Twitter all derived from frontmatter automatically.
- `useJsonLd(...)` with an `Article` schema object (headline, image, datePublished, author) + a `BreadcrumbList` (Home → Blog → post title) — both built from frontmatter, no per-post manual JSON-LD authoring needed. `useJsonLd` already supports arbitrary objects (used today for `FAQPage`/`Service`/`BreadcrumbList` schemas), so **no changes to `useJsonLd.ts` itself are required**.
- Related articles: automatic, from `getRelatedPosts()`.
- Canonical URL: automatic, from `SITE_URL + '/blog/' + slug` (same pattern `useSeo` already uses everywhere else).

**What "adding a new post" looks like after Phase 1:** drop a new `.md` file into `frontend/src/content/blog/` with frontmatter + body (+ image files into `frontend/public/blog-images/<slug>/`) — no component or route code changes, matches your "without editing React components every time" requirement exactly.

---

## 7. Image architecture

### File to CREATE: `frontend/src/shared/components/ResponsiveImage.tsx`
A single reusable component wrapping `<img>`:
- `alt` prop **required** (TypeScript-enforced, not optional) — directly supports your "alt text" requirement structurally, not just by convention.
- `loading="lazy"` by default; a `priority` prop opts out (sets `loading="eager"` + `fetchPriority="high"`) for above-the-fold images (hero, featured blog image), mirroring the existing `fetchPriority="high"` pattern already used on the logo in `Hero.tsx`.
- Explicit `width`/`height` props required (prevents layout shift — the codebase already does this manually for the logo; this component makes it the default, not an opt-in).
- Optional `srcSet`/`sizes` props for when multiple resolutions are supplied.

**WebP/AVIF**: **not automated in Phase 1.** Automated format conversion needs a build-time image plugin (e.g. `vite-imagetools`), which is a new devDependency — per "do not install unnecessary packages," this is deferred rather than added speculatively. Phase 1's convention is: source images are exported/compressed as modern-format (WebP) files before being committed to `frontend/public/blog-images/` or `frontend/src/assets/`, with `<ResponsiveImage>` handling lazy-loading/sizing/alt-text regardless of format. Automated multi-format generation is a good Phase 2+ candidate, flagged as an open decision in §12, not assumed here.

### Convention (documented, not code-enforced): SEO-friendly filenames
`kebab-case-descriptive-name.webp` (e.g. `pharmacy-shelf-inventory-check.webp`), never `IMG_1234.jpg` — called out in a short comment at the top of `frontend/src/content/blog/` (e.g. a `README.md` inside that folder, since it's documentation for content authors, not application code) rather than enforced by a lint rule in Phase 1.

### Where this gets used:
- Every blog featured/inline image (§6).
- Any new hero/section imagery introduced on the homepage `TwoVerticalsSection`, hub pages, or industry pages, if raster images are used there (the current homepage is largely SVG/CSS/Framer-Motion-driven with no raster hero art — new imagery is optional, not required, for Phase 1's homepage).

---

## 8. About page

### File: `frontend/src/pages/AboutPage.tsx` — MODIFY
Rewritten for: NAC's pharmacy/healthcare specialization, the two-vertical story (why both inventory/operations *and* digital marketing — likely framed as "we understand how pharmacy/healthcare businesses actually run, and we understand how they grow online"), removal of assessment-product framing. References `SERVICES`/`TRUST_STATS`/`INDUSTRIES` from `landing.data.ts` today — updated to reference the new `INVENTORY_SERVICES`/`DIGITAL_SERVICES`/`INDUSTRIES_LIST` data instead. Structure (`MarketingPageLayout` usage) unchanged.

---

## 9. Contact / lead generation page

### File: `frontend/src/pages/ContactUsPage.tsx` — MODIFY (scope-limited)
**Phase 1 scope:** rewritten copy (remove "your assessment results" framing), same email/phone contact cards, same `MarketingPageLayout` structure. The "Not sure where to start? Take the free assessment" box is replaced with a Vertical-1/Vertical-2-aware prompt (e.g. "Tell us which service you're interested in when you reach out") and its CTA button changed from "Start Free Assessment" to a WhatsApp/email consultation CTA, reusing the existing `buildConsultationWhatsAppUrl()` utility (`frontend/src/shared/utils/whatsapp.ts`, unchanged) exactly as `ServiceLandingView`/`Hero`/`FinalCTABanner` already do.

**Explicitly out of scope for Phase 1:** a real, wired lead-capture *form* (name/business/industry/message → backend → email alert) as proposed in the reconstruction plan. That requires a new backend endpoint (`POST /api/v1/leads` or similar) and touches `backend/`, which this phase's instructions place off-limits ("Phase 1 is frontend reconstruction only," "do not break existing backend functionality" — adding new backend surface area is a Phase 2/backend-phase decision, not a Phase 1 one). **This is flagged as the most important functional gap carried out of Phase 1** — per the audit, the assessment submission is currently NAC's only working lead-capture mechanism, and Phase 1 deliberately unlinks it from navigation without replacing it with a new one. Until a Phase 2 lead-form backend exists, Contact page visitors convert via email/phone/WhatsApp only — functionally identical to today, just repositioned.

---

## 10. SEO foundation

### File: `frontend/index.html` — MODIFY
Full rewrite of the global, assessment-specific tags:
- `<title>`: from "Nitin Anand Consulting | Inventory, Warehouse & Operations Consulting" to a title reflecting both verticals + pharmacy/healthcare niche.
- `<meta name="description">`, `<meta name="keywords">`: rewritten (keywords tag has near-zero SEO value today but is cheap to keep accurate rather than remove).
- Open Graph `og:title`/`og:description` (currently literally "Inventory Health Assessment | Nitin Anand Consulting" / "Free Inventory Health Assessment...") and Twitter Card fields: rewritten to match.
- JSON-LD `ProfessionalService.makesOffer`: rewritten from the current 9-item assessment-era list to reflect the two verticals' actual service names (a representative subset, not necessarily all 29 — e.g. the vertical names plus 3-4 flagship services each, consistent with how schema.org `makesOffer` is typically used).
- `ProfessionalService.areaServed` (currently Mumbai/MMR/Maharashtra/India): left unchanged unless you confirm the target geography has changed — flagged in §12.
- `og:image`/`twitter:image` (currently `android-chrome-512x512.png`, a small app icon, not a real share image): left as-is for Phase 1 (a proper social share image is a design asset, not a code change) — flagged as a nice-to-have in §12.

### File: `frontend/src/config/constants.ts` — MODIFY
- `APP_NAME` ("NAC Inventory Health Assessment") rewritten to something positioning-neutral (this constant doesn't appear to be rendered anywhere user-facing per the earlier audit — used for internal/meta purposes only — verify during implementation before assuming it's safe to rewrite freely).
- `BUSINESS_INFO.services` list rewritten to match the new `index.html` JSON-LD services list (kept in sync, single source truth risk noted — see §11).
- `ROUTES` gains the new path entries from §1a; nothing removed (old entries stay valid since old routes still resolve, now via redirect).
- `REPORT_TIERS`, `CONSULTATION`, `ReportTier` type: **left in place, untouched, unused by any new component.** Not deleted — still backing the live (if unlinked) assessment/payment flow.

### Files: `frontend/public/sitemap.xml`, `frontend/public/robots.txt` — MODIFY
- **sitemap.xml**: remove `/assessment/start` (currently listed, now unlinked and not a primary conversion path); remove the 6 old service URLs, replace with the 2 new hub URLs + up to 29 new service URLs + `/industries` + up to 12 industry URLs + `/blog` + the seed blog post URL. `/faq` stays listed (page still exists, still indexable, just moved out of primary nav). At this scale (~45-50 URLs) hand-maintaining is still reasonable for Phase 1; the reconstruction plan's suggestion of a build-time sitemap generator is a good Phase 2 candidate once post volume grows, not required now.
- **robots.txt**: broaden `Disallow` to cover the entire `/assessment/` subtree (`Disallow: /assessment/`) instead of just `/questions` and `/results` — since none of the assessment/payment pages are primary product pages anymore, there's no reason to allow crawling `/assessment/start`, `/assessment/payment`, or `/assessment/thank-you` either, even though they still function.

### No changes needed: `useSeo.ts`, `useJsonLd.ts`
Both hooks are generic and already support every field/schema type this phase needs (title/description/canonical/OG/Twitter/robots via `useSeo`; arbitrary JSON-LD including `Article`, `BreadcrumbList`, `Service`, `FAQPage` via `useJsonLd`). Zero changes required — confirmed by re-reading both files during planning.

---

## 11. New dependency required (flagged explicitly, not assumed)

The blog (§6) needs to turn Markdown body text into rendered HTML. Hand-rolling a CommonMark-compliant renderer is not advisable (easy to get subtly wrong, e.g. nested lists, code fences, link edge cases). Recommended: **`marked`** (zero runtime dependencies, ~35KB, widely used, actively maintained) added to `frontend/package.json` `dependencies`.

This is the **one** new package this plan proposes. Since all blog content is authored by NAC directly in the repo (not user-submitted), rendering its output via `dangerouslySetInnerHTML` is an acceptable, standard pattern for a trusted-content static blog — not a user-input XSS surface. No other new dependencies are proposed (frontmatter parsing is hand-rolled per §6 specifically to avoid a second package; image format conversion is deferred per §7 for the same reason).

**Awaiting your go-ahead on this specific package before it's installed during implementation.**

---

## 12. Open decisions (flagged, not assumed)

1. **Old service URL redirects (§1b)**: implement the client-side `<Navigate>` redirects as proposed, or leave the 6 old routes rendering their current (soon-to-be-orphaned) content unchanged for maximum zero-risk? Redirecting is recommended (protects any existing SEO value / bookmarks) but is a slightly larger diff than doing nothing.
2. **`APP_NAME` constant rewrite**: needs a quick check during implementation for any user-facing usage before assuming it's safe to change freely (flagged in §10, not blocking the plan).
3. **`areaServed` in `BUSINESS_INFO`/JSON-LD**: keep Mumbai/MMR/Maharashtra/India, or broaden now that the niche (not geography) is the primary segmentation?
4. **Social share image** (`og:image`): currently a 512×512 app icon, not a designed share card. Worth commissioning a proper 1200×630 OG image as part of this phase, or defer?
5. **Content volume for the 29 service pages + 12 industry pages**: this plan proposes full pages (intro/benefits/FAQs) for all of them, matching the depth of the current 6 service pages. That's a substantial content-writing task (roughly 5x the current service-page content). If you'd prefer a staged rollout — e.g. full content for a handful of flagship services/industries first, lighter stub content for the rest (still real, indexable pages, just shorter) — say so before implementation starts; the data-driven template (§5) supports either depth without any code difference.
6. **WebP/AVIF automation** (§7): confirmed deferred to a later phase per the "no unnecessary packages" instruction — flagging once more here in case you'd rather approve `vite-imagetools` now instead of doing manual pre-optimized exports.

---

## 13. Summary — files touched by category

**CREATE (new files):**
`frontend/src/config/services.inventory.data.ts`, `services.digital.data.ts`, `industries.data.ts` · `frontend/src/features/services/ServiceVerticalHubView.tsx` · `frontend/src/features/industries/IndustryHubView.tsx`, `IndustryLandingView.tsx` · `frontend/src/features/landing/components/TwoVerticalsSection.tsx`, `InsightsTeaser.tsx` · `frontend/src/features/blog/blog.types.ts`, `parseFrontmatter.ts`, `blog.registry.ts`, `BlogIndexView.tsx`, `BlogPostView.tsx`, `components/BlogCard.tsx`, `components/RelatedArticles.tsx` · `frontend/src/pages/InventoryHubPage.tsx`, `InventoryServicePage.tsx`, `DigitalMarketingHubPage.tsx`, `DigitalServicePage.tsx`, `IndustriesHubPage.tsx`, `IndustryPage.tsx`, `BlogPostPage.tsx` · `frontend/src/shared/components/ResponsiveImage.tsx` · `frontend/src/content/blog/` (directory + seed post + `README.md` + `frontend/public/blog-images/` convention).

**MODIFY (existing files, content/logic changed, not deleted):**
`frontend/src/app/routes.tsx` · `frontend/src/config/constants.ts` · `frontend/src/features/landing/landing.data.ts` · `frontend/src/features/landing/LandingView.tsx` · `Navbar.tsx`, `Footer.tsx`, `Hero.tsx`, `TrustStatistics.tsx`, `WhyChooseNAC.tsx`, `IndustriesServed.tsx`, `FinalCTABanner.tsx`, `Testimonials.tsx` (copy review) · `frontend/src/features/services/ServiceLandingView.tsx` (CTA only) · `frontend/src/pages/AboutPage.tsx`, `ContactUsPage.tsx`, `BlogPage.tsx` · `frontend/src/features/resources/ResourceComingSoonView.tsx` (CTA only, still used by Case Studies/Free Downloads/Checklists/Templates) · `frontend/index.html` · `frontend/public/sitemap.xml`, `robots.txt` · `frontend/package.json` (one new dependency, §11).

**MUST REMAIN UNTOUCHED:**
Everything under `backend/` (all modules, migrations, tests, config) · `render.yaml` · `backend/.env`, `backend/.env.example` · Supabase schema/data · `frontend/.env`, `frontend/.env.example` · `frontend/src/features/assessment/**` (entire assessment engine — questions, scoring, recommendations, submission, PDF generator) · `frontend/src/features/payment/**` · `frontend/src/services/api/paymentApi.ts`, `endpoints.ts` · `frontend/src/pages/AssessmentStartPage.tsx`, `AssessmentQuestionsPage.tsx`, `ResultsPage.tsx`, `PaymentPage.tsx`, `ThankYouPage.tsx` (and their feature views) · `frontend/src/pages/FaqPage.tsx` content (only its nav position moves, page itself untouched) · `frontend/src/shared/hooks/useSeo.ts`, `useJsonLd.ts` · `frontend/src/shared/layouts/MarketingPageLayout.tsx` · `frontend/src/pages/InventoryConsultingPage.tsx` and its 5 siblings, plus `frontend/src/pages/CaseStudiesPage.tsx`, `FreeDownloadsPage.tsx`, `ChecklistsPage.tsx`, `TemplatesPage.tsx` (files kept as-is; only their route targets/redirect status change per §1b, and their shared `ResourceComingSoonView` CTA per §5).

---

## 2026-08-19 addendum — status update, not a rewrite

This plan was written as a proposal on 2026-08-18. By 2026-08-19 it had actually been implemented (§1–§10, plus the URL structure was refined mid-build to `/services/inventory-operations-consulting` and `/services/digital-marketing` under a `/services` hub, rather than the flat top-level paths originally sketched in §1a). This addendum was never updated at the time to reflect that — hence the status line at the top of this document.

**Real-photography migration (approved 2026-08-19, separate from §7's original "deferred" framing):** §7 above assumed raster hero art was optional for Phase 1. That decision was superseded — the site is migrating from SVG/CSS visuals to real commissioned photography. Work done:
- `frontend/public/images/{hero,inventory,operations,digital-marketing,strategy,industries}/` created, each with a `README.md` naming its expected filename (images themselves are supplied separately — never fabricated as SVG/stock/AI substitutes).
- `Hero.tsx`/`HeroVisualPremium.tsx`, `TwoVerticalsSection.tsx`, `OperationsSection.tsx`, `DigitalMarketingSection.tsx` all render real photos via `ResponsiveImage` (no SVG illustration dependency).
- `WhyChooseNAC.tsx` gained a photo slot (`/images/strategy/healthcare-business-consulting.webp`) — the plan's original 6 homepage sections didn't include a dedicated "Strategy" section, so this was the closest natural fit for that image.
- `ResponsiveImage.tsx` now shows a dev-only, text-only "Image pending: `<path>`" placeholder (dashed border, no illustration) when a referenced file 404s, so a missing asset is obvious while building and invisible to real visitors in production.
- `IndustriesServed.tsx` and the industries data/pages are unchanged — still icon-based, per instruction, until/unless that's revisited.
- `HeroVisual.tsx`, `HeroVisualBalanced.tsx`, `ReportPreview.tsx`, `Services.tsx` (landing) remain on disk, unused, not deleted — archival decision deferred.
