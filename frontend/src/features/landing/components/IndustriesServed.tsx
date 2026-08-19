import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { ROUTES } from '@/config/constants';
import { INDUSTRIES_SERVED } from '../landing.data';

export function IndustriesServed() {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Industries We Serve
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for Pharmacy, Healthcare &amp; Allied Businesses
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            A focused niche, not a side interest — practical experience across the healthcare
            business types where inventory accuracy and digital visibility matter most.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {INDUSTRIES_SERVED.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={fadeUpItem}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-7 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand transition-transform group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-800">{industry.name}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to={ROUTES.industriesHub}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            See all industries we serve
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
