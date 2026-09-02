import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { clsx } from '@/shared/utils/clsx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

/** Base textarea used across forms — mirrors Input.tsx's styling so the two compose visually. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, hasError, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20',
        hasError ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-brand',
        className
      )}
      {...rest}
    />
  );
});
