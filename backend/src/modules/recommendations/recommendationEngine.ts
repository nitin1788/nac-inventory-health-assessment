import type { HealthRating, ModuleScoreInput } from '../assessment/assessment.types';
import { DEFAULT_MODULE_RECOMMENDATIONS, OVERALL_SUMMARIES, RECOMMENDATION_DATA } from './recommendationData';
import type { ModuleRecommendation, PriorityLevel, RecommendationResult } from './recommendationTypes';

/**
 * Business urgency by HealthRating band — a rule, not a per-module
 * choice, so priority always tracks the rating a module actually got.
 */
const PRIORITY_BY_RATING: Record<HealthRating, PriorityLevel> = {
  Critical: 'High',
  'Needs Improvement': 'Medium',
  Good: 'Low',
  Excellent: 'Maintain',
};

function buildModuleRecommendation(moduleScore: ModuleScoreInput): ModuleRecommendation {
  const config = RECOMMENDATION_DATA[moduleScore.moduleId] ?? DEFAULT_MODULE_RECOMMENDATIONS;
  const tierContent = config[moduleScore.rating];

  return {
    moduleId: moduleScore.moduleId,
    moduleName: moduleScore.moduleName,
    percentage: moduleScore.percentage,
    rating: moduleScore.rating,
    priority: PRIORITY_BY_RATING[moduleScore.rating],
    summary: tierContent.summary,
    recommendations: tierContent.recommendations,
    expectedBenefits: tierContent.expectedBenefits,
  };
}

/**
 * Builds the full recommendation set for the PDF report from module
 * scores already computed and stored at submission time — this never
 * recalculates a rating, only looks up rule-based copy for the rating
 * each module already has. No question or module ID is hardcoded, so
 * this keeps working unchanged if the question bank's module list
 * changes (falling back to DEFAULT_MODULE_RECOMMENDATIONS for any
 * module without dedicated copy).
 */
export function generateRecommendations(
  moduleScores: ModuleScoreInput[],
  overallRating: HealthRating
): RecommendationResult {
  const moduleRecommendations = [...moduleScores]
    .map(buildModuleRecommendation)
    // Weakest (highest-priority) module first, so the most actionable
    // recommendations surface at the top of the report.
    .sort((a, b) => a.percentage - b.percentage);

  return {
    overallSummary: OVERALL_SUMMARIES[overallRating],
    moduleRecommendations,
  };
}
