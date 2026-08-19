import { useParams } from 'react-router-dom';
import { BlogPostView } from '@/features/blog/BlogPostView';
import { getPostBySlug } from '@/features/blog/blog.registry';
import { NotFoundPage } from './NotFoundPage';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <NotFoundPage />;
  }

  return <BlogPostView post={post} />;
}
