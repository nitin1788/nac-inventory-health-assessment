import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { ROUTES } from '@/config/constants';
import { Button } from '@/shared/components/Button';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { buildResponsiveSrcSet } from '@/shared/utils/responsiveImage';

const OPERATIONS_SERVICES = [
  'Inventory Audit',
  'Inventory Reconciliation',
  'Stock Accuracy',
  'Dead Stock Control',
  'Expiry Management',
  'ABC / FSN Analysis',
  'Warehouse & Store Operations',
  'SOP Development',
  'Process Improvement',
  'MIS & KPI Reporting',
];

/**
 * Homepage section giving the Inventory & Operations vertical its own
 * dedicated, full-width treatment — balanced against DigitalMarketingSection
 * below so neither vertical reads as secondary. Illustration shows the
 * consulting flow (Inventory → Control → Operations → Improvement), not
 * a software product dashboard.
 */
export function OperationsSection() {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE} variants={fadeUpItem}>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-dark">Inventory &amp; Operations Consulting</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Better Inventory. Better Operations. Better Control.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Pharmacy and healthcare stock carries real complexity — batch numbers, expiry dates,
              and tight margins that a generic inventory approach ignores. We help you get accurate
              stock counts, reduce dead and expiring stock, and put clear, repeatable processes in
              place across your store or warehouse.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {OPERATIONS_SERVICES.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-accent/25 bg-accent-light px-3 py-1 text-xs font-medium text-accent-dark"
                >
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={ROUTES.inventoryHub} className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">
                  Explore Operations Consulting
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={fadeUpItem}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-accent/15 shadow-soft-lg"
          >
            <ResponsiveImage
              src="/images/operations/nac-healthcare-operations-consulting.webp"
              srcSet={buildResponsiveSrcSet('/images/operations/nac-healthcare-operations-consulting.webp', 1536)}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="NAC consultants reviewing a warehouse process flow and SOP documents"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
