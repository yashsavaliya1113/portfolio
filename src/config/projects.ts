import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "white-label-assessment-platform",
    title: "White-Label Assessment Platform",
    description:
      "Multi-tenant assessment SaaS platform with .NET microservices and Angular micro-frontends.",
    fullDescription:
      "A distributed assessment platform built for vendor partners to rebrand and resell with complete tenant and renderer isolation. The system combines .NET 10 Clean Architecture microservices, GraphQL APIs, and Angular micro-frontends in a shared shell.",
    image: "/projects/assessment.png",
    screenshots: [],
    technologies: [
      ".NET 10",
      "GraphQL (HotChocolate)",
      "Clean Architecture",
      "Microservices",
      "Angular 22",
      "Module Federation",
      "JWT",
    ],
    categories: ["SaaS", "Assessments", "Microservices"],
    links: {
      caseStudy: "/projects/white-label-assessment-platform",
    },
    featured: true,
    problem:
      "Vendor partners needed to deliver branded assessment experiences while keeping tenant data, identity, and renderer configuration fully isolated.",
    architecture:
      ".NET 10 Clean Architecture microservices expose GraphQL APIs through HotChocolate, with a REST credit-ledger service and Angular micro-frontends composed by a shared shell.",
    features: [
      "Distributed assessment services with Clean Architecture boundaries",
      "GraphQL APIs through HotChocolate plus a REST credit-ledger service",
      "Angular 22 micro-frontends composed with Module Federation",
      "Shared singleton services for authentication tokens and tenant branding",
      "Centralized Identity Service with JWT authentication",
      "Per-tenant and renderer isolation for vendor rebranding",
    ],
    databaseDesign:
      "Tenant-aware persistence boundaries support isolated assessment data and credit-ledger operations.",
    apiDesign:
      "GraphQL APIs provide flexible assessment operations while the credit ledger remains exposed through a focused REST service.",
    challenges: [
      "Maintaining tenant and renderer isolation across distributed services and independently deployed frontends",
      "Sharing authentication and branding state across Module Federation remotes without duplicating runtime services",
    ],
    lessonsLearned: [
      "A shared frontend shell and centralized identity boundary simplify consistent tenant experiences across independently deployed modules.",
    ],
    futureImprovements: [
      "Expand assessment analytics and reporting workflows",
      "Add automated tenant onboarding and branding configuration",
    ],
    timeline: "In progress",
    metrics: [
      { label: "Runtime", value: ".NET 10" },
      { label: "Frontend", value: "Angular 22" },
      { label: "API Style", value: "GraphQL + REST" },
    ],
    status: "in-progress",
  },
  {
    slug: "incident-management-platform",
    title: "Incident Management Platform",
    description:
      "White-label SaaS status page and incident management system for enterprise clients.",
    fullDescription:
      "A centralized incident management platform enabling real-time monitoring, incident tracking, and resolution workflows for enterprise clients. Features a fully customizable white-label Status Page with brand theming, allowing clients to surface uptime and incident data to their own end users.",
    image: "/projects/incident.png",
    screenshots: [
      "/projects/incident-1.png",
      "/projects/incident-2.png",
    ],
    technologies: [
      "C#",
      "ASP.NET Core MVC",
      ".NET 8",
      "Azure SQL",
      "Azure Blob Storage",
      "ChartJS",
      "Entity Framework Core",
    ],
    categories: ["SaaS", "Incident Management", "Monitoring"],
    links: {
      caseStudy: "/projects/incident-management-platform",
    },
    featured: true,
    problem:
      "Enterprise clients needed a way to communicate incidents and maintain transparency with their end users, but lacked a centralized system for real-time monitoring, incident tracking, and branded status communication.",
    architecture:
      "ASP.NET Core MVC layered architecture with Azure SQL for persistence, Azure Blob Storage for assets, and a pluggable notification provider pattern for multi-channel alerts.",
    features: [
      "Real-time incident tracking and resolution workflows",
      "Customizable white-label Status Page with brand theming",
      "ChartJS-powered dashboards for incident trend analysis",
      "99.9% SLA uptime target tracking and visualization",
      "Automated multi-channel notifications (Email, SMS) by severity tier",
    ],
    databaseDesign:
      "Azure SQL with EF Core for relational data. Optimized indexing strategy for multi-tenant query performance.",
    apiDesign:
      "RESTful API consumed by the Status Page frontend. Internal event bus for notification dispatch.",
    challenges: [
      "Building a white-label theming system that supports arbitrary client branding",
      "Designing notification throttling and retry policies for 14,000+ alerts/month",
    ],
    lessonsLearned: [
      "Pluggable notification providers make the system extensible for any communication channel.",
    ],
    futureImprovements: [
      "AI-powered incident severity prediction",
      "Automated runbook execution for common incidents",
    ],
    timeline: "3 months",
    metrics: [
      { label: "MTTR Reduction", value: "6×" },
      { label: "Alerts/Month", value: "14,000+" },
      { label: "SLA Target", value: "99.9%" },
    ],
    status: "completed",
  },
  {
    slug: "payment-gateway",
    title: "Payment Gateway — FinTech SaaS",
    description:
      "End-to-end open banking payment processing platform with KYC verification.",
    fullDescription:
      "A FinTech SaaS platform built with .NET 10 (Aspire) featuring customer and back-office portals in Blazor, KYC identity verification via Veriff, open banking payment processing via SaltEdge, and distributed transaction reliability with Redis and RabbitMQ.",
    image: "/projects/payment.png",
    screenshots: [],
    technologies: [
      ".NET 10 (Aspire)",
      "ASP.NET Core Web API",
      "Blazor",
      "MediatR",
      "CQRS",
      "ASP.NET Aspire",
      "PostgreSQL",
      "HMAC",
      "Redis",
      "RabbitMQ",
      "SaltEdge",
      "Veriff",
      "Azure Blob Storage",
      "Keycloak",
      "Docker",
      "Azure Container Apps",
      "Bicep",
      "OpenTelemetry",
      "MSTest",
    ],
    categories: ["FinTech", "Payments", "SaaS"],
    links: {},
    featured: true,
    problem:
      "Business needed a unified payment platform supporting open banking, KYC verification, and dual-portal architecture (customer + back-office) with distributed reliability guarantees.",
    architecture:
      "CQRS + MediatR with event-driven outbox pattern. Redis for in-flight state management, RabbitMQ with Outbox Pattern for guaranteed event delivery and failed DB transaction recovery.",
    features: [
      "Customer and back-office portals in Blazor",
      "KYC document handling with Azure Blob Storage",
      "CQRS + MediatR KYC workflow with Veriff identity verification",
      "Open banking payment processing (PayIn/PayOut) via SaltEdge",
      "HMAC-validated webhooks for real-time payment status sync",
      "Dual-auth: Keycloak (customer) + Keycloak + Azure AD (back-office)",
    ],
    databaseDesign:
      "Relational database with transaction consistency guarantees. Outbox table for reliable event publishing.",
    apiDesign:
      "RESTful API with HMAC signing for webhook security. Event-driven communication via RabbitMQ.",
    challenges: [
      "Ensuring transaction reliability across distributed systems with the Outbox Pattern",
      "Integrating multiple third-party services (Veriff, SaltEdge) with different auth models",
      "Dual-authentication architecture with granular RBAC role mapping",
    ],
    lessonsLearned: [
      "The Outbox Pattern is essential for reliable event delivery in distributed payment systems.",
    ],
    futureImprovements: [
      "AI-based fraud detection pipeline",
      "Additional payment method support",
    ],
    timeline: "4 months",
    metrics: [
      { label: "Architecture", value: "CQRS + Outbox" },
      { label: "Auth Providers", value: "Keycloak + Azure AD" },
      { label: "Payment Method", value: "Open Banking" },
    ],
    status: "completed",
  },
];
