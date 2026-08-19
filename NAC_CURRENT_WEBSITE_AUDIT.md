# NAC Current Website Audit

**Date:** 2026-08-18
**Scope:** Read-only audit of `nac-inventory-assessment` as it exists today, prior to the pharmacy/healthcare repositioning.
**Method:** Full repo inspection (frontend, backend, docs, config) — no files modified.

> This document describes what exists **today**. It intentionally does not prescribe changes — see `NAC_WEBSITE_RECONSTRUCTION_PLAN.md` for the proposed future state.

---

## 1. What this website currently is

A single-product lead-generation site: a **free 52-question Inventory Health Assessment** that scores a business's inventory/warehouse maturity, then upsells a paid PDF report (₹99 summary / ₹299 full) via PayU, emails the report, and alerts NAC to a new lead. There are also six standalone "consulting service" landing pages, and five placeholder "Resources" pages (including Blog) that are not yet built.

**Tech stack:** React 18 + TypeScript + Vite + Tailwind + React Router v6 + React Hook Form + Zod + Framer Motion + Recharts (frontend); Node.js + Express + TypeScript, layered `controller → service → repository` (backend); Supabase/Postgres (DB); Resend (email); `@react-pdf/renderer` (PDF, both client and server side); PayU Hosted Checkout (payments); deployed Vercel (frontend, implied) + Render (backend) + Supabase (DB, external).

---

## 2. Frontend routes (`frontend/src/app/routes.tsx`, paths from `frontend/src/config/constants.ts`)

| Path | Page component | Status |
|---|---|---|
| `/` | `LandingPage` | Live, indexed |
| `/assessment/start` | `AssessmentStartPage` | Live, indexed |
| `/assessment/questions` | `AssessmentQuestionsPage` | Live, **disallowed in robots.txt** |
| `/assessment/results` | `ResultsPage` | Live, **disallowed in robots.txt**, `noindex` |
| `/assessment/payment` | `PaymentPage` | Live, `noindex` — PayU checkout initiation |
| `/assessment/thank-you` | `ThankYouPage` | Live, `noindex` — post-payment confirmation |
| `/about` | `AboutPage` | Live, indexed |
| `/faq` | `FaqPage` | Live, indexed, has `FAQPage` JSON-LD |
| `/contact-us` | `ContactUsPage` | Live, indexed |
| `/privacy-policy` | `PrivacyPolicyPage` | Live, indexed |
| `/terms-and-conditions` | `TermsAndConditionsPage` | Live, indexed |
| `/inventory-consulting` | `InventoryConsultingPage` | Live, indexed (service template) |
| `/warehouse-consulting` | `WarehouseConsultingPage` | Live, indexed (service template) |
| `/operations-consulting` | `OperationsConsultingPage` | Live, indexed (service template) |
| `/sop-development` | `SopDevelopmentPage` | Live, indexed (service template) |
| `/business-analytics` | `BusinessAnalyticsPage` | Live, indexed (service template) |
| `/training-implementation` | `TrainingImplementationPage` | Live, indexed (service template) |
| `/blog` | `BlogPage` | Placeholder, `noindex`, not in sitemap |
| `/case-studies` | `CaseStudiesPage` | Placeholder, `noindex`, not in sitemap |
| `/free-downloads` | `FreeDownloadsPage` | Placeholder, `noindex`, not in sitemap |
| `/checklists` | `ChecklistsPage` | Placeholder, `noindex`, not in sitemap |
| `/templates` | `TemplatesPage` | Placeholder, `noindex`, not in sitemap |
| `*` | `NotFoundPage` | 404, `noindex` |

All non-landing routes are `React.lazy`-loaded behind one `<Suspense>`. No route-level auth guards exist; a few pages self-redirect via `<Navigate>` when required navigation state is missing (`ResultsView`, `PaymentPlaceholderView`, `ThankYouView`).

The **6 consulting service pages** all render the same `ServiceLandingView` component, data-driven from `SERVICE_CATEGORIES`/`getServiceBySlug()` in `frontend/src/features/landing/landing.data.ts`. This is the most reusable pattern in the codebase for the future two-vertical service architecture.

The **5 Resources pages** (including Blog) all render the same `ResourceComingSoonView` placeholder — infrastructure is scaffolded (routes, nav entries) but empty.

---

## 3. Backend routes (`backend/src/routes/index.ts`, prefix `/api/v1`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check; reports Supabase configured/not_configured |
| POST | `/assessments` | Submit a completed assessment (persists via Supabase RPC `submit_assessment`; fires internal lead-alert email unconditionally) |
| GET | `/assessments/:id` | Fetch assessment detail |
| GET | `/reports/:id` | Fetch report data for an assessment |
| GET | `/reports/:id/pdf` | Download the tiered PDF report — **gated by payment** (`isReportUnlocked`) |
| POST | `/payments/orders` | Create a PayU order for a report tier (amount always server-derived) |
| POST | `/payments/verify` | Server-side payment confirmation + report fulfillment |
| GET | `/payments/payu/redirect/:orderId` | Legacy server-rendered PayU redirect page (fallback/diagnostic, not primary path) |
| POST | `/payments/payu/success` | PayU `surl` callback |
| POST | `/payments/payu/failure` | PayU `furl` callback |

No `/questions`, `/blog`, or CMS-style content routes exist. No authentication of any kind (no login, no sessions, no JWT) — the entire API is public/unauthenticated, protected only by rate limiting and (planned but unused) Turnstile.

---

## 4. Backend modules (`backend/src/modules/`)

| Module | Role |
|---|---|
| `assessment` | Core domain: validate, persist, and retrieve assessments. No payment dependency for submission; PDF download route is payment-gated. |
| `company` | Type-only (no logic); shared company profile types. |
| `email` | Resend wrapper: customer report email (payment-gated), internal lead alert (unconditional), internal consulting-brief email (payment-gated). All sends are best-effort/no-throw when unconfigured. |
| `internalReport` | Generates a separate NAC-internal-only PDF ("consulting brief"), sent only after a paid tier is confirmed. |
| `payment` | Full PayU Hosted Checkout integration behind a provider-neutral seam. See §6. |
| `pdf` | Server-side customer-facing PDF generation (`@react-pdf/renderer`), tiered by report tier. |
| `recommendations` | Pure rule-based engine mapping module ratings to recommendation copy. No I/O. |
| `report` | Thin orchestrator: `deliverPaidReport()` generates + emails both the customer PDF and the internal report. Only ever called from payment's `verifyAndFulfillOrder`. |
| `scoring` | Empty (`.gitkeep` only) — all scoring happens client-side. |

---

## 5. Assessment product (full detail)

- **Flow:** `AssessmentStartPage` (company info form) → `AssessmentQuestionsPage` (52 questions across 8 modules: companyProfile, inventoryAccuracy, inventoryControl, inventoryKpis, inventoryPlanning, procurement, riskCompliance, technology, warehouseOperations, finalAssessment) → `ResultsPage` (client-side scoring, auto-submits to backend, shows score + 2 purchase tiers) → `PaymentPage` (PayU checkout) → `ThankYouPage` (server-verified confirmation + PDF download link).
- Scoring and recommendation generation are entirely **client-side**, computed in the browser before submission; the backend stores the already-computed scores.
- Progress autosaves to browser `localStorage`.
- A client-side PDF generator (`frontend/src/features/assessment/pdf/pdfGenerator.ts`) exists but is **dead code** — zero call sites found. The actual delivered PDF is generated server-side and downloaded via `GET /reports/:id/pdf`.
- `recharts` is a frontend dependency but no confirmed active usage was found in the audited files — worth a quick grep before removing.

---

## 6. Payment / PayU integration (full detail)

**Architecture:** Provider-neutral seam in `payment.service.ts` — `activeProvider = isPayUConfigured() ? payuPaymentProvider : placeholderPaymentProvider`, switching on whether `PAYU_KEY` + `PAYU_SALT` are both set. This is the **single switch point** for the entire gateway.

**Files:**
- `payment.route.ts`, `payment.controller.ts`, `payment.payu.controller.ts` — HTTP layer
- `payment.service.ts` — orchestration (`createOrder`, `verifyAndFulfillOrder`, `isReportUnlocked`)
- `payment.repository.ts` — only file touching the `payment_orders` Supabase table
- `payment.provider.payu.ts` — real PayU integration (checkout handoff, verify API, callback handling)
- `payment.provider.placeholder.ts` — safe no-op fallback (never charges, always reports `unavailable`)
- `payuHash.ts` — PayU's SHA-512 hash formulas (request/response/verify), pure functions, unit-tested
- `payment.types.ts` — `TIER_PRICING` (₹99/₹299, hardcoded), `ReportTier` type
- `payment.validation.ts` — Zod request schemas
- 6 test files, all under this module (the **only** module in the backend with tests)

**Security posture (already correct, worth preserving if payments return later):**
- Amount always derived server-side from `TIER_PRICING`, never trusted from the client.
- Payment status only ever confirmed via PayU's server-to-server Verify API or a hash-authenticated callback — the client-reported/URL-reported status is never trusted.
- Constant-time hash comparison (`crypto.timingSafeEqual`).
- Idempotent `created → paid` transition via conditional UPDATE, preventing double-fulfillment.
- Per-response CSP nonce on the legacy redirect page, scoped narrowly so it doesn't weaken the global Helmet CSP.
- Input sanitization (`sanitizePayUField`) against hash-string injection.

**Current live status (per project memory, not re-verified in this audit):** PayU integration is code-complete and passing all checks, but **end-to-end verification is blocked** — the user's PayU dashboard has not issued a Test Salt, so no live TEST transaction has been confirmed working yet. `PAYU_ENV` defaults to `test`; `render.yaml` explicitly overrides it to `production` for the deployed backend. Git history shows PayU has been added, fully removed, and rebuilt twice already — this churn is not documented anywhere except `git log`.

**Pricing duplication risk:** `TIER_PRICING` in `backend/src/modules/payment/payment.types.ts` and `REPORT_TIERS` in `frontend/src/config/constants.ts` both hardcode ₹99/₹299 independently, with in-code comments flagging the drift risk. There is also a separate, unrelated ₹499 "Book Consultation" WhatsApp upsell (`CONSULTATION` in `constants.ts`) — not part of the report pricing, and not connected to PayU at all (it's a WhatsApp deep link, not a checkout).

**No PayU SDK dependency** — the integration is hand-built (`fetch` + Node `crypto`), so there's no npm package to uninstall.

---

## 7. Dependencies between Assessment and Payment (critical for safe removal)

The relationship is **bidirectional**, not a clean one-way dependency:

- **Assessment → Payment:** `assessment.controller.ts` imports `isReportUnlocked` and `ReportTier` from the payment module, to gate `GET /reports/:id/pdf`.
- **Payment → Assessment:** `payment.service.ts` and `payment.provider.payu.ts` import `getAssessmentById`/`AssessmentDetail` from the assessment module, to populate customer name/company data into the PayU checkout fields and the verified-order response.
- **Payment → Report → Email/PDF/InternalReport:** `report.service.ts`'s `deliverPaidReport()` is the sole fulfillment path, and its **only caller in the entire codebase is `payment.service.ts`'s `verifyAndFulfillOrder`**. If payment is removed without a replacement, `report.service.ts` becomes orphaned code.
- **`ReportTier` type leakage:** `email.service.ts`, `pdf.service.ts`/`pdfSections.config.ts`, and `internalReport.service.ts` all import the `ReportTier` type (and in email's case, `TIER_PRICING`) from `payment.types.ts`, even though conceptually "tier" could exist independent of payment.
- **Not affected at all:** `app.ts`, `server.ts`, all middleware, `health.route.ts`, `config/cors.ts`, `database/supabaseClient.ts` — the app boots and runs fine with payment vars completely absent (this is already true today, by design).

**Practical implication:** Assessment **submission** (the free part — the actual lead-gen mechanism) has zero payment dependency and works identically whether or not PayU exists. Only the **paid PDF download** and its downstream email/report delivery depend on payment. This means the core lead-gen loop (free assessment → lead alert email to NAC) is fully decouplable from PayU today, with no code changes needed to the submission path.

---

## 8. Supabase integration

- Client: `backend/src/database/supabaseClient.ts` — service-role key, lazily initialized, only imported by `*.repository.ts` files (enforced convention, not technically enforced by tooling).
- **8 migrations**, in order: `companies` table → assessment-number sequence/generator → `assessments` table → `assessment_answers` table → `module_scores` table → RLS enabled (no policies, defense-in-depth only, since service-role bypasses RLS) → `submit_assessment()` atomic RPC function → `payment_orders` table (FK to `assessments`, cascade delete).
- Graceful degradation: missing `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` → DB-dependent routes return `503`, health check reports `not_configured`, no crash.
- No Supabase Auth usage — no authentication system exists anywhere in this app.
- No Supabase Storage usage confirmed in code, despite being mentioned in the README's tech stack table (PDFs are generated on-demand, not stored).

---

## 9. Email (Resend)

Three distinct sends, all in `backend/src/modules/email/email.service.ts`:
1. Customer's paid PDF report — payment-gated.
2. Internal "new lead" alert to NAC — fires on **every** submission, unconditional, always attaches a "full" PDF.
3. Internal consulting-brief PDF — payment-gated, tiered.

All no-op (log + skip) if `RESEND_API_KEY`/`RESEND_FROM_EMAIL` unset — no crash, no retry queue.

---

## 10. SEO implementation

**Global (`frontend/index.html`):** Title, meta description, keywords, author, canonical (`https://nitinanandconsulting.in/`), robots, full OG + Twitter Card set, and a `@graph` JSON-LD with a `ProfessionalService` entity (name, logo, phone, email, Mumbai/Andheri West address, `makesOffer` listing 9 inventory-specific services) + a `WebSite` entity. **All of this global copy is currently Inventory-Assessment-specific** and will need a full rewrite for the pharmacy/healthcare repositioning.

**Per-page (`frontend/src/shared/hooks/useSeo.ts`):** Custom hook (not react-helmet-async — that's not a dependency), imperatively sets/restores `<title>`, meta description, canonical, robots, OG, and Twitter tags on mount/unmount. Used on nearly every page. Companion hook `useJsonLd.ts` injects page-specific structured data: `FAQPage` schema on the FAQ page, `Service` + `BreadcrumbList` on service pages, `BreadcrumbList` on every page wrapped in `MarketingPageLayout`.

**`frontend/public/sitemap.xml`:** 12 static URLs (all currently-indexed pages). Correctly excludes noindex/placeholder/session-bound pages.

**`frontend/public/robots.txt`:** Allows all except `/assessment/questions` and `/assessment/results`; points to the sitemap.

**Gaps identified:**
- No analytics (GA4/GTM) anywhere — confirmed via targeted search, zero matches.
- No Meta/Facebook Pixel or any ad pixel — zero matches.
- No image SEO strategy: no responsive images, no WebP/AVIF, only one `loading="lazy"` instance in the whole codebase (footer logo).
- `docs/API.md` doesn't document the `/payments/*` endpoints at all.
- `docs/PRD.md` still states payment was excluded from MVP scope — stale, since PayU is fully built.
- `README.md` is significantly stale — says "Milestone 3, Project Setup" and lists PDF/email/scoring/migrations as "not yet built," all of which exist.
- `docs/ARCHITECTURE.md`'s system diagram references Netlify/Railway — stale vs. actual Vercel/Render deployment.

---

## 11. Images / assets system

- **Bundled assets** (`frontend/src/assets/images/`): 3 logo PNGs; only `nac-logo-icon.png` is actually imported (Navbar, assessment header), with explicit width/height attributes.
- **Static assets** (`frontend/public/`): favicons, apple-touch-icon, android-chrome icons (512x512 doubles as the OG/Twitter share image), `site.webmanifest`, `robots.txt`, `sitemap.xml`.
- No hero/illustration raster images exist — visual components (`HeroVisual.tsx`, `ReportPreview.tsx`) appear to be SVG/CSS/Framer-Motion-based, not image files.
- **No responsive images** (`srcSet`/`<picture>`), **no WebP/AVIF**, **no image optimization library**, and only **one** `loading="lazy"` instance in the entire codebase. This is the weakest part of the current implementation relative to the blog/image goals in the reconstruction plan — effectively a greenfield build, not a migration.

---

## 12. Environment variables

**Frontend** (`frontend/.env.example`, all `VITE_`-prefixed/public): `VITE_API_BASE_URL`, `VITE_TURNSTILE_SITE_KEY` (declared, not yet wired to any component), `VITE_WHATSAPP_COMMUNITY_URL` (optional), `VITE_BOOK_CONSULTATION_URL` (optional).

**Backend** (`backend/.env.example`, validated via Zod in `config/env.ts`): `PORT`, `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NAC_LEAD_ALERT_EMAIL`, `CORS_ORIGIN`, `TURNSTILE_SECRET_KEY` (declared, unused), `BACKEND_BASE_URL`, `FRONTEND_BASE_URL`, `PAYU_KEY`, `PAYU_SALT`, `PAYU_ENV`. Every var except `PORT`/`NODE_ENV`/`CORS_ORIGIN`/`PAYU_ENV` is fully optional at the schema level — the app is designed to degrade gracefully (503s, no-op emails, placeholder payment) rather than crash on missing config.

---

## 13. Render deployment (`render.yaml`)

Single blueprint service: `nac-inventory-assessment-api`, Node 20, root dir `backend`, build `npm install --include=dev && npm run build`, start `npm start`, health check `/api/v1/health`, auto-deploy on commit. Declares (as `sync: false` secrets, set manually in Render dashboard): Supabase, Resend, `NAC_LEAD_ALERT_EMAIL`, `CORS_ORIGIN`, Turnstile, PayU key/salt, backend/frontend base URLs. `PAYU_ENV=production` is committed as a literal value (overriding the code default of `test`) — flagged in-code as required to avoid a live key silently hitting PayU's test endpoint. No frontend/static-site block, no database service block, no cron/worker.

---

## 14. Authentication

**None exists.** No login, no sessions, no JWT, no user accounts, no admin panel. The entire API is public and unauthenticated. Cloudflare Turnstile (bot protection, not auth) is declared in env schema but not wired into any request path yet.

---

## 15. Analytics / tracking

**None exists.** No GA4, no GTM, no Meta/Facebook Pixel, no other tracking script anywhere in the codebase (verified by targeted search — zero hits on `gtag`, `googletagmanager`, `GTM-`, `fbq`, `pixel`). `PrivacyPolicyPage.tsx` explicitly and currently-accurately states no analytics/advertising cookies are used.

---

## 16. Classification table — KEEP / MODIFY / REMOVE LATER / UNKNOWN

| Area | Classification | Notes |
|---|---|---|
| React/Vite/Tailwind/Router shell (`app/`, `shared/`, build config) | **KEEP** | Framework choice is sound; no reason to rebuild the toolchain. |
| `Navbar`, `Footer`, `Button`, form components, layouts | **KEEP** | Reusable, well-structured; will need new nav items/content, not a rewrite. |
| `useSeo.ts` / `useJsonLd.ts` | **KEEP** | Solid, dependency-free SEO mechanism; extend for blog schema types (Article, BreadcrumbList already supported pattern). |
| `ServiceLandingView` + `SERVICE_CATEGORIES` data pattern | **KEEP, repurpose** | Directly reusable template for the two new verticals' service pages — see reconstruction plan. |
| `ResourceComingSoonView` / Blog route scaffold | **MODIFY** | Route/nav slot is right; placeholder content and `noindex` need replacing with the real blog architecture. |
| Assessment engine (question bank, scoring, recommendation engine) | **REMOVE LATER** | Tied to the product being discontinued (per user: "not selling the Inventory Assessment product online anymore"). Not touched in this audit. |
| Assessment submission → lead-alert email path | **UNKNOWN — needs a decision** | This is currently the *only* working lead-capture mechanism in the backend. If the assessment product is removed, a replacement lead-capture form/endpoint is needed for the new site's "Contact/lead generation" goal — see reconstruction plan. |
| Payment/PayU module (all files listed in §6) | **REMOVE LATER** | Per explicit instruction: not selling the assessment online anymore, so ₹99/₹299/PayU checkout should go. Do not remove yet — see dependency trace in §7 first. |
| `report.service.ts` (`deliverPaidReport`) | **REMOVE LATER** | Orphaned once payment is removed (no other caller exists). |
| `pdf`/`internalReport` modules | **UNKNOWN — needs a decision** | Currently payment-gated; if the assessment product itself is removed, these become moot too. If any lead-magnet PDF is kept (e.g. a free downloadable guide for the new blog/resources strategy), this code could be repurposed rather than deleted outright. |
| `frontend/src/features/payment/`, `frontend/src/pages/Payment*`, `ThankYou*` | **REMOVE LATER** | Frontend payment UI, per instruction. |
| `REPORT_TIERS`, `TIER_PRICING`, `CONSULTATION` (₹499) constants | **REMOVE LATER** | Pricing/checkout copy tied to the discontinued product. |
| `index.html` global SEO/OG/JSON-LD | **MODIFY** | Structure is fine; all copy is assessment-specific and needs a full rewrite for the pharmacy/healthcare positioning. |
| `sitemap.xml` / `robots.txt` | **MODIFY** | Structure is fine; URL list needs to reflect the new site map (see reconstruction plan). |
| Images/assets system | **MODIFY (build out)** | No blog-grade image pipeline exists today (no responsive images, no WebP, near-zero lazy loading) — this is greenfield work, not migration. |
| Supabase connection layer, repository pattern, migrations 0001–0007 | **KEEP** | Sound architecture; `companies`/`assessments`/`assessment_answers`/`module_scores` tables are tied to the assessment product specifically, so their *use* depends on the assessment-removal decision, but the connection layer and pattern itself should stay for future lead-capture/blog-metadata storage. |
| Migration 0008 (`payment_orders`) | **REMOVE LATER** | Tied to payment; drop only after the payment module removal is confirmed and any historical data need is addressed. |
| Email (Resend) integration layer | **KEEP** | Reusable for the new lead-gen contact flow regardless of what happens to the assessment/payment product. |
| Render deployment config, Node/Express backend shell | **KEEP** | No reason to change hosting or backend framework. |
| Authentication | **N/A** | None exists; not a repositioning concern unless a future admin/CMS needs one. |
| Analytics/tracking | **UNKNOWN — needs a decision** | Currently absent by design; the new marketing-driven site will likely need GA4 and/or Meta Pixel — a build-out, not a migration. |
| `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API.md`, `README.md` | **MODIFY** | All are stale relative to actual implementation (predate PayU, overstate "not yet built" status); should be refreshed alongside the repositioning, not before. |

---

## 17. Summary of technical risks for the migration

1. **Bidirectional coupling between assessment and payment** means "just delete the payment folder" will break compilation (assessment controller imports from it) — removal needs to be sequenced (see reconstruction plan / a future removal-plan document).
2. **`report.service.ts` has exactly one caller** (payment's `verifyAndFulfillOrder`) — if payment goes, this orchestrator either needs a new caller or removal too.
3. **No CMS/content infrastructure exists** — the blog is a route stub only; building it is net-new work, not a refactor.
4. **No analytics/tracking exists today** — the new lead-gen/marketing site will need this added, which is itself a decision point (GA4 vs. other, cookie-consent implications).
5. **Docs are stale and would mislead a future contributor** if not refreshed — `docs/PRD.md` says payments aren't built; they are. `README.md` says milestone 3; the app is far past that.
6. **Pricing/tier constants are duplicated** between frontend and backend with no shared source of truth — a pattern worth avoiding when introducing new shared data (e.g. service/vertical lists) in the reconstruction.
7. **Image pipeline is essentially absent** — the blog's image requirements (responsive, WebP/AVIF, lazy-loading, SEO filenames) require new infrastructure, not just new content.
8. **The only current lead-capture path is the assessment submission form** — removing the assessment product removes NAC's only working inbound-lead mechanism unless a replacement (e.g. a general "Contact/Request a Consultation" form wired to the existing email service) is built first or alongside.
