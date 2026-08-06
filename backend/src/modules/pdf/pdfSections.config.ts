import type { ReportTier } from '../payment/payment.types';
import type { SectionBuilder } from './pdfSections';
import {
  actionPlan30DaySection,
  actionPlan60DaySection,
  actionPlan90DaySection,
  businessImpactSection,
  conclusionSection,
  coverPageSection,
  executiveSummarySection,
  fullCoverPageSection,
  moduleDetailedAnalysisSection,
  moduleScoresSection,
  nextStepsSection,
  overallScoreSection,
  priorityMatrixSection,
  questionInsightsSection,
  rootCauseAnalysisSection,
  top5FindingsSection,
  top5RecommendationsSection,
} from './pdfSections';

/**
 * The ONLY place that declares which sections make up which report
 * tier, and in what order. Every entry here is a section builder
 * already defined once in pdfSections.ts — this file contains no
 * rendering logic of its own, only the list. Adding a future third
 * tier (or reordering an existing one) means editing this file alone;
 * it never means writing new page-rendering code.
 */

const SUMMARY_SECTIONS: SectionBuilder[] = [
  coverPageSection,
  overallScoreSection,
  moduleScoresSection,
  top5FindingsSection,
  top5RecommendationsSection,
  nextStepsSection,
];

const FULL_SECTIONS: SectionBuilder[] = [
  fullCoverPageSection,
  executiveSummarySection,
  overallScoreSection,
  moduleScoresSection,
  top5FindingsSection,
  top5RecommendationsSection,
  rootCauseAnalysisSection,
  moduleDetailedAnalysisSection,
  questionInsightsSection,
  businessImpactSection,
  priorityMatrixSection,
  actionPlan30DaySection,
  actionPlan60DaySection,
  actionPlan90DaySection,
  conclusionSection,
];

export const REPORT_TIER_SECTIONS: Record<ReportTier, SectionBuilder[]> = {
  summary: SUMMARY_SECTIONS,
  full: FULL_SECTIONS,
};
