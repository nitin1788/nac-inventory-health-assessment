import { motion } from 'framer-motion';
import { getModuleTitle } from '../questions';

interface AssessmentProgressBarProps {
  currentIndex: number;
  total: number;
  moduleId: string;
}

export function AssessmentProgressBar({ currentIndex, total, moduleId }: AssessmentProgressBarProps) {
  const percent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          Question {currentIndex + 1} of {total}
        </span>
        <span>{getModuleTitle(moduleId)}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-brand"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
