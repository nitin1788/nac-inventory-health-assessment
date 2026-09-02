# NAC Website — SEO Readiness Audit

**Date:** 2026-08-21 (audit), **updated 2026-08-21** with two same-day implementation passes — see §0.1 (Must Fix items) and §0.3 (Should Fix items: analytics, sitemap automation, breadcrumbs, contact form review, remaining photography) below.
**Scope:** Read-only technical + on-page SEO audit of the live `nac-inventory-assessment` repo (frontend, `frontend/src`, `frontend/public`), as it stands after the Phase 1 pharmacy/healthcare repositioning (`NAC_PHASE_1_IMPLEMENTATION_PLAN.md`, implemented 2026-08-19, working tree clean, all committed).
**Method:** Full inspection of routing, SEO hooks, global tags, robots/sitemap, all page components, service/industry/blog data files, images, and internal linking. No files modified, no commits made.
**Business positioning used to evaluate every page:** Nitin Anand Consulting (NAC) — a **consulting company**, not a pharmacy or healthcare provider — serving pharmacy, healthcare, and allied businesses across two distinct verticals: (1) Inventory & Operations Consulting, (2) Digital Marketing & Growth.

> **The tables and findings below (§1–§19) are the original audit as written and are kept as a historical record.** Several of the issues they describe have since been fixed — each fixed row is annotated inline with a "✅ FIXED 2026-08-21" note, but the original text is left in place rather than rewritten. **§0.1 immediately below is the authoritative summary of current state.** Nothing was committed or pushed as part of either pass.

---

## 0.1 Implementation update — 2026-08-21 (same-day follow-up)

All **Must Fix Before SEO** items from §18.B were implemented, plus one issue not caught by the original audit (see below). `npm run lint` and `npm run build` both pass clean. No keyword optimization or blog content work was started, per instruction. Nothing committed or pushed.

**Fixed:**

1. **`/faq` rewritten** — all 12 questions now cover NAC's actual positioning (what NAC does, both verticals, which industries, engagement process). Zero remaining references to the assessment product. `FAQPage` schema kept, now describing real, current content. *File: `frontend/src/pages/FaqPage.tsx`.*
2. **Image pipeline fixed** — all 18 `*.webp.png` files (real PNG data mislabeled) converted to genuine, compressed WebP at correct paths, plus `-800w.webp` mobile variants wired into `srcSet`/`sizes` on every consuming page. Total weight for these files: **37.5MB → 2.9MB** (both resolutions combined). *Script: `frontend/scripts/optimize-images.mjs`. Files: `frontend/public/images/**`.*
3. **A more serious issue than file weight was found during the image work and fixed**: several of the "real photography" files have **fabricated statistics, a fabricated named doctor, and a fabricated distributor company name baked directly into the image pixels** — not something a CSS crop can hide, since the raw files remain directly and publicly servable at their full resolution regardless of how they're displayed. This is a live no-fake-statistics/no-fake-claims violation the original audit's page-level review didn't catch (it checked alt text and file existence, not actual image content). See §0.2 below for full detail — this was addressed by unwiring the affected files (not deleting them) so nothing fabricated is servable, while preserving every clean photo as-is.
4. **4 orphaned Resources pages rewritten** — `CaseStudiesPage.tsx`, `FreeDownloadsPage.tsx`, `ChecklistsPage.tsx`, `TemplatesPage.tsx` copy updated from "manufacturing, distribution, and retail operations" / generic "warehouse" language to the pharmacy/healthcare positioning. Kept as `noindex` "coming soon" pages (still no real content) rather than removed — they're legitimate future content buckets for the blog-led strategy. Now also **linked from the Footer** (a new "Resources" column), closing a gap where they were reachable by URL but not discoverable via navigation.
5. **`/assessment/start` now `noindex`** — the one page in the legacy assessment flow that was missing it, now consistent with its siblings. *File: `frontend/src/features/assessment/AssessmentStartView.tsx`.*
6. **Real server-level 301 redirects added** for all 11 legacy URLs (previously client-side `<Navigate>` only, which works for Googlebot but not for tools/crawlers that don't execute JS). *File: `frontend/vercel.json`.* The client-side redirects were left in place too (harmless, extra safety net for non-Vercel hosting).
7. **Reverse internal linking added**: service pages now link to their relevant industries (industries already linked to services; this closes the loop the other direction). New "Relevant For These Industries" section on every service page. *Files: `frontend/src/config/industries.data.ts` (new `getIndustriesForService()` helper), `frontend/src/features/services/ServiceLandingView.tsx`.*
8. **Old-content audit**: searched the full frontend for "Inventory Health Assessment," "52 diagnostic questions," "PayU," old pricing, etc. outside the FAQ/Resources pages already fixed above. Everything else found (in `constants.ts`, `landing.data.ts`, `whatsapp.ts`) is dead code with zero importers from any live, routed page — it backs the intentionally-preserved-but-unlinked legacy assessment/payment flow (per the Phase 1 plan's explicit "don't delete, just unlink" guardrail) and isn't reachable by a visitor or crawler. Left untouched, matching the instruction to only touch **public** content.

**Not changed (flagged, not silently skipped):**
- Soft-404 behavior (Vercel's catch-all rewrite returning HTTP 200 for unmatched paths) — left as-is. The `NotFoundPage` already sets `noindex`, which is Google's own documented recommendation for client-rendered SPAs without server-side routing; building a real HTTP 404 would require a serverless function / architecture change, which is out of scope ("don't migrate frameworks," "don't introduce unnecessary complexity").
- CSR-only rendering (no SSR/prerendering) — unchanged, same reasoning; a framework-level change, explicitly out of scope.
- Visible breadcrumb UI (JSON-LD `BreadcrumbList` already present everywhere) — still a **Should Fix**, not done in this pass.
- `/contact` still has no wired lead-capture form — unchanged, already flagged as the biggest functional gap in the Phase 1 plan itself; out of scope for this SEO-focused pass (needs a new backend endpoint).
- Sitemap automation — unchanged; still hand-maintained, still in sync today (verified), still a **Should Fix** once blog volume grows.

## 0.2 New finding: fabricated content baked into photo files

While auditing the image files for §0.1 item 2/3, direct visual inspection (not just alt text/metadata) surfaced fabricated content in **7 of the 17 real photos**, live on the site at the time:

| File | Where it was used | Problem |
|---|---|---|
| `strategy/nac-healthcare-business-strategy.webp` | Homepage, `WhyChooseNAC.tsx` | Fabricated "NAC Impact Summary" slide: invented +28%/+35%/-20%/+40% results attributed to NAC itself |
| `inventory/nac-pharmacy-inventory-consulting.webp` | Homepage, `TwoVerticalsSection.tsx` card | Fabricated "Inventory Health Report" with invented SKU counts, presented as a real deliverable |
| `digital-marketing/nac-healthcare-digital-marketing.webp` | Homepage, `TwoVerticalsSection.tsx` + `DigitalMarketingSection.tsx` | Fabricated "Digital Marketing Performance" dashboard: invented traffic/leads/cost-per-lead numbers |
| `industries/nac-hospital-operations-consulting.webp` | `/industries/hospitals` | Fabricated "Hospital Operations Overview" dashboard (325 patients, 78% occupancy, etc.) |
| `industries/nac-diagnostic-centre-operations-consulting.webp` | `/industries/diagnostic-centres` | Fabricated "Daily Operations Overview" dashboard (128 test count, 45 min TAT, 92%) |
| `industries/clinic-operations-consulting.webp` | `/industries/clinics` | Fabricated named doctor badge ("Dr. Rohan Mehta") |
| `industries/nac-pharma-distributor-warehouse-consulting.webp` | `/industries/pharma-distributors` | Fabricated distributor company name/logo ("SUREMED DISTRIBUTORS") on staff uniforms |

A prior implementation pass had already noticed two of these (Hospitals, Diagnostic Centres) and tried to hide the fabricated dashboards with a tight CSS `objectPosition` crop — that only affects the rendered page. The raw file at its public URL is unaffected and still fully legible to anyone opening it directly or to an image crawler, so it didn't actually resolve the violation.

**Fix applied:** all 7 files were **unwired** from the pages/components that referenced them (not deleted — kept on disk, optimized). The affected components fall back to layouts that already existed or were added for this purpose:
- 4 industries (`clinics`, `hospitals`, `diagnostic-centres`, `pharma-distributors`) → the existing text-only industry-hero fallback (already supported by `IndustryLandingView.tsx` for any industry without an `image`).
- `WhyChooseNAC.tsx` → centered text-only section (image column removed).
- `TwoVerticalsSection.tsx` → both card thumbnails removed, cards now start directly with their icon (symmetric — neither card singled out).
- `DigitalMarketingSection.tsx` → centered text-only layout (previously mirrored `OperationsSection.tsx`'s two-column layout; that visual parity is now broken until a replacement photo exists — flagged below).

**The other 10 of 17 photos were checked and are clean** — no fabricated numbers or names — and were kept, wired in, and optimized normally: hero, operations, and 8 of the 12 industry photos (retail pharmacy, hospital pharmacy, chain pharmacy, medical stores, pathology labs, dental clinics, physiotherapy centres, medical equipment & surgical suppliers).

**Flagged for the user, not resolved here:** a real, clean digital-marketing photo (no on-screen fabricated numbers) would let `DigitalMarketingSection.tsx` go back to its original two-column layout, restoring visual parity with `OperationsSection.tsx`. Same for the 4 unwired industry photos and the inventory/strategy homepage photos, if the user wants those slots to carry a photo again — they'd need genuinely clean replacement photography, not a re-crop of the existing files. Full detail and file-by-file notes are in `frontend/public/images/**/README.md`.

---

## 0.4 Implementation update — 2026-09-02 (correction + follow-up)

A gap in §0.1 item 2's claim was found and closed, and the sitemap-automation wiring described in §0.3 item 2 is now actually connected to the build. Nothing committed or pushed.

1. **Hero image was still missing responsive `srcSet`.** §0.1 item 2 (2026-08-21) said `-800w.webp` mobile variants were "wired into `srcSet`/`sizes` on every consuming page" — `HeroVisualPremium.tsx` was the one exception: it still pointed at the mislabeled `nac-hero-consultant.webp.png` filename with no `srcSet` at all (leftover fixed-`width`/`height` markup from before the image pipeline fix). Since this is the homepage's `priority`/LCP image, it was the highest-impact file to have missed. **Fixed now**: switched to the real `nac-hero-consultant.webp` file, added `srcSet={buildResponsiveSrcSet(...)}` (new shared helper, `frontend/src/shared/utils/responsiveImage.ts`, also used by `OperationsSection.tsx` and `IndustryLandingView.tsx`, which already had it correctly), and corrected the intrinsic dimensions from the old PNG's `1672×941` to the real WebP's `1600×900`. *File: `frontend/src/features/landing/components/HeroVisualPremium.tsx`.*
2. **Sitemap generator now actually wired into `npm run build`.** `frontend/scripts/generate-sitemap.mjs` imports the site's TypeScript data modules directly (`services.inventory.data.ts`, `services.digital.data.ts`, `industries.data.ts`, `constants.ts`, plus a direct read of the blog content directory for posts), so the sitemap can never drift from the real route/data source of truth. This requires the `tsx` runtime (plain `node` can't import `.ts` files) — added as a new `devDependency`, with a new `generate-sitemap` script in `frontend/package.json` and `build` now running it before `tsc -b && vite build`. `public/sitemap.xml` was regenerated with this script and matches the current 54-page indexable set.
3. **`Analytics.tsx`'s planned `consultation_cta_click` split was removed as dead logic.** Every WhatsApp CTA site-wide currently renders identical visible text ("Chat on WhatsApp"), so the text-based classification never actually distinguished a "consultation" click from a generic one — that branch never fired. All WhatsApp link clicks now emit a single `whatsapp_click` event (alongside `phone_click`/`email_click`), with a code comment noting a future distinct CTA should be tracked via an explicit marker (e.g. `data-cta`) rather than matching on visible text. *File: `frontend/src/app/Analytics.tsx`.*

The corresponding claims in `NAC_TECHNICAL_SEO_FINAL_REPORT.md` (Phase 14, Phase 15, Phase 19) are corrected the same way in that report's own 2026-09-02 addendum.

---

## 0.3 Implementation update — 2026-08-21 (second same-day pass: remaining high-value gaps)

Closing the remaining §18.C "Should Fix" items ahead of keyword/content work, per instruction. `npm run lint` and `npm run build` both pass clean (build now also regenerates the sitemap — see below). No keyword optimization or blog content work was started. Nothing committed or pushed.

### 1. Analytics — structure built, dormant until a real ID is supplied

Added `src/app/Analytics.tsx`, mounted once in `App.tsx` alongside the existing `ScrollManager`. It reads `VITE_GA4_MEASUREMENT_ID` (new env var, `src/config/env.ts` + `.env.example`) and:
- **If unset (the default today): does nothing.** No `<script>` tag, no cookie, no network request — verified by grepping the production build output (`dist/index.html` and `dist/assets/*.js`) for `googletagmanager`/`gtag` after a full `npm run build`; zero matches in the HTML shell. This keeps the Privacy Policy's current, accurate statement ("we do not currently use advertising or analytics cookies") true until analytics is actually turned on.
- **If set:** loads GA4's `gtag.js`, and sends a `page_view` event on every React Router navigation (since this is a client-rendered SPA, route changes aren't real page loads — `send_page_view: false` is set on the initial config call and pageviews are sent manually, keyed off `location.pathname`).

**No fake/placeholder ID was added anywhere** — `VITE_GA4_MEASUREMENT_ID` is blank in `.env.example`, with a comment explaining exactly where to get the real one (GA4 property → Admin → Data Streams → your web stream → "Measurement ID", format `G-XXXXXXXXXX`) and where to set it (Vercel project environment variables for production).

**Exact item requiring your input:** ⬜ **Provide the real GA4 Measurement ID** (Vercel env var `VITE_GA4_MEASUREMENT_ID` for production, and optionally in a local `.env` for testing). Once set, analytics activates automatically on the next deploy — no further code change needed. **Also update the Privacy Policy's "Cookies & Tracking" section** (`src/pages/PrivacyPolicyPage.tsx`) at that point, since its current "no analytics" claim will no longer be accurate.

### 2. Sitemap automation — done, wired into the build

`frontend/scripts/generate-sitemap.mjs` (new) uses Vite's own `ssrLoadModule` (no new dependency — Vite is already a devDependency) to import the actual data modules that drive the site's routes — `services.inventory.data.ts`, `services.digital.data.ts`, `industries.data.ts`, `blog.registry.ts` — and generates `public/sitemap.xml` from their real `path`/`slug` fields. `package.json`'s `build` script now runs it first: `"build": "node scripts/generate-sitemap.mjs && tsc -b && vite build"`, so every production build writes a fresh sitemap before Vite copies `public/` into `dist/` — **verified**: `diff public/sitemap.xml dist/sitemap.xml` after a full build shows no difference.

What's automatic (can never drift from the real site again): all 18 inventory-vertical service pages, all 12 digital-marketing service pages, all 12 industry pages, and every blog post — a new `.md` file dropped into `src/content/blog/` now appears in the sitemap on the next build with zero manual editing, closing the exact gap the original audit (§12) flagged.

What's still a short, explicit, hand-maintained list (documented at the top of the script, same convention as `NAV_LINKS`/`RESOURCE_LINKS`): the 9 genuinely static marketing pages (home, services hub, industries hub, blog index, about, faq, contact, privacy policy, terms). These change rarely and aren't the source of the drift risk the audit identified. **Correctly excludes** (never listed in the script, by construction): every `/assessment/*` route, the 4 `noindex` Resources "coming soon" pages, and every legacy/redirect-only URL (`/contact-us`, `/inventory-consulting`, etc.) — output verified at 54 URLs, matching the previous hand-maintained count exactly with none of the excluded routes present.

Added a standalone `npm run generate-sitemap` script too, for regenerating it without a full production build.

### 3. Breadcrumbs — done, visible trail added, matched 1:1 to JSON-LD

New shared `src/shared/utils/breadcrumbs.ts` (`buildBreadcrumbJsonLd()`) and `src/shared/components/Breadcrumbs.tsx` — one item array (`{ label, path }[]`) feeds both the visible UI and the `BreadcrumbList` schema, so they're structurally guaranteed to match (the same array is passed to both, not hand-copied twice). Wired into every inner-page template that previously had schema-only breadcrumbs:

- `MarketingPageLayout.tsx` → About, FAQ, Contact, Privacy Policy, Terms (2-level: Home → Page)
- `ServicesHubView.tsx`, `IndustryHubView.tsx`, `BlogIndexView.tsx`, both `ServiceVerticalHubView.tsx` hub pages (2-level)
- `ServiceLandingView.tsx` (all 30 service pages), `IndustryLandingView.tsx` (all 12 industry pages), `BlogPostView.tsx` (3-level: Home → Section → Page)

**Homepage correctly has none** — verified live (`document.querySelector('nav[aria-label=Breadcrumb]')` returns `null` on `/`). **Spot-checked 5 page types live** (a service page, an industry page, the blog post, About, and `/services`) — visible trail text and the JSON-LD `BreadcrumbList` `name` values are identical in every case, e.g. `/services/inventory-operations-consulting/inventory-audit` shows and schemas exactly "Home › Inventory & Operations Consulting › Inventory Audit". `BlogPostView.tsx`'s previous hand-rolled breadcrumb markup was replaced with the shared component (same visual result, now schema-guaranteed to match instead of two independently-maintained copies).

### 4. Contact form — STOPPED, per instruction. Nothing built. Here's exactly what's missing.

**No backend endpoint for form submissions exists.** Checked `backend/src/routes/index.ts` directly: the only mounted routes are `/health`, `/assessments`, `/reports`, `/payments` — there is no `/leads`, `/contact`, or `/enquiry` route, and no matching controller/service/validation module anywhere in `backend/src/modules/`. Per instruction ("do not invent a backend endpoint... STOP and tell me exactly what is missing rather than creating a fake working form"), **`ContactUsPage.tsx` was left unchanged** — the existing email/phone/WhatsApp contact cards remain the only conversion path, so nothing on the live site is misleading about what actually works.

**What already exists and is reusable** (so the eventual build is smaller than "from scratch"): `backend/src/modules/email/email.service.ts` already sends an internal "new lead" alert email on every assessment submission, to `NAC_LEAD_ALERT_EMAIL` via Resend — the exact mechanism a contact-form submission would reuse, just triggered from a new route instead of the assessment flow.

**Exactly what's missing, for when you're ready to build this:**
1. **Backend**: a new `POST /api/v1/leads` route + controller + Zod validation schema (name, business name, phone, email, business type, service required, message) + a repository/service call that sends the lead-alert email (reusing the existing Resend wiring) — modeled directly on the existing `assessments` module's structure.
2. **Frontend**: a form component on `ContactUsPage.tsx` (React Hook Form + Zod, matching the pattern already used in `CompanyInfoForm.tsx`) with the 7 suggested fields, calling a new `POST` function in `src/services/api/` (mirroring `assessmentApi.ts`), on submit.
3. **Decision needed from you**: should this data also persist to Supabase (a new `leads` table + migration), or is the email alert sufficient on its own? The existing `assessments`/`companies` tables are a precedent either way.
4. Optional but recommended alongside: wire Cloudflare Turnstile (declared in both `.env.example` files, never actually connected to any request path) on this new form specifically, since a public lead form is the most likely target for spam submissions.

None of this was built. This is scoped out for a future pass once you confirm the approach (in particular #3).

### 5. Remaining photography — reviewed, no changes needed

Re-checked the disposition of every photo still wired into the site as of this pass (from §0.2's original fabricated-content review): hero (`HeroVisualPremium.tsx`) and operations (`OperationsSection.tsx`), plus the 8 of 12 industry photos that were kept (retail pharmacy, hospital pharmacy, chain pharmacy, medical stores, pathology labs, dental clinics, physiotherapy centres, medical equipment & surgical suppliers). **None contain fabricated statistics, fake branding, or fake people/companies** — confirmed by direct visual inspection in the prior pass, not just alt-text/metadata review. Per instruction ("only replace an image if the audit confirms it still contains fabricated... content" / "do NOT replace good professional photography unnecessarily"), **no images were touched in this pass.** The 7 files unwired in §0.2 (fabricated content) remain unwired and on disk, unchanged.

---

## 0. Executive summary

The Phase 1 rebuild is a genuinely strong SEO foundation — better than most sites at this stage. Every service page (30), every industry page (12), the two vertical hubs, and the homepage have unique titles, unique meta descriptions, single H1s, logical H2/H3 hierarchy, real (non-fabricated) FAQ content with `FAQPage` schema, `BreadcrumbList` schema, and consistent internal cross-linking between industries and services. The blog architecture (Markdown + frontmatter → `Article`/`BreadcrumbList` schema, canonical, related posts) is sound and matches what was proposed in the reconstruction plan.

However, three things would actively hurt the site once a keyword/content campaign starts and are flagged **Must Fix Before SEO**:

1. **`/faq` is fully indexed and still 100% about the discontinued free assessment product** — wrong positioning, on a page with `FAQPage` structured data, in the sitemap, with no `noindex`.
2. **Every real photograph on the site (hero, industries, operations, digital marketing, strategy) is a 1.8–2.3 MB PNG mislabeled with a `.webp.png` filename** — not actually WebP, no responsive `srcset`, no compression pipeline. This is a serious Core Web Vitals (LCP) risk, particularly for mobile "near me" searches.
3. **The four orphaned Resources pages (`/case-studies`, `/free-downloads`, `/checklists`, `/templates`) still describe "manufacturing, distribution, and retail operations"** — directly contradicting the pharmacy/healthcare-only positioning, even though they're currently `noindex` and unlinked.

Everything else is Should Fix / Optional. See §17 for the full score breakdown and §18–19 for the prioritized action plan.

**Overall SEO readiness: 74 / 100** — strong architecture, blocked from "ready to launch a keyword campaign" status by the three items above.

---

## 1. Full page inventory

### 1a. Core / unique pages

| URL | Purpose | Title | Meta description | H1 | Canonical | Index? | JSON-LD | Primary topic | Issues |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Homepage | `Nitin Anand Consulting \| Inventory & Operations Consulting + Digital Marketing for Pharmacy & Healthcare` | "Nitin Anand Consulting specializes in pharmacy, healthcare, and allied businesses — Inventory & Operations Consulting and Digital Marketing & Growth from one partner who understands both." | "Pharmacy & Healthcare Business Growth, Built Around Your Business" | ✅ `/` | index | none (page-level; relies on global `index.html` `ProfessionalService`+`WebSite` graph) | Brand + two-vertical positioning | Title is 95 chars — long for SERP display (~60-char visible limit), will truncate. No page-level `BreadcrumbList`/`Organization` JSON-LD injected by the homepage itself (only the global `index.html` graph applies). |
| `/services` | Services hub (compares both verticals) | `Services \| Inventory & Operations Consulting + Digital Marketing \| Nitin Anand Consulting` | "Two specialized service verticals for pharmacy, healthcare, and allied businesses: Inventory & Operations Consulting, and Digital Marketing & Growth." | "Two Specialized Verticals" | ✅ | index | `BreadcrumbList` | Services overview | Title 92 chars — will truncate in SERP. |
| `/services/inventory-operations-consulting` | Vertical 1 hub | `Inventory & Operations Consulting \| Nitin Anand Consulting` | Custom per hub (pharmacy/healthcare operations framing) | "Inventory & Operations Consulting" | ✅ | index | `BreadcrumbList` | Vertical 1 overview | Fine. |
| `/services/digital-marketing` | Vertical 2 hub | `Digital Marketing & Growth \| Nitin Anand Consulting` | Custom per hub | "Digital Marketing & Growth" | ✅ | index | `BreadcrumbList` | Vertical 2 overview | Fine. |
| `/industries` | Industries hub | `Industries We Serve \| Nitin Anand Consulting` | "Nitin Anand Consulting specializes in pharmacy, healthcare, and allied businesses — retail and hospital pharmacies, clinics, hospitals, diagnostic centres, labs, and more." | "Pharmacy, Healthcare & Allied Businesses" | ✅ | index | `BreadcrumbList` | Industries overview | Fine. |
| `/about` | About | `About Us \| Nitin Anand Consulting — Pharmacy & Healthcare Consulting` | Custom, mentions both verticals | "About Nitin Anand Consulting" | ✅ | index | `BreadcrumbList` | Brand/credibility | Fine — correctly references 16+ years, both verticals, no fabricated claims. |
| `/contact` | Contact / lead gen | `Contact Us \| Nitin Anand Consulting` | Custom | "Contact Us" | ✅ | index | `BreadcrumbList` | Conversion | **Not a real lead-capture form** — mailto/tel/WhatsApp links only (explicitly deferred in Phase 1, §9 of the implementation plan). No conversion tracking possible without a form + analytics. |
| `/contact-us` | Legacy contact URL | — | — | — | n/a | n/a (redirect) | n/a | — | 301-equivalent client-side `<Navigate>` to `/contact`. Correct pattern, though a client-side redirect is weaker than a real HTTP 301 — see §3. |
| `/faq` | FAQ | `Frequently Asked Questions \| Nitin Anand Consulting` | "Answers to common questions about the free Inventory Health Assessment, your scored report, data privacy, and how the process works." | "Frequently Asked Questions" | ✅ | **index** | `FAQPage` | **Old assessment product** | 🔴 **CRITICAL — see §12.1.** Entirely about the discontinued free assessment; indexed with `FAQPage` schema. |
| `/privacy-policy` | Legal | `Privacy Policy \| Nitin Anand Consulting` | Custom | "Privacy Policy" | ✅ | index | `BreadcrumbList` | Legal | Mentions "our legacy inventory diagnostic tool" — correctly updated for current state, not a positioning problem. |
| `/terms-and-conditions` | Legal | `Terms & Conditions \| Nitin Anand Consulting` | Custom | "Terms & Conditions" | ✅ | index | `BreadcrumbList` | Legal | Correctly rewritten, references service/industry/blog content generically. Fine. |
| `/blog` | Blog index | `Insights & Blog \| Nitin Anand Consulting` | "Practical articles on pharmacy and healthcare inventory, operations, and digital marketing from Nitin Anand Consulting." | "Pharmacy & Healthcare Inventory and Digital Growth Insights" | ✅ | index | `BreadcrumbList` | Content hub | Fine. Category filter is client-side only (no separate crawlable category URLs — see §11). |
| `/blog/pharmacy-inventory-audit-checklist` | Blog post (only published post) | `A Practical Pharmacy Inventory Audit Checklist \| Nitin Anand Consulting` | From frontmatter, unique | "A Practical Pharmacy Inventory Audit Checklist" | ✅ | index | `BreadcrumbList` + `Article` | pharmacy inventory audit | Well-built; internal links to 2 service pages in the body. Featured image is an SVG, not a real photo (see §8). |
| `/case-studies`, `/free-downloads`, `/checklists`, `/templates` | Orphaned "Resources" placeholders | `<Label> \| Nitin Anand Consulting` | Generic "Coming soon" copy | `<Label>` | ✅ (self) | **noindex** | `BreadcrumbList` | n/a — placeholder | 🟠 **HIGH — see §12.2.** `previewCopy` still says "manufacturing, distribution, and retail operations" / generic "warehouse operations" / "warehouse tasks" — contradicts the pharmacy/healthcare-only positioning. Correctly `noindex` and currently unlinked from Navbar/Footer (verified — `RESOURCE_LINKS` in `landing.data.ts` is defined but not rendered anywhere), so crawl exposure is low today, but the copy is live if reached directly. |
| `/assessment/start`, `/assessment/questions`, `/assessment/results`, `/assessment/payment`, `/assessment/thank-you` | Legacy assessment/payment flow (unlinked, not deleted) | Various, all "Inventory Health Assessment"-branded | Various | Various | n/a | `/assessment/questions`, `/results`, `/payment`, `/thank-you` set `noindex`; **`/assessment/start` does not** (see §12.3) | none page-specific | Legacy product | Entire subtree is `Disallow: /assessment/` in `robots.txt` (good), but `/assessment/start` lacking its own `noindex` meta is an inconsistency — if this URL is ever linked/bookmarked externally, robots.txt blocks *crawling* it but does not prevent it appearing as a bare URL in search results. |
| `*` (404) | Not found | `Page Not Found \| Nitin Anand Consulting` | Static | "Page not found" | self (`location.pathname`) | noindex | none | n/a | Correctly `noindex`. See §3 for the soft-404 (HTTP 200) issue underneath this. |

### 1b. Inventory & Operations Consulting service pages (18, template-driven)

All 18 render through `ServiceLandingView.tsx`, fed by `frontend/src/config/services.inventory.data.ts`. **Every entry has a genuinely unique `title`, `metaDescription`, `intro`, `services` list, `benefits`, and 2 real FAQs** — this is not a thin/duplicate-content pattern; verified by reading the full data file.

- **URL pattern:** `/services/inventory-operations-consulting/<slug>`
- **Title pattern:** `{service.title} | Nitin Anand Consulting` (e.g. "Inventory Audit | Nitin Anand Consulting" — 41 chars, well within SERP limits)
- **H1:** `{service.title}` (single, matches title tag minus brand suffix — good keyword alignment)
- **H2s:** "What's Included" → "Why It Matters" → "Frequently Asked Questions" → "Related Services" (identical structure across all 18, which is expected/correct for a template — content under each H2 is unique per page)
- **Canonical:** self, via `service.path`
- **Index:** all indexed, no `noindex`
- **JSON-LD:** `BreadcrumbList` + `FAQPage` (from the page's own real FAQs) + `Service` — all three, every page
- **Internal links out:** hub breadcrumb link, 3 "Related Services" cards (same-vertical, rotating window — see §9), Contact CTA, WhatsApp CTA
- **Slugs:** `inventory-audit`, `stock-verification`, `inventory-reconciliation`, `inventory-analysis`, `abc-analysis`, `fsn-analysis`, `expiry-near-expiry-analysis`, `dead-stock-analysis`, `slow-moving-stock-analysis`, `stock-optimization`, `fefo-implementation`, `reorder-min-max`, `purchase-analysis`, `operations-audit`, `sop-development`, `process-improvement`, `kpi-mis-dashboards`, `pharmacy-store-warehouse-operations`
- **Issues:** none structural. All 18 slugs are present in `sitemap.xml` and match the data file exactly (verified) — no drift today.

### 1c. Digital Marketing & Growth service pages (12, template-driven)

Same template/mechanism as §1b, fed by `services.digital.data.ts`, at `/services/digital-marketing/<slug>`.

- **Slugs:** `website-development`, `landing-pages`, `seo`, `local-seo`, `google-business-profile`, `social-media-management`, `social-media-content`, `ai-content-creation`, `google-ads`, `meta-ads`, `ppc-performance-marketing`, `analytics-conversion-tracking`
- Each has unique title/meta/intro/benefits/FAQs. "PPC" and "Analytics" were deliberately merged with adjacent overlapping services (documented in-code) specifically to **avoid** thin/duplicate pages — good practice.
- All 12 slugs match `sitemap.xml` exactly.
- **Issues:** none structural.

### 1d. Industry pages (12, template-driven)

Render through `IndustryLandingView.tsx`, fed by `industries.data.ts`, at `/industries/<slug>`.

- **Title pattern:** `{industry.name} | Nitin Anand Consulting`
- **Meta description:** unique per industry (`metaDescription` field, distinct copy — not a mail-merge template)
- **H1:** `{industry.name}`
- **H2s:** "Relevant Services for {industry.name}" → "Frequently Asked Questions"
- **JSON-LD:** `BreadcrumbList` + `FAQPage` (real, industry-specific FAQs)
- **Internal links out:** 4 curated `relevantServices` links per industry, cross-linking into **both** verticals (this is the site's primary industry↔service internal-linking mechanism, and it works well — e.g. Retail Pharmacy links to Inventory Audit + Expiry Analysis + Local SEO + Google Business Profile)
- **Slugs:** `retail-pharmacy`, `hospital-pharmacy`, `chain-pharmacy`, `medical-stores`, `clinics`, `hospitals`, `diagnostic-centres`, `pathology-labs`, `dental-clinics`, `physiotherapy-centres`, `pharma-distributors`, `medical-equipment-suppliers`
- All 12 match `sitemap.xml` exactly.
- **Issues:** Real photography exists for most industries (see §8 for the format/weight problem); no reverse link from service pages back to relevant industries (one-directional linking — see §9).

---

## 2. Technical SEO

| Item | State | Severity if issue |
|---|---|---|
| `robots.txt` | `Allow: /`, `Disallow: /assessment/`, points to sitemap. Correct and current. | ✅ OK |
| `sitemap.xml` | 46 static URLs, hand-maintained. **Verified in sync** with the actual route/data-file slugs today (no drift). | ✅ OK now, ⚠️ process risk — see §12/§15 |
| Canonical URLs | `useSeo.ts` sets a `<link rel="canonical">` on every page via `SITE_URL + path`, restored on unmount. Consistent, no trailing-slash inconsistency (no route ends in `/` except root). | ✅ OK |
| HTTPS | `SITE_URL = 'https://nitinanandconsulting.in'` used everywhere; Vercel provides automatic TLS for custom domains. **Not independently verified live in this audit** (no browser access) — confirm certificate/redirect (http→https) manually. | ⚠️ Verify manually |
| Redirects | 6 legacy service URLs + `/contact-us` + 2 legacy vertical URLs all use React Router `<Navigate replace>` — **client-side redirects, not real HTTP 301s.** A JS-rendering crawler (Googlebot) follows these fine; anything relying on server-side redirect headers (some SEO tools, older crawlers, link-equity-sensitive third-party analysis) will not see a 301. | 🟡 Medium |
| 404 handling | `NotFoundPage` renders correctly client-side with `noindex`, **but** `vercel.json`'s catch-all rewrite (`"/(.*)" → "/index.html"`) means the server response for *any* unmatched path is **HTTP 200**, not 404. This is a classic **soft-404** pattern for a CSR SPA. Googlebot is generally good at detecting soft 404s via content analysis, but other crawlers/tools/monitoring won't get a real 404 status. | 🟡 Medium |
| Rendering / indexability | Pure client-side React SPA — **no SSR, no SSG, no prerendering.** Content only appears after JS execution. Googlebot's evergreen renderer generally handles this, but indexing is slower (two-wave: crawl → render → index) and non-Google crawlers (Bing historically weaker at JS rendering, LinkedIn/Slack/WhatsApp link-preview bots, some AI crawlers) may see an empty shell. All social share previews rely on the *static* tags baked into `index.html` at request time (title/description/OG are correct there for the homepage only — every other page's OG tags are injected client-side by `useSeo`, so a share of `/services/inventory-operations-consulting/inventory-audit` on WhatsApp/Slack/LinkedIn will likely show the **homepage's** OG data, not that page's, because those bots don't execute JS). | 🟠 **High** for social sharing of deep links; Medium for organic search itself |
| URL structure | Clean, kebab-case, logical hierarchy (`/services/<vertical>/<service>`, `/industries/<industry>`, `/blog/<slug>`). No query strings, no session IDs in URLs. | ✅ OK |
| Trailing slashes | Consistent — no route uses a trailing slash. | ✅ OK |
| Internal linking / crawlable nav | Navbar mega-menu and Footer both use real `<Link>` (anchor-rendered by React Router), not JS-only `onClick` navigation — crawlable. | ✅ OK |
| Lazy loading (routes) | Every route except the homepage is `React.lazy`-loaded behind one `<Suspense>` — reduces initial JS bundle, good for LCP/TBT on the homepage specifically. | ✅ OK |
| Lazy loading (images) | `ResponsiveImage.tsx` defaults every image to `loading="lazy"` unless `priority` is explicitly set (hero/featured images). Blog inline images also get `loading="lazy"` via the custom `marked` renderer. **This is correctly implemented** — a clear improvement over the pre-Phase-1 state (which had exactly one `loading="lazy"` in the whole codebase). | ✅ OK |
| Responsive images | **No `srcSet`/`sizes`/`<picture>` anywhere.** Every image is a single fixed-resolution file served to every viewport (desktop and mobile phone alike). | 🔴 **High — see §8** |
| Image format/weight | Real photography is committed as full-resolution PNG, misleadingly named `*.webp.png` (confirmed via file signature — these are PNG, not WebP). Files are 1.8–2.3 MB each. | 🔴 **Critical — see §8** |
| Core Web Vitals risk | Direct consequence of the above: any page with a hero/featured photo (homepage, all 12 industry pages, About via `WhyChooseNAC`) will load a 2MB+ unoptimized image, which will badly hurt LCP — especially on mobile/4G, which matters a lot for local "pharmacy consultant near me" search intent. | 🔴 **Critical** |

---

## 3. Old website content still present

Full-repo grep for stale positioning, confirmed with file:line:

| Location | Content | Live/indexed? | Severity |
|---|---|---|---|
| `frontend/src/pages/FaqPage.tsx:13-46` | Entire FAQ content: "Is the Inventory Health Assessment really free?", "52 diagnostic questions", "warehouse audits" as an offered service | **Yes — indexed, in sitemap, `FAQPage` schema** | 🔴 **Critical** |
| `frontend/src/pages/CaseStudiesPage.tsx:9` | `previewCopy`: "Real engagement outcomes across manufacturing, distribution, and retail operations." | `noindex`, currently unlinked | 🟠 High |
| `frontend/src/pages/FreeDownloadsPage.tsx:9` | "...improve inventory and warehouse operations on your own." | `noindex`, currently unlinked | 🟠 High |
| `frontend/src/pages/ChecklistsPage.tsx:9` | "...common inventory and warehouse tasks." | `noindex`, currently unlinked | 🟠 High |
| `frontend/src/pages/TemplatesPage.tsx:9` | "...for inventory and warehouse management." | `noindex`, currently unlinked | 🟠 High |
| `frontend/src/config/constants.ts:12-20` | `CONSULTATION` object: `serviceName: 'Inventory Assessment Review & Consultation'`, `fee: '₹499'` | Not imported/rendered by any live page (verified — only referenced by the unlinked `ThankYouView`) | 🟢 Low (dead data, not user-facing) |
| `frontend/src/config/constants.ts:91-114` | `REPORT_TIERS` (₹99/₹299) | Unused by any live page | 🟢 Low |
| `frontend/src/features/landing/landing.data.ts:107-150, 261-286` | `SERVICES` (old flat list incl. "Inventory Health Assessment"), `PROCESS_STEPS` (52-question flow) | Only backs unused, unimported components (`Services.tsx`, `HowItWorks.tsx`) — not rendered anywhere in the current route tree | 🟢 Low |
| `frontend/src/shared/utils/whatsapp.ts:17-22` | Pre-filled WhatsApp message referencing "NAC Inventory Health Assessment" / "Inventory Assessment Review & Consultation" | Only used by `assessmentNumber`-branch, called solely from the unlinked `ThankYouView` | 🟢 Low |
| `frontend/src/features/assessment/**`, `frontend/src/features/payment/**`, `frontend/src/pages/Assessment*Page.tsx`, `PaymentPage.tsx`, `ThankYouPage.tsx` | Entire legacy assessment/payment product | Unlinked from nav, most `noindex`, all `Disallow`'d — see §12.3 for the one gap | 🟢 Low (properly contained) |
| `README.md` (repo root) | Still describes the site as "A lead-generation web application... Business owners complete a free 52-question inventory health assessment..." | Documentation only, not user-facing/not crawled as part of the site | 🟢 Low (doc hygiene, not SEO) |
| `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API.md` | Flagged as stale in the prior `NAC_CURRENT_WEBSITE_AUDIT.md` (§10 of that document) — not re-verified line-by-line in this pass | Documentation only | 🟢 Low (doc hygiene, not SEO) |

No PayU/payment code was found referenced from any live, linked, indexed page — the payment module is fully contained within the unlinked `/assessment/*` subtree, correctly `Disallow`'d in `robots.txt`.

---

## 4. Title tags

- **Duplicate titles:** none found across the 46 sitemap URLs — every template (service/industry) interpolates a unique name.
- **Overly long titles:** homepage (95 chars) and `/services` (92 chars) exceed the practical ~60-char SERP display limit and will truncate. All 42 service/industry page titles are appropriately short (35–55 chars).
- **Generic titles:** none — every title names the specific service/industry/post.
- **Old branding in titles:** only `/faq` (`Frequently Asked Questions | Nitin Anand Consulting` — the *title* itself is fine, the *meta description* is what's stale, see §5) and the unlinked `/assessment/*` pages.
- **Missing location/niche relevance:** titles correctly emphasize the pharmacy/healthcare niche (`... for Pharmacy & Healthcare`) at the site level; individual service/industry titles rely on the niche being established by the H1/intro rather than repeating it in every title, which is a reasonable choice to avoid keyword stuffing. No city/location is present in any title (e.g. no "Mumbai") — reasonable if the digital marketing services aren't geography-restricted, but revisit once the local-SEO/local-vs-national geography decision (§10 of the Phase 1 plan) is resolved.

---

## 5. Meta descriptions

- **Uniqueness:** excellent — every service (30) and industry (12) page has a hand-written, distinct `metaDescription` in its data file. No mail-merge duplication.
- **Search intent match:** strong — descriptions consistently name the service/industry and the specific value prop (e.g. "batch and expiry-aware physical verification with a clear discrepancy report" for Inventory Audit).
- **Keyword relevance:** primary keyword is naturally present in nearly every description (e.g. "ABC analysis," "pharmacy inventory audit," "local SEO").
- **Length:** spot-checked several — most sit in the 140–170 character range, slightly over the ~155-char SERP-safe guideline in a handful of cases (worth a pass once keyword strategy is finalized, but not urgent).
- **CTR language:** descriptions are informative but plain — none use a call-to-action phrase (e.g. "Book a free consultation," "Get a quote") within the description itself. Adding a short CTA fragment to the highest-priority pages (hub pages, top 5–10 service pages) is a reasonable low-cost improvement once keyword priority is set.
- **The one broken case:** `/faq`'s meta description ("...free Inventory Health Assessment, your scored report...") — same issue as §3/§12.1.

---

## 6. Headings

- **H1 usage:** every page has exactly one `<h1>` — verified across `MarketingPageLayout` (shared H1 for About/Contact/FAQ/Privacy/Terms), `ServiceLandingView`, `ServiceVerticalHubView`, `IndustryLandingView`, `IndustryHubView`, `ServicesHubView`, `BlogIndexView`, `BlogPostView`, and `Hero.tsx` (homepage). No page renders zero or multiple H1s.
- **H2/H3 hierarchy:** logical and consistent — H2 for major sections ("What's Included," "Why It Matters," "Relevant Services for X," "Frequently Asked Questions"), H3 for individual benefit/FAQ/card titles within those sections. No heading level is skipped (no H1→H3 jumps).
- **Keyword stuffing:** none observed — headings are natural, benefit-oriented phrases, not keyword-repeated strings.
- **Duplicate headings across pages:** the *section labels* ("What's Included," "Frequently Asked Questions") intentionally repeat across all 30 service pages and 12 industry pages, because they're a shared template — this is normal and expected for a template-driven architecture and is not a duplicate-content problem, since the actual page-unique H1 and body content differ every time.
- **One risk to watch:** blog post bodies are raw Markdown rendered via `marked` (`renderMarkdownToHtml`) — if an author writes `# Heading` (H1) inside a post body, it will render as a second `<h1>` on that page (the page shell already renders the post title as H1). The current single seed post only uses `##`/`###` in its body, so this isn't manifesting yet, but nothing in `parseFrontmatter.ts`/`BlogPostView.tsx` prevents an author from doing this in a future post — worth a one-line content-authoring convention note in `frontend/src/content/blog/README.md` ("start post body headings at `##`, never `#`").

---

## 7. Structured data / JSON-LD

| Schema type | Where used | Assessment |
|---|---|---|
| `ProfessionalService` (+ `PostalAddress`, `makesOffer`) | Global, `frontend/index.html` `@graph` | Correctly rewritten for the pharmacy/healthcare positioning; `makesOffer` lists a representative 12-service subset (not all 30) — reasonable per schema.org convention. No fake ratings/reviews. `areaServed` still Mumbai/MMR/Maharashtra/India — confirm this is still accurate (open decision carried from the Phase 1 plan). |
| `WebSite` | Global, `frontend/index.html` | Present, correctly linked via `publisher` to the `ProfessionalService` `@id`. No `SearchAction` (sitelinks search box) — not needed at this site's scale/no on-site search exists, fine to omit. |
| `BreadcrumbList` | Every page via `MarketingPageLayout` (2-level) or `useJsonLd` directly (2–3 level on hub/detail pages) | Consistently implemented, correct `@id`/URL structure. **Not matched by a visible on-page breadcrumb trail** except on blog posts — see §9. |
| `FAQPage` | Service pages (30, real FAQs from data), Industry pages (12, real FAQs from data), `/faq` (7 items, **all describing the discontinued product**) | Correctly used only where real FAQ content exists — no fabrication, matches the explicit "FAQPage only where actual FAQ content exists" instruction. The one exception is `/faq` itself, whose content is real but **wrong** (describes a different product). |
| `Service` | Every service page (30) | Present, correctly references the organization via `provider: { "@id": ".../#organization" }`. |
| `Article` | Blog posts | Present, correct fields (`headline`, `image`, `datePublished`, `dateModified`, `author`, `publisher`, `keywords`). `author` is `{"@type": "Organization", ...}` (not a fabricated person) — correct, no invented byline. |
| `LocalBusiness` | Not used — `ProfessionalService` is used instead | `ProfessionalService` is schema.org's more specific subtype for a consulting business and is an acceptable, arguably better choice than generic `LocalBusiness` here. No action needed. |
| Fake reviews/ratings/stats | **None found anywhere** — confirmed by reading `landing.data.ts`'s `TESTIMONIALS` (explicitly empty array with a comment stating no fabricated quotes are rendered) and `TRUST_STATS` (only verifiable structural facts: "16+ Years Experience," "2 Specialized Verticals," no client-count or outcome numbers claimed). | ✅ Fully compliant with the "no fake reviews/stats" instruction. |

---

## 8. Images

This is the site's weakest area.

- **Alt text:** where real photos exist, alt text is genuinely descriptive and specific (e.g. `"Consultant reviewing shelf stock with a pharmacist inside a retail pharmacy"`, `"NAC consultant presenting a business strategy summary to a healthcare business team"`) — not generic ("image1," "photo") and not keyword-stuffed. `ResponsiveImage.tsx` makes `alt` a **required, TypeScript-enforced prop** — structurally prevents a future image from shipping without alt text. This is genuinely good practice.
- **Filenames:** kebab-case, descriptive (`nac-retail-pharmacy-inventory-consulting.webp.png`, `nac-hero-consultant.webp.png`) — good *naming* discipline, undermined by the format problem below.
- **Format — 🔴 Critical:** every real photo is committed as a **PNG** despite the `.webp.png` filename and despite `frontend/public/images/README.md` explicitly stating "Format: `.webp`". Verified via file signature (`nac-hero-consultant.webp.png` is `PNG image data, 1672 x 941, 8-bit/color RGB`). This means every image is roughly **5–10x larger than it should be** as a properly compressed WebP.
- **File sizes — 🔴 Critical:** hero: 1.8 MB · digital-marketing: 2.1 MB · inventory: 2.3 MB · operations: 2.3 MB · pharmacy: 2.3 MB · strategy: 2.2 MB · all 12 industry photos: 2.0–2.3 MB each (industries folder alone: **25 MB** across 12 files). A single industry page load pulls in a 2MB+ hero photo with no compression.
- **Responsive images — 🔴 High:** no `srcSet`/`sizes`/`<picture>` anywhere in the codebase (confirmed by repo-wide grep, zero matches). Every device — a 320px-wide phone or a 2560px desktop — downloads the exact same full-resolution file.
- **Lazy loading:** correctly implemented via `ResponsiveImage` (default `loading="lazy"`, `priority` opt-out for above-the-fold images) and the blog's custom `marked` image renderer. This part is done well.
- **Dimensions / layout shift:** `width`/`height` are required props on `ResponsiveImage`, preventing CLS — good.
- **Compression pipeline:** none exists. The Phase 1 plan explicitly deferred `vite-imagetools` (or equivalent) as a "Phase 2" decision; that decision has not yet been made, and in the meantime the manual-export convention documented in the README was not followed for the images actually committed.
- **Crawlability:** all images are static files under `frontend/public/` — fully crawlable, no issue there.
- **Blog images:** the one published post uses SVG "cover graphic" placeholders (`featured.svg`, `abc-classification-diagram.svg`) rather than a real photo — reasonable for now, but worth a decision on whether future blog posts follow the "real photography only" convention (currently scoped to homepage sections in the README) or a distinct, allowed SVG/diagram convention for blog content.

---

## 9. Internal linking

**What works well:**
- Navbar mega-menu: two visually separate columns for the two verticals (never merged), plus a full Industries dropdown — every one of the 30 service pages and 12 industry pages is reachable within 2 clicks from any page via the persistent nav.
- Industry → Service cross-linking: every industry page's `relevantServices` links into **both** verticals (e.g. Diagnostic Centres links to Expiry Analysis + Reorder/Min-Max + Local SEO + SEO) — this is exactly the internal-linking mechanism the reconstruction plan called for, and it's implemented well.
- Service → Service "Related Services": each service page links to 3 same-vertical services (rotating window through the full list) — keeps users moving within a topic cluster.
- Blog → Service: the one published post links inline to 2 relevant service pages from within the article body — good practice, and the `content/blog/README.md` explicitly instructs future authors to do the same.
- Footer: links to both vertical hubs, 6 (of 12) industries, About/Insights/Contact, legal pages.

**Gaps:**
- **One-directional industry↔service linking:** industry pages link to services, but no service page links back to the industries it's most relevant for. A pharmacy owner reading the "Inventory Audit" page has no direct path to "Retail Pharmacy" — they'd have to go through the Industries nav dropdown. Adding a small "Relevant for these industries" block to `ServiceLandingView.tsx` (mirroring `IndustryLandingView.tsx`'s `relevantServices` pattern) would close this loop and meaningfully strengthen topical relevance signals.
- **Footer industry coverage is a curated 6 of 12** — reasonable for footer width, but means 6 industries (Chain Pharmacy, Diagnostic Centres, Pathology Labs, Dental Clinics, Physiotherapy Centres, Pharma Distributors, Medical Equipment Suppliers — actually 7, footer shows 6 of the 12) rely entirely on the Navbar dropdown and the Industries hub for internal discovery, not the footer.
- **No visible breadcrumb trail** on service/industry/hub pages, despite `BreadcrumbList` JSON-LD being emitted on all of them — only `BlogPostView.tsx` renders an actual on-page breadcrumb (`Home > Insights > {title}`). Structured data that doesn't match visible content is a soft best-practice miss (not a penalty, but a missed UX/SEO reinforcement opportunity).
- **Blog category/tag filtering is client-side only** (`useState` in `BlogIndexView`) — there's no crawlable `/blog/category/<slug>` or `/blog/tag/<slug>` URL, so category pages can't independently rank or be linked to externally. Fine at 1 post; will matter once volume grows (see §11/§15).
- **Contact page has no internal links back into services/industries** — a visitor landing directly on `/contact` (e.g. from an ad or GBP link) has no path back into the content site without using the nav.

---

## 10. Industry pages — vertical-of-services duplication check

Explicitly checked per the "do NOT create duplicate pages with only the industry name changed" instruction: **confirmed not duplicated.** Each of the 12 industry pages has its own hand-written `intro`, `description`, `metaDescription`, and a distinct 4-item `relevantServices` selection reflecting that industry's actual priorities (e.g. Pharma Distributors emphasizes Inventory Analysis + Purchase Analysis + Reorder/Min-Max + KPI/MIS; Dental Clinics emphasizes Inventory Audit + Reorder/Min-Max + Website Development + Social Media Content — genuinely different service mixes, not a mail-merge). FAQs are also industry-specific, not copy-pasted. This is one of the strongest parts of the current build.

---

## 11. Service verticals — search intent separation

Explicitly checked per the "must have sufficiently distinct search intent, do not mix into one generic SEO page" instruction: **confirmed distinct.** The two verticals never share a page, a nav column, a data file, or a hero visual style (`VERTICAL_STYLES` in `ServiceLandingView.tsx` hard-codes green for Inventory/Operations vs. blue for Digital Marketing, "never mixed" per an in-code comment). `/services` is the only page that shows both side by side, and it does so as two clearly labeled, separately-styled panels rather than a merged list. This satisfies the positioning requirement well.

---

## 12. Blog / Insights architecture readiness

**Technically ready for the blog to become the primary organic-growth engine, with one process gap to close first.**

| Requirement | State |
|---|---|
| Clean URLs | ✅ `/blog/<slug>`, slug comes directly from frontmatter, kebab-case |
| Article titles | ✅ Unique, frontmatter-driven |
| Metadata (title/description/OG/Twitter/canonical) | ✅ Fully automatic via `useSeo()` from frontmatter — zero manual work per post |
| Publication date | ✅ `date` frontmatter field, rendered visibly (`<time dateTime>`) and in `Article` JSON-LD (`datePublished`/`dateModified` — note: both currently set to the same value, since there's no separate "last updated" tracking; fine until a post is meaningfully revised) |
| Author | ✅ `author` frontmatter field, rendered visibly and in schema as an `Organization` (not a fabricated person) |
| `Article`/`BlogPosting` schema | ✅ `Article` type used (a valid, slightly more general sibling of `BlogPosting` — acceptable) |
| Breadcrumbs | ✅ Both visible (on-page nav) and structured (`BreadcrumbList` JSON-LD) — the *only* page type on the site with both |
| Canonical | ✅ Automatic from `SITE_URL + '/blog/' + slug` |
| Related posts | ✅ `getRelatedPosts()` — shared-tag/category scoring, computed client-side, no extra infra |
| Internal linking | ✅ Encouraged and demonstrated in the seed post; documented as convention in `content/blog/README.md` |
| Image support | ✅ Featured image (required frontmatter field, required alt) + inline images via standard Markdown, auto-lazy-loaded |
| Sitemap inclusion | ⚠️ **Manual only** — a new post is *not* automatically added to `sitemap.xml`; someone must remember to hand-edit it. The plan (§10 of the Phase 1 plan) explicitly flagged this as fine "at this scale" and a good Phase 2 candidate — that threshold is arguably now, since the whole point of the next phase is to start publishing regularly. |
| "Add a post without touching code" | ✅ True today — dropping a `.md` file + images is genuinely sufficient for the post to render, get its own URL, SEO tags, and schema. **Except** it won't appear in the sitemap until that's also hand-edited. |
| Content volume | 1 published post (the seed article). This is expected pre-campaign, not a defect — flagged here only so it's explicit that "architecture readiness" and "content readiness" are two separate, both-currently-true-and-false statements. |

**Bottom line:** the blog is architecturally the strongest part of the SEO build. The one thing to fix before relying on it as "the primary organic-growth engine" is sitemap automation (§15/§18) — otherwise every new post silently won't appear in the sitemap (though it will still be crawlable via the `/blog` index and internal links, so it's a delay/priority-signal issue, not a total invisibility issue).

---

## 13. Old website content — see §3 (consolidated there to avoid duplication).

---

## 14. Google Search Console readiness

| Requirement | State |
|---|---|
| Valid, submittable `sitemap.xml` | ✅ Well-formed, 46 URLs, correct `<loc>`/`<lastmod>`/`<changefreq>`/`<priority>` |
| `robots.txt` references sitemap | ✅ |
| No accidental site-wide `noindex`/blocking | ✅ Verified — global `index.html` sets `index, follow`; nothing blocks the site broadly |
| Canonical consistency | ✅ Single canonical per page, matches the URL actually served |
| HTTPS | Assumed via Vercel automatic TLS — **verify manually** (not checkable from this offline audit) |
| Mobile-friendliness | Tailwind responsive classes used throughout; not independently tested in a real browser in this audit — **recommend a live mobile-friendly test once the image-weight issue (§8) is fixed**, since a 2MB+ image will also affect the "mobile usability"/Core Web Vitals report in Search Console once traffic exists |
| Structured data validity | Spot-check the `FAQPage`/`Article`/`Service`/`BreadcrumbList` objects through Google's Rich Results Test before/after launch — not run in this offline audit, but the JSON-LD shapes read as valid schema.org per manual inspection |
| Google Business Profile linking | `ProfessionalService` schema in `index.html` has the address/phone that should match the GBP listing exactly (NAP consistency) — **confirm the actual GBP listing uses the identical address/phone/business name as `BUSINESS_INFO` in `constants.ts`** before or during GBP setup, since NAP mismatches hurt local SEO |
| Verification readiness | No blockers — a Search Console HTML-tag or DNS verification can be added to `index.html`/DNS at any time; nothing in the current build prevents it |

**Recommendation:** submit to Search Console only after §12.1 (`/faq`) and §8 (images) are addressed — submitting now would have Google crawl and index the stale FAQ content and slow-loading image pages as the *first* impression of the rebuilt site.

---

## 15. Proposed keyword architecture

No search volume or ranking-difficulty figures are claimed anywhere below — none were available to verify. This is an **intent/mapping** framework, not a volume-prioritized keyword list; volume/difficulty research should be layered on top of this structure using an actual keyword tool before writing content.

### A. Brand keywords
- **Intent:** navigational
- **Target page:** `/`
- **Primary:** "Nitin Anand Consulting"
- **Secondary:** "NAC pharmacy consulting", "NAC healthcare consulting"
- **Blog topics:** not applicable (brand terms don't need blog support)

### B. Pharmacy consulting keywords
- **Intent:** commercial investigation
- **Target page:** `/services/inventory-operations-consulting`, `/industries/retail-pharmacy`, `/industries/chain-pharmacy`
- **Primary:** "pharmacy business consulting"
- **Secondary:** "pharmacy consultant India", "retail pharmacy consulting", "chain pharmacy consulting"
- **Supporting blog topics:** "What does a pharmacy business consultant actually do?", "Signs your pharmacy needs an operations audit"

### C. Healthcare business consulting keywords
- **Intent:** commercial investigation
- **Target page:** `/services`, `/industries`
- **Primary:** "healthcare business consulting"
- **Secondary:** "clinic operations consulting", "diagnostic centre consulting", "hospital operations consulting"
- **Supporting blog topics:** "Operations audits for clinics and diagnostic centres: what to expect"

### D. Inventory & operations keywords
- **Intent:** commercial / informational mix
- **Target page:** `/services/inventory-operations-consulting`
- **Primary:** "inventory and operations consulting"
- **Secondary:** "inventory audit services", "SOP development consulting", "KPI dashboard consulting"
- **Supporting blog topics:** "ABC vs FSN analysis: what's the difference and when to use each"

### E. Pharmacy inventory keywords
- **Intent:** commercial / transactional
- **Target page:** `/services/inventory-operations-consulting/inventory-audit`, `/services/inventory-operations-consulting/expiry-near-expiry-analysis`
- **Primary:** "pharmacy inventory audit"
- **Secondary:** "pharmacy stock reconciliation", "pharmacy expiry management", "medical store inventory management"
- **Supporting blog topics:** already covered by the seed post ("A Practical Pharmacy Inventory Audit Checklist"); follow-ups: "How to reduce expiry write-offs in a retail pharmacy", "FEFO vs FIFO for pharmacy stock rotation"

### F. Pharmacy operations keywords
- **Intent:** commercial / informational
- **Target page:** `/services/inventory-operations-consulting/sop-development`, `/services/inventory-operations-consulting/pharmacy-store-warehouse-operations`
- **Primary:** "pharmacy operations consulting"
- **Secondary:** "pharmacy SOP development", "pharmacy store layout consulting", "hospital pharmacy operations"
- **Supporting blog topics:** "Writing SOPs your pharmacy staff will actually follow"

### G. Digital marketing for pharmacies
- **Intent:** commercial investigation
- **Target page:** `/services/digital-marketing`, `/services/digital-marketing/website-development`
- **Primary:** "digital marketing for pharmacies"
- **Secondary:** "pharmacy website design", "pharmacy social media marketing"
- **Supporting blog topics:** "Does your pharmacy need a website in 2026?", "5 things every pharmacy website should have"

### H. Healthcare digital marketing
- **Intent:** commercial investigation
- **Target page:** `/services/digital-marketing`
- **Primary:** "healthcare digital marketing"
- **Secondary:** "clinic digital marketing", "diagnostic centre marketing", "medical practice marketing"
- **Supporting blog topics:** "Healthcare-appropriate content marketing: what you can and can't claim"

### I. Local SEO for pharmacies
- **Intent:** commercial / transactional, strongly local
- **Target page:** `/services/digital-marketing/local-seo`, `/services/digital-marketing/google-business-profile`
- **Primary:** "local SEO for pharmacies"
- **Secondary:** "Google Business Profile for pharmacy", "pharmacy near me SEO"
- **Supporting blog topics:** "How to optimize your pharmacy's Google Business Profile", "Why 'pharmacy near me' searches matter for local pharmacies"
- **Note:** this cluster only works if the `areaServed` geography question (Mumbai-only vs. broader — flagged open in the Phase 1 plan) is resolved first, since local-SEO content strategy depends on whether NAC is targeting one city or a national footprint.

### J. Pharmacy website development
- **Intent:** transactional
- **Target page:** `/services/digital-marketing/website-development`, `/services/digital-marketing/landing-pages`
- **Primary:** "pharmacy website development"
- **Secondary:** "medical store website design", "clinic landing page design"
- **Supporting blog topics:** "What to include on a pharmacy website homepage"

### K. Google Ads/PPC for healthcare
- **Intent:** transactional
- **Target page:** `/services/digital-marketing/google-ads`, `/services/digital-marketing/ppc-performance-marketing`
- **Primary:** "Google Ads for healthcare businesses"
- **Secondary:** "PPC for pharmacies", "performance marketing for clinics"
- **Supporting blog topics:** "Is Google Ads worth it for a single-location pharmacy?"

### L. Industry-specific keywords
- **Intent:** commercial investigation, one cluster per industry page
- **Target pages:** each of the 12 `/industries/<slug>` pages
- **Primary keywords (one per page):** "hospital pharmacy consulting", "diagnostic centre consulting", "pathology lab inventory management", "dental clinic operations consulting", "physiotherapy centre marketing", "pharma distributor inventory consulting", "medical equipment supplier marketing", etc. — directly mirrors the 12 industry page titles already in place.
- **Supporting blog topics:** one flagship post per industry over time (e.g. "Inventory challenges specific to diagnostic centres"), cross-linked from that industry's page.

---

## 16. Proposed blog architecture (building on what already exists)

The technical architecture (§12) doesn't need rebuilding — it needs a **content calendar and a process fix**:

1. **Fix sitemap automation first** (see §18) — otherwise every new post is a manual two-step (add `.md` file, remember to also edit `sitemap.xml`), which will get missed.
2. **Category taxonomy:** the two existing categories implied by the data model ("Inventory & Operations", "Digital Marketing") map directly onto the two verticals — keep blog categories aligned 1:1 with the vertical structure so category filtering reinforces the site's core positioning rather than introducing a third taxonomy.
3. **Cadence and cross-linking discipline:** every new post should link to at least one service page and, where relevant, one industry page (the seed post does this correctly — two service links). This is an authoring habit, not a code feature, and should be added as an explicit checklist item in `content/blog/README.md`.
4. **Crawlable category/tag archive pages** (`/blog/category/<slug>`, `/blog/tag/<slug>`) are worth adding once post volume passes roughly 10–15 — not needed at 1 post, but plan the route now so it's not a surprise later (the reconstruction plan already reserved this URL shape).
5. **Markdown H1 discipline** (§6) — add the one-line convention note before more authors touch the content folder.

---

## 17. Final SEO readiness score

**Original score (2026-08-21 audit, before fixes): 74/100 — see table below, kept as historical record.**

| Category | Score /100 | Rationale |
|---|---|---|
| Technical SEO | 72 | Solid fundamentals (robots/sitemap/canonical/lazy-loading), dragged down by CSR-only rendering, soft-404s, and client-side-only redirects |
| On-page SEO (titles/meta/H1) | 80 | Excellent across ~40 template-driven pages; the one severely wrong page (`/faq`) is a significant, indexed outlier |
| Content architecture (two verticals, industries, distinct intent) | 90 | Genuinely well-separated, no thin/duplicate pages, matches the explicit positioning requirements |
| Internal linking | 75 | Strong hub/nav/cross-link structure; one-directional industry↔service linking and no visible breadcrumbs hold it back |
| Structured data | 88 | Comprehensive, correctly scoped (no fake reviews/stats), consistent `BreadcrumbList`/`FAQPage`/`Service`/`Article` usage |
| Images | 40 | Alt text and lazy-loading are done right; format (fake WebP / actual PNG), file weight, and lack of responsive images are serious, unresolved Core Web Vitals risks |
| Industry pages | 92 | No duplication, unique content and cross-links throughout |
| Blog architecture | 78 | Strong technical foundation; manual sitemap maintenance and single-post volume are the gaps |
| Indexability | 75 | Sitemap/robots/canonical all correct; the one live indexed page with wrong content (`/faq`) and the soft-404 pattern are the deductions |
| Conversion / lead structure | 65 | Consistent CTA pattern site-wide, but `/contact` has no real form and there's no analytics to measure any of it |

### Original overall: 74 / 100

---

### Updated score — 2026-08-21, after the §0.1 implementation pass

| Category | Score /100 | Change | Rationale |
|---|---|---|---|
| Technical SEO | 80 | +8 | Real server-level 301s added for all legacy URLs. CSR rendering and soft-404-via-noindex are unchanged but were already the industry-accepted approach for a SPA at this scale — not re-scored down twice for the same architectural fact. |
| On-page SEO (titles/meta/H1) | 94 | +14 | `/faq` no longer the wrong-content outlier — now accurate, on-positioning content with correctly-scoped `FAQPage` schema. |
| Content architecture | 92 | +2 | Resources pages no longer carry off-positioning copy. |
| Internal linking | 87 | +12 | Reverse service→industry links added (was one-directional); Resources pages now reachable from the Footer instead of orphaned by URL only. Visible breadcrumb UI still missing — kept this from being a 95+. |
| Structured data | 88 | — | Unchanged — already strong. `/faq`'s `FAQPage` schema now also matches its (correct) visible content, which was implicitly a data-integrity issue before. |
| Images | 78 | +38 | Real compression (37.5MB → 2.9MB), correct WebP format, responsive `srcSet`/mobile variants, and — the larger fix — **removal of fabricated statistics/names that were live on 7 photos**. Not a 90+: no automated build-time image pipeline exists yet (manual script), and several homepage/industry slots lost their photo entirely pending clean replacements (see §0.2). |
| Industry pages | 92 | — | Unchanged — still no duplication; the 4 industries that lost their photo still have full unique text content, FAQs, and cross-links. |
| Blog architecture | 78 | — | Unchanged — out of scope for this pass (content/keyword work explicitly excluded). |
| Indexability | 90 | +15 | The one wrong-content indexed page (`/faq`) is fixed; `/assessment/start` now correctly `noindex`. |
| Conversion / lead structure | 65 | — | Unchanged — `/contact` still has no wired form; explicitly out of scope for this pass (needs a new backend endpoint). |

### **Updated overall: 84 / 100**

The 10-point gain comes almost entirely from fixing things that were either actively wrong (`/faq`, the 4 Resources pages, fabricated stats) or measurably broken (image weight/format). The categories that didn't move (blog architecture, conversion structure, and the CSR/soft-404 technical facts) were explicitly out of scope for this pass or require backend/content work not requested here — see §0.1 "Not changed" list.

---

### Updated score — 2026-08-21, after the §0.3 implementation pass (analytics, sitemap automation, breadcrumbs, contact-form review, photography review)

| Category | Score /100 | Change | Rationale |
|---|---|---|---|
| Technical SEO | 86 | +6 | Sitemap generation is now build-time-automatic (was hand-maintained) — closes a specific, previously-flagged process risk. |
| On-page SEO (titles/meta/H1) | 94 | — | Unchanged — not in scope for this pass. |
| Content architecture | 92 | — | Unchanged. |
| Internal linking | 95 | +8 | Visible breadcrumb trail added site-wide on every inner page, matched 1:1 to the `BreadcrumbList` schema — this was the specific gap holding this category back from a 95+ last time. |
| Structured data | 93 | +5 | `BreadcrumbList` schema is now backed by matching visible UI everywhere (previously a "structured data present, but nothing on-page confirms it" soft miss). |
| Images | 78 | — | Unchanged — reviewed per instruction, no fabricated content remains on any wired-in photo, nothing needed replacing. |
| Industry pages | 92 | — | Unchanged. |
| Blog architecture | 85 | +7 | The specific gap flagged last time ("manual sitemap maintenance... a new post is not automatically added") is now fixed — every post in `src/content/blog/` is automatically in the sitemap on the next build. |
| Indexability | 94 | +4 | Sitemap can no longer silently drift from the live route set. |
| Conversion / lead structure | 68 | +3 | Analytics measurement scaffolding now exists and is one env var away from live (dormant, correctly not activated with a fake ID). `/contact` still has no wired form — investigated and explicitly stopped per instruction rather than faked; see §0.3 item 4 for exactly what's missing. |

### **Updated overall: 88 / 100**

The 4-point gain reflects genuine, but partial, progress: 3 of the 5 remaining items were fully closed (analytics scaffolding, sitemap automation, breadcrumbs). The other 2 were correctly *not* force-completed — the contact form because building one without a backend endpoint would mean shipping a fake working form (explicitly prohibited), and photography because there was nothing left to fix (already resolved in the prior pass). Conversion/lead structure remains the single lowest-scoring category and the most consequential thing left to build.

---

## 18. Action plan

*(Original plan, kept as historical record — status of each item as of the 2026-08-21 implementation pass is marked inline.)*

### A. Ready now (no blockers — safe to build keyword/content strategy on top of these)
- All 30 service pages, all 12 industry pages, both vertical hubs, `/services`, `/industries`, homepage, About — titles, meta descriptions, H1/H2 structure, and structured data are solid and campaign-ready.
- The blog's technical pipeline (frontmatter → registry → SEO tags → `Article`/`BreadcrumbList` schema) is ready to absorb regular content production.
- ✅ **As of 2026-08-21, `/faq` and the 4 Resources pages join this list** — no longer blockers.

### B. Must fix before SEO — **all 4 items done as of 2026-08-21** (see §0.1 for exact detail)
1. ✅ **FIXED — Rewrite `/faq`**. *File: `frontend/src/pages/FaqPage.tsx`.*
2. ✅ **FIXED — Image pipeline**: real compressed WebP + responsive `srcSet`/mobile variants. *Files: `frontend/public/images/**`, `frontend/scripts/optimize-images.mjs`, `ResponsiveImage.tsx`, plus every consuming component.* A related, more serious issue (fabricated stats/names baked into 7 photos) was found and fixed alongside this — see §0.2.
3. ✅ **FIXED — Rewrite the 4 orphaned Resources pages' `previewCopy`**. *Files: `CaseStudiesPage.tsx`, `FreeDownloadsPage.tsx`, `ChecklistsPage.tsx`, `TemplatesPage.tsx`.*
4. ✅ **FIXED — `noindex` added to `AssessmentStartView`**. *File: `frontend/src/features/assessment/AssessmentStartView.tsx`.*

### C. Should fix (meaningful improvements, not launch-blocking) — status as of 2026-08-21 (updated after §0.3)
- 🟡 **PARTIALLY DONE — Analytics.** GA4 scaffolding built and wired in (`src/app/Analytics.tsx`), dormant until you provide the real Measurement ID (`VITE_GA4_MEASUREMENT_ID`). Search Console and Google Business Profile linkage still need to happen on your end (Search Console verification, GBP NAP-consistency check against `BUSINESS_INFO` in `constants.ts`) — not something committable to the repo. See §0.3 item 1.
- ✅ **DONE — Automate `sitemap.xml` generation.** *Files: `frontend/scripts/generate-sitemap.mjs`, `package.json` (`build` script). See §0.3 item 2.*
- ✅ **DONE — Add a visible breadcrumb trail site-wide to match the existing `BreadcrumbList` schema.** *Files: `shared/utils/breadcrumbs.ts`, `shared/components/Breadcrumbs.tsx`, wired into every inner-page template. See §0.3 item 3.*
- ✅ **DONE (previous pass) — Add reverse links from service pages to their most relevant industries.** *Files: `industries.data.ts` (`getIndustriesForService()`), `ServiceLandingView.tsx`.*
- ⬜ Commission a real 1200×630 Open Graph share image (currently a 512×512 app icon). **Not done** — needs a real design asset.
- ⬜ Resolve the `areaServed`/geography question (Mumbai-only vs. broader) before finalizing local-SEO keyword targeting. **Not done** — a positioning decision for the user, deliberately not assumed.
- 🛑 **STOPPED, per explicit instruction — Build `/contact` into a real lead-capture form.** Investigated; no backend endpoint exists to wire it to. Not built (would otherwise be a fake working form). Exact missing pieces documented in §0.3 item 4 — needs backend work (new `/leads` route) plus one decision from you (does the data get stored, or is the email alert enough?).
- 🆕 **NEW, done in this pass**: real server-level 301 redirects for all legacy URLs (`vercel.json`), and the Resources pages are now linked from the Footer (previously orphaned by URL only).

### D. Optional improvements — unchanged, none done in this pass (all remain genuinely optional / zero SEO impact)
- Clean up unused, unimported components (`Services.tsx`, `HowItWorks.tsx`, `ReportPreview.tsx`, `Testimonials.tsx`, `HeroVisual.tsx`, `HeroVisualBalanced.tsx`) — zero SEO impact, pure code hygiene.
- Refresh `README.md`/`docs/PRD.md`/`docs/ARCHITECTURE.md`/`docs/API.md` to describe the current site.
- Remove the low-value `<meta name="keywords">` tag (or leave it — genuinely negligible either way).
- Add crawlable `/blog/category/<slug>` and `/blog/tag/<slug>` archive pages once post volume justifies it.
- Decide on a consistent blog-image convention (real photography vs. SVG cover graphics).
- Add a one-line Markdown-authoring convention (no `#` H1 inside post bodies) to `content/blog/README.md`.
- 🆕 **NEW, from this pass**: commission clean replacement photography for the digital-marketing, inventory, and strategy homepage slots, and the 4 unwired industry pages (clinics, hospitals, diagnostic-centres, pharma-distributors) — see §0.2. Not required (all fall back to clean text-only layouts), but would restore full visual parity across the homepage sections.

---

## 19. Recommended next implementation order

*(Original order, kept as historical record.)* Steps 1–4 (the full §B list) are **done** as of 2026-08-21. Remaining:

1. ~~§B.1 — Fix `/faq`~~ ✅ done.
2. ~~§B.3 — Fix the 4 Resources page blurbs~~ ✅ done.
3. ~~§B.4 — Add `noindex` to `/assessment/start`~~ ✅ done.
4. ~~§B.2 — Image pipeline fix~~ ✅ done (plus the fabricated-content fix from §0.2).
5. **§C — Analytics + Search Console + GBP setup** — next up, so every subsequent content/keyword decision is measurable. Needs a user decision on stack/consent first.
6. **§C — Sitemap automation** — before blog publishing cadence increases.
7. **Submit to Google Search Console** once 5 is done (image/content blockers from 1–4 are now clear).
8. **Begin executing the keyword architecture (§15)** and blog content calendar (§16) — the site is technically ready to absorb this now.
9. **§C remainder + §D** — breadcrumbs, OG image, `/contact` form, replacement photography for the unwired slots — worked in alongside ongoing content production, not blocking it.
