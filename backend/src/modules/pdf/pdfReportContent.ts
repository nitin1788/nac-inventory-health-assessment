import type { AssessmentDetail, HealthRating } from '../assessment/assessment.types';
import { generateRecommendations } from '../recommendations/recommendationEngine';
import type { ModuleRecommendation, PriorityLevel } from '../recommendations/recommendationTypes';

export type RootCauseCategory = 'People' | 'Process' | 'Systems' | 'Data & Visibility' | 'Governance';

/**
 * Which root-cause category each module's weaknesses are most commonly
 * traced to — used only by the Full tier's Fishbone diagram to group
 * weak modules under a cause, not to relitigate the module's rating.
 * Keyed by the question bank's module `id` (see RECOMMENDATION_DATA in
 * recommendationData.ts), with a Process fallback for any module ID
 * without dedicated mapping, since "unclear process" is the safest
 * generic root cause bucket.
 */
export const MODULE_ROOT_CAUSE_CATEGORY: Record<string, RootCauseCategory> = {
  'inventory-planning': 'Process',
  'inventory-control': 'Process',
  'inventory-accuracy': 'Data & Visibility',
  'warehouse-operations': 'Process',
  procurement: 'People',
  technology: 'Systems',
  'inventory-kpis': 'Data & Visibility',
  'risk-compliance': 'Governance',
};

const DEFAULT_ROOT_CAUSE_CATEGORY: RootCauseCategory = 'Process';

export function rootCauseCategoryFor(moduleId: string): RootCauseCategory {
  return MODULE_ROOT_CAUSE_CATEGORY[moduleId] ?? DEFAULT_ROOT_CAUSE_CATEGORY;
}

export interface ReportContent {
  overallMaxScore: number;
  overallSummary: string;
  /** Every module, weakest-first — the complete result, always. */
  moduleRecommendations: ModuleRecommendation[];
  /** The 5 weakest modules — always ≤5, never fewer than available. */
  weakestFive: ModuleRecommendation[];
  /** Every module bucketed by its business-urgency priority. */
  byPriority: Record<PriorityLevel, ModuleRecommendation[]>;
  /** Count of modules at each HealthRating — feeds KPI cards / dashboard stats. */
  ratingCounts: Record<HealthRating, number>;
  /** Modules whose priority is High or Medium — the "needs attention" count. */
  attentionCount: number;
  /** Weakest-rated module, if any — the single highest-impact opportunity. */
  weakestModule: ModuleRecommendation | undefined;
  /** Strongest-rated module, if any — worth naming as a genuine strength. */
  strongestModule: ModuleRecommendation | undefined;
}

/**
 * Computes everything any report section could need, exactly once,
 * from an already-persisted AssessmentDetail. No section recomputes
 * generateRecommendations() itself or re-sorts moduleScores — every
 * section builder in pdfSections.ts reads from this single object.
 * This is what keeps tiering a pure rendering decision: the Summary
 * and Full tiers receive the identical ReportContent, they simply read
 * different slices of it.
 */
export function buildReportContent(assessment: AssessmentDetail): ReportContent {
  const overallMaxScore = assessment.moduleScores.reduce((sum, moduleScore) => sum + moduleScore.maxScore, 0);
  const { overallSummary, moduleRecommendations } = generateRecommendations(
    assessment.moduleScores,
    assessment.healthRating
  );

  const weakestFive = moduleRecommendations.slice(0, 5);

  const byPriority: Record<PriorityLevel, ModuleRecommendation[]> = {
    High: moduleRecommendations.filter((recommendation) => recommendation.priority === 'High'),
    Medium: moduleRecommendations.filter((recommendation) => recommendation.priority === 'Medium'),
    Low: moduleRecommendations.filter((recommendation) => recommendation.priority === 'Low'),
    Maintain: moduleRecommendations.filter((recommendation) => recommendation.priority === 'Maintain'),
  };

  const ratingCounts: Record<HealthRating, number> = {
    Excellent: 0,
    Good: 0,
    'Needs Improvement': 0,
    Critical: 0,
  };
  for (const recommendation of moduleRecommendations) {
    ratingCounts[recommendation.rating] += 1;
  }

  const attentionCount = byPriority.High.length + byPriority.Medium.length;
  const weakestModule = moduleRecommendations[0];
  const strongestModule = moduleRecommendations[moduleRecommendations.length - 1];

  return {
    overallMaxScore,
    overallSummary,
    moduleRecommendations,
    weakestFive,
    byPriority,
    ratingCounts,
    attentionCount,
    weakestModule,
    strongestModule,
  };
}
