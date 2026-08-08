import type { AssessmentDetail } from '../assessment/assessment.types';
import type { ModuleRecommendation } from '../recommendations/recommendationTypes';
import {
  buildReportContent,
  evidenceSignal,
  rootCauseCategoryFor,
  ROOT_CAUSE_PHRASE,
  weakestAnswerInModule,
  type ReportContent,
} from '../pdf/pdfReportContent';
import {
  CONSULTANT_QUESTIONS_BY_MODULE,
  DEFAULT_CONSULTANT_QUESTIONS,
  DEFAULT_NAC_SERVICE_OPPORTUNITY,
  NAC_SERVICE_OPPORTUNITY_BY_MODULE,
} from './internalReportData';
import type { InternalReportContent, ProblemEntry } from './internalReport.types';

function buildProblemEntry(moduleRecommendation: ModuleRecommendation, content: ReportContent): ProblemEntry {
  const { moduleId } = moduleRecommendation;

  return {
    moduleId,
    moduleName: moduleRecommendation.moduleName,
    percentage: moduleRecommendation.percentage,
    rating: moduleRecommendation.rating,
    priority: moduleRecommendation.priority,
    problemIdentified: moduleRecommendation.summary,
    evidence: evidenceSignal(weakestAnswerInModule(content, moduleId)),
    businessImpact: moduleRecommendation.businessImpact,
    likelyRootCause: ROOT_CAUSE_PHRASE[rootCauseCategoryFor(moduleId)],
    recommendedSolution: moduleRecommendation.recommendations.join(' '),
    consultantQuestions: CONSULTANT_QUESTIONS_BY_MODULE[moduleId] ?? DEFAULT_CONSULTANT_QUESTIONS,
    suggestedAction: moduleRecommendation.recommendations[0] ?? moduleRecommendation.summary,
    nacServiceOpportunity: NAC_SERVICE_OPPORTUNITY_BY_MODULE[moduleId] ?? DEFAULT_NAC_SERVICE_OPPORTUNITY,
  };
}

/**
 * Builds the internal consulting report's data, entirely on top of the
 * SAME buildReportContent() the customer report uses — this module
 * never recomputes a score or re-derives a rating, it only restructures
 * already-computed, real-data findings for a consultant's own use.
 */
export function buildInternalReportContent(assessment: AssessmentDetail): InternalReportContent {
  const reportContent = buildReportContent(assessment);
  const problemRegister = reportContent.moduleRecommendations.map((m) => buildProblemEntry(m, reportContent));

  return {
    reportContent,
    problemRegister,
    topProblems: problemRegister.slice(0, 5),
  };
}
