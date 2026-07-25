import type { CorsOptions } from 'cors';
import { env } from './env';

/**
 * CORS is locked to a single configured origin (the Netlify frontend in
 * production, localhost in development). We do not reflect arbitrary
 * origins — this API has no public read surface that benefits from an
 * open CORS policy, and the assessment submission endpoint should only
 * ever be called from our own frontend.
 */
export const corsOptions: CorsOptions = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
};
