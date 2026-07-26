import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from '@/shared/utils/clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse' | 'outline';
  size?: 'md' | 'lg';
  children: ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-white text-brand border border-brand hover:bg-brand/5',
  ghost: 'bg-transparent text-brand hover:bg-brand/5',
  // Solid/outline variants meant for use on dark surfaces (e.g. the hero section).
  inverse: 'bg-white text-ink shadow-lg shadow-black/30 hover:bg-white/90 hover:shadow-xl',
  outline: 'border border-white/40 bg-white/5 text-white hover:bg-white/15',
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
