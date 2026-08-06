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
  /** WhatsApp community invite link shown on the Thank You page — configurable, never hardcoded. */
  VITE_WHATSAPP_COMMUNITY_URL: z.string().optional().or(z.literal('')),
  /** Overrides the default wa.me consultation-booking deep link (see shared/utils/whatsapp.ts) when set. */
  VITE_BOOK_CONSULTATION_URL: z.string().optional().or(z.literal('')),
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
  whatsappCommunityUrl: parsedEnv.VITE_WHATSAPP_COMMUNITY_URL || null,
  bookConsultationUrl: parsedEnv.VITE_BOOK_CONSULTATION_URL || null,
};
