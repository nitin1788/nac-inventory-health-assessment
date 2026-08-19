import { motion } from 'framer-motion';
import { PackageX, CalendarClock, FileText, Search, Globe, Share2 } from 'lucide-react';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';

interface ProblemCard {
  icon: typeof PackageX;
  vertical: 'Operations' | 'Digital Marketing';
  problem: string;
  solution: string;
}

const PROBLEMS: ProblemCard[] = [
  {
    icon: PackageX,
    vertical: 'Operations',
    problem: 'Stock counts never quite match what\'s actually on the shelf?',
    solution: 'An inventory audit and reconciliation process that finds out why — and fixes it.',
  },
  {
    icon: CalendarClock,
    vertical: 'Operations',
    problem: 'Losing money to expired or dead stock?',
    solution: 'Expiry management, dead stock analysis, and FEFO practices that catch it early.',
  },
  {
    icon: FileText,
    vertical: 'Operations',
    problem: 'Quality depends on which staff member is on shift?',
    solution: 'Clear, practical SOPs that make consistent operations repeatable, every shift.',
  },
  {
    icon: Globe,
    vertical: 'Digital Marketing',
    problem: 'Website that doesn\'t bring in enquiries?',
    solution: 'A website built and optimized specifically for how pharmacy and healthcare customers search and decide.',
  },
  {
    icon: Search,
    vertical: 'Digital Marketing',
    problem: 'Hard to find when someone searches nearby?',
    solution: 'Local SEO and Google Business Profile management built for "near me" searches.',
  },
  {
    icon: Share2,
    vertical: 'Digital Marketing',
    problem: 'Social media that isn\'t generating real interest?',
    solution: 'Consistent, healthcare-appropriate content and management built around actual growth, not just posting.',
  },
];

/**
 * Replaces the old "Client Success Stories" section — no fabricated
 * testimonials exist for this business, so this section is built around
 * real, concrete problems NAC solves instead of invented results.
 */
export function BusinessProblemsSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">How We Can Help</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Business Problems We Help Solve
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Common challenges pharmacy and healthcare businesses bring to us — and how we approach
            them.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((item, index) => {
            const Icon = item.icon;
            const isDigital = item.vertical === 'Digital Marketing';
            return (
              <motion.div
                key={item.problem}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={fadeUpItem}
                transition={{ delay: (index % 3) * 0.08 }}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
              >
                <span
                  className={
                    isDigital
                      ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-dark to-accent text-white'
                      : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white'
                  }
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p
                  className={
                    isDigital
                      ? 'mt-3 text-[11px] font-semibold uppercase tracking-wide text-accent-dark'
                      : 'mt-3 text-[11px] font-semibold uppercase tracking-wide text-brand'
                  }
                >
                  {item.vertical}
                </p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{item.problem}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.solution}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
