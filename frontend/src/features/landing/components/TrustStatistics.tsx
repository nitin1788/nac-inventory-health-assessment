import { motion } from 'framer-motion';
import { TRUST_PILLARS } from '../landing.data';

export function TrustStatistics() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
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
