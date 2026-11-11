import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Marked } from "marked";

const contentDir = path.join(process.cwd(), "content", "blog");

export interface BlogReference {
  title: string;
  url: string;
}

export interface BlogMeta {
  slug: string;
  title: string;
  /** Shorter title for <title>/Open Graph. The on-page H1 keeps the full title. */
  seoTitle: string;
  description: string;
  date: string;
  modified: string;
  tags: string[];
  category: string;
  readingTime: string;
  published: boolean;
  /** Slugs of projects in src/config/projects.ts that this article relates to. */
  relatedProjects: string[];
  /** Slugs of other articles to show under "Related articles". */
  relatedPosts: string[];
  references: BlogReference[];
}

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function readMeta(file: string, data: Record<string, unknown>, content: string): BlogMeta {
  const date = String(data.date);
  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: String(data.title),
    seoTitle: data.seoTitle ? String(data.seoTitle) : String(data.title),
    description: String(data.description),
    date,
    modified: data.modified ? String(data.modified) : date,
    tags: (data.tags as string[]) || [],
    category: (data.category as string) || "General",
    readingTime: readingTime(content).text,
    published: data.published !== false,
    relatedProjects: (data.relatedProjects as string[]) || [],
    relatedPosts: (data.relatedPosts as string[]) || [],
    references: (data.references as BlogReference[]) || [],
  };
}

export function getAllPosts(): BlogMeta[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(contentDir, file), "utf-8"));
      return readMeta(file, data, content);
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  const file = ["mdx", "md"].map((ext) => `${slug}.${ext}`).find((f) => fs.existsSync(path.join(contentDir, f)));
  if (!file) return null;

  const { data, content } = matter(fs.readFileSync(path.join(contentDir, file), "utf-8"));
  const meta = readMeta(file, data, content);

  // Stable heading ids shared by the table of contents and the rendered HTML.
  const seen = new Map<string, number>();
  const parser = new Marked();
  const headings = parser
    .lexer(content)
    .filter((t) => t.type === "heading")
    .map((t) => {
      const h = t as unknown as { text: string; depth: number };
      const base = slugify(h.text) || "section";
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return { id: n ? `${base}-${n}` : base, text: h.text.replace(/[`*_]/g, ""), depth: h.depth };
    });

  let headingIndex = 0;
  const renderer = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const h = headings[headingIndex++];
        return `<h${depth} id="${h?.id ?? ""}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${href}"${title ? ` title="${title}"` : ""}${attrs}>${text}</a>`;
      },
    },
  });
  const html = renderer.parse(content, { async: false }) as string;
  const toc: TocItem[] = headings.filter((h) => h.depth === 2 || h.depth === 3);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return { ...meta, content: html, toc, wordCount };
}

export interface BlogChunk {
  postSlug: string;
  postTitle: string;
  heading: string;
  anchor: string;
  text: string;
}

/** Splits every published article into heading-level passages for the AI Lab retrieval demo. */
export function getAllChunks(): BlogChunk[] {
  const chunks: BlogChunk[] = [];
  for (const meta of getAllPosts()) {
    const file = ["mdx", "md"].map((ext) => `${meta.slug}.${ext}`).find((f) => fs.existsSync(path.join(contentDir, f)));
    if (!file) continue;
    const { content } = matter(fs.readFileSync(path.join(contentDir, file), "utf-8"));
    const seen = new Map<string, number>();
    // Same slug rule as getPostBySlug so anchors resolve to the rendered headings.
    const anchorFor = (heading: string) => {
      const base = slugify(heading) || "section";
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return n ? `${base}-${n}` : base;
    };
    const sections = content.split(/^(#{2,3}) +(.+)$/m);
    // sections = [intro, hashes, title, body, hashes, title, body, ...]
    const push = (heading: string, anchor: string, body: string) => {
      const text = body
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[`*_>|#-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (text.length > 60) chunks.push({ postSlug: meta.slug, postTitle: meta.title, heading, anchor, text: text.slice(0, 1200) });
    };
    push(meta.title, "", sections[0]);
    for (let i = 1; i < sections.length; i += 3) {
      const heading = sections[i + 1].trim();
      push(heading, anchorFor(heading), sections[i + 2] ?? "");
    }
  }
  return chunks;
}
