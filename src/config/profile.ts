import type { Profile } from "@/types";

const basePath = process.env.NODE_ENV === "production" ? "/portfolio" : "";

export const profile: Profile = {
  name: "Yash Savaliya",
  title: "Full Stack .NET Developer",
  tagline: [
    "ASP.NET Core, Angular, Azure & AI Engineering",
    "Building production-grade multi-tenant SaaS platforms",
  ],
  heroDescription:
    "Full Stack .NET Developer with nearly 2 years of experience building production-grade, multi-tenant SaaS platforms using ASP.NET Core, Angular, and Azure, with active upskilling in Azure OpenAI and Semantic Kernel.",
  about:
    "Full Stack .NET Developer with nearly 2 years of professional experience building production-grade, multi-tenant SaaS platforms using ASP.NET Core, Angular, and Azure. Skilled in REST and GraphQL API design, Clean Architecture microservices, modular monoliths, and event-driven services using CQRS, MediatR, Redis, and RabbitMQ. Proven record in incident management, payment processing, and performance optimization, with active AI upskilling in Azure OpenAI and Semantic Kernel.",
  avatar: `${basePath}/avatar.jpg`,
  location: "Ahmedabad, Gujarat, India",
  resumeUrl: `${basePath}/resume.pdf`,
};