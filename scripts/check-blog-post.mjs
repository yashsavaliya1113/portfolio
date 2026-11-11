// Quality gate for blog posts. Usage: node scripts/check-blog-post.mjs [slug ...]   (no args = every post)
// Used by the weekly OpenCode workflow so a weak or malformed AI draft never reaches a pull request.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const blogDir = path.join(root, "content", "blog");
const projectsSrc = fs.readFileSync(path.join(root, "src", "config", "projects.ts"), "utf8");
const projectSlugs = new Set([...projectsSrc.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]));
const allSlugs = fs.readdirSync(blogDir).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ""));

const args = process.argv.slice(2);
const targets = args.length ? args : allSlugs;
let failures = 0;

for (const slug of targets) {
  const file = path.join(blogDir, `${slug}.mdx`);
  if (!fs.existsSync(file)) {
    console.log(`✗ ${slug}: file not found`);
    failures++;
    continue;
  }
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const errors = [];
  const need = (cond, msg) => cond || errors.push(msg);

  need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug), "slug must be lowercase-kebab-case");
  need(typeof data.title === "string" && data.title.length >= 30 && data.title.length <= 120, "title 30-120 chars");
  need(typeof data.seoTitle === "string" && data.seoTitle.length <= 54, "seoTitle required, max 54 chars");
  need(typeof data.description === "string" && data.description.length >= 70 && data.description.length <= 160, "description 70-160 chars");
  need(/^\d{4}-\d{2}-\d{2}$/.test(String(data.date)) && /^\d{4}-\d{2}-\d{2}$/.test(String(data.modified)), "date and modified as YYYY-MM-DD");
  need(Array.isArray(data.tags) && data.tags.length >= 3, "at least 3 tags");
  need(typeof data.category === "string" && data.category.length > 0, "category required");
  need(Array.isArray(data.relatedProjects) && data.relatedProjects.length >= 1 && data.relatedProjects.every((p) => projectSlugs.has(p)), "relatedProjects: at least 1, all must be real project slugs");
  need(Array.isArray(data.relatedPosts) && data.relatedPosts.length >= 1 && data.relatedPosts.every((p) => allSlugs.includes(p) && p !== slug), "relatedPosts: at least 1, all must be existing other posts");
  need(Array.isArray(data.references) && data.references.length >= 2 && data.references.every((r) => /^https:\/\//.test(r?.url || "") && r?.title), "at least 2 references with https URLs");

  const prose = content.replace(/```[\s\S]*?```/g, ""); // ignore code blocks (shell comments start with #)
  const words = content.split(/\s+/).filter(Boolean).length;
  need(words >= 900, `at least 900 words (has ${words})`);
  need((prose.match(/^## /gm) || []).length >= 4, "at least 4 H2 sections");
  need(!/^# /m.test(prose), "no H1 in body (the title is the H1)");
  need(/```[a-z]+/.test(content), "at least one fenced code block with a language");
  const internal = [...content.matchAll(/\]\((\/[^)#\s]*)/g)].map((m) => m[1]);
  need(internal.length >= 2, "at least 2 internal links");
  for (const link of internal) {
    const m = link.match(/^\/(blog|projects)\/([a-z0-9-]+)\/?$/);
    const ok = link === "/ai-lab/" || link === "/blog/" || link === "/" || (m && (m[1] === "blog" ? allSlugs.includes(m[2]) : projectSlugs.has(m[2])));
    need(!!ok, `broken internal link ${link}`);
  }
  need(!/lorem ipsum|TODO|TBD|\[citation needed\]/i.test(content), "no placeholder text");
  need(!/in my (previous|last) (role|company)|at google|at microsoft/i.test(content), "no unverifiable personal claims");

  if (errors.length) {
    failures++;
    console.log(`✗ ${slug}`);
    errors.forEach((e) => console.log(`    - ${e}`));
  } else {
    console.log(`✓ ${slug} (${words} words)`);
  }
}
process.exit(failures ? 1 : 0);
