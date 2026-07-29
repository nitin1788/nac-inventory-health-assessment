import type { Module, Question } from './types';

export const riskComplianceModule: Module = {
  id: 'risk-compliance',
  title: 'Risk & Compliance',
};

export const riskComplianceQuestions: Question[] = [
  {
    id: 'RSK-01',
    moduleId: 'risk-compliance',
    text: 'Are Standard Operating Procedures (SOPs) documented for inventory and store / warehouse operations?',
    options: [
      { value: 1, label: 'Fully documented and regularly updated' },
      { value: 2, label: 'Documented but not regularly updated' },
      { value: 3, label: 'Partially documented' },
      { value: 4, label: 'No documented SOPs' },
    ],
  },
  {
    id: 'RSK-02',
    moduleId: 'risk-compliance',
    text: 'How frequently are employees trained on inventory management procedures?',
    options: [
      { value: 1, label: 'Regularly (At least annually)' },
      { value: 2, label: 'Occasionally' },
      { value: 3, label: 'Only during joining' },
      { value: 4, label: 'No formal training' },
    ],
  },
  {
    id: 'RSK-03',
    moduleId: 'risk-compliance',
    text: 'Is warehouse access restricted to authorized personnel only?',
    options: [
      { value: 1, label: 'Fully restricted with access control' },
      { value: 2, label: 'Restricted but not monitored' },
      { value: 3, label: 'Limited access control' },
      { value: 4, label: 'No access restrictions' },
    ],
  },
  {
    id: 'RSK-04',
    moduleId: 'risk-compliance',
    text: 'How often does management review inventory performance and related risks?',
    options: [
      { value: 1, label: 'Monthly' },
      { value: 2, label: 'Quarterly' },
      { value: 3, label: 'Annually' },
      { value: 4, label: 'Never' },
    ],
  },
  {
    id: 'RSK-05',
    moduleId: 'risk-compliance',
    text: 'Does your organization have a structured continuous improvement program for inventory and store / warehouse operations?',
    options: [
      { value: 1, label: 'Fully Implemented' },
      { value: 2, label: 'Partially Implemented' },
      { value: 3, label: 'Planning to Implement' },
      { value: 4, label: 'No improvement program' },
    ],
  },
];
