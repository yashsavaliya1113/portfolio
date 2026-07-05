import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { BlogPostContent } from "./BlogPostContent";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} — Blog`,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["Yash Savaliya"],
      tags: post.tags,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      title: `${post.title} — Blog`,
      description: post.description,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
    keywords: [...post.tags, post.category, ".NET", "ASP.NET Core", "SaaS"],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter(
      (p) =>
        p.slug !== slug &&
        p.tags.some((t: string) => post.tags.includes(t)),
    )
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: profile.name,
      url: siteConfig.url,
    },
    datePublished: post.date,
    dateModified: post.date,
    image: `${siteConfig.url}/og.png`,
    url: `${siteConfig.url}/blog/${slug}`,
  };

  return (
    <div className="pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/blog"
          className="mb-8 inline-flex text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          &larr; Back to Blog
        </Link>
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readingTime}
            </span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {post.category}
            </span>
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        <BlogPostContent content={post.content} />
        {related.length > 0 && (
          <div className="mt-16 border-t border-[var(--color-border)] pt-10">
            <h2 className="mb-6 font-heading text-2xl font-bold">Related Posts</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-primary/30"
                >
                  <h3 className="font-heading font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)] line-clamp-2">
                    {r.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
