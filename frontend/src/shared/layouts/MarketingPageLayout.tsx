import type { ReactNode } from 'react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { useDocumentMeta } from '@/shared/hooks/useDocumentMeta';

interface MarketingPageLayoutProps {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  children: ReactNode;
}

/**
 * Shared shell for standalone content pages (About, FAQ, Contact, legal
 * pages) — same Navbar/Footer as the landing page, with a consistent
 * header band and a readable max-width content column.
 */
export function MarketingPageLayout({
  title,
  description,
  eyebrow,
  heading,
  children,
}: MarketingPageLayoutProps) {
  useDocumentMeta(title, description);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-32 sm:pb-24 sm:pt-36 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{heading}</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700 sm:text-base">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
