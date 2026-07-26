import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from '@/shared/utils/clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

/**
 * Base text input used across forms. Feature forms compose this
 * rather than styling native inputs directly, so field styling stays
 * in one place.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError, ...rest },
  ref
) {
  return (
    <input
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
