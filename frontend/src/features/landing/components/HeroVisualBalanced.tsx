import { motion } from 'framer-motion';
import { ClipboardList, Megaphone, CheckCircle2 } from 'lucide-react';

const OPERATIONS_POINTS = ['Inventory Audit & Accuracy', 'SOPs & Process Improvement', 'MIS & KPI Reporting'];
const DIGITAL_POINTS = ['Website & SEO', 'Google Business Profile', 'Social Media & Ads'];

/**
 * Hero's right-side visual — a balanced, two-vertical panel. Deliberately
 * NOT a "score" or dashboard mockup: the site previously featured an
 * "Inventory Health Score" gauge here, which made inventory the dominant
 * visual and read as the old assessment product. This replacement gives
 * both verticals equal visual weight and shows no fabricated numbers.
 */
export function HeroVisualBalanced() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(200,155,60,0.08),_transparent_65%)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        className="rounded-2xl border border-slate-200/60 bg-white/90 p-5 shadow-soft-lg backdrop-blur-sm sm:p-6"
      >
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          Two Specialized Verticals
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-brand/15 bg-brand-50/40 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white">
              <ClipboardList className="h-4 w-4" />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-900">Operations</p>
            <ul className="mt-2 space-y-1.5">
              {OPERATIONS_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-dark to-accent text-white">
              <Megaphone className="h-4 w-4" />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-900">Digital Growth</p>
            <ul className="mt-2 space-y-1.5">
              {DIGITAL_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-accent-dark" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-5 text-center text-sm leading-relaxed text-slate-600">
          One partner across both — specialist consulting built specifically for pharmacy and
          healthcare businesses.
        </p>
      </motion.div>
    </div>
  );
}
