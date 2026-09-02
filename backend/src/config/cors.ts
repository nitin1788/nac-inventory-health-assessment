import type { CorsOptions } from 'cors';
import { env } from './env';

/**
 * CORS is locked to an explicit allow-list. We do not reflect arbitrary
 * origins — this API has no public read surface that benefits from an
 * open CORS policy, and the assessment submission endpoint should only
 * ever be called from our own frontend(s).
 *
 * The production domain and localhost are baked in directly (below) —
 * they're permanent, non-secret values, not something that should live
 * only in a Render dashboard env var one commit away from silently going
 * stale. This is exactly what broke assessment submission previously:
 * Render's CORS_ORIGIN never included https://nitinanandconsulting.in,
 * so every cross-origin submission failed the browser's CORS preflight
 * with "No 'Access-Control-Allow-Origin' header is present."
 *
 * CORS_ORIGIN (comma-separated) is still supported on top of this
 * baseline, for extra origins (e.g. a Vercel preview URL) without
 * needing a code change/redeploy.
 */
const PRODUCTION_ORIGINS = [
  'https://nitinanandconsulting.in',
  'https://www.nitinanandconsulting.in',
  // Standalone Business Health Check tool — separate static Vercel project,
  // calls this backend directly for the PDF-attachment email send.
  'https://healthcheck.nitinanandconsulting.in',
];
const DEVELOPMENT_ORIGINS = ['http://localhost:5173'];

const configuredOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...PRODUCTION_ORIGINS, ...DEVELOPMENT_ORIGINS, ...configuredOrigins])
);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Requests with no Origin header (server-to-server calls, curl,
    // uptime/health checks) aren't subject to CORS — let them through;
    // the browser is what enforces this header for cross-site fetches.
    // A disallowed origin is passed through as `allow: false` (not an
    // error) — the cors package then simply omits the
    // Access-Control-Allow-Origin header, which is all a browser needs
    // to block the response. Erroring here would turn routine
    // disallowed-origin probes into noisy 500s in the logs.
    const isAllowed = !origin || allowedOrigins.includes(origin);
    callback(null, isAllowed);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
};
