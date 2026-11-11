import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { experiments } from "@/config/ai-lab";

export function AILabPreviewSection() {
  const built = experiments.filter((e) => e.status === "built").length;
  const learning = experiments.length - built;

  return (
    <section id="ai-lab" className="border-t border-[var(--color-border)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title="AI Lab" subtitle="Experiments with AI in .NET, labelled honestly." />
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FlaskConical size={20} className="text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[var(--color-muted)]">
                A lab notebook for practical AI: calling Azure OpenAI from C#, retrieval over documents and the security
                questions that come with both. {built} experiment{built === 1 ? " is" : "s are"} built and live, including
                an in-browser retrieval demo; {learning} {learning === 1 ? "is" : "are"} marked as learning or planned.
              </p>
              <Link
                href="/ai-lab/"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Open the AI Lab
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
