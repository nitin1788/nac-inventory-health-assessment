import { isSupabaseConfigured } from '../../database/supabaseClient';
import { AppError } from '../../utils/AppError';
import { generateAssessmentReportPdf, type GeneratedReportPdf } from '../pdf/pdf.service';
import { createAssessment, findAssessmentById } from './assessment.repository';
import type { AssessmentDetail, CreateAssessmentInput, CreateAssessmentResult } from './assessment.types';

function ensureSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw AppError.serviceUnavailable(
      'Assessment storage is not configured yet. Please try again later.'
    );
  }
}

export async function submitAssessment(input: CreateAssessmentInput): Promise<CreateAssessmentResult> {
  ensureSupabaseConfigured();
  return createAssessment(input);
}

export async function getAssessmentById(id: string): Promise<AssessmentDetail> {
  ensureSupabaseConfigured();

  const assessment = await findAssessmentById(id);
  if (!assessment) {
    throw AppError.notFound('Assessment not found.');
  }

  return assessment;
}

export async function getAssessmentReportPdf(id: string): Promise<GeneratedReportPdf> {
  const assessment = await getAssessmentById(id);
  return generateAssessmentReportPdf(assessment);
}
