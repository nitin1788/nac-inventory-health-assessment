import type { ReportTier } from '../payment/payment.types';
import type { SectionBuilder } from './pdfSections';
import {
  businessImpactCardsSection,
  consultationCtaSection,
  coverPageSection,
  executiveDashboardSection,
  executiveRecommendationsSection,
  executiveSummarySection,
  fishboneRootCauseSection,
  fullCoverPageSection,
  healthGaugeSection,
  heatMapSection,
  moduleChartsSection,
  moduleScoresSection,
  overallScoreSection,
  priorityMatrixSection,
  professionalTablesSection,
  progressBarsSection,
  riskAnalysisSection,
  roadmapSection,
  timelineSection,
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
 *
 * Page counts are a hard business requirement: Summary is exactly 7
 * pages (a dedicated branded cover + 6 content sections), Full is
 * exactly 15 (a dedicated cover + 14 content sections). The two
 * section lists share no page-rendering code beyond generic building
 * blocks (tables, footers) — the Summary report can never contain a
 * Professional-tier section, and vice versa.
 */

const SUMMARY_SECTIONS: SectionBuilder[] = [
  coverPageSection, // 1. Cover Page
  executiveSummarySection, // 2. Executive Summary
  overallScoreSection, // 3. Overall Score
  moduleScoresSection, // 4. Module Scores
  top5FindingsSection, // 5. Top 5 Findings
  top5RecommendationsSection, // 6. Top 5 Recommendations
  consultationCtaSection, // 7. Consultation CTA
];

const FULL_SECTIONS: SectionBuilder[] = [
  fullCoverPageSection, // 1. Cover Page
  executiveDashboardSection, // 2. Executive Summary
  healthGaugeSection, // 3. Business Health Score
  professionalTablesSection, // 4. Module-wise Analysis
  fishboneRootCauseSection, // 5. Root Cause Analysis
  riskAnalysisSection, // 6. Risk Analysis
  priorityMatrixSection, // 7. Priority Matrix
  moduleChartsSection, // 8. Charts
  progressBarsSection, // 9. Graphs
  heatMapSection, // 10. Heat Maps
  businessImpactCardsSection, // 11. Business Impact
  timelineSection, // 12. Timeline
  roadmapSection, // 13. 30-60-90 Day Roadmap
  executiveRecommendationsSection, // 14. Professional Recommendations
  consultationCtaSection, // 15. Consultation CTA
];

export const REPORT_TIER_SECTIONS: Record<ReportTier, SectionBuilder[]> = {
  summary: SUMMARY_SECTIONS,
  full: FULL_SECTIONS,
};
