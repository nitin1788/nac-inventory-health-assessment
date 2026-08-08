/**
 * Cross-cutting backend types that don't belong to a single module.
 * Domain-specific types (Assessment, Company, etc.) live in their
 * respective module's *.types.ts file instead.
 */

export interface HealthCheckResult {
  status: 'ok' | 'degraded';
  uptimeSeconds: number;
  timestamp: string;
  dependencies: {
    supabase: 'configured' | 'not_configured';
  };
  /** The deployed commit SHA (Render's RENDER_GIT_COMMIT), null when unavailable (e.g. local dev). */
  gitCommit: string | null;
}
