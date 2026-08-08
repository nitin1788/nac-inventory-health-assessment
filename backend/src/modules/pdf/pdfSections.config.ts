import type { ReportTier } from '../payment/payment.types';
import type { SectionBuilder } from './pdfSections';
import {
  businessProfileSection,
  conclusionCtaSection,
  coverPageSection,
  detailedRecommendationsSection,
  executiveNarrativeSection,
  executiveSummarySection,
  fullConclusionCtaSection,
  fullCoverPageSection,
  fullModuleWiseAnalysisSection,
  fullRiskAnalysisSection,
  inventoryControlAnalysisSection,
  managementActionPrioritiesSection,
  moduleWiseAnalysisSection,
  overallHealthAnalysisSection,
  priorityMatrixTableSection,
  riskAnalysisSummarySection,
  rootCauseAnalysisSection,
  stockAccuracySection,
  top5FindingsSection,
  top5RecommendationsSection,
  warehouseProcessSection,
  workingCapitalRiskSection,
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
  moduleWiseAnalysisSection, // 3. Module-wise Analysis
  top5FindingsSection, // 4. Top 5 Findings
  riskAnalysisSummarySection, // 5. Risk Analysis
  top5RecommendationsSection, // 6. Top 5 Recommendations
  conclusionCtaSection, // 7. Conclusion + Consultation CTA
];

const FULL_SECTIONS: SectionBuilder[] = [
  fullCoverPageSection, // 1. Cover Page
  executiveNarrativeSection, // 2. Executive Summary
  businessProfileSection, // 3. Business & Inventory Profile
  overallHealthAnalysisSection, // 4. Overall Inventory Health Analysis
  fullModuleWiseAnalysisSection, // 5. Module-wise Analysis
  inventoryControlAnalysisSection, // 6. Inventory Control Analysis
  stockAccuracySection, // 7. Stock Accuracy & Reconciliation Analysis
  warehouseProcessSection, // 8. Warehouse / Storage Process Analysis
  workingCapitalRiskSection, // 9. Working Capital & Excess Inventory Risk
  fullRiskAnalysisSection, // 10. Risk Analysis
  rootCauseAnalysisSection, // 11. Root Cause Analysis
  priorityMatrixTableSection, // 12. Priority Matrix
  detailedRecommendationsSection, // 13. Detailed Recommendations
  managementActionPrioritiesSection, // 14. Management Action Priorities
  fullConclusionCtaSection, // 15. Conclusion + Consultation CTA
];

export const REPORT_TIER_SECTIONS: Record<ReportTier, SectionBuilder[]> = {
  summary: SUMMARY_SECTIONS,
  full: FULL_SECTIONS,
};
