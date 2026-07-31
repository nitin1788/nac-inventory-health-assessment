import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Mail, RefreshCw } from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { COMPANY_NAME, CONSULTATION, ROUTES } from '@/config/constants';
import { ApiError } from '@/services/api/apiClient';
import { submitAssessment } from '@/services/api/assessmentApi';
import { Button } from '@/shared/components/Button';
import { clsx } from '@/shared/utils/clsx';
import { useSeo } from '@/shared/hooks/useSeo';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { AssessmentHeader } from './components/AssessmentHeader';
import type { CompanyProfile } from './questions/companyProfile';
import { generateRecommendations } from './recommendations/recommendationEngine';
import type { ModuleRecommendation, PriorityLevel } from './recommendations/recommendationTypes';
import { getHealthRating } from './scoring/scoreHelpers';
import type { HealthRating, ModuleScore, ScoringResult } from './scoring/scoreTypes';
import { buildAssessmentPayload } from './submission/buildAssessmentPayload';
import type { AnswerMap } from './useAssessmentEngine';

export interface ResultsLocationState {
  companyInfo: CompanyProfile;
  scoringResult: ScoringResult;
  answers: AnswerMap;
  submissionId: string;
}

type SubmissionStatus = 'saving' | 'success' | 'error';

function submissionStorageKey(submissionId: string): string {
  return `nac-assessment-submission:${submissionId}`;
}

const RATING_BADGE_CLASSES: Record<HealthRating, string> = {
  Excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Good: 'bg-teal-50 text-teal-700 border-teal-200',
  'Needs Improvement': 'bg-amber-50 text-amber-700 border-amber-200',
  Critical: 'bg-red-50 text-red-700 border-red-200',
};

const RATING_BAR_CLASSES: Record<HealthRating, string> = {
  Excellent: 'bg-emerald-500',
  Good: 'bg-teal-500',
  'Needs Improvement': 'bg-amber-500',
  Critical: 'bg-red-500',
};

const PRIORITY_BADGE_CLASSES: Record<PriorityLevel, string> = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-teal-50 text-teal-700 border-teal-200',
  Maintain: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function ModuleScoreCard({ moduleScore }: { moduleScore: ModuleScore }) {
  const rating = getHealthRating(moduleScore.percentage);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-slate-900">{moduleScore.moduleTitle}</span>
        <span
          className={clsx(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
            RATING_BADGE_CLASSES[rating]
          )}
        >
          {rating}
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={clsx('h-full rounded-full', RATING_BAR_CLASSES[rating])}
          style={{ width: `${moduleScore.percentage}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
        <span>
          {moduleScore.score} / {moduleScore.maxScore} pts
        </span>
        <span>{moduleScore.percentage}%</span>
      </div>
    </div>
  );
}

function ModuleRecommendationCard({ moduleRecommendation }: { moduleRecommendation: ModuleRecommendation }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-slate-900">{moduleRecommendation.moduleTitle}</span>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={clsx(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
              RATING_BADGE_CLASSES[moduleRecommendation.rating]
            )}
          >
            {moduleRecommendation.rating}
          </span>
          <span
            className={clsx(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
              PRIORITY_BADGE_CLASSES[moduleRecommendation.priority]
            )}
          >
            {moduleRecommendation.priority} priority
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600">{moduleRecommendation.summary}</p>

      <div className="mt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Recommended Actions
        </span>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {moduleRecommendation.recommendations.map((recommendation) => (
            <li key={recommendation}>{recommendation}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Expected Business Benefits
        </span>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {moduleRecommendation.expectedBenefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface SubmissionStatusBannerProps {
  status: SubmissionStatus;
  assessmentNumber: string | null;
  errorMessage: string | null;
  customerEmail: string;
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
  customerEmail,
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
                🎉 Your Inventory Health Report is Ready!
              </h2>
              <p className="mt-2 text-sm text-emerald-800">
                Your assessment has been completed successfully.
              </p>
              {customerEmail ? (
                <p className="mt-2 text-sm text-emerald-800">
                  A copy of your report has been emailed to{' '}
                  <span className="font-semibold">{customerEmail}</span>.
                </p>
              ) : null}
              <p className="mt-2 text-sm text-emerald-700">
                Please check your Inbox. If you don&apos;t receive it within a minute, please check your
                Spam/Junk folder.
              </p>

              {customerEmail ? (
                <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  Report emailed successfully to: <span className="font-semibold">{customerEmail}</span>
                </div>
              ) : null}
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
 */
export function ResultsView() {
  useSeo({
    title: `Your Assessment Results | ${COMPANY_NAME}`,
    description: `Your personalized ${COMPANY_NAME} Inventory Health Assessment results — module-by-module scores, health rating, and tailored recommendations.`,
    path: ROUTES.results,
    noindex: true,
  });

  const location = useLocation();
  const state = location.state as ResultsLocationState | null;
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('saving');
  const [assessmentNumber, setAssessmentNumber] = useState<string | null>(null);
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | null>(null);

  const runSubmission = useCallback(async () => {
    if (!state) return;

    // Assessment was already saved for this exact "Finish" submission —
    // e.g. the results page was refreshed. Show the prior result instead
    // of submitting again (see AssessmentQuestionsView, which mints one
    // submissionId per Finish click).
    const cachedAssessmentNumber = sessionStorage.getItem(submissionStorageKey(state.submissionId));
    if (cachedAssessmentNumber) {
      setAssessmentNumber(cachedAssessmentNumber);
      setSubmissionStatus('success');
      return;
    }

    setSubmissionStatus('saving');
    setSubmissionErrorMessage(null);
    try {
      const payload = buildAssessmentPayload(state.companyInfo, state.scoringResult, state.answers);
      const result = await submitAssessment(payload);
      sessionStorage.setItem(submissionStorageKey(state.submissionId), result.assessmentNumber);
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
  // guard fired two POSTs (and two report emails) for one Finish click. The
  // Retry button below calls runSubmission() directly and is unaffected.
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

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(false);
    try {
      const { downloadPdfReport } = await import('./pdf/pdfGenerator');
      await downloadPdfReport({
        companyInfo,
        scoringResult,
        recommendationResult,
        generatedAt: new Date(),
        assessmentNumber: assessmentNumber ?? undefined,
      });
    } catch {
      setDownloadError(true);
    } finally {
      setIsDownloading(false);
    }
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
          customerEmail={companyInfo.email}
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

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Module-Wise Breakdown
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {scoringResult.moduleScores.map((moduleScore) => (
              <ModuleScoreCard key={moduleScore.moduleId} moduleScore={moduleScore} />
            ))}
          </div>
        </section>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Strongest Modules
            </h2>
            <div className="mt-4 space-y-2">
              {scoringResult.strengthModules.length > 0 ? (
                scoringResult.strengthModules.map((moduleScore) => (
                  <div
                    key={moduleScore.moduleId}
                    className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm"
                  >
                    <span className="font-medium text-emerald-900">{moduleScore.moduleTitle}</span>
                    <span className="text-emerald-700">{moduleScore.percentage}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No modules reached the &ldquo;Good&rdquo; threshold yet.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Weakest Modules
            </h2>
            <div className="mt-4 space-y-2">
              {scoringResult.weakModules.length > 0 ? (
                scoringResult.weakModules.map((moduleScore) => (
                  <div
                    key={moduleScore.moduleId}
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm"
                  >
                    <span className="font-medium text-red-900">{moduleScore.moduleTitle}</span>
                    <span className="text-red-700">{moduleScore.percentage}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No modules fell below the &ldquo;Needs Improvement&rdquo; threshold — great job.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recommendations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ordered by priority — highest-priority modules appear first.
          </p>
          <div className="mt-4 space-y-4">
            {recommendationResult.moduleRecommendations.map((moduleRecommendation) => (
              <ModuleRecommendationCard
                key={moduleRecommendation.moduleId}
                moduleRecommendation={moduleRecommendation}
              />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">What&apos;s Next?</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              Download your detailed PDF report.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              Check your email for a copy of the report.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              Book an {CONSULTATION.serviceName} with Nitin Anand Consulting.
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="primary"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto"
            >
              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isDownloading ? 'Generating PDF…' : '⬇ Download Full PDF Report'}
            </Button>
            <a
              href={buildConsultationWhatsAppUrl(assessmentNumber ?? undefined)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-brand bg-white px-5 py-2.5 text-sm font-medium text-brand transition-colors hover:border-accent hover:text-accent-dark sm:w-auto"
            >
              📅 {CONSULTATION.ctaLabel}
            </a>
            <Link to={ROUTES.landing} className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                🏠 Return to Home
              </Button>
            </Link>
          </div>

          {downloadError ? (
            <p className="mt-3 text-sm text-red-600">
              Something went wrong generating your PDF. Please try again.
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
