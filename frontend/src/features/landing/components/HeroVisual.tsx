import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

/** Illustrative sample data only, same convention as ReportPreview's mocked dashboard — not real client results. */
const SAMPLE_TREND = [58, 82, 65, 90, 74, 96];
const SAMPLE_SCORE = 80;
const ABC_SEGMENTS = [
  { label: 'A', percent: 20, colorClass: 'bg-brand' },
  { label: 'B', percent: 30, colorClass: 'bg-brand-light' },
  { label: 'C', percent: 50, colorClass: 'bg-accent/60' },
];

/**
 * Premium "product shot" for the hero's right side — a clean, hand-built
 * dashboard mockup (pure CSS/SVG, no images or chart library) standing
 * in for the KPI dashboard every assessment produces. Explicitly
 * labeled "Sample Dashboard" — illustrative only, no real company data.
 */
export function HeroVisual() {
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
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-2xl border border-slate-200/60 bg-white/90 p-5 shadow-soft-lg backdrop-blur-sm sm:p-6"
        >
          <div className="flex items-center gap-1.5">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2 truncate text-[11px] font-medium text-slate-400">Inventory Health</span>
            <span className="ml-auto shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-dark">
              Sample Dashboard
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div
              aria-hidden
              className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
              style={{ background: `conic-gradient(#0F2A52 ${SAMPLE_SCORE * 3.6}deg, #EEF3F8 0deg)` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                <span className="text-sm font-bold text-brand">{SAMPLE_SCORE}</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Inventory Health Score</p>
              <p className="text-xs text-slate-500">Out of 100</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Accuracy</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">96%</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Dead Stock</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">3.2%</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Wh. Util.</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">82%</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">ABC Analysis</p>
            <div aria-hidden className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full">
              {ABC_SEGMENTS.map((segment) => (
                <span
                  key={segment.label}
                  className={`h-full ${segment.colorClass}`}
                  style={{ width: `${segment.percent}%` }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
              {ABC_SEGMENTS.map((segment) => (
                <span key={segment.label}>
                  {segment.label}: {segment.percent}%
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Accuracy Trend</p>
            <div aria-hidden className="mt-2 flex h-16 items-end gap-1.5">
              {SAMPLE_TREND.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-brand to-brand-light"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
              +12% improvement this quarter
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
