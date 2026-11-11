import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toaster";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";
import { absoluteUrl, personId, sameAs, websiteId } from "@/lib/seo";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "optional",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : process.env.NODE_ENV === "production"
      ? "/portfolio"
      : "";

const description =
  "Yash Savaliya is a Full Stack .NET Developer and Data Analyst in Ahmedabad, India. ASP.NET Core, Azure, SQL and Python projects, technical articles and AI experiments.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: `${profile.name} | ${profile.title}`,
    template: `%s | ${profile.name}`,
  },
  description,
  metadataBase: new URL(`${siteConfig.url}/`),
  authors: [{ name: profile.name, url: absoluteUrl("/") }],
  creator: profile.name,
  publisher: profile.name,
  icons: {
    icon: [
      { url: `${basePath}/favicon.png`, sizes: "48x48", type: "image/png" },
      { url: `${basePath}/icon.svg`, type: "image/svg+xml" },
    ],
    apple: [{ url: `${basePath}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: absoluteUrl("/"),
    title: `${profile.name} | ${profile.title}`,
    description,
    siteName: profile.name,
    images: [
      { url: `${siteConfig.url}/og.png`, width: 1200, height: 630, alt: `${profile.name}, ${profile.title}` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | ${profile.title}`,
    description,
    images: [`${siteConfig.url}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: absoluteUrl("/"),
    types: { "application/rss+xml": `${siteConfig.url}/rss.xml` },
  },
  verification: { google: "google2f75ccea5a94c8d4" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Site-wide identity. Only facts that are visible on the site are described here.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      name: profile.name,
      givenName: "Yash",
      familyName: "Savaliya",
      jobTitle: profile.title,
      description: profile.about,
      url: absoluteUrl("/"),
      image: `${siteConfig.url}/avatar.jpg`,
      email: `mailto:${siteConfig.links.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      worksFor: { "@type": "Organization", name: "iTechOps" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "RK University" },
      knowsAbout: [
        "C#",
        "ASP.NET Core",
        "Entity Framework Core",
        "Angular",
        "Microsoft Azure",
        "SQL Server",
        "SQL",
        "Python",
        "Pandas",
        "Data Analytics",
        "Microservices",
        "CQRS",
      ],
      sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: `${profile.name} Portfolio`,
      url: absoluteUrl("/"),
      description,
      inLanguage: "en",
      publisher: { "@id": personId },
      author: { "@id": personId },
    },
  ];

  const gaId = process.env.NEXT_PUBLIC_GA_ID || siteConfig.googleAnalyticsId;
  // Analytics loads on first user interaction (or 5s after load), so it never competes with LCP/INP.
  const gaLoader = gaId
    ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');var l=false;function load(){if(l)return;l=true;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${gaId}';document.head.appendChild(s);}['pointerdown','keydown','scroll','touchstart'].forEach(function(e){window.addEventListener(e,load,{once:true,passive:true});});window.addEventListener('load',function(){setTimeout(load,5000);});`
    : "";

  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <JsonLd data={jsonLd} />
        <link rel="me" href={siteConfig.links.github} />
        <link rel="me" href={siteConfig.links.linkedin} />
        {gaLoader && <script dangerouslySetInnerHTML={{ __html: gaLoader }} />}
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
