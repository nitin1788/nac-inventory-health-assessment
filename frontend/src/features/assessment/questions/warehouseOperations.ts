import type { Module, Question } from './types';

export const warehouseOperationsModule: Module = {
  id: 'warehouse-operations',
  title: 'Warehouse Operations',
};

export const warehouseOperationsQuestions: Question[] = [
  {
    id: 'WAR-01',
    moduleId: 'warehouse-operations',
    text: 'Are warehouse /Store storage locations (Rack, Row, Bin, Shelf) clearly identified and labeled?',
    options: [
      { value: 1, label: 'Fully labeled with a standardized location system' },
      { value: 2, label: 'Partially labeled' },
      { value: 3, label: 'Limited labeling' },
      { value: 4, label: 'No location identification system' },
    ],
  },
  {
    id: 'WAR-02',
    moduleId: 'warehouse-operations',
    text: 'Are inventory items stored in designated storage locations according to a defined storage plan?',
    options: [
      { value: 1, label: 'Always' },
      { value: 2, label: 'Usually' },
      { value: 3, label: 'Sometimes' },
      { value: 4, label: 'Rarely' },
      { value: 5, label: 'Never' },
    ],
  },
  {
    id: 'WAR-03',
    moduleId: 'warehouse-operations',
    text: 'Is a standard Goods Receipt Note (GRN) process followed for all incoming materials?',
    options: [
      { value: 1, label: 'Always' },
      { value: 2, label: 'Usually' },
      { value: 3, label: 'Sometimes' },
      { value: 4, label: 'Rarely' },
      { value: 5, label: 'Never' },
    ],
  },
  {
    id: 'WAR-04',
    moduleId: 'warehouse-operations',
    text: 'Is every dispatch verified before goods leave the warehouse?',
    options: [
      { value: 1, label: 'Every dispatch is verified and documented' },
      { value: 2, label: 'Most dispatches are verified' },
      { value: 3, label: 'Only high-value items are verified' },
      { value: 4, label: 'No standard dispatch verification process' },
    ],
  },
  {
    id: 'WAR-05',
    moduleId: 'warehouse-operations',
    text: 'How would you rate the overall warehouse organization and housekeeping (5S)?',
    options: [
      { value: 1, label: 'Excellent (Highly organized and well maintained)' },
      { value: 2, label: 'Good' },
      { value: 3, label: 'Average' },
      { value: 4, label: 'Poor' },
      { value: 5, label: 'Very Poor' },
    ],
  },
  {
    id: 'WAR-06',
    moduleId: 'warehouse-operations',
    text: 'Are damaged, rejected, returned, or quarantine materials stored separately from usable inventory?',
    options: [
      { value: 1, label: 'Always, with a dedicated quarantine area' },
      { value: 2, label: 'Usually' },
      { value: 3, label: 'Sometimes' },
      { value: 4, label: 'No separate storage area' },
    ],
  },
];
