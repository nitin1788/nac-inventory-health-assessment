import { QUESTION_BANK } from '../questions';
import type { CompanyProfile } from '../questions/companyProfile';
import type { AnswerMap, AnswerValue } from '../useAssessmentEngine';
import { getHealthRating, getOptionScore, isScorableQuestion } from '../scoring/scoreHelpers';
import type { ScoringResult } from '../scoring/scoreTypes';
import type {
  AssessmentAnswerPayload,
  AssessmentModuleScorePayload,
  AssessmentSubmissionPayload,
} from './submissionTypes';

function buildAnswerPayload(questionId: string, answer: AnswerValue | undefined): AssessmentAnswerPayload | null {
  if (answer === undefined) return null;

  const question = QUESTION_BANK.questions.find((candidate) => candidate.id === questionId);
  if (!question) return null;

  if (typeof answer === 'string') {
    return { questionId, selectedOption: answer, selectedScore: null };
  }

  const options = question.options ?? [];
  const selectedOption = options.find((option) => option.value === answer);
  const selectedScore =
    isScorableQuestion(question) && selectedOption ? getOptionScore(options, selectedOption) : null;

  return {
    questionId,
    selectedOption: selectedOption?.label ?? String(answer),
    selectedScore,
  };
}

function resolveBusinessType(companyInfo: CompanyProfile): string {
  if (companyInfo.businessType === 'Other') {
    return companyInfo.businessTypeOther?.trim() || 'Other';
  }
  return companyInfo.businessType;
}

/**
 * Assembles the POST /api/v1/assessments wire payload from data the
 * scoring engine already computed — this function only formats and
 * looks up per-question scores via the scoring engine's existing
 * exports (getOptionScore, isScorableQuestion); it never recalculates
 * scores itself.
 */
export function buildAssessmentPayload(
  companyInfo: CompanyProfile,
  scoringResult: ScoringResult,
  answers: AnswerMap
): AssessmentSubmissionPayload {
  const answerPayloads = QUESTION_BANK.questions
    .map((question) => buildAnswerPayload(question.id, answers[question.id]))
    .filter((entry): entry is AssessmentAnswerPayload => entry !== null);

  const moduleScorePayloads: AssessmentModuleScorePayload[] = scoringResult.moduleScores.map((moduleScore) => ({
    moduleId: moduleScore.moduleId,
    moduleName: moduleScore.moduleTitle,
    score: moduleScore.score,
    maxScore: moduleScore.maxScore,
    percentage: moduleScore.percentage,
    rating: getHealthRating(moduleScore.percentage),
  }));

  return {
    company: {
      companyName: companyInfo.companyName,
      contactPerson: companyInfo.contactPerson,
      designation: companyInfo.designation,
      mobile: companyInfo.mobileNumber,
      email: companyInfo.email,
      businessType: resolveBusinessType(companyInfo),
      industry: companyInfo.industry,
      employeeCount: companyInfo.numberOfEmployees,
      inventoryLocations: companyInfo.numberOfInventoryLocations,
      activeSkus: companyInfo.approximateActiveSkus,
    },
    overallScore: scoringResult.overallScore,
    overallPercentage: scoringResult.overallPercentage,
    healthRating: scoringResult.overallRating,
    answers: answerPayloads,
    moduleScores: moduleScorePayloads,
  };
}
