-- Migration 0008: payment_orders table
--
-- One row per checkout attempt for one (assessment, tier) pair. This is
-- what makes "is this report paid for" a real per-assessment fact instead
-- of the previous global PAYMENT_TEST_MODE switch, and gives report
-- delivery an atomic, idempotent guard: report_delivered_at is set exactly
-- once, only by whichever caller wins the `status = 'created' -> 'paid'`
-- transition (see payment.repository.ts's markPaymentPaidIfPending).
--
-- provider records which PaymentProvider created the row ('test-mode'
-- today; 'cashfree' once that provider exists) — the schema itself never
-- needs to change when a real gateway is wired in.

create table if not exists payment_orders (
  id                   uuid primary key default gen_random_uuid(),
  assessment_id        uuid not null references assessments (id) on delete cascade,
  tier                 text not null check (tier in ('summary', 'full')),
  amount_in_paise      integer not null,
  currency             text not null default 'INR',
  provider             text not null,
  provider_order_id    text,
  provider_payment_id  text,
  status               text not null default 'created' check (status in ('created', 'paid', 'failed')),
  report_delivered_at  timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists idx_payment_orders_assessment_id on payment_orders (assessment_id);

alter table payment_orders enable row level security;
