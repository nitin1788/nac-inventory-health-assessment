import type { Module, Question } from './types';

export const inventoryPlanningModule: Module = {
  id: 'inventory-planning',
  title: 'Inventory Planning',
};

export const inventoryPlanningQuestions: Question[] = [
  {
    id: 'PLN-01',
    moduleId: 'inventory-planning',
    text: 'How do you forecast inventory demand?',
    options: [
      { value: 1, label: 'ERP / Planning Software' },
      { value: 2, label: 'Excel' },
      { value: 3, label: 'Experience Based' },
      { value: 4, label: 'No Forecasting' },
    ],
  },
  {
    id: 'PLN-02',
    moduleId: 'inventory-planning',
    text: 'Are minimum stock levels defined for critical inventory items?',
    options: [
      { value: 1, label: 'For all items' },
      { value: 2, label: 'For critical items only' },
      { value: 3, label: 'For selected items' },
      { value: 4, label: 'Not defined' },
    ],
  },
  {
    id: 'PLN-03',
    moduleId: 'inventory-planning',
    text: 'Are reorder levels defined?',
    options: [
      { value: 1, label: 'For all items' },
      { value: 2, label: 'For critical items' },
      { value: 3, label: 'For selected items' },
      { value: 4, label: 'Not defined' },
    ],
  },
  {
    id: 'PLN-04',
    moduleId: 'inventory-planning',
    text: 'Is safety stock maintained?',
    options: [
      { value: 1, label: 'Always' },
      { value: 2, label: 'Often' },
      { value: 3, label: 'Sometimes' },
      { value: 4, label: 'Never' },
    ],
  },
  {
    id: 'PLN-05',
    moduleId: 'inventory-planning',
    text: 'How often are inventory planning parameters reviewed?',
    options: [
      { value: 1, label: 'Monthly' },
      { value: 2, label: 'Quarterly' },
      { value: 3, label: 'Half-Yearly' },
      { value: 4, label: 'Yearly' },
      { value: 5, label: 'Never' },
    ],
  },
];
