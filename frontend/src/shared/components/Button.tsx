import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from '@/shared/utils/clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse' | 'outline' | 'whatsapp';
  size?: 'md' | 'lg';
  children: ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  // Navy fill — the site's primary CTA treatment.
  primary: 'bg-brand text-white shadow-soft hover:bg-brand-light hover:shadow-soft-lg',
  secondary: 'bg-white text-brand border border-brand/30 hover:border-brand hover:bg-brand-50',
  ghost: 'bg-transparent text-brand hover:bg-brand-50',
  // White button for use on navy surfaces (e.g. the final CTA banner card).
  inverse: 'bg-white text-brand shadow-soft hover:bg-slate-50',
  // Outlined white button — the secondary CTA treatment on navy/brand surfaces.
  outline: 'border border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10',
  // Healthcare green — reserved for WhatsApp CTAs specifically, per the
  // site's color system (green = growth/positive/WhatsApp).
  whatsapp: 'bg-accent text-white shadow-soft hover:bg-accent-dark hover:shadow-glow',
};

// min-h ensures a touch-friendly ~44px tap target regardless of line-height.
const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[48px] px-6 py-3.5 text-base',
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
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
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
