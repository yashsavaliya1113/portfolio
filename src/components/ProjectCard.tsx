"use client";

import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import Link from "next/link";
import type { Project } from "@/types";

interface Props {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: Props) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/10 animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
    >
      <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <span className="font-heading text-lg font-bold text-primary">
            {project.title.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs font-medium"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              <GitHubIcon size={14} />
              Code
            </a>
          )}
          {project.links.caseStudy && (
            <Link
              href={project.links.caseStudy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary/20 hover:shadow-[0_0_15px_-3px] hover:shadow-primary/20"
            >
              View Details
              <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </div>
      {project.featured && (
        <div className="absolute top-3 right-3 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          Featured
        </div>
      )}
    </div>
  );
}
