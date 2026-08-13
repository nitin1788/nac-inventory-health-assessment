/**
 * Domain types for the payment module. This module exists to give a
 * real payment gateway a single, well-defined seam to plug into — see
 * payment.service.ts for the provider-selection logic. Until a real
 * gateway is configured and wired in there, the production-safe
 * placeholder is unconditionally active, with no bypass of any kind.
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
   * 'unavailable': the placeholder provider (currently the only
   *   provider) — no real gateway exists yet, nothing is created or
   *   charged.
   * 'created': a real gateway's checkout order exists — the frontend
   *   builds and submits `checkoutForm` itself (see PaymentPlaceholderView.tsx).
   */
  status: 'unavailable' | 'created';
  message: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: 'INR';
  /** Our own payment_orders.id — present when status === 'created'. Passed back on the /verify call. */
  orderId?: string;
  /**
   * The complete gateway handoff the browser must POST directly to —
   * present when status === 'created'. The frontend builds a real
   * <form method="post" action={action}> with one hidden input per entry
   * in `fields` (hash included) and calls submit() itself, so the
   * browser's own top-level navigation performs the actual handoff — no
   * intermediate backend redirect page is part of this contract.
   */
  checkoutForm?: {
    action: string;
    fields: Record<string, string>;
  };
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
 * The seam a real gateway implements. payment.service.ts's
 * `activeProvider` assignment is the only line that needs to change to
 * switch providers. Nothing outside this module (assessment submission,
 * scoring, PDF generation) depends on which provider is active.
 */
export interface PaymentProvider {
  name: string;
  createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult>;
  /** providerOrderId is whatever the provider itself uses to look an order up (its own reference, not ours). */
  verifyPayment(providerOrderId: string): Promise<PaymentVerificationResult>;
  /** Authenticates a gateway's callback/webhook payload (e.g. a signed success/failure POST). */
  handleCallback(payload: Record<string, string | undefined>): Promise<PaymentCallbackResult>;
}
