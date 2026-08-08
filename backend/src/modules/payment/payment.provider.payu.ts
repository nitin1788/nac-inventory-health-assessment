import { API_PREFIX } from '../../config/constants';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { logger } from '../../utils/logger';
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
 * PaymentProvider seam test-mode already uses. Endpoints and hash
 * formulas below are taken verbatim from PayU's current official docs
 * (fetched at implementation time — see payuHash.ts's header comment
 * for the exact source links); nothing here is guessed.
 */
const PAYU_CHECKOUT_BASE_URL: Record<'test' | 'production', string> = {
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
 * /api/v1 suffix. Historically this was built as plain string
 * concatenation (`${backendBaseUrl}${path}`), which silently produced a
 * URL missing /api/v1 — and therefore a 404 on every route under it —
 * whenever BACKEND_BASE_URL was set to the bare domain. Every other
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
 * Renders the tiny auto-submitting HTML page GET /payments/payu/redirect/:orderId
 * serves — this is what actually sends the browser to PayU's hosted
 * checkout with a freshly-computed, correctly-hashed field set. Exported
 * (not the PaymentProvider interface itself) because rendering an HTML
 * redirect page is PayU-specific plumbing, not part of the
 * cross-provider order lifecycle contract.
 */
export function buildPayURedirectFormHtml(order: PaymentOrderRow, assessment: AssessmentDetail): string {
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
  });
  const hash = buildPayURequestHash(fields, salt);
  const actionUrl = `${PAYU_CHECKOUT_BASE_URL[env.PAYU_ENV]}/_payment`;

  const hiddenFields: Record<string, string> = {
    ...fields,
    hash,
    surl: buildBackendApiUrl(backendBaseUrl, '/payments/payu/success'),
    furl: buildBackendApiUrl(backendBaseUrl, '/payments/payu/failure'),
  };

  const inputsHtml = Object.entries(hiddenFields)
    .map(([name, value]) => `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`)
    .join('\n      ');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to PayU…</title>
  </head>
  <body onload="document.forms[0].submit()">
    <p>Redirecting you to PayU to complete your payment…</p>
    <form method="post" action="${escapeHtml(actionUrl)}">
      ${inputsHtml}
      <noscript><button type="submit">Continue to PayU</button></noscript>
    </form>
  </body>
</html>`;
}

export const payuPaymentProvider: PaymentProvider = {
  name: 'payu',

  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    ensurePayUConfigured();
    const { backendBaseUrl } = ensureBaseUrlsConfigured();

    const amountInPaise = TIER_PRICING[request.tier];
    const txnid = generatePayUTxnId();

    const dbStartedAt = Date.now();
    const order = await createPaymentOrder({
      assessmentId: request.assessmentId,
      tier: request.tier,
      amountInPaise,
      currency: 'INR',
      provider: 'payu',
      providerOrderId: txnid,
    });
    const dbInsertMs = Date.now() - dbStartedAt;

    logger.info(
      {
        assessmentId: request.assessmentId,
        tier: request.tier,
        orderId: order.id,
        payuEnv: env.PAYU_ENV,
        dbInsertMs,
      },
      'PayU order created.'
    );

    return {
      status: 'created',
      message: 'Redirecting to PayU to complete your payment.',
      tier: request.tier,
      amountInPaise,
      currency: 'INR',
      orderId: order.id,
      redirectUrl: buildBackendApiUrl(backendBaseUrl, `/payments/payu/redirect/${order.id}`),
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
