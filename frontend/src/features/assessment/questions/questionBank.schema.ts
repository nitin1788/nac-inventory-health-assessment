import { z } from 'zod';

/**
 * Runtime shape of the question bank. This is the contract NAC's
 * real 52-question bank must satisfy to drop in as a replacement for
 * questions.json — validated at load time so malformed data fails
 * loudly instead of breaking the engine silently.
 */
export const answerOptionSchema = z.object({
  value: z.number(),
  label: z.string().min(1),
});

export const questionSchema = z.object({
  id: z.string().min(1),
  moduleId: z.string().min(1),
  text: z.string().min(1),
  helperText: z.string().optional(),
  // Per-question options are optional — most questions share the
  // bank's defaultScale; only override where a question needs its
  // own wording.
  options: z.array(answerOptionSchema).min(2).optional(),
});

export const questionModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
});

export const questionBankSchema = z.object({
  modules: z.array(questionModuleSchema).min(1),
  defaultScale: z.array(answerOptionSchema).min(2),
  questions: z.array(questionSchema).min(1),
});

export type AnswerOption = z.infer<typeof answerOptionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuestionModule = z.infer<typeof questionModuleSchema>;
export type QuestionBankData = z.infer<typeof questionBankSchema>;
