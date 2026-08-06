import type { ReportTier } from '../payment/payment.types';
import type { SectionBuilder } from './pdfSections';
import {
  dummyActionPlanSection,
  dummyExecutiveSummarySection,
  dummyFullClosingSection,
  dummyFullCoverPageSection,
  dummyPriorityMatrixSection,
  dummyProfessionalRecommendationsSection,
  dummyRootCauseAnalysisSection,
  dummySummaryClosingSection,
  dummySummaryCoverPageSection,
  dummyTop5FindingsSection,
  dummyTop5RecommendationsSection,
  moduleScoresSection,
  overallScoreSection,
} from './pdfSections.dummy';

/**
 * TEMPORARY — mirrors pdfSections.config.ts's shape exactly, but
 * points at the dummy placeholder sections instead of real content.
 * Delete this file once the real config (pdfSections.config.ts) is
 * wired back in via pdf.service.ts's DUMMY_MODE flag.
 */

const DUMMY_SUMMARY_SECTIONS: SectionBuilder[] = [
  dummySummaryCoverPageSection,
  overallScoreSection,
  moduleScoresSection,
  dummyTop5FindingsSection,
  dummyTop5RecommendationsSection,
  dummySummaryClosingSection,
];

const DUMMY_FULL_SECTIONS: SectionBuilder[] = [
  dummyFullCoverPageSection,
  dummyExecutiveSummarySection,
  overallScoreSection,
  moduleScoresSection,
  dummyRootCauseAnalysisSection,
  dummyPriorityMatrixSection,
  dummyActionPlanSection,
  dummyProfessionalRecommendationsSection,
  dummyFullClosingSection,
];

export const DUMMY_REPORT_TIER_SECTIONS: Record<ReportTier, SectionBuilder[]> = {
  summary: DUMMY_SUMMARY_SECTIONS,
  full: DUMMY_FULL_SECTIONS,
};

export const DUMMY_REPORT_TITLES: Record<ReportTier, string> = {
  summary: 'NAC Report Summary',
  full: 'NAC Professional Inventory Report',
};
