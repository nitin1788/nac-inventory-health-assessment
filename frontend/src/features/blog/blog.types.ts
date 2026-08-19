export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  description: string;
  /** ISO date string, e.g. "2026-08-18". */
  date: string;
  author: string;
  category: string;
  tags: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  featuredImage: string;
  imageAlt: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  /** Raw Markdown body (frontmatter stripped). */
  bodyMarkdown: string;
}
