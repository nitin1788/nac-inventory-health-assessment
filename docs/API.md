# API Reference

Base URL: `/api/v1` (proxied from the frontend dev server to `http://localhost:4000` in
development; same-origin behind a reverse proxy or absolute Railway URL in production,
depending on final deployment configuration).

This document is the contract both `frontend/` and `backend/` implement against, since
types are intentionally duplicated rather than shared via a monorepo package (see
`docs/ARCHITECTURE.md`).

## Response Envelope

**Success**
```json
{
  "success": true,
  "data": { },
  "meta": { "timestamp": "2026-07-25T00:00:00.000Z" }
}
```

**Error**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [{ "field": "email", "issue": "Invalid email address" }]
  },
  "meta": { "timestamp": "2026-07-25T00:00:00.000Z" }
}
```

## Status Codes

| Code | Meaning |
|---|---|
| 200 | Success (GET) |
| 201 | Created (POST) |
| 400 | Validation error |
| 404 | Not found |
| 429 | Rate limited |
| 500 | Internal server error |
| 503 | Dependency not configured (e.g. Supabase not yet connected) |

## Endpoints

### `GET /api/v1/health`

Status: **Implemented (Milestone 3)**

Returns API liveness and dependency configuration status. No auth, no rate limit beyond
the default.

**Response `data`:**
```ts
{
  status: 'ok' | 'degraded';
  uptimeSeconds: number;
  timestamp: string;
  dependencies: {
    supabase: 'configured' | 'not_configured';
  };
}
```

---

### `GET /api/v1/questions`

Status: **Planned — Milestone 4**

Returns the active question bank so the frontend never hardcodes questions.

---

### `POST /api/v1/assessments`

Status: **Implemented (Milestone 9)**

Submits a complete assessment (company info + all answers + computed module scores) in
a single atomic request. Persists company → assessment → answers → module scores via
one transactional Postgres function (`submit_assessment`, see
`backend/src/database/migrations/0007_submit_assessment_function.sql`) — a failure at
any step rolls back the whole submission. Rate-limited to 5 requests/hour/IP. No
partial/draft submission endpoint in MVP (see PRD Section 17).

**Request body:**
```ts
{
  company: {
    companyName: string;
    contactPerson: string;
    designation: string;
    mobile: string;
    email: string;
    businessType: string;
    industry: string;
    employeeCount: string;
    inventoryLocations: string;
    activeSkus: string;
  };
  overallScore: number;
  overallPercentage: number;
  healthRating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical';
  answers: { questionId: string; selectedOption: string; selectedScore: number | null }[];
  moduleScores: {
    moduleId: string;
    moduleName: string;
    score: number;
    maxScore: number;
    percentage: number;
    rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical';
  }[];
}
```

**Response `data`:**
```ts
{
  id: string;             // assessment UUID
  assessmentNumber: string; // e.g. "NAC-2026-000001"
}
```

**Side effect (Milestone 11):** after the response is sent, the server generates the PDF
report and emails it to `company.email` (subject, body, and attachment per
`backend/src/modules/email/email.service.ts`). This happens asynchronously — it never
blocks or fails the request, since the assessment is already durably saved by the time
it runs (see docs/PRD.md §7). If Resend isn't configured (`RESEND_API_KEY`/
`RESEND_FROM_EMAIL` unset), the email step is skipped and logged, not retried.

---

### `GET /api/v1/assessments/:id`

Status: **Implemented (Milestone 9)**

Fetches the full detail of one assessment: assessment fields, its company, module
scores, and answers. `:id` must be the assessment UUID (not the human-readable
assessment number).

---

### `GET /api/v1/reports/:id`

Status: **Implemented (Milestone 9)**

Same lookup and response shape as `GET /api/v1/assessments/:id`, exposed as a distinct
route so report-specific behavior (view tracking, expiry, etc.) has a natural home
later without reshaping the assessments resource. There is no separate `reports` table
— report data is assembled on demand from `assessments`, `companies`,
`assessment_answers`, and `module_scores`.

---

### `GET /api/v1/reports/:id/pdf`

Status: **Implemented (Milestone 10)**

Renders the same assessment as a premium, branded A4 PDF report — server-side, via
`@react-pdf/renderer` (`backend/src/modules/pdf/`), per the architecture in
`docs/PRD.md` Section 8. Includes: NAC branding/logo, assessment number, company
details, overall score and health rating, module-wise score table, top findings,
priority-ranked recommendations, and a footer with Nitin Anand Consulting's contact
details. Recommendation copy is generated from the module ratings already stored on
the assessment (`backend/src/modules/recommendations/`) — no score is recalculated.

`:id` must be the assessment UUID (not the human-readable assessment number). No
request body. `404 NOT_FOUND` if the assessment doesn't exist.

**Response:** binary `application/pdf`, `Content-Disposition: attachment; filename="nac-inventory-health-assessment-<company-slug>.pdf"`.

---

## Deliberately Not Included in MVP

- `PUT` / `DELETE` on assessments — submissions are immutable once created, by design
  (see PRD Section 7, API Structure).
