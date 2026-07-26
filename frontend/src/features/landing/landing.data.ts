import type { LucideIcon } from 'lucide-react';
import {
  ClipboardList,
  Warehouse,
  TrendingUp,
  FileText,
  Workflow,
  ShieldCheck,
  Clock,
  FileCheck2,
  Target,
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

/** Mirrors the footer services list approved in the PRD (Section 6). */
export const SERVICES: ServiceItem[] = [
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
    icon: Workflow,
    title: 'Business Process Improvement',
    description:
      'End-to-end process redesign that removes bottlenecks and aligns inventory operations with broader business goals.',
  },
];

export interface TrustItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const TRUST_INDICATORS: TrustItem[] = [
  {
    icon: Clock,
    title: '10-Minute Assessment',
    description: '52 focused questions across every core inventory function — no lengthy onboarding.',
  },
  {
    icon: FileCheck2,
    title: 'Instant PDF Report',
    description: 'A branded, scored report delivered straight to your inbox as soon as you submit.',
  },
  {
    icon: Target,
    title: 'Actionable Recommendations',
    description: 'Findings mapped to concrete next steps, not generic advice.',
  },
  {
    icon: ShieldCheck,
    title: '100% Confidential',
    description: 'Your responses and report stay private — used only to prepare your assessment.',
  },
];
