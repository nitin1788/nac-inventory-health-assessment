import { motion } from 'framer-motion';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { CONSULTING_VALUE_POINTS } from '../landing.data';

/**
 * Compact value-point strip shown right after the hero, in place of the
 * hero's old stat row — that stat row duplicated the dark navy
 * TrustStatistics band immediately below it. This section is
 * deliberately lighter than that navy band (white cards, small type) so
 * it doesn't compete with it.
 */
export function ConsultingValueSection() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Why Healthcare Businesses Choose NAC
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONSULTING_VALUE_POINTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={fadeUpItem}
                transition={{ delay: index * 0.06 }}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-soft"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-accent"
                />
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
