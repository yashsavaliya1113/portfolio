import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { faqs } from "@/config/faq";

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-[var(--color-border)] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading title="Frequently asked questions" subtitle="Quick answers about who I am and what I do." />
        <dl className="space-y-4">
          {faqs.map((f) => (
            <div key={f.question} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <dt className="font-heading font-semibold">{f.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {f.answer}
                {f.links && (
                  <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {f.links.map((l) =>
                      l.href.startsWith("http") ? (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
                          {l.label}
                        </a>
                      ) : (
                        <Link key={l.href} href={l.href} className="font-medium text-primary underline underline-offset-2 hover:no-underline">
                          {l.label}
                        </Link>
                      ),
                    )}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
