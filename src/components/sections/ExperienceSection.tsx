"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { ExperienceCard } from "@/components/ExperienceCard";
import { experiences } from "@/config/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="border-t border-[var(--color-border)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Experience"
          subtitle="Where I've worked and what I've achieved."
        />
        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.company} experience={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
