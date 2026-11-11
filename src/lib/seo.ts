import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";

/** Absolute URL with a trailing slash, matching `trailingSlash: true` in next.config.ts. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean.endsWith("/") ? clean : `${clean}/`}`;
}

export const personId = `${siteConfig.url}/#person`;
export const websiteId = `${siteConfig.url}/#website`;

/** Verified profile URLs only. */
export const sameAs = [siteConfig.links.github, siteConfig.links.linkedin];

export function personRef() {
  return { "@type": "Person", "@id": personId, name: profile.name, url: absoluteUrl("/") };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Per-page Open Graph + Twitter + canonical, so every page has unique, consistent metadata. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  keywords?: string[];
}) {
  const url = absoluteUrl(opts.path);
  const image = { url: `${siteConfig.url}/og.png`, width: 1200, height: 630, alt: opts.title };
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: profile.name,
      type: opts.type ?? "website",
      locale: "en_IN",
      images: [image],
      ...(opts.type === "article"
        ? {
            publishedTime: opts.publishedTime,
            modifiedTime: opts.modifiedTime ?? opts.publishedTime,
            authors: [profile.name],
            tags: opts.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title: opts.title,
      description: opts.description,
      images: [image.url],
    },
  };
}
