import { motion } from 'framer-motion';
import { BarChart3, FileText } from 'lucide-react';

/**
 * Illustrative sample data only — this is a mocked preview of the report
 * format, not a real client's results. Kept local (not in landing.data.ts)
 * so it's never mistaken for real assessment content.
 */
const SAMPLE_OVERALL_SCORE = 76;

const SAMPLE_MODULE_SCORES = [
  { label: 'Inventory Accuracy', percentage: 82 },
  { label: 'Warehouse Efficiency', percentage: 68 },
  { label: 'SOP Compliance', percentage: 74 },
  { label: 'Process Maturity', percentage: 71 },
];

function SampleBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-dark">
      Sample
    </span>
  );
}

function KpiDashboardPreview() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            KPI Dashboard Preview
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            Your Inventory Health Score
          </h3>
        </div>
        <SampleBadge />
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
        <div
          className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#0F2A52 ${SAMPLE_OVERALL_SCORE * 3.6}deg, #EEF3F8 0deg)`,
          }}
          role="img"
          aria-label={`Sample overall score: ${SAMPLE_OVERALL_SCORE} out of 100`}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-3xl font-bold text-brand">{SAMPLE_OVERALL_SCORE}</span>
            <span className="text-[11px] font-medium text-slate-500">out of 100</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-3">
          {SAMPLE_MODULE_SCORES.map((module) => (
            <div key={module.label}>
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>{module.label}</span>
                <span>{module.percentage}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${module.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-slate-600">
        Your real dashboard scores every module from your 52 answers, with a health rating and
        prioritized recommendations for each one.
      </p>
    </div>
  );
}

function SamplePdfPreview() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Sample Report Preview
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Your PDF Report</h3>
        </div>
        <SampleBadge />
      </div>

      <div className="mt-6 flex flex-1 flex-col items-center sm:flex-row sm:items-start sm:gap-6">
        <div className="mx-auto aspect-[3/4] w-full max-w-[220px] shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
          <div className="flex h-9 items-center gap-2 bg-brand px-3">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/90">
              Inventory Health Report
            </span>
          </div>
          <div className="space-y-3 p-4">
            <div className="h-2.5 w-3/4 rounded-full bg-slate-200" />
            <div className="h-2 w-full rounded-full bg-slate-100" />
            <div className="h-2 w-5/6 rounded-full bg-slate-100" />

            <div className="mt-4 flex h-16 items-end gap-1.5">
              {[60, 85, 45, 70, 55].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t bg-brand-100"
                  style={{ height: `${height}%`, backgroundColor: index % 2 === 0 ? '#0F2A52' : '#C89B3C' }}
                />
              ))}
            </div>

            <div className="h-2 w-full rounded-full bg-slate-100" />
            <div className="h-2 w-2/3 rounded-full bg-slate-100" />
          </div>
        </div>

        <div className="mt-6 flex flex-1 flex-col justify-center sm:mt-0">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
            <FileText className="h-5 w-5" />
          </span>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            A branded, downloadable PDF with your overall score, a module-by-module breakdown, and
            clear, prioritized recommendations — delivered to your inbox in minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReportPreview() {
  return (
    <section id="report-preview" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            <BarChart3 className="mr-1.5 inline h-4 w-4 -translate-y-0.5" />
            What You&apos;ll Receive
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            See Exactly What You Get
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            An illustrative preview of the scored dashboard and PDF report every assessment
            produces — your real report will reflect your own answers.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <KpiDashboardPreview />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <SamplePdfPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
