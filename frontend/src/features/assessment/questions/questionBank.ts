import rawQuestionBank from './questions.json';
import { questionBankSchema, type AnswerOption, type Question } from './questionBank.schema';

const parsed = questionBankSchema.safeParse(rawQuestionBank);

if (!parsed.success) {
  // Fails loudly at build/startup rather than rendering a broken
  // assessment — a malformed question bank is a data bug, not a
  // recoverable UI state.
  throw new Error(`Invalid question bank data: ${parsed.error.message}`);
}

/**
 * The active question bank. Swapping in NAC's real 52-question bank
 * later means replacing questions.json's contents with data in the
 * same shape — nothing in the engine (hook/components) needs to change.
 */
export const QUESTION_BANK = parsed.data;

export function getModuleTitle(moduleId: string): string {
  return QUESTION_BANK.modules.find((module) => module.id === moduleId)?.title ?? moduleId;
}

export function getQuestionOptions(question: Question): AnswerOption[] {
  return question.options ?? QUESTION_BANK.defaultScale;
}
