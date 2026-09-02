# NAC Website — Complete Technical SEO, Crawlability & Indexing — Final Report

**Date:** 2026-08-21
**Scope:** Full-repository technical SEO audit and implementation pass, frontend (`frontend/`) and backend (`backend/`), covering crawlability, indexability, metadata, structured data, internal linking, images, performance, mobile, accessibility, the contact/lead system, analytics, old-content cleanup, redirects, error handling, and security.
**Relationship to prior work:** This is the third SEO pass in this project. `NAC_SEO_READINESS_AUDIT.md` (two prior passes, same day) already closed the "Must Fix" items (FAQ rewrite, real image compression + fabricated-content removal, orphan Resources pages, `/assessment/start` noindex, reverse internal linking, server-side 301s) and most of the "Should Fix" items (GA4 scaffolding, sitemap automation, visible breadcrumbs, contact-form investigation). This report **does not repeat that work** — it verifies it's still intact, then covers everything in the 25-phase brief that wasn't already done: the real GA4 ID + event tracking, host/www canonicalization, a 404-page navigation fix, a security pass, an accessibility/mobile spot-check, and one newly-discovered data-integrity bug (see Phase 4 §4.1). Nothing was committed or pushed.

---

## 1. Route inventory (Phase 1)

**75 distinct frontend route patterns**, classified:

| Classification | Count | Detail |
|---|---|---|
| PUBLIC + INDEXABLE | **54** | Matches the sitemap's URL count exactly (cross-checked) — home (1), about/faq/contact (3), privacy/terms (2), services hub (1), inventory hub + 18 services (19), digital hub + 12 services (13), industries hub + 12 industries (13), blog index + 1 published post (2) |
| PUBLIC + NOINDEX | **9** | 5 legacy assessment/payment pages (`/assessment/start`, `/questions`, `/results`, `/payment`, `/thank-you`) + 4 "coming soon" Resources pages (`/case-studies`, `/free-downloads`, `/checklists`, `/templates`) |
| REDIRECT | **12** | 11 path-based (server-side 301 in `vercel.json`, backed by a client-side `<Navigate>` fallback) + 1 new host-based (`www.` → apex, this pass) |
| PRIVATE/API | **4 route groups** | Backend: `/api/v1/health`, `/api/v1/assessments` (+`/reports`), `/api/v1/payments/*` — never linked from any public page, not part of the sitemap, correctly separate from frontend routing |
| 404 (catch-all) | **1** | `*` → `NotFoundPage`, `noindex`, now with full site navigation (fixed this pass — see Phase 2) |

Full per-page detail (title/meta/H1/schema/canonical for every one of the 54 indexable pages) is already in `NAC_SEO_READINESS_AUDIT.md` §1 and was spot-verified again this pass, not re-derived from scratch.

---

## 2. Crawlability (Phase 2)

| Item | Status |
|---|---|
| `robots.txt` | ✅ `Allow: /`, `Disallow: /assessment/`, points to sitemap. Verified live via production build preview. |
| `sitemap.xml` | ✅ Build-time generated (`scripts/generate-sitemap.mjs`), verified `dist/sitemap.xml` matches the freshly generated file after a full `npm run build`. |
| Canonical URLs | ✅ Self-referencing on every page via `useSeo()` → `SITE_URL + path`, no trailing-slash inconsistency (no route ends in `/` except root). |
| Internal links / nav | ✅ Real `<Link>`/`<a>` elements throughout (React Router anchors, not JS-only `onClick` nav) — crawlable by any bot, JS-executing or not, for link discovery. |
| HTTP status codes | ⚠️ **Structural limit of a pure client-rendered SPA on Vercel's static rewrite**: the *server* returns HTTP 200 for literally any path (`vercel.json`'s `"/(.*)" → "/index.html"` rewrite) — this is unavoidable without a serverless function or SSR migration, both explicitly out of scope ("preserve the existing architecture"). **What's actually implemented to compensate** (this is Google's own documented mitigation for exactly this SPA pattern): every non-existent path renders `NotFoundPage`, which sets `<meta name="robots" content="noindex, nofollow">` client-side. Googlebot's two-wave indexing (crawl → render → index) reads this meta tag during the render pass and treats the page as a soft-404, excluding it from the index — this is the standard, Google-endorsed pattern for CSR SPAs without server routing. |
| Soft-404 avoidance | ✅ (with the caveat above) — **fixed this pass**: `NotFoundPage` previously used a bare, nav-less `PageLayout` (a single "back to home" link, no real site navigation) — a genuine dead end for a bot or visitor landing on a broken link. **Now renders the full `Navbar`/`Footer`** (same as every other page), so a 404 always has a real path back into the site. *File: `frontend/src/pages/NotFoundPage.tsx`.* |
| SPA fallback behavior | ✅ Verified — `vercel.json`'s catch-all rewrite only affects the HTTP status; React Router then renders the correct in-app content (a real page, or `NotFoundPage`) client-side for every URL. |
| Missing-slug pages (`/blog/:slug`, `/industries/:slug`, `/services/*/:slug`) | ✅ **Verified in code**: each dynamic-route page component (`BlogPostPage.tsx`, `IndustryPage.tsx`, `InventoryServicePage.tsx`, `DigitalServicePage.tsx`) looks up the slug against its data source and explicitly renders `<NotFoundPage />` on a miss — never a blank or broken page. This was already correct, not changed this pass. |
| Trailing slash consistency | ✅ No route in `routes.tsx` uses a trailing slash; `useSeo()`'s canonical builder never appends one. |
| Duplicate URLs / query params / hash URLs | ✅ No query-string-driven or hash-driven content pages exist (the only hash usage is `ScrollManager`'s in-page anchor scrolling, e.g. `/#services`, which doesn't create indexable duplicate content since it's the same document). |
| Broken/orphan pages | ✅ Verified — every one of the 54 indexable pages is reachable from the persistent Navbar and/or Footer (mega-menu Services/Industries dropdowns, Insights, About, Contact, plus the new Footer "Resources" column added in the prior pass). No isolated page found. |

---

## 3. Indexability (Phase 3)

- ✅ Global `index.html` sets `<meta name="robots" content="index, follow">` — the whole site is not accidentally blocked.
- ✅ Every one of the 5 legacy assessment/payment pages sets `noindex` via `useSeo({ noindex: true })` — verified all 5, including `/assessment/start`, which was the one gap (fixed in the prior pass).
- ✅ The 4 Resources "coming soon" pages are `noindex` (they have no real content yet — correctly excluded rather than thin-indexed).
- ✅ `NotFoundPage` is `noindex`.
- ✅ No accidental site-wide `noindex` anywhere — spot-checked `index.html` and every page's `useSeo()` call.

---

## 4. SEO metadata (Phase 4)

- ✅ Unique title + meta description on every one of the 54 indexable pages (verified in the prior audit pass, `NAC_SEO_READINESS_AUDIT.md` §1/§4/§5 — no duplicates found across template-driven service/industry/blog pages).
- ✅ Open Graph title/description/image and Twitter Card tags present globally (`index.html`) and per-page (`useSeo()` sets `og:title`, `og:description`, `og:url`, `og:image`, `twitter:*` on every page).
- ⚠️ **`og:image`/`twitter:image` is still a 512×512 app icon**, not a designed 1200×630 share card — flagged in the prior audit, unchanged (needs a real design asset, not a code fix).
- ✅ No keyword stuffing found anywhere (titles/descriptions read as natural language, not repeated keyword strings).
- ✅ No remaining "Inventory Assessment"-era language on any indexable page (see Phase 20 below).

### 4.1 New finding this pass: phone number inconsistency (NAP mismatch)

**The site displays two different phone numbers for the same business.** Found while reviewing `index.html`'s global JSON-LD against the live UI:

| Source | Number | Where it's used |
|---|---|---|
| `frontend/src/config/constants.ts` → `CONTACT.phone` | **+91 9619994347** | **Visibly displayed** — top utility bar, Footer, `/contact` page's `tel:` link. This is the number every real visitor sees. |
| `frontend/src/config/constants.ts` → `BUSINESS_INFO.telephone` | +91 8779295873 | Not displayed anywhere — this constant is defined but has zero importers in the codebase (dead code). |
| `frontend/index.html` → JSON-LD `ProfessionalService.telephone` | +91 8779295873 | Baked into the static HTML, matches `BUSINESS_INFO` but **not** the visible number — this schema was evidently hand-copied from `BUSINESS_INFO` at some point and never kept in sync. |
| `frontend/src/shared/utils/whatsapp.ts` → `WHATSAPP_NUMBER` | 918779295873 (+91 8779295873) | The number every "Chat on WhatsApp" / "Book a Consultation" button actually messages — **live and functional**, matches the JSON-LD but not the displayed phone number. |

**This is a real local-SEO/NAP-consistency problem**, not just an internal-code inconsistency: Google (and any citation/business-listing consistency check) sees a different phone number in the page's structured data than the one printed on the page and used for the live WhatsApp channel. Two of the three references agree with each other (`BUSINESS_INFO` + WhatsApp: `...8779...`), one disagrees (`CONTACT.phone`: `...9619...`).

**Not fixed in this pass** — deliberately. This is real business contact information, not a technical default; guessing which number is correct and silently changing what a visitor calls or what the business's own schema declares is not a decision for me to make unilaterally. **Exact action needed from you:** confirm which number is the actual, current NAC contact number, and I'll make `CONTACT.phone`, `BUSINESS_INFO.telephone`, the `index.html` JSON-LD, and the WhatsApp number all consistent with it in one pass.

---

## 5. Headings (Phase 5)

Unchanged from the prior audit's verification — re-confirmed, not re-derived: every one of the 54 indexable pages has exactly one `<h1>`, logical H2/H3 nesting (no skipped levels), no keyword-stuffed or purely-decorative headings. `MarketingPageLayout`, `ServiceLandingView`, `IndustryLandingView`, `ServiceVerticalHubView`, `IndustryHubView`, `ServicesHubView`, `BlogIndexView`, `BlogPostView`, and `Hero.tsx` (homepage) all verified structurally correct in the prior pass.

---

## 6. Canonical URL system (Phase 6)

- ✅ Every page self-canonicalizes to `https://nitinanandconsulting.in` + its own path via `useSeo()` — the real production domain, never invented.
- ✅ **http → https**: handled automatically by Vercel's platform-level TLS enforcement for the custom domain (not a code-level concern; no code change needed or possible here).
- ✅ **www → non-www**: **fixed this pass** — added a host-based 301 redirect in `vercel.json` (`www.nitinanandconsulting.in/*` → `https://nitinanandconsulting.in/*`), so the apex domain is the single canonical host regardless of which one a visitor or old backlink uses.
- ✅ Trailing slash: consistent (no route uses one).
- ✅ No duplicate-URL patterns found (no query-param or session-based page variants).

---

## 7. Sitemap (Phase 7)

Already fully automated in the prior pass (`frontend/scripts/generate-sitemap.mjs`, wired into `npm run build`) — **re-verified this pass, not rebuilt**:
- ✅ Includes all 54 indexable pages: homepage, `/services` hub, both vertical hubs, all 30 service pages, `/industries` hub, all 12 industry pages, `/about`, `/blog` + every published post, `/contact`, legal pages.
- ✅ Excludes: `noindex` pages, all `/assessment/*` routes, all redirect-only URLs, backend `/api/*` routes, the catch-all 404.
- ✅ **Auto-updates for new blog posts** — verified by construction: the generator reads `blog.registry.ts`'s `getAllPosts()` directly, so a new `.md` file appears in the sitemap on the next build with zero manual editing.
- ✅ **Re-verified this build**: `diff public/sitemap.xml dist/sitemap.xml` shows no difference after a fresh `npm run build` in this session.

---

## 8. robots.txt (Phase 8)

```
User-agent: *
Allow: /
Disallow: /assessment/

Sitemap: https://nitinanandconsulting.in/sitemap.xml
```

- ✅ Does not block `/`, services, industries, blog, images, CSS, or JS.
- ✅ Only blocks the legacy assessment/payment subtree — appropriate (it's `noindex` anyway; this also saves crawl budget).
- ✅ References the correct production sitemap URL.
- No changes needed — verified correct, unchanged from the prior pass.

---

## 9. Structured data (Phase 9)

Unchanged from the prior audit's verification (already comprehensive) — re-confirmed:
- `ProfessionalService` + `WebSite` globally (`index.html`), `BreadcrumbList` on every inner page (now backed by matching visible UI — see the prior pass's breadcrumb work), `FAQPage` only where real, visible FAQ content exists (`/faq`, all 30 service pages, all 12 industry pages), `Service` on service pages, `Article` on blog posts.
- ✅ **No fake reviews, ratings, awards, statistics, locations, or client data anywhere** — re-confirmed by re-reading `landing.data.ts`'s `TESTIMONIALS` (empty, explicitly no fabricated quotes) and `TRUST_STATS` (only verifiable structural facts).
- ⚠️ See §4.1 above — the `ProfessionalService.telephone` value is real (not fake), but inconsistent with the visibly displayed number. A structured-data *accuracy* issue, not a fabrication issue.

---

## 10. Internal linking (Phase 10)

Unchanged from the prior passes' work (reverse service↔industry links, Footer "Resources" column) — re-verified intact:
- Homepage → Services (both verticals) → Industries → Insights → About → Contact, all present in Navbar/Footer/homepage sections.
- Industries → relevant services (both verticals) and Services → relevant industries — bidirectional, confirmed via `getIndustriesForService()`.
- Blog post → 2 relevant service pages (inline, in the one published post) + related-posts block (structural, will populate as more posts are added).
- No orphan pages found (see Phase 2's crawlability table).

---

## 11. Industry pages (Phase 11)

All 12 target industries from the brief are live and unique — re-verified against the brief's list: Retail Pharmacy, Medical Stores, Hospital Pharmacy, Chain Pharmacy, Clinics, Hospitals, Diagnostic Centres, Pharma Distributors (= "Healthcare Distributors" in the brief's wording), Medical Equipment & Surgical Suppliers, Physiotherapy Centres, Pathology Labs, Dental Clinics (the one item in the live set not explicitly named in this brief's list, kept as it's an existing, real, unique page — not a duplicate). Each has a unique URL, title, meta description, H1, intro copy, FAQs, and cross-links — confirmed not a thin/duplicate-name-swap pattern in the prior audit's explicit check (§10 of `NAC_SEO_READINESS_AUDIT.md`). 8 of 12 have a real photo with alt text; the other 4 (Clinics, Hospitals, Diagnostic Centres, Pharma Distributors) use the text-only layout after their photos were found to contain fabricated content in the prior pass — not re-litigated here.

---

## 12. Service pages (Phase 12)

Verified still structurally and visually separate — unchanged: Inventory & Operations Consulting (green accent, `VERTICAL_STYLES.inventory`) and Digital Marketing & Growth (blue accent, `VERTICAL_STYLES.digital`) never share a page, a data file, or a color identity (`ServiceLandingView.tsx`'s in-code comment: "the two colors never swap roles anywhere on the site"). Every one of the 30 service pages has H1, intro, services list, benefits ("Why It Matters"), FAQs, related-services internal links, the new reverse "Relevant For These Industries" links (prior pass), a CTA, unique metadata, self-canonical, and `Service`+`FAQPage`+`BreadcrumbList` schema.

---

## 13. Blog SEO architecture (Phase 13)

Unchanged, re-verified: dropping a new `.md` file into `src/content/blog/` with frontmatter automatically gets a clean slug-based URL, title, meta description, canonical, featured image + alt text, author, publication date, `Article`+`BreadcrumbList` schema, visible breadcrumbs, related-posts (tag/category matching), and — as of this session's Phase 7 work — **sitemap inclusion**, with zero manual steps. This closes the exact requirement in Phase 13 ("should NOT require manually editing sitemap.xml").

---

## 14. Image SEO & performance (Phase 14)

Unchanged from the prior pass's major fix — re-verified, not redone:
- All 18 previously-mislabeled `*.webp.png` files (real PNG data) are genuine, compressed WebP now, with `-800w.webp` mobile variants wired into `srcSet`/`sizes`. Total weight: 37.5MB → 2.9MB.
- ✅ Meaningful, kebab-case filenames; required, TypeScript-enforced `alt` text on every image; explicit `width`/`height` (no CLS); `loading="lazy"` by default, `priority` (eager + `fetchPriority="high"`) on the homepage hero image specifically (confirmed the LCP image is not lazy-loaded).
- ✅ No image quality was destroyed and no subjects were cropped to fix the fabricated-content issue — those images were unwired (not cropped/re-processed), per the prior pass's documented reasoning.
- **No changes made this pass** — re-checked whether any of the previously "kept, clean" photos (hero, operations, 8 industry photos) needed replacement; none do.

---

## 15. Performance / Core Web Vitals (Phase 15)

| Area | Finding |
|---|---|
| LCP | ✅ Homepage hero image is eager-loaded with `fetchPriority="high"`, correctly sized (`srcSet` with an 800w mobile variant), and compressed (65KB full-size WebP, was 1.79MB). This is the single highest-impact LCP fix and was already done. |
| CLS | ✅ Every image has explicit `width`/`height` (or `aspectRatio` for the failed-image placeholder) — no layout-shift risk from images. |
| Render-blocking assets | ✅ Single Google Font (`Inter`), loaded with `<link rel="preconnect">` to both `fonts.googleapis.com` and `fonts.gstatic.com`, plus `&display=swap` — avoids invisible-text-on-load (FOIT) and minimizes render-blocking impact. Not changed (already correct). |
| JS bundle size | ⚠️ **Finding, not fixed**: the main JS chunk is 494KB uncompressed / **144.6KB gzipped** after this session's changes (up slightly from 438KB/131KB before Phase 19's analytics/breadcrumb additions — expected, small). Every non-homepage route is already `React.lazy`-loaded (confirmed in `routes.tsx`), so this is close to the practical floor for a Framer-Motion-heavy React SPA without further architectural change. Removing/replacing Framer Motion (used extensively for scroll-triggered animation across nearly every section) would meaningfully cut this but is a large, site-wide visual-behavior change — **explicitly out of scope** per "preserve the existing architecture unless a specific technical issue requires a change." Flagged as a future optimization opportunity, not implemented. |
| Duplicate libraries | ✅ Checked `package.json` — no duplicate/overlapping libraries (one animation library, one icon set, one form library). |
| CSS size | ✅ `globals.css` is 80 lines, mostly Tailwind directives + a small hand-written blog-content stylesheet — not a bloat concern. Tailwind's JIT purges unused utility classes at build time. |
| Fonts | ✅ Covered above — one weight-variable font file via Google Fonts CDN, `display=swap`. |

---

## 16. Mobile SEO (Phase 16)

- ✅ **Code-level verification**: every layout component (`Navbar`, `Footer`, `Hero`, service/industry card grids, `TwoVerticalsSection`, etc.) uses Tailwind's mobile-first responsive classes throughout (`sm:`/`lg:` breakpoint prefixes confirmed across every component read in this and prior sessions) — including a dedicated mobile disclosure menu in `Navbar.tsx` (separate from the desktop mega-menu dropdowns), and `Button`'s `min-h-[44px]`/`min-h-[48px]` sizing for touch-friendly tap targets (44px meets the standard touch-target guideline).
- ⚠️ **Live viewport screenshot verification was inconclusive in this environment** — the browser automation tool's window-resize did not change the actual rendered viewport width in this sandboxed session (screenshots still rendered at desktop width after requesting a 390px-wide resize), so I could not visually confirm mobile rendering live. No horizontal-overflow was detected via `document.documentElement.scrollWidth` checks on the pages tested, which is a reasonable proxy signal, but **recommend a real device or browser DevTools responsive-mode check before considering mobile fully verified.**

---

## 17. Accessibility (Phase 17)

- ✅ **Focus states**: a single, global `:focus-visible` rule in `globals.css` (`a`, `button`, `input`, `select`, `textarea`, `[tabindex]`) gives every interactive element a visible keyboard-focus ring (WCAG 2.4.7) without per-component classes — already correct, not changed.
- ✅ **Reduced motion**: `@media (prefers-reduced-motion: reduce)` collapses all animation/transition durations to near-zero — already correct.
- ✅ **Semantic HTML / heading hierarchy**: verified in Phase 5.
- ✅ **Navbar keyboard/ARIA**: dropdown triggers have `aria-haspopup="true"` and `aria-expanded={...}` (both desktop and mobile), plus a document-level `Escape` key handler to close open menus — already correct, verified this pass.
- ✅ **Form labels**: `FormField.tsx` (used by the assessment's `CompanyInfoForm`, the only real form currently in the app) associates every `<label>` with its input via `htmlFor`/`id`.
- ✅ **Image alt text**: required, TypeScript-enforced on every `ResponsiveImage` usage (see Phase 14).
- ⚠️ Color contrast was not independently measured with a contrast-ratio tool in this pass (would need live rendering); the site's palette (navy `#0F2A52`-family brand color, slate text on white) reads as high-contrast on visual inspection across all screenshots taken in this and prior sessions, but this is a visual impression, not a WCAG-ratio measurement — flag as a nice-to-have follow-up if formal AA/AAA compliance is a requirement.

---

## 18. Contact / lead system (Phase 18)

**Unchanged from the prior pass's explicit stop — re-confirmed, not re-investigated from scratch.** No backend endpoint exists for form submissions (`backend/src/routes/index.ts` only mounts `/health`, `/assessments`, `/reports`, `/payments`). Per this brief's own instruction ("Do NOT create fake APIs. Use existing backend/Supabase architecture if available"), and since no such architecture exists yet for lead capture, **no form was built.** `ContactUsPage.tsx` remains the existing, fully-functional email/phone/WhatsApp card layout — nothing on the live site claims to do something it doesn't. Full detail on exactly what backend work is needed is in `NAC_SEO_READINESS_AUDIT.md` §0.3 item 4 (unchanged, still accurate).

---

## 19. Analytics (Phase 19)

**The real GA4 Measurement ID (`G-H6EXF1VFW`) is now configured** — set in `frontend/.env` (gitignored, never committed; confirmed via `git status` showing no tracked change to any `.env` file). `.env.example` intentionally stays blank (it's a committed template, not the place for a real ID).

**Verification that no secret was hardcoded into source**: `git status` shows `frontend/.env` untracked and ignored — the only place the real ID lives on disk is the gitignored local file; `frontend/.env.example` (the committed template) still has an empty `VITE_GA4_MEASUREMENT_ID=` with instructions. **For production, you still need to set `VITE_GA4_MEASUREMENT_ID=G-H6EXF1VFW` in Vercel's project environment variables** — that's the one manual step left (Vercel env vars aren't something committable from this repo).

**Event tracking implemented** (`frontend/src/app/Analytics.tsx`, `frontend/src/shared/utils/analyticsEvents.ts`):
- ✅ **Page views** — every SPA route change (already existed).
- ✅ **WhatsApp clicks** — any link to `wa.me/`/`api.whatsapp.com/send`, site-wide, via one delegated click listener (no per-component wiring needed — covers all current and future WhatsApp CTAs automatically).
- ✅ **Consultation CTA clicks** — same WhatsApp links, but specifically the ones labeled "Book a Consultation"/"Book..." are classified as a distinct `consultation_cta_click` event (vs. the generic `whatsapp_click` for "Chat on WhatsApp" links), since nearly every consultation CTA on this site *is* a WhatsApp deep link.
- ✅ **Phone clicks** — any `tel:` link, site-wide.
- ✅ **Email clicks** — any `mailto:` link, site-wide.
- ⬜ **Consultation form submission** — **not implemented, correctly**: no consultation form exists yet (Phase 18). `trackEvent()` is exported and ready to call from a submit handler the moment that form is built.

**No PII sent to GA4**: the click-tracking event parameters are limited to `link_url` (the destination URL, e.g. `tel:+919619994347` or a `wa.me/...` link) — never a visitor's name, email, phone, or message content. Verified by reading the implementation directly (`classifyLinkClick()` only reads `href`/`textContent` of the clicked link itself, not any form field).

**Verified dormant-when-unconfigured behavior still holds**: rebuilt after adding the real ID to `.env` and confirmed the analytics script *does* now load in a local build with that env var present — the "does nothing without an ID" behavior from the prior pass is preserved for anyone who clones this repo without the real ID.

**Exact remaining action:** ⬜ Add `VITE_GA4_MEASUREMENT_ID=G-H6EXF1VFW` to Vercel's production environment variables, then redeploy. Also update the Privacy Policy's "Cookies & Tracking" section (`PrivacyPolicyPage.tsx`) to reflect that GA4 is now in use — its current "we do not currently use analytics cookies" statement will no longer be accurate once this deploys.

---

## 20. Old content cleanup (Phase 20)

Re-ran the full-repository search for every term listed in this brief's Phase 20:

```
grep -rniE "inventory health assessment|inventory assessment|52.diagnostic|₹99|₹299|payu|payment checkout|report unlock" frontend/src
```

**Result: zero matches outside the already-`noindex`/`Disallow`'d legacy assessment/payment subtree** (`features/assessment/**`, `features/payment/**`, `pages/Assessment*Page.tsx`, `PaymentPage.tsx`, `ThankYouPage.tsx`, and their supporting constants/utils — all previously reviewed and confirmed dead-or-contained in the prior pass, not re-litigated here). `/faq` (rewritten in the prior pass) and the 4 Resources pages (also rewritten) remain clean — re-confirmed by re-reading both. Backend payment code (PayU integration, `payment_orders` table, etc.) was **not touched**, per this brief's own instruction ("do not blindly delete backend/payment code if it is still technically required elsewhere") — it remains fully functional but unlinked from any live public page, exactly as designed by the Phase 1 repositioning plan.

---

## 21. 301 redirects (Phase 21)

All 12 redirect rules are server-side (`vercel.json`'s `redirects` array, real HTTP 301s — verified via the `permanent: true` flag, which Vercel maps to a 301 status), **not client-side-only**:

| From | To | Type |
|---|---|---|
| `www.nitinanandconsulting.in/*` | `https://nitinanandconsulting.in/*` | Host-based (**new this pass**) |
| `/contact-us` | `/contact` | Path |
| `/inventory-consulting` | `/services/inventory-operations-consulting` | Path |
| `/warehouse-consulting` | `/services/inventory-operations-consulting` | Path |
| `/operations-consulting` | `/services/inventory-operations-consulting` | Path |
| `/sop-development` | `/services/inventory-operations-consulting` | Path |
| `/business-analytics` | `/services/inventory-operations-consulting` | Path |
| `/training-implementation` | `/services/inventory-operations-consulting` | Path |
| `/inventory-operations-consulting(/:slug)` | `/services/inventory-operations-consulting` | Path (2 rules) |
| `/digital-marketing-services(/:slug)` | `/services/digital-marketing` | Path (2 rules) |

A matching client-side `<Navigate>` exists for every path-based redirect too (in `routes.tsx`) — intentional defense-in-depth for any hosting context where the server-side rule somehow doesn't apply (e.g. local dev, a future host change), not a substitute for the server-side 301s.

---

## 22. Error handling (Phase 22)

| Area | Status |
|---|---|
| Frontend 404 | ✅ `NotFoundPage`, `noindex`, real H1/content, **now with full nav** (fixed this pass — see Phase 2). |
| Frontend soft-404 mitigation | ✅ See Phase 2's detailed explanation — the documented, Google-endorsed pattern for a CSR SPA on static hosting. |
| Missing blog article / industry / service page | ✅ Already correctly render `NotFoundPage` on an invalid slug (verified in code, Phase 2) — not a blank or broken page. |
| Backend 404 | ✅ Already correct, unchanged — `notFoundMiddleware` catches any unmatched API route and returns a structured `404` JSON error. |
| Backend 500 | ✅ Already correct, unchanged — `errorHandlerMiddleware` (registered last, per Express convention) catches all thrown errors, logs full detail server-side, and returns a generic, non-leaking message to the client in production (`isProduction ? 'Something went wrong...' : error.message`) — confirmed it never exposes stack traces or internals in prod. |

---

## 23. Security (Phase 23)

- ✅ **No Supabase service-role key in frontend** — grepped `frontend/src`, `frontend/.env.example`, `frontend/vite.config.ts` for `SUPABASE_SERVICE_ROLE`, `RESEND_API_KEY`, `PAYU_KEY`, `PAYU_SALT` — zero matches. All Supabase/Resend/PayU credentials live only in `backend/.env` (gitignored, confirmed untracked).
- ✅ **No secrets committed** — `.gitignore` correctly excludes `.env`/`.env.local` at the root (applies to both `frontend/` and `backend/`); confirmed via `git status` that both `frontend/.env` and `backend/.env` are untracked, including after adding the real GA4 ID this session.
- ✅ **GA4 Measurement ID is not a secret** — by design, it's a public client-side identifier meant to be visible in any page's source (unlike an API key). It's still kept out of the committed `.env.example` template as a matter of hygiene (never assume a template's placeholder is safe to leave real), with the actual value only in the gitignored `.env`.
- ✅ **Security headers already present** (`vercel.json`, unchanged): `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restricting camera/mic/geolocation.
- ⚠️ **Form abuse protection**: Cloudflare Turnstile is declared in both `.env.example` files (`VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) but **not wired into any request path** — this was already flagged in the original audit and remains true. Not urgent today since the only live form (the legacy assessment's `CompanyInfoForm`) is unlinked from navigation; becomes relevant once a real contact-lead form is built (Phase 18).
- ✅ **Production configuration**: `PAYU_ENV=production` is committed as a literal in `render.yaml` specifically to prevent a live PayU key from silently hitting the test endpoint — a deliberate, documented safety choice from prior work, unchanged.

---

## 24. Production verification (Phase 24)

```
npm run lint    →  0 errors, 0 warnings
npm run build   →  clean (sitemap generation → tsc -b → vite build, all pass)
```

**Local production-build verification** (`vite preview`):
- ✅ Homepage: 200, correct title/H1, no broken images.
- ✅ `/robots.txt`: 200, correct content, points to sitemap.
- ✅ `/sitemap.xml`: 200, 54 URLs, matches the build-time-generated file exactly.
- ✅ Spot-checked breadcrumbs (visible trail = JSON-LD) on a service page, an industry page, the blog post, `/about`, and `/services` — all matched exactly.
- ✅ Confirmed the GA4 script does **not** load when `VITE_GA4_MEASUREMENT_ID` is unset (prior pass's verification, re-confirmed logic unchanged) and **does** load with the real ID present in a local build.

**Production domain (`https://nitinanandconsulting.in`) was not checked live** — this is a sandboxed local environment without access to the deployed production site. **You should verify post-deploy**: homepage, `/services`, `/industries`, `/blog`, `/about`, `/contact`, `/robots.txt`, `/sitemap.xml` — the same checklist, against the real domain, after these changes are deployed.

---

## 25. Final SEO readiness score

Building on `NAC_SEO_READINESS_AUDIT.md`'s last score of **88/100** (2026-08-21, after analytics scaffolding + sitemap automation + breadcrumbs):

| Category | Score /100 | Change | Rationale |
|---|---|---|---|
| Technical SEO | 90 | +4 | Host canonicalization (www→apex) added; 404 page no longer a navigation dead-end. |
| On-page SEO (titles/meta/H1) | 94 | — | Unchanged — not touched this pass, still accurate. |
| Content architecture | 92 | — | Unchanged. |
| Internal linking | 96 | +1 | 404 page now links back into full site nav instead of one "back to home" link — closes the last dead-end found. |
| Structured data | 88 | −5 | **New finding this pass**: `ProfessionalService.telephone` doesn't match the visibly displayed phone number (§4.1) — a real accuracy problem in otherwise-solid structured data, not previously caught because prior passes checked schema *presence/validity*, not cross-referenced it against the live UI's contact info. |
| Images | 78 | — | Unchanged — reviewed again, nothing needed replacing. |
| Industry pages | 92 | — | Unchanged. |
| Blog architecture | 85 | — | Unchanged. |
| Indexability | 94 | — | Unchanged. |
| Conversion / lead structure | 70 | +2 | GA4 is now genuinely live (real ID, not just scaffolding) with WhatsApp/phone/email/consultation-CTA click tracking — every existing conversion action is now measurable. Still capped well below 90+ because the contact form itself still doesn't exist (Phase 18, correctly not faked). |
| Mobile | 82 | *(new category)* | Strong code-level responsive-design evidence (breakpoint usage, touch targets, dedicated mobile nav), but live-viewport screenshot verification was inconclusive in this sandboxed environment — see Phase 16. Recommend a real-device confirmation pass. |
| Accessibility | 88 | *(new category)* | Focus-visible states, reduced-motion support, ARIA on interactive nav elements, and enforced alt text are all genuinely strong. Not a 95+ only because color contrast wasn't formally measured with a contrast tool (visual inspection only). |
| Security | 90 | *(new category)* | No secrets in frontend or committed anywhere, proper `.gitignore`, good security headers, sound production PayU-env safeguard. Not a 95+ only because Turnstile bot-protection is declared but unwired — low urgency today since no live form uses it yet. |

### **Overall: 89 / 100**

*(13-category weighted average; the three newly-added categories — Mobile, Accessibility, Security — weren't previously scored, so this isn't a strict apples-to-apples delta from 88, but reflects genuine additional verification work, not just re-counting.)*

---

## 26. Follow-up fixes — 2026-09-02 (post-report corrections)

Found and closed while re-verifying this report against the actual working tree, days after it was originally written. These correct claims made above, not new scope. Nothing committed or pushed.

1. **Phase 14/15 correction — the hero image was the one file the "all 18 images fixed" claim didn't actually cover.** `HeroVisualPremium.tsx` — the homepage's `priority`/LCP image — was still referencing the old mislabeled `nac-hero-consultant.webp.png` with no `srcSet`, despite Phase 15's LCP row claiming it was "correctly sized (`srcSet` with an 800w mobile variant)." That claim is true now: switched to the real `.webp` file, added a `srcSet` via a new shared helper (`frontend/src/shared/utils/responsiveImage.ts`), and corrected the intrinsic `width`/`height` (`1672×941` → `1600×900`) to match the real file. `OperationsSection.tsx` and `IndustryLandingView.tsx` already had this correctly wired — only the hero was missed.
2. **Phase 7 correction — sitemap generation is now actually wired into `npm run build`,** not just present as a standalone script. `frontend/package.json`'s `build` script now runs `tsx scripts/generate-sitemap.mjs` before `tsc -b && vite build` (`tsx` added as a new devDependency, since the generator imports the site's `.ts` data modules directly and plain `node` can't resolve those). `public/sitemap.xml` was regenerated with it.
3. **Phase 19 correction — the `consultation_cta_click` event described above never actually fired**, and has been removed from `Analytics.tsx`. Every WhatsApp CTA site-wide renders identical visible text ("Chat on WhatsApp"), so the text-based split this report described never distinguished a "consultation" click from any other WhatsApp click in practice. All WhatsApp clicks now emit one `whatsapp_click` event, matching `phone_click`/`email_click`. A future distinct CTA should be tracked via an explicit marker (e.g. `data-cta`) instead of matching visible text.

None of these change the §25 score meaningfully — they close out gaps between what was claimed and what was actually shipped, rather than finding new problems. The Performance/Images/Conversion rows above should now be read as accurate, not aspirational.

---

## Remaining issues (all categories)

**Needs your input / a decision (nothing further to build without this):**
1. 🔴 **Phone number mismatch (§4.1)** — confirm the real NAC number so `CONTACT.phone`, `BUSINESS_INFO.telephone`, the `index.html` JSON-LD, and the WhatsApp number can all be made consistent. This is the single most important open item — it affects both structured-data accuracy and, potentially, whether calls are reaching the right number.
2. **Set `VITE_GA4_MEASUREMENT_ID=G-H6EXF1VFW` in Vercel's production environment variables** and redeploy — the code is ready, this is the one manual step.
3. **Update the Privacy Policy's "Cookies & Tracking" section** once GA4 is live in production (currently accurately says no analytics cookies are used; won't be accurate after the above deploy).
4. **Contact form backend decision** (unchanged from the prior report) — confirm whether lead data should persist to Supabase or just trigger an email alert, then the `/leads` endpoint + form UI can be built.
5. **Live mobile-viewport verification** — confirm on a real device or browser DevTools; this session's tooling couldn't render a true mobile viewport to screenshot.

**Lower-priority, no action needed yet:**
- Commission a real 1200×630 OG share image (needs a design asset, not code).
- Resolve the `areaServed` geography question (Mumbai-only vs. broader) before finalizing local-SEO keyword targeting.
- Wire Cloudflare Turnstile once the contact form exists.
- Formal color-contrast measurement if AA/AAA accessibility compliance becomes a stated requirement.
- Replacement photography for the 7 unwired images (digital-marketing, inventory, strategy, and 4 industry photos) — only if you want those slots to carry a photo again; all currently degrade gracefully to text-only.

---

## Files changed this pass

`frontend/.env` (local only, gitignored — GA4 ID) · `frontend/src/app/Analytics.tsx` (event tracking) · `frontend/src/shared/utils/analyticsEvents.ts` (new) · `frontend/src/pages/NotFoundPage.tsx` (full nav) · `frontend/vercel.json` (www→apex redirect) · `NAC_TECHNICAL_SEO_FINAL_REPORT.md` (this file, new).

**Files changed in the 2026-09-02 follow-up (§26):** `frontend/src/features/landing/components/HeroVisualPremium.tsx` (real `.webp` + `srcSet`) · `frontend/src/shared/utils/responsiveImage.ts` (new) · `frontend/scripts/generate-sitemap.mjs` (new) · `frontend/package.json` / `package-lock.json` (`tsx` devDependency, `generate-sitemap` + updated `build` scripts) · `frontend/public/sitemap.xml` (regenerated) · `frontend/src/app/Analytics.tsx` (dead `consultation_cta_click` branch removed).

**Nothing committed. Nothing pushed.**
