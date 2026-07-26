import type { Module, Question } from './types';

export const inventoryKpisModule: Module = {
  id: 'inventory-kpis',
  title: 'Inventory KPIs',
};

export const inventoryKpisQuestions: Question[] = [
  {
    id: 'KPI-01',
    moduleId: 'inventory-kpis',
    text: 'How frequently is Inventory Turnover Ratio monitored?',
    options: [
      { value: 1, label: 'Monthly' },
      { value: 2, label: 'Quarterly' },
      { value: 3, label: 'Annually' },
      { value: 4, label: 'Not Monitored' },
    ],
  },
  {
    id: 'KPI-02',
    moduleId: 'inventory-kpis',
    text: 'Is Inventory Accuracy tracked as a Key Performance Indicator (KPI)?',
    options: [
      { value: 1, label: 'Regularly' },
      { value: 2, label: 'Occasionally' },
      { value: 3, label: 'Rarely' },
      { value: 4, label: 'Never' },
    ],
  },
  {
    id: 'KPI-03',
    moduleId: 'inventory-kpis',
    text: 'Are stock-out incidents monitored and analyzed?',
    options: [
      { value: 1, label: 'Regularly with corrective actions' },
      { value: 2, label: 'Monitored occasionally' },
      { value: 3, label: 'Recorded only when major issues occur' },
      { value: 4, label: 'Not monitored' },
    ],
  },
  {
    id: 'KPI-04',
    moduleId: 'inventory-kpis',
    text: 'How frequently are slow-moving and dead-stock reports reviewed?',
    options: [
      { value: 1, label: 'Monthly' },
      { value: 2, label: 'Quarterly' },
      { value: 3, label: 'Annually' },
      { value: 4, label: 'Not Monitored' },
    ],
  },
];
