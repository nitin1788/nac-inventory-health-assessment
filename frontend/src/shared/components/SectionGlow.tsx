interface SectionGlowProps {
  /** Which brand color the glow is tinted with. */
  tone?: 'navy' | 'gold';
  /** Include the faint grid-line pattern (used sparingly — one or two sections, not every one). */
  grid?: boolean;
}

const TONE_GRADIENT: Record<NonNullable<SectionGlowProps['tone']>, string> = {
  navy: 'bg-[radial-gradient(ellipse_at_top,_rgba(15,42,82,0.07),_transparent_60%)]',
  gold: 'bg-[radial-gradient(ellipse_at_top_right,_rgba(200,155,60,0.10),_transparent_55%)]',
};

/**
 * Decorative, non-interactive background layer — a soft brand-tinted
 * glow, optionally paired with a faint grid pattern. Pure CSS (no
 * images), so it costs nothing beyond a couple of extra composited
 * layers. Generalizes the inline pattern Hero.tsx used to hand-roll,
 * so section backgrounds stay visually consistent across the site.
 */
export function SectionGlow({ tone = 'navy', grid = false }: SectionGlowProps) {
  return (
    <>
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${TONE_GRADIENT[tone]}`} />
      {grid ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#0F2A52_1px,transparent_1px),linear-gradient(90deg,#0F2A52_1px,transparent_1px)] [background-size:56px_56px]"
        />
      ) : null}
    </>
  );
}
