import type { Profile } from "@/types";

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : process.env.NODE_ENV === "production"
      ? "/portfolio"
      : "";

export const profile: Profile = {
  name: "Yash Savaliya",
  title: "Full Stack .NET Developer & Data Analyst",
  tagline: ["ASP.NET Core · Azure · SQL · Python · Data Analytics"],
  heroDescription:
    "I build production SaaS platforms with ASP.NET Core, Angular and Azure, and analyze data with SQL, Python and Excel. Based in Ahmedabad, India, with 2+ years of professional experience at iTechOps.",
  about:
    "I'm a Full Stack .NET Developer and Data Analyst based in Ahmedabad, India. For 2+ years I have built and maintained production SaaS platforms across monitoring, assessment and payment domains with C#, ASP.NET Core, Angular, SQL Server and Azure. I also work as a data analyst: I use SQL, Python (Pandas), Excel and Power BI to clean data, find patterns and report insights. My analytics projects include an analysis of 5,478 Ahmedabad RERA real estate registrations and an operational analytics study of SaaS incidents built on a clearly disclosed synthetic dataset.",
  avatar: `${basePath}/avatar.jpg`,
  avatarWebp: `${basePath}/avatar.webp`,
  avatarSmall: `${basePath}/avatar-160.webp`,
  location: "Ahmedabad, Gujarat, India",
  resumeUrl: `${basePath}/resume.pdf`,
};
