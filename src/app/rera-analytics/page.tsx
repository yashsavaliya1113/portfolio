import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ReraAnalyticsShowcase } from "@/components/ReraAnalyticsShowcase";

export const metadata: Metadata = pageMetadata({
  title: "Ahmedabad RERA Analytics Dashboard",
  description:
    "Interactive dashboard of 5,478 Ahmedabad RERA real estate registrations: a raw GujRERA export cleaned in the browser into cost, timeline and variance charts.",
  path: "/rera-analytics",
  keywords: ["RERA analytics", "Ahmedabad real estate", "data analytics dashboard", "Yash Savaliya"],
});

export default function ReraAnalyticsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/#projects"
          className="inline-flex text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          &larr; Back to Projects
        </Link>
        <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Ahmedabad RERA Analytics Dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          A live data-analytics dashboard for 5,478 registered Ahmedabad real estate projects. The raw GujRERA export is
          cleaned in your browser and turned into cost, timeline and variance charts. See the{" "}
          <Link href="/projects/ahmedabad-rera-data-analytics/" className="text-primary hover:underline">
            project case study
          </Link>{" "}
          for the method.
        </p>
        <ReraAnalyticsShowcase />
      </div>
    </div>
  );
}
