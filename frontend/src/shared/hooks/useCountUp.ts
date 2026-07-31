import { useEffect, useState } from 'react';

/**
 * Animates a number from 0 up to `target` via requestAnimationFrame —
 * no charting/animation library needed. Pass `start` to gate the
 * animation (e.g. only once a section scrolls into view). Respects
 * prefers-reduced-motion by jumping straight to the target value.
 */
export function useCountUp(target: number, durationMs = 1200, start = true): number {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [value, setValue] = useState(start && !prefersReducedMotion ? 0 : target);

  useEffect(() => {
    if (!start || prefersReducedMotion) {
      setValue(target);
      return;
    }

    let frame: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, start, prefersReducedMotion]);

  return value;
}
