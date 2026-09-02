import { z } from 'zod';

/**
 * The Business Health Check tool (healthcheck/index.html) is a standalone
 * static page with no shared types package (see docs/ARCHITECTURE.md on why
 * types are mirrored, not shared) — this schema is the sole source of truth
 * for what that page is allowed to send.
 *
 * pdfBase64's max length (~8,000,000 chars) bounds the decoded PDF to
 * roughly 6MB before any Buffer/Resend work happens — see
 * BUSINESS_HEALTH_CHECK_MAX_PDF_BYTES for the authoritative byte-level
 * recheck once decoded, in businessHealthCheck.service.ts.
 */
export const submitBusinessHealthCheckReportSchema = z.object({
  bizName: z.string().trim().min(1).max(200),
  ownerName: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(30),
  email: z.string().trim().email().max(200),
  area: z.string().trim().min(1).max(200),
  overallScore: z.number().int().min(0).max(100),
  inventoryScore: z.number().int().min(0).max(100),
  operationsScore: z.number().int().min(0).max(100),
  marketingScore: z.number().int().min(0).max(100),
  pdfBase64: z
    .string()
    .startsWith('data:application/pdf;base64,', { message: 'pdfBase64 must be a PDF data URL' })
    .max(8_000_000, { message: 'PDF is too large' }),
});

export type SubmitBusinessHealthCheckReportInput = z.infer<typeof submitBusinessHealthCheckReportSchema>;
