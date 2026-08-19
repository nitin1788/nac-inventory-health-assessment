import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { ROUTES } from '@/config/constants';
import { Button } from '@/shared/components/Button';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';

const DIGITAL_SERVICES = [
  'Website Development',
  'SEO',
  'Local SEO',
  'Google Business Profile',
  'Social Media Management',
  'AI-Assisted Content',
  'Google Ads',
  'PPC',
  'Meta Ads',
  'Performance Marketing',
  'Lead Generation',
];

/**
 * Homepage section giving the Digital Marketing vertical its own
 * dedicated, full-width, equally-prominent treatment (mirrored layout
 * from OperationsSection — visual on the left here, text on the right) so
 * digital marketing never reads as a secondary/bolt-on service.
 */
export function DigitalMarketingSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={fadeUpItem}
            className="order-2 overflow-hidden rounded-2xl border border-sky/15 shadow-soft-lg lg:order-1"
          >
            <ResponsiveImage
              src="/images/digital-marketing/nac-healthcare-digital-marketing.webp.png"
              alt="NAC consultants reviewing a digital marketing performance dashboard together"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={fadeUpItem}
            transition={{ delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-dark">Digital Marketing &amp; Growth</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Digital Growth for Pharmacy &amp; Healthcare Businesses
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Your website, search visibility, and social presence are how most new patients and
              customers find you today. We build and manage the digital presence — from your
              website and Google Business Profile to SEO, social media, and paid campaigns — that
              connects a pharmacy or healthcare business to more of the customers already looking
              for it.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              We don&apos;t promise guaranteed rankings, leads, or ROI — every recommendation is
              built around what&apos;s realistic for your business and budget.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {DIGITAL_SERVICES.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-sky/25 bg-sky-light px-3 py-1 text-xs font-medium text-sky-dark"
                >
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={ROUTES.digitalMarketingHub} className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">
                  Explore Digital Marketing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
