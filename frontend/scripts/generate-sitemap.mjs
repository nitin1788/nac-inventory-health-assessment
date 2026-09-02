// Build-time sitemap generator. Runs before `vite build` (see
// package.json's `build` script) so the freshly generated
// public/sitemap.xml is what Vite copies into dist/. Run via `tsx` (not
// plain `node`) so it can import the site's TypeScript data modules
// directly, without booting a full Vite dev server just to resolve a
// handful of files.
//
// Imports the actual TypeScript data modules that drive the site's
// routes, so the sitemap can never drift from what's really live: every
// service/industry/blog-post slug is read directly from its source of
// truth, not hand-copied into this file. Blog posts are the one
// exception to "just import it" — blog.registry.ts relies on Vite's
// import.meta.glob() (a Vite-only build-time macro with no plain-Node
// equivalent), so this script re-reads src/content/blog/*.md directly
// via fs and reuses the same, Vite-independent parseFrontmatter().
//
// What's deliberately NOT auto-derived, and why: there's no static
// analysis here of which pages set `noindex` in their useSeo() call
// (that's a runtime React value, not something safely inspectable from
// a Node script without rendering the app). So the small, genuinely
// static marketing shell (home/about/faq/contact/legal/hub pages) is a
// short, explicit, easy-to-audit list below — the same curation
// convention already used for NAV_LINKS/RESOURCE_LINKS in
// landing.data.ts. Everything else (30 service pages, 12 industry
// pages, every blog post) is fully automatic. The legacy
// assessment/payment routes, the 4 noindex "coming soon" Resources
// pages, and every redirect-only URL are never listed here or in
// STATIC_PAGES — matching their `noindex`/robots.txt-disallowed status.
import { writeFile, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INVENTORY_SERVICES } from '../src/config/services.inventory.data.ts';
import { DIGITAL_SERVICES } from '../src/config/services.digital.data.ts';
import { INDUSTRIES_LIST } from '../src/config/industries.data.ts';
import { SITE_URL, ROUTES } from '../src/config/constants.ts';
import { parseFrontmatter } from '../src/features/blog/parseFrontmatter.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', changefreq: 'monthly', priority: '0.95' },
  { path: '/industries', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms-and-conditions', changefreq: 'yearly', priority: '0.3' },
];

/** Mirrors blog.registry.ts's getAllPosts() (source of truth for the real registry) without depending on Vite's import.meta.glob(). */
async function getAllPostSlugs() {
  const blogDir = path.join(root, 'src', 'content', 'blog');
  const filenames = (await readdir(blogDir)).filter((f) => f.endsWith('.md') && f !== 'README.md');

  const posts = await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(blogDir, filename);
      const content = await readFile(filePath, 'utf-8');
      return parseFrontmatter(content, filePath);
    })
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function main() {
  const posts = await getAllPostSlugs();

  const urls = [
    ...STATIC_PAGES,
    { path: ROUTES.inventoryHub, changefreq: 'monthly', priority: '0.9' },
    ...INVENTORY_SERVICES.map((s) => ({ path: s.path, changefreq: 'monthly', priority: '0.7' })),
    { path: ROUTES.digitalMarketingHub, changefreq: 'monthly', priority: '0.9' },
    ...DIGITAL_SERVICES.map((s) => ({ path: s.path, changefreq: 'monthly', priority: '0.7' })),
    ...INDUSTRIES_LIST.map((i) => ({ path: i.path, changefreq: 'monthly', priority: '0.6' })),
    ...posts.map((p) => ({ path: `${ROUTES.blog}/${p.slug}`, changefreq: 'monthly', priority: '0.6' })),
  ];

  const seen = new Set();
  const deduped = urls.filter((u) => (seen.has(u.path) ? false : (seen.add(u.path), true)));

  const today = new Date().toISOString().slice(0, 10);
  const body = deduped
    .map(
      (u) =>
        `  <url>\n    <loc>${SITE_URL}${u.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  await writeFile(path.join(root, 'public', 'sitemap.xml'), xml, 'utf-8');
  console.log(`sitemap.xml generated with ${deduped.length} URLs (${posts.length} blog post${posts.length === 1 ? '' : 's'}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
