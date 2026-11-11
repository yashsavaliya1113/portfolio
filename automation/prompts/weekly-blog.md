You are writing one new technical blog article for Yash Savaliya's portfolio site (a Next.js static site).
Work only inside this repository. Today's date is given below as TODAY.

## Task
1. Open `automation/blog-topics.md` and take the FIRST unchecked topic (`- [ ]`). If every topic is checked, choose a new topic about ASP.NET Core, SQL, Python data analysis, Azure or Power BI that the site has not covered yet (read `content/blog/` first), and add it to the list.
2. Write the article as `content/blog/<slug>.mdx` where `<slug>` is a lowercase-kebab-case slug containing the primary keyword.
3. Change that topic's line in `automation/blog-topics.md` from `- [ ]` to `- [x]` and append ` -> <slug>` to it.
4. Change nothing else. Do not edit any other file.

## Study the house style first
Read two existing posts in `content/blog/` (for example `clean-maintainable-aspnet-core-web-api.mdx` and `sql-query-optimization-techniques.mdx`) and match their structure, tone and front matter exactly.

## Front matter (all fields required)
```
---
title: "<full title, 30-120 chars>"
seoTitle: "<max 54 chars>"
description: "<70-160 chars, specific, no clickbait>"
date: "TODAY"
modified: "TODAY"
tags: ["...", "...", "..."]        # at least 3
category: "Engineering" | "Data & Automation" | "Cloud" | "AI"
published: true
relatedProjects: ["<existing project slug from src/config/projects.ts>"]
relatedPosts: ["<existing post slug>"]
references:                          # at least 2, official documentation preferred, https only
  - title: "..."
    url: "https://..."
---
```

## Content rules (these are enforced by an automated check and by human review)
- 1,000 to 1,800 words, at least 4 `##` sections, practical and specific. No `#` heading in the body.
- Original writing. Do not copy documentation or other blogs. Explain why, not just how.
- Include at least one realistic, correct code example in a fenced block with a language tag. If you can run it in this environment (Node, Python, SQL via sqlite3), run it and make sure it works. If you cannot run it (SQL Server, Azure, C#), say nothing misleading and keep it conservative and idiomatic.
- Include at least two internal links using exact paths, for example `[SQL query optimization](/blog/sql-query-optimization-techniques/)` and `[project name](/projects/<slug>/)`. Only link to pages that exist.
- End with a short section pointing to the most relevant project or article.
- Do NOT invent facts: no made-up statistics, benchmarks, client names, employers, results or personal anecdotes. You may refer to Yash's real, public work only as described on the site (for example the RERA analysis of 5,478 projects, the synthetic-data SaaS incident analytics, iTechOps SaaS platforms). Do not claim personal experience beyond that.
- No keyword stuffing, no filler introductions, no artificial padding, no "In today's fast-paced world".
- If a version-specific detail might have changed (CLI flags, API names), say to check the linked documentation.

## Before you finish
Run `node scripts/check-blog-post.mjs <slug>` and fix every problem it reports until it prints a check mark. Then stop. Do not commit, push or open a pull request; the workflow does that.
