# Deployment Guide — Milestone 22

Target architecture:

| Layer | Platform | Config file |
|---|---|---|
| Frontend | Vercel | `frontend/vercel.json` |
| Backend | Render | `render.yaml` (repo root, Blueprint) |
| Database | Supabase | Migrations applied manually via CLI/dashboard (see `backend/src/database/migrations/`) |
| Email | Resend | No deployment config — API key only |

---

## 1. Pre-deployment verification (done this milestone)

| Check | Result |
|---|---|
| Backend `npm run typecheck` | ✅ Pass |
| Backend `npm run lint` | ✅ Pass |
| Backend `npm run build` (→ `dist/`) | ✅ Pass |
| Frontend `npm run typecheck` | ✅ Pass |
| Frontend `npm run lint` | ✅ Pass |
| Frontend `npm run build` (→ `dist/`) | ✅ Pass |
| Supabase connectivity | ✅ Verified live — health check reports `"supabase": "configured"`, and a `GET /api/v1/assessments/<random-uuid>` against the real project returns a clean `404 NOT_FOUND` (proves the service-role key authenticates; a bad key/URL would 500, not 404) |
| PDF generation | ✅ Verified locally — `generateAssessmentReportPdf()` called directly with mock assessment data produced a valid ~420KB PDF buffer. No DB row created, no email sent |
| CORS allow-list | ✅ Verified locally — allowed origin gets `Access-Control-Allow-Origin`; a disallowed origin gets a clean 200 with no CORS header (not an error) |
| Live end-to-end submission (real Supabase row + real Resend emails) | ⏭️ **Not run this milestone** — would create real data and send real email, so it was deliberately skipped pending your go-ahead. Run once after deploying (see §7) |
| Full click-through in an actual browser | ⏭️ **Not run** — browser automation wasn't available this session |

---

## 2. Environment variables

### Backend (set in the Render dashboard — never commit these)

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | Yes | `production` (set directly in `render.yaml`) |
| `SUPABASE_URL` | Yes | From Supabase project settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Service role**, not the anon key — server-only, never expose to the frontend |
| `RESEND_API_KEY` | Yes | From Resend dashboard |
| `RESEND_FROM_EMAIL` | Yes | Must be on a domain verified in Resend |
| `NAC_LEAD_ALERT_EMAIL` | Yes | Internal address that receives new-lead notifications |
| `CORS_ORIGIN` | Yes | The deployed frontend origin(s). One value, or comma-separated for more than one, e.g.:<br>`https://nitinanandconsulting.in,https://nac-inventory-assessment.vercel.app` |
| `TURNSTILE_SECRET_KEY` | No | Not wired yet — leave blank |
| `PORT` | No | Do **not** set manually — Render injects this automatically and the app already reads `process.env.PORT` |

Local values already exist in `backend/.env` (verified present, not printed above) — the Render dashboard values must be entered independently; `.env` is never deployed (it's git-ignored).

### Frontend (set in the Vercel dashboard)

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | **Full Render backend URL**, e.g. `https://nac-inventory-assessment-api.onrender.com/api/v1`. The `/api/v1` relative default only works in local dev, where Vite's proxy forwards it — there is no such proxy in a static Vercel deployment. |
| `VITE_TURNSTILE_SITE_KEY` | No | Not wired yet — leave blank |

---

## 3. Render setup (backend)

1. In Render: **New → Blueprint**, point it at this repo. Render will read `render.yaml` from the repo root and provision the `nac-inventory-assessment-api` web service (root dir `backend/`, build `npm install && npm run build`, start `npm start`, health check `/api/v1/health`).
2. Fill in the env vars marked `sync: false` in `render.yaml` (table above) in the service's **Environment** tab.
3. Confirm the region (`singapore` was chosen as closest to India/`nitinanandconsulting.in` traffic among Render's regions — change in `render.yaml` if you'd prefer a different one).
4. Node runtime is pinned to **Node 20 LTS** three ways (Render otherwise defaults to its newest available runtime, which broke the first deploy attempt at Node 26): the `NODE_VERSION=20` env var in `render.yaml` (highest precedence), `backend/.node-version`, and `"engines": { "node": "20.x" }` in `backend/package.json`. Nothing to configure manually here — just confirm the Render build log shows Node 20.x during the next deploy.
5. Deploy, then confirm: `curl https://<your-service>.onrender.com/api/v1/health` returns `"supabase": "configured"`.
6. Note the resulting `https://<your-service>.onrender.com` URL — it's needed for the frontend's `VITE_API_BASE_URL`.

## 4. Vercel setup (frontend)

1. In Vercel: **New Project**, import this repo, set **Root Directory** to `frontend`.
2. Vercel should auto-detect Vite (build command `npm run build`, output `dist`) — `frontend/vercel.json` pins these explicitly plus SPA rewrites (so client-side routes like `/about` don't 404 on refresh) and baseline security headers.
3. Add `VITE_API_BASE_URL` (see §2) in **Project Settings → Environment Variables**, pointing at the Render URL from step 6 above.
4. Deploy, then set `CORS_ORIGIN` on the Render side (§3.2) to match the resulting Vercel URL (and your custom domain, once attached).

## 5. Supabase

- No new migrations were added this milestone. Confirm the 7 existing migrations in `backend/src/database/migrations/` are already applied to your production Supabase project (they're applied manually — there is no auto-migrate-on-deploy step, by design; see `README.md`).
- Confirm the production project's URL/service-role key are the ones entered into Render, not a dev/staging project.

## 6. CORS

`backend/src/config/cors.ts` now allow-lists origins from `CORS_ORIGIN` (comma-separated) instead of trusting the whole browser. Set it to the exact production origin(s) — scheme + host, no trailing slash or path. Requests with no `Origin` header (server-to-server, health-check pings) are always allowed; anything else not on the list is silently denied (no `Access-Control-Allow-Origin` header — the browser blocks it, no server error).

## 7. Post-deploy smoke test (recommended, not run by me this milestone)

Once both services are live with real env vars:
1. Load the Vercel URL, click **Start Free Assessment**, complete it once with a real or your-own test email.
2. Confirm: the Results page shows a score, the PDF downloads client-side, and — within a minute or two — both the customer report email and the internal lead-alert email (to `NAC_LEAD_ALERT_EMAIL`) arrive.
3. This is the one thing this milestone deliberately did **not** run automatically, since it creates a real Supabase row and sends real email — see §1.

---

## 8. Go-live checklist

- [ ] Render service deployed, health check green, `supabase: configured`
- [ ] All backend env vars set in Render (§2)
- [ ] Vercel project deployed, `VITE_API_BASE_URL` pointed at the Render URL
- [ ] `CORS_ORIGIN` on Render updated to match the final Vercel/custom domain
- [ ] Custom domain (if any) attached in Vercel and reflected in `CORS_ORIGIN`
- [ ] Supabase migrations confirmed applied on the production project
- [ ] One real end-to-end assessment submitted and confirmed (§7)
- [ ] `robots.txt` / canonical URL in `frontend/index.html` point at the real production domain
