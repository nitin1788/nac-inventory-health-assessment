export type HealthRating = 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical';

export interface ModuleScore {
  moduleId: string;
  moduleTitle: string;
  score: number;
  maxScore: number;
  /** 0-100, one decimal place. */
  percentage: number;
}

export interface ScoringResult {
  /** Raw points earned across every scorable question. */
  overallScore: number;
  /** Raw points achievable across every scorable question. */
  overallMaxScore: number;
  /** 0-100, one decimal place. */
  overallPercentage: number;
  overallRating: HealthRating;
  moduleScores: ModuleScore[];
  /** Modules at or above the 'Good' threshold, highest percentage first. */
  strengthModules: ModuleScore[];
  /** Modules below the 'Needs Improvement' threshold, lowest percentage first. */
  weakModules: ModuleScore[];
}
