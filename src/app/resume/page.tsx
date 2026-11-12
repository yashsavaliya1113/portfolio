import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ResumeDownload } from "@/components/ResumeDownload";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, personId } from "@/lib/seo";
import { FileDown, GraduationCap } from "lucide-react";
import { profile } from "@/config/profile";
import { experiences } from "@/config/experience";
import { skillCategories } from "@/config/skills";
import { siteConfig } from "@/config/site";
import { education } from "@/config/education";

export const metadata: Metadata = pageMetadata({
  title: "Resume: Full Stack .NET Developer and Data Analyst",
  description:
    "Resume of Yash Savaliya: 2+ years building SaaS platforms with ASP.NET Core, Angular and Azure, plus SQL, Python and Excel data analysis. Ahmedabad, India.",
  path: "/resume",
  keywords: ["Yash Savaliya resume", ".NET Developer resume", "ASP.NET Core developer", "Data Analyst"],
});

export default function ResumePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${absoluteUrl("/resume")}#profile`,
      name: `Resume: ${profile.name}`,
      url: absoluteUrl("/resume"),
      mainEntity: { "@id": personId },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Resume", path: "/resume" },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative z-30 mb-8 flex items-center justify-between animate-fade-up" style={{ animationFillMode: "both" }}>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Resume</h1>
          <ResumeDownload label="Download PDF" variant="primary" align="right" />
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 animate-fade-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
          <div className="border-b border-[var(--color-border)] pb-6">
            <h2 className="font-heading text-2xl font-bold">{profile.name}</h2>
            <p className="text-primary font-medium">{profile.title}</p>
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
            <h3 className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">Summary</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{profile.about}</p>
          </div>

          <div className="py-6 border-b border-[var(--color-border)]">
            <h3 className="mb-4 text-sm font-semibold text-primary uppercase tracking-wider">Experience</h3>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.company}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-semibold">{exp.role}</h4>
                      <p className="text-sm text-primary font-medium">{exp.company}</p>
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
                      <span key={t} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary dark:text-blue-400">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-6 border-b border-[var(--color-border)]">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
              <GraduationCap size={14} />
              Education
            </h3>
            {education.map((edu) => (
              <div key={edu.degree}>
                <h4 className="font-heading font-semibold">{edu.degree}</h4>
                <p className="text-sm text-primary font-medium">{edu.field}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {edu.institution}, {edu.location} — {edu.period}
                </p>
                <p className="text-xs font-medium mt-1">{edu.score}</p>
              </div>
            ))}
          </div>

          <div className="py-6">
            <h3 className="mb-4 text-sm font-semibold text-primary uppercase tracking-wider">Skills</h3>
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
