import { useEffect, useState } from 'react';
import { CheckCircle2, Download, Loader2, MessageCircle, PhoneCall, XCircle } from 'lucide-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { COMPANY_NAME, REPORT_TIERS, ROUTES } from '@/config/constants';
import { env } from '@/config/env';
import { endpoints } from '@/services/api/endpoints';
import { verifyPayment, type VerifiedOrderDetails } from '@/services/api/paymentApi';
import { Button } from '@/shared/components/Button';
import { useSeo } from '@/shared/hooks/useSeo';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { AssessmentHeader } from '@/features/assessment/components/AssessmentHeader';

type VerifyState = 'loading' | 'success' | 'error';

function formatPaidAt(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * The redirect target every PaymentProvider lands the customer on after
 * checkout — `orderId` arrives via the URL (not router state), since
 * this page must also work after a real external gateway redirect
 * later, which can only carry data through the URL. Never trusts a
 * "success" flag from the URL either: the only thing read from it is
 * the order id, and the actual paid/not-paid fact always comes from the
 * server-side verifyPayment() call.
 */
export function ThankYouView() {
  useSeo({
    title: `Payment Successful | ${COMPANY_NAME}`,
    description: 'Your NAC Inventory Health Assessment report purchase is confirmed.',
    path: ROUTES.thankYou,
    noindex: true,
  });

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [state, setState] = useState<VerifyState>('loading');
  const [details, setDetails] = useState<VerifiedOrderDetails | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    void verifyPayment({ orderId })
      .then((result) => {
        if (cancelled) return;
        setDetails(result);
        setState('success');
      })
      .catch(() => {
        if (cancelled) return;
        setState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (!orderId) {
    return <Navigate to={ROUTES.assessmentStart} replace />;
  }

  const tierOption = details ? REPORT_TIERS.find((option) => option.id === details.tier) : undefined;
  const downloadUrl = details
    ? `${env.apiBaseUrl}${endpoints.reportPdf(details.assessmentId, details.tier)}`
    : null;
  const consultationUrl = env.bookConsultationUrl || buildConsultationWhatsAppUrl(details?.assessmentNumber);

  return (
    <div className="min-h-screen bg-slate-50">
      <AssessmentHeader />
      <main id="main-content" className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          {state === 'loading' ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm text-slate-600">Confirming your payment…</p>
            </div>
          ) : null}

          {state === 'error' ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <XCircle className="h-10 w-10 text-red-500" />
              <h1 className="text-xl font-semibold text-slate-900">We couldn't confirm this payment</h1>
              <p className="max-w-sm text-sm text-slate-600">
                If you completed checkout, please contact us with your order id and we'll sort it out —{' '}
                {orderId}.
              </p>
            </div>
          ) : null}

          {state === 'success' && details ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <h1 className="text-xl font-semibold text-slate-900">Payment Successful</h1>

              <dl className="mt-4 w-full space-y-3 rounded-xl bg-slate-50 p-5 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Customer Name</dt>
                  <dd className="font-medium text-slate-900">{details.customerName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Assessment ID</dt>
                  <dd className="font-medium text-slate-900">{details.assessmentNumber}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Order ID</dt>
                  <dd className="font-medium text-slate-900">{details.orderId}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Report Type</dt>
                  <dd className="font-medium text-slate-900">{tierOption?.title ?? details.tier}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Payment Date</dt>
                  <dd className="font-medium text-slate-900">{formatPaidAt(details.paidAt)}</dd>
                </div>
              </dl>

              <p className="mt-2 text-sm text-slate-600">
                Report sent to your email — it should arrive within a few minutes.
              </p>

              {downloadUrl ? (
                <a href={downloadUrl} className="mt-2 w-full">
                  <Button type="button" variant="primary" className="w-full">
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                </a>
              ) : null}

              {env.whatsappCommunityUrl ? (
                <a href={env.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button type="button" variant="secondary" className="w-full">
                    <MessageCircle className="h-4 w-4" />
                    Join WhatsApp Community
                  </Button>
                </a>
              ) : null}

              <a href={consultationUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button type="button" variant="secondary" className="w-full">
                  <PhoneCall className="h-4 w-4" />
                  Book Consultation
                </Button>
              </a>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
