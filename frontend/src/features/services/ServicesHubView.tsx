import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardList, Megaphone, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { FinalCTABanner } from '@/features/landing/components/FinalCTABanner';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { buildBreadcrumbJsonLd } from '@/shared/utils/breadcrumbs';
import { ROUTES } from '@/config/constants';
import { INVENTORY_SERVICES } from '@/config/services.inventory.data';
import { DIGITAL_SERVICES } from '@/config/services.digital.data';

const INVENTORY_HIGHLIGHTS = [
  'Inventory Audit',
  'Inventory Management',
  'Stock Accuracy & Reconciliation',
  'Dead Stock Analysis',
  'Expiry Management',
  'ABC / FSN Analysis',
  'Warehouse & Store Operations',
  'SOP Development',
  'Process Improvement',
  'MIS & KPI Reporting',
];

const DIGITAL_HIGHLIGHTS = [
  'Website Development',
  'Website Optimization',
  'SEO',
  'Local SEO',
  'Google Business Profile',
  'Social Media Management',
  'Content Marketing',
  'AI-Assisted Content',
  'Google Ads / PPC',
  'Meta Ads',
  'Performance Marketing',
  'Lead Generation',
];

/**
 * /services — overview hub linking to the two vertical hub pages
 * (/services/inventory-operations-consulting, /services/digital-marketing).
 * Kept as a genuinely useful overview page (not a thin SEO stub) since
 * it's the one place both verticals are compared side by side.
 */
export function ServicesHubView() {
  useSeo({
    title: 'Services | Inventory & Operations Consulting + Digital Marketing | Nitin Anand Consulting',
    description:
      'Two specialized service verticals for pharmacy, healthcare, and allied businesses: Inventory & Operations Consulting, and Digital Marketing & Growth.',
    path: ROUTES.servicesHub,
  });
  const breadcrumbItems = [
    { label: 'Home', path: ROUTES.landing },
    { label: 'Services', path: ROUTES.servicesHub },
  ];
  useJsonLd({ '@context': 'https://schema.org', ...buildBreadcrumbJsonLd(breadcrumbItems) });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
          <SectionGlow tone="navy" />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <Breadcrumbs items={breadcrumbItems} className="mb-6 flex justify-center text-xs sm:text-sm" />
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Services</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Two Specialized Verticals
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Different business problems require different expertise. NAC provides specialized
              consulting across operations and digital growth for pharmacy, healthcare, and allied
              businesses.
            </p>
          </div>
        </section>

        <section className="bg-white pb-16 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={fadeUpItem}
                className="flex flex-col rounded-2xl border border-accent/20 bg-white p-8 shadow-soft"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white">
                  <ClipboardList className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-slate-900">Inventory &amp; Operations Consulting</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Making stock and day-to-day operations more accurate, efficient, and easier to
                  manage — for pharmacies, medical stores, and healthcare warehouses.
                </p>
                <ul className="mt-6 space-y-2">
                  {INVENTORY_HIGHLIGHTS.map((label) => (
                    <li key={label} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                      {label}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-slate-500">{INVENTORY_SERVICES.length} services in this vertical</p>
                <Link
                  to={ROUTES.inventoryHub}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent-dark hover:underline"
                >
                  Explore Operations Consulting
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={fadeUpItem}
                transition={{ delay: 0.1 }}
                className="flex flex-col rounded-2xl border border-sky/20 bg-white p-8 shadow-soft"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky text-white">
                  <Megaphone className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-slate-900">Digital Marketing &amp; Growth</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Building the website, search visibility, and customer growth engine for pharmacy
                  and healthcare businesses.
                </p>
                <ul className="mt-6 space-y-2">
                  {DIGITAL_HIGHLIGHTS.map((label) => (
                    <li key={label} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-sky" />
                      {label}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-slate-500">{DIGITAL_SERVICES.length} services in this vertical</p>
                <Link
                  to={ROUTES.digitalMarketingHub}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-dark hover:underline"
                >
                  Explore Digital Marketing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
