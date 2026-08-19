import type { LucideIcon } from 'lucide-react';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

/**
 * Shape shared by every dedicated service landing page (both verticals),
 * rendered by features/services/ServiceLandingView.tsx. Lives in its own
 * file (rather than landing.data.ts) so the two vertical data files and
 * landing.data.ts can all import it without a circular dependency.
 */
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
