import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogListClient } from "./BlogListClient";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles about .NET development, ASP.NET Core, Angular, SaaS architecture, system design, payment systems, and Agentic AI by Yash Savaliya.",
  openGraph: {
    title: "Blog — Yash Savaliya",
    description:
      "Articles on .NET, SaaS architecture, system design, and Agentic AI.",
    url: `${siteConfig.url}/blog`,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: "Yash Savaliya Blog",
      },
    ],
  },
  twitter: {
    title: "Blog — Yash Savaliya",
    description:
      "Articles on .NET, SaaS architecture, system design, and Agentic AI.",
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  keywords: [
    ".NET blog",
    "C# articles",
    "ASP.NET Core tutorial",
    "SaaS architecture",
    "Agentic AI",
    "software engineering blog",
    "Yash Savaliya blog",
  ],
};

export default function BlogPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog — Yash Savaliya",
    description: "Articles about .NET development, SaaS architecture, and Agentic AI.",
    url: `${siteConfig.url}/blog`,
    author: {
      "@type": "Person",
      name: profile.name,
    },
  };

  return (
    <div className="pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-3 text-[var(--color-muted)]">
            Thoughts on .NET, SaaS, system design, and Agentic AI.
          </p>
        </div>
        <BlogListClient posts={posts} />
      </div>
    </div>
  );
}
