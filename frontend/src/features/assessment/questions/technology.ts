import type { Module, Question } from './types';

export const technologyModule: Module = {
  id: 'technology',
  title: 'Technology',
};

export const technologyQuestions: Question[] = [
  {
    id: 'TEC-01',
    moduleId: 'technology',
    text: 'Which system is primarily used to manage inventory?',
    options: [
      { value: 1, label: 'ERP System (SAP, Oracle, Microsoft Dynamics, etc.)' },
      { value: 2, label: 'Dedicated Inventory Management Software' },
      { value: 3, label: 'Microsoft Excel / Google Sheets' },
      { value: 4, label: 'Manual Registers / Paper Records' },
    ],
  },
  {
    id: 'TEC-02',
    moduleId: 'technology',
    text: 'Are barcode or QR code systems used for inventory identification and tracking?',
    options: [
      { value: 1, label: 'Fully implemented across all inventory' },
      { value: 2, label: 'Implemented for selected inventory' },
      { value: 3, label: 'Planning to implement' },
      { value: 4, label: 'Not implemented' },
    ],
  },
  {
    id: 'TEC-03',
    moduleId: 'technology',
    text: 'Is real-time inventory visibility available across all inventory locations?',
    options: [
      { value: 1, label: 'Yes, across all locations' },
      { value: 2, label: 'Available for selected locations only' },
      { value: 3, label: 'Limited visibility' },
      { value: 4, label: 'No real-time visibility' },
    ],
  },
  {
    id: 'TEC-04',
    moduleId: 'technology',
    text: 'How are inventory reports generated?',
    options: [
      { value: 1, label: 'Fully automated dashboards and reports' },
      { value: 2, label: 'Automated reports with manual adjustments' },
      { value: 3, label: 'Manual Excel reports' },
      { value: 4, label: 'Reports are not generated regularly' },
    ],
  },
];
