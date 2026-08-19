# Blog content

Each file in this folder is one published article at `/blog/<slug>`. Adding a new post never
requires touching any React component — drop a new `.md` file here (and its images under
`frontend/public/blog-images/<slug>/`) and it appears automatically.

## Frontmatter

Every post needs this exact frontmatter block at the top of the file:

```markdown
---
title: "Article Title"
slug: "article-title-slug"
description: "One or two sentence summary used as the meta description and card blurb."
date: "2026-08-18"
author: "Nitin Anand Consulting"
category: "Inventory & Operations"
tags: ["tag-one", "tag-two"]
primaryKeyword: "main search phrase this article targets"
secondaryKeywords: ["related phrase one", "related phrase two"]
featuredImage: "/blog-images/article-title-slug/featured.jpg"
imageAlt: "Description of the featured image for screen readers and SEO"
---
```

- `tags` and `secondaryKeywords` must be written as a JSON-style array of double-quoted strings
  (as shown above) — this is parsed directly, not a general YAML parser.
- `slug` must match the filename (without `.md`) and must be unique.
- `date` must be `YYYY-MM-DD`.
- `category` should be one of the site's two verticals' general topics (e.g. "Inventory &
  Operations" or "Digital Marketing") or a shared topic — used for the related-articles matching.

## Images

- Put every image for a post under `frontend/public/blog-images/<slug>/`.
- Filenames: `kebab-case-descriptive-name.ext` (e.g. `pharmacy-shelf-inventory-check.webp`) —
  never `IMG_1234.jpg`.
- Prefer WebP where practical; compress before committing. Automated format conversion isn't
  wired up yet (see `NAC_PHASE_1_IMPLEMENTATION_PLAN.md` §7) — export pre-optimized files.
- Reference the featured image via the `featuredImage` frontmatter field, and inline images with
  standard Markdown syntax: `![descriptive alt text](/blog-images/<slug>/inline-name.webp)`. Alt
  text is required on every image — it's the only thing a screen reader or search engine sees.

## Body content

Standard Markdown — headings, lists, links, images, bold/italic. Internal links to service or
industry pages (e.g. `[inventory audit](/services/inventory-operations-consulting/inventory-audit)`) are
encouraged; they're the main mechanism connecting blog content back to the service pages it
supports.
