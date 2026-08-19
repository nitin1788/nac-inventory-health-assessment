import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { ROUTES } from '@/config/constants';
import { getAllPosts } from '@/features/blog/blog.registry';
import { BlogCard } from '@/features/blog/components/BlogCard';

/**
 * Homepage "latest from the blog" teaser. Renders nothing if there are
 * no published posts yet, so the homepage never ships with an
 * empty-looking section — see NAC_PHASE_1_IMPLEMENTATION_PLAN.md §4.
 */
export function InsightsTeaser() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Insights</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Insights for Pharmacy &amp; Healthcare Businesses
            </h2>
          </div>
          <Link
            to={ROUTES.blog}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className={
            posts.length === 1
              ? 'mx-auto mt-10 grid max-w-sm grid-cols-1 gap-6'
              : posts.length === 2
                ? 'mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2'
                : 'mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT_ONCE}
              variants={fadeUpItem}
              transition={{ delay: index * 0.08 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
