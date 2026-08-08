import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPayUOrderFields,
  buildPayURequestHash,
  buildPayUVerifyApiHash,
  formatPayUAmount,
  generatePayUTxnId,
  PAYU_FIELD_LIMITS,
  sanitizePayUField,
  verifyPayUResponseHash,
} from './payuHash';

/**
 * The three expected-hash fixtures below were cross-checked against a
 * SHA-512 computed independently of this codebase (plain Node crypto,
 * hand-built pipe-delimited string per docs.payu.in's published
 * formulas) before being pinned here — see the PayU integration commit
 * for the exact verification. A regression in payuHash.ts's field
 * ordering will fail these immediately.
 */
const FIXTURE = {
  key: 'testkey',
  txnid: 'txn123',
  amount: '99.00',
  productinfo: 'Report Summary',
  firstname: 'Ravi',
  email: 'ravi@example.com',
  salt: 'testsalt',
};
const EXPECTED_REQUEST_HASH =
  'e02bd6be8fded609c26328c1126e37b071d9f03759a5014207f47e9b7a8a3df5e5858b950934e16a36955dd9952849aec9f37b8b2ecd39033369dda6bd3d7609';
const EXPECTED_RESPONSE_HASH =
  'd9df58ec07de000e87f5bddfce64067dd540c466c35bade036e842c9fbf55b97e8a0203ddcadf7a7196e02de817a1a3540028414586509947efc6f5d6dbf729c';
const EXPECTED_VERIFY_API_HASH =
  '9db06e99e8b541026ebb265c003d9699eaf95405c135dc86f88bbb0115bfb37cb1aaa2bd830bc24c06a0fedc7bdd6041ea6df780fac0798faffff504ced0bad4';

test('buildPayURequestHash matches the documented PayU formula exactly', () => {
  const hash = buildPayURequestHash(
    {
      key: FIXTURE.key,
      txnid: FIXTURE.txnid,
      amount: FIXTURE.amount,
      productinfo: FIXTURE.productinfo,
      firstname: FIXTURE.firstname,
      email: FIXTURE.email,
    },
    FIXTURE.salt
  );
  assert.equal(hash, EXPECTED_REQUEST_HASH);
});

test('verifyPayUResponseHash accepts a genuinely valid callback', () => {
  const valid = verifyPayUResponseHash(
    {
      status: 'success',
      txnid: FIXTURE.txnid,
      amount: FIXTURE.amount,
      productinfo: FIXTURE.productinfo,
      firstname: FIXTURE.firstname,
      email: FIXTURE.email,
      hash: EXPECTED_RESPONSE_HASH,
    },
    FIXTURE.key,
    FIXTURE.salt
  );
  assert.equal(valid, true);
});

test('verifyPayUResponseHash rejects a tampered amount', () => {
  const valid = verifyPayUResponseHash(
    {
      status: 'success',
      txnid: FIXTURE.txnid,
      amount: '1.00', // attacker downgrades the charged amount, keeps the old hash
      productinfo: FIXTURE.productinfo,
      firstname: FIXTURE.firstname,
      email: FIXTURE.email,
      hash: EXPECTED_RESPONSE_HASH,
    },
    FIXTURE.key,
    FIXTURE.salt
  );
  assert.equal(valid, false);
});

test('verifyPayUResponseHash rejects a tampered status', () => {
  const valid = verifyPayUResponseHash(
    {
      status: 'failure', // attacker flips failure -> claims success without the hash matching
      txnid: FIXTURE.txnid,
      amount: FIXTURE.amount,
      productinfo: FIXTURE.productinfo,
      firstname: FIXTURE.firstname,
      email: FIXTURE.email,
      hash: EXPECTED_RESPONSE_HASH,
    },
    FIXTURE.key,
    FIXTURE.salt
  );
  assert.equal(valid, false);
});

test('verifyPayUResponseHash rejects a missing hash rather than throwing', () => {
  const valid = verifyPayUResponseHash(
    { status: 'success', txnid: FIXTURE.txnid, amount: FIXTURE.amount, email: FIXTURE.email },
    FIXTURE.key,
    FIXTURE.salt
  );
  assert.equal(valid, false);
});

test('verifyPayUResponseHash rejects a malformed (non-hex, wrong-length) hash rather than throwing', () => {
  const valid = verifyPayUResponseHash(
    { status: 'success', txnid: FIXTURE.txnid, amount: FIXTURE.amount, email: FIXTURE.email, hash: 'not-a-real-hash' },
    FIXTURE.key,
    FIXTURE.salt
  );
  assert.equal(valid, false);
});

test('buildPayUVerifyApiHash matches the documented PayU formula exactly', () => {
  const hash = buildPayUVerifyApiHash(FIXTURE.key, FIXTURE.txnid, FIXTURE.salt);
  assert.equal(hash, EXPECTED_VERIFY_API_HASH);
});

test('formatPayUAmount converts paise to a 2-decimal rupee string', () => {
  assert.equal(formatPayUAmount(9900), '99.00');
  assert.equal(formatPayUAmount(29900), '299.00');
  assert.equal(formatPayUAmount(100), '1.00');
});

test('generatePayUTxnId fits PayU\'s 25-char txnid limit and is unique per call', () => {
  const a = generatePayUTxnId();
  const b = generatePayUTxnId();
  assert.ok(a.length <= PAYU_FIELD_LIMITS.txnid, `txnid "${a}" exceeds PayU's ${PAYU_FIELD_LIMITS.txnid}-char limit`);
  assert.match(a, /^[0-9a-f]+$/);
  assert.notEqual(a, b);
});

test('sanitizePayUField strips the hash delimiter and truncates to the field limit', () => {
  assert.equal(sanitizePayUField('Nitin | Anand', 100), 'Nitin  Anand');
  assert.equal(sanitizePayUField('a'.repeat(200), 60).length, 60);
});

test('buildPayUOrderFields never lets a UUID-length id through as txnid', () => {
  const fields = buildPayUOrderFields({
    key: 'k',
    txnid: '550e8400-e29b-41d4-a716-446655440000', // 36 chars, longer than PayU allows
    amountInPaise: 9900,
    productinfo: 'x',
    firstname: 'x',
    email: 'x@example.com',
  });
  assert.ok(fields.txnid.length <= PAYU_FIELD_LIMITS.txnid);
});

test('buildPayUOrderFields strips a pipe character from company-derived free text so it cannot corrupt the hash string', () => {
  const fields = buildPayUOrderFields({
    key: 'k',
    txnid: 't',
    amountInPaise: 9900,
    productinfo: 'Report | Summary',
    firstname: 'x',
    email: 'x@example.com',
  });
  assert.ok(!fields.productinfo.includes('|'));
});
