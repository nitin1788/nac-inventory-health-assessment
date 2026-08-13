import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeholderPaymentProvider } from './payment.provider.placeholder';

/**
 * Tests the placeholder provider directly (not via payment.service's
 * activeProvider, which now resolves to PayU whenever PAYU_KEY/PAYU_SALT
 * are configured — see payment.service.ts). This keeps these tests true
 * regardless of which provider is active in the current environment: the
 * placeholder itself must always behave this way whenever it IS the
 * active provider (no gateway configured).
 */

test('placeholder never charges — createOrder always reports "unavailable" with no checkout handoff', async () => {
  const result = await placeholderPaymentProvider.createOrder({
    assessmentId: '11111111-1111-1111-1111-111111111111',
    tier: 'summary',
  });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.checkoutForm, undefined);
  assert.equal(result.orderId, undefined);
});

test('placeholder message is generic — never names a specific gateway or exposes integration details', async () => {
  const result = await placeholderPaymentProvider.createOrder({
    assessmentId: '11111111-1111-1111-1111-111111111111',
    tier: 'summary',
  });
  assert.equal(result.message.toLowerCase().includes('payu'), false);
});

test('placeholder reports the correct amount per tier even though nothing is actually charged', async () => {
  const summary = await placeholderPaymentProvider.createOrder({
    assessmentId: '11111111-1111-1111-1111-111111111111',
    tier: 'summary',
  });
  assert.equal(summary.amountInPaise, 9900);

  const full = await placeholderPaymentProvider.createOrder({
    assessmentId: '11111111-1111-1111-1111-111111111111',
    tier: 'full',
  });
  assert.equal(full.amountInPaise, 29900);
});

test('placeholder provider never marks an order paid', async () => {
  await assert.rejects(() => placeholderPaymentProvider.verifyPayment('any-id'));
});

test('placeholder provider never authenticates a callback as valid', async () => {
  await assert.rejects(() => placeholderPaymentProvider.handleCallback({ status: 'success' }));
});
