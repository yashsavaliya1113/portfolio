import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center pt-24 pb-20">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-4 text-[var(--color-muted)]">
          That page does not exist or has moved. Try one of these instead.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          <li><Link href="/" className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark">Home</Link></li>
          <li><Link href="/#projects" className="rounded-lg border border-[var(--color-border)] px-4 py-2 font-medium hover:border-primary/50">Projects</Link></li>
          <li><Link href="/blog/" className="rounded-lg border border-[var(--color-border)] px-4 py-2 font-medium hover:border-primary/50">Blog</Link></li>
          <li><Link href="/ai-lab/" className="rounded-lg border border-[var(--color-border)] px-4 py-2 font-medium hover:border-primary/50">AI Lab</Link></li>
        </ul>
      </div>
    </div>
  );
}
