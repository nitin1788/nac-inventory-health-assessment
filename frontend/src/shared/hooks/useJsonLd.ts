import { useEffect } from 'react';

/**
 * Injects a `<script type="application/ld+json">` structured-data block
 * for the page it's called from, removing it on unmount so navigating
 * away never leaves stale structured data for a different page's content.
 * Pass `null` to skip injection (e.g. while data isn't ready yet).
 */
export function useJsonLd(data: object | null): void {
  useEffect(() => {
    if (!data) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);
}
