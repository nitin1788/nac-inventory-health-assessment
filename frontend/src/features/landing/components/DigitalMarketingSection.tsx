import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { ROUTES } from '@/config/constants';
import { Button } from '@/shared/components/Button';

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
 * dedicated, full-width, equally-prominent treatment so digital marketing
 * never reads as a secondary/bolt-on service.
 *
 * No photo: this section originally mirrored OperationsSection with a
 * photo on one side (public/images/digital-marketing/nac-healthcare-
 * digital-marketing.webp), but that source photo has a fabricated
 * "23,985 website visitors / 1,257 leads / ₹42.5 cost-per-lead" dashboard
 * baked into an on-screen laptop — a no-fake-statistics violation a CSS
 * crop can't fix, since the raw file stays directly and publicly
 * servable. Centered single-column layout used instead, matching the
 * text-only pattern elsewhere on the site. File preserved, optimized,
 * but unreferenced — a real, clean digital-marketing photo would restore
 * visual parity with OperationsSection; see NAC_SEO_READINESS_AUDIT.md.
 */
export function DigitalMarketingSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={fadeUpItem}
          className="mx-auto max-w-2xl text-center"
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

          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {DIGITAL_SERVICES.map((label) => (
              <li
                key={label}
                className="rounded-full border border-sky/25 bg-sky-light px-3 py-1 text-xs font-medium text-sky-dark"
              >
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={ROUTES.digitalMarketingHub} className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto">
                Explore Digital Marketing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
