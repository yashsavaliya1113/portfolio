interface Props {
  content: string;
}

/** Server component: the article HTML is rendered at build time, so it is fully crawlable. */
export function BlogPostContent({ content }: Props) {
  return (
    <div
      className="prose max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-[var(--color-border)] prose-pre:bg-[var(--color-surface)] prose-pre:text-[var(--color-text)] prose-th:text-left"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
