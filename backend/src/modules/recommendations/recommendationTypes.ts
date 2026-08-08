import type { HealthRating } from '../assessment/assessment.types';

/**
 * Business urgency of acting on a module's recommendations — derived
 * from the module's stored HealthRating, never set per-module by hand
 * (see PRIORITY_BY_RATING in recommendationEngine.ts).
 */
export type PriorityLevel = 'High' | 'Medium' | 'Low' | 'Maintain';

/** Rule-based recommendation content for one module at one HealthRating tier. */
export interface RecommendationTierContent {
  summary: string;
  /** One sentence naming the concrete business consequence of this module sitting at this rating — used directly in report tables/paragraphs, never fabricated at render time. */
  businessImpact: string;
  recommendations: string[];
  expectedBenefits: string[];
}

/** A module's recommendation content across all four HealthRating tiers. */
export type ModuleRecommendationConfig = Record<HealthRating, RecommendationTierContent>;

/** The fully-resolved recommendation block for one scored module. */
export interface ModuleRecommendation {
  moduleId: string;
  moduleName: string;
  percentage: number;
  rating: HealthRating;
  priority: PriorityLevel;
  summary: string;
  businessImpact: string;
  recommendations: string[];
  expectedBenefits: string[];
}

export interface RecommendationResult {
  overallSummary: string;
  /** Sorted weakest module first — highest priority action first. */
  moduleRecommendations: ModuleRecommendation[];
}
