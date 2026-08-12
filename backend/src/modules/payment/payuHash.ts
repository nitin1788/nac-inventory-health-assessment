import { createHash, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Pure PayU hash/formatting logic — no network, no DB, no Express. Kept
 * separate from payment.provider.payu.ts so the security-critical part
 * (the exact hash string construction) is trivially unit-testable and has
 * nothing else to mock.
 *
 * Every formula below is taken verbatim from PayU India's current official
 * docs (fetched at implementation time, see docs.payu.in):
 *   - Request hash:  https://docs.payu.in/docs/generate-hash-payu-hosted
 *   - Response hash: https://docs.payu.in/docs/hashing-request-and-response
 *   - Verify API hash: https://docs.payu.in/reference/verify_payment_api
 *
 * PayU's classic hash strings reserve 5 udf (user-defined field) slots
 * plus 5 further empty reserved slots between the named fields and the
 * salt/key. This integration doesn't use udf fields (payment_orders.
 * provider_order_id is already our lookup key), so all 10 slots are
 * always empty strings — built once here rather than re-counting pipe
 * characters by hand in every formula below.
 */
const EMPTY_MIDDLE_SLOTS: readonly string[] = Object.freeze(new Array(10).fill(''));

/** PayU's documented field-length limits (docs.payu.in/reference/addl_info-payment-apis). */
export const PAYU_FIELD_LIMITS = {
  txnid: 25,
  productinfo: 100,
  firstname: 60,
  email: 50,
} as const;

/**
 * Strips the '|' hash delimiter (a value containing one would corrupt the
 * hash string's field boundaries) and truncates to PayU's documented
 * limit for that field.
 */
export function sanitizePayUField(value: string, maxLength: number): string {
  return value.replace(/\|/g, '').slice(0, maxLength);
}

/** A short, unique, PayU-safe transaction id. A raw UUID (36 chars) exceeds PayU's 25-char txnid limit. */
export function generatePayUTxnId(): string {
  return randomBytes(10).toString('hex'); // 20 hex chars
}

/** PayU expects amount as a plain decimal string with 2 places, e.g. "299.00" — never paise. */
export function formatPayUAmount(amountInPaise: number): string {
  return (amountInPaise / 100).toFixed(2);
}

export interface PayUOrderFields {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
}

export interface BuildPayUOrderFieldsInput {
  key: string;
  txnid: string;
  amountInPaise: number;
  productinfo: string;
  firstname: string;
  email: string;
}

/** Sanitizes and formats raw order data into the exact field set PayU's hosted checkout expects. */
export function buildPayUOrderFields(input: BuildPayUOrderFieldsInput): PayUOrderFields {
  return {
    key: input.key,
    txnid: sanitizePayUField(input.txnid, PAYU_FIELD_LIMITS.txnid),
    amount: formatPayUAmount(input.amountInPaise),
    productinfo: sanitizePayUField(input.productinfo, PAYU_FIELD_LIMITS.productinfo),
    firstname: sanitizePayUField(input.firstname, PAYU_FIELD_LIMITS.firstname),
    email: sanitizePayUField(input.email, PAYU_FIELD_LIMITS.email),
  };
}

/** Request hash for PayU Hosted Checkout: sha512(key|txnid|amount|productinfo|firstname|email|udf1..5|||||SALT). */
export function buildPayURequestHash(fields: PayUOrderFields, salt: string): string {
  const parts = [
    fields.key,
    fields.txnid,
    fields.amount,
    fields.productinfo,
    fields.firstname,
    fields.email,
    ...EMPTY_MIDDLE_SLOTS,
    salt,
  ];
  return createHash('sha512').update(parts.join('|')).digest('hex');
}

export interface PayUCallbackPayload {
  status?: string;
  txnid?: string;
  amount?: string;
  productinfo?: string;
  firstname?: string;
  email?: string;
  hash?: string;
  mihpayid?: string;
  mode?: string;
  error?: string;
  error_Message?: string;
  [key: string]: string | undefined;
}

/** Response hash PayU signs its surl/furl callback with: sha512(SALT|status|udf-slots(reversed, empty)|email|firstname|productinfo|amount|txnid|key). */
function buildExpectedResponseHash(payload: PayUCallbackPayload, key: string, salt: string): string {
  const parts = [
    salt,
    payload.status ?? '',
    ...EMPTY_MIDDLE_SLOTS,
    payload.email ?? '',
    payload.firstname ?? '',
    payload.productinfo ?? '',
    payload.amount ?? '',
    payload.txnid ?? '',
    key,
  ];
  return createHash('sha512').update(parts.join('|')).digest('hex');
}

/**
 * Authenticates a PayU surl/furl callback payload. Constant-time compare
 * against a timing side-channel; returns false (never throws) on any
 * malformed input so callers can treat "invalid" uniformly.
 */
export function verifyPayUResponseHash(payload: PayUCallbackPayload, key: string, salt: string): boolean {
  if (!payload.hash) return false;

  const expected = buildExpectedResponseHash(payload, key, salt);
  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(payload.hash, 'hex');

  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

/** Hash for the server-to-server Verify Payment API: sha512(key|command|var1|salt). */
export function buildPayUVerifyApiHash(key: string, txnid: string, salt: string): string {
  return createHash('sha512').update([key, 'verify_payment', txnid, salt].join('|')).digest('hex');
}
