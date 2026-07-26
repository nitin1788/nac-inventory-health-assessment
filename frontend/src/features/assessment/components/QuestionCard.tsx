import { motion } from 'framer-motion';
import { clsx } from '@/shared/utils/clsx';
import { getModuleTitle, getQuestionOptions, type Question } from '../questions';
import type { AnswerValue } from '../useAssessmentEngine';

interface QuestionCardProps {
  question: Question;
  selectedValue: AnswerValue | undefined;
  onSelect: (value: AnswerValue) => void;
}

export function QuestionCard({ question, selectedValue, onSelect }: QuestionCardProps) {
  const options = getQuestionOptions(question);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        {getModuleTitle(question.moduleId)}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">{question.text}</h2>
      {question.helperText ? (
        <p className="mt-2 text-sm text-slate-500">{question.helperText}</p>
      ) : null}

      {question.type === 'textarea' ? (
        <textarea
          value={typeof selectedValue === 'string' ? selectedValue : ''}
          onChange={(event) => onSelect(event.target.value)}
          rows={4}
          placeholder="Type your answer here..."
          className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-5">
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                aria-pressed={isSelected}
                className={clsx(
                  'rounded-xl border px-3 py-3 text-center text-sm font-medium transition-colors',
                  isSelected
                    ? 'border-brand bg-brand text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand/40 hover:bg-brand-50'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
