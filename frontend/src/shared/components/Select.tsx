import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { clsx } from '@/shared/utils/clsx';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  children: ReactNode;
}

/** Base select input, styled to match Input so form rows line up. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, hasError, children, ...rest },
  ref
) {
  return (
    <select
      ref={ref}
      className={clsx(
        'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20',
        hasError ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-brand',
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
});
