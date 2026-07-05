import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Backend",
    skills: [
      { name: "C#" },
      { name: "ASP.NET Core (.NET 6/8/10)" },
      { name: "Web API" },
      { name: "MVC" },
      { name: "Entity Framework Core" },
      { name: "LINQ" },
      { name: "CQRS / MediatR" },
      { name: "Clean Architecture" },
      { name: ".NET Aspire" },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "Angular 14" },
      { name: "Blazor" },
      { name: "TypeScript" },
      { name: "ChartJS" },
    ],
  },
  {
    title: "Architecture",
    skills: [
      { name: "Monolithic Architecture" },
      { name: "Microservices" },
      { name: "CQRS" },
      { name: "MediatR" },
      { name: "Clean Architecture" },
      { name: "Event-Driven Architecture" },
      { name: "Outbox Pattern" },
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      { name: "Microsoft Azure" },
      { name: "Azure AD" },
      { name: "Azure Blob Storage" },
      { name: "Azure App Service" },
      { name: "IIS" },
      { name: "Git" },
    ],
  },
  {
    title: "Databases & Messaging",
    skills: [
      { name: "SQL Server" },
      { name: "Azure SQL" },
      { name: "Oracle" },
      { name: "Redis" },
      { name: "RabbitMQ" },
    ],
  },
  {
    title: "Security & Auth",
    skills: [
      { name: "Keycloak" },
      { name: "JWT" },
      { name: "RBAC" },
      { name: "HMAC" },
      { name: "OAuth 2.0" },
      { name: "Azure AD B2C" },
      { name: "Veriff KYC" },
    ],
  },
  {
    title: "AI / ML",
    skills: [
      { name: "Azure OpenAI" },
      { name: "Semantic Kernel" },
      { name: "RAG Pipeline Design" },
    ],
  },
];
