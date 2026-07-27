import type { HealthRating, ModuleScore, ScoringResult } from '../scoring/scoreTypes';
import { getHealthRating } from '../scoring/scoreHelpers';
import { DEFAULT_MODULE_RECOMMENDATIONS, OVERALL_SUMMARIES, RECOMMENDATION_DATA } from './recommendationData';
import type { ModuleRecommendation, PriorityLevel, RecommendationResult } from './recommendationTypes';

/**
 * Business urgency by HealthRating band — a rule, not a per-module
 * choice, so priority always tracks the score a module actually got.
 */
const PRIORITY_BY_RATING: Record<HealthRating, PriorityLevel> = {
  Critical: 'High',
  'Needs Improvement': 'Medium',
  Good: 'Low',
  Excellent: 'Maintain',
};

function buildModuleRecommendation(moduleScore: ModuleScore): ModuleRecommendation {
  const rating = getHealthRating(moduleScore.percentage);
  const config = RECOMMENDATION_DATA[moduleScore.moduleId] ?? DEFAULT_MODULE_RECOMMENDATIONS;
  const tierContent = config[rating];

  return {
    moduleId: moduleScore.moduleId,
    moduleTitle: moduleScore.moduleTitle,
    percentage: moduleScore.percentage,
    rating,
    priority: PRIORITY_BY_RATING[rating],
    summary: tierContent.summary,
    recommendations: tierContent.recommendations,
    expectedBenefits: tierContent.expectedBenefits,
  };
}

/**
 * Builds the full recommendation set from an already-computed scoring
 * result. Purely rule-based — every recommendation, priority, and
 * summary is looked up from static data keyed by module ID and
 * HealthRating band; nothing here is generated or inferred at
 * runtime. No question or module ID is hardcoded, so this keeps
 * working unchanged if the question bank's module list changes
 * (falling back to DEFAULT_MODULE_RECOMMENDATIONS for any module
 * without dedicated copy).
 */
export function generateRecommendations(scoringResult: ScoringResult): RecommendationResult {
  const moduleRecommendations = scoringResult.moduleScores
    .map(buildModuleRecommendation)
    // Weakest (highest-priority) module first, so the most actionable
    // recommendations surface at the top of the Results page.
    .sort((a, b) => a.percentage - b.percentage);

  return {
    overallSummary: OVERALL_SUMMARIES[scoringResult.overallRating],
    moduleRecommendations,
  };
}
