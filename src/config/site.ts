import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Yash Savaliya",
  description:
    "Yash Savaliya is a Full Stack .NET Developer and Data Analyst in Ahmedabad, India, building SaaS applications with ASP.NET Core, Angular and Azure and analyzing data with SQL, Python and Excel.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yashsavaliya1113.github.io/portfolio",
  ogImage: "/og.png",
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "G-VDMNZ89EFG",
  links: {
    github: "https://github.com/yashsavaliya1113",
    linkedin: "https://www.linkedin.com/in/yash-savaliya-70989a1b4/",
    email: "tpyashsavaliya13092002@gmail.com",
  },
};
