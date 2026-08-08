/**
 * Internal-only editorial content for the NAC consulting report:
 * discussion questions a consultant should ask about each module, and
 * which of NAC's real, existing services (see SERVICES_LIST in
 * config/constants.ts) a module's findings most plausibly point toward.
 *
 * This is a mapping of POTENTIAL relevance, not an entitlement or a
 * purchase record — see internalReportSections.ts's NAC Service
 * Opportunity section for the explicit disclaimer rendered alongside
 * it. Never rendered on the customer-facing report; never emailed to
 * the customer.
 */

export const CONSULTANT_QUESTIONS_BY_MODULE: Record<string, string[]> = {
  'inventory-planning': [
    'How do you currently forecast demand, and how far in advance?',
    'What happens today when actual demand deviates significantly from the forecast?',
    'Which SKUs or categories see the most frequent stockouts or overstock?',
    'Who owns the decision to adjust reorder points or safety stock?',
  ],
  'inventory-control': [
    'How are stock movements (receipts, issues, transfers) currently recorded, and how quickly after they happen?',
    'How often do you find discrepancies between recorded and actual stock?',
    "What's your current process — if any — for cycle counting?",
    'Who is authorized to approve stock adjustments, and how is that tracked?',
  ],
  'inventory-accuracy': [
    'When was the last full physical stock verification?',
    "What's your best estimate of current system-vs-physical accuracy?",
    'How are discrepancies investigated once found — is a root cause captured?',
    'Which SKUs or locations are most prone to inaccuracy?',
  ],
  'warehouse-operations': [
    'Can staff locate any given SKU without asking someone else where it is?',
    'What does your receiving-to-put-away process look like today?',
    'How is a dispatch verified before it leaves the warehouse?',
    'Where do you see the biggest bottleneck in your current pick/pack/ship flow?',
  ],
  procurement: [
    'How are purchase quantities and timing currently decided?',
    'How often are emergency or rush purchases needed, and why?',
    'How many of your SKUs depend on a single supplier?',
    'Who approves a purchase order, and at what stage?',
  ],
  technology: [
    'What system(s), if any, are you using to track inventory today?',
    'Where are spreadsheets or manual records still the source of truth?',
    'Do all locations and staff have access to the same, current stock data?',
    'What would real-time visibility change about how you run the business day to day?',
  ],
  'inventory-kpis': [
    'What inventory metrics, if any, do you currently track on a regular cadence?',
    'Who reviews inventory performance, and how often?',
    'How do you find out about a stockout or slow-moving stock today — proactively or after the fact?',
    "What would you want to know about your inventory that you don't currently have visibility into?",
  ],
  'risk-compliance': [
    'Do you have documented SOPs for your core inventory and warehouse processes?',
    'What is your contingency plan if a key supplier or SKU became unavailable?',
    'Who has access to the warehouse, and how is that controlled?',
    'How often does management formally review inventory risk?',
  ],
};

export const DEFAULT_CONSULTANT_QUESTIONS: string[] = [
  'Can you walk me through how this area actually works day to day?',
  "What's the biggest pain point your team feels here?",
  'Has this gotten better or worse over the last year?',
];

/**
 * One or more of NAC's real service names (see SERVICES_LIST), joined
 * with " + " where a module's findings plausibly point to more than
 * one — deliberately confined to services that already exist, never a
 * new/invented service name.
 */
export const NAC_SERVICE_OPPORTUNITY_BY_MODULE: Record<string, string> = {
  'inventory-planning': 'Inventory Optimization',
  'inventory-control': 'Inventory Audit + SOP Development',
  'inventory-accuracy': 'Inventory Audit',
  'warehouse-operations': 'Warehouse Audit + SOP Development',
  procurement: 'Business Process Improvement + SOP Development',
  technology: 'Business Process Improvement',
  'inventory-kpis': 'Business Process Improvement',
  'risk-compliance': 'SOP Development',
};

export const DEFAULT_NAC_SERVICE_OPPORTUNITY = 'Business Process Improvement';
