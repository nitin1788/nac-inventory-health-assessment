import { useEffect } from 'react';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/config/constants';

function setMetaByAttr(attr: 'name' | 'property', key: string, content: string): () => void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  const existed = Boolean(tag);
  const previousContent = tag?.getAttribute('content') ?? null;

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
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

function setLinkHref(rel: string, href: string): () => void {
  let tag = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  const existed = Boolean(tag);
  const previousHref = tag?.getAttribute('href') ?? null;

  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);

  return () => {
    if (!existed) {
      tag?.remove();
    } else if (previousHref !== null) {
      tag?.setAttribute('href', previousHref);
    }
  };
}

export interface SeoOptions {
  /** Document title and og:title/twitter:title. */
  title: string;
  /** Meta description and og:description/twitter:description. */
  description: string;
  /** Route path (e.g. "/about") used to build the canonical URL and og:url. */
  path: string;
  /** Set true for session-bound or state-dependent routes with no unique indexable content. */
  noindex?: boolean;
  /** Open Graph type — defaults to "website". */
  ogType?: 'website' | 'article';
  /** Absolute image URL override — defaults to the site's default social share image. */
  image?: string;
}

/**
 * Sets all per-page SEO tags (title, description, canonical, Open Graph,
 * Twitter Card, robots) for the page it's called from, restoring the
 * previous values on unmount — so navigating between pages in this SPA
 * never leaves stale metadata from whichever page was visited last.
 */
export function useSeo({ title, description, path, noindex = false, ogType = 'website', image }: SeoOptions): void {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const ogImage = image ?? DEFAULT_OG_IMAGE;
    const previousTitle = document.title;
    document.title = title;

    const restoreFns = [
      setMetaByAttr('name', 'description', description),
      setLinkHref('canonical', url),
      setMetaByAttr('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow'),
      setMetaByAttr('property', 'og:type', ogType),
      setMetaByAttr('property', 'og:title', title),
      setMetaByAttr('property', 'og:description', description),
      setMetaByAttr('property', 'og:url', url),
      setMetaByAttr('property', 'og:image', ogImage),
      setMetaByAttr('name', 'twitter:title', title),
      setMetaByAttr('name', 'twitter:description', description),
      setMetaByAttr('name', 'twitter:image', ogImage),
    ];

    return () => {
      document.title = previousTitle;
      restoreFns.forEach((restore) => restore());
    };
  }, [title, description, path, noindex, ogType, image]);
}
