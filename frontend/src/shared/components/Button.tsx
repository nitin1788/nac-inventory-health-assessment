import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from '@/shared/utils/clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse' | 'outline';
  size?: 'md' | 'lg';
  children: ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  // Navy fill, gold on hover — the site's primary CTA treatment.
  primary: 'bg-brand text-white hover:bg-accent hover:text-ink',
  secondary: 'bg-white text-brand border border-brand hover:border-accent hover:text-accent-dark',
  ghost: 'bg-transparent text-brand hover:bg-accent/10 hover:text-accent-dark',
  // White button for use on navy surfaces (e.g. the final CTA banner card).
  inverse: 'bg-white text-brand hover:bg-accent hover:text-ink',
  // Outlined white button — the secondary CTA treatment on navy/brand surfaces.
  outline: 'border border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10',
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

/**
 * Base button used across the app. Feature-specific buttons compose
 * this rather than reimplementing styles, so brand updates (once NAC's
 * design assets are finalized) happen in exactly one place.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
