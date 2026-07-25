# Architecture Reference

This document summarizes the architectural decisions approved in Milestone 1
and implemented in Milestone 3 (Project Setup). It's the quick-reference
companion to the full PRD — see `docs/PRD.md`.

## System Overview

```
[React SPA - Netlify] --HTTPS--> [Express API - Railway] --> [Supabase (Postgres + Storage)]
                                        |
                                        ├--> [Resend] (email)
                                        └--> [React PDF] (in-process rendering)
```

Modular monolith, not microservices — justified by traffic scale (marketing-driven
lead gen, not high-volume SaaS). Clear module boundaries in code allow future
extraction if a specific module becomes a bottleneck.

## Repositories

Two independently deployable apps in one repo (not a monorepo-tooled setup):
- `frontend/` → Netlify
- `backend/` → Railway

No shared npm package for types; `docs/API.md` is the contract both sides
implement against. See PRD Section 4 for the reasoning behind this tradeoff.

## Backend Layering

```
routes → controllers → services → repositories → Supabase
```

- Controllers: parse request, call service, return response. No business logic.
- Services: business logic. No direct Supabase access.
- Repositories: the ONLY layer that talks to Supabase directly.
- Scoring/recommendation engines (Milestone 4+) are pure functions — no I/O,
  fully unit-testable in isolation.

## Frontend Layering

```
pages/ (thin, routing only) → features/ (business logic + UI) → shared/ (generic, reusable)
```

Question bank, scoring weights, and recommendation config are treated as
versioned data, not hardcoded logic — see PRD Sections 15 & 21.

## Validation

Zod is the single source of truth on both ends. Frontend schemas pair with
React Hook Form; backend schemas re-validate every payload server-side via
`validateRequest.middleware.ts`. Never trust client validation alone.

## Error Handling

Every error flows through one central error handler
(`backend/src/middleware/errorHandler.middleware.ts`) and one standard
response envelope (`backend/src/utils/apiResponse.ts`). Controllers throw
`AppError`; they never build their own error responses.

## Environment & Secrets

- All env access goes through `config/env.ts` (typed, Zod-validated) in each app.
- `VITE_`-prefixed frontend vars are public by definition — never put secrets there.
- Backend secrets (Supabase service key, Resend key) live only in Railway's
  environment, never committed, never sent to the frontend.

## What's Deliberately Not Built Yet

- Scoring engine, recommendation engine, PDF generation, email sending —
  module folders are scaffolded (`backend/src/modules/*`) but implementation
  is deferred to their respective milestones per the roadmap in the PRD.
- Authentication — no login exists in MVP. See PRD Section 12 for the
  future-ready design choices already in place (reserved middleware slot,
  Supabase Auth as the natural future fit).
- Database migrations — schema is designed (PRD Section 16 / Milestone 1
  deliverable) but SQL migration files are deferred to the Database milestone
  per explicit instruction.
