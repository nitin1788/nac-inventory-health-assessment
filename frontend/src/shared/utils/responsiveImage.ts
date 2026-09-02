/**
 * Builds a two-resolution `srcSet` for images processed by
 * `scripts/optimize-images.mjs`, which emits a real, compressed WebP at
 * the source path plus an `-800w` mobile variant alongside it (e.g.
 * `photo.webp` + `photo-800w.webp`). `fullWidth` must be the actual
 * intrinsic pixel width of `fullSrc` (not its display size) — that's
 * what the browser compares against `sizes` to pick a resource.
 */
export function buildResponsiveSrcSet(fullSrc: string, fullWidth: number): string {
  const mobileSrc = fullSrc.replace(/\.webp$/, '-800w.webp');
  return `${mobileSrc} 800w, ${fullSrc} ${fullWidth}w`;
}
