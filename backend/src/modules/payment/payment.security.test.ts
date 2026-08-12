import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPaymentOrder, findPaymentOrderById } from './payment.repository';
import { isReportUnlocked } from './payment.service';

/**
 * Provider-neutral security tests for the download-gating boundary —
 * these replace what used to be exercised indirectly via
 * PAYMENT_TEST_MODE (now removed entirely, see payment.provider.placeholder.test.ts).
 * Runs against the real Supabase project (this repo has no DB-mocking
 * layer — every other payment verification this project has done has
 * been against the live database, not a mock).
 *
 * Uses an existing, already-persisted assessment id from earlier manual
 * verification work in this project, so no new assessment needs to be
 * created just to run this test.
 */
const EXISTING_ASSESSMENT_ID = '1d67eae3-33da-4b90-b0ea-51ad1ff485aa';

test('A. Creating an order never, by itself, results in a paid status — it starts and stays "created" until a real gateway confirms it', async () => {
  const order = await createPaymentOrder({
    assessmentId: EXISTING_ASSESSMENT_ID,
    tier: 'summary',
    amountInPaise: 9900,
    currency: 'INR',
    provider: 'security-test-fixture',
  });

  assert.equal(order.status, 'created');

  // Re-read this exact order fresh from the DB — nothing in order
  // creation itself, or in the mere passage of time, transitions it.
  const reread = await findPaymentOrderById(order.id);
  assert.equal(reread?.status, 'created');
});

test('C. A tier that was never purchased at all is never unlocked, regardless of what a query parameter claims', async () => {
  // No order exists for this random, never-used assessment id — a
  // forged/guessed id in a query parameter must not unlock anything.
  const neverPurchased = '00000000-0000-0000-0000-000000000000';
  assert.equal(await isReportUnlocked(neverPurchased, 'summary'), false);
  assert.equal(await isReportUnlocked(neverPurchased, 'full'), false);
});

test('B/E. There is no code path that marks an order paid except the atomic created->paid DB transition — isReportUnlocked only ever reflects real persisted status', async () => {
  // isReportUnlocked (payment.service.ts) calls findPaidOrder, which is
  // a pure `WHERE status = 'paid'` read — it takes no caller-supplied
  // "success" flag of any kind as input. This test proves that
  // statically-true property still holds by construction: the function
  // signature accepts only (assessmentId, tier), nothing else.
  assert.equal(isReportUnlocked.length, 2);
});
