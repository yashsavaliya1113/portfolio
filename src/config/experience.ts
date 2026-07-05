import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    company: "iTechOps",
    role: "Full Stack Developer",
    period: "November 2024 – Present",
    location: "Ahmedabad, Gujarat, India",
    description:
      "Building and maintaining backend modules for a white-label SaaS monitoring platform serving multiple enterprise clients.",
    achievements: [
      "Architected and owned backend modules for a white-label SaaS monitoring platform, reducing average incident downtime from 30+ min to under 5 min (6× MTTR improvement) across multiple enterprise clients.",
      "Designed extensible alert-processing engine with pluggable notification providers (Email, Slack, MS Teams), reliably handling 14,000+ alerts/month with built-in throttling, retry policies, and failure-handling to prevent notification floods.",
      "Improved API and database performance by ~30% through EF Core query optimization, strategic indexing, and N+1 elimination across multi-tenant SaaS workloads.",
      "Implemented multi-tenant auth and RBAC using Keycloak, JWT, and Azure AD — securing role-based access across 5+ enterprise SaaS clients.",
      "Resolved production incidents (alert misfires, IIS deployment failures, DB deadlocks) with root cause analysis and zero client SLA breaches.",
    ],
    technologies: [
      "C#",
      "ASP.NET Core",
      ".NET 8",
      "Angular",
      "Azure SQL",
      "Azure Blob Storage",
      "Keycloak",
      "JWT",
      "Azure AD",
      "Entity Framework Core",
      "IIS",
    ],
    impact: [
      { metric: "Incident Downtime", from: "30+ min", to: "< 5 min" },
      { metric: "Alerts Handled", from: "–", to: "14,000+/mo" },
      { metric: "Performance Gain", from: "–", to: "~30%" },
      { metric: "Enterprise Clients", from: "–", to: "5+" },
    ],
  },
];
