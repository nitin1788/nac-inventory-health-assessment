import { getSupabaseClient } from '../../database/supabaseClient';
import { AppError } from '../../utils/AppError';
import type { ReportTier } from './payment.types';

/**
 * The only file in the payment module allowed to talk to Supabase
 * directly (mirrors assessment.repository.ts's rule — see
 * docs/ARCHITECTURE.md). payment.service.ts calls these functions; it
 * never imports supabaseClient.
 */

export type PaymentOrderStatus = 'created' | 'paid' | 'failed';

export interface PaymentOrderRow {
  id: string;
  assessmentId: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: string;
  provider: string;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  status: PaymentOrderStatus;
  reportDeliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaymentOrderDbRow {
  id: string;
  assessment_id: string;
  tier: ReportTier;
  amount_in_paise: number;
  currency: string;
  provider: string;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  status: PaymentOrderStatus;
  report_delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: PaymentOrderDbRow): PaymentOrderRow {
  return {
    id: row.id,
    assessmentId: row.assessment_id,
    tier: row.tier,
    amountInPaise: row.amount_in_paise,
    currency: row.currency,
    provider: row.provider,
    providerOrderId: row.provider_order_id,
    providerPaymentId: row.provider_payment_id,
    status: row.status,
    reportDeliveredAt: row.report_delivered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface CreatePaymentOrderInput {
  assessmentId: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: string;
  /** Which PaymentProvider created this row — 'test-mode' or a real gateway's own name once one is wired in. */
  provider: string;
  /** The provider's own order reference, if it has one yet. */
  providerOrderId?: string | null;
}

export async function createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderRow> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('payment_orders')
    .insert({
      assessment_id: input.assessmentId,
      tier: input.tier,
      amount_in_paise: input.amountInPaise,
      currency: input.currency,
      provider: input.provider,
      provider_order_id: input.providerOrderId ?? null,
    })
    .select('*')
    .single<PaymentOrderDbRow>();

  if (error) {
    throw AppError.internal(`Failed to create payment order: ${error.message}`);
  }

  return mapRow(data);
}

export async function findPaymentOrderById(id: string): Promise<PaymentOrderRow | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('payment_orders')
    .select('*')
    .eq('id', id)
    .maybeSingle<PaymentOrderDbRow>();

  if (error) {
    throw AppError.internal(`Failed to load payment order: ${error.message}`);
  }

  return data ? mapRow(data) : null;
}

/**
 * Maps a gateway's own reference (its transaction/order id) back to our
 * row — for a future gateway's callback handlers, which only ever learn
 * that reference from the callback payload, never our internal id. Not
 * currently called (no gateway is wired in), kept as part of the
 * generic repository surface a real provider will need.
 */
export async function findPaymentOrderByProviderOrderId(providerOrderId: string): Promise<PaymentOrderRow | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('payment_orders')
    .select('*')
    .eq('provider_order_id', providerOrderId)
    .maybeSingle<PaymentOrderDbRow>();

  if (error) {
    throw AppError.internal(`Failed to load payment order: ${error.message}`);
  }

  return data ? mapRow(data) : null;
}

/**
 * Atomically transitions one order from 'created' to 'paid' — the
 * idempotency guard the whole payment-success flow relies on. The
 * WHERE clause (`status = 'created'`) makes this a conditional update:
 * only the caller whose request actually matches a row gets a non-null
 * result back. A concurrent or repeat verification call against an
 * already-'paid' order matches nothing and gets `null` — the caller
 * must treat that as "someone else already delivered this," not an
 * error, and must NOT call deliverPaidReport again.
 */
export async function markPaymentPaidIfPending(
  id: string,
  providerPaymentId?: string | null
): Promise<PaymentOrderRow | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('payment_orders')
    .update({
      status: 'paid',
      provider_payment_id: providerPaymentId ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'created')
    .select('*')
    .maybeSingle<PaymentOrderDbRow>();

  if (error) {
    throw AppError.internal(`Failed to update payment order: ${error.message}`);
  }

  return data ? mapRow(data) : null;
}

export async function markReportDelivered(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('payment_orders')
    .update({ report_delivered_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    throw AppError.internal(`Failed to record report delivery: ${error.message}`);
  }
}

/**
 * The real per-assessment, per-tier "has this been paid for" fact —
 * consulted by the report-download endpoint in place of the previous
 * global PAYMENT_TEST_MODE switch.
 */
export async function findPaidOrder(assessmentId: string, tier: ReportTier): Promise<PaymentOrderRow | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('payment_orders')
    .select('*')
    .eq('assessment_id', assessmentId)
    .eq('tier', tier)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<PaymentOrderDbRow>();

  if (error) {
    throw AppError.internal(`Failed to check payment status: ${error.message}`);
  }

  return data ? mapRow(data) : null;
}
