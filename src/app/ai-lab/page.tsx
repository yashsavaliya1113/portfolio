import type { Metadata } from "next";
import { FlaskConical, Cpu, Brain, Search, Bot, Network, FileSearch } from "lucide-react";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";

export const metadata: Metadata = {
  title: "AI Lab",
  description:
    "Explore Agentic AI projects, autonomous monitoring agents, RAG pipelines, and intelligent workflows built with Semantic Kernel, LangGraph, CrewAI, and Azure OpenAI by Yash Savaliya.",
  openGraph: {
    title: `AI Lab — ${profile.name}`,
    description:
      "Agentic AI projects, autonomous monitoring agents, RAG pipelines, and intelligent workflows.",
    url: `${siteConfig.url}/ai-lab`,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: "AI Lab — Yash Savaliya",
      },
    ],
  },
  twitter: {
    title: `AI Lab — ${profile.name}`,
    description:
      "Agentic AI projects, autonomous monitoring agents, RAG pipelines, and intelligent workflows.",
  },
  alternates: {
    canonical: `${siteConfig.url}/ai-lab`,
  },
  keywords: [
    "Agentic AI",
    "Semantic Kernel",
    "Azure OpenAI",
    "LangGraph",
    "CrewAI",
    "Autonomous Agents",
    "RAG Pipeline",
    "Model Context Protocol",
    "MCP",
    "AI Lab",
    "Yash Savaliya AI",
  ],
};

const aiProjects = [
  {
    title: "Monitoring Agent",
    description: "Autonomous agent that detects infrastructure anomalies and triggers remediation.",
    status: "building" as const,
    icon: Bot,
    technologies: ["Semantic Kernel", "Azure OpenAI", "C#"],
  },
  {
    title: "Incident AI",
    description: "AI-powered incident classification and severity prediction.",
    status: "completed" as const,
    icon: Brain,
    technologies: ["Azure OpenAI", "Python", "LangChain"],
  },
  {
    title: "Root Cause Analysis",
    description: "Automated RCA engine that correlates metrics, logs, and traces.",
    status: "building" as const,
    icon: Search,
    technologies: ["LangGraph", "CrewAI", "Azure"],
  },
  {
    title: "RAG Documentation",
    description: "Semantic search over technical documentation using RAG.",
    status: "completed" as const,
    icon: FileSearch,
    technologies: ["RAG", "Qdrant", "Azure OpenAI"],
  },
  {
    title: "Semantic Kernel Agents",
    description: "Plugin-based AI agents using Semantic Kernel's function calling.",
    status: "building" as const,
    icon: Cpu,
    technologies: ["Semantic Kernel", "C#", "Azure"],
  },
  {
    title: "MCP Server",
    description: "Model Context Protocol server for AI-agent tool integration.",
    status: "planning" as const,
    icon: Network,
    technologies: ["MCP", "TypeScript", "Python"],
  },
  {
    title: "CrewAI Orchestrator",
    description: "Multi-agent orchestration for complex incident resolution workflows.",
    status: "planning" as const,
    icon: FlaskConical,
    technologies: ["CrewAI", "Python", "LangGraph"],
  },
  {
    title: "LangGraph Workflows",
    description: "Stateful agent workflows for monitoring and remediation.",
    status: "building" as const,
    icon: Network,
    technologies: ["LangGraph", "Python", "Azure"],
  },
];

const statusColors = {
  planning: "bg-warning/10 text-warning",
  building: "bg-primary/10 text-primary dark:text-blue-400",
  completed: "bg-success/10 text-success",
};

export default function AILabPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Lab — Yash Savaliya",
    description:
      "Agentic AI projects, autonomous monitoring agents, RAG pipelines, and intelligent workflows.",
    url: `${siteConfig.url}/ai-lab`,
    author: {
      "@type": "Person",
      name: profile.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: aiProjects.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: p.title,
        description: p.description,
      })),
    },
  };

  return (
    <div className="pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="animate-fade-up" style={{ animationFillMode: "both" }}>
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="text-primary" size={28} />
            <h1 className="font-heading text-4xl font-bold tracking-tight">AI Lab</h1>
          </div>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            Exploring the frontier of Agentic AI — building autonomous agents,
            RAG systems, and intelligent workflows using Semantic Kernel,
            LangGraph, CrewAI, and Azure OpenAI.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aiProjects.map((project, i) => (
            <div
              key={project.title}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:border-primary/30 animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <project.icon size={20} className="text-primary" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusColors[project.status]
                  }`}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              <h2 className="mt-4 font-heading text-lg font-semibold">
                {project.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:text-blue-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
