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
      businessImpact: 'Reliable planning gives the business a strong foundation for cash-efficient purchasing and dependable customer service levels.',
      recommendations: [
        'Document current forecasting methods so the practice survives staff turnover.',
        'Pilot more advanced demand-sensing techniques on your highest-value SKUs.',
      ],
      expectedBenefits: ['Sustained forecast accuracy', 'A repeatable process the wider team can rely on'],
    },
    Good: {
      summary: 'Inventory planning is solid overall, with room to tighten a few specific practices.',
      businessImpact: 'Occasional forecast misses are likely producing localized stockouts or overstock rather than a systemic capital or service risk.',
      recommendations: [
        'Review forecast accuracy by SKU category and address the weakest categories first.',
        'Set a regular cadence for revisiting reorder points as demand shifts.',
      ],
      expectedBenefits: ['Fewer stockouts and overstocks', 'More consistent planning across product lines'],
    },
    'Needs Improvement': {
      summary: 'Inventory planning has meaningful gaps that are likely contributing to stock imbalances.',
      businessImpact: 'Poor forecasting is likely driving avoidable emergency purchases and tied-up working capital in overstock, while leaving other lines inconsistently available.',
      recommendations: [
        'Introduce a formal demand-forecasting process instead of relying on gut feel.',
        'Set minimum/maximum stock levels for your top-moving SKUs.',
        'Review and adjust safety stock levels at least quarterly.',
      ],
      expectedBenefits: ['Reduced emergency ordering', 'Lower carrying costs on slow-moving stock'],
    },
    Critical: {
      summary: 'Inventory planning is largely reactive right now, creating real risk of stockouts and excess stock.',
      businessImpact: 'Reactive planning at this level exposes the business to recurring stockouts on demand items and excess capital locked in slow-moving stock, both of which directly affect cash flow and customer trust.',
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
      businessImpact: 'Strong control keeps shrinkage low and gives management stock data it can act on with confidence.',
      recommendations: [
        'Extend current control practices to any newly added locations or SKUs.',
        'Periodically audit control procedures to confirm they still match how the business actually operates.',
      ],
      expectedBenefits: ['Continued low shrinkage', 'Reliable stock data for decision-making'],
    },
    Good: {
      summary: 'Inventory control is generally reliable, with a few process gaps worth closing.',
      businessImpact: 'Minor process gaps create isolated discrepancies that are manageable today but can compound into larger accuracy problems as the business scales.',
      recommendations: [
        'Standardize stock movement procedures (receiving, transfers, issues) across all locations.',
        'Introduce spot-checks between full physical counts.',
      ],
      expectedBenefits: ['More consistent stock accuracy', 'Faster identification of discrepancies'],
    },
    'Needs Improvement': {
      summary: 'Inventory control gaps are creating avoidable discrepancies between recorded and actual stock.',
      businessImpact: 'Control gaps at this level are likely producing recurring stock discrepancies that distort inventory valuation and complicate reordering decisions.',
      recommendations: [
        'Define and document a standard process for every stock movement type.',
        'Assign clear ownership for stock control at each location.',
        'Move to more frequent cycle counts instead of relying on annual counts.',
      ],
      expectedBenefits: ['Reduced stock discrepancies', 'Clearer accountability across the team'],
    },
    Critical: {
      summary: 'Inventory control is largely informal, which is a major driver of stock discrepancies and loss.',
      businessImpact: 'Informal control materially increases the risk of unexplained stock loss and unreliable inventory data, undermining both financial reporting and day-to-day operational decisions.',
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
      businessImpact: 'High accuracy means system stock data can be trusted for planning, reducing the safety stock needed to protect service levels.',
      recommendations: [
        'Keep the current counting cadence and root-cause process for any variance found.',
        'Use the high accuracy level to support tighter safety stock and better working capital use.',
      ],
      expectedBenefits: ['Continued trust in system stock data', 'Room to reduce buffer stock without added risk'],
    },
    Good: {
      summary: 'Inventory accuracy is good, with occasional variances that are worth tracking down.',
      businessImpact: 'Occasional variances create minor planning friction but do not yet threaten overall confidence in system stock data.',
      recommendations: [
        'Track variance root causes by category to spot recurring patterns.',
        'Tighten data-entry discipline at the point of stock movement.',
      ],
      expectedBenefits: ['Fewer recurring variances', 'More confidence in system stock levels'],
    },
    'Needs Improvement': {
      summary: 'Inventory accuracy gaps are large enough to affect planning and customer commitments.',
      businessImpact: 'Accuracy gaps at this level can lead to overpromising to customers, misinformed purchasing decisions, and inflated safety stock to compensate for the uncertainty.',
      recommendations: [
        'Increase count frequency for your highest-value and fastest-moving SKUs.',
        'Investigate and document the root cause of every significant variance.',
        'Reconcile system stock against physical stock on a fixed schedule.',
      ],
      expectedBenefits: ['More reliable stock data for planning', 'Fewer surprise shortages'],
    },
    Critical: {
      summary: 'Inventory accuracy is low enough that system stock data cannot be trusted for decisions.',
      businessImpact: 'Unreliable stock data at this level puts the business at risk of stockouts, order cancellations, and purchasing decisions based on numbers that do not reflect physical reality.',
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
      summary: 'Store / warehouse operations are running efficiently, with well-organized layout and workflows.',
      businessImpact: 'Efficient operations keep fulfillment cost per order low and support consistent delivery commitments to customers.',
      recommendations: [
        'Benchmark current productivity metrics so future changes can be measured against them.',
        'Cross-train staff to protect efficiency during peak periods or absences.',
      ],
      expectedBenefits: ['Sustained fulfillment speed', 'Resilience to staffing changes'],
    },
    Good: {
      summary: 'Store / warehouse operations are solid, with a few workflow bottlenecks worth addressing.',
      businessImpact: 'Workflow bottlenecks are adding avoidable labor time and delay to order fulfillment without yet threatening service commitments.',
      recommendations: [
        'Map your current pick/pack/ship workflow and identify the slowest step.',
        'Review warehouse layout for fast-moving SKUs to shorten travel distance.',
      ],
      expectedBenefits: ['Faster order fulfillment', 'Reduced labor time per order'],
    },
    'Needs Improvement': {
      summary: 'Store / warehouse operations have noticeable inefficiencies that are slowing down fulfillment.',
      businessImpact: 'Operational inefficiencies at this level are likely increasing labor cost per order and slowing fulfillment enough to affect customer experience.',
      recommendations: [
        'Reorganize storage so high-velocity SKUs are closest to packing/shipping areas.',
        'Standardize picking and packing procedures across all staff.',
        'Set basic productivity targets (e.g. orders picked per hour) to track improvement.',
      ],
      expectedBenefits: ['Shorter order turnaround time', 'More consistent output across shifts'],
    },
    Critical: {
      summary: 'Store / warehouse operations are largely unstructured, creating significant delays and errors.',
      businessImpact: 'Unstructured operations create a high risk of fulfillment errors and missed delivery commitments, with labor costs that scale poorly as order volume grows.',
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
      businessImpact: 'Mature procurement practices protect margins and reduce exposure to supply disruption.',
      recommendations: [
        'Formalize supplier performance reviews on a recurring schedule.',
        'Explore consolidating spend with top-performing suppliers for better terms.',
      ],
      expectedBenefits: ['Stronger supplier relationships', 'Continued cost and lead-time control'],
    },
    Good: {
      summary: 'Procurement is generally well-managed, with room to formalize a few practices.',
      businessImpact: 'A few informal practices are likely creating minor cost or lead-time variability rather than material supply risk.',
      recommendations: [
        'Set clear reorder triggers instead of ad-hoc purchasing decisions.',
        'Track supplier lead-time reliability, not just price.',
      ],
      expectedBenefits: ['More predictable lead times', 'Fewer rush orders at premium cost'],
    },
    'Needs Improvement': {
      summary: 'Procurement has gaps that are likely leading to higher costs or inconsistent supply.',
      businessImpact: 'Procurement gaps at this level are likely increasing purchase costs and creating supply inconsistency that can ripple into stockouts or rush-order premiums.',
      recommendations: [
        'Establish minimum order quantities and reorder points by supplier.',
        'Evaluate your top suppliers on price, quality, and reliability together.',
        'Reduce reliance on single-source suppliers for critical items where possible.',
      ],
      expectedBenefits: ['More predictable supply', 'Improved negotiating position with suppliers'],
    },
    Critical: {
      summary: 'Procurement is largely reactive, exposing the business to supply risk and cost overruns.',
      businessImpact: 'Reactive procurement exposes the business to supply disruption and cost overruns, particularly where single-source suppliers are involved.',
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
      businessImpact: 'Strong technology adoption gives management real-time visibility to make faster, better-informed inventory decisions.',
      recommendations: [
        'Keep systems and integrations current as the business scales.',
        'Explore advanced reporting/analytics features already available in your current systems.',
      ],
      expectedBenefits: ['Continued real-time visibility', 'Data-driven decisions across the business'],
    },
    Good: {
      summary: 'Technology is being used effectively, with a few gaps in adoption or integration.',
      businessImpact: 'A few adoption gaps are limiting how much value the business gets from systems it has already invested in.',
      recommendations: [
        'Ensure all locations and staff are using the same system consistently.',
        'Connect any remaining manual/spreadsheet processes into the core system.',
      ],
      expectedBenefits: ['Fewer data silos', 'More consistent reporting across the business'],
    },
    'Needs Improvement': {
      summary: 'Technology use is inconsistent, leaving parts of the business reliant on manual processes.',
      businessImpact: 'Inconsistent technology use is likely creating data silos that slow down decision-making and increase the effort needed to keep records accurate.',
      recommendations: [
        'Consolidate spreadsheet-based tracking into a single inventory system.',
        'Train all relevant staff on the tools already available but underused.',
        'Set a basic data-entry standard so records stay consistent across users.',
      ],
      expectedBenefits: ['Improved data consistency', 'Less time spent reconciling manual records'],
    },
    Critical: {
      summary: 'Inventory is being managed with little to no supporting technology, limiting visibility and control.',
      businessImpact: 'Minimal technology support severely limits inventory visibility, making it difficult to catch problems early or make timely purchasing and fulfillment decisions.',
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
      businessImpact: 'Mature KPI tracking gives management an early-warning system for inventory issues before they become costly.',
      recommendations: [
        'Keep KPI reviews on a fixed cadence and tied to concrete follow-up actions.',
        'Consider adding forward-looking KPIs (e.g. forecast accuracy) alongside current operational ones.',
      ],
      expectedBenefits: ['Continued early warning on emerging issues', 'Data-backed decision-making culture'],
    },
    Good: {
      summary: 'KPI tracking is in place and useful, with a few gaps in coverage or consistency.',
      businessImpact: 'KPI coverage is useful but gaps in consistency may mean some emerging issues are not being caught early.',
      recommendations: [
        'Standardize how core KPIs (turnover, fill rate, accuracy) are calculated and reported.',
        'Share KPI results with the wider team, not just management.',
      ],
      expectedBenefits: ['More consistent performance tracking', 'Wider team accountability'],
    },
    'Needs Improvement': {
      summary: 'KPI tracking is limited, making it hard to spot inventory problems before they escalate.',
      businessImpact: 'Limited KPI visibility means inventory problems are likely being identified late, after they have already affected cost or service levels.',
      recommendations: [
        'Define a small set of core KPIs to track consistently (e.g. inventory turnover, stockout rate).',
        'Set a monthly review cadence for these KPIs.',
        'Assign ownership for collecting and reporting each KPI.',
      ],
      expectedBenefits: ['Earlier visibility into emerging problems', 'A basis for measuring future improvements'],
    },
    Critical: {
      summary: 'Inventory performance is not being measured, so problems are likely going unnoticed until they’re costly.',
      businessImpact: 'Without performance measurement, inventory problems are likely accumulating unnoticed, and management has no reliable way to gauge whether the business is improving or deteriorating.',
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
      businessImpact: 'Strong risk and compliance practices protect the business from disruption and reduce regulatory exposure.',
      recommendations: [
        'Review contingency plans annually to keep them current with the business.',
        'Extend current compliance practices to any new locations, suppliers, or product lines.',
      ],
      expectedBenefits: ['Continued resilience to disruption', 'Reduced regulatory and compliance exposure'],
    },
    Good: {
      summary: 'Risk and compliance practices are reasonably solid, with a few gaps worth closing.',
      businessImpact: 'A few contingency gaps are manageable today but could become material if a key supplier, SKU, or staff dependency is disrupted.',
      recommendations: [
        'Document contingency plans for your most critical suppliers or SKUs.',
        'Review compliance requirements relevant to your industry at least annually.',
      ],
      expectedBenefits: ['Reduced exposure to single points of failure', 'Fewer compliance surprises'],
    },
    'Needs Improvement': {
      summary: 'Risk and compliance gaps leave the business exposed to disruption or regulatory issues.',
      businessImpact: 'Risk and compliance gaps at this level leave the business exposed to disruption from single points of failure and potential regulatory issues that are not yet being tracked.',
      recommendations: [
        'Identify your top single points of failure (key suppliers, key SKUs, key staff) and plan around them.',
        'Confirm current practices meet relevant industry compliance requirements.',
        'Put a basic incident/contingency plan in writing for critical disruptions.',
      ],
      expectedBenefits: ['Reduced business disruption risk', 'Improved regulatory standing'],
    },
    Critical: {
      summary: 'Risk and compliance practices are minimal, leaving the business significantly exposed.',
      businessImpact: 'Minimal risk management leaves the business significantly exposed — a single supplier failure, compliance lapse, or operational disruption could have an outsized impact with no contingency in place.',
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
    businessImpact: 'This is a genuine strength that supports overall business performance.',
    recommendations: ['Maintain current practices and monitor for any drift over time.'],
    expectedBenefits: ['Continued strong performance in this area'],
  },
  Good: {
    summary: 'This area is performing well, with some room for improvement.',
    businessImpact: 'Performance here is generally supporting the business, with limited but real room for improvement.',
    recommendations: ['Review current practices for specific gaps and address them incrementally.'],
    expectedBenefits: ['Incremental performance gains'],
  },
  'Needs Improvement': {
    summary: 'This area has meaningful gaps that are worth addressing soon.',
    businessImpact: 'Gaps in this area are likely creating avoidable cost, risk, or inefficiency for the business.',
    recommendations: ['Review current practices against industry standards and prioritize the biggest gaps.'],
    expectedBenefits: ['Reduced operational risk in this area'],
  },
  Critical: {
    summary: 'This area needs urgent attention.',
    businessImpact: 'This area represents a significant business risk that warrants urgent management attention.',
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
