import type { Module, Question } from './types';

export const finalAssessmentModule: Module = {
  id: 'final-assessment',
  title: 'Final Business Assessment',
};

export const finalAssessmentQuestions: Question[] = [
  {
    id: 'FIN-01',
    moduleId: 'final-assessment',
    text: 'What is the biggest inventory or warehouse challenge your organization is currently facing?',
    helperText: 'Not scored — used only to add qualitative context to your report.',
    type: 'textarea',
    scorable: false,
  },
];
