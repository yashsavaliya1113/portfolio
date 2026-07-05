import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "AI Lab",
  description:
    "Exploring Agentic AI with Semantic Kernel, LangGraph, CrewAI, and Azure OpenAI. Building autonomous agents, RAG systems, and intelligent workflows.",
  openGraph: {
    title: "AI Lab — Yash Savaliya",
    description:
      "Building autonomous agents, RAG systems, and intelligent workflows with Semantic Kernel, LangGraph, and Azure OpenAI.",
    url: `${siteConfig.url}/ai-lab`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AI Lab" }],
  },
  alternates: { canonical: `${siteConfig.url}/ai-lab` },
  keywords: [
    "Agentic AI",
    "Semantic Kernel",
    "LangGraph",
    "CrewAI",
    "Azure OpenAI",
    "RAG",
    "MCP",
    "AI agents",
    ".NET AI",
  ],
};

export default function AILabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
