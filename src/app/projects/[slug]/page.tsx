import { notFound } from "next/navigation";
import { projects } from "@/config/projects";
import { ArrowUpRight, Calendar, CheckCircle2 } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { ProjectDetailClient } from "./ProjectDetailClient";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} — Projects`,
      description: project.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: project.title }],
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
    keywords: [...project.technologies, ...project.categories, "portfolio", "project"],
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    author: { "@type": "Person", name: "Yash Savaliya" },
    programmingLanguage: project.technologies.filter((t) =>
      ["C#", "TypeScript", "JavaScript", "Python"].includes(t),
    ),
    runtimePlatform: "Web",
    dateCreated: project.timeline,
  };

  return (
    <div className="pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          href="/#projects"
          className="mb-8 inline-flex text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          &larr; Back to Projects
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {project.timeline}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} />
              {project.status === "completed"
                ? "Completed"
                : project.status === "in-progress"
                  ? "In Progress"
                  : "Planning"}
            </span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            {project.fullDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="
                  inline-flex items-center
                  rounded-full
                  border border-primary/20
                  bg-primary/5
                  px-3 py-1.5
                  text-xs font-medium
                  text-primary
                  whitespace-nowrap
                  transition-all
                  hover:border-primary/40
                  hover:bg-primary/10
                "
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/50"
              >
                <GitHubIcon size={16} />
                View Code
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-dark"
              >
                Live Demo
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </header>

        <ProjectDetailClient project={project} />

        {project.metrics.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 font-heading text-2xl font-bold">Metrics</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <MetricCard key={m.label} label={m.label} value={m.value} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">Problem</h2>
          <p className="text-[var(--color-muted)]">{project.problem}</p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">Architecture</h2>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <p className="text-sm text-[var(--color-muted)]">
              {project.architecture}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">Features</h2>
          <ul className="space-y-2">
            {project.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">Database Design</h2>
          <p className="text-sm text-[var(--color-muted)]">
            {project.databaseDesign}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">API Design</h2>
          <p className="text-sm text-[var(--color-muted)]">
            {project.apiDesign}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">Challenges</h2>
          <ul className="space-y-2">
            {project.challenges.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">Lessons Learned</h2>
          <ul className="space-y-2">
            {project.lessonsLearned.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {l}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">Future Improvements</h2>
          <ul className="space-y-2">
            {project.futureImprovements.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
