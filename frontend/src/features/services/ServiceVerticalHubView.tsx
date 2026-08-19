import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { FinalCTABanner } from '@/features/landing/components/FinalCTABanner';
import type { ServiceCategory } from '@/config/serviceTypes';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { SITE_URL } from '@/config/constants';

interface ServiceVerticalHubViewProps {
  path: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  heroIcon: LucideIcon;
  intro: string;
  services: ServiceCategory[];
  /** Tailwind gradient classes for this vertical's accent (matches the homepage TwoVerticalsSection treatment). */
  accentGradient: string;
  /** Tailwind text-color class matching accentGradient, for links/labels that need a solid (non-gradient) color. */
  accentTextClass: string;
}

/**
 * Shared hub-page template for each vertical (Inventory & Operations
 * Consulting / Digital Marketing & Growth) — lists every service in
 * that vertical as a card linking to its dedicated page. Rendered by
 * pages/InventoryHubPage.tsx and pages/DigitalMarketingHubPage.tsx.
 */
export function ServiceVerticalHubView({
  path,
  title,
  metaDescription,
  eyebrow,
  heroIcon: HeroIcon,
  intro,
  services,
  accentGradient,
  accentTextClass,
}: ServiceVerticalHubViewProps) {
  useSeo({ title: `${title} | Nitin Anand Consulting`, description: metaDescription, path });
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: title, item: `${SITE_URL}${path}` },
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
          <SectionGlow tone="navy" />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{eyebrow}</p>
            <span
              className={`mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accentGradient} text-white shadow-soft`}
            >
              <HeroIcon className="h-7 w-7" />
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{intro}</p>
          </div>
        </section>

        <section className="bg-white pb-16 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.slug}
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT_ONCE}
                    variants={fadeUpItem}
                    transition={{ delay: (index % 6) * 0.05 }}
                  >
                    <Link
                      to={service.path}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${accentGradient} transition-transform duration-300 group-hover:scale-x-100`}
                      />
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentGradient} text-white transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-slate-900">{service.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.description}</p>
                      <span className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${accentTextClass}`}>
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
