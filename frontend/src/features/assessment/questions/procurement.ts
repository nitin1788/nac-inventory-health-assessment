import type { Module, Question } from './types';

export const procurementModule: Module = {
  id: 'procurement',
  title: 'Procurement',
};

export const procurementQuestions: Question[] = [
  {
    id: 'PRC-01',
    moduleId: 'procurement',
    text: 'Are purchase quantities determined based on inventory data, demand forecasting, and reorder levels?',
    options: [
      { value: 1, label: 'Always, using a structured planning process' },
      { value: 2, label: 'Usually, with occasional manual decisions' },
      { value: 3, label: 'Sometimes, based on experience' },
      { value: 4, label: 'No defined purchasing process' },
    ],
  },
  {
    id: 'PRC-02',
    moduleId: 'procurement',
    text: 'How are supplier lead times monitored and managed?',
    options: [
      { value: 1, label: 'Regularly monitored and recorded' },
      { value: 2, label: 'Monitored for key suppliers only' },
      { value: 3, label: 'Occasionally monitored' },
      { value: 4, label: 'Not monitored' },
    ],
  },
  {
    id: 'PRC-03',
    moduleId: 'procurement',
    text: 'How frequently are emergency purchases made due to stock shortages?',
    options: [
      { value: 1, label: 'Never' },
      { value: 2, label: 'Rarely (Less than once a month)' },
      { value: 3, label: 'Occasionally (1–3 times per month)' },
      { value: 4, label: 'Frequently (Weekly or more)' },
    ],
  },
  {
    id: 'PRC-04',
    moduleId: 'procurement',
    text: 'Are Purchase Orders (POs) approved through a defined authorization process before procurement?',
    options: [
      { value: 1, label: 'Always' },
      { value: 2, label: 'Usually' },
      { value: 3, label: 'Sometimes' },
      { value: 4, label: 'No formal approval process' },
    ],
  },
];
