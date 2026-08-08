/**
 * Domain types for the payment module. This module exists to give a
 * real payment gateway (PayU) a single, well-defined seam to plug into
 * — see payment.service.ts for the provider-selection logic. Until
 * PAYU_KEY/PAYU_SALT are configured, PAYMENT_TEST_MODE is the only
 * thing that can move this off the production-safe placeholder (see
 * payment.provider.testMode.ts).
 */

export type ReportTier = 'summary' | 'full';

/** Price in paise (smallest INR unit) — mirrored on the frontend in config/constants.ts. */
export const TIER_PRICING: Record<ReportTier, number> = {
  summary: 9900, // ₹99
  full: 29900, // ₹299
};

export interface PaymentOrderRequest {
  assessmentId: string;
  tier: ReportTier;
}

export interface PaymentOrderResult {
  /**
   * 'unavailable': the placeholder provider (production default) — no
   *   real gateway exists yet, nothing is created or charged.
   * 'created': an order now exists — either a real gateway's checkout
   *   order, or (PAYMENT_TEST_MODE only) a synthetic order the frontend
   *   is redirected straight through. Either way the frontend does the
   *   same thing: navigate to `redirectUrl`.
   */
  status: 'unavailable' | 'created';
  message: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: 'INR';
  /** Our own payment_orders.id — present when status === 'created'. Passed back on the /verify call. */
  orderId?: string;
  /**
   * Where the frontend should navigate next. A real gateway's hosted
   * checkout URL, or (test mode) our own Thank You page — the frontend
   * never needs to know which. Present when status === 'created'.
   */
  redirectUrl?: string;
}

/** What a provider reports back when asked whether an order actually got paid. */
export interface PaymentVerificationResult {
  status: 'paid' | 'pending' | 'failed';
  providerPaymentId?: string;
}

/** The full picture the Thank You page needs — returned by POST /payments/verify once an order is confirmed paid. */
export interface VerifiedOrderDetails {
  orderId: string;
  assessmentId: string;
  assessmentNumber: string;
  customerName: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: 'INR';
  paidAt: string;
  reportDelivered: boolean;
}

/** What a provider's callback/webhook handler reports back after authenticating an inbound payload. */
export interface PaymentCallbackResult {
  /** The provider's own order reference extracted from the payload — used to look up our payment_orders row. */
  providerOrderId: string;
  /**
   * Whether THIS SPECIFIC payload's signature/hash is authentic. This is
   * a tamper check on the request, not a payment-status decision — the
   * caller must still call verifyPayment() for the authoritative status
   * before ever marking an order paid. Never branch report/email
   * delivery on this flag alone.
   */
  signatureValid: boolean;
}

/**
 * The seam a real gateway implements — currently PayU (see
 * payment.provider.payu.ts). payment.service.ts's `activeProvider`
 * assignment is the only line that needs to change to switch
 * providers. Nothing outside this module (assessment submission,
 * scoring, PDF generation) depends on which provider is active.
 */
export interface PaymentProvider {
  name: string;
  createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult>;
  /** providerOrderId is whatever the provider itself uses to look an order up (its own reference, not ours). */
  verifyPayment(providerOrderId: string): Promise<PaymentVerificationResult>;
  /** Authenticates a gateway's callback/webhook payload (e.g. PayU's signed surl/furl POST). */
  handleCallback(payload: Record<string, string | undefined>): Promise<PaymentCallbackResult>;
}
