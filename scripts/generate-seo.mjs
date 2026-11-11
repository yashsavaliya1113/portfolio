import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const outDir = path.join(rootDir, "out");
const publicDir = path.join(rootDir, "public");
const blogDir = path.join(rootDir, "content", "blog");
const projectsFile = path.join(rootDir, "src", "config", "projects.ts");

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yashsavaliya1113.github.io/portfolio").replace(/\/$/, "");

// URLs end with "/" because next.config.ts sets trailingSlash: true. This keeps sitemap, canonical and real URL identical.
const withSlash = (p) => `${siteUrl}${p === "/" ? "/" : p.replace(/\/?$/, "/")}`;
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const staticPages = ["/", "/blog", "/ai-lab", "/resume", "/rera-analytics", "/incident-analytics"];

const projectSlugs = fs.existsSync(projectsFile)
  ? [...fs.readFileSync(projectsFile, "utf-8").matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1])
  : [];

const posts = fs.existsSync(blogDir)
  ? fs
      .readdirSync(blogDir)
      .filter((f) => /\.mdx?$/.test(f))
      .map((file) => {
        const { data } = matter(fs.readFileSync(path.join(blogDir, file), "utf-8"));
        const date = String(data.date);
        return {
          slug: file.replace(/\.mdx?$/, ""),
          title: String(data.title),
          description: String(data.description || ""),
          date,
          modified: String(data.modified || date),
          category: String(data.category || "Engineering"),
          published: data.published !== false,
        };
      })
      .filter((p) => p.published)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  : [];

// lastmod is only emitted where it is real (article modification date). Other pages omit it rather than claim "today".
const urls = [
  ...staticPages.map((p) => ({ loc: withSlash(p) })),
  ...projectSlugs.map((s) => ({ loc: withSlash(`/projects/${s}`) })),
  ...posts.map((p) => ({ loc: withSlash(`/blog/${p.slug}`), lastmod: p.modified })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${xml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}\n  </url>`).join("\n")}
</urlset>
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
console.log(`✓ Generated sitemap.xml (${urls.length} URLs)`);

const rssItems = posts
  .map(
    (p) => `    <item>
      <title>${xml(p.title)}</title>
      <description>${xml(p.description)}</description>
      <link>${withSlash(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${withSlash(`/blog/${p.slug}`)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${xml(p.category)}</category>
    </item>`,
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yash Savaliya's Blog</title>
    <description>Practical articles on ASP.NET Core, SQL, Python, Azure and AI integration in .NET.</description>
    <link>${withSlash("/blog")}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
${rssItems}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(outDir, "rss.xml"), rss);
console.log("✓ Generated rss.xml");

// Static files that Next's export does not copy from public/ automatically are already included; copy the SEO-critical ones explicitly.
for (const file of ["robots.txt", "llms.txt", "9f8e7d6c5b4a39281726354859607182.txt", "google2f75ccea5a94c8d4.html"]) {
  const src = path.join(publicDir, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(outDir, file));
}
