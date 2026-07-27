import { pdf } from '@react-pdf/renderer';
import { buildReportDocument } from './pdfTemplates';
import type { PdfReportData } from './pdfTypes';

function slugifyCompanyName(companyName: string): string {
  const slug = companyName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'company';
}

/**
 * Renders the report entirely in the browser (no server round-trip)
 * and triggers a native download via a temporary object URL. Mirrors
 * the pattern used by every "download this as a file" flow — create
 * an anchor, click it, then release the blob URL.
 */
export async function downloadPdfReport(data: PdfReportData): Promise<void> {
  const blob = await pdf(buildReportDocument(data)).toBlob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `nac-inventory-health-assessment-${slugifyCompanyName(data.companyInfo.companyName)}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
