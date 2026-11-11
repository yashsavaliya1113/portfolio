import type { Metadata } from "next";
import Link from "next/link";
import { IncidentAnalyticsShowcase } from "@/components/IncidentAnalyticsShowcase";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "SaaS Reliability & Incident Intelligence Dashboard",
  description:
    "Operational analytics dashboard on a clearly disclosed synthetic SaaS incident dataset: incident trends, MTTR, SLA compliance, root causes, noisy alerts and tenant downtime.",
  alternates: { canonical: `${siteConfig.url}/incident-analytics` },
};

export default function IncidentAnalyticsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/#projects"
          className="inline-flex text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          &larr; Back to Projects
        </Link>
        <IncidentAnalyticsShowcase />
      </div>
    </div>
  );
}
