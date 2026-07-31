import type { LucideIcon } from 'lucide-react';
import {
  ClipboardList,
  Warehouse,
  TrendingUp,
  FileText,
  Workflow,
  ShieldCheck,
  Layers,
  Factory,
  LineChart,
  CheckCircle2,
  Users,
  Zap,
  ListChecks,
  BarChart3,
  Mail,
  Pill,
  Stethoscope,
  Plug,
  Store,
  PackageCheck,
  Ship,
  Building2,
  Gauge,
  LayoutGrid,
  Settings,
  GraduationCap,
  Award,
  Truck,
  ShoppingCart,
  Newspaper,
  BookOpen,
  Download,
  LayoutTemplate,
} from 'lucide-react';
import { ROUTES } from '@/config/constants';

export interface NavLink {
  label: string;
  href: string;
}

/** Plain top-level nav links (no dropdown) — Services and Resources are rendered as dropdowns directly in Navbar.tsx. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: ROUTES.landing },
  { label: 'About', href: ROUTES.about },
  { label: 'FAQ', href: ROUTES.faq },
  { label: 'Contact', href: ROUTES.contactUs },
];

export interface ResourceLink {
  icon: LucideIcon;
  label: string;
  path: string;
  description: string;
}

/**
 * The Resources dropdown's entries. Each links to a real, reserved
 * route today (see pages/*ComingSoonPage.tsx) — some are placeholders
 * pending real content, but the URL and nav entry are stable so future
 * pages can be filled in without any nav/routing changes.
 */
export const RESOURCE_LINKS: ResourceLink[] = [
  {
    icon: Newspaper,
    label: 'Blog',
    path: ROUTES.blog,
    description: 'Articles on inventory, warehouse, and operations best practices.',
  },
  {
    icon: BookOpen,
    label: 'Case Studies',
    path: ROUTES.caseStudies,
    description: 'Real engagement outcomes across manufacturing, distribution, and retail.',
  },
  {
    icon: Download,
    label: 'Free Downloads',
    path: ROUTES.freeDownloads,
    description: 'Free tools and guides to help you get started on your own.',
  },
  {
    icon: ListChecks,
    label: 'Checklists',
    path: ROUTES.checklists,
    description: 'Practical, printable checklists for common inventory and warehouse tasks.',
  },
  {
    icon: LayoutTemplate,
    label: 'Templates',
    path: ROUTES.templates,
    description: 'Ready-to-use spreadsheet and document templates.',
  },
];

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Mirrors the footer services list and the landing page's Services section. */
export const SERVICES: ServiceItem[] = [
  {
    icon: Gauge,
    title: 'Inventory Health Assessment',
    description:
      'A free, 52-question diagnostic that scores your inventory health and points you toward the right next service.',
  },
  {
    icon: ClipboardList,
    title: 'Inventory Audit',
    description:
      'A structured review of your current inventory practices, uncovering gaps between what your process assumes and what actually happens on the floor.',
  },
  {
    icon: Warehouse,
    title: 'Warehouse Audit',
    description:
      'An on-the-ground assessment of layout, storage, and material flow that shows where space, time, and accuracy are being lost.',
  },
  {
    icon: TrendingUp,
    title: 'Inventory Optimization',
    description:
      'Right-size stock levels and improve turnover without compromising service levels or product availability.',
  },
  {
    icon: FileText,
    title: 'SOP Development',
    description:
      'Clear, practical standard operating procedures that make consistent inventory practices repeatable across every shift.',
  },
  {
    icon: LayoutGrid,
    title: 'Warehouse Layout Optimization',
    description:
      'Redesigning storage layout and pick paths to cut travel time, reduce congestion, and lower mis-picks.',
  },
  {
    icon: Workflow,
    title: 'Business Process Improvement',
    description:
      'End-to-end process redesign that removes bottlenecks and aligns inventory operations with broader business goals.',
  },
];

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

export interface ServiceCategory {
  icon: LucideIcon;
  slug: string;
  path: string;
  title: string;
  description: string;
  services: string[];
  /** Unique meta description for this service's dedicated landing page. */
  metaDescription: string;
  /** Opening paragraph for the dedicated landing page's hero section. */
  intro: string;
  benefits: ServiceBenefit[];
  faqs: ServiceFaq[];
}

/**
 * The six consulting service categories — shown as cards on the landing
 * page's Services section, and each also backs its own dedicated SEO
 * landing page (see features/services/ServiceLandingView.tsx).
 */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    icon: ClipboardList,
    slug: 'inventory-consulting',
    path: '/inventory-consulting',
    title: 'Inventory Consulting',
    description: 'Improve inventory accuracy, visibility, and control across your business.',
    services: [
      'Physical Inventory Verification',
      'Inventory Audit',
      'Inventory Reconciliation',
      'Inventory Analysis',
      'ABC & FSN Analysis',
      'Inventory Health Check',
    ],
    metaDescription:
      'Inventory consulting from Nitin Anand Consulting — physical verification, audits, reconciliation, and ABC/FSN analysis to improve inventory accuracy and control.',
    intro:
      'Inventory that looks accurate on paper but doesn’t match the floor creates costly surprises — stockouts, write-offs, and decisions made on bad data. Our inventory consulting engagements close that gap with structured verification, audit, and analysis work built for manufacturers, distributors, and warehouse operators.',
    benefits: [
      {
        title: 'Accurate Stock Visibility',
        description: 'Know what you actually have, where it is, and how it moves — not just what the system says.',
      },
      {
        title: 'Fewer Costly Surprises',
        description: 'Catch shrinkage, mis-locations, and reconciliation gaps before they turn into stockouts or write-offs.',
      },
      {
        title: 'Data-Driven Prioritization',
        description: 'ABC & FSN analysis shows exactly which SKUs deserve tighter control and which don’t.',
      },
    ],
    faqs: [
      {
        question: 'What does an inventory audit actually involve?',
        answer:
          'A structured physical verification of stock against your records, followed by a reconciliation of any discrepancies and a report on root causes — not just a count, but an explanation of why the numbers don’t match.',
      },
      {
        question: 'Who is inventory consulting for?',
        answer:
          'Manufacturers, distributors, and warehouse operators who suspect (or have confirmed) a gap between recorded and actual inventory, or who want a periodic health check before it becomes a problem.',
      },
      {
        question: 'How is this different from the free assessment?',
        answer:
          'The free Inventory Health Assessment is a self-reported diagnostic that flags where to focus. Inventory consulting is the hands-on engagement that verifies, audits, and fixes those specific areas.',
      },
      {
        question: 'How do I get started?',
        answer:
          'Start with the free Inventory Health Assessment to establish a baseline, or contact us directly to scope an audit for your specific concern.',
      },
    ],
  },
  {
    icon: Warehouse,
    slug: 'warehouse-consulting',
    path: '/warehouse-consulting',
    title: 'Warehouse Consulting',
    description: 'Optimize warehouse operations for speed, accuracy, and space utilization.',
    services: [
      'Warehouse Audit',
      'Warehouse Layout Assessment',
      'Bin Location System',
      'FIFO / FEFO Implementation',
      'Space Utilization',
      'Warehouse Process Improvement',
    ],
    metaDescription:
      'Warehouse consulting from Nitin Anand Consulting — audits, layout assessment, bin location systems, and FIFO/FEFO implementation to cut travel time and mis-picks.',
    intro:
      'Most warehouse inefficiency isn’t a staffing problem — it’s a layout and process problem. Our warehouse consulting work identifies where space, time, and accuracy are being lost on the floor, then redesigns the layout, bin structure, and material flow to fix it.',
    benefits: [
      {
        title: 'Faster Pick & Put-Away',
        description: 'Optimized bin locations and pick paths cut travel time and reduce mis-picks.',
      },
      {
        title: 'Better Space Utilization',
        description: 'Get more usable storage out of the same footprint before you consider expansion.',
      },
      {
        title: 'FIFO/FEFO Compliance',
        description: 'Structured stock rotation that reduces obsolescence and expiry write-offs.',
      },
    ],
    faqs: [
      {
        question: 'What happens during a warehouse audit?',
        answer:
          'An on-the-ground assessment of your current layout, storage methods, and material flow, identifying where space, time, and accuracy are being lost — the basis for any layout or process redesign that follows.',
      },
      {
        question: 'Do you redesign the physical layout, or just recommend changes?',
        answer:
          'Both — we assess the current layout, design the improved bin location and flow structure, and support your team through implementation.',
      },
      {
        question: 'Is this only for large warehouses?',
        answer:
          'No — the same principles (layout, bin structure, pick path, FIFO/FEFO) apply whether you’re running a single storeroom or a multi-zone distribution center.',
      },
      {
        question: 'How do I get started?',
        answer: 'Contact us to scope a warehouse audit, or start with the free Inventory Health Assessment first.',
      },
    ],
  },
  {
    icon: Settings,
    slug: 'operations-consulting',
    path: '/operations-consulting',
    title: 'Operations Consulting',
    description: 'Improve operational efficiency and reduce business costs.',
    services: [
      'Operations Audit',
      'Business Process Improvement',
      'Workflow Optimization',
      'Productivity Improvement',
      'Cost Reduction Initiatives',
    ],
    metaDescription:
      'Operations consulting from Nitin Anand Consulting — operations audits, process improvement, and workflow optimization to reduce cost and improve productivity.',
    intro:
      'Inventory and warehouse issues are usually symptoms of a broader operations problem — unclear ownership, redundant steps, or workflows that were never redesigned as the business grew. Our operations consulting looks at the end-to-end process, not just the symptom.',
    benefits: [
      {
        title: 'Removed Bottlenecks',
        description: 'Identify and eliminate the specific steps slowing down your operations, not generic advice.',
      },
      {
        title: 'Lower Operating Costs',
        description: 'Targeted cost reduction initiatives based on where money is actually being lost.',
      },
      {
        title: 'Aligned Workflows',
        description: 'Processes redesigned around how the business actually operates today, not how it did years ago.',
      },
    ],
    faqs: [
      {
        question: 'What’s the difference between operations consulting and process improvement?',
        answer:
          'Process improvement is one part of a broader operations consulting engagement, which can also include workflow audits, productivity reviews, and cost reduction initiatives across the business.',
      },
      {
        question: 'Do you work with a specific industry?',
        answer:
          'Our operations consulting is built around real manufacturing, distribution, and warehouse workflows, but the underlying approach applies to any business with physical operations to manage.',
      },
      {
        question: 'How long does an operations audit take?',
        answer:
          'It depends on the scope of the engagement — contact us with your specific situation and we’ll give you a realistic timeline.',
      },
      {
        question: 'How do I get started?',
        answer: 'Reach out via our Contact page to discuss your specific operational challenge.',
      },
    ],
  },
  {
    icon: FileText,
    slug: 'sop-development',
    path: '/sop-development',
    title: 'SOP Development',
    description: 'Create standardized processes for consistent business operations.',
    services: ['Warehouse SOPs', 'Inventory SOPs', 'Process Documentation', 'Standard Operating Procedures'],
    metaDescription:
      'SOP development from Nitin Anand Consulting — clear, practical warehouse and inventory SOPs that make consistent practices repeatable across every shift.',
    intro:
      'Good practices that only live in one experienced employee’s head aren’t repeatable — and they disappear the moment that person leaves. We write clear, practical standard operating procedures that make consistent inventory and warehouse practices repeatable across every shift and every new hire.',
    benefits: [
      {
        title: 'Consistency Across Shifts',
        description: 'The same task gets done the same way, regardless of who’s on the floor.',
      },
      {
        title: 'Faster Onboarding',
        description: 'New hires ramp up against a documented standard instead of tribal knowledge.',
      },
      {
        title: 'Audit-Ready Documentation',
        description: 'Clear, written procedures that hold up to internal review or external audit.',
      },
    ],
    faqs: [
      {
        question: 'What do your SOPs actually look like?',
        answer:
          'Clear, step-by-step documented procedures written for the people who’ll actually use them on the floor — not generic templates copied from elsewhere.',
      },
      {
        question: 'Do you help implement the SOPs, or just write them?',
        answer:
          'Both — SOP development includes supporting your team through rollout and implementation, not just handing over a document.',
      },
      {
        question: 'Which processes can you document?',
        answer: 'Warehouse SOPs, inventory SOPs, and general process documentation across your operations.',
      },
      {
        question: 'How do I get started?',
        answer: 'Contact us with the processes you want documented, and we’ll scope the engagement from there.',
      },
    ],
  },
  {
    icon: BarChart3,
    slug: 'business-analytics',
    path: '/business-analytics',
    title: 'Business Analytics',
    description: 'Turn operational data into actionable business insights.',
    services: [
      'Excel Inventory Management System',
      'Google Sheets Solutions',
      'KPI Dashboards',
      'MIS Reports',
      'Inventory Performance Reports',
    ],
    metaDescription:
      'Business analytics from Nitin Anand Consulting — KPI dashboards, MIS reports, and Excel/Google Sheets inventory systems that turn raw data into decisions.',
    intro:
      'Most businesses already generate enough operational data — the problem is it’s scattered across spreadsheets nobody trusts. We build KPI dashboards, MIS reports, and inventory management systems in Excel or Google Sheets that turn that raw data into something your team can actually act on.',
    benefits: [
      {
        title: 'One Source of Truth',
        description: 'A single, trusted system instead of conflicting spreadsheets across departments.',
      },
      {
        title: 'Decisions Backed by Data',
        description: 'KPI dashboards and MIS reports that surface what’s actually happening, not assumptions.',
      },
      {
        title: 'No New Software to License',
        description: 'Built in tools your team already knows — Excel and Google Sheets — not a costly new platform.',
      },
    ],
    faqs: [
      {
        question: 'Do we need to buy new software for this?',
        answer:
          'No — our business analytics solutions are typically built in Excel or Google Sheets, tools your team already has and knows how to use.',
      },
      {
        question: 'What kind of reports can you build?',
        answer:
          'KPI dashboards, MIS reports, and inventory performance reports tailored to the metrics that matter for your operation.',
      },
      {
        question: 'Can this integrate with our existing inventory system?',
        answer:
          'It depends on your current setup — contact us with details of what you’re using and we’ll assess the best approach.',
      },
      {
        question: 'How do I get started?',
        answer: 'Reach out via our Contact page describing the reporting or visibility gap you want solved.',
      },
    ],
  },
  {
    icon: GraduationCap,
    slug: 'training-implementation',
    path: '/training-implementation',
    title: 'Training & Implementation',
    description: 'Train teams and implement operational improvements successfully.',
    services: [
      'Inventory Management Training',
      'Warehouse Staff Training',
      'SOP Implementation',
      'Continuous Improvement Support',
    ],
    metaDescription:
      'Training and implementation support from Nitin Anand Consulting — inventory and warehouse staff training, SOP rollout, and continuous improvement support.',
    intro:
      'A great audit or SOP is only as good as the team executing it. Our training and implementation services make sure recommendations actually stick — training your inventory and warehouse staff, rolling out new SOPs, and supporting continuous improvement after the initial engagement ends.',
    benefits: [
      {
        title: 'Changes That Actually Stick',
        description: 'Hands-on rollout support instead of a report that sits on a shelf.',
      },
      {
        title: 'Confident, Capable Teams',
        description: 'Staff trained on the new processes, not just told the processes changed.',
      },
      {
        title: 'Ongoing Improvement Support',
        description: 'Continued support after implementation to keep improvements on track.',
      },
    ],
    faqs: [
      {
        question: 'What does SOP implementation support look like?',
        answer:
          'Hands-on support rolling out newly developed SOPs with your team — training, floor walkthroughs, and adjustment as issues surface in practice.',
      },
      {
        question: 'Do you train the whole team, or just supervisors?',
        answer:
          'Training is scoped to whoever needs it — from warehouse staff executing the process day-to-day to supervisors overseeing it.',
      },
      {
        question: 'What is continuous improvement support?',
        answer:
          'Ongoing support after the initial implementation to keep new processes on track and adjust as your operation evolves.',
      },
      {
        question: 'How do I get started?',
        answer: 'Contact us to discuss training or implementation support for a recent or planned change.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceCategory {
  const service = SERVICE_CATEGORIES.find((category) => category.slug === slug);
  if (!service) {
    throw new Error(`Unknown service slug: ${slug}`);
  }
  return service;
}

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

/** Verifiable facts about the assessment itself — not fabricated usage/customer metrics. */
export const TRUST_STATS: StatItem[] = [
  { icon: ClipboardList, value: '52', label: 'Diagnostic Questions' },
  { icon: Layers, value: '5', label: 'Core Service Lines' },
  { icon: Factory, value: '9+', label: 'Industries Assessed' },
  { icon: ShieldCheck, value: '100%', label: 'Confidential & Free' },
];

export interface TrustPillar {
  icon: LucideIcon;
  label: string;
}

/** Core credibility pillars shown in the landing page's Trust section. */
export const TRUST_PILLARS: TrustPillar[] = [
  { icon: Award, label: '16+ Years Experience' },
  { icon: Warehouse, label: 'Inventory & Warehouse Consulting' },
  { icon: FileText, label: 'SOP Development' },
  { icon: BarChart3, label: 'Business Analytics' },
  { icon: CheckCircle2, label: 'Actionable Recommendations' },
];

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const WHY_CHOOSE_NAC: ValueProp[] = [
  {
    icon: LineChart,
    title: 'Data-Driven Diagnostics',
    description:
      'Every recommendation traces back to your actual responses — evidence-based findings, not generic advice.',
  },
  {
    icon: CheckCircle2,
    title: 'Rule-Based Recommendations',
    description:
      'Consistent, quality-controlled guidance you can rely on — without the unpredictability of AI-generated content.',
  },
  {
    icon: Users,
    title: 'Built for Operators',
    description:
      'Shaped by real manufacturing, distribution, and warehouse workflows — not abstract theory.',
  },
  {
    icon: Zap,
    title: 'Fast, Actionable Reporting',
    description: 'A scored report with clear next steps, delivered to your inbox in minutes, not weeks.',
  },
];

export interface ProcessStep {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Share Your Company Info',
    description: 'Tell us a bit about your business — takes less than a minute.',
  },
  {
    icon: ListChecks,
    step: '02',
    title: 'Answer 52 Questions',
    description: 'Walk through focused questions covering every core inventory function.',
  },
  {
    icon: BarChart3,
    step: '03',
    title: 'Get Instant Scoring',
    description: 'Our engine scores your responses and maps them to specific findings.',
  },
  {
    icon: Mail,
    step: '04',
    title: 'Receive Your Report',
    description: 'A branded PDF report lands in your inbox with clear, actionable next steps.',
  },
];

export interface Industry {
  icon: LucideIcon;
  name: string;
}

/** Target customer segments from the PRD (Section 3). */
export const INDUSTRIES: Industry[] = [
  { icon: Factory, name: 'Manufacturing' },
  { icon: Pill, name: 'Pharmaceutical' },
  { icon: Stethoscope, name: 'Medical Distribution' },
  { icon: Plug, name: 'Electrical & Hardware' },
  { icon: Warehouse, name: 'Warehousing' },
  { icon: Store, name: 'Retail' },
  { icon: PackageCheck, name: 'FMCG Distribution' },
  { icon: Ship, name: 'Import & Export' },
  { icon: Building2, name: 'SMEs' },
];

/** The landing page's "Industries We Serve" section — a focused subset for a cleaner grid. */
export const INDUSTRIES_SERVED: Industry[] = [
  { icon: Factory, name: 'Manufacturing' },
  { icon: Plug, name: 'Electrical' },
  { icon: Pill, name: 'Pharmaceutical' },
  { icon: PackageCheck, name: 'FMCG' },
  { icon: Store, name: 'Retail' },
  { icon: Warehouse, name: 'Warehousing' },
  { icon: Truck, name: 'Distributors' },
  { icon: ShoppingCart, name: 'E-commerce' },
];

export interface Testimonial {
  quote: string;
  role: string;
}

/**
 * Illustrative placeholder testimonials (per PRD Section 5) —
 * attributed by role/industry only, not to specific named people or
 * companies, until NAC supplies real client testimonials.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The assessment surfaced gaps in our warehouse process we hadn't even considered. The recommendations were specific enough to act on immediately.",
    role: 'Operations Manager, Manufacturing',
  },
  {
    quote:
      'Ten minutes of questions gave us a clearer picture of our inventory health than months of internal reviews.',
    role: 'Warehouse Director, Distribution',
  },
  {
    quote:
      "Straightforward and practical — exactly the starting point we needed before committing to a bigger overhaul.",
    role: 'Founder, Retail Business',
  },
];
