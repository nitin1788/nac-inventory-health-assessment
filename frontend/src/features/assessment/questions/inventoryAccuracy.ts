import type { Module, Question } from './types';

export const inventoryAccuracyModule: Module = {
  id: 'inventory-accuracy',
  title: 'Inventory Accuracy',
};

export const inventoryAccuracyQuestions: Question[] = [
  {
    id: 'ACC-01',
    moduleId: 'inventory-accuracy',
    text: 'How often is physical stock verification conducted?',
    options: [
      { value: 1, label: 'Daily' },
      { value: 2, label: 'Weekly' },
      { value: 3, label: 'Monthly' },
      { value: 4, label: 'Quarterly' },
      { value: 5, label: 'Annually' },
      { value: 6, label: 'Never' },
    ],
  },
  {
    id: 'ACC-02',
    moduleId: 'inventory-accuracy',
    text: 'What is your approximate inventory accuracy level (System Stock vs Physical Stock)?',
    options: [
      { value: 1, label: 'Above 98%' },
      { value: 2, label: '95%–98%' },
      { value: 3, label: '90%–94%' },
      { value: 4, label: 'Below 90%' },
      { value: 5, label: 'Not Measured' },
    ],
  },
  {
    id: 'ACC-03',
    moduleId: 'inventory-accuracy',
    text: 'Is Cycle Counting implemented for inventory verification?',
    options: [
      { value: 1, label: 'Fully implemented across all inventory' },
      { value: 2, label: 'Implemented only for critical items' },
      { value: 3, label: 'Planning to implement' },
      { value: 4, label: 'Not implemented' },
    ],
  },
  {
    id: 'ACC-04',
    moduleId: 'inventory-accuracy',
    text: 'How are inventory discrepancies handled after physical verification?',
    options: [
      { value: 1, label: 'Every discrepancy is investigated, approved, and corrected' },
      { value: 2, label: 'Major discrepancies are investigated' },
      { value: 3, label: 'Adjustments are made without formal investigation' },
      { value: 4, label: 'No standard process exists' },
    ],
  },
  {
    id: 'ACC-05',
    moduleId: 'inventory-accuracy',
    text: 'How are damaged, defective, expired, or rejected materials managed?',
    options: [
      { value: 1, label: 'Stored separately with proper documentation and regular review' },
      { value: 2, label: 'Stored separately but documentation is inconsistent' },
      { value: 3, label: 'Mixed with regular inventory' },
      { value: 4, label: 'No defined process' },
    ],
  },
];
