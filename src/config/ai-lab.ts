export type ExperimentStatus = "built" | "learning" | "planned";

export interface Experiment {
  slug: string;
  title: string;
  status: ExperimentStatus;
  summary: string;
  problem: string;
  how: string;
  learned: string;
  technologies: string[];
  links: { label: string; href: string; external?: boolean }[];
}

/**
 * Only real work is marked "built". Everything else is labelled honestly as a learning track or a plan.
 * Update `status` and `learned` as experiments are actually completed.
 */
export const experiments: Experiment[] = [
  {
    slug: "retrieval-playground",
    title: "Retrieval playground",
    status: "built",
    summary: "A working keyword-ranking search over the passages of this site's own articles, running entirely in your browser.",
    problem:
      "Retrieval-augmented generation (RAG) depends on finding the right passages before a model ever sees the question. I wanted to see how ranking behaves on real technical text without hiding it behind a model.",
    how: "Each article is split into heading-level passages at build time. In the browser, BM25 scores every passage against your question (term frequency, rarity and passage length) and returns the top five with their scores. There is no language model and no network call.",
    learned:
      "Keyword ranking is strong when the question reuses the document's vocabulary and weak on synonyms ('slow query' versus 'performance'). Passage size changes results a lot. Both points explain why production RAG adds embeddings and careful chunking.",
    technologies: ["TypeScript", "BM25", "Next.js", "React"],
    links: [
      { label: "Try it below", href: "#retrieval-playground" },
      { label: "Read the AI + .NET article", href: "/blog/how-ai-is-changing-dotnet-development/" },
    ],
  },
  {
    slug: "incident-triage-azure-openai",
    title: "Incident triage with Azure OpenAI",
    status: "learning",
    summary: "Classifying free-text incident reports into categories and severities, with validation and a human reviewer.",
    problem:
      "Incident reports arrive as free text, and someone has to label them before they can be analyzed or routed. The categories already exist in the SaaS reliability analytics project.",
    how: "A typed .NET service sends the report to an Azure OpenAI deployment, requests JSON output at low temperature, validates the category against an allowed list, and returns a typed result. The code pattern is documented and compiled in the article; it has not been evaluated against real labelled incidents.",
    learned: "Not evaluated yet. The next step is a golden set of labelled incidents to measure accuracy before trusting the output.",
    technologies: ["C#", "Azure OpenAI", "ASP.NET Core", "Azure.AI.OpenAI"],
    links: [
      { label: "Code pattern in the article", href: "/blog/how-ai-is-changing-dotnet-development/" },
      { label: "SaaS incident analytics project", href: "/projects/saas-reliability-incident-intelligence/" },
    ],
  },
  {
    slug: "semantic-kernel-plugins",
    title: "Semantic Kernel plugins in .NET",
    status: "learning",
    summary: "Learning how plugins and function calling let a model use ordinary C# methods as tools.",
    problem:
      "Many useful AI features need a model to call real code, such as looking up an order or querying a status. I want to understand the safe way to expose those tools.",
    how: "Studying Semantic Kernel's plugin model and Microsoft.Extensions.AI, with a focus on narrow, read-only functions and confirmation for anything that changes data.",
    learned: "Study in progress; no project has been shipped yet.",
    technologies: ["C#", "Semantic Kernel", "Microsoft.Extensions.AI"],
    links: [
      { label: "Security notes in the article", href: "/blog/how-ai-is-changing-dotnet-development/" },
      { label: "Semantic Kernel documentation", href: "https://learn.microsoft.com/semantic-kernel/overview/", external: true },
    ],
  },
  {
    slug: "embeddings-search",
    title: "Embedding-based search over documents",
    status: "planned",
    summary: "Replace keyword ranking in the playground with embeddings and compare the results.",
    problem:
      "Keyword search misses synonyms. Embeddings place similar meanings near each other, which should find passages that do not share exact words.",
    how: "Planned: embed each passage once, embed the question at query time and rank by cosine similarity, then compare against the BM25 results on the same set of questions.",
    learned: "Not started.",
    technologies: ["Azure OpenAI embeddings", "C#", "Cosine similarity"],
    links: [{ label: "Embeddings code in the article", href: "/blog/how-ai-is-changing-dotnet-development/" }],
  },
];
