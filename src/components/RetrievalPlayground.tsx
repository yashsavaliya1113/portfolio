"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { BlogChunk } from "@/lib/blog";

const STOP = new Set(
  "a an the and or of to in on for with is are was were be been it this that as at by from how what when why do does can i you your my we not no into over than then so if but about which should".split(
    " ",
  ),
);

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9.#+\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t));

const EXAMPLES = [
  "why is my query doing an index scan",
  "how to store secrets in azure",
  "prompt injection",
  "remove duplicate rows from csv",
  "scoped service in singleton",
];

/** BM25 keyword ranking over heading-level passages: the retrieval half of RAG, with no model and no network calls. */
export function RetrievalPlayground({ chunks }: { chunks: BlogChunk[] }) {
  const [query, setQuery] = useState("");

  const index = useMemo(() => {
    const docs = chunks.map((c) => tokenize(`${c.heading} ${c.heading} ${c.text}`));
    const df = new Map<string, number>();
    docs.forEach((d) => new Set(d).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
    const avg = docs.reduce((a, d) => a + d.length, 0) / Math.max(1, docs.length);
    return { docs, df, avg };
  }, [chunks]);

  const results = useMemo(() => {
    const q = tokenize(query);
    if (q.length === 0) return [];
    const N = chunks.length;
    const k1 = 1.5;
    const b = 0.75;
    return chunks
      .map((chunk, i) => {
        const doc = index.docs[i];
        const tf = new Map<string, number>();
        doc.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
        let score = 0;
        for (const term of new Set(q)) {
          const f = tf.get(term) ?? 0;
          if (!f) continue;
          const n = index.df.get(term) ?? 0;
          const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
          score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * doc.length) / index.avg));
        }
        return { chunk, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b2) => b2.score - a.score)
      .slice(0, 5);
  }, [query, chunks, index]);

  const top = results[0]?.score ?? 1;

  return (
    <div>
      <label htmlFor="rag-query" className="sr-only">
        Search the articles
      </label>
      <div className="relative">
        <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          id="rag-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question, e.g. “why is my query doing an index scan”"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setQuery(ex)}
            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)] transition-colors hover:border-primary/50 hover:text-primary"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3" aria-live="polite">
        {query && results.length === 0 && (
          <p className="text-sm text-[var(--color-muted)]">
            No passage shares a keyword with that question. This is a real limitation of keyword ranking: it cannot match
            synonyms. Embeddings are used to close that gap.
          </p>
        )}
        {results.map(({ chunk, score }) => (
          <div key={`${chunk.postSlug}-${chunk.anchor}`} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/blog/${chunk.postSlug}/${chunk.anchor ? `#${chunk.anchor}` : ""}`}
                className="font-heading text-sm font-semibold text-primary hover:underline"
              >
                {chunk.heading}
              </Link>
              <span className="shrink-0 font-mono text-xs text-[var(--color-muted)]">{score.toFixed(2)}</span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">{chunk.postTitle}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(score / top) * 100}%` }} />
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-[var(--color-muted)]">{chunk.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        {chunks.length} passages indexed from this site&apos;s articles. Ranking runs entirely in your browser.
      </p>
    </div>
  );
}
