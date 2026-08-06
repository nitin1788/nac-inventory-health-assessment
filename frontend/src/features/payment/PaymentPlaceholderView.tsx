import { useEffect, useState } from 'react';
import { Clock3, Loader2 } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { COMPANY_NAME, REPORT_TIERS, ROUTES } from '@/config/constants';
import type { ReportTier } from '@/config/constants';
import { createPaymentOrder } from '@/services/api/paymentApi';
import { Button } from '@/shared/components/Button';
import { useSeo } from '@/shared/hooks/useSeo';
import { AssessmentHeader } from '@/features/assessment/components/AssessmentHeader';

export interface PaymentLocationState {
  assessmentId: string;
  assessmentNumber: string | null;
  tier: ReportTier;
}

type OrderStatus = 'loading' | 'unavailable' | 'error';

/**
 * Placeholder checkout page — no real payment gateway is wired up yet
 * (see backend/src/modules/payment/, currently a placeholder
 * provider). Still calls the real POST /payments/orders endpoint so
 * the request/response plumbing is exercised end-to-end; only the
 * message shown here changes once a real gateway replaces the
 * backend's placeholder provider — this component doesn't need a
 * rewrite, just a richer response to render.
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

  useEffect(() => {
    if (!state) return;
    let cancelled = false;

    void createPaymentOrder({ assessmentId: state.assessmentId, tier: state.tier })
      .then((result) => {
        if (cancelled) return;
        setMessage(result.message);
        setStatus('unavailable');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [state]);

  if (!state) {
    return <Navigate to={ROUTES.assessmentStart} replace />;
  }

  const tierOption = REPORT_TIERS.find((option) => option.id === state.tier);

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
            {status === 'loading' ? (
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            ) : (
              <Clock3 className="h-8 w-8 text-brand" />
            )}
            <h1 className="text-xl font-semibold text-slate-900">
              {status === 'error' ? "We couldn't reach the payment service." : 'Payment Gateway Coming Soon.'}
            </h1>
            <p className="max-w-sm text-sm text-slate-600">
              {status === 'error'
                ? 'Please try again in a moment.'
                : (message ??
                  "We're finishing our online payment integration. Your assessment results are saved — check back soon to purchase your report.")}
            </p>
          </div>

          <Button type="button" variant="secondary" className="mt-8" onClick={() => navigate(-1)}>
            ← Back to Results
          </Button>
        </div>
      </main>
    </div>
  );
}
