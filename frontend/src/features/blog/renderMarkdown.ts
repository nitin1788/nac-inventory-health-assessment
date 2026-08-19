import { Marked } from 'marked';

// Blog content is authored in-repo by NAC (not user-submitted), so
// rendering the resulting HTML via dangerouslySetInnerHTML in
// BlogPostView is a standard, safe pattern here — not a user-input XSS
// surface. A custom image renderer adds lazy-loading and explicit
// styling to every inline image without requiring post authors to write
// raw HTML in their Markdown.
const marked = new Marked({
  renderer: {
    image({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" decoding="async" class="my-6 w-full rounded-xl border border-slate-200" />`;
    },
  },
});

export function renderMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}
