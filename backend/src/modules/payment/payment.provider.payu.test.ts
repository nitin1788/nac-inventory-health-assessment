import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBackendApiUrl, isPayUConfigured, payuPaymentProvider } from './payment.provider.payu';

/** Same already-persisted assessment id payment.security.test.ts uses — no new assessment needs creating just to run this test. */
const EXISTING_ASSESSMENT_ID = '1d67eae3-33da-4b90-b0ea-51ad1ff485aa';

test(
  'createOrder returns a complete checkoutForm (action + every field, hash included) for the browser to POST directly — no redirectUrl',
  { skip: isPayUConfigured() ? false : 'PAYU_KEY/PAYU_SALT not set in backend/.env' },
  async () => {
    const result = await payuPaymentProvider.createOrder({ assessmentId: EXISTING_ASSESSMENT_ID, tier: 'summary' });

    assert.equal(result.status, 'created');
    assert.equal((result as { redirectUrl?: unknown }).redirectUrl, undefined);
    assert.ok(result.checkoutForm, 'expected a checkoutForm in the response');
    assert.match(result.checkoutForm!.action, /^https:\/\/(test|secure)\.payu\.in\/_payment$/);

    for (const field of ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'phone', 'hash', 'surl', 'furl']) {
      assert.ok(
        typeof result.checkoutForm!.fields[field] === 'string' && result.checkoutForm!.fields[field].length > 0,
        `expected a non-empty "${field}" field in checkoutForm.fields`
      );
    }
  }
);

/**
 * Regression tests for a bug that previously caused a 404 on
 * GET /payments/payu/redirect/:orderId: BACKEND_BASE_URL configured
 * without the /api/v1 suffix produced a redirect/surl/furl URL that
 * doesn't match any mounted route. buildBackendApiUrl() must produce
 * the correct, single-/api/v1 URL regardless of how BACKEND_BASE_URL
 * was configured.
 */

test('buildBackendApiUrl appends /api/v1 when BACKEND_BASE_URL is a bare domain', () => {
  const url = buildBackendApiUrl('https://nac-inventory-health-assessment-api.onrender.com', '/payments/payu/redirect/abc123');
  assert.equal(url, 'https://nac-inventory-health-assessment-api.onrender.com/api/v1/payments/payu/redirect/abc123');
});

test('buildBackendApiUrl does not double the prefix when BACKEND_BASE_URL already includes /api/v1', () => {
  const url = buildBackendApiUrl(
    'https://nac-inventory-health-assessment-api.onrender.com/api/v1',
    '/payments/payu/redirect/abc123'
  );
  assert.equal(url, 'https://nac-inventory-health-assessment-api.onrender.com/api/v1/payments/payu/redirect/abc123');
});

test('buildBackendApiUrl strips a trailing slash from BACKEND_BASE_URL before appending the prefix', () => {
  const url = buildBackendApiUrl('https://example.onrender.com/', '/payments/payu/success');
  assert.equal(url, 'https://example.onrender.com/api/v1/payments/payu/success');
});

test('buildBackendApiUrl strips a trailing slash even when /api/v1 is already present', () => {
  const url = buildBackendApiUrl('https://example.onrender.com/api/v1/', '/payments/payu/failure');
  assert.equal(url, 'https://example.onrender.com/api/v1/payments/payu/failure');
});

test('buildBackendApiUrl works for local dev (http, port, no prefix)', () => {
  const url = buildBackendApiUrl('http://localhost:4000', '/payments/payu/redirect/xyz');
  assert.equal(url, 'http://localhost:4000/api/v1/payments/payu/redirect/xyz');
});
