import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Client Success Stories
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Client Success Stories
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-14 text-center shadow-sm"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
            <Quote className="h-6 w-6" />
          </span>
          <p className="text-base leading-relaxed text-slate-600">
            Case studies and client testimonials will be published soon.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
