import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/types";

interface Props {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
    >
      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/10">
        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readingTime}
          </span>
        </div>
        <h3 className="mt-3 font-heading text-lg font-semibold group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
          {post.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
          Read More
          <ArrowUpRight size={14} />
        </div>
      </article>
    </Link>
  );
}
