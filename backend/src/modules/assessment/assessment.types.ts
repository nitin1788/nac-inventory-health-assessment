import type { CompanyInput, CompanyRecord } from '../company/company.types';

/**
 * Domain types for the assessment module. Mirrors the `assessments`,
 * `assessment_answers`, and `module_scores` tables (see
 * backend/src/database/migrations/) plus the wire contract documented
 * in docs/API.md. Field names are camelCase (the HTTP/JSON contract);
 * repositories translate to/from the snake_case Postgres columns.
 */

export const HEALTH_RATINGS = ['Excellent', 'Good', 'Needs Improvement', 'Critical'] as const;
export type HealthRating = (typeof HEALTH_RATINGS)[number];

export interface AnswerInput {
  questionId: string;
  selectedOption: string;
  selectedScore: number | null;
}

export interface ModuleScoreInput {
  moduleId: string;
  moduleName: string;
  score: number;
  maxScore: number;
  percentage: number;
  rating: HealthRating;
}

export interface CreateAssessmentInput {
  company: CompanyInput;
  overallScore: number;
  overallPercentage: number;
  healthRating: HealthRating;
  answers: AnswerInput[];
  moduleScores: ModuleScoreInput[];
}

export interface CreateAssessmentResult {
  id: string;
  assessmentNumber: string;
}

export interface AssessmentDetail {
  id: string;
  assessmentNumber: string;
  overallScore: number;
  overallPercentage: number;
  healthRating: HealthRating;
  createdAt: string;
  company: CompanyRecord;
  moduleScores: (ModuleScoreInput & { id: string })[];
  answers: (AnswerInput & { id: string })[];
}
