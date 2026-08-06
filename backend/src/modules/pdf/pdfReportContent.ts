import type { AssessmentDetail } from '../assessment/assessment.types';
import { generateRecommendations } from '../recommendations/recommendationEngine';
import type { ModuleRecommendation, PriorityLevel } from '../recommendations/recommendationTypes';

export interface ReportContent {
  overallMaxScore: number;
  overallSummary: string;
  /** Every module, weakest-first — the complete result, always. */
  moduleRecommendations: ModuleRecommendation[];
  /** The 5 weakest modules — always ≤5, never fewer than available. */
  weakestFive: ModuleRecommendation[];
  /** Every module bucketed by its business-urgency priority. */
  byPriority: Record<PriorityLevel, ModuleRecommendation[]>;
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

  return { overallMaxScore, overallSummary, moduleRecommendations, weakestFive, byPriority };
}
