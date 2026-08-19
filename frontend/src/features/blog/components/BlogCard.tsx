import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { BlogPost } from '../blog.types';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { ROUTES } from '@/config/constants';
import { formatPostDate } from '../formatPostDate';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={ROUTES.blogPost(post.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft-lg"
    >
      <div className="aspect-[1200/630] w-full overflow-hidden bg-slate-100">
        <ResponsiveImage
          src={post.featuredImage}
          alt={post.imageAlt}
          width={1200}
          height={630}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">{post.category}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{post.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{formatPostDate(post.date)}</span>
          <span className="inline-flex items-center gap-1 font-medium text-brand">
            Read Article
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
