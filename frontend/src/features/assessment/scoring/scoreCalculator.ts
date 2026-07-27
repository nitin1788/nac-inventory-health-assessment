import type { QuestionBank } from '../questions/types';
import type { AnswerMap } from '../useAssessmentEngine';
import type { ModuleScore, ScoringResult } from './scoreTypes';
import {
  getHealthRating,
  getOptionScore,
  getQuestionMaxScore,
  GOOD_THRESHOLD,
  isScorableQuestion,
  NEEDS_IMPROVEMENT_THRESHOLD,
} from './scoreHelpers';

/**
 * Computes module and overall scores from a question bank and a set
 * of collected answers. Purely data-driven — no question or module
 * ID is ever referenced by name. Scoring is entirely driven by each
 * question's own metadata, so passing a different (e.g. future,
 * larger) question bank works without changing this function.
 */
export function calculateScore(questionBank: QuestionBank, answers: AnswerMap): ScoringResult {
  const moduleScores: ModuleScore[] = [];

  for (const module of questionBank.modules) {
    const moduleQuestions = questionBank.questions.filter(
      (question) => question.moduleId === module.id && isScorableQuestion(question)
    );

    // A module with no scorable questions (e.g. a free-text-only
    // module) contributes nothing and is omitted from the results —
    // a 0/0 percentage would be meaningless.
    if (moduleQuestions.length === 0) continue;

    let score = 0;
    let maxScore = 0;

    for (const question of moduleQuestions) {
      const options = question.options ?? [];
      maxScore += getQuestionMaxScore(question);

      const answer = answers[question.id];
      if (typeof answer !== 'number') continue;

      const selectedOption = options.find((option) => option.value === answer);
      if (selectedOption) {
        score += getOptionScore(options, selectedOption);
      }
    }

    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    moduleScores.push({
      moduleId: module.id,
      moduleTitle: module.title,
      score,
      maxScore,
      percentage: Math.round(percentage * 10) / 10,
    });
  }

  const overallScore = moduleScores.reduce((sum, moduleScore) => sum + moduleScore.score, 0);
  const overallMaxScore = moduleScores.reduce((sum, moduleScore) => sum + moduleScore.maxScore, 0);
  const overallPercentageRaw = overallMaxScore > 0 ? (overallScore / overallMaxScore) * 100 : 0;
  const overallPercentage = Math.round(overallPercentageRaw * 10) / 10;

  const strengthModules = moduleScores
    .filter((moduleScore) => moduleScore.percentage >= GOOD_THRESHOLD)
    .sort((a, b) => b.percentage - a.percentage);

  const weakModules = moduleScores
    .filter((moduleScore) => moduleScore.percentage < NEEDS_IMPROVEMENT_THRESHOLD)
    .sort((a, b) => a.percentage - b.percentage);

  return {
    overallScore,
    overallMaxScore,
    overallPercentage,
    overallRating: getHealthRating(overallPercentage),
    moduleScores,
    strengthModules,
    weakModules,
  };
}
