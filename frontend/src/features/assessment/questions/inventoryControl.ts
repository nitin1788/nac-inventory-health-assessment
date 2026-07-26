import type { Module, Question } from './types';

export const inventoryControlModule: Module = {
  id: 'inventory-control',
  title: 'Inventory Control',
};

export const inventoryControlQuestions: Question[] = [
  {
    id: 'CTL-01',
    moduleId: 'inventory-control',
    text: 'Does every inventory item have a unique SKU / Item Code?',
    options: [
      { value: 1, label: 'Every inventory item has a unique SKU' },
      { value: 2, label: 'Only critical items have SKUs' },
      { value: 3, label: 'Some items have SKUs' },
      { value: 4, label: 'No SKU system is followed' },
    ],
  },
  {
    id: 'CTL-02',
    moduleId: 'inventory-control',
    text: 'How are inventory transactions (receipt, issue, transfer, return) recorded?',
    options: [
      { value: 1, label: 'Real-time using ERP/Inventory Software' },
      { value: 2, label: 'Daily using Excel or Software' },
      { value: 3, label: 'Manual register with periodic updates' },
      { value: 4, label: 'Transactions are not recorded consistently' },
    ],
  },
  {
    id: 'CTL-03',
    moduleId: 'inventory-control',
    text: 'Which inventory valuation method is primarily used in your organization?',
    options: [
      { value: 1, label: 'FIFO (First In First Out)' },
      { value: 2, label: 'FEFO (First Expiry First Out)' },
      { value: 3, label: 'Weighted Average Cost' },
      { value: 4, label: 'Standard Costing' },
      { value: 5, label: 'Not Sure / No Defined Method' },
    ],
  },
  {
    id: 'CTL-04',
    moduleId: 'inventory-control',
    text: 'How frequently do stock-out situations occur?',
    options: [
      { value: 1, label: 'Never' },
      { value: 2, label: 'Rarely (1–2 times per quarter)' },
      { value: 3, label: 'Occasionally (Monthly)' },
      { value: 4, label: 'Frequently (Weekly or more)' },
    ],
  },
  {
    id: 'CTL-05',
    moduleId: 'inventory-control',
    text: 'How frequently does excess inventory occur?',
    options: [
      { value: 1, label: 'Never' },
      { value: 2, label: 'Rarely' },
      { value: 3, label: 'Occasionally' },
      { value: 4, label: 'Frequently' },
    ],
  },
  {
    id: 'CTL-06',
    moduleId: 'inventory-control',
    text: 'How often are slow-moving inventory items reviewed and actioned?',
    options: [
      { value: 1, label: 'Monthly' },
      { value: 2, label: 'Quarterly' },
      { value: 3, label: 'Half-Yearly' },
      { value: 4, label: 'Yearly' },
      { value: 5, label: 'Never' },
    ],
  },
  {
    id: 'CTL-07',
    moduleId: 'inventory-control',
    text: 'Are dead stock and obsolete inventory identified, monitored, and disposed of through a defined process?',
    options: [
      { value: 1, label: 'Yes, a formal process is followed regularly' },
      { value: 2, label: 'Yes, but only occasionally' },
      { value: 3, label: 'Identified but no defined process' },
      { value: 4, label: 'No, not monitored' },
    ],
  },
];
