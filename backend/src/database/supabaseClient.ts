import { createClient, type SupabaseClient, type WebSocketLikeConstructor } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { env } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Single Supabase client instance for the whole backend, using the
 * service-role key (server-only — this must never reach the frontend
 * bundle). Only repository (*.repository.ts) modules should import
 * this file directly; services call repositories, never Supabase
 * itself. This keeps a clean dependency-inversion boundary: swapping
 * the data layer later only touches the repository layer.
 *
 * Real credentials are wired in the Database milestone. Until then,
 * this client is created in a "not configured" state so the rest of
 * the app (health check, routing, middleware) can be built and run
 * without a live Supabase project.
 */
let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.'
    );
  }

  client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    // This backend only ever uses the PostgREST API (plain table
    // inserts/selects via repositories) — Realtime (WebSocket)
    // subscriptions are never used. Even so, supabase-js unconditionally
    // constructs a RealtimeClient in its constructor, which eagerly
    // resolves a WebSocket implementation and throws if none is found.
    // Node 20 (our pinned runtime, see render.yaml) has no native global
    // WebSocket — that's the "Node.js detected but native WebSocket not
    // found" crash. Supplying the `ws` package here satisfies that eager
    // check; it's never actually used to open a connection since no
    // code in this backend calls .channel()/.connect() on Realtime.
    // `ws`'s constructor signature isn't structurally identical to the
    // DOM WebSocket type WebSocketLikeConstructor is modeled on (e.g. it
    // accepts a required `address` argument), hence the cast — this is
    // the standard, expected way to bridge `ws` into this option.
    realtime: {
      transport: WebSocket as unknown as WebSocketLikeConstructor,
    },
  });

  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

if (!isSupabaseConfigured()) {
  logger.warn(
    '⚠️  Supabase credentials not set — database-dependent routes will report 503 until configured.'
  );
}
