# NAC Inventory Health Assessment — Product Requirements Document

**Status:** Approved
**Company:** Nitin Anand Consulting (NAC)
**Project type:** Lead-generation platform (not a SaaS product)

> This is the in-repo copy of the PRD approved before development began. It is
> preserved here for ongoing reference during implementation. For the condensed,
> engineering-facing summary of decisions, see `docs/ARCHITECTURE.md`.

## 1. Executive Summary

NAC Inventory Health Assessment is a public-facing web application that lets business
owners complete a free 52-question self-assessment of their inventory management
practices. The system scores their responses, generates a professional branded PDF
report, emails it to them, and alerts NAC with the lead's full profile and score. The
entire product exists to generate qualified, warm consulting leads — not to be a
standalone software product.

## 2. Business Goals

- Generate qualified, warm consulting leads at scale
- Establish NAC as a credible, data-driven authority
- Reduce sales cycle friction — a lead who already has a scored report is pre-qualified
- Build a reusable lead-gen engine, potentially replicable for other NAC service lines
- Keep infrastructure cost near-zero at low volume

## 3. Target Customers

Manufacturing companies, pharmaceutical companies, medical stores/distributors,
electrical/hardware distributors, warehouses, retail businesses, FMCG distributors,
importers, exporters, and SMEs generally.

## 4. Primary User Journey

```
Ad (Facebook / LinkedIn / WhatsApp)
  → Landing Page → Start Free Assessment → Company Information
  → 52 Inventory Health Questions → Submit
  → Backend: validate → score → generate recommendations → generate report → generate PDF
  → Store assessment → Email PDF to customer → Email lead details to NAC
  → Thank You Page → Book Free Consultation (future)
```

**Key design decision:** company info + contact email is captured *before* the 52
questions, not after — so a partial drop-off still yields a contactable lead.

## 5. MVP Feature Scope

- **Landing Page:** Hero, About, Services, Benefits, Process, Testimonials (placeholder),
  FAQ, Contact, CTA
- **Assessment:** Company info step, 52-question multi-step form, progress bar,
  validation, client-side autosave, mobile responsive
- **Backend:** REST API, scoring engine, recommendation engine, report generator, PDF
  generator, email service, database integration
- **Database:** Companies, Assessments, Answers, Reports, Email Logs, Question Bank,
  Recommendation Rules, Scoring Configuration
- **Reports:** Executive summary, overall score, health rating, module scores, top
  findings, key risks, recommendations, conclusion, next steps, contact info

**Explicitly excluded from MVP:** user accounts/login, payment processing, real-time
chat, admin dashboard UI, dynamic question-editing UI, multi-language support.

## 6. Report Branding

**Header:** Nitin Anand Consulting — Inventory Health Assessment Report
**Footer services listed:** Inventory Audit, Warehouse Audit, Inventory Optimization,
SOP Development, Business Process Improvement
**Contact:** nitinanandconsulting@gmail.com · +91 9619994347
**Includes:** Confidentiality notice

## 7. Non-Functional Requirements

- Landing page LCP < 2.5s on 4G
- Server-side validation on every field, never trust client validation alone
- Rate limiting on the submission endpoint
- Assessment submission persists to DB before PDF/email generation — no data loss if
  downstream steps fail
- Strict TypeScript end-to-end, modular structure, no business logic in UI components

## 8. Key Architectural Decisions (Summary)

Full reasoning for each lives in the complete PRD discussion and `docs/ARCHITECTURE.md`:

- Modular monolith, not microservices
- Two independently deployable apps (Netlify + Railway), not a monorepo
- Scoring and recommendation engines are pure functions — no I/O, fully testable
- Question bank, scoring weights, and recommendation rules are versioned config/data,
  not hardcoded logic
- Single assessment-submission endpoint (atomic), no partial-save endpoint in MVP
- No authentication in MVP; architecture reserves the slot for it (Supabase Auth is the
  natural future fit)
- Rule-based (not LLM-generated) recommendations for MVP — full quality control,
  predictable cost, no risk of inaccurate output under NAC's brand
- PDF generated server-side (React PDF in Express), delivered async by email rather than
  blocking the user's browser session

## 9. Development Roadmap

1. Question bank / scoring weights finalized with NAC's consulting input
2. Project scaffolding (**this milestone**)
3. Landing page
4. Assessment form UI
5. Backend: DB schema, submission API, scoring + recommendation engines
6. PDF report generation
7. Email integration
8. Thank-you page + end-to-end integration
9. Polish pass (performance, accessibility, error states, security)
10. Production deploy + launch

## 10. Open Items Requiring NAC Input

1. The 52 questions, module grouping, and scoring weights (core IP — not yet provided)
2. Health rating band definitions (Critical / Needs Improvement / Good / Excellent, or
   NAC's preferred labels)
3. Recommendation content / consulting language per module
4. Branding assets (logo, color palette, fonts) for site and PDF
5. Internal lead-alert email recipient(s)
6. Domain name (site + Resend sending domain verification)
7. Whether partial/incomplete assessments should be captured as leads in MVP or deferred
   to Phase 2
