import type { CorsOptions } from 'cors';
import { env } from './env';

/**
 * CORS is locked to an explicit allow-list (the Vercel-hosted frontend
 * in production — custom domain and/or *.vercel.app project URL —
 * localhost in development). We do not reflect arbitrary origins — this
 * API has no public read surface that benefits from an open CORS
 * policy, and the assessment submission endpoint should only ever be
 * called from our own frontend(s).
 *
 * CORS_ORIGIN accepts one origin or a comma-separated list, so a single
 * deployment can allow both an apex domain and its Vercel project URL.
 */
const allowedOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

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
