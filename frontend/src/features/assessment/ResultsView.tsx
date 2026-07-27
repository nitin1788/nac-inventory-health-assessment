import { Link, Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { Button } from '@/shared/components/Button';
import { clsx } from '@/shared/utils/clsx';
import { AssessmentHeader } from './components/AssessmentHeader';
import type { CompanyProfile } from './questions/companyProfile';
import { getHealthRating } from './scoring/scoreHelpers';
import type { HealthRating, ModuleScore, ScoringResult } from './scoring/scoreTypes';

export interface ResultsLocationState {
  companyInfo: CompanyProfile;
  scoringResult: ScoringResult;
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

/**
 * Reads the scoring result handed off by the assessment flow's final
 * "Finish" action (see AssessmentQuestionsView) — there is no
 * standalone results-fetch step, since scoring is a pure client-side
 * calculation in this milestone. Landing here directly (no state)
 * means the assessment was never completed, so redirect to start.
 */
export function ResultsView() {
  const location = useLocation();
  const state = location.state as ResultsLocationState | null;

  if (!state) {
    return <Navigate to={ROUTES.assessmentStart} replace />;
  }

  const { companyInfo, scoringResult } = state;

  return (
    <div className="min-h-screen bg-slate-50">
      <AssessmentHeader />
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {companyInfo.companyName}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Your Inventory Health Results
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Based on your answers across {scoringResult.moduleScores.length} assessment modules.
        </p>

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

        <div className="mt-12 flex justify-center">
          <Link to={ROUTES.landing}>
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
