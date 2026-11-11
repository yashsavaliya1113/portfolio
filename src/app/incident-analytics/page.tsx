import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { IncidentAnalyticsShowcase, type Insights } from "@/components/IncidentAnalyticsShowcase";

export const metadata: Metadata = pageMetadata({
  title: "SaaS Reliability & Incident Intelligence Dashboard",
  description:
    "Dashboard on a clearly disclosed synthetic SaaS incident dataset: incident trends, MTTR, SLA compliance, root causes, noisy alerts and tenant downtime.",
  path: "/incident-analytics",
  keywords: ["incident analytics", "MTTR", "SLA compliance", "SQL", "Python", "Yash Savaliya"],
});

export default function IncidentAnalyticsPage() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "data", "saas-incident-insights.json"), "utf8"),
  ) as Insights;
  return (
    <div className="pt-24 pb-20">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Projects", path: "/#projects" }, { name: "SaaS Reliability Dashboard", path: "/incident-analytics" }])} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/#projects"
          className="inline-flex text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          &larr; Back to Projects
        </Link>
        <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          SaaS Reliability &amp; Incident Intelligence
        </h1>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          An operational analytics dashboard for a fictional SaaS company: which services fail most, what takes longest to
          resolve, where SLAs are breached, and which alerts are just noise. Read the{" "}
          <Link href="/projects/saas-reliability-incident-intelligence/" className="text-primary underline underline-offset-2 hover:no-underline">
            project case study
          </Link>{" "}
          for the method.
        </p>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
          <p>
            <strong>Synthetic data.</strong> Every incident, alert and tenant here is randomly generated (fixed seed) and the
            names are fictional. No employer or client data is used, so these findings describe the generated dataset, not
            any real company.
          </p>
        </div>
        <div className="mt-6">
          <IncidentAnalyticsShowcase data={data} />
        </div>
      </div>
    </div>
  );
}
