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
      { name: "Blazor" },
      { name: "ASP.NET Aspire" },
      { name: "GraphQL" },
      { name: "CQRS / MediatR" },
      { name: "Clean Architecture" },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "Angular 14 / 22" },
      { name: "Module Federation" },
      { name: "TypeScript" },
      { name: "RxJS" },
      { name: "HTML / CSS" },
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
      { name: "Multi-Tenancy" },
      { name: "REST / GraphQL" },
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      { name: "Microsoft Azure" },
      { name: "Azure AD" },
      { name: "Azure Blob Storage" },
      { name: "Azure App Service" },
      { name: "Azure Container Apps" },
      { name: "Docker" },
      { name: "Bicep (IaC)" },
      { name: "CI/CD" },
      { name: "OpenTelemetry" },
      { name: "IIS" },
      { name: "Git" },
    ],
  },
  {
    title: "Databases & Messaging",
    skills: [
      { name: "SQL Server" },
      { name: "Azure SQL" },
      { name: "PostgreSQL" },
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
      { name: "MSTest" },
      { name: "Unit & Integration Testing" },
    ],
  },
  {
    title: "Tools & Practices",
    skills: [
      { name: "Git" },
      { name: "Visual Studio" },
      { name: "Postman" },
      { name: "Swagger / OpenAPI" },
      { name: "Agile / Scrum" },
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
