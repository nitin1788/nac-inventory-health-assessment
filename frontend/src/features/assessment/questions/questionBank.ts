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
 * The active question bank — the real 41-question "FREE Inventory
 * Health Check Assessment" (Nitin Anand Consulting), extracted from
 * the live Google Form. Any future revision to the question set
 * (wording, options, added/removed questions) means editing
 * questions.json's contents in this same shape — nothing in the
 * engine (hook/components) needs to change.
 */
export const QUESTION_BANK = parsed.data;

export function getModuleTitle(moduleId: string): string {
  return QUESTION_BANK.modules.find((module) => module.id === moduleId)?.title ?? moduleId;
}

export function getQuestionOptions(question: Question): AnswerOption[] {
  return question.options ?? [];
}
