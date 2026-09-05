import {
  ClipboardCheck,
  ClipboardList,
  Boxes,
  BarChart3,
  Layers,
  CalendarClock,
  PackageX,
  Timer,
  TrendingUp,
  Repeat,
  ArrowDownUp,
  ShoppingCart,
  ClipboardPen,
  FileText,
  Workflow,
  Gauge,
  Store,
} from 'lucide-react';
import type { ServiceCategory } from './serviceTypes';

/**
 * Vertical 1 — Inventory & Operations Consulting. One dedicated page per
 * entry, rendered by the shared ServiceLandingView template at
 * /services/inventory-operations-consulting/:slug (see features/services).
 */
export const INVENTORY_SERVICES: ServiceCategory[] = [
  {
    icon: ClipboardCheck,
    slug: 'inventory-audit',
    path: '/services/inventory-operations-consulting/inventory-audit',
    title: 'Inventory Audit',
    description: 'A structured physical stock check against your records, built around pharmacy and healthcare stock patterns.',
    services: [
      'Full or cycle-count physical verification',
      'Batch and expiry-aware counting for pharmacy stock',
      'Discrepancy identification by SKU and location',
      'Root-cause analysis, not just a variance number',
      'Written findings report with corrective actions',
    ],
    metaDescription:
      'Inventory audits from Nitin Anand Consulting for pharmacies, medical stores, and healthcare businesses — batch and expiry-aware physical verification with a clear discrepancy report.',
    intro:
      'A pharmacy or medical store carries stock with batch numbers, expiry dates, and Schedule-drug handling that a generic inventory audit checklist ignores. Our inventory audits are built around how pharmacy and healthcare stock actually moves — physical verification against records, with discrepancies traced to a cause, not just a number. Based in Mumbai, we run these audits in person across Mumbai, the MMR, and wider Maharashtra.',
    benefits: [
      { title: 'Know What You Actually Have', description: 'A verified, current picture of stock on hand — not just what the register or software says.' },
      { title: 'Fewer Billing and Compliance Surprises', description: 'Catch mismatches, mis-shelved batches, and record gaps before they become a bigger problem.' },
      { title: 'A Clear Action List', description: 'Findings translated into specific next steps, not a raw discrepancy spreadsheet.' },
    ],
    faqs: [
      {
        question: 'How is a pharmacy inventory audit different from a general retail audit?',
        answer:
          'It accounts for batch/expiry tracking, Schedule H/H1 drug handling, and the specific way pharmacy stock is shelved and dispensed — a general retail count checklist misses these.',
      },
      {
        question: 'Do you audit the whole store, or specific categories?',
        answer:
          'Either — a full physical verification, or a focused audit on a specific category, supplier, or high-value SKU group, depending on what you need.',
      },
    ],
  },
  {
    icon: ClipboardList,
    slug: 'stock-verification',
    path: '/services/inventory-operations-consulting/stock-verification',
    title: 'Stock Verification',
    description: 'Independent, periodic verification of stock on hand — a lighter-weight check than a full audit.',
    services: [
      'Scheduled cycle counts by category or shelf',
      'Spot checks on high-value or high-movement SKUs',
      'Verification against purchase and sales records',
      'Simple, repeatable count procedures your team can run',
    ],
    metaDescription:
      'Stock verification services from Nitin Anand Consulting — periodic, repeatable cycle counts for pharmacies and healthcare businesses that catch drift before it becomes a full audit problem.',
    intro:
      'Waiting for an annual audit to find out your records have drifted from reality is expensive. Stock verification is the lighter-weight, periodic check in between — a repeatable process your team can run to catch drift early.',
    benefits: [
      { title: 'Catch Drift Early', description: 'Regular checks surface small discrepancies before they compound into a large one.' },
      { title: 'Repeatable, Not One-Off', description: 'A simple procedure your own team can run between full audits.' },
      { title: 'Focused Where It Matters', description: 'Prioritized on high-value and high-movement stock rather than counting everything, every time.' },
    ],
    faqs: [
      {
        question: 'How often should stock verification happen?',
        answer:
          'It depends on stock value and movement — high-value or fast-moving categories typically warrant monthly or quarterly checks; we help set a realistic cadence for your operation.',
      },
      {
        question: 'Can our own staff run this after you set it up?',
        answer:
          'Yes — the goal is a documented, repeatable procedure your team owns going forward, with periodic outside checks if you want an independent view.',
      },
    ],
  },
  {
    icon: Boxes,
    slug: 'inventory-reconciliation',
    path: '/services/inventory-operations-consulting/inventory-reconciliation',
    title: 'Inventory Reconciliation',
    description: 'Closing the gap between what your system says and what a physical count found — with a documented cause.',
    services: [
      'Line-by-line reconciliation of counted vs. recorded stock',
      'Categorization of variances (shrinkage, data entry, timing, expiry write-off)',
      'Adjustment recommendations with an audit trail',
      'Recurring-cause identification, not just one-time fixes',
    ],
    metaDescription:
      'Inventory reconciliation from Nitin Anand Consulting — closing the gap between recorded and actual stock for pharmacies and healthcare businesses, with variances traced to a documented cause.',
    intro:
      'A count is only useful once the variances are explained. Inventory reconciliation takes the raw discrepancy list from an audit or stock verification and works through each line until every gap has a documented, categorized cause — not just an adjusted number in the system.',
    benefits: [
      { title: 'Adjustments You Can Trust', description: 'Every correction backed by a documented reason, not a guess.' },
      { title: 'Recurring Issues Surfaced', description: 'Patterns across variances point to a process fix, not just a one-time correction.' },
      { title: 'Clean Audit Trail', description: 'Documentation that holds up to internal review.' },
    ],
    faqs: [
      {
        question: 'What happens after reconciliation is complete?',
        answer:
          'You get a categorized variance report and recommended system adjustments — plus, if a pattern emerges (like a specific supplier or category), a note on the likely root cause.',
      },
      {
        question: 'Is this a one-time service or ongoing?',
        answer: 'Both are available — a one-time reconciliation after an audit, or a recurring cadence tied to your stock verification schedule.',
      },
    ],
  },
  {
    icon: BarChart3,
    slug: 'inventory-analysis',
    path: '/services/inventory-operations-consulting/inventory-analysis',
    title: 'Inventory Analysis',
    description: 'A structured look at how your stock actually performs — turnover, coverage, and category-level trends.',
    services: [
      'Stock turnover and days-of-cover analysis by category',
      'Category and supplier performance review',
      'Trend identification (seasonality, slow build-up, over-ordering)',
      'Findings translated into specific recommendations',
    ],
    metaDescription:
      'Inventory analysis from Nitin Anand Consulting — turnover, coverage, and category performance analysis for pharmacies, medical stores, and healthcare businesses.',
    intro:
      'Most pharmacies and medical stores already generate enough sales and purchase data to answer "what\'s actually happening with our stock?" — the data just isn\'t being looked at that way. Inventory analysis turns your existing records into turnover, coverage, and category-performance findings you can act on.',
    benefits: [
      { title: 'See What\'s Actually Happening', description: 'Turnover and coverage numbers by category, not a gut feeling.' },
      { title: 'Spot Over-Ordering Early', description: 'Trend analysis flags categories quietly building up excess stock.' },
      { title: 'A Starting Point for Optimization', description: 'The analysis that ABC/FSN, dead-stock, and reorder-level work builds on.' },
    ],
    faqs: [
      {
        question: 'What data do you need from us for this?',
        answer: 'Typically purchase and sales records for a recent period — from your billing software, POS, or even organized spreadsheets.',
      },
      {
        question: 'How does this relate to ABC/FSN analysis?',
        answer: 'Inventory analysis is the broader diagnostic; ABC and FSN analysis are specific, more targeted classification techniques we often apply as part of it.',
      },
    ],
  },
  {
    icon: Layers,
    slug: 'abc-analysis',
    path: '/services/inventory-operations-consulting/abc-analysis',
    title: 'ABC Analysis',
    description: 'Classifying your SKUs by value contribution so the highest-impact stock gets the tightest control.',
    services: [
      'SKU classification into A/B/C value bands',
      'Category-specific control recommendations per band',
      'Reorder and review-frequency guidance by classification',
      'A refreshable framework, not a one-time snapshot',
    ],
    metaDescription:
      'ABC analysis from Nitin Anand Consulting — classify pharmacy and healthcare stock by value contribution so high-impact SKUs get the tightest inventory control.',
    intro:
      'Not every SKU deserves the same level of attention. ABC analysis ranks your stock by value contribution — typically a small share of SKUs driving most of your inventory value — so you can apply tighter control where it actually matters and lighter-touch management everywhere else.',
    benefits: [
      { title: 'Focus Where It Counts', description: 'Tighter monitoring on the SKUs actually driving your inventory value.' },
      { title: 'Lighter Overhead Elsewhere', description: 'Simpler review cycles for low-value, low-impact stock.' },
      { title: 'A Reusable Framework', description: 'Re-run periodically as your product mix shifts.' },
    ],
    faqs: [
      {
        question: 'How is ABC analysis different from FSN analysis?',
        answer:
          'ABC classifies by value contribution; FSN classifies by movement speed (fast/slow/non-moving). They\'re often used together for a fuller picture.',
      },
      {
        question: 'How often should we redo this?',
        answer: 'Typically annually, or whenever your product mix or supplier base changes significantly.',
      },
    ],
  },
  {
    icon: Timer,
    slug: 'fsn-analysis',
    path: '/services/inventory-operations-consulting/fsn-analysis',
    title: 'FSN Analysis',
    description: 'Classifying stock by movement speed — Fast, Slow, and Non-moving — to guide stocking and clearance decisions.',
    services: [
      'SKU classification by movement velocity',
      'Fast-moving stock availability recommendations',
      'Slow and non-moving stock flags for review',
      'Combined ABC-FSN cross-analysis on request',
    ],
    metaDescription:
      'FSN analysis from Nitin Anand Consulting — classify pharmacy and medical store stock as fast, slow, or non-moving to guide stocking, reorder, and clearance decisions.',
    intro:
      'Value and movement speed aren\'t the same thing — a high-value SKU can still move slowly, and a cheap one can turn over fast. FSN analysis classifies your stock by movement velocity so you know exactly what to keep well-stocked and what needs a clearance or discontinuation decision.',
    benefits: [
      { title: 'Better Availability on Fast Movers', description: 'Make sure the stock your customers actually buy regularly is never out.' },
      { title: 'Early Warning on Slow Stock', description: 'Flag slow and non-moving SKUs before they become a bigger dead-stock problem.' },
      { title: 'Informed Clearance Decisions', description: 'Data-backed calls on what to discount, return, or discontinue.' },
    ],
    faqs: [
      {
        question: 'What counts as "non-moving" stock?',
        answer: 'Typically SKUs with no sales over a defined period (e.g. 6-12 months) — the exact threshold is set based on your category and shelf-life norms.',
      },
      {
        question: 'What happens after slow/non-moving stock is identified?',
        answer: 'We provide recommendations — clearance, return-to-supplier, reformulated reorder levels, or discontinuation — you decide what to act on.',
      },
    ],
  },
  {
    icon: CalendarClock,
    slug: 'expiry-near-expiry-analysis',
    path: '/services/inventory-operations-consulting/expiry-near-expiry-analysis',
    title: 'Expiry / Near-Expiry Analysis',
    description: 'Identifying stock approaching expiry early enough to act — return, discount, or reallocate — instead of writing it off.',
    services: [
      'Batch-level expiry date mapping across stock',
      'Near-expiry alerts by defined lead-time window',
      'Return-to-supplier and clearance opportunity flags',
      'Recommendations to reduce future expiry write-offs',
    ],
    metaDescription:
      'Expiry and near-expiry stock analysis from Nitin Anand Consulting for pharmacies and medical stores — batch-level tracking that surfaces at-risk stock before it becomes a write-off.',
    intro:
      'Expiry write-offs are one of the most direct, measurable costs in pharmacy and healthcare retail — and one of the most preventable, if near-expiry stock is flagged early enough to act on. This analysis maps expiry dates at the batch level and surfaces what needs attention now.',
    benefits: [
      { title: 'Act Before Write-Off', description: 'Enough lead time to return, discount, or reallocate stock instead of losing it.' },
      { title: 'Fewer Repeat Losses', description: 'Root-cause findings on why certain categories consistently expire unsold.' },
      { title: 'A Defensible Process', description: 'Documented expiry monitoring that supports better purchasing decisions going forward.' },
    ],
    faqs: [
      {
        question: 'Can this run as an ongoing process, not a one-time check?',
        answer: 'Yes — we can set up a recurring near-expiry review cadence and lead-time thresholds your team maintains directly.',
      },
      {
        question: 'Does this cover Schedule drugs specifically?',
        answer: 'The analysis covers your full stock; specific regulatory handling of any Schedule drug categories remains your pharmacy\'s compliance responsibility.',
      },
    ],
  },
  {
    icon: PackageX,
    slug: 'dead-stock-analysis',
    path: '/services/inventory-operations-consulting/dead-stock-analysis',
    title: 'Dead Stock Analysis',
    description: 'Identifying stock that has stopped moving entirely, and what to realistically do about it.',
    services: [
      'Dead stock identification by category and value',
      'Root-cause review (discontinued line, poor placement, over-ordering)',
      'Recovery options: return, liquidate, or repurpose',
      'Recommendations to prevent recurrence',
    ],
    metaDescription:
      'Dead stock analysis from Nitin Anand Consulting — identify and address non-moving inventory in pharmacies and healthcare businesses, with root-cause findings to prevent recurrence.',
    intro:
      'Dead stock ties up capital and shelf space with no return. This analysis identifies exactly what has stopped moving, why, and what recovery options are realistically available — plus what to change so it doesn\'t keep happening.',
    benefits: [
      { title: 'Free Up Capital and Space', description: 'A clear-out plan for stock that\'s no longer earning its shelf space.' },
      { title: 'Understand the Root Cause', description: 'Know whether it\'s a purchasing, placement, or demand problem — not just a symptom.' },
      { title: 'Prevent Recurrence', description: 'Specific process changes to catch the next dead-stock category earlier.' },
    ],
    faqs: [
      {
        question: 'What can actually be done with dead stock once identified?',
        answer:
          'Options depend on the category — supplier returns, discounted clearance, bundling, or in some cases write-off — we help you weigh what\'s realistic.',
      },
      {
        question: 'How is this different from slow-moving stock analysis?',
        answer: 'Dead stock has effectively stopped moving entirely; slow-moving stock still sells, just below a healthy turnover rate.',
      },
    ],
  },
  {
    icon: TrendingUp,
    slug: 'slow-moving-stock-analysis',
    path: '/services/inventory-operations-consulting/slow-moving-stock-analysis',
    title: 'Slow Moving Stock Analysis',
    description: 'Catching stock that is turning over too slowly before it becomes dead stock.',
    services: [
      'Turnover-rate analysis flagging below-threshold SKUs',
      'Category and supplier-level slow-mover patterns',
      'Reorder and promotion recommendations to accelerate turnover',
      'Early-warning thresholds your team can monitor going forward',
    ],
    metaDescription:
      'Slow-moving stock analysis from Nitin Anand Consulting for pharmacies and healthcare businesses — catch declining turnover early, before it becomes dead stock.',
    intro:
      'Slow-moving stock is the warning sign that comes before dead stock — still selling, just not fast enough to justify current stock levels. Catching it here, rather than after it stalls completely, gives you far more options.',
    benefits: [
      { title: 'Earlier Intervention', description: 'Act while stock is still moving, when there are more recovery options.' },
      { title: 'Better Reorder Decisions', description: 'Stop replenishing slow movers at the same rate as fast ones.' },
      { title: 'Ongoing Monitoring', description: 'Thresholds and a review cadence your team can run independently.' },
    ],
    faqs: [
      {
        question: 'What turnover rate counts as "slow"?',
        answer: 'It varies by category and shelf-life — we set thresholds specific to your product mix rather than a generic industry number.',
      },
      {
        question: 'Can this feed directly into reorder level changes?',
        answer: 'Yes — findings here typically feed straight into our reorder/min-max and stock optimization work.',
      },
    ],
  },
  {
    icon: Gauge,
    slug: 'stock-optimization',
    path: '/services/inventory-operations-consulting/stock-optimization',
    title: 'Stock Optimization',
    description: 'Right-sizing stock levels so you carry enough to serve customers without tying up excess capital.',
    services: [
      'Stock-level review against actual demand patterns',
      'Category-specific optimization targets',
      'Balance of availability vs. carrying cost',
      'Implementation support for revised stock levels',
    ],
    metaDescription:
      'Stock optimization consulting from Nitin Anand Consulting — right-size inventory levels for pharmacies and medical stores to balance availability against carrying cost.',
    intro:
      'Too much stock ties up capital and risks expiry; too little means stockouts and lost sales. Stock optimization sets levels for each category based on actual demand — not last year\'s habits — so you\'re carrying the right amount, not just a comfortable amount.',
    benefits: [
      { title: 'Less Capital Tied Up', description: 'Reduced excess stock without compromising availability.' },
      { title: 'Fewer Stockouts', description: 'Right-sized levels for genuinely fast-moving, customer-critical SKUs.' },
      { title: 'A Framework, Not a One-Time Fix', description: 'Optimization logic your team can reapply as demand shifts.' },
    ],
    faqs: [
      {
        question: 'How does this relate to reorder/min-max levels?',
        answer: 'Stock optimization sets the target levels; reorder/min-max implementation is how those targets get operationalized day-to-day.',
      },
      {
        question: 'What inputs do you need to do this well?',
        answer: 'Historical sales data, current stock levels, and supplier lead times are the core inputs — more history generally means better-tuned targets.',
      },
    ],
  },
  {
    icon: Repeat,
    slug: 'fefo-implementation',
    path: '/services/inventory-operations-consulting/fefo-implementation',
    title: 'FEFO Implementation',
    description: 'Setting up First-Expiry-First-Out stock rotation so older batches move before newer ones.',
    services: [
      'Shelf and storage layout review for FEFO compliance',
      'Batch-labeling and rotation procedure design',
      'Staff training on FEFO handling',
      'Ongoing compliance checks',
    ],
    metaDescription:
      'FEFO implementation from Nitin Anand Consulting — First-Expiry-First-Out stock rotation setup and staff training for pharmacies and healthcare businesses to reduce expiry losses.',
    intro:
      'FEFO — First-Expiry-First-Out — is the rotation discipline that keeps older-dated batches moving before newer ones sit unsold behind them. We help design the shelving, labeling, and handling procedures that make FEFO the default behavior on your floor, not just a policy on paper.',
    benefits: [
      { title: 'Fewer Expiry Write-Offs', description: 'Older batches sell through before they become a loss.' },
      { title: 'A Procedure Staff Actually Follow', description: 'Practical shelf/label design, not just a rule nobody checks.' },
      { title: 'Built for Your Layout', description: 'Rotation procedures designed around your actual shelving and storage, not a generic template.' },
    ],
    faqs: [
      {
        question: 'Do you redesign our shelving, or just the procedure?',
        answer: 'Both, as needed — shelf/bin layout changes where they help, and the labeling/rotation procedure your staff follows day to day.',
      },
      {
        question: 'How is FEFO different from FIFO?',
        answer: 'FIFO rotates by receipt date; FEFO rotates by expiry date — for pharmacy and healthcare stock, expiry date is almost always the more important sequence.',
      },
    ],
  },
  {
    icon: ArrowDownUp,
    slug: 'reorder-min-max',
    path: '/services/inventory-operations-consulting/reorder-min-max',
    title: 'Reorder / Min-Max',
    description: 'Setting reorder points and min-max stock levels so replenishment happens at the right time, automatically.',
    services: [
      'Reorder point calculation by SKU or category',
      'Min-max level setting based on demand and lead time',
      'Safety stock recommendations for critical SKUs',
      'Documentation your team or software can apply directly',
    ],
    metaDescription:
      'Reorder point and min-max stock level setup from Nitin Anand Consulting — practical replenishment rules for pharmacies and medical stores, based on real demand and lead times.',
    intro:
      'Reordering by instinct leads to either stockouts or excess. We calculate reorder points and min-max levels from your actual demand and supplier lead times, so replenishment decisions become a rule to follow, not a judgment call every time.',
    benefits: [
      { title: 'Fewer Emergency Orders', description: 'Reorder points set with real lead-time buffers, not guesswork.' },
      { title: 'Less Excess Stock', description: 'Max levels that reflect actual demand, not habit.' },
      { title: 'Works With What You Have', description: 'Rules documented so they can be applied manually or fed into your existing billing/inventory software.' },
    ],
    faqs: [
      {
        question: 'Do we need special software to use this?',
        answer: 'No — the levels are delivered as clear documentation your team can apply manually or enter into whatever billing/inventory system you already use.',
      },
      {
        question: 'How often do these levels need updating?',
        answer: 'Periodically — seasonal demand shifts, new suppliers, or new products are the usual triggers for a refresh.',
      },
    ],
  },
  {
    icon: ShoppingCart,
    slug: 'purchase-analysis',
    path: '/services/inventory-operations-consulting/purchase-analysis',
    title: 'Purchase Analysis',
    description: 'Reviewing purchasing patterns and supplier performance to buy smarter, not just more often.',
    services: [
      'Purchase pattern review by supplier and category',
      'Supplier performance and lead-time reliability review',
      'Over-ordering and duplicate-purchase pattern identification',
      'Recommendations for consolidation or renegotiation',
    ],
    metaDescription:
      'Purchase analysis from Nitin Anand Consulting for pharmacies and healthcare businesses — supplier performance and purchase pattern review to improve buying decisions.',
    intro:
      'Purchasing decisions compound — a habit of over-ordering from one supplier or under-tracking lead-time reliability shows up months later as excess or dead stock. Purchase analysis reviews your buying patterns and supplier performance to find where the process itself needs adjusting.',
    benefits: [
      { title: 'Smarter Buying Decisions', description: 'Purchase patterns reviewed against actual demand, not habit.' },
      { title: 'Supplier Accountability', description: 'Clear visibility into which suppliers deliver reliably and which don\'t.' },
      { title: 'Fewer Duplicate Orders', description: 'Catch redundant or overlapping purchases across categories or locations.' },
    ],
    faqs: [
      {
        question: 'Can this help with supplier negotiations?',
        answer: 'Yes — purchase volume and pattern data is often the strongest leverage point in a supplier conversation, and we help you organize it that way.',
      },
      {
        question: 'Does this cover multiple store locations?',
        answer: 'Yes — for chain pharmacies or multi-location operations, we can review purchasing consistency and consolidation opportunities across sites.',
      },
    ],
  },
  {
    icon: ClipboardPen,
    slug: 'operations-audit',
    path: '/services/inventory-operations-consulting/operations-audit',
    title: 'Operations Audit',
    description: 'A structured review of day-to-day store or warehouse operations, beyond just the stock numbers.',
    services: [
      'Floor workflow and process observation',
      'Staff role and responsibility review',
      'Bottleneck and inefficiency identification',
      'Prioritized findings report',
    ],
    metaDescription:
      'Operations audits from Nitin Anand Consulting for pharmacy, medical store, and healthcare operations — a structured review of day-to-day workflow beyond just inventory numbers.',
    intro:
      'Inventory problems are often downstream of a broader operations issue — unclear responsibilities, redundant steps, or a workflow that was never redesigned as the business grew. An operations audit looks at how the store or warehouse actually runs, day to day, not just what the stock numbers show. Bringing in a healthcare operations consultant for this kind of outside look often surfaces exactly the blind spots a team too close to the daily routine can\'t see — we conduct these audits in person across Mumbai and Maharashtra.',
    benefits: [
      { title: 'See the Whole Picture', description: 'Workflow issues identified beyond what inventory numbers alone reveal.' },
      { title: 'Clear Ownership', description: 'Findings on where responsibilities are unclear or duplicated.' },
      { title: 'Prioritized, Not Overwhelming', description: 'A findings report ranked by impact, not a long list of everything.' },
    ],
    faqs: [
      {
        question: 'How long does an operations audit take?',
        answer: 'It depends on store size and scope — we scope the timeline with you before starting so there\'s no surprise.',
      },
      {
        question: 'Does this disrupt daily operations?',
        answer: 'It\'s designed to observe and work around your normal operating hours as much as possible.',
      },
    ],
  },
  {
    icon: FileText,
    slug: 'sop-development',
    path: '/services/inventory-operations-consulting/sop-development',
    title: 'SOP Development',
    description: 'Clear, written standard operating procedures for inventory, dispensing, and store operations.',
    services: [
      'Process documentation for inventory and stock handling',
      'Store/warehouse operating procedures',
      'Staff-facing SOP formatting (checklists, not walls of text)',
      'Rollout and implementation support',
    ],
    metaDescription:
      'SOP development from Nitin Anand Consulting for pharmacies and healthcare businesses — clear, practical inventory and store operating procedures that make consistent practices repeatable.',
    intro:
      'Good practices that live only in one experienced staff member\'s head aren\'t repeatable, and they disappear the moment that person is unavailable. We write clear, practical SOPs for inventory handling, stock rotation, and store operations — built for the people who\'ll actually use them on the floor.',
    benefits: [
      { title: 'Consistency Across Shifts', description: 'The same task done the same way, regardless of who\'s working.' },
      { title: 'Faster Onboarding', description: 'New staff trained against a documented standard, not tribal knowledge.' },
      { title: 'Practical, Not Bureaucratic', description: 'Checklists and clear steps, not documents nobody reads.' },
    ],
    faqs: [
      {
        question: 'Do you help roll the SOPs out, or just write them?',
        answer: 'Both — SOP development includes supporting your team through rollout, not just handing over a document.',
      },
      {
        question: 'Which processes can you document?',
        answer: 'Inventory handling, stock rotation, receiving, and general store/warehouse operating procedures.',
      },
    ],
  },
  {
    icon: Workflow,
    slug: 'process-improvement',
    path: '/services/inventory-operations-consulting/process-improvement',
    title: 'Process Improvement',
    description: 'Redesigning specific workflows that are slowing down or introducing errors into store operations.',
    services: [
      'Workflow mapping for a specific process',
      'Bottleneck and error-source identification',
      'Redesigned, simplified process steps',
      'Implementation and staff walkthrough support',
    ],
    metaDescription:
      'Process improvement consulting from Nitin Anand Consulting for pharmacy and healthcare operations — redesigning specific workflows that slow teams down or introduce errors.',
    intro:
      'Sometimes the issue isn\'t inventory at all — it\'s one specific workflow (receiving, billing reconciliation, returns handling) that has accumulated extra steps over time. Process improvement maps that workflow, finds where it breaks down, and redesigns it to be simpler and less error-prone.',
    benefits: [
      { title: 'Fewer Errors', description: 'Redesigned steps that remove the points where mistakes happen most.' },
      { title: 'Faster Turnaround', description: 'Cut unnecessary steps that were only ever added as a workaround.' },
      { title: 'Change That Sticks', description: 'Hands-on rollout support instead of a redesign that sits on a shelf.' },
    ],
    faqs: [
      {
        question: 'Which specific processes can you improve?',
        answer: 'Any recurring operational workflow — receiving, stock put-away, returns handling, billing reconciliation, and similar.',
      },
      {
        question: 'How is this different from an operations audit?',
        answer: 'An operations audit is a broad review across the whole operation; process improvement is a focused redesign of one specific workflow you\'ve already identified as a problem.',
      },
    ],
  },
  {
    icon: BarChart3,
    slug: 'kpi-mis-dashboards',
    path: '/services/inventory-operations-consulting/kpi-mis-dashboards',
    title: 'KPI / MIS / Dashboards',
    description: 'Turning your existing sales and stock data into KPI dashboards and MIS reports you can actually act on.',
    services: [
      'KPI selection relevant to pharmacy/healthcare operations',
      'Dashboard build in Excel or Google Sheets',
      'Recurring MIS report design',
      'Handover and training on maintaining it yourself',
    ],
    metaDescription:
      'KPI, MIS, and dashboard development from Nitin Anand Consulting — turning pharmacy and healthcare business data into Excel or Google Sheets dashboards your team can maintain.',
    intro:
      'Most pharmacies and medical stores already generate enough sales and stock data — the problem is it\'s scattered across systems nobody trusts. We build KPI dashboards and MIS reports in tools your team already knows (Excel or Google Sheets), turning that raw data into something you can actually act on.',
    benefits: [
      { title: 'One Trusted View', description: 'A single dashboard instead of conflicting numbers across systems.' },
      { title: 'No New Software to License', description: 'Built in Excel or Google Sheets — tools your team already knows.' },
      { title: 'Decisions Backed by Data', description: 'KPIs chosen for what actually matters in pharmacy and healthcare retail.' },
    ],
    faqs: [
      {
        question: 'Can this connect to our existing billing software?',
        answer: 'It depends on your current setup — share what you\'re using and we\'ll assess the best way to feed data into the dashboard.',
      },
      {
        question: 'Who maintains the dashboard after it\'s built?',
        answer: 'We hand it over with training so your own team can maintain and update it — ongoing support is available if you\'d prefer we manage it.',
      },
    ],
  },
  {
    icon: Store,
    slug: 'pharmacy-store-warehouse-operations',
    path: '/services/inventory-operations-consulting/pharmacy-store-warehouse-operations',
    title: 'Pharmacy / Store / Warehouse Operations',
    description: 'End-to-end operational consulting for how your pharmacy, store, or warehouse runs day to day.',
    services: [
      'Layout and floor-flow review',
      'Receiving, storage, and dispensing workflow review',
      'Staffing and shift structure input',
      'Combined recommendations across inventory and operations',
    ],
    metaDescription:
      'Pharmacy, store, and warehouse operations consulting from Nitin Anand Consulting — end-to-end operational support for how your business runs day to day.',
    intro:
      'Think of this as bringing in a pharmacy operations consultant for the full picture — a combined look at layout, workflow, staffing structure, and stock handling for pharmacies, medical stores, and healthcare warehouses, when the need spans more than one specific service above. This kind of hands-on engagement is delivered in person across Mumbai, the MMR, and Maharashtra.',
    benefits: [
      { title: 'One Coordinated Engagement', description: 'A single view across inventory, layout, and workflow instead of piecemeal fixes.' },
      { title: 'Built for Healthcare Retail', description: 'Recommendations shaped by pharmacy and healthcare operating realities, not generic retail advice.' },
      { title: 'Practical Implementation Support', description: 'Hands-on help putting recommendations into practice on your floor.' },
    ],
    faqs: [
      {
        question: 'How is this different from the individual services above?',
        answer: 'It\'s a combined engagement drawing on multiple services (audit, layout, SOPs, KPIs) when your need spans more than one area — scoped specifically to your operation.',
      },
      {
        question: 'How do we get started?',
        answer: 'Contact us with a description of your operation and what\'s prompting the interest, and we\'ll scope an approach together.',
      },
    ],
  },
];
