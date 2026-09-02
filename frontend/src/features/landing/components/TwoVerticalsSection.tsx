import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardList, Megaphone, CheckCircle2 } from 'lucide-react';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { ROUTES } from '@/config/constants';
import { INVENTORY_SERVICES } from '@/config/services.inventory.data';
import { DIGITAL_SERVICES } from '@/config/services.digital.data';

const INVENTORY_HIGHLIGHTS = [
  'Inventory Audit & Reconciliation',
  'Stock Accuracy & Dead Stock Control',
  'Expiry Management',
  'ABC / FSN Analysis',
  'Warehouse & Store Operations',
  'SOP Development',
  'Process Improvement',
  'MIS & KPI Reporting',
];
const DIGITAL_HIGHLIGHTS = [
  'Website Development & SEO',
  'Google Business Profile',
  'Social Media Management',
  'Content & AI-Assisted Content',
  'Google Ads / PPC',
  'Meta Ads',
  'Performance Marketing',
  'Lead Generation',
];

/**
 * The homepage's headline section for the two-vertical positioning.
 * Inventory & Operations Consulting carries the green (healthcare/
 * growth) identity; Digital Marketing & Growth carries the blue
 * identity — the two colors never swap roles anywhere on the site.
 * Deliberately never merges the two verticals into one generic list.
 *
 * No card thumbnail photos: the previously supplied source images
 * (public/images/inventory/nac-pharmacy-inventory-consulting.webp,
 * public/images/digital-marketing/nac-healthcare-digital-marketing.webp)
 * both have fabricated performance numbers baked into an on-screen
 * report/dashboard (e.g. an invented "Inventory Health Report" with
 * specific fake SKU counts; an invented "23,985 website visitors / 1,257
 * leads" marketing dashboard) — a no-fake-statistics violation that a CSS
 * crop can't fix, since the raw files stay directly and publicly
 * servable. Both files preserved, optimized, but unreferenced — see
 * NAC_SEO_READINESS_AUDIT.md.
 */
export function TwoVerticalsSection() {
  return (
    <section id="services" className="scroll-mt-20 bg-slate-50 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Two Specialized Verticals</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Two Ways We Help Healthcare Businesses Grow
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Different business problems require different expertise.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={fadeUpItem}
            className="flex flex-col overflow-hidden rounded-2xl border border-accent/20 bg-white shadow-soft"
          >
            <div className="flex flex-1 flex-col p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white">
              <ClipboardList className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-slate-900">Inventory &amp; Operations Consulting</h3>
            <p className="mt-2 text-sm font-medium text-accent-dark">
              Better inventory. Better operations. Better control.
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
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={fadeUpItem}
            transition={{ delay: 0.1 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-sky/20 bg-white shadow-soft"
          >
            <div className="flex flex-1 flex-col p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky text-white">
              <Megaphone className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-slate-900">Digital Marketing &amp; Growth</h3>
            <p className="mt-2 text-sm font-medium text-sky-dark">
              Stronger digital presence. More visibility. More customers. More growth.
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
              Explore Digital Marketing Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
