import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { FinalCTABanner } from '@/features/landing/components/FinalCTABanner';
import { SERVICE_CATEGORIES, type ServiceCategory } from '@/features/landing/landing.data';
import { Button } from '@/shared/components/Button';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { COMPANY_NAME, CONSULTATION, ROUTES, SITE_URL } from '@/config/constants';

interface ServiceLandingViewProps {
  service: ServiceCategory;
}

/** The 3 catalog entries immediately after this one (wrapping around) — used for internal linking. */
function getRelatedServices(currentSlug: string): ServiceCategory[] {
  const currentIndex = SERVICE_CATEGORIES.findIndex((category) => category.slug === currentSlug);
  const rotated = [
    ...SERVICE_CATEGORIES.slice(currentIndex + 1),
    ...SERVICE_CATEGORIES.slice(0, currentIndex),
  ];
  return rotated.slice(0, 3);
}

/**
 * Shared template for the six dedicated service SEO landing pages —
 * one page per SERVICE_CATEGORIES entry (see landing.data.ts). Reuses
 * the same Navbar/Footer/CTA banner as the rest of the marketing site
 * so the design language matches exactly.
 */
export function ServiceLandingView({ service }: ServiceLandingViewProps) {
  const relatedServices = getRelatedServices(service.slug);
  const pageUrl = `${SITE_URL}${service.path}`;

  useSeo({
    title: `${service.title} | ${COMPANY_NAME}`,
    description: service.metaDescription,
    path: service.path,
  });

  useJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}${ROUTES.landing}#services` },
          { '@type': 'ListItem', position: 3, name: service.title, item: pageUrl },
        ],
      },
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
        <section className="relative overflow-hidden bg-white pb-16 pt-40 sm:pb-20 sm:pt-48">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,42,82,0.06),_transparent_60%)]"
          />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to={`${ROUTES.landing}#services`}
                className="text-xs font-semibold uppercase tracking-wide text-brand hover:underline"
              >
                Services
              </Link>
              <span className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
                <Icon className="h-7 w-7" />
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{service.title}</h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{service.intro}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to={ROUTES.assessmentStart} className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Start Free Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href={buildConsultationWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    {CONSULTATION.ctaLabel}
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">What&apos;s Included</h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {service.services.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span className="text-sm font-medium text-slate-800">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Why It Matters</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <div className="mt-10 space-y-6">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{faq.question}</h3>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {relatedServices.length > 0 ? (
          <section className="bg-slate-50 py-20 sm:py-28">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Related Services</h2>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {relatedServices.map((related, index) => {
                  const RelatedIcon = related.icon;
                  return (
                    <motion.div
                      key={related.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                    >
                      <Link
                        to={related.path}
                        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-md"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-transform duration-300 group-hover:scale-110">
                          <RelatedIcon className="h-5 w-5" />
                        </span>
                        <h3 className="mt-4 text-base font-semibold text-slate-900">{related.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{related.description}</p>
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
        ) : null}

        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
