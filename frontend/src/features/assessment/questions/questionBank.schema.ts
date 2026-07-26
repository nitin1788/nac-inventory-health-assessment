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
  /** 'scale' renders selectable options; 'textarea' renders free text (e.g. FIN-01). */
  type: z.enum(['scale', 'textarea']).default('scale'),
  /**
   * Metadata only — no scoring is implemented yet. Recorded now so a
   * future scoring engine knows which questions to skip (FIN-01 is
   * explicitly excluded per the source assessment).
   */
  scorable: z.boolean().default(true),
  // Required for 'scale' questions; omitted for 'textarea' questions.
  options: z.array(answerOptionSchema).min(2).optional(),
});

export const questionModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
});

export const questionBankSchema = z.object({
  modules: z.array(questionModuleSchema).min(1),
  questions: z.array(questionSchema).min(1),
});

export type AnswerOption = z.infer<typeof answerOptionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuestionModule = z.infer<typeof questionModuleSchema>;
export type QuestionBankData = z.infer<typeof questionBankSchema>;
