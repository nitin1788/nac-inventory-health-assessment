import type { HealthRating } from '../scoring/scoreTypes';

/**
 * Wire contract for POST /api/v1/assessments — mirrored (not shared)
 * against backend/src/modules/assessment/assessment.types.ts, per the
 * project's docs/API.md convention.
 */

export interface AssessmentCompanyPayload {
  companyName: string;
  contactPerson: string;
  designation: string;
  mobile: string;
  email: string;
  businessType: string;
  industry: string;
  employeeCount: string;
  inventoryLocations: string;
  activeSkus: string;
}

export interface AssessmentAnswerPayload {
  questionId: string;
  selectedOption: string;
  selectedScore: number | null;
}

export interface AssessmentModuleScorePayload {
  moduleId: string;
  moduleName: string;
  score: number;
  maxScore: number;
  percentage: number;
  rating: HealthRating;
}

export interface AssessmentSubmissionPayload {
  company: AssessmentCompanyPayload;
  overallScore: number;
  overallPercentage: number;
  healthRating: HealthRating;
  answers: AssessmentAnswerPayload[];
  moduleScores: AssessmentModuleScorePayload[];
}

export interface AssessmentSubmissionResult {
  id: string;
  assessmentNumber: string;
}
