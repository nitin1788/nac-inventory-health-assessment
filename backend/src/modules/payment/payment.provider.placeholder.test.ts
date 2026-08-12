import { before, test } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Regression coverage for the clean PayU removal — no gateway is
 * currently wired into payment.service.ts, and this proves that stays
 * true even under conditions that would previously have activated PayU.
 *
 * Env vars set BEFORE importing (via require() in a `before` hook, same
 * pattern the previous PayU test suite used) so env.ts's `dotenv/config`
 * side effect sees them at module-load time. Deliberately sets
 * PAYU_KEY/PAYU_SALT/PAYU_ENV to prove they now have zero effect — the
 * schema no longer even declares them, so setting them should be inert.
 */
process.env.PAYU_KEY = 'leftover-value-should-be-ignored';
process.env.PAYU_SALT = 'leftover-value-should-be-ignored';
process.env.PAYU_ENV = 'production';
process.env.PAYMENT_TEST_MODE = 'false';

let createOrder: (request: { assessmentId: string; tier: 'summary' | 'full' }) => Promise<{
  status: string;
  message: string;
  amountInPaise: number;
  redirectUrl?: string;
}>;
let placeholderPaymentProvider: {
  name: string;
  verifyPayment: (id: string) => Promise<unknown>;
  handleCallback: (payload: Record<string, string | undefined>) => Promise<unknown>;
};
let env: { PAYU_KEY?: string; PAYU_SALT?: string; PAYU_ENV?: string };

before(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  env = require('../../config/env').env;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  placeholderPaymentProvider = require('./payment.provider.placeholder').placeholderPaymentProvider;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  createOrder = require('./payment.service').createOrder;
});

test('NO PAYU ENV VARS REQUIRED: env schema no longer exposes PAYU_KEY/PAYU_SALT/PAYU_ENV, even when set in process.env', () => {
  assert.equal('PAYU_KEY' in env, false);
  assert.equal('PAYU_SALT' in env, false);
  assert.equal('PAYU_ENV' in env, false);
});

test('NO PAYU IMPLEMENTATION REACHABLE: order creation falls back to the placeholder even with PAYU_KEY/PAYU_SALT/PAYU_ENV=production set in the environment', async () => {
  const result = await createOrder({ assessmentId: '11111111-1111-1111-1111-111111111111', tier: 'summary' });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.redirectUrl, undefined);
});

test('placeholder provider never marks an order paid', async () => {
  await assert.rejects(() => placeholderPaymentProvider.verifyPayment('any-id'));
});

test('placeholder provider never authenticates a callback as valid', async () => {
  await assert.rejects(() => placeholderPaymentProvider.handleCallback({ status: 'success' }));
});

test('placeholder message is generic — never names a specific gateway or exposes integration details', async () => {
  const result = await createOrder({ assessmentId: '11111111-1111-1111-1111-111111111111', tier: 'summary' });
  const lower = result.message.toLowerCase();
  assert.equal(lower.includes('payu'), false);
  assert.equal(result.message, 'Online payment is temporarily unavailable. Please try again shortly.');
});

test('₹99 (summary tier) order creation still works and reports the correct amount', async () => {
  const result = await createOrder({ assessmentId: '11111111-1111-1111-1111-111111111111', tier: 'summary' });
  assert.equal(result.amountInPaise, 9900);
});

test('₹299 (full tier) order creation still works and reports the correct amount', async () => {
  const result = await createOrder({ assessmentId: '11111111-1111-1111-1111-111111111111', tier: 'full' });
  assert.equal(result.amountInPaise, 29900);
});
