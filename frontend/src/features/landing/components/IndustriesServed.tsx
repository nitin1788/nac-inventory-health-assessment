import { motion } from 'framer-motion';
import { INDUSTRIES_SERVED } from '../landing.data';

export function IndustriesServed() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Industries We Serve
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for Businesses That Move Inventory
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Practical experience across the sectors where inventory accuracy and warehouse
            efficiency matter most.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {INDUSTRIES_SERVED.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-7 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand transition-transform group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-800">{industry.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
