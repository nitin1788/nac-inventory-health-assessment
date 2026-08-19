import { useState, type ImgHTMLAttributes } from 'react';

export interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'loading'> {
  src: string;
  /** Required, not optional — every image rendered through this component must describe its content. */
  alt: string;
  width: number;
  height: number;
  /**
   * Set true for above-the-fold images (hero art, a blog post's featured
   * image) to load eagerly and hint high priority. Defaults to false —
   * lazy-loaded, matching the site's convention for below-the-fold
   * content.
   */
  priority?: boolean;
}

/**
 * Reusable image wrapper — required alt text, explicit width/height
 * (prevents layout shift), and lazy-loading by default. Used throughout
 * the blog (featured + inline images) and anywhere else a raster image
 * is added to the site going forward. Format conversion (WebP/AVIF) is
 * a source-asset convention for Phase 1 (see content/blog/README.md),
 * not automated by this component — see NAC_PHASE_1_IMPLEMENTATION_PLAN.md §7.
 *
 * Real photography for this site is supplied separately (see
 * frontend/public/images/README.md) and is not fabricated here. If a
 * referenced file hasn't been dropped in yet, the <img> 404s and this
 * component swaps to a plain, dashed-border "pending asset" placeholder
 * — visible only in dev builds (`import.meta.env.DEV`) so a missing file
 * is obvious to whoever is building the page, never shown to a real site
 * visitor in production (a failed image there just quietly disappears).
 * This placeholder is intentionally not an SVG illustration or stock
 * photo — it carries no visual content, only a text label.
 */
export function ResponsiveImage({ src, alt, width, height, priority = false, className, ...rest }: ResponsiveImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {import.meta.env.DEV && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 border border-dashed border-slate-300 bg-slate-100 p-3 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Image pending
            </span>
            <span className="break-all text-[10px] text-slate-400">{src}</span>
          </div>
        )}
      </div>
    );
  }

  // React 18's DOM typings/runtime don't recognize the `fetchPriority` IDL
  // prop yet (that lands in React 19) — passed lowercase as a plain DOM
  // attribute instead, to avoid the "React does not recognize the
  // `fetchPriority` prop" console warning while still hinting the browser.
  const fetchPriorityAttr = { fetchpriority: priority ? 'high' : 'auto' } as Record<'fetchpriority', 'high' | 'auto'>;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
      {...fetchPriorityAttr}
      {...rest}
    />
  );
}
