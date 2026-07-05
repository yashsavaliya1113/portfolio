"use client";

interface Props {
  content: string;
}

export function BlogPostContent({ content }: Props) {
  return (
    <div
      className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary prose-code:font-mono prose-code:text-sm prose-pre:border prose-pre:border-[var(--color-border)] prose-pre:bg-[var(--color-surface)]"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
