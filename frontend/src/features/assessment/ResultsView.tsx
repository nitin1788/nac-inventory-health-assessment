import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { COMPANY_NAME, REPORT_TIERS, ROUTES } from '@/config/constants';
import type { ReportTierOption } from '@/config/constants';
import { ApiError } from '@/services/api/apiClient';
import { submitAssessment } from '@/services/api/assessmentApi';
import { Button } from '@/shared/components/Button';
import { clsx } from '@/shared/utils/clsx';
import { useSeo } from '@/shared/hooks/useSeo';
import type { PaymentLocationState } from '@/features/payment/PaymentPlaceholderView';
import { AssessmentHeader } from './components/AssessmentHeader';
import { PurchaseOptionCard } from './components/PurchaseOptionCard';
import type { CompanyProfile } from './questions/companyProfile';
import { generateRecommendations } from './recommendations/recommendationEngine';
import type { HealthRating, ScoringResult } from './scoring/scoreTypes';
import { buildAssessmentPayload } from './submission/buildAssessmentPayload';
import type { AnswerMap } from './useAssessmentEngine';

export interface ResultsLocationState {
  companyInfo: CompanyProfile;
  scoringResult: ScoringResult;
  answers: AnswerMap;
  submissionId: string;
}

type SubmissionStatus = 'saving' | 'success' | 'error';

interface CachedSubmission {
  id: string;
  assessmentNumber: string;
}

function submissionStorageKey(submissionId: string): string {
  return `nac-assessment-submission:${submissionId}`;
}

const RATING_BADGE_CLASSES: Record<HealthRating, string> = {
  Excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Good: 'bg-teal-50 text-teal-700 border-teal-200',
  'Needs Improvement': 'bg-amber-50 text-amber-700 border-amber-200',
  Critical: 'bg-red-50 text-red-700 border-red-200',
};

interface SubmissionStatusBannerProps {
  status: SubmissionStatus;
  assessmentNumber: string | null;
  errorMessage: string | null;
  overallScore: number;
  overallMaxScore: number;
  overallPercentage: number;
  healthRating: HealthRating;
  onRetry: () => void;
}

function SubmissionStatusBanner({
  status,
  assessmentNumber,
  errorMessage,
  overallScore,
  overallMaxScore,
  overallPercentage,
  healthRating,
  onRetry,
}: SubmissionStatusBannerProps) {
  if (status === 'saving') {
    return (
      <div className="mt-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand" />
        Saving your assessment…
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-emerald-900 sm:text-lg">
                🎉 Your Inventory Health Assessment is Complete!
              </h2>
              <p className="mt-2 text-sm text-emerald-800">
                Your results below are ready. Choose a report below to get your full, detailed findings.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/70">
                Assessment Number
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-900">{assessmentNumber ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/70">
                Overall Score
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-900">
                {overallScore} / {overallMaxScore} ({overallPercentage}%)
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/70">
                Health Rating
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-900">{healthRating}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <span className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {errorMessage ?? "We couldn't save your assessment right now."}
      </span>
      <Button type="button" variant="secondary" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

/**
 * Reads the scoring result handed off by the assessment flow's final
 * "Finish" action (see AssessmentQuestionsView) — there is no
 * standalone results-fetch step, since scoring is a pure client-side
 * calculation in this milestone. Landing here directly (no state)
 * means the assessment was never completed, so redirect to start.
 *
 * Only a free summary (score, rating, a short focus-area teaser) is
 * shown here — the full module-by-module breakdown and recommendations
 * are part of the paid report tiers (see PurchaseOptionCard) and are
 * generated only after a successful purchase. No PDF is generated or
 * emailed from this page.
 */
export function ResultsView() {
  useSeo({
    title: `Your Assessment Results | ${COMPANY_NAME}`,
    description: `Your personalized ${COMPANY_NAME} Inventory Health Assessment results — overall score, health rating, and report options.`,
    path: ROUTES.results,
    noindex: true,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsLocationState | null;
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('saving');
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [assessmentNumber, setAssessmentNumber] = useState<string | null>(null);
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | null>(null);

  const runSubmission = useCallback(async () => {
    if (!state) return;

    // Assessment was already saved for this exact "Finish" submission —
    // e.g. the results page was refreshed. Show the prior result instead
    // of submitting again (see AssessmentQuestionsView, which mints one
    // submissionId per Finish click).
    const cachedRaw = sessionStorage.getItem(submissionStorageKey(state.submissionId));
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as CachedSubmission;
      setAssessmentId(cached.id);
      setAssessmentNumber(cached.assessmentNumber);
      setSubmissionStatus('success');
      return;
    }

    setSubmissionStatus('saving');
    setSubmissionErrorMessage(null);
    try {
      const payload = buildAssessmentPayload(state.companyInfo, state.scoringResult, state.answers);
      const result = await submitAssessment(payload);
      const cached: CachedSubmission = { id: result.id, assessmentNumber: result.assessmentNumber };
      sessionStorage.setItem(submissionStorageKey(state.submissionId), JSON.stringify(cached));
      setAssessmentId(result.id);
      setAssessmentNumber(result.assessmentNumber);
      setSubmissionStatus('success');
    } catch (error) {
      setSubmissionErrorMessage(
        error instanceof ApiError ? error.message : "We couldn't save your assessment right now."
      );
      setSubmissionStatus('error');
    }
  }, [state]);

  // Guards only the automatic on-mount submission — React 18 StrictMode
  // (dev only) invokes effects twice on the same mount, which without this
  // guard fired two POSTs for one Finish click. The Retry button below
  // calls runSubmission() directly and is unaffected.
  const hasAutoSubmittedRef = useRef(false);

  useEffect(() => {
    if (hasAutoSubmittedRef.current) return;
    hasAutoSubmittedRef.current = true;
    void runSubmission();
  }, [runSubmission]);

  if (!state) {
    return <Navigate to={ROUTES.assessmentStart} replace />;
  }

  const { companyInfo, scoringResult } = state;
  const recommendationResult = generateRecommendations(scoringResult);

  // A short, free teaser — module titles only, no scores or
  // recommendation detail, since "Module Scores" and "Recommendations"
  // are what the paid tiers deliver (see REPORT_TIERS).
  const focusAreas = [...scoringResult.moduleScores]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);

  const handleSelectTier = (tier: ReportTierOption) => {
    if (!assessmentId) return;
    navigate(ROUTES.payment, {
      state: {
        assessmentId,
        assessmentNumber,
        tier: tier.id,
      } satisfies PaymentLocationState,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AssessmentHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {companyInfo.companyName}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Your Inventory Health Results
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Based on your answers across {scoringResult.moduleScores.length} assessment modules.
        </p>

        <SubmissionStatusBanner
          status={submissionStatus}
          assessmentNumber={assessmentNumber}
          errorMessage={submissionErrorMessage}
          overallScore={scoringResult.overallScore}
          overallMaxScore={scoringResult.overallMaxScore}
          overallPercentage={scoringResult.overallPercentage}
          healthRating={scoringResult.overallRating}
          onRetry={() => void runSubmission()}
        />

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Overall Inventory Health Score
          </span>
          <div className="mt-3 flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-brand sm:text-6xl">
              {scoringResult.overallScore}
            </span>
            <span className="text-lg text-slate-400">/ {scoringResult.overallMaxScore}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{scoringResult.overallPercentage}% overall</p>
          <span
            className={clsx(
              'mt-4 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium',
              RATING_BADGE_CLASSES[scoringResult.overallRating]
            )}
          >
            {scoringResult.overallRating}
          </span>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600">
            {recommendationResult.overallSummary}
          </p>
        </div>

        {focusAreas.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Key Focus Areas
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {focusAreas.map((moduleScore) => (
                <li key={moduleScore.moduleId} className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  {moduleScore.moduleTitle}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Get your full module-wise scores and detailed recommendations in a report below.
            </p>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Get Your Full Report</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose the level of detail you need — delivered by email and available for download.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {REPORT_TIERS.map((tier, index) => (
              <PurchaseOptionCard
                key={tier.id}
                tier={tier}
                highlighted={index === REPORT_TIERS.length - 1}
                onSelect={handleSelectTier}
              />
            ))}
          </div>
          {!assessmentId ? (
            <p className="mt-3 text-xs text-slate-500">
              Report options unlock once your assessment finishes saving.
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
