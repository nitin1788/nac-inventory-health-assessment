import { createElement as h } from 'react';
import { Document, renderToBuffer } from '@react-pdf/renderer';
import { COMPANY_NAME } from '../../config/constants';
import { logger } from '../../utils/logger';
import type { AssessmentDetail } from '../assessment/assessment.types';
import type { ReportTier } from '../payment/payment.types';
import { buildReportContent } from './pdfReportContent';
import { REPORT_TIER_SECTIONS } from './pdfSections.config';
import { DUMMY_REPORT_TIER_SECTIONS, DUMMY_REPORT_TITLES } from './pdfSections.dummy.config';

/**
 * TEMPORARY — end-to-end flow testing switch. When true, both tiers
 * render clearly-labeled placeholder content (pdfSections.dummy.ts)
 * instead of the real report (pdfSections.ts) — same section-registry
 * architecture either way, only which registry is active changes.
 * Flip to false (or delete this branch entirely, along with
 * pdfSections.dummy.ts / pdfSections.dummy.config.ts) once real
 * Summary/Full content is ready to ship.
 */
const DUMMY_MODE = true;

function slugifyCompanyName(companyName: string): string {
  const slug = companyName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'company';
}

export interface GeneratedReportPdf {
  buffer: Buffer;
  filename: string;
}

/**
 * Renders one tier's PDF report, server-side, via @react-pdf/renderer.
 * Takes an already-persisted AssessmentDetail (company + module scores
 * + rating), so it only formats data that has already been validated
 * and stored; it never recalculates a score.
 *
 * The document is assembled from the tier's declared section list
 * (see pdfSections.config.ts, or pdfSections.dummy.config.ts while
 * DUMMY_MODE is on) — this function itself has no knowledge of what's
 * in either tier, only how to turn "a list of sections" into "a
 * rendered PDF."
 */
export async function generateAssessmentReportPdf(
  assessment: AssessmentDetail,
  tier: ReportTier
): Promise<GeneratedReportPdf> {
  const startedAt = Date.now();

  const content = buildReportContent(assessment);
  const sections = DUMMY_MODE ? DUMMY_REPORT_TIER_SECTIONS[tier] : REPORT_TIER_SECTIONS[tier];
  const pages = sections.map((buildSection) => buildSection(assessment, content));

  const documentTitle = DUMMY_MODE
    ? `${assessment.company.companyName} — ${DUMMY_REPORT_TITLES[tier]}`
    : `${assessment.company.companyName} — Inventory Health Assessment Report`;

  const document = h(
    Document,
    {
      title: documentTitle,
      author: COMPANY_NAME,
    },
    ...pages
  );

  const buffer = await renderToBuffer(document);
  const dummySuffix = DUMMY_MODE ? '-dummy' : '';
  const filename = `nac-inventory-health-assessment-${tier}${dummySuffix}-${slugifyCompanyName(assessment.company.companyName)}.pdf`;

  logger.info(
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      companyName: assessment.company.companyName,
      tier,
      dummyMode: DUMMY_MODE,
      pageCount: pages.length,
      msToRender: Date.now() - startedAt,
    },
    'PDF generated.'
  );

  return { buffer, filename };
}
