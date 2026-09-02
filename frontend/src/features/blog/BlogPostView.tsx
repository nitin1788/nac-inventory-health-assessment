import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { FinalCTABanner } from '@/features/landing/components/FinalCTABanner';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { buildBreadcrumbJsonLd } from '@/shared/utils/breadcrumbs';
import { COMPANY_NAME, ROUTES, SITE_URL } from '@/config/constants';
import type { BlogPost } from './blog.types';
import { getRelatedPosts } from './blog.registry';
import { renderMarkdownToHtml } from './renderMarkdown';
import { formatPostDate } from './formatPostDate';
import { RelatedArticles } from './components/RelatedArticles';

export function BlogPostView({ post }: { post: BlogPost }) {
  const pageUrl = `${SITE_URL}${ROUTES.blogPost(post.slug)}`;
  const absoluteImageUrl = post.featuredImage.startsWith('http') ? post.featuredImage : `${SITE_URL}${post.featuredImage}`;
  const relatedPosts = getRelatedPosts(post);
  const bodyHtml = renderMarkdownToHtml(post.bodyMarkdown);
  const breadcrumbItems = [
    { label: 'Home', path: ROUTES.landing },
    { label: 'Insights', path: ROUTES.blog },
    { label: post.title, path: ROUTES.blogPost(post.slug) },
  ];

  useSeo({
    title: `${post.title} | ${COMPANY_NAME}`,
    description: post.description,
    path: ROUTES.blogPost(post.slug),
    ogType: 'article',
    image: absoluteImageUrl,
  });

  useJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(breadcrumbItems),
      {
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        image: absoluteImageUrl,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Organization', name: post.author },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: pageUrl,
        keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
      },
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <article className="pb-20 pt-10 sm:pt-14">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} className="text-xs text-slate-500" />

            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand">{post.category}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>{post.author}</span>
              <span aria-hidden>&bull;</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
              <ResponsiveImage
                src={post.featuredImage}
                alt={post.imageAlt}
                width={1200}
                height={630}
                priority
                className="w-full"
              />
            </div>

            <div
              className="blog-content mt-10"
              // Content is authored in-repo by NAC, not user-submitted — see renderMarkdown.ts.
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {post.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </article>

        <RelatedArticles posts={relatedPosts} />
        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
