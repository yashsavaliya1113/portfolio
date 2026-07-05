"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import type { Experience } from "@/types";

interface Props {
  experience: Experience;
  index: number;
}

export function ExperienceCard({ experience, index }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="group animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
    >
      <div className="relative pl-8 before:absolute before:left-[11px] before:top-3 before:h-full before:w-px before:bg-[var(--color-border)] before:last:hidden">
        <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-primary bg-[var(--color-bg)]" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg font-semibold">
                {experience.role}
              </h3>
              <p className="text-primary">{experience.company}</p>
              <div className="mt-1 flex items-center gap-3 text-sm text-[var(--color-muted)]">
                <span>{experience.period}</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {experience.location}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {experience.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`mt-1 shrink-0 text-[var(--color-muted)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-6 pt-4">
            <p className="text-sm text-[var(--color-muted)]">
              {experience.description}
            </p>

            <h4 className="mt-4 text-sm font-medium">Key Achievements</h4>
            <ul className="mt-2 space-y-1.5">
              {experience.achievements.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--color-muted)]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {a}
                </li>
              ))}
            </ul>

            <h4 className="mt-4 text-sm font-medium">Impact</h4>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {experience.impact.map((m) => (
                <div key={m.metric} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-center">
                  <div className="text-xs text-[var(--color-muted)]">{m.metric}</div>
                  <div className="mt-1 flex items-center justify-center gap-1 text-sm font-medium">
                    <span className="text-[var(--color-muted)] line-through">{m.from}</span>
                    <span className="text-primary">{m.to}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
