"use client";

import { FileDown, GraduationCap } from "lucide-react";
import { profile } from "@/config/profile";
import { experiences } from "@/config/experience";
import { skillCategories } from "@/config/skills";
import { siteConfig } from "@/config/site";
import { education } from "@/config/education";

export default function ResumePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 animate-fade-up" style={{ animationFillMode: "both" }}>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Resume</h1>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-dark"
          >
            <FileDown size={14} />
            Download PDF
          </a>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 animate-fade-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
          <div className="border-b border-[var(--color-border)] pb-6">
            <h2 className="font-heading text-2xl font-bold">{profile.name}</h2>
            <p className="text-primary">{profile.title}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
              <a href={`mailto:${siteConfig.links.email}`} className="hover:text-[var(--color-text)]">
                {siteConfig.links.email}
              </a>
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)]">
                GitHub
              </a>
              <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)]">
                LinkedIn
              </a>
              <span>{profile.location}</span>
              <span>+91-81040 17448</span>
            </div>
          </div>

          <div className="py-6 border-b border-[var(--color-border)]">
            <h3 className="mb-3 text-sm font-medium text-primary uppercase tracking-wider">Summary</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{profile.about}</p>
          </div>

          <div className="py-6 border-b border-[var(--color-border)]">
            <h3 className="mb-4 text-sm font-medium text-primary uppercase tracking-wider">Experience</h3>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.company}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-semibold">{exp.role}</h4>
                      <p className="text-sm text-primary">{exp.company}</p>
                    </div>
                    <span className="text-xs text-[var(--color-muted)]">{exp.period}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {exp.technologies.map((t) => (
                      <span key={t} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-6 border-b border-[var(--color-border)]">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider">
              <GraduationCap size={14} />
              Education
            </h3>
            {education.map((edu) => (
              <div key={edu.degree}>
                <h4 className="font-heading font-semibold">{edu.degree}</h4>
                <p className="text-sm text-primary">{edu.field}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {edu.institution}, {edu.location} — {edu.period}
                </p>
                <p className="text-xs font-medium mt-1">{edu.score}</p>
              </div>
            ))}
          </div>

          <div className="py-6">
            <h3 className="mb-4 text-sm font-medium text-primary uppercase tracking-wider">Skills</h3>
            <div className="space-y-3">
              {skillCategories.map((cat) => (
                <div key={cat.title}>
                  <span className="text-xs font-medium">{cat.title}: </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {cat.skills.map((s) => s.name).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
