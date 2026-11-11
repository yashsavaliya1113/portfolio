import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BlogListClient } from "./BlogListClient";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, personId } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog: ASP.NET Core, SQL, Python, Azure and AI",
  description:
    "Practical articles by Yash Savaliya on ASP.NET Core Web API design, SQL query optimization, Python automation, Azure deployment and AI integration in .NET.",
  path: "/blog",
  keywords: [".NET blog", "ASP.NET Core", "SQL optimization", "Python automation", "Azure", "Yash Savaliya"],
});

export default function BlogPage() {
  const posts = getAllPosts();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${absoluteUrl("/blog")}#blog`,
      name: "Yash Savaliya's Blog",
      url: absoluteUrl("/blog"),
      description: "Practical articles on ASP.NET Core, SQL, Python, Azure and AI integration.",
      author: { "@type": "Person", "@id": personId, name: "Yash Savaliya" },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: absoluteUrl(`/blog/${p.slug}`),
        datePublished: p.date,
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            Practical notes on building and running software: ASP.NET Core APIs, SQL performance, Python automation,
            Azure deployments and AI integration in .NET. For the projects behind them, see{" "}
            <Link className="text-primary hover:underline" href="/#projects">my projects</Link> and the{" "}
            <Link className="text-primary hover:underline" href="/ai-lab/">AI Lab</Link>.
          </p>
        </div>
        <BlogListClient posts={posts} />
      </div>
    </div>
  );
}
