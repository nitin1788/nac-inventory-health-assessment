import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { env } from '@/config/env';
import { trackEvent } from '@/shared/utils/analyticsEvents';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let scriptInjected = false;
let clickTrackingBound = false;

function loadGtagScript(measurementId: string) {
  if (scriptInjected || typeof document === 'undefined') return;
  scriptInjected = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  // send_page_view: false — this is a client-rendered SPA, so route
  // changes don't trigger a real page load. The initial and every
  // subsequent view is sent manually as a page_view event below,
  // keyed off React Router's location, instead of relying on gtag's
  // own (load-event-based) automatic pageview.
  window.gtag('config', measurementId, { send_page_view: false });
}

/**
 * Classifies a clicked link into a GA4 event name using only its href —
 * never the link's destination content or any personal data. Returns
 * null for links that aren't a tracked conversion action.
 *
 * Every WhatsApp CTA site-wide currently renders identical visible text
 * ("Chat on WhatsApp"), so there is no reliable signal today to split
 * these into a separate "primary consultation CTA" event as originally
 * attempted here — that branch never fired in practice. If a future CTA
 * needs to be tracked distinctly, mark it explicitly (e.g. a
 * `data-cta="consultation"` attribute read here) rather than matching on
 * visible text, which is fragile and silently breaks when copy changes.
 */
function classifyLinkClick(anchor: HTMLAnchorElement): string | null {
  const href = anchor.href;

  if (href.startsWith('tel:')) return 'phone_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (href.includes('wa.me/') || href.includes('api.whatsapp.com/send')) return 'whatsapp_click';
  return null;
}

function bindClickTracking() {
  if (clickTrackingBound || typeof document === 'undefined') return;
  clickTrackingBound = true;

  document.addEventListener(
    'click',
    (event) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      const eventName = classifyLinkClick(anchor);
      if (eventName) trackEvent(eventName, { link_url: anchor.href });
    },
    { capture: true }
  );
}

/**
 * Loads Google Analytics 4 (gtag.js) only when a real Measurement ID is
 * configured via VITE_GA4_MEASUREMENT_ID (see .env.example). With no ID
 * set — the default — this component does nothing at all: no script
 * tag, no cookies, no network request. That keeps the current Privacy
 * Policy claim ("we do not currently use advertising or analytics
 * cookies") accurate until analytics is actually turned on. No ID is
 * ever fabricated here; update the Privacy Policy when a real one is
 * configured.
 *
 * Once loaded, also tracks page views on every SPA route change, plus
 * WhatsApp/phone/email link clicks site-wide via a single delegated
 * click listener — see classifyLinkClick() — so new CTAs anywhere on
 * the site are tracked automatically without needing per-component
 * wiring.
 */
export function Analytics() {
  const location = useLocation();
  const measurementId = env.ga4MeasurementId;
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!measurementId) return;
    loadGtagScript(measurementId);
    bindClickTracking();
    hasLoaded.current = true;
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId || !hasLoaded.current || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search, measurementId]);

  return null;
}
