"use client";

import { Code2, Database, Cloud, Shield } from "lucide-react";
import type { Project } from "@/types";

const icons = [Code2, Database, Cloud, Shield];

interface Props {
  project: Project;
}

export function ProjectDetailClient({ project }: Props) {
  return (
    <div className="mb-12 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] animate-fade-up" style={{ animationFillMode: "both" }}>
      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10">
        <div className="flex gap-6">
          {icons.map((Icon, i) => (
            <div
              key={i}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
            >
              <Icon size={28} className="text-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
