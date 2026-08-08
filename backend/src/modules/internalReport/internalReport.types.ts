import type { HealthRating } from '../assessment/assessment.types';
import type { PriorityLevel } from '../recommendations/recommendationTypes';
import type { ReportContent } from '../pdf/pdfReportContent';

/**
 * One module's findings, restructured for a live consulting
 * conversation rather than customer-facing disclosure — the internal
 * mirror of ModuleRecommendation, with fields the customer report
 * deliberately never shows (consultant questions, service opportunity).
 * Every field here is either copied from already-computed, real-data
 * ReportContent, or is internal-only editorial content (questions,
 * service mapping) — never a fabricated fact about the customer.
 */
export interface ProblemEntry {
  moduleId: string;
  moduleName: string;
  percentage: number;
  rating: HealthRating;
  priority: PriorityLevel;
  problemIdentified: string;
  evidence: string;
  businessImpact: string;
  likelyRootCause: string;
  recommendedSolution: string;
  consultantQuestions: string[];
  suggestedAction: string;
  nacServiceOpportunity: string;
}

export interface InternalReportContent {
  /** The same computed data the customer report reads from — reused, not recomputed. */
  reportContent: ReportContent;
  /** Every module, weakest-first — the full problem register (Dossier tier). */
  problemRegister: ProblemEntry[];
  /** The 5 weakest modules — used by the condensed Lead Brief tier. */
  topProblems: ProblemEntry[];
}
