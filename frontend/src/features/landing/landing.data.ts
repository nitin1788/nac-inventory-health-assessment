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
} from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'Why NAC', href: '#why-nac' },
  { label: 'Contact', href: '#contact' },
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

export interface ServiceCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  services: string[];
}

/** The six consulting service categories shown on the landing page's Services section. */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    icon: ClipboardList,
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
  },
  {
    icon: Warehouse,
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
  },
  {
    icon: Settings,
    title: 'Operations Consulting',
    description: 'Improve operational efficiency and reduce business costs.',
    services: [
      'Operations Audit',
      'Business Process Improvement',
      'Workflow Optimization',
      'Productivity Improvement',
      'Cost Reduction Initiatives',
    ],
  },
  {
    icon: FileText,
    title: 'SOP Development',
    description: 'Create standardized processes for consistent business operations.',
    services: ['Warehouse SOPs', 'Inventory SOPs', 'Process Documentation', 'Standard Operating Procedures'],
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Turn operational data into actionable business insights.',
    services: [
      'Excel Inventory Management System',
      'Google Sheets Solutions',
      'KPI Dashboards',
      'MIS Reports',
      'Inventory Performance Reports',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Training & Implementation',
    description: 'Train teams and implement operational improvements successfully.',
    services: [
      'Inventory Management Training',
      'Warehouse Staff Training',
      'SOP Implementation',
      'Continuous Improvement Support',
    ],
  },
];

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

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const WHY_CHOOSE_NAC: ValueProp[] = [
  {
    icon: LineChart,
    title: 'Data-Driven Diagnostics',
    description: 'Every recommendation traces back to your actual answers — not generic advice.',
  },
  {
    icon: CheckCircle2,
    title: 'Rule-Based Recommendations',
    description:
      'Consistent, quality-controlled guidance without the unpredictability of AI-generated content.',
  },
  {
    icon: Users,
    title: 'Built for Operators',
    description:
      'Designed around real manufacturing, distribution, and warehouse workflows — not abstract theory.',
  },
  {
    icon: Zap,
    title: 'Fast, Actionable Reporting',
    description: 'A scored report and clear next steps delivered in minutes, not weeks.',
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
