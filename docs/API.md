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

Status: **Planned — Milestone 4**

Submits a complete assessment (company info + all 52 answers) in a single atomic
request. No partial/draft submission endpoint in MVP (see PRD Section 17).

---

## Deliberately Not Included in MVP

- `PUT` / `DELETE` on assessments — submissions are immutable once created, by design
  (see PRD Section 7, API Structure).
- `GET /api/v1/assessments/:id` — reserved for a future authenticated admin view, not
  exposed publicly in MVP.
