import type { BlogPost, BlogPostFrontmatter } from './blog.types';

const REQUIRED_STRING_FIELDS: (keyof BlogPostFrontmatter)[] = [
  'title',
  'slug',
  'description',
  'date',
  'author',
  'category',
  'primaryKeyword',
  'featuredImage',
  'imageAlt',
];
const REQUIRED_ARRAY_FIELDS: (keyof BlogPostFrontmatter)[] = ['tags', 'secondaryKeywords'];

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseValue(rawValue: string): string | string[] {
  const value = rawValue.trim();
  if (value.startsWith('[') && value.endsWith(']')) {
    // tags/secondaryKeywords are written as a JSON string array, e.g.
    // ["pharmacy", "inventory audit"] — parsed with JSON.parse rather
    // than a general YAML parser, since that's all this fixed schema
    // needs and it avoids adding a YAML dependency.
    return JSON.parse(value) as string[];
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}

/**
 * Parses this project's specific blog frontmatter schema (see
 * blog.types.ts) out of a raw Markdown file's text. Intentionally not a
 * general-purpose YAML/frontmatter parser — the schema is small and
 * fixed, so a dedicated parser avoids adding a YAML dependency for a
 * handful of known fields.
 */
export function parseFrontmatter(fileContent: string, sourcePath: string): BlogPost {
  const match = FRONTMATTER_PATTERN.exec(fileContent);
  if (!match) {
    throw new Error(`Blog post ${sourcePath} is missing a "---" frontmatter block.`);
  }
  const frontmatterBlock = match[1] ?? '';
  const bodyMarkdown = match[2] ?? '';

  const raw: Record<string, string | string[]> = {};
  for (const line of frontmatterBlock.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      throw new Error(`Blog post ${sourcePath} has an invalid frontmatter line: "${line}"`);
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = parseValue(line.slice(separatorIndex + 1));
    raw[key] = value;
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof raw[field] !== 'string' || !raw[field]) {
      throw new Error(`Blog post ${sourcePath} is missing required frontmatter field "${field}".`);
    }
  }
  for (const field of REQUIRED_ARRAY_FIELDS) {
    if (!Array.isArray(raw[field])) {
      throw new Error(`Blog post ${sourcePath} is missing required frontmatter array field "${field}".`);
    }
  }

  return {
    title: raw.title as string,
    slug: raw.slug as string,
    description: raw.description as string,
    date: raw.date as string,
    author: raw.author as string,
    category: raw.category as string,
    tags: raw.tags as string[],
    primaryKeyword: raw.primaryKeyword as string,
    secondaryKeywords: raw.secondaryKeywords as string[],
    featuredImage: raw.featuredImage as string,
    imageAlt: raw.imageAlt as string,
    bodyMarkdown: bodyMarkdown.trim(),
  };
}
