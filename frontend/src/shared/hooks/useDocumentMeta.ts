import { useEffect } from 'react';

function setMetaTag(name: string, content: string): () => void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  const existed = Boolean(tag);
  const previousContent = tag?.getAttribute('content') ?? null;

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);

  return () => {
    if (!existed) {
      tag?.remove();
    } else if (previousContent !== null) {
      tag?.setAttribute('content', previousContent);
    }
  };
}

/**
 * Sets the document title and meta description for the page it's called
 * from, restoring the previous values on unmount — so navigating between
 * pages never leaves a stale title/description from whichever page was
 * visited last.
 */
export function useDocumentMeta(title: string, description: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    const restoreDescription = setMetaTag('description', description);

    return () => {
      document.title = previousTitle;
      restoreDescription();
    };
  }, [title, description]);
}
