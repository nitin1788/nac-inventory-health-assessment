/**
 * Fires a GA4 event, a no-op if analytics isn't loaded (no ID configured
 * yet — see app/Analytics.tsx). Exported for direct use later (e.g. a
 * consultation form's submit handler, once that form exists — see
 * NAC_SEO_READINESS_AUDIT.md). Never pass PII (name/email/phone/message
 * content) in `params` — GA4 event parameters are not the place for
 * personal data.
 */
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>): void {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}
