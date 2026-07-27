import { renderToBuffer } from '@react-pdf/renderer';
import type { AssessmentDetail } from '../assessment/assessment.types';
import { buildReportDocument } from './pdfTemplates';

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
 * Renders the full assessment report to a PDF buffer, server-side, via
 * @react-pdf/renderer — the architecture originally specified for this
 * milestone (see docs/PRD.md Section 8). Takes an already-persisted
 * AssessmentDetail (company + module scores + rating), so it only
 * formats data that has already been validated and stored; it never
 * recalculates a score.
 */
export async function generateAssessmentReportPdf(assessment: AssessmentDetail): Promise<GeneratedReportPdf> {
  const buffer = await renderToBuffer(buildReportDocument(assessment));
  const filename = `nac-inventory-health-assessment-${slugifyCompanyName(assessment.company.companyName)}.pdf`;

  return { buffer, filename };
}
