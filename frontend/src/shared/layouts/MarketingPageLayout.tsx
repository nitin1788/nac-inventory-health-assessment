import type { ReactNode } from 'react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { SITE_URL } from '@/config/constants';

interface MarketingPageLayoutProps {
  title: string;
  description: string;
  path: string;
  eyebrow: string;
  heading: string;
  children: ReactNode;
  /** Set true for placeholder/thin-content pages that shouldn't be indexed yet. Defaults to false (indexable). */
  noindex?: boolean;
}

/**
 * Shared shell for standalone content pages (About, FAQ, Contact, legal
 * pages) — same Navbar/Footer as the landing page, with a consistent
 * header band and a readable max-width content column.
 */
export function MarketingPageLayout({
  title,
  description,
  path,
  eyebrow,
  heading,
  children,
  noindex = false,
}: MarketingPageLayoutProps) {
  useSeo({ title, description, path, noindex });
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: heading, item: `${SITE_URL}${path}` },
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content" className="relative mx-auto max-w-3xl px-6 pb-20 pt-32 sm:pb-24 sm:pt-36 lg:px-8">
        <SectionGlow tone="navy" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{eyebrow}</p>
          <span aria-hidden className="mt-3 block h-1 w-14 rounded-full bg-accent" />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{heading}</h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700 sm:text-base">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
