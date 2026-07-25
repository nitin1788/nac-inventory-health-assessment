import { z } from 'zod';

/**
 * Single source of truth for frontend environment variables.
 *
 * Only variables prefixed VITE_ are available here (Vite convention) —
 * and only genuinely public values should ever go in this file, since
 * everything here is bundled into the client and visible to anyone.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default('/api/v1'),
  VITE_TURNSTILE_SITE_KEY: z.string().optional().or(z.literal('')),
});

function loadEnv() {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('❌ Invalid frontend environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid frontend environment configuration.');
  }

  return parsed.data;
}

const parsedEnv = loadEnv();

export const env = {
  apiBaseUrl: parsedEnv.VITE_API_BASE_URL,
  turnstileSiteKey: parsedEnv.VITE_TURNSTILE_SITE_KEY || null,
};
