import { getSupabaseClient } from '../../database/supabaseClient';
import { AppError } from '../../utils/AppError';
import type { HealthRating } from './assessment.types';
import type { AssessmentDetail, CreateAssessmentInput, CreateAssessmentResult } from './assessment.types';

/**
 * The only file in the assessment module allowed to talk to Supabase
 * directly (see docs/ARCHITECTURE.md's repository-pattern rule).
 * Services call these functions; they never import supabaseClient.
 */

interface SubmitAssessmentRpcResult {
  id: string;
  assessmentNumber: string;
}

interface AssessmentRow {
  id: string;
  assessment_number: string;
  overall_score: number;
  overall_percentage: number;
  health_rating: HealthRating;
  created_at: string;
  company_id: string;
}

interface CompanyRow {
  id: string;
  company_name: string;
  contact_person: string;
  designation: string;
  mobile: string;
  email: string;
  business_type: string;
  industry: string;
  employee_count: string;
  inventory_locations: string;
  active_skus: string;
  created_at: string;
}

interface ModuleScoreRow {
  id: string;
  module_id: string;
  module_name: string;
  score: number;
  max_score: number;
  percentage: number;
  rating: HealthRating;
}

interface AnswerRow {
  id: string;
  question_id: string;
  selected_option: string;
  selected_score: number | null;
}

/**
 * Persists a completed assessment via the submit_assessment() Postgres
 * function (see backend/src/database/migrations/0007_*.sql), which
 * inserts the company, assessment, answers, and module scores inside
 * a single transaction — a failure at any step rolls back everything.
 */
export async function createAssessment(input: CreateAssessmentInput): Promise<CreateAssessmentResult> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc('submit_assessment', {
    p_company: input.company,
    p_overall_score: input.overallScore,
    p_overall_percentage: input.overallPercentage,
    p_health_rating: input.healthRating,
    p_answers: input.answers,
    p_module_scores: input.moduleScores,
  });

  if (error) {
    throw AppError.internal(`Failed to save assessment: ${error.message}`);
  }

  const result = data as SubmitAssessmentRpcResult;
  return { id: result.id, assessmentNumber: result.assessmentNumber };
}

export async function findAssessmentById(id: string): Promise<AssessmentDetail | null> {
  const supabase = getSupabaseClient();

  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('id, assessment_number, overall_score, overall_percentage, health_rating, created_at, company_id')
    .eq('id', id)
    .maybeSingle<AssessmentRow>();

  if (assessmentError) {
    throw AppError.internal(`Failed to load assessment: ${assessmentError.message}`);
  }
  if (!assessment) return null;

  const [companyResult, moduleScoresResult, answersResult] = await Promise.all([
    supabase.from('companies').select('*').eq('id', assessment.company_id).maybeSingle<CompanyRow>(),
    supabase.from('module_scores').select('*').eq('assessment_id', id).returns<ModuleScoreRow[]>(),
    supabase.from('assessment_answers').select('*').eq('assessment_id', id).returns<AnswerRow[]>(),
  ]);

  if (companyResult.error) {
    throw AppError.internal(`Failed to load company: ${companyResult.error.message}`);
  }
  if (moduleScoresResult.error) {
    throw AppError.internal(`Failed to load module scores: ${moduleScoresResult.error.message}`);
  }
  if (answersResult.error) {
    throw AppError.internal(`Failed to load answers: ${answersResult.error.message}`);
  }
  if (!companyResult.data) {
    throw AppError.internal('Assessment is missing its company record.');
  }

  const company = companyResult.data;

  return {
    id: assessment.id,
    assessmentNumber: assessment.assessment_number,
    overallScore: assessment.overall_score,
    overallPercentage: Number(assessment.overall_percentage),
    healthRating: assessment.health_rating,
    createdAt: assessment.created_at,
    company: {
      id: company.id,
      companyName: company.company_name,
      contactPerson: company.contact_person,
      designation: company.designation,
      mobile: company.mobile,
      email: company.email,
      businessType: company.business_type,
      industry: company.industry,
      employeeCount: company.employee_count,
      inventoryLocations: company.inventory_locations,
      activeSkus: company.active_skus,
      createdAt: company.created_at,
    },
    moduleScores: (moduleScoresResult.data ?? []).map((row) => ({
      id: row.id,
      moduleId: row.module_id,
      moduleName: row.module_name,
      score: row.score,
      maxScore: row.max_score,
      percentage: Number(row.percentage),
      rating: row.rating,
    })),
    answers: (answersResult.data ?? []).map((row) => ({
      id: row.id,
      questionId: row.question_id,
      selectedOption: row.selected_option,
      selectedScore: row.selected_score,
    })),
  };
}
