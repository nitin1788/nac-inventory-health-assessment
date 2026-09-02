import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { FinalCTABanner } from '@/features/landing/components/FinalCTABanner';
import type { IndustryProfile } from '@/config/industries.data';
import { Button } from '@/shared/components/Button';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { buildBreadcrumbJsonLd } from '@/shared/utils/breadcrumbs';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { COMPANY_NAME, ROUTES } from '@/config/constants';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { buildResponsiveSrcSet } from '@/shared/utils/responsiveImage';

interface IndustryLandingViewProps {
  industry: IndustryProfile;
}

/**
 * Shared template for every dedicated industry page — one per
 * INDUSTRIES_LIST entry (config/industries.data.ts), rendered at
 * /industries/:slug (see pages/IndustryPage.tsx). Cross-links into both
 * service verticals via industry.relevantServices — the internal-linking
 * mechanism between industries and services.
 */
export function IndustryLandingView({ industry }: IndustryLandingViewProps) {
  const Icon = industry.icon;
  const breadcrumbItems = [
    { label: 'Home', path: ROUTES.landing },
    { label: 'Industries', path: ROUTES.industriesHub },
    { label: industry.name, path: industry.path },
  ];

  useSeo({ title: `${industry.name} | ${COMPANY_NAME}`, description: industry.metaDescription, path: industry.path });
  useJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(breadcrumbItems),
      {
        '@type': 'FAQPage',
        mainEntity: industry.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
          <SectionGlow tone="navy" />
          <div
            className={
              industry.image
                ? 'relative mx-auto max-w-7xl px-6 lg:px-8'
                : 'relative mx-auto max-w-4xl px-6 text-center lg:px-8'
            }
          >
            <div
              className={
                industry.image
                  ? 'grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16'
                  : undefined
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={industry.image ? 'text-center lg:text-left' : undefined}
              >
                <Breadcrumbs
                  items={breadcrumbItems}
                  className={industry.image ? 'mb-6 flex justify-center lg:justify-start' : 'mb-6 flex justify-center'}
                />
                <Link
                  to={ROUTES.industriesHub}
                  className="text-xs font-semibold uppercase tracking-wide text-brand hover:underline"
                >
                  Industries
                </Link>
                <span
                  className={
                    industry.image
                      ? 'mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft lg:mx-0'
                      : 'mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft'
                  }
                >
                  <Icon className="h-7 w-7" />
                </span>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{industry.name}</h1>
                <p
                  className={
                    industry.image
                      ? 'mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 lg:mx-0'
                      : 'mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600'
                  }
                >
                  {industry.intro}
                </p>
                <div
                  className={
                    industry.image
                      ? 'mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start'
                      : 'mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'
                  }
                >
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

              {industry.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="overflow-hidden rounded-2xl border border-brand/10 shadow-soft-lg"
                >
                  <ResponsiveImage
                    src={industry.image.src}
                    srcSet={buildResponsiveSrcSet(industry.image.src, 1536)}
                    sizes="(min-width: 1024px) 640px, 100vw"
                    alt={industry.image.alt}
                    width={900}
                    height={600}
                    className={`${industry.image.aspectClassName ?? 'aspect-[3/2]'} w-full object-cover`}
                    style={{ objectPosition: industry.image.objectPosition ?? 'center' }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Relevant Services for {industry.name}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {industry.relevantServices.map((service, index) => (
                <motion.div
                  key={service.path}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  variants={fadeUpItem}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={service.path}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-soft-lg"
                  >
                    <span className="text-sm font-medium text-slate-800">{service.label}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5" />
                  </Link>
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
              {industry.faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-slate-200 p-5 shadow-soft">
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{faq.question}</h3>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
