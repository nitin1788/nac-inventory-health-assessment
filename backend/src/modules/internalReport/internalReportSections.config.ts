import type { ReportTier } from '../payment/payment.types';
import {
  actionPlanSection,
  buildInternalCoverSection,
  businessImpactAnalysisSection,
  consultantDiscussionGuideSection,
  customerProfileSection,
  internalDetailedRecommendationsSection,
  internalPriorityMatrixSection,
  nacServiceOpportunitySection,
  overallHealthSection,
  problemRegisterBriefSection,
  problemRegisterFullSection,
  rootCauseAnalysisSection,
  type InternalSectionBuilder,
} from './internalReportSections';

/**
 * Tier -> section list for the NAC-internal consulting report, mirroring
 * pdf/pdfSections.config.ts's pattern. Unlike the customer report, no
 * fixed page count is required here — sections `wrap: true` and flow
 * across as many physical pages as their content needs.
 *
 * 'summary' (paired with the customer's ₹99 report) produces a concise
 * Lead/Consulting Brief: everything from the Problem Register (evidence,
 * cause, solution, questions, service) folded into one page per finding,
 * limited to the 5 highest-priority findings.
 *
 * 'full' (paired with the customer's ₹299 report) produces the complete
 * Professional Consulting Dossier: all 8 modules, plus the dedicated
 * Business Impact / Root Cause / Priority Matrix / Recommendations /
 * Discussion Guide / 30-60-90 Plan / Service Opportunity sections.
 */

const LEAD_BRIEF_SECTIONS: InternalSectionBuilder[] = [
  buildInternalCoverSection('NAC Internal Lead / Consulting Brief'),
  customerProfileSection,
  overallHealthSection,
  problemRegisterBriefSection,
  nacServiceOpportunitySection,
];

const CONSULTING_DOSSIER_SECTIONS: InternalSectionBuilder[] = [
  buildInternalCoverSection('NAC Professional Consulting Dossier'),
  customerProfileSection,
  overallHealthSection,
  problemRegisterFullSection,
  businessImpactAnalysisSection,
  rootCauseAnalysisSection,
  internalPriorityMatrixSection,
  internalDetailedRecommendationsSection,
  consultantDiscussionGuideSection,
  actionPlanSection,
  nacServiceOpportunitySection,
];

export const INTERNAL_REPORT_TIER_SECTIONS: Record<ReportTier, InternalSectionBuilder[]> = {
  summary: LEAD_BRIEF_SECTIONS,
  full: CONSULTING_DOSSIER_SECTIONS,
};
