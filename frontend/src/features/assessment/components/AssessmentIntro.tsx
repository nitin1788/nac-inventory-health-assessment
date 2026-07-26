import { motion } from 'framer-motion';
import { Clock, ListChecks } from 'lucide-react';

export function AssessmentIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Before You Begin</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Let's Get to Know Your Business
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
        A few quick details so we can personalize your report — then you'll move straight into the
        assessment.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
        <span className="inline-flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand" />
          Estimated completion time: ~10 minutes
        </span>
        <span className="inline-flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-brand" />
          52 diagnostic questions
        </span>
      </div>
    </motion.div>
  );
}
