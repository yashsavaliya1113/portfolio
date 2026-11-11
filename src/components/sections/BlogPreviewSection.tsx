import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { BlogCard } from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";

export function BlogPreviewSection() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="border-t border-[var(--color-border)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title="Latest articles" subtitle="Practical notes on ASP.NET Core, SQL, Python, Azure and AI." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/blog/" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-2 hover:no-underline">
            All articles
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
