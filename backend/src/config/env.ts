import 'dotenv/config';
import { z } from 'zod';

/**
 * Single source of truth for backend environment variables.
 *
 * Every variable the app depends on is declared and validated here.
 * If a required variable is missing or malformed, the process fails
 * fast at startup instead of failing silently later (e.g. when a
 * customer submits an assessment and email sending breaks).
 */
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional at this stage of the project: Milestone 3 stands up the server
  // and connection layer; real Supabase credentials are wired in the
  // Database milestone. When absent, DB-dependent routes report a clear
  // "not configured" error instead of the process crashing on boot.
  SUPABASE_URL: z
    .string()
    .url({ message: 'SUPABASE_URL must be a valid URL' })
    .optional()
    .or(z.literal('')),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal('')),

  RESEND_API_KEY: z.string().optional().or(z.literal('')),
  RESEND_FROM_EMAIL: z.string().optional().or(z.literal('')),
  NAC_LEAD_ALERT_EMAIL: z.string().email().optional().or(z.literal('')),

  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  TURNSTILE_SECRET_KEY: z.string().optional().or(z.literal('')),

  // This backend's own public base URL (no trailing slash) and the
  // frontend's public base URL — generic infra config for building
  // absolute redirect/callback URLs, reusable by whichever gateway is
  // wired in next; not specific to any one provider.
  BACKEND_BASE_URL: z.string().optional().or(z.literal('')),
  FRONTEND_BASE_URL: z.string().optional().or(z.literal('')),

  // PayU (see backend/src/modules/payment/payment.provider.payu.ts). Optional
  // at the schema level — same pattern as Supabase/Resend above — so boot
  // never crashes if PayU isn't configured yet; payment.service.ts falls
  // back to the placeholder provider until both PAYU_KEY and PAYU_SALT are
  // set. Never commit real values here; set them only in .env (gitignored).
  PAYU_KEY: z.string().optional().or(z.literal('')),
  PAYU_SALT: z.string().optional().or(z.literal('')),
  // 'test' is the safe default -- production PayU only activates when this
  // is explicitly set to 'production' in the environment.
  PAYU_ENV: z.enum(['test', 'production']).optional().default('test'),

  // Set automatically by Render on every deploy (the commit SHA that was
  // built) — never set manually, and absent entirely in local dev. Exposed
  // via /api/v1/health so a deploy can be confirmed live from the outside
  // without dashboard access.
  RENDER_GIT_COMMIT: z.string().optional().or(z.literal('')),
});

type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment variables:');
    // eslint-disable-next-line no-console
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
