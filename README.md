# NAC Inventory Health Assessment

A lead-generation web application for **Nitin Anand Consulting (NAC)**. Business owners
complete a free 52-question inventory health assessment; the system scores their
responses, generates a branded PDF report, and delivers it by email — while alerting
NAC to a new, pre-qualified consulting lead.

This is **not** a SaaS product. See `docs/PRD.md` for the full product requirements and
`docs/ARCHITECTURE.md` for the technical architecture reference.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Zod, Framer Motion, Recharts |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase (Postgres + Storage) |
| Email | Resend |
| PDF | React PDF |
| Deployment | Vercel (frontend), Render (backend), Supabase (database) |

---

## Project Structure

```
nac-inventory-assessment/
├── frontend/          # React + Vite SPA
├── backend/           # Express API
├── docs/              # PRD, architecture reference, API contract
└── .github/           # PR template
```

See `docs/ARCHITECTURE.md` for the full folder-by-folder breakdown of both apps.

---

## Prerequisites

- Node.js 18+ and npm
- A Supabase project (for the Database milestone — not required to run the app as of
  this milestone; the API runs in a "not configured" state without it)
- A Resend account + verified sending domain (for the Email milestone)

---

## Local Development Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd nac-inventory-assessment

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
```
Fill in `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` once your Supabase project exists.
The server runs without them for now — database-dependent routes will simply report
`503 SERVICE_UNAVAILABLE` until configured.

**Frontend:**
```bash
cd frontend
cp .env.example .env
```
Defaults work out of the box for local development (the Vite dev server proxies
`/api/*` requests to `http://localhost:4000`).

### 3. Run both apps

In one terminal:
```bash
cd backend
npm run dev
# → API running at http://localhost:4000
```

In a second terminal:
```bash
cd frontend
npm run dev
# → App running at http://localhost:5173
```

### 4. Verify

Visit `http://localhost:5173` — you should see the placeholder landing page.

Check the API directly:
```bash
curl http://localhost:4000/api/v1/health
```

Or via the frontend's dev proxy:
```bash
curl http://localhost:5173/api/v1/health
```

Both should return:
```json
{
  "success": true,
  "data": { "status": "ok", "uptimeSeconds": 12, "timestamp": "...", "dependencies": { "supabase": "not_configured" } },
  "meta": { "timestamp": "..." }
}
```

---

## Available Scripts

**Backend** (`backend/`)
| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server (`dist/server.js`) |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |

**Frontend** (`frontend/`)
| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |

---

## Coding Standards

- **TypeScript strict mode** everywhere — no `any` without a documented reason.
- **Feature-based structure** on the frontend (`features/`), **layered modules** on the
  backend (`modules/{feature}/{feature}.controller|service|repository|types}.ts`).
- **Zod is the single source of truth** for validation, mirrored (not shared) between
  frontend and backend — kept in sync via `docs/API.md`.
- **Repository pattern**: only `*.repository.ts` files import the Supabase client
  directly; services never touch it directly.
- **One central error handler, one response envelope** — controllers throw `AppError`,
  never build their own error JSON.
- Named exports preferred over default exports, except for page/component files.
- Full conventions: see `docs/ARCHITECTURE.md`.

---

## Deployment

| App | Platform | Notes |
|---|---|---|
| `frontend/` | Vercel | Root dir: `frontend/`, build: `npm run build`, output: `dist` (see `frontend/vercel.json`) |
| `backend/` | Render | Root dir: `backend/`, build: `npm run build`, start: `npm start` (see `render.yaml`) |
| Database | Supabase | Migrations applied manually via Supabase CLI/dashboard (not auto-applied on deploy) |

Environment variables are set in each platform's dashboard — never committed to the repo. See
`docs/DEPLOYMENT.md` for the full production deployment guide and go-live checklist.

---

## Project Status

**Current milestone: Milestone 3 — Project Setup (complete)**

- ✅ Repository structure, both apps scaffolded
- ✅ Frontend: React + Vite + TS + Tailwind + Router, feature-based folders, base layout,
  placeholder pages, working build
- ✅ Backend: Express + TS, layered modules, Supabase connection layer (unconfigured
  state supported), standard error handling, request logging, health check
- ✅ Environment variable strategy (typed, validated) on both ends
- ✅ ESLint + Prettier on both ends
- ✅ End-to-end verified: both apps build, both run locally, dev proxy confirmed working

**Not yet built** (by design — scoped to later milestones):
- Landing page content, assessment form UI, scoring engine, recommendation engine,
  PDF generation, email sending, database migrations

See `docs/PRD.md` Section 27 for the full roadmap.
