import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { marked } from "marked";

const contentDir = path.join(process.cwd(), "content", "blog");

export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  readingTime: string;
  published: boolean;
}

export function getAllPosts(): BlogMeta[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data, content } = matter(raw);
    const readTime = readingTime(content);

    return {
      slug: file.replace(".mdx", ""),
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags || [],
      category: data.category || "General",
      readingTime: readTime.text,
      published: data.published !== false,
    };
  });

  return posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const readTime = readingTime(content);

  const html = marked.parse(content, { async: false }) as string;

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags || [],
    category: data.category || "General",
    readingTime: readTime.text,
    content: html,
    published: data.published !== false,
  };
}
