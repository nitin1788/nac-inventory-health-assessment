import type { HealthRating } from '../assessment/assessment.types';
import type { ModuleRecommendationConfig } from './recommendationTypes';

/**
 * Rule-based recommendation copy, keyed by the question bank's own
 * module `id` — never by module title, so this stays correct even if
 * a module is retitled. One entry per HealthRating band per module.
 * Content is NAC's own consulting language, not AI-generated.
 *
 * Mirrored from frontend/src/features/assessment/recommendations/recommendationData.ts
 * (see docs/ARCHITECTURE.md — types/content are intentionally
 * duplicated rather than shared, since frontend and backend are
 * independently deployable apps). Used only to build the server-side
 * PDF report; the in-app Results page still uses the frontend's own
 * copy of this data.
 */
export const RECOMMENDATION_DATA: Record<string, ModuleRecommendationConfig> = {
  'inventory-planning': {
    Excellent: {
      summary: 'Inventory planning is a genuine strength — demand forecasting and stock planning are well disciplined.',
      recommendations: [
        'Document current forecasting methods so the practice survives staff turnover.',
        'Pilot more advanced demand-sensing techniques on your highest-value SKUs.',
      ],
      expectedBenefits: ['Sustained forecast accuracy', 'A repeatable process the wider team can rely on'],
    },
    Good: {
      summary: 'Inventory planning is solid overall, with room to tighten a few specific practices.',
      recommendations: [
        'Review forecast accuracy by SKU category and address the weakest categories first.',
        'Set a regular cadence for revisiting reorder points as demand shifts.',
      ],
      expectedBenefits: ['Fewer stockouts and overstocks', 'More consistent planning across product lines'],
    },
    'Needs Improvement': {
      summary: 'Inventory planning has meaningful gaps that are likely contributing to stock imbalances.',
      recommendations: [
        'Introduce a formal demand-forecasting process instead of relying on gut feel.',
        'Set minimum/maximum stock levels for your top-moving SKUs.',
        'Review and adjust safety stock levels at least quarterly.',
      ],
      expectedBenefits: ['Reduced emergency ordering', 'Lower carrying costs on slow-moving stock'],
    },
    Critical: {
      summary: 'Inventory planning is largely reactive right now, creating real risk of stockouts and excess stock.',
      recommendations: [
        'Establish a basic demand-forecasting process this quarter, even a simple spreadsheet-based one.',
        'Classify SKUs by value and velocity (e.g. ABC analysis) to prioritize planning effort.',
        'Set reorder points for at least your top 20% of SKUs by revenue.',
      ],
      expectedBenefits: ['Fewer stockouts on critical items', 'A foundation for more accurate planning going forward'],
    },
  },

  'inventory-control': {
    Excellent: {
      summary: 'Inventory control practices are strong, with tight tracking of stock movement and levels.',
      recommendations: [
        'Extend current control practices to any newly added locations or SKUs.',
        'Periodically audit control procedures to confirm they still match how the business actually operates.',
      ],
      expectedBenefits: ['Continued low shrinkage', 'Reliable stock data for decision-making'],
    },
    Good: {
      summary: 'Inventory control is generally reliable, with a few process gaps worth closing.',
      recommendations: [
        'Standardize stock movement procedures (receiving, transfers, issues) across all locations.',
        'Introduce spot-checks between full physical counts.',
      ],
      expectedBenefits: ['More consistent stock accuracy', 'Faster identification of discrepancies'],
    },
    'Needs Improvement': {
      summary: 'Inventory control gaps are creating avoidable discrepancies between recorded and actual stock.',
      recommendations: [
        'Define and document a standard process for every stock movement type.',
        'Assign clear ownership for stock control at each location.',
        'Move to more frequent cycle counts instead of relying on annual counts.',
      ],
      expectedBenefits: ['Reduced stock discrepancies', 'Clearer accountability across the team'],
    },
    Critical: {
      summary: 'Inventory control is largely informal, which is a major driver of stock discrepancies and loss.',
      recommendations: [
        'Implement basic written procedures for receiving, storing, and issuing stock immediately.',
        'Start a cycle-counting program, beginning with your highest-value SKUs.',
        'Restrict stock movement authority to a small, clearly defined set of people.',
      ],
      expectedBenefits: ['Immediate reduction in unexplained stock loss', 'A control baseline to build on'],
    },
  },

  'inventory-accuracy': {
    Excellent: {
      summary: 'Inventory accuracy is excellent — recorded stock closely matches physical stock.',
      recommendations: [
        'Keep the current counting cadence and root-cause process for any variance found.',
        'Use the high accuracy level to support tighter safety stock and better working capital use.',
      ],
      expectedBenefits: ['Continued trust in system stock data', 'Room to reduce buffer stock without added risk'],
    },
    Good: {
      summary: 'Inventory accuracy is good, with occasional variances that are worth tracking down.',
      recommendations: [
        'Track variance root causes by category to spot recurring patterns.',
        'Tighten data-entry discipline at the point of stock movement.',
      ],
      expectedBenefits: ['Fewer recurring variances', 'More confidence in system stock levels'],
    },
    'Needs Improvement': {
      summary: 'Inventory accuracy gaps are large enough to affect planning and customer commitments.',
      recommendations: [
        'Increase count frequency for your highest-value and fastest-moving SKUs.',
        'Investigate and document the root cause of every significant variance.',
        'Reconcile system stock against physical stock on a fixed schedule.',
      ],
      expectedBenefits: ['More reliable stock data for planning', 'Fewer surprise shortages'],
    },
    Critical: {
      summary: 'Inventory accuracy is low enough that system stock data cannot be trusted for decisions.',
      recommendations: [
        'Run a full physical count as a reset point and correct system records immediately.',
        'Introduce mandatory transaction recording for every stock movement, no exceptions.',
        'Assign a single owner accountable for stock accuracy going forward.',
      ],
      expectedBenefits: ['A trustworthy stock baseline to restart from', 'Reduced risk of over-promising to customers'],
    },
  },

  'warehouse-operations': {
    Excellent: {
      summary: 'Warehouse operations are running efficiently, with well-organized layout and workflows.',
      recommendations: [
        'Benchmark current productivity metrics so future changes can be measured against them.',
        'Cross-train staff to protect efficiency during peak periods or absences.',
      ],
      expectedBenefits: ['Sustained fulfillment speed', 'Resilience to staffing changes'],
    },
    Good: {
      summary: 'Warehouse operations are solid, with a few workflow bottlenecks worth addressing.',
      recommendations: [
        'Map your current pick/pack/ship workflow and identify the slowest step.',
        'Review warehouse layout for fast-moving SKUs to shorten travel distance.',
      ],
      expectedBenefits: ['Faster order fulfillment', 'Reduced labor time per order'],
    },
    'Needs Improvement': {
      summary: 'Warehouse operations have noticeable inefficiencies that are slowing down fulfillment.',
      recommendations: [
        'Reorganize storage so high-velocity SKUs are closest to packing/shipping areas.',
        'Standardize picking and packing procedures across all staff.',
        'Set basic productivity targets (e.g. orders picked per hour) to track improvement.',
      ],
      expectedBenefits: ['Shorter order turnaround time', 'More consistent output across shifts'],
    },
    Critical: {
      summary: 'Warehouse operations are largely unstructured, creating significant delays and errors.',
      recommendations: [
        'Establish a documented layout with clearly labeled storage locations.',
        'Introduce a basic standard operating procedure for receiving, put-away, picking, and shipping.',
        'Identify and eliminate the single biggest bottleneck in the current workflow first.',
      ],
      expectedBenefits: ['Immediate reduction in fulfillment errors', 'A foundation for measurable throughput gains'],
    },
  },

  procurement: {
    Excellent: {
      summary: 'Procurement practices are mature, with strong supplier management and purchasing discipline.',
      recommendations: [
        'Formalize supplier performance reviews on a recurring schedule.',
        'Explore consolidating spend with top-performing suppliers for better terms.',
      ],
      expectedBenefits: ['Stronger supplier relationships', 'Continued cost and lead-time control'],
    },
    Good: {
      summary: 'Procurement is generally well-managed, with room to formalize a few practices.',
      recommendations: [
        'Set clear reorder triggers instead of ad-hoc purchasing decisions.',
        'Track supplier lead-time reliability, not just price.',
      ],
      expectedBenefits: ['More predictable lead times', 'Fewer rush orders at premium cost'],
    },
    'Needs Improvement': {
      summary: 'Procurement has gaps that are likely leading to higher costs or inconsistent supply.',
      recommendations: [
        'Establish minimum order quantities and reorder points by supplier.',
        'Evaluate your top suppliers on price, quality, and reliability together.',
        'Reduce reliance on single-source suppliers for critical items where possible.',
      ],
      expectedBenefits: ['More predictable supply', 'Improved negotiating position with suppliers'],
    },
    Critical: {
      summary: 'Procurement is largely reactive, exposing the business to supply risk and cost overruns.',
      recommendations: [
        'Document a basic purchasing process with defined approval steps.',
        'Identify single-source dependencies on critical items and begin qualifying backup suppliers.',
        'Start tracking supplier lead times to catch reliability issues early.',
      ],
      expectedBenefits: ['Reduced risk of supply disruption', 'Early visibility into cost and lead-time issues'],
    },
  },

  technology: {
    Excellent: {
      summary: 'Technology adoption is strong — systems are well integrated and actively used to run inventory.',
      recommendations: [
        'Keep systems and integrations current as the business scales.',
        'Explore advanced reporting/analytics features already available in your current systems.',
      ],
      expectedBenefits: ['Continued real-time visibility', 'Data-driven decisions across the business'],
    },
    Good: {
      summary: 'Technology is being used effectively, with a few gaps in adoption or integration.',
      recommendations: [
        'Ensure all locations and staff are using the same system consistently.',
        'Connect any remaining manual/spreadsheet processes into the core system.',
      ],
      expectedBenefits: ['Fewer data silos', 'More consistent reporting across the business'],
    },
    'Needs Improvement': {
      summary: 'Technology use is inconsistent, leaving parts of the business reliant on manual processes.',
      recommendations: [
        'Consolidate spreadsheet-based tracking into a single inventory system.',
        'Train all relevant staff on the tools already available but underused.',
        'Set a basic data-entry standard so records stay consistent across users.',
      ],
      expectedBenefits: ['Improved data consistency', 'Less time spent reconciling manual records'],
    },
    Critical: {
      summary: 'Inventory is being managed with little to no supporting technology, limiting visibility and control.',
      recommendations: [
        'Introduce a basic inventory management system, even an entry-level one, as a first step.',
        'Digitize your highest-value SKU records first if a full rollout isn’t immediately feasible.',
        'Retire ad-hoc spreadsheets in favor of a single source of truth as soon as practical.',
      ],
      expectedBenefits: ['Basic real-time stock visibility', 'A foundation for future automation'],
    },
  },

  'inventory-kpis': {
    Excellent: {
      summary: 'KPI tracking is mature — the business has clear, regularly reviewed visibility into inventory performance.',
      recommendations: [
        'Keep KPI reviews on a fixed cadence and tied to concrete follow-up actions.',
        'Consider adding forward-looking KPIs (e.g. forecast accuracy) alongside current operational ones.',
      ],
      expectedBenefits: ['Continued early warning on emerging issues', 'Data-backed decision-making culture'],
    },
    Good: {
      summary: 'KPI tracking is in place and useful, with a few gaps in coverage or consistency.',
      recommendations: [
        'Standardize how core KPIs (turnover, fill rate, accuracy) are calculated and reported.',
        'Share KPI results with the wider team, not just management.',
      ],
      expectedBenefits: ['More consistent performance tracking', 'Wider team accountability'],
    },
    'Needs Improvement': {
      summary: 'KPI tracking is limited, making it hard to spot inventory problems before they escalate.',
      recommendations: [
        'Define a small set of core KPIs to track consistently (e.g. inventory turnover, stockout rate).',
        'Set a monthly review cadence for these KPIs.',
        'Assign ownership for collecting and reporting each KPI.',
      ],
      expectedBenefits: ['Earlier visibility into emerging problems', 'A basis for measuring future improvements'],
    },
    Critical: {
      summary: 'Inventory performance is not being measured, so problems are likely going unnoticed until they’re costly.',
      recommendations: [
        'Start tracking inventory turnover and stockout rate immediately — the two highest-signal KPIs.',
        'Build a simple monthly reporting habit before adding more sophisticated metrics.',
        'Use the current assessment result itself as a baseline to measure progress against.',
      ],
      expectedBenefits: ['First visibility into where inventory problems actually are', 'A measurable starting point for improvement'],
    },
  },

  'risk-compliance': {
    Excellent: {
      summary: 'Risk and compliance practices are strong, with clear controls and contingency planning in place.',
      recommendations: [
        'Review contingency plans annually to keep them current with the business.',
        'Extend current compliance practices to any new locations, suppliers, or product lines.',
      ],
      expectedBenefits: ['Continued resilience to disruption', 'Reduced regulatory and compliance exposure'],
    },
    Good: {
      summary: 'Risk and compliance practices are reasonably solid, with a few gaps worth closing.',
      recommendations: [
        'Document contingency plans for your most critical suppliers or SKUs.',
        'Review compliance requirements relevant to your industry at least annually.',
      ],
      expectedBenefits: ['Reduced exposure to single points of failure', 'Fewer compliance surprises'],
    },
    'Needs Improvement': {
      summary: 'Risk and compliance gaps leave the business exposed to disruption or regulatory issues.',
      recommendations: [
        'Identify your top single points of failure (key suppliers, key SKUs, key staff) and plan around them.',
        'Confirm current practices meet relevant industry compliance requirements.',
        'Put a basic incident/contingency plan in writing for critical disruptions.',
      ],
      expectedBenefits: ['Reduced business disruption risk', 'Improved regulatory standing'],
    },
    Critical: {
      summary: 'Risk and compliance practices are minimal, leaving the business significantly exposed.',
      recommendations: [
        'Conduct a basic risk assessment covering suppliers, storage, and compliance obligations this quarter.',
        'Address any known regulatory gaps immediately, prioritizing the highest-risk items.',
        'Establish a simple written contingency plan for your most critical dependency.',
      ],
      expectedBenefits: ['Materially reduced exposure to disruption', 'A documented starting point for ongoing risk management'],
    },
  },
};

/**
 * Fallback content for any module ID not present in RECOMMENDATION_DATA
 * above — keeps the engine data-driven and non-crashing if the
 * question bank ever gains a module before its recommendation copy is
 * written, rather than requiring an engine code change.
 */
export const DEFAULT_MODULE_RECOMMENDATIONS: ModuleRecommendationConfig = {
  Excellent: {
    summary: 'This area is a genuine strength for the business.',
    recommendations: ['Maintain current practices and monitor for any drift over time.'],
    expectedBenefits: ['Continued strong performance in this area'],
  },
  Good: {
    summary: 'This area is performing well, with some room for improvement.',
    recommendations: ['Review current practices for specific gaps and address them incrementally.'],
    expectedBenefits: ['Incremental performance gains'],
  },
  'Needs Improvement': {
    summary: 'This area has meaningful gaps that are worth addressing soon.',
    recommendations: ['Review current practices against industry standards and prioritize the biggest gaps.'],
    expectedBenefits: ['Reduced operational risk in this area'],
  },
  Critical: {
    summary: 'This area needs urgent attention.',
    recommendations: ['Treat this as a priority area and begin addressing the most critical gaps immediately.'],
    expectedBenefits: ['Reduced risk of significant business impact'],
  },
};

/** Overall, business-level summary shown alongside the overall score. */
export const OVERALL_SUMMARIES: Record<HealthRating, string> = {
  Excellent: 'Your inventory management practices are excellent overall, with strong, well-established processes across most areas.',
  Good: 'Your inventory management practices are solid overall, with a few targeted areas that would benefit from attention.',
  'Needs Improvement': 'Your inventory management practices show meaningful gaps that are likely affecting costs, service levels, or accuracy.',
  Critical: 'Your inventory management practices need urgent attention — several core areas are creating significant business risk.',
};
