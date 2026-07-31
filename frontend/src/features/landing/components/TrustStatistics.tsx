import { motion } from 'framer-motion';
import { scaleIn, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { TRUST_PILLARS } from '../landing.data';

export function TrustStatistics() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.label}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={scaleIn}
                transition={{ delay: index * 0.08 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-6 text-center shadow-soft backdrop-blur-sm transition-shadow hover:shadow-soft-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-sm font-semibold leading-snug text-slate-900">{pillar.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
