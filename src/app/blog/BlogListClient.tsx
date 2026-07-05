"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import type { BlogMeta } from "@/lib/blog";

interface Props {
  posts: BlogMeta[];
}

export function BlogListClient({ posts }: Props) {
  const [search, setSearch] = useState("");

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearch(cat)}
              className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:text-primary"
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary sm:w-64"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-[var(--color-muted)]">
          No posts found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
