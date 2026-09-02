import type { LucideIcon } from 'lucide-react';
import {
  ClipboardList,
  Warehouse,
  TrendingUp,
  Megaphone,
  FileText,
  Workflow,
  Layers,
  LayoutGrid,
  Gauge,
  Mail,
  ListChecks,
  BarChart3,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Award,
  Store,
  Building2,
  Pill,
  Stethoscope,
  Hospital,
  Activity,
  Truck,
  Users,
  GraduationCap,
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

/** Plain top-level nav links (no dropdown) — Services and Industries are rendered as mega-menu dropdowns directly in Navbar.tsx. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: ROUTES.landing },
  { label: 'About', href: ROUTES.about },
  { label: 'Insights', href: ROUTES.blog },
  { label: 'Contact', href: ROUTES.contactUs },
];

export interface ResourceLink {
  icon: LucideIcon;
  label: string;
  path: string;
  description: string;
}

/**
 * Footer-only resource links (Blog is also promoted to primary nav as
 * "Insights" — see NAV_LINKS). Case Studies / Free Downloads / Checklists
 * / Templates remain reserved routes with stable URLs pending real
 * content — see features/resources/ResourceComingSoonView.tsx.
 */
export const RESOURCE_LINKS: ResourceLink[] = [
  {
    icon: Newspaper,
    label: 'Blog',
    path: ROUTES.blog,
    description: 'Practical articles on pharmacy/healthcare inventory, operations, and digital growth.',
  },
  {
    icon: BookOpen,
    label: 'Case Studies',
    path: ROUTES.caseStudies,
    description: 'Real engagement outcomes across pharmacy, healthcare, and allied businesses.',
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
    description: 'Practical, printable checklists for common inventory and operations tasks.',
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

/**
 * Legacy flat service list — retained only because it still backs the
 * now-unused features/landing/components/Services.tsx (kept in the repo,
 * no longer rendered on the homepage; see LandingView.tsx). Not used by
 * any currently-rendered page. Superseded by INVENTORY_SERVICES and
 * DIGITAL_SERVICES (config/services.inventory.data.ts, services.digital.data.ts).
 */
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

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

/** Structural facts about NAC's positioning — used on the About page. No client-count or outcome statistics are claimed. */
export const TRUST_STATS: StatItem[] = [
  { icon: Award, value: '16+', label: 'Years Experience' },
  { icon: Layers, value: '2', label: 'Specialized Verticals' },
  { icon: ShieldCheck, value: '100%', label: 'Healthcare Focused' },
  { icon: CheckCircle2, value: 'Practical', label: 'Results-Oriented' },
];

export interface TrustPillar {
  icon: LucideIcon;
  label: string;
}

/** Core credibility pillars shown in the homepage's trust strip. */
export const TRUST_PILLARS: TrustPillar[] = [
  { icon: Award, label: '16+ Years Experience' },
  { icon: Stethoscope, label: 'Pharmacy & Healthcare Focused' },
  { icon: Layers, label: 'Operations + Digital Expertise' },
  { icon: CheckCircle2, label: 'Practical Business-Focused Approach' },
];

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const WHY_CHOOSE_NAC: ValueProp[] = [
  {
    icon: Stethoscope,
    title: 'Pharmacy Background',
    description:
      'Built on a pharmacy background, not just outside consulting — an understanding of healthcare operations from the inside.',
  },
  {
    icon: Award,
    title: '16+ Years Operations Experience',
    description:
      'Hands-on inventory and operations experience across real businesses, not theoretical frameworks.',
  },
  {
    icon: GraduationCap,
    title: 'Operations Management Education',
    description:
      'Formal operations management training paired with real pharmacy and healthcare industry experience.',
  },
  {
    icon: Layers,
    title: 'Operations + Digital Expertise',
    description:
      'Inventory & Operations Consulting and Digital Marketing & Growth, each treated as its own discipline — not blended into one generic offering.',
  },
  {
    icon: Zap,
    title: 'Practical Implementation Mindset',
    description:
      'Recommendations you can actually implement on the floor or in your next campaign — not a report that sits on a shelf.',
  },
  {
    icon: CheckCircle2,
    title: 'Business-Focused Solutions',
    description:
      'Solutions built around what actually works for your business and budget — not generic templates or one-size-fits-all advice.',
  },
];

/** The four compact value points shown in the homepage's ConsultingValueSection, right after the hero. */
export const CONSULTING_VALUE_POINTS: ValueProp[] = [
  {
    icon: Stethoscope,
    title: 'Healthcare Focused',
    description: 'Pharmacy and healthcare business context built into our consulting approach.',
  },
  {
    icon: ClipboardList,
    title: 'Operations Expertise',
    description: 'Inventory, store operations, SOPs and process improvement.',
  },
  {
    icon: Megaphone,
    title: 'Digital Growth',
    description: 'Website, SEO, social media, PPC and performance marketing.',
  },
  {
    icon: CheckCircle2,
    title: 'Practical Approach',
    description: 'Practical recommendations designed for real-world implementation.',
  },
];

export interface ProcessStep {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

/**
 * Describes the (now unlinked) free assessment flow — retained only
 * because it still backs the now-unused features/landing/components/
 * HowItWorks.tsx (kept in the repo, no longer rendered on the homepage;
 * see LandingView.tsx).
 */
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

/**
 * The homepage's "Industries We Serve" grid — a focused subset of the
 * full industry list at config/industries.data.ts (each with its own
 * dedicated page at /industries/:slug).
 */
export const INDUSTRIES_SERVED: Industry[] = [
  { icon: Store, name: 'Retail Pharmacies' },
  { icon: Pill, name: 'Medical Stores' },
  { icon: Building2, name: 'Hospital Pharmacies' },
  { icon: Layers, name: 'Chain Pharmacies' },
  { icon: Stethoscope, name: 'Clinics' },
  { icon: Hospital, name: 'Hospitals' },
  { icon: Activity, name: 'Diagnostic Centres' },
  { icon: Truck, name: 'Healthcare Distributors' },
  { icon: Users, name: 'Other Allied Healthcare Businesses' },
];

export interface Testimonial {
  quote: string;
  role: string;
}

/**
 * Unused — features/landing/components/Testimonials.tsx intentionally
 * does not render fabricated quotes; it shows an honest "coming soon"
 * placeholder instead. Kept only in case real, attributed client
 * testimonials are supplied later.
 */
export const TESTIMONIALS: Testimonial[] = [];
