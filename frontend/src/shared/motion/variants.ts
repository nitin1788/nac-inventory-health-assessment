import type { Variants } from 'framer-motion';

/** Standard viewport trigger for scroll-in animations — fires once, slightly before the element is fully in view. */
export const VIEWPORT_ONCE = { once: true, margin: '-80px' } as const;

/** Single-element fade-up-on-scroll, with an optional stagger delay for grids that animate item-by-item via `custom`/`delay`. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }),
};

/** Container variant for staggered children — pair with `fadeUpItem` on each child. */
export const fadeUpStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Subtle scale-in, used for stat tiles and glass cards. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
