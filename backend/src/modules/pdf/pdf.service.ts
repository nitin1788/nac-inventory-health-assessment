import { createElement as h } from 'react';
import { Document, Font, renderToBuffer } from '@react-pdf/renderer';
import { COMPANY_NAME } from '../../config/constants';
import { logger } from '../../utils/logger';
import type { AssessmentDetail } from '../assessment/assessment.types';
import type { ReportTier } from '../payment/payment.types';
import { buildReportContent } from './pdfReportContent';
import { REPORT_TIER_SECTIONS } from './pdfSections.config';

/**
 * Without this, @react-pdf/renderer's default hyphenation splits any word
 * that doesn't fit a line with an inserted "-" (e.g. "Inventory Plan-
 * ning" on a narrow KPI card) — acceptable for dense body paragraphs, but
 * ugly on short bold labels like module names. Wrapping whole words onto
 * the next line instead reads as normal, professional card layout.
 */
Font.registerHyphenationCallback((word) => [word]);

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
 * (see pdfSections.config.ts) — this function itself has no knowledge
 * of what's in either tier, only how to turn "a list of sections" into
 * "a rendered PDF."
 */
export async function generateAssessmentReportPdf(
  assessment: AssessmentDetail,
  tier: ReportTier
): Promise<GeneratedReportPdf> {
  const startedAt = Date.now();

  const content = buildReportContent(assessment);
  const sections = REPORT_TIER_SECTIONS[tier];
  const pages = sections.map((buildSection) => buildSection(assessment, content));

  const documentTitle = `${assessment.company.companyName} — Inventory Health Assessment Report`;

  const document = h(
    Document,
    {
      title: documentTitle,
      author: COMPANY_NAME,
    },
    ...pages
  );

  const buffer = await renderToBuffer(document);
  const filename = `nac-inventory-health-assessment-${tier}-${slugifyCompanyName(assessment.company.companyName)}.pdf`;

  logger.info(
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      companyName: assessment.company.companyName,
      tier,
      pageCount: pages.length,
      msToRender: Date.now() - startedAt,
    },
    'PDF generated.'
  );

  return { buffer, filename };
}
