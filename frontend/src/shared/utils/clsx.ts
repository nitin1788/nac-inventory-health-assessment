type ClassValue = string | number | boolean | null | undefined;

/**
 * Minimal className concatenation helper. Deliberately not pulling in
 * the `clsx` package for a single-purpose utility this small — if
 * conditional-class needs grow more complex later, swapping this
 * implementation for the real package is a one-file change.
 */
export function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
