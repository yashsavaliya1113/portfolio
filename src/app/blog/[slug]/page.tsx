import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { BlogPostContent } from "./BlogPostContent";
import { JsonLd } from "@/components/JsonLd";
import { projects } from "@/config/projects";
import { profile } from "@/config/profile";
import { siteConfig } from "@/config/site";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, personId, websiteId } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle,
    description: post.description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.modified,
    tags: post.tags,
    keywords: post.tags,
  });
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const explicit = post.relatedPosts.map((s) => all.find((p) => p.slug === s)).filter((p) => !!p);
  const byTag = all.filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)));
  const related = [...new Map([...explicit, ...byTag].map((p) => [p!.slug, p!])).values()].slice(0, 3);
  const relatedProjects = projects.filter((p) => post.relatedProjects.includes(p.slug));

  const url = absoluteUrl(`/blog/${slug}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.modified,
      inLanguage: "en",
      keywords: post.tags.join(", "),
      articleSection: post.category,
      wordCount: post.wordCount,
      image: `${siteConfig.url}/og.png`,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Person", "@id": personId, name: profile.name, url: absoluteUrl("/") },
      publisher: { "@type": "Person", "@id": personId, name: profile.name },
      isPartOf: { "@id": websiteId },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${slug}` },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--color-muted)]">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-[var(--color-text)]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog/" className="hover:text-[var(--color-text)]">Blog</Link></li>
          </ol>
        </nav>

        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]">
              <span className="flex items-center gap-1">
                <Calendar size={14} aria-hidden="true" />
                Published <time dateTime={post.date}>{fmt(post.date)}</time>
              </span>
              {post.modified !== post.date && (
                <span className="flex items-center gap-1">
                  <RefreshCw size={14} aria-hidden="true" />
                  Updated <time dateTime={post.modified}>{fmt(post.modified)}</time>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={14} aria-hidden="true" />
                {post.readingTime}
              </span>
            </div>
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
            <p className="mt-4 text-lg text-[var(--color-muted)]">{post.description}</p>
            <p className="mt-4 text-sm">
              By{" "}
              <Link href="/#about" className="font-medium text-primary underline underline-offset-2 hover:no-underline" rel="author">
                {profile.name}
              </Link>
              , Full Stack .NET Developer and Data Analyst
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{post.category}</span>
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {post.toc.length > 0 && (
            <nav aria-label="Table of contents" className="mb-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                In this article
              </h2>
              <ol className="mt-3 space-y-1.5 text-sm">
                {post.toc.map((h) => (
                  <li key={h.id} className={h.depth === 3 ? "ml-4" : ""}>
                    <a href={`#${h.id}`} className="text-[var(--color-muted)] hover:text-primary">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <BlogPostContent content={post.content} />

          {post.references.length > 0 && (
            <section className="mt-12 border-t border-[var(--color-border)] pt-8">
              <h2 className="font-heading text-xl font-bold">References</h2>
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm">
                {post.references.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:no-underline">
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {relatedProjects.length > 0 && (
          <section className="mt-12 border-t border-[var(--color-border)] pt-8">
            <h2 className="font-heading text-xl font-bold">Related projects</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {relatedProjects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}/`} className="font-medium text-primary underline underline-offset-2 hover:no-underline">
                    {p.title}
                  </Link>
                  <span className="text-[var(--color-muted)]"> — {p.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12 border-t border-[var(--color-border)] pt-8">
            <h2 className="mb-4 font-heading text-xl font-bold">Related articles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}/`}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-primary/30"
                >
                  <h3 className="font-heading font-semibold">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <aside className="mt-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5" aria-label="About the author">
          <h2 className="font-heading text-base font-semibold">About the author</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {profile.name} is a Full Stack .NET Developer and Data Analyst in Ahmedabad, India. He builds SaaS
            platforms with ASP.NET Core, Angular and Azure at iTechOps.{" "}
            <Link href="/#about" className="text-primary underline underline-offset-2 hover:no-underline">More about Yash</Link>
            {" · "}
            <Link href="/#projects" className="text-primary underline underline-offset-2 hover:no-underline">Projects</Link>
            {" · "}
            <Link href="/ai-lab/" className="text-primary underline underline-offset-2 hover:no-underline">AI Lab</Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
