import type { Profile } from "@/types";

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : process.env.NODE_ENV === "production"
      ? "/portfolio"
      : "";

export const profile: Profile = {
  name: "Yash Savaliya",
  title: "Data Analyst & Full Stack Developer",
  tagline: [
    "Data Analytics, Business Intelligence & Full Stack Engineering",
    "Analyzing 5,400+ RERA projects & building production SaaS platforms",
  ],
  heroDescription:
    "Full Stack Developer transitioning into Data Analytics. Combining 2+ years of backend and database engineering with exploratory data analysis (EDA), financial variance modeling, data quality auditing, and interactive BI dashboards.",
  about:
    "Full Stack Developer & Data Analyst with 2+ years of professional experience across SaaS engineering and analytical data modeling. Transitioning toward Data Analytics, leveraging rigorous data foundations in SQL Server, Excel Advanced (pivots, variance modeling, ETL pipelines), Python, and real estate econometric analysis across 5,400+ RERA filings in Ahmedabad.",
  avatar: `${basePath}/avatar.jpg`,
  avatarWebp: `${basePath}/avatar.webp`,
  location: "Ahmedabad, Gujarat, India",
  resumeUrl: `${basePath}/resume.pdf`,
};