import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from '@/shared/utils/clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-white text-brand border border-brand hover:bg-brand/5',
  ghost: 'bg-transparent text-brand hover:bg-brand/5',
};

/**
 * Base button used across the app. Feature-specific buttons compose
 * this rather than reimplementing styles, so brand updates (once NAC's
 * design assets are finalized) happen in exactly one place.
 */
export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
