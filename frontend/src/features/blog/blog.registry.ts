import type { BlogPost } from './blog.types';
import { parseFrontmatter } from './parseFrontmatter';

// Loads every Markdown file under src/content/blog/ as raw text at build
// time (no runtime fetch) and parses its frontmatter. Adding a new blog
// post is just adding a new .md file here — no code changes required.
// README.md (authoring conventions for content editors) is explicitly
// excluded — it has no frontmatter block and isn't a published post.
const rawPostModules = import.meta.glob(['/src/content/blog/*.md', '!/src/content/blog/README.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ALL_POSTS: BlogPost[] = Object.entries(rawPostModules)
  .map(([path, content]) => parseFrontmatter(content, path))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts(): BlogPost[] {
  return ALL_POSTS;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const scored = ALL_POSTS.filter((candidate) => candidate.slug !== post.slug).map((candidate) => {
    const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
    const sameCategory = candidate.category === post.category ? 1 : 0;
    return { candidate, score: sharedTags * 2 + sameCategory };
  });

  return scored
    .sort((a, b) => b.score - a.score || (a.candidate.date < b.candidate.date ? 1 : -1))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(ALL_POSTS.map((post) => post.category))).sort();
}
