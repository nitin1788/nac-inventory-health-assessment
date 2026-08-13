import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'crypto';
import { env } from '../../config/env';
import { buildPayUOrderFields, buildPayURequestHash } from './payuHash';

// Coerced to '' (never undefined) purely so this diagnostic file typechecks;
// the first test below already skips everything meaningfully if either is
// genuinely absent, so '' here never masks a real missing-credential case.
const PAYU_KEY = env.PAYU_KEY ?? '';
const PAYU_SALT = env.PAYU_SALT ?? '';

/**
 * Diagnostic-only test (2026-08-13): reproduces the EXACT hash input for
 * the real ₹99 TEST order that PayU rejected with "Transaction failed due
 * to incorrectly calculated hash parameter." Every non-secret field below
 * (txnid, amount, productinfo, firstname, email) is copied verbatim from
 * the actual submitted <form> that was auto-posted to
 * https://test.payu.in/_payment. The expected hash is the exact `hash`
 * hidden-field value from that same submission — not a synthetic fixture.
 *
 * Purpose: prove or disprove that payuHash.ts's formula/field-ordering is
 * the cause, independent of whatever PAYU_KEY/PAYU_SALT are currently in
 * backend/.env (read via `env`, never hardcoded or logged here).
 */
const LIVE_ORDER = {
  txnid: 'a27b43a899da6c0088f2',
  amountInPaise: 9900,
  productinfo: 'NAC Inventory Health Assessment - Report Summary',
  firstname: 'Test User',
  email: 'nitin.700@gmail.com',
};

/** The `hash` hidden-field value actually submitted to https://test.payu.in/_payment for this order, and rejected. */
const HASH_PAYU_REJECTED =
  '0ac7060a6c3d894feea4476e1745548f5b943ceefc65bbc6411eca9313bf27f84d89661dbb93d27362bb67a688f855ad3d5538a6838ee26d202383f8707bf7c3';

test('current PAYU_KEY/PAYU_SALT are loaded (test skips instead of false-passing if not)', { skip: !PAYU_KEY || !PAYU_SALT ? 'PAYU_KEY/PAYU_SALT not set in backend/.env' : false }, () => {
  assert.ok(PAYU_KEY.length > 0);
  assert.ok(PAYU_SALT.length > 0);
});

test('buildPayUOrderFields output for the live order matches every field actually submitted in the POST form', () => {
  const fields = buildPayUOrderFields({
    key: PAYU_KEY,
    txnid: LIVE_ORDER.txnid,
    amountInPaise: LIVE_ORDER.amountInPaise,
    productinfo: LIVE_ORDER.productinfo,
    firstname: LIVE_ORDER.firstname,
    email: LIVE_ORDER.email,
    phone: '9999999999', // not part of this order's original submission (phone field added later) — proven not to affect the hash below
  });

  // These are exactly the <input type="hidden"> values from the rejected
  // submission (key excluded from the literal comparison here so this
  // file never contains it — checked for non-emptiness/match separately).
  assert.equal(fields.txnid, 'a27b43a899da6c0088f2');
  assert.equal(fields.amount, '99.00');
  assert.equal(fields.productinfo, 'NAC Inventory Health Assessment - Report Summary');
  assert.equal(fields.firstname, 'Test User');
  assert.equal(fields.email, 'nitin.700@gmail.com');
  assert.equal(fields.key, PAYU_KEY);
});

test('the hash our code computes for the live order reproduces the exact hash that was actually submitted and rejected', () => {
  const fields = buildPayUOrderFields({
    key: PAYU_KEY,
    txnid: LIVE_ORDER.txnid,
    amountInPaise: LIVE_ORDER.amountInPaise,
    productinfo: LIVE_ORDER.productinfo,
    firstname: LIVE_ORDER.firstname,
    email: LIVE_ORDER.email,
    phone: '9999999999', // not part of this order's original submission (phone field added later) — proven not to affect the hash below
  });

  const hash = buildPayURequestHash(fields, PAYU_SALT);
  assert.equal(hash, HASH_PAYU_REJECTED);
});

test('hash input string matches PayU\'s documented formula exactly: 17 pipe-delimited fields (key, txnid, amount, productinfo, firstname, email, udf1-5, 5 reserved blanks, salt), 16 pipes total', () => {
  const fields = buildPayUOrderFields({
    key: PAYU_KEY,
    txnid: LIVE_ORDER.txnid,
    amountInPaise: LIVE_ORDER.amountInPaise,
    productinfo: LIVE_ORDER.productinfo,
    firstname: LIVE_ORDER.firstname,
    email: LIVE_ORDER.email,
    phone: '9999999999', // not part of this order's original submission (phone field added later) — proven not to affect the hash below
  });

  // Hand-built per PayU's own published spec string:
  // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
  // udf1..udf5 unused (empty), followed by 6 pipes (5 more empty reserved
  // slots) before SALT -- reproduced here character-for-character from
  // that spec, independently of payuHash.ts's own EMPTY_MIDDLE_SLOTS.
  const udf1 = '';
  const udf2 = '';
  const udf3 = '';
  const udf4 = '';
  const udf5 = '';
  const manualInput =
    `${fields.key}|${fields.txnid}|${fields.amount}|${fields.productinfo}|${fields.firstname}|${fields.email}` +
    `|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_SALT}`;

  const pipeCount = (manualInput.match(/\|/g) ?? []).length;
  const fieldCount = manualInput.split('|').length;
  assert.equal(pipeCount, 16, `expected 16 pipes per PayU's spec, got ${pipeCount}`);
  assert.equal(fieldCount, 17, `expected 17 fields per PayU's spec, got ${fieldCount}`);

  const manualHash = createHash('sha512').update(manualInput).digest('hex');
  const codeHash = buildPayURequestHash(fields, PAYU_SALT);

  assert.equal(
    codeHash,
    manualHash,
    'payuHash.ts diverges from a hash computed directly against PayU\'s literal published formula'
  );
  assert.equal(codeHash, HASH_PAYU_REJECTED, 'this is the exact hash PayU rejected for this live order');
});
