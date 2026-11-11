import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { RetrievalPlayground } from "@/components/RetrievalPlayground";
import { experiments, type ExperimentStatus } from "@/config/ai-lab";
import { getAllChunks, getAllPosts } from "@/lib/blog";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, personId } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Lab: AI Experiments with .NET, Azure OpenAI and RAG",
  description:
    "Yash Savaliya's AI Lab: a working retrieval demo, plus honestly labelled learning tracks for Azure OpenAI, Semantic Kernel and embeddings in .NET.",
  path: "/ai-lab",
  keywords: ["AI experiments", ".NET AI", "Azure OpenAI", "RAG", "Semantic Kernel", "Yash Savaliya"],
});

const statusStyles: Record<ExperimentStatus, { label: string; className: string }> = {
  built: { label: "Built and live", className: "bg-success/10 text-success" },
  learning: { label: "Learning (work in progress)", className: "bg-primary/10 text-primary" },
  planned: { label: "Planned", className: "bg-warning/10 text-warning" },
};

export default function AILabPage() {
  const chunks = getAllChunks();
  const aiPost = getAllPosts().find((p) => p.slug === "how-ai-is-changing-dotnet-development");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${absoluteUrl("/ai-lab")}#page`,
      name: "AI Lab by Yash Savaliya",
      url: absoluteUrl("/ai-lab"),
      description:
        "AI experiments and learning tracks for .NET developers: a working retrieval demo, Azure OpenAI, Semantic Kernel and embeddings.",
      author: { "@type": "Person", "@id": personId, name: "Yash Savaliya" },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: experiments.map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: e.title,
          description: e.summary,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "AI Lab", path: "/ai-lab" },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--color-muted)]">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[var(--color-text)]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li>AI Lab</li>
          </ol>
        </nav>

        <header>
          <div className="flex items-center gap-3">
            <FlaskConical className="text-primary" size={28} aria-hidden="true" />
            <h1 className="font-heading text-4xl font-bold tracking-tight">AI Lab</h1>
          </div>
          <p className="mt-4 max-w-3xl text-lg text-[var(--color-muted)]">
            This is where I explore practical AI for .NET developers: calling models from C#, retrieval over documents,
            and the security questions that come with both. It is a lab notebook, not a product gallery.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-[var(--color-muted)]">
            Every entry is labelled honestly. <strong className="text-[var(--color-text)]">Built</strong> means it works
            and you can try it. <strong className="text-[var(--color-text)]">Learning</strong> and{" "}
            <strong className="text-[var(--color-text)]">Planned</strong> mean I am still studying or have not started
            building, and no results are claimed. Background reading:{" "}
            {aiPost ? (
              <Link href={`/blog/${aiPost.slug}/`} className="text-primary hover:underline">
                {aiPost.title}
              </Link>
            ) : (
              "the blog"
            )}
            .
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2" aria-label="Experiments">
          {experiments.map((e) => (
            <article key={e.slug} className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-lg font-semibold">{e.title}</h2>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[e.status].className}`}>
                  {statusStyles[e.status].label}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{e.summary}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium">The problem</dt>
                  <dd className="mt-0.5 text-[var(--color-muted)]">{e.problem}</dd>
                </div>
                <div>
                  <dt className="font-medium">How it works</dt>
                  <dd className="mt-0.5 text-[var(--color-muted)]">{e.how}</dd>
                </div>
                <div>
                  <dt className="font-medium">What I learned</dt>
                  <dd className="mt-0.5 text-[var(--color-muted)]">{e.learned}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {e.technologies.map((t) => (
                  <span key={t} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-sm">
                {e.links.map((l) =>
                  l.external ? (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                      {l.label}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link key={l.href} href={l.href} className="font-medium text-primary hover:underline">
                      {l.label}
                    </Link>
                  ),
                )}
              </div>
            </article>
          ))}
        </section>

        <section id="retrieval-playground" className="mt-14 scroll-mt-24">
          <h2 className="font-heading text-2xl font-bold">Try it: retrieval playground</h2>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-muted)]">
            Type a question about SQL, ASP.NET Core, Azure, Python or AI. The playground ranks passages from the articles
            on this site and links to the exact section. It shows the retrieval step that comes before a model in any
            RAG system.
          </p>
          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <RetrievalPlayground chunks={chunks} />
          </div>
        </section>

        <section className="mt-14 border-t border-[var(--color-border)] pt-8">
          <h2 className="font-heading text-xl font-bold">Explore more</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/#projects" className="font-medium text-primary hover:underline">Projects</Link>
              <span className="text-[var(--color-muted)]"> — including the SaaS incident analytics study these experiments build on.</span>
            </li>
            <li>
              <Link href="/blog/" className="font-medium text-primary hover:underline">Blog</Link>
              <span className="text-[var(--color-muted)]"> — practical articles on ASP.NET Core, SQL, Python, Azure and AI.</span>
            </li>
            <li>
              <Link href="/#about" className="font-medium text-primary hover:underline">About Yash Savaliya</Link>
              <span className="text-[var(--color-muted)]"> — background, experience and contact details.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
