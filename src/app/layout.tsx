import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toaster";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";
import "@/styles/globals.css";

const description = `Full Stack .NET Developer with 2+ years of experience building production-grade SaaS applications using ASP.NET Core, Angular, SQL Server, and Azure. Based in Ahmedabad, India.`;

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "Yash Savaliya",
    ".NET Developer",
    "Full Stack Developer",
    "ASP.NET Core",
    "Angular Developer",
    "C# Developer",
    "Azure",
    "SaaS Platform",
    "Software Engineer India",
    "Agentic AI",
    "Semantic Kernel",
    "iTechOps",
    "Ahmedabad Developer",
  ],
  authors: [{ name: profile.name, url: siteConfig.url }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${profile.name} — ${profile.title}`,
    description,
    siteName: profile.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: profile.name,
      },
    ],
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  },
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
  },
  appleWebApp: {
    title: profile.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  other: {
    "google-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
        { "@type": "ListItem", position: 3, name: "Projects", item: `${siteConfig.url}/#projects` },
        { "@type": "ListItem", position: 4, name: "AI Lab", item: `${siteConfig.url}/ai-lab` },
        { "@type": "ListItem", position: 5, name: "Resume", item: `${siteConfig.url}/resume` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: profile.name,
      description: profile.about,
      url: siteConfig.url,
      about: {
        "@type": "Person",
        name: profile.name,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      givenName: "Yash",
      familyName: "Savaliya",
      jobTitle: profile.title,
      description: profile.about,
      url: siteConfig.url,
      email: siteConfig.links.email,
      telephone: "+918104017448",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      nationality: "Indian",
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        `mailto:${siteConfig.links.email}`,
      ],
      knowsAbout: [
        "C#",
        "ASP.NET Core",
        ".NET",
        "Angular",
        "Blazor",
        "Azure",
        "SQL Server",
        "Redis",
        "RabbitMQ",
        "Keycloak",
        "Semantic Kernel",
        "Clean Architecture",
        "CQRS",
        "Microservices",
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "RK University",
        location: "Rajkot, Gujarat, India",
      },
      workLocation: {
        "@type": "City",
        name: "Ahmedabad",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: profile.name,
      url: siteConfig.url,
      description,
      about: {
        "@type": "Person",
        name: profile.name,
      },
    },
  ];

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={siteConfig.url} />
        <meta name="theme-color" content="#09090b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="me" href={siteConfig.links.github} />
        <link rel="me" href={siteConfig.links.linkedin} />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <ToastProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
