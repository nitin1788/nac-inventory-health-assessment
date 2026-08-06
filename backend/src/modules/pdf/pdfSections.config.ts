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
  kpiCardsSection,
  moduleChartsSection,
  moduleScoresSection,
  overallScoreSection,
  priorityMatrixSection,
  professionalTablesSection,
  progressBarsSection,
  svgInfographicsSection,
  timelineSection,
  top5FindingsSection,
  top5RecommendationsSection,
  upgradeCtaSection,
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
 * exactly 15 (a dedicated cover + 14 content sections).
 */

const SUMMARY_SECTIONS: SectionBuilder[] = [
  coverPageSection, // 1. Cover Page
  executiveSummarySection, // 2. Executive Summary
  overallScoreSection, // 3. Overall Score
  moduleScoresSection, // 4. Module-wise Scores
  top5FindingsSection, // 5. Top Findings
  top5RecommendationsSection, // 6. Top Recommendations
  upgradeCtaSection, // 7. Upgrade CTA
];

const FULL_SECTIONS: SectionBuilder[] = [
  fullCoverPageSection, // 1. Cover Page
  executiveDashboardSection, // 2. Executive Dashboard
  kpiCardsSection, // 3. KPI Cards
  healthGaugeSection, // 4. Health Gauge
  moduleChartsSection, // 5. Module Charts
  professionalTablesSection, // 6. Professional Tables
  priorityMatrixSection, // 7. Priority Matrix
  heatMapSection, // 8. Heat Map
  fishboneRootCauseSection, // 9. Fishbone Root Cause Diagram
  timelineSection, // 10. Timeline
  progressBarsSection, // 11. Progress Bars
  svgInfographicsSection, // 12. SVG Infographics
  businessImpactCardsSection, // 13. Business Impact Cards
  executiveRecommendationsSection, // 14. Executive Recommendations
  consultationCtaSection, // 15. Consultation CTA
];

export const REPORT_TIER_SECTIONS: Record<ReportTier, SectionBuilder[]> = {
  summary: SUMMARY_SECTIONS,
  full: FULL_SECTIONS,
};
