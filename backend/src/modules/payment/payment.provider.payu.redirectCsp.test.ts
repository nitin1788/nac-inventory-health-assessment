import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import type { PaymentOrderRow } from './payment.repository';
import type { AssessmentDetail } from '../assessment/assessment.types';

/**
 * Regression tests for the nonce-based CSP fix on the PayU redirect page.
 * Root cause fixed: Helmet's global defaults (script-src-attr 'none',
 * form-action 'self') silently block the redirect page's auto-submit
 * script AND any cross-origin form submission, so the browser can never
 * reach PayU's checkout — see payment.payu.controller.ts and
 * payment.provider.payu.ts.
 *
 * This module needs PAYU_KEY/PAYU_SALT/BACKEND_BASE_URL/FRONTEND_BASE_URL
 * configured to exercise buildPayURedirectFormHtml() at all (see
 * ensurePayUConfigured/ensureBaseUrlsConfigured) — set here, as fake,
 * local-only values, BEFORE importing the module under test (in the
 * `before` hook below), rather than touching the shared .env file. Node's
 * test runner executes each test file in its own process, so this has no
 * effect on any other test file.
 */
process.env.PAYU_KEY = 'test-merchant-key';
process.env.PAYU_SALT = 'test-salt-value-not-real-32-chars';
process.env.BACKEND_BASE_URL = 'https://example-backend.onrender.com/api/v1';
process.env.FRONTEND_BASE_URL = 'https://example-frontend.example.com';
process.env.PAYU_ENV = 'production';

// Loaded via require() (not `import`) so the env vars set above are in
// place before payment.provider.payu.ts's `env` singleton
// (config/env.ts) is first evaluated — a plain top-level `import` would
// be hoisted ahead of the process.env assignments above.
let buildPayURedirectFormHtml: (order: PaymentOrderRow, assessment: AssessmentDetail, nonce: string) => string;
let buildPayURedirectCspDirectives: (nonce: string) => Record<string, Iterable<string>>;
let generateCspNonce: () => string;
let PAYU_CHECKOUT_BASE_URL: Record<'test' | 'production', string>;
let helmetCsp: { getDefaultDirectives: () => Record<string, Iterable<string>> };

before(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('./payment.provider.payu');
  buildPayURedirectFormHtml = mod.buildPayURedirectFormHtml;
  buildPayURedirectCspDirectives = mod.buildPayURedirectCspDirectives;
  generateCspNonce = mod.generateCspNonce;
  PAYU_CHECKOUT_BASE_URL = mod.PAYU_CHECKOUT_BASE_URL;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  helmetCsp = require('helmet').default.contentSecurityPolicy;
});

const mockOrder: PaymentOrderRow = {
  id: '11111111-1111-1111-1111-111111111111',
  assessmentId: '22222222-2222-2222-2222-222222222222',
  tier: 'full',
  amountInPaise: 29900,
  currency: 'INR',
  provider: 'payu',
  providerOrderId: 'abc123def456abc123def456',
  providerPaymentId: null,
  status: 'created',
  reportDeliveredAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockAssessment: AssessmentDetail = {
  id: mockOrder.assessmentId,
  assessmentNumber: 'NAC-2026-000001',
  overallScore: 100,
  overallPercentage: 50,
  healthRating: 'Needs Improvement',
  createdAt: new Date().toISOString(),
  company: {
    id: '33333333-3333-3333-3333-333333333333',
    createdAt: new Date().toISOString(),
    companyName: 'Test Co',
    contactPerson: 'Test Contact',
    designation: 'Owner',
    mobile: '+91 90000 00000',
    email: 'test@example.com',
    businessType: 'B2B',
    industry: 'Testing',
    employeeCount: '10',
    inventoryLocations: '1',
    activeSkus: '100',
  },
  moduleScores: [],
  answers: [],
};

test("PAYU_CHECKOUT_BASE_URL.production is exactly PayU's live checkout host", () => {
  assert.equal(PAYU_CHECKOUT_BASE_URL.production, 'https://secure.payu.in');
  assert.equal(PAYU_CHECKOUT_BASE_URL.test, 'https://test.payu.in');
});

test('generateCspNonce produces a fresh, non-empty value on every call (never hardcoded, never reused)', () => {
  const a = generateCspNonce();
  const b = generateCspNonce();
  assert.ok(a.length > 0);
  assert.ok(b.length > 0);
  assert.notEqual(a, b);
});

test('buildPayURedirectCspDirectives allows PayU checkout via form-action without weakening any other default directive', () => {
  const nonce = 'test-nonce-value';
  const directives = buildPayURedirectCspDirectives(nonce);
  const defaults = helmetCsp.getDefaultDirectives();

  // The two intentional, narrow additions. form-action allows both PayU
  // hosts unconditionally (not just whichever PAYU_ENV is active) — see
  // buildPayURedirectCspDirectives's own comment for why that's safe.
  assert.deepEqual(directives['form-action'], ["'self'", 'https://secure.payu.in', 'https://test.payu.in']);
  assert.deepEqual(directives['script-src'], ["'self'", `'nonce-${nonce}'`]);

  // Everything else must be byte-for-byte identical to Helmet's own
  // defaults — proving nothing else was loosened.
  for (const key of Object.keys(defaults)) {
    if (key === 'form-action' || key === 'script-src') continue;
    assert.deepEqual(directives[key], defaults[key], `directive "${key}" must be unchanged from Helmet's default`);
  }

  // script-src-attr must still be exactly 'none' — inline event-handler
  // attributes (onload=, onclick=, etc.) stay blocked everywhere,
  // including this page, which no longer uses one.
  assert.deepEqual(directives['script-src-attr'], ["'none'"]);
});

test('buildPayURedirectCspDirectives never adds unsafe-inline to script-src, and adds it nowhere Helmet\'s own defaults did not already have it', () => {
  const directives = buildPayURedirectCspDirectives(generateCspNonce());
  const defaults = helmetCsp.getDefaultDirectives();

  // The directive that actually governs inline <script> execution must
  // rely solely on the nonce, never a blanket allowance.
  assert.ok(
    !(directives['script-src'] as string[]).includes("'unsafe-inline'"),
    "script-src must authorize the inline auto-submit script via nonce only, never 'unsafe-inline'"
  );

  // For every directive, unsafe-inline may only be present here if it was
  // ALREADY present in Helmet's own default for that directive (e.g.
  // style-src already ships with 'unsafe-inline' out of the box, unrelated
  // to this fix) — never newly introduced by this function.
  for (const [key, value] of Object.entries(directives)) {
    const values = Array.from(value as Iterable<string>);
    const defaultValues = Array.from((defaults[key] ?? []) as Iterable<string>);
    if (values.includes("'unsafe-inline'")) {
      assert.ok(
        defaultValues.includes("'unsafe-inline'"),
        `directive "${key}" contains 'unsafe-inline' but Helmet's own default for it did not — this fix must not have introduced that`
      );
    }
  }
});

test('buildPayURedirectFormHtml embeds a script nonce that matches the CSP nonce for the same response', () => {
  const nonce = generateCspNonce();
  const html = buildPayURedirectFormHtml(mockOrder, mockAssessment, nonce);
  const directives = buildPayURedirectCspDirectives(nonce);

  const scriptTagMatch = html.match(/<script nonce="([^"]+)">/);
  assert.ok(scriptTagMatch, 'expected exactly one <script nonce="..."> tag in the redirect HTML');
  assert.equal(scriptTagMatch![1], nonce);
  assert.ok(
    (directives['script-src'] as string[]).includes(`'nonce-${nonce}'`),
    'the CSP script-src directive must carry the SAME nonce embedded in the HTML'
  );

  // The old inline event-handler attribute must be gone entirely.
  assert.ok(!html.includes('onload='), 'the redirect page must no longer use an inline onload attribute');
});

test('buildPayURedirectFormHtml still submits to secure.payu.in via POST with every required PayU field', () => {
  const nonce = generateCspNonce();
  const html = buildPayURedirectFormHtml(mockOrder, mockAssessment, nonce);

  assert.match(html, /<form method="post" action="https:\/\/secure\.payu\.in\/_payment">/);

  for (const field of ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'hash', 'surl', 'furl']) {
    assert.match(
      html,
      new RegExp(`<input type="hidden" name="${field}" value="[^"]*" />`),
      `expected a hidden input for required PayU field "${field}"`
    );
  }
});
