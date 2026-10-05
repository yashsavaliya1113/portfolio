import type { Metadata } from "next";
import Link from "next/link";
import { ReraAnalyticsShowcase } from "@/components/ReraAnalyticsShowcase";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Ahmedabad RERA Analytics Dashboard",
  description:
    "Live data-analytics dashboard: raw GujRERA export cleaned in the browser into cost, timeline and variance charts for Ahmedabad real estate projects.",
  alternates: { canonical: `${siteConfig.url}/rera-analytics` },
};

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
        <ReraAnalyticsShowcase />
      </div>
    </div>
  );
}
