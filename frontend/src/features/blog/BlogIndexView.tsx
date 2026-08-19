import { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { FinalCTABanner } from '@/features/landing/components/FinalCTABanner';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { clsx } from '@/shared/utils/clsx';
import { useSeo } from '@/shared/hooks/useSeo';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { ROUTES, SITE_URL } from '@/config/constants';
import { getAllPosts, getAllCategories } from './blog.registry';
import { BlogCard } from './components/BlogCard';

/** Blog index at /blog — see pages/BlogPage.tsx. */
export function BlogIndexView() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useSeo({
    title: 'Insights & Blog | Nitin Anand Consulting',
    description:
      'Practical articles on pharmacy and healthcare inventory, operations, and digital marketing from Nitin Anand Consulting.',
    path: ROUTES.blog,
  });
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_URL}${ROUTES.blog}` },
    ],
  });

  const visiblePosts = activeCategory ? posts.filter((post) => post.category === activeCategory) : posts;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
          <SectionGlow tone="navy" />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Insights</p>
            <span className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft">
              <Newspaper className="h-7 w-7" />
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Pharmacy &amp; Healthcare Inventory and Digital Growth Insights
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Practical articles on inventory, operations, and digital marketing for pharmacy,
              healthcare, and allied businesses.
            </p>
          </div>
        </section>

        <section className="bg-white pb-16 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            {categories.length > 1 ? (
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className={clsx(
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                    activeCategory === null
                      ? 'border-brand bg-brand text-white'
                      : 'border-slate-200 text-slate-600 hover:border-brand/40'
                  )}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={clsx(
                      'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                      activeCategory === category
                        ? 'border-brand bg-brand text-white'
                        : 'border-slate-200 text-slate-600 hover:border-brand/40'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            ) : null}

            {visiblePosts.length > 0 ? (
              <div
                className={
                  visiblePosts.length === 1
                    ? 'mx-auto grid max-w-sm grid-cols-1 gap-6'
                    : visiblePosts.length === 2
                      ? 'mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2'
                      : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                }
              >
                {visiblePosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-14 text-center">
                <p className="text-base leading-relaxed text-slate-600">
                  New articles are on the way — check back soon, or reach out with a topic you&apos;d
                  like us to cover.
                </p>
              </div>
            )}
          </div>
        </section>

        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
