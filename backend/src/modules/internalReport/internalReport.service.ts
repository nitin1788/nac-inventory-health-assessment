import { createElement as h } from 'react';
import { Document, renderToBuffer } from '@react-pdf/renderer';
import { COMPANY_NAME } from '../../config/constants';
import { logger } from '../../utils/logger';
import type { AssessmentDetail } from '../assessment/assessment.types';
import type { ReportTier } from '../payment/payment.types';
import type { GeneratedReportPdf } from '../pdf/pdf.service';
import { buildInternalReportContent } from './internalReportContent';
import { INTERNAL_REPORT_TIER_SECTIONS } from './internalReportSections.config';

function slugifyCompanyName(companyName: string): string {
  const slug = companyName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'company';
}

/**
 * Renders the NAC-internal consulting report, server-side — the counterpart
 * to pdf.service.ts's generateAssessmentReportPdf(), but a completely
 * separate document tree (internalReportSections.ts / .config.ts), never
 * wired into the customer-facing report, its download route, or the
 * customer email. Only ever attached to the internal email sent to
 * NAC_LEAD_ALERT_EMAIL (see email.service.ts's sendInternalConsultingReportEmail).
 *
 * `tier` mirrors the customer's purchased tier ('summary' = ₹99,
 * 'full' = ₹299) purely to pick a Lead Brief vs. Consulting Dossier
 * depth — it never affects, and is never affected by, the customer's
 * own PDF generation.
 */
export async function generateInternalConsultingReportPdf(
  assessment: AssessmentDetail,
  tier: ReportTier
): Promise<GeneratedReportPdf> {
  const startedAt = Date.now();

  const content = buildInternalReportContent(assessment);
  const sections = INTERNAL_REPORT_TIER_SECTIONS[tier];
  const pages = sections.map((buildSection) => buildSection(assessment, content));

  const documentTitle = `INTERNAL — ${assessment.company.companyName} — NAC Consulting Report`;

  const document = h(
    Document,
    {
      title: documentTitle,
      author: COMPANY_NAME,
    },
    ...pages
  );

  const buffer = await renderToBuffer(document);
  const filename = `nac-internal-consulting-report-${tier}-${slugifyCompanyName(assessment.company.companyName)}.pdf`;

  logger.info(
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      companyName: assessment.company.companyName,
      tier,
      pageCount: pages.length,
      msToRender: Date.now() - startedAt,
    },
    'Internal consulting report PDF generated.'
  );

  return { buffer, filename };
}
