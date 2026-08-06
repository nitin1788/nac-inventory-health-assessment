/**
 * Mirrored `{ moduleId, text }` for every question in the live
 * assessment — sourced by copying from
 * frontend/src/features/assessment/questions/*.ts. Same established
 * pattern as recommendations/recommendationData.ts: intentionally
 * duplicated rather than shared, since frontend and backend are
 * independently deployable apps (see docs/ARCHITECTURE.md).
 *
 * Used only to render a question's text next to a customer's
 * already-persisted answer in the Full tier's Question-Level Insights
 * section. This file has no bearing on how questions are asked,
 * scored, or persisted — it never touches the live question flow, the
 * scoring engine, or the frontend question bank itself.
 */
export interface QuestionTextEntry {
  moduleId: string;
  text: string;
}

export const QUESTION_TEXT_INDEX: Record<string, QuestionTextEntry> = {
  // Inventory Planning
  'PLN-01': { moduleId: 'inventory-planning', text: 'How do you forecast inventory demand?' },
  'PLN-02': {
    moduleId: 'inventory-planning',
    text: 'Are minimum stock levels defined for critical inventory items?',
  },
  'PLN-03': { moduleId: 'inventory-planning', text: 'Are reorder levels defined?' },
  'PLN-04': { moduleId: 'inventory-planning', text: 'Is safety stock maintained?' },
  'PLN-05': {
    moduleId: 'inventory-planning',
    text: 'How often are inventory planning parameters reviewed?',
  },

  // Inventory Control
  'CTL-01': {
    moduleId: 'inventory-control',
    text: 'Does every inventory item have a unique SKU / Item Code?',
  },
  'CTL-02': {
    moduleId: 'inventory-control',
    text: 'How are inventory transactions (receipt, issue, transfer, return) recorded?',
  },
  'CTL-03': {
    moduleId: 'inventory-control',
    text: 'Which inventory valuation method is primarily used in your organization?',
  },
  'CTL-04': { moduleId: 'inventory-control', text: 'How frequently do stock-out situations occur?' },
  'CTL-05': { moduleId: 'inventory-control', text: 'How frequently does excess inventory occur?' },
  'CTL-06': {
    moduleId: 'inventory-control',
    text: 'How often are slow-moving inventory items reviewed and actioned?',
  },
  'CTL-07': {
    moduleId: 'inventory-control',
    text: 'Are dead stock and obsolete inventory identified, monitored, and disposed of through a defined process?',
  },

  // Inventory Accuracy
  'ACC-01': { moduleId: 'inventory-accuracy', text: 'How often is physical stock verification conducted?' },
  'ACC-02': {
    moduleId: 'inventory-accuracy',
    text: 'What is your approximate inventory accuracy level (System Stock vs Physical Stock)?',
  },
  'ACC-03': { moduleId: 'inventory-accuracy', text: 'Is Cycle Counting implemented for inventory verification?' },
  'ACC-04': {
    moduleId: 'inventory-accuracy',
    text: 'How are inventory discrepancies handled after physical verification?',
  },
  'ACC-05': {
    moduleId: 'inventory-accuracy',
    text: 'How are damaged, defective, expired, or rejected materials managed?',
  },

  // Store / Warehouse Operations
  'WAR-01': {
    moduleId: 'warehouse-operations',
    text: 'Are your store / warehouse storage locations (Rack, Row, Bin, Shelf) clearly identified and labeled?',
  },
  'WAR-02': {
    moduleId: 'warehouse-operations',
    text: 'Are inventory items stored in designated storage locations according to a defined storage plan?',
  },
  'WAR-03': {
    moduleId: 'warehouse-operations',
    text: 'Is a standard Goods Receipt Note (GRN) process followed for all incoming materials?',
  },
  'WAR-04': {
    moduleId: 'warehouse-operations',
    text: 'Is every dispatch verified before goods leave the store / warehouse?',
  },
  'WAR-05': {
    moduleId: 'warehouse-operations',
    text: 'How would you rate the overall store / warehouse organization and housekeeping (5S)?',
  },
  'WAR-06': {
    moduleId: 'warehouse-operations',
    text: 'Are damaged, rejected, returned, or quarantine materials stored separately from usable inventory?',
  },

  // Procurement
  'PRC-01': {
    moduleId: 'procurement',
    text: 'Are purchase quantities determined based on inventory data, demand forecasting, and reorder levels?',
  },
  'PRC-02': { moduleId: 'procurement', text: 'How are supplier lead times monitored and managed?' },
  'PRC-03': {
    moduleId: 'procurement',
    text: 'How frequently are emergency purchases made due to stock shortages?',
  },
  'PRC-04': {
    moduleId: 'procurement',
    text: 'Are Purchase Orders (POs) approved through a defined authorization process before procurement?',
  },

  // Technology
  'TEC-01': { moduleId: 'technology', text: 'Which system is primarily used to manage inventory?' },
  'TEC-02': {
    moduleId: 'technology',
    text: 'Are barcode or QR code systems used for inventory identification and tracking?',
  },
  'TEC-03': {
    moduleId: 'technology',
    text: 'Is real-time inventory visibility available across all inventory locations?',
  },
  'TEC-04': { moduleId: 'technology', text: 'How are inventory reports generated?' },

  // Inventory KPIs
  'KPI-01': { moduleId: 'inventory-kpis', text: 'How frequently is Inventory Turnover Ratio monitored?' },
  'KPI-02': {
    moduleId: 'inventory-kpis',
    text: 'Is Inventory Accuracy tracked as a Key Performance Indicator (KPI)?',
  },
  'KPI-03': { moduleId: 'inventory-kpis', text: 'Are stock-out incidents monitored and analyzed?' },
  'KPI-04': {
    moduleId: 'inventory-kpis',
    text: 'How frequently are slow-moving and dead-stock reports reviewed?',
  },

  // Risk & Compliance
  'RSK-01': {
    moduleId: 'risk-compliance',
    text: 'Are Standard Operating Procedures (SOPs) documented for inventory and store / warehouse operations?',
  },
  'RSK-02': {
    moduleId: 'risk-compliance',
    text: 'How frequently are employees trained on inventory management procedures?',
  },
  'RSK-03': { moduleId: 'risk-compliance', text: 'Is warehouse access restricted to authorized personnel only?' },
  'RSK-04': {
    moduleId: 'risk-compliance',
    text: 'How often does management review inventory performance and related risks?',
  },
  'RSK-05': {
    moduleId: 'risk-compliance',
    text: 'Does your organization have a structured continuous improvement program for inventory and store / warehouse operations?',
  },

  // Final Business Assessment (free-text, not scored)
  'FIN-01': {
    moduleId: 'final-assessment',
    text: 'What is the biggest inventory or warehouse challenge your organization is currently facing?',
  },
};
