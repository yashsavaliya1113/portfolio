import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");

const siteUrl = "https://yashsavaliya.dev";

const staticPages = [
  { url: "/", priority: 1.0, changefreq: "weekly" },
  { url: "/blog", priority: 0.9, changefreq: "weekly" },
  { url: "/ai-lab", priority: 0.8, changefreq: "weekly" },
  { url: "/resume", priority: 0.6, changefreq: "monthly" },
];

const projects = [
  { slug: "incident-management-platform" },
  { slug: "payment-gateway" },
];

const blogPosts = [{ slug: "building-saas-dotnet", date: "2025-12-15" }];

const urls = [
  ...staticPages,
  ...projects.map((p) => ({
    url: `/projects/${p.slug}`,
    priority: 0.8,
    changefreq: "monthly",
  })),
  ...blogPosts.map((p) => ({
    url: `/blog/${p.slug}`,
    priority: 0.7,
    changefreq: "monthly",
    lastmod: p.date,
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${siteUrl}${u.url}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString().split("T")[0]}</lastmod>`}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
console.log("✓ Generated sitemap.xml");

const rssItems = blogPosts
  .map(
    (post) => `    <item>
      <title>Building Multi-Tenant SaaS with ASP.NET Core</title>
      <description>A deep dive into designing and building scalable multi-tenant SaaS platforms using ASP.NET Core.</description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>Engineering</category>
    </item>`,
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yash Savaliya — Blog</title>
    <description>Full Stack .NET Developer building production-grade SaaS applications.</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(path.join(outDir, "rss.xml"), rss);
console.log("✓ Generated rss.xml");
