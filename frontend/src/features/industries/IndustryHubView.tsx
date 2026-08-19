import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { FinalCTABanner } from '@/features/landing/components/FinalCTABanner';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { INDUSTRIES_LIST } from '@/config/industries.data';
import { ROUTES, SITE_URL } from '@/config/constants';

/** Hub page listing every target industry as a card — rendered at /industries by pages/IndustriesHubPage.tsx. */
export function IndustryHubView() {
  useSeo({
    title: 'Industries We Serve | Nitin Anand Consulting',
    description:
      'Nitin Anand Consulting specializes in pharmacy, healthcare, and allied businesses — retail and hospital pharmacies, clinics, hospitals, diagnostic centres, labs, and more.',
    path: ROUTES.industriesHub,
  });
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Industries We Serve', item: `${SITE_URL}${ROUTES.industriesHub}` },
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
          <SectionGlow tone="navy" />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Industries</p>
            <span className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft">
              <Users className="h-7 w-7" />
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Pharmacy, Healthcare &amp; Allied Businesses
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              We work exclusively with this niche — not as a generalist consultancy that happens to
              take healthcare clients, but as a specialist who understands the operational and
              regulatory realities specific to each of these business types.
            </p>
          </div>
        </section>

        <section className="bg-white pb-16 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {INDUSTRIES_LIST.map((industry, index) => {
                const Icon = industry.icon;
                return (
                  <motion.div
                    key={industry.slug}
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT_ONCE}
                    variants={fadeUpItem}
                    transition={{ delay: (index % 6) * 0.05 }}
                  >
                    <Link
                      to={industry.path}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft-lg"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-accent transition-transform duration-300 group-hover:scale-x-100"
                      />
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-slate-900">{industry.name}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{industry.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
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
