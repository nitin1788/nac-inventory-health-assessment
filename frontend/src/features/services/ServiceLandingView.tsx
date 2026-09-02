import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { FinalCTABanner } from '@/features/landing/components/FinalCTABanner';
import type { ServiceCategory } from '@/config/serviceTypes';
import { Button } from '@/shared/components/Button';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { buildBreadcrumbJsonLd } from '@/shared/utils/breadcrumbs';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { COMPANY_NAME, ROUTES, SITE_URL } from '@/config/constants';
import { getIndustriesForService } from '@/config/industries.data';

interface ServiceLandingViewProps {
  service: ServiceCategory;
  /** The full service list for this service's vertical — used to compute "Related Services". */
  verticalServices: ServiceCategory[];
  /** Hub page path (e.g. ROUTES.inventoryHub) and label, for the breadcrumb trail. */
  hubPath: string;
  hubLabel: string;
  /** Which vertical this service belongs to — drives the green (inventory) or blue (digital) identity color throughout the page. */
  vertical: 'inventory' | 'digital';
}

/** Per-vertical identity colors — green for Inventory & Operations, blue for Digital Marketing & Growth. Never mixed. */
const VERTICAL_STYLES = {
  inventory: { gradient: 'from-accent to-accent-dark', text: 'text-accent-dark', icon: 'text-accent' },
  digital: { gradient: 'from-sky to-sky-dark', text: 'text-sky-dark', icon: 'text-sky' },
} as const;

/** The 3 catalog entries immediately after this one within the same vertical (wrapping around) — used for internal linking. */
function getRelatedServices(verticalServices: ServiceCategory[], currentSlug: string): ServiceCategory[] {
  const currentIndex = verticalServices.findIndex((category) => category.slug === currentSlug);
  const rotated = [...verticalServices.slice(currentIndex + 1), ...verticalServices.slice(0, currentIndex)];
  return rotated.slice(0, 3);
}

/**
 * Shared template for every dedicated service landing page across both
 * verticals — one page per INVENTORY_SERVICES/DIGITAL_SERVICES entry,
 * rendered at /services/inventory-operations-consulting/:slug or
 * /services/digital-marketing/:slug (see pages/InventoryServicePage.tsx,
 * DigitalServicePage.tsx). Reuses the same Navbar/Footer/CTA banner as
 * the rest of the marketing site.
 */
export function ServiceLandingView({ service, verticalServices, hubPath, hubLabel, vertical }: ServiceLandingViewProps) {
  const relatedServices = getRelatedServices(verticalServices, service.slug);
  const relevantIndustries = getIndustriesForService(service.path);
  const pageUrl = `${SITE_URL}${service.path}`;
  const style = VERTICAL_STYLES[vertical];
  const breadcrumbItems = [
    { label: 'Home', path: ROUTES.landing },
    { label: hubLabel, path: hubPath },
    { label: service.title, path: service.path },
  ];

  useSeo({
    title: `${service.title} | ${COMPANY_NAME}`,
    description: service.metaDescription,
    path: service.path,
  });

  useJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(breadcrumbItems),
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'Service',
        name: service.title,
        description: service.metaDescription,
        url: pageUrl,
        serviceType: service.title,
        provider: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  });

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
          <SectionGlow tone="navy" />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Breadcrumbs items={breadcrumbItems} className="mb-6 flex justify-center text-xs sm:text-sm" />
              <Link to={hubPath} className={`text-xs font-semibold uppercase tracking-wide hover:underline ${style.text}`}>
                {hubLabel}
              </Link>
              <span
                className={`mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft ${style.gradient}`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{service.title}</h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{service.intro}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to={ROUTES.contactUs} className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Book a Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href={buildConsultationWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="whatsapp" size="lg" className="w-full gap-1.5 sm:w-auto">
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">What&apos;s Included</h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {service.services.map((item, index) => (
                <motion.li
                  key={item}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  variants={fadeUpItem}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-soft"
                >
                  <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />
                  <span className="text-sm font-medium text-slate-800">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Why It Matters</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  variants={fadeUpItem}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
                >
                  <h3 className="text-base font-semibold text-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <div className="mt-10 space-y-6">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-slate-200 p-5 shadow-soft">
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{faq.question}</h3>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {relevantIndustries.length > 0 ? (
          <section className="bg-white py-16 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Relevant For These Industries
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                {relevantIndustries.map((industry) => (
                  <Link
                    key={industry.path}
                    to={industry.path}
                    className={`rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-transparent hover:text-white hover:bg-gradient-to-r ${style.gradient}`}
                  >
                    {industry.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {relatedServices.length > 0 ? (
          <section className="bg-slate-50 py-16 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Related Services</h2>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {relatedServices.map((related, index) => {
                  const RelatedIcon = related.icon;
                  return (
                    <motion.div
                      key={related.slug}
                      initial="hidden"
                      whileInView="show"
                      viewport={VIEWPORT_ONCE}
                      variants={fadeUpItem}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link
                        to={related.path}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100 ${style.gradient}`}
                        />
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform duration-300 group-hover:scale-110 ${style.gradient}`}
                        >
                          <RelatedIcon className="h-5 w-5" />
                        </span>
                        <h3 className="mt-4 text-base font-semibold text-slate-900">{related.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{related.description}</p>
                        <span className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${style.text}`}>
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
        ) : null}

        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
