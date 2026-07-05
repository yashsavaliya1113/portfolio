export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: { github: string; linkedin: string; email: string };
}

export interface Profile {
  name: string;
  title: string;
  tagline: string[];
  heroDescription: string;
  about: string;
  avatar: string;
  location: string;
  resumeUrl: string;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; icon?: string }[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  impact: { metric: string; from: string; to: string }[];
  logo?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  screenshots: string[];
  technologies: string[];
  categories: string[];
  links: { github?: string; live?: string; caseStudy?: string };
  featured: boolean;
  problem: string;
  architecture: string;
  features: string[];
  databaseDesign: string;
  apiDesign: string;
  challenges: string[];
  lessonsLearned: string[];
  futureImprovements: string[];
  timeline: string;
  metrics: { label: string; value: string }[];
  status: "completed" | "in-progress" | "planned";
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  readingTime: string;
  published: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  score: string;
}

export interface AIProject {
  title: string;
  description: string;
  status: "planning" | "building" | "completed";
  technologies: string[];
  image?: string;
}
