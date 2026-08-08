import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBackendApiUrl } from './payment.provider.payu';

/**
 * Regression tests for the exact bug that caused a production 404 on
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
