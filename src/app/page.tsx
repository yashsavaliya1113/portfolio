import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AILabPreviewSection } from "@/components/sections/AILabPreviewSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { faqs } from "@/config/faq";
import { absoluteUrl, personId, websiteId } from "@/lib/seo";

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${absoluteUrl("/")}#profile`,
      url: absoluteUrl("/"),
      name: "Yash Savaliya | Full Stack .NET Developer & Data Analyst",
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <AILabPreviewSection />
      <BlogPreviewSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
