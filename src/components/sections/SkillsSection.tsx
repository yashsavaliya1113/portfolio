"use client";

import { Server, Globe, FolderTree, Cloud, Database, ShieldCheck, Bot } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SkillBadge } from "@/components/SkillBadge";
import { skillCategories } from "@/config/skills";

const categoryIcons: Record<string, React.ReactNode> = {
  Backend: <Server size={16} />,
  Frontend: <Globe size={16} />,
  Architecture: <FolderTree size={16} />,
  "Cloud & DevOps": <Cloud size={16} />,
  "Databases & Messaging": <Database size={16} />,
  "Security & Auth": <ShieldCheck size={16} />,
  "AI / ML": <Bot size={16} />,
};

export function SkillsSection() {
  return (
    <section className="border-t border-[var(--color-border)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title="Skills" subtitle="Technologies and tools I work with." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-primary/30 transition-colors animate-fade-up"
              style={{ animationDelay: `${catIndex * 0.05}s`, animationFillMode: "both" }}
            >
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {categoryIcons[category.title] || <Server size={15} />}
                </div>
                <h3 className="text-sm font-semibold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill, i) => (
                  <SkillBadge key={skill.name} name={skill.name} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
