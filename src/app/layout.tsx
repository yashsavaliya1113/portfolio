import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toaster";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";
import "@/styles/globals.css";

const description =
  "Full Stack .NET Developer with 2+ years of experience building production-grade SaaS applications using ASP.NET Core, Angular, SQL Server, and Azure. Based in Ahmedabad, India.";

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
    "Gujarat Software Engineer",
    "Microservices Architect",
  ],
  authors: [{ name: profile.name, url: siteConfig.url }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  icons: {
    icon: [
      { url: "/portfolio/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/portfolio/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/portfolio/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${profile.name} — ${profile.title}`,
    description,
    siteName: profile.name,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: `${profile.name} — Full Stack .NET Developer`,
      },
    ],
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description,
    images: [`${siteConfig.url}/og.png`],
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
    "geo.region": "IN-GJ",
    "geo.placename": "Ahmedabad, Gujarat, India",
    "geo.position": "23.0225;72.5714",
    "ICBM": "23.0225, 72.5714",
    "rating": "General",
    "revisit-after": "7 days",
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
      "@type": "ProfilePage",
      name: `${profile.name} — Portfolio`,
      url: siteConfig.url,
      description,
      mainEntity: {
        "@type": "Person",
        name: profile.name,
        givenName: "Yash",
        familyName: "Savaliya",
        jobTitle: profile.title,
        description: profile.about,
        url: siteConfig.url,
        email: siteConfig.links.email,
        telephone: "+918104017448",
        hasOccupation: {
          "@type": "Occupation",
          name: "Full Stack .NET Developer",
          occupationalCategory: "15-1252.00",
          skills:
            "ASP.NET Core, C#, Angular, Azure, Microservices, CQRS, Semantic Kernel, Agentic AI",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 23.0225,
          longitude: 72.5714,
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
          ".NET 8 / 10",
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
          "GraphQL",
          "Docker",
          "Agentic AI",
        ],
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "RK University",
          location: "Rajkot, Gujarat, India",
        },
        worksFor: {
          "@type": "Organization",
          name: "iTechOps",
        },
        workLocation: {
          "@type": "City",
          name: "Ahmedabad",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: profile.name,
      url: siteConfig.url,
      description,
      author: {
        "@type": "Person",
        name: profile.name,
      },
    },
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
  ];

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={siteConfig.url} />
        <link rel="me" href={siteConfig.links.github} />
        <link rel="me" href={siteConfig.links.linkedin} />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <ToastProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
