import { randomBytes } from 'crypto';
import helmet from 'helmet';
import { API_PREFIX } from '../../config/constants';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { logger } from '../../utils/logger';
import { getAssessmentById } from '../assessment/assessment.service';
import type { AssessmentDetail } from '../assessment/assessment.types';
import { createPaymentOrder, type PaymentOrderRow } from './payment.repository';
import { TIER_PRICING } from './payment.types';
import type {
  PaymentCallbackResult,
  PaymentOrderRequest,
  PaymentOrderResult,
  PaymentProvider,
  PaymentVerificationResult,
} from './payment.types';
import {
  buildPayUOrderFields,
  buildPayURequestHash,
  buildPayUVerifyApiHash,
  generatePayUTxnId,
  verifyPayUResponseHash,
} from './payuHash';

/**
 * Real PayU India integration (https://docs.payu.in), behind the same
 * PaymentProvider seam the placeholder already uses. Endpoints and hash
 * formulas below are taken verbatim from PayU's current official docs
 * (see payuHash.ts's header comment for the exact source links); nothing
 * here is guessed. TEST MODE ONLY at this phase — PAYU_ENV defaults to
 * 'test' (see env.ts) and only test.payu.in is exercised.
 */
export const PAYU_CHECKOUT_BASE_URL: Record<'test' | 'production', string> = {
  test: 'https://test.payu.in',
  production: 'https://secure.payu.in',
};

/** The Verify Payment API's production host differs from the checkout host (info.payu.in, not secure.payu.in). */
const PAYU_VERIFY_BASE_URL: Record<'test' | 'production', string> = {
  test: 'https://test.payu.in',
  production: 'https://info.payu.in',
};

/** True once both PAYU_KEY and PAYU_SALT are set — payment.service.ts uses this to decide whether PayU can be the active provider at all. */
export function isPayUConfigured(): boolean {
  return Boolean(env.PAYU_KEY && env.PAYU_SALT);
}

function ensurePayUConfigured(): { key: string; salt: string } {
  if (!env.PAYU_KEY || !env.PAYU_SALT) {
    throw AppError.serviceUnavailable('PayU is not configured (PAYU_KEY/PAYU_SALT missing).');
  }
  return { key: env.PAYU_KEY, salt: env.PAYU_SALT };
}

function ensureBaseUrlsConfigured(): { backendBaseUrl: string; frontendBaseUrl: string } {
  if (!env.BACKEND_BASE_URL || !env.FRONTEND_BASE_URL) {
    throw AppError.serviceUnavailable('BACKEND_BASE_URL/FRONTEND_BASE_URL are not configured.');
  }
  return { backendBaseUrl: env.BACKEND_BASE_URL, frontendBaseUrl: env.FRONTEND_BASE_URL };
}

/**
 * Builds an absolute URL to one of THIS backend's own /api/v1 routes
 * (the PayU redirect page, surl, furl) from BACKEND_BASE_URL — normalized
 * so it works whether that env var was configured with or without the
 * /api/v1 suffix. Plain string concatenation would silently produce a
 * URL missing /api/v1 — and therefore a 404 on every route under it —
 * whenever BACKEND_BASE_URL is set to the bare domain. Every other
 * backend route already lives under API_PREFIX (see app.ts), so this
 * makes that the one place responsible for getting it right, rather
 * than trusting a human-configured env var's exact string shape.
 */
export function buildBackendApiUrl(backendBaseUrl: string, path: string): string {
  const base = backendBaseUrl.replace(/\/+$/, '');
  const withPrefix = base.endsWith(API_PREFIX) ? base : `${base}${API_PREFIX}`;
  return `${withPrefix}${path}`;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapes customer-supplied text (firstname/email come from the assessment's own company data) before embedding it in the auto-submit HTML form. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

const TIER_LABELS: Record<PaymentOrderRow['tier'], string> = {
  summary: 'Report Summary',
  full: 'Professional Inventory Report',
};

/**
 * A fresh, unpredictable per-response CSP nonce — generated server-side,
 * never hardcoded, never reused across responses. Used to authorize
 * exactly one inline <script> (the auto-submit call) on exactly one
 * response, the standard CSP-compliant alternative to a blanket
 * 'unsafe-inline' allowance.
 */
export function generateCspNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * The Content-Security-Policy directives for GET /payments/payu/redirect/:orderId's
 * response ONLY — built from Helmet's own default directive set (see
 * app.ts's app.use(helmet()), which stays completely untouched) plus
 * exactly two narrow additions this one page needs and nothing else
 * gets: permission for its <form> to submit to PayU's hosted checkout
 * (form-action), and permission to run its own auto-submit script via
 * this response's nonce (script-src). Every other directive — including
 * script-src-attr staying 'none', so inline event-handler attributes
 * remain blocked everywhere, including here — is passed through
 * unchanged. The caller (payuRedirectPageController) applies this via a
 * one-off helmet.contentSecurityPolicy() call scoped to that single
 * response, never by touching the global helmet() middleware.
 */
export function buildPayURedirectCspDirectives(nonce: string): Record<string, Iterable<string>> {
  const defaults = helmet.contentSecurityPolicy.getDefaultDirectives();
  return {
    ...defaults,
    // Both hosts allowed unconditionally (not just whichever PAYU_ENV is
    // currently active) — the actual form `action` this page ever
    // generates still only ever points at PAYU_CHECKOUT_BASE_URL[env.PAYU_ENV]
    // (see buildPayURedirectFormHtml), so this is an allowlist, not a
    // behavior change; it just means this directive doesn't need to be
    // revisited if PAYU_ENV is ever flipped.
    'form-action': ["'self'", PAYU_CHECKOUT_BASE_URL.production, PAYU_CHECKOUT_BASE_URL.test],
    'script-src': ["'self'", `'nonce-${nonce}'`],
  };
}

/**
 * The complete, canonical set of everything PayU's Hosted Checkout
 * _payment form needs: the exact same field object the hash is computed
 * from is the exact same object returned for submission — there is no
 * second, independently-built copy of these values anywhere, so the hash
 * and the submitted fields can never drift apart from each other.
 */
export interface PayUCheckoutHandoff {
  actionUrl: string;
  fields: Record<string, string>;
}

/**
 * Builds the exact form action + field set for PayU's Hosted Checkout
 * handoff for one order. Used by createOrder() (the browser builds and
 * submits the real <form> itself client-side — see PaymentPlaceholderView.tsx)
 * and by the legacy server-rendered redirect page below.
 */
function buildPayUCheckoutHandoff(order: PaymentOrderRow, assessment: AssessmentDetail): PayUCheckoutHandoff {
  const { key, salt } = ensurePayUConfigured();
  const { backendBaseUrl } = ensureBaseUrlsConfigured();

  if (!order.providerOrderId) {
    throw AppError.internal('PayU order is missing its txnid.');
  }

  const fields = buildPayUOrderFields({
    key,
    txnid: order.providerOrderId,
    amountInPaise: order.amountInPaise,
    productinfo: `NAC Inventory Health Assessment - ${TIER_LABELS[order.tier]}`,
    firstname: assessment.company.contactPerson,
    email: assessment.company.email,
    phone: assessment.company.mobile,
  });
  const hash = buildPayURequestHash(fields, salt);

  return {
    actionUrl: `${PAYU_CHECKOUT_BASE_URL[env.PAYU_ENV]}/_payment`,
    fields: {
      ...fields,
      hash,
      surl: buildBackendApiUrl(backendBaseUrl, '/payments/payu/success'),
      furl: buildBackendApiUrl(backendBaseUrl, '/payments/payu/failure'),
    },
  };
}

/**
 * Renders the legacy server-side auto-submitting HTML page for
 * GET /payments/payu/redirect/:orderId. No longer used by the primary
 * checkout flow (see createOrder() below, which now returns the same
 * handoff fields directly to the frontend so the browser's own top-level
 * form POST goes straight to PayU with no intermediate backend page in
 * between) — kept as a working fallback/diagnostic route, not deleted.
 */
export function buildPayURedirectFormHtml(order: PaymentOrderRow, assessment: AssessmentDetail, nonce: string): string {
  const { actionUrl, fields: hiddenFields } = buildPayUCheckoutHandoff(order, assessment);

  const inputsHtml = Object.entries(hiddenFields)
    .map(([name, value]) => `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`)
    .join('\n      ');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to PayU…</title>
    <style>#payu-manual-continue { display: none; }</style>
  </head>
  <body>
    <p id="payu-status-message">Redirecting you to PayU to complete your payment…</p>
    <form method="post" action="${escapeHtml(actionUrl)}">
      ${inputsHtml}
      <button type="submit" id="payu-manual-continue">Continue to PayU</button>
    </form>
    <noscript><style>#payu-manual-continue { display: inline-block; }</style></noscript>
    <script nonce="${escapeHtml(nonce)}">
      document.forms[0].submit();
      // If we're still on this page a few seconds after the auto-submit
      // above, the browser never actually left it — e.g. PayU's server
      // returned a response Chrome didn't commit as a new document. Rather
      // than leaving the customer staring at "Redirecting…" forever with
      // no way out, surface a manual retry. This never fires on a normal,
      // successful handoff: submitting the form navigates this document
      // away, which cancels the pending timer along with everything else
      // in this page's JS context.
      setTimeout(function () {
        document.getElementById('payu-status-message').textContent =
          "This is taking longer than expected. Please tap the button below to continue to PayU.";
        document.getElementById('payu-manual-continue').style.display = 'inline-block';
      }, 6000);
    </script>
  </body>
</html>`;
}

export const payuPaymentProvider: PaymentProvider = {
  name: 'payu',

  /**
   * Amount is always derived from TIER_PRICING[tier] here — never accepted
   * from the client. Returns the complete PayU Hosted Checkout handoff
   * (action URL + every field, hash included) directly in the response —
   * the frontend builds a real <form method="post"> from these and calls
   * submit() itself (see PaymentPlaceholderView.tsx), so the browser's own
   * top-level navigation POSTs straight to PayU. No intermediate backend
   * page/redirect is part of this handoff.
   */
  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    ensurePayUConfigured();

    const amountInPaise = TIER_PRICING[request.tier];
    const txnid = generatePayUTxnId();

    const order = await createPaymentOrder({
      assessmentId: request.assessmentId,
      tier: request.tier,
      amountInPaise,
      currency: 'INR',
      provider: 'payu',
      providerOrderId: txnid,
    });

    const assessment = await getAssessmentById(request.assessmentId);
    const { actionUrl, fields } = buildPayUCheckoutHandoff(order, assessment);

    logger.info(
      { assessmentId: request.assessmentId, tier: request.tier, orderId: order.id, payuEnv: env.PAYU_ENV },
      'PayU order created.'
    );

    return {
      status: 'created',
      message: 'Redirecting to PayU to complete your payment.',
      tier: request.tier,
      amountInPaise,
      currency: 'INR',
      orderId: order.id,
      checkoutForm: { action: actionUrl, fields },
    };
  },

  /**
   * Always asks PayU's own Verify Payment API for the authoritative
   * status — never trusts the callback payload's own `status` field by
   * itself (that's only hash-authenticated by handleCallback, which is
   * a tamper check, not a status decision).
   */
  async verifyPayment(providerOrderId: string): Promise<PaymentVerificationResult> {
    const { key, salt } = ensurePayUConfigured();
    const hash = buildPayUVerifyApiHash(key, providerOrderId, salt);
    const base = PAYU_VERIFY_BASE_URL[env.PAYU_ENV];

    let response: Response;
    try {
      response = await fetch(`${base}/merchant/postservice.php?form=2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ key, command: 'verify_payment', var1: providerOrderId, hash }).toString(),
      });
    } catch (err) {
      logger.error({ err, providerOrderId }, 'PayU verify_payment API request failed.');
      return { status: 'pending' };
    }

    if (!response.ok) {
      logger.error({ providerOrderId, httpStatus: response.status }, 'PayU verify_payment API returned a non-OK status.');
      return { status: 'pending' };
    }

    const body = (await response.json()) as {
      status: number;
      transaction_details?: Record<string, { status?: string; mihpayid?: string; amt?: string }>;
    };

    const detail = body.transaction_details?.[providerOrderId];
    if (!detail?.status) {
      return { status: 'pending' };
    }

    if (detail.status === 'success') {
      return { status: 'paid', providerPaymentId: detail.mihpayid };
    }
    if (detail.status === 'failure' || detail.status === 'failed') {
      return { status: 'failed' };
    }
    return { status: 'pending' };
  },

  /**
   * Hash-authenticates PayU's surl/furl POST. This confirms the payload
   * wasn't altered in transit — it is NOT a payment-status decision.
   * Callers must always follow up with verifyPayment() before treating
   * anything as paid.
   */
  async handleCallback(payload: Record<string, string | undefined>): Promise<PaymentCallbackResult> {
    const { key, salt } = ensurePayUConfigured();
    const txnid = payload.txnid;

    if (!txnid) {
      logger.warn('PayU callback payload is missing txnid.');
      return { providerOrderId: '', signatureValid: false };
    }

    const signatureValid = verifyPayUResponseHash(payload, key, salt);
    if (!signatureValid) {
      logger.error({ txnid }, 'PayU callback hash did not match — possible tampering, rejecting.');
    }

    return { providerOrderId: txnid, signatureValid };
  },
};
