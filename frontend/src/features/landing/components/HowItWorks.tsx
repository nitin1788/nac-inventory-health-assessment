import { motion } from 'framer-motion';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { PROCESS_STEPS } from '../landing.data';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-gradient-to-b from-slate-50 to-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From Questions to Action in Minutes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            A simple, structured path from a five-minute questionnaire to a clear action plan.
          </p>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-slate-200 lg:block"
          />

          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={fadeUpItem}
                transition={{ delay: index * 0.08 }}
                className="relative flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold tracking-wide text-accent-dark">
                    STEP {step.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
