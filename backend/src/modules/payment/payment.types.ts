/**
 * Domain types for the payment module. This module exists to give a
 * future real payment gateway (Razorpay or otherwise) a single,
 * well-defined seam to plug into — see payment.service.ts for the one
 * line that names the active provider. No real gateway, API keys, or
 * checkout flow exist yet (see payment.provider.placeholder.ts).
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
  /** Always 'unavailable' until a real PaymentProvider replaces the placeholder. */
  status: 'unavailable' | 'created';
  message: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: 'INR';
}

/**
 * The seam a real gateway implements. A future
 * `payment.provider.razorpay.ts` would create a real order/checkout
 * session instead of returning a "coming soon" stub —
 * payment.service.ts's `activeProvider` assignment is the only line
 * that needs to change to switch providers. Nothing outside this
 * module (assessment submission, scoring, PDF generation) depends on
 * which provider is active.
 */
export interface PaymentProvider {
  name: string;
  createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult>;
}
