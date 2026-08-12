import { useEffect, useRef, useState } from 'react';
import { Clock3, Loader2, XCircle } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { COMPANY_NAME, REPORT_TIERS, ROUTES } from '@/config/constants';
import type { ReportTier } from '@/config/constants';
import { ApiTimeoutError } from '@/services/api/apiClient';
import { createPaymentOrder } from '@/services/api/paymentApi';
import { Button } from '@/shared/components/Button';
import { useSeo } from '@/shared/hooks/useSeo';
import { AssessmentHeader } from '@/features/assessment/components/AssessmentHeader';

export interface PaymentLocationState {
  assessmentId: string;
  assessmentNumber: string | null;
  tier: ReportTier;
}

type OrderStatus = 'loading' | 'unavailable' | 'error' | 'timeout';

/**
 * Order creation itself is a single lightweight DB insert server-side
 * (see backend/src/modules/payment/payment.controller.ts) — 15s is
 * generous headroom for normal network conditions, not a value chosen
 * to paper over a slow backend. If it's ever hit in practice, that's a
 * real backend regression to investigate, not something to raise further.
 */
const ORDER_REQUEST_TIMEOUT_MS = 15000;

/**
 * Purely a UI affordance — after this many ms of still waiting (but well
 * before ORDER_REQUEST_TIMEOUT_MS is hit), swap in a message that
 * acknowledges the wait instead of leaving the same static copy on
 * screen the whole time. Does not change when the request actually
 * times out or retries; it only changes what the customer sees while a
 * legitimately slower-than-usual request is still in flight.
 */
const SLOW_REQUEST_HINT_MS = 5000;

/**
 * Checkout-initiation page — calls the real POST /payments/orders
 * endpoint and reacts purely to the `status` it gets back:
 *
 * - 'unavailable' (current state — no PaymentProvider is live yet):
 *   shows a generic "temporarily unavailable" message — never names a
 *   specific gateway or exposes integration details.
 * - 'created' (once a real gateway is wired in): a real browser
 *   navigation to `redirectUrl` — a gateway's own redirect/checkout
 *   page. This component does the exact same `window.location.href`
 *   navigation regardless of which provider is active.
 * - 'error'/'timeout': the request failed or took too long — surfaced
 *   with a Retry action rather than a spinner with no way out.
 */
export function PaymentPlaceholderView() {
  useSeo({
    title: `Complete Your Purchase | ${COMPANY_NAME}`,
    description: 'Purchase your NAC Inventory Health Assessment report.',
    path: ROUTES.payment,
    noindex: true,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentLocationState | null;
  const [status, setStatus] = useState<OrderStatus>('loading');
  const [message, setMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isSlow, setIsSlow] = useState(false);
  // Guards against the same effect run firing a second, overlapping
  // POST /payments/orders (e.g. a fast unmount/remount) — the retry
  // button below is the only other way this request re-fires, and it
  // only does so once the previous attempt has already settled.
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!state) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    let cancelled = false;
    setStatus('loading');
    setMessage(null);
    setIsSlow(false);

    const slowHintTimer = setTimeout(() => {
      if (!cancelled) setIsSlow(true);
    }, SLOW_REQUEST_HINT_MS);

    createPaymentOrder(
      { assessmentId: state.assessmentId, tier: state.tier },
      { timeoutMs: ORDER_REQUEST_TIMEOUT_MS }
    )
      .then((result) => {
        if (cancelled) return;

        if (result.status === 'created' && result.redirectUrl) {
          window.location.href = result.redirectUrl;
          return;
        }

        setMessage(result.message);
        setStatus('unavailable');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setStatus(err instanceof ApiTimeoutError ? 'timeout' : 'error');
      })
      .finally(() => {
        inFlightRef.current = false;
        clearTimeout(slowHintTimer);
      });

    return () => {
      cancelled = true;
      clearTimeout(slowHintTimer);
    };
  }, [state, attempt]);

  if (!state) {
    return <Navigate to={ROUTES.assessmentStart} replace />;
  }

  const tierOption = REPORT_TIERS.find((option) => option.id === state.tier);
  const canRetry = status === 'error' || status === 'timeout';

  return (
    <div className="min-h-screen bg-slate-50">
      <AssessmentHeader />
      <main id="main-content" className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          {tierOption ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">{tierOption.title}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{tierOption.priceDisplay}</p>
            </>
          ) : null}

          <div className="mt-8 flex flex-col items-center gap-3">
            {status === 'loading' ? <Loader2 className="h-8 w-8 animate-spin text-brand" /> : null}
            {status === 'unavailable' ? <Clock3 className="h-8 w-8 text-brand" /> : null}
            {canRetry ? <XCircle className="h-8 w-8 text-red-500" /> : null}

            <h1 className="text-xl font-semibold text-slate-900">
              {status === 'loading' && (isSlow ? 'Still preparing your secure payment…' : 'Preparing secure payment…')}
              {status === 'unavailable' && 'Payment Temporarily Unavailable'}
              {status === 'timeout' && 'This is taking longer than expected.'}
              {status === 'error' && "We couldn't reach the payment service."}
            </h1>
            <p className="max-w-sm text-sm text-slate-600">
              {status === 'loading' &&
                (isSlow
                  ? "This is taking a little longer than usual — we're still connecting to the payment service."
                  : 'Setting up your secure order — this only takes a moment.')}
              {status === 'unavailable' &&
                (message ?? 'Online payment is temporarily unavailable. Please try again shortly.')}
              {status === 'timeout' && 'The payment service is taking too long to respond. You can try again.'}
              {status === 'error' &&
                "Please try again — if this keeps happening, contact us and we'll help you complete your purchase."}
            </p>
          </div>

          {canRetry ? (
            <Button type="button" variant="primary" className="mt-8" onClick={() => setAttempt((n) => n + 1)}>
              Retry
            </Button>
          ) : null}

          <Button
            type="button"
            variant="secondary"
            className={canRetry ? 'mt-3' : 'mt-8'}
            onClick={() => navigate(-1)}
          >
            ← Back to Results
          </Button>
        </div>
      </main>
    </div>
  );
}
