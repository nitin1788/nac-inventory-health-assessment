import { motion } from 'framer-motion';
import { Search, Stethoscope, ClipboardList, Wrench, TrendingUp } from 'lucide-react';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Understand',
    description: 'We understand your business, operations, market and goals.',
  },
  {
    icon: Stethoscope,
    step: '02',
    title: 'Diagnose',
    description: 'We identify gaps in operations, inventory and digital presence.',
  },
  {
    icon: ClipboardList,
    step: '03',
    title: 'Plan',
    description: 'We create a practical, prioritized action plan.',
  },
  {
    icon: Wrench,
    step: '04',
    title: 'Implement',
    description: 'We support implementation with expert guidance.',
  },
  {
    icon: TrendingUp,
    step: '05',
    title: 'Improve',
    description: 'We measure results and continuously optimize.',
  },
];

/** Homepage process section — the same 5-step approach applied to either vertical. */
export function HowWeHelp() {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Our Approach</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How We Work With You
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            The same practical, five-step approach applied whether the engagement is operations,
            digital growth, or both.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line behind the step badges — desktop only. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-slate-200 lg:block"
            style={{ marginInline: '10%' }}
          />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT_ONCE}
                  variants={fadeUpItem}
                  transition={{ delay: index * 0.08 }}
                  className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
                >
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-soft">
                    {item.step}
                  </span>
                  <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent-dark">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
