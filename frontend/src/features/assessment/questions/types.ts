/** A single selectable answer for a 'scale' question. */
export interface Option {
  value: number;
  label: string;
}

export interface Question {
  id: string;
  moduleId: string;
  text: string;
  helperText?: string;
  /** 'scale' renders selectable options; 'textarea' renders free text (e.g. FIN-01). Defaults to 'scale'. */
  type?: 'scale' | 'textarea';
  /**
   * Metadata only — no scoring is implemented yet. Defaults to true;
   * FIN-01 is the one question explicitly excluded.
   */
  scorable?: boolean;
  // Required for 'scale' questions; omitted for 'textarea' questions.
  options?: Option[];
}

export interface Module {
  id: string;
  title: string;
}

export interface QuestionBank {
  modules: Module[];
  questions: Question[];
}
