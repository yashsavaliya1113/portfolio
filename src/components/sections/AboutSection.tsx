"use client";

import { GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/config/profile";
import { education } from "@/config/education";

const milestones = [
  { year: "2020", label: "B.Tech — Information Technology" },
  { year: "2022", label: "Started .NET Development" },
  { year: "2023", label: "Angular & Frontend" },
  { year: "2024", label: "iTechOps — SaaS Platform" },
  { year: "2025", label: "Payment Gateway & FinTech" },
  { year: "2026", label: "Agentic AI Journey" },
];

export function AboutSection() {
  return (
    <section id="about" className="border-t border-[var(--color-border)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title="About" subtitle="A bit about my journey." />
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="mb-8 flex items-center gap-6 animate-fade-up" style={{ animationFillMode: "both" }}>
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border)]">
                <img
                  src={profile.avatar}
                  alt={`${profile.name} portrait`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold">{profile.name}</h3>
                <p className="text-sm text-primary">{profile.title}</p>
                <p className="text-xs text-[var(--color-muted)]">{profile.location}</p>
              </div>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              <p className="text-lg leading-relaxed text-[var(--color-muted)]">
                {profile.about}
              </p>
            </div>

            <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
                <GraduationCap size={16} className="text-primary" />
                Education
              </h3>
              {education.map((edu) => (
                <div
                  key={edu.degree}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <div className="font-heading font-semibold">{edu.degree}</div>
                  <div className="text-sm text-primary">{edu.field}</div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-[var(--color-muted)]">
                    <span>{edu.institution}, {edu.location}</span>
                    <span>·</span>
                    <span>{edu.period}</span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {edu.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <h3 className="mb-8 text-sm font-medium">Journey</h3>
            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--color-border)]" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div
                    key={m.label}
                    className="group relative flex gap-5 animate-fade-up-sm"
                    style={{ animationDelay: `${i * 0.05 + 0.3}s`, animationFillMode: "both" }}
                  >
                    <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-semibold text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10">
                      {m.year}
                    </div>
                    <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_0_20px_-5px] group-hover:shadow-primary/10">
                      <p className="text-sm leading-relaxed text-[var(--color-muted)] group-hover:text-[var(--color-text)] transition-colors">
                        {m.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
