import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import Link from "next/link";
import type { Project } from "@/types";

interface Props {
  project: Project;
  index: number;
}

const primaryBtn =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark";
const outlineBtn =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary";
const textLink =
  "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]";

/** Equal-height project card: title, summary and tags on top, actions pinned to the bottom so rows line up. */
export function ProjectCard({ project, index }: Props) {
  const tags = project.technologies.slice(0, 4);
  const more = project.technologies.length - tags.length;
  const { links } = project;

  return (
    <article
      className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-200 hover:border-primary/40 animate-fade-up"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "both" }}
    >
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium uppercase tracking-wider text-primary">{project.categories[0]}</span>
        {project.status === "in-progress" && (
          <span className="rounded-full bg-warning/10 px-2 py-0.5 font-medium text-warning">In progress</span>
        )}
      </div>

      <h3 className="mt-3 font-heading text-lg font-semibold leading-snug">{project.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">{project.description}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
        {tags.map((tech) => (
          <li
            key={tech}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-2 py-0.5 text-xs text-[var(--color-muted)]"
          >
            {tech}
          </li>
        ))}
        {more > 0 && (
          <li
            title={project.technologies.slice(4).join(", ")}
            className="rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            +{more} more
          </li>
        )}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
        {links.dashboard && (
          <Link href={links.dashboard} className={primaryBtn}>
            Live dashboard
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        )}
        {links.caseStudy && (
          <Link href={links.caseStudy} className={links.dashboard ? outlineBtn : primaryBtn}>
            View details
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        )}
        {links.github && (
          <a href={links.github} target="_blank" rel="noopener noreferrer" className={textLink}>
            <GitHubIcon size={14} />
            Code
          </a>
        )}
        {links.live && (
          <a href={links.live} target="_blank" rel="noopener noreferrer" className={textLink}>
            <ArrowUpRight size={13} aria-hidden="true" />
            Excel workbook
          </a>
        )}
      </div>
    </article>
  );
}
