import { motion } from 'framer-motion';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { TRUST_STATS } from '../landing.data';

/** Dark navy trust/experience band — factual stats only, no fabricated client figures. */
export function TrustStatistics() {
  return (
    <section className="bg-brand py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {TRUST_STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={fadeUpItem}
                transition={{ delay: index * 0.08 }}
                className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left"
              >
                <Icon className="h-5 w-5 text-accent" />
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-white/60 sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
