"use client";

import { useState } from "react";
import { ArrowUpRight, FileDown, Mail, MapPin, Phone, Check } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Loader } from "@/components/Loader";
import { useToast } from "@/components/Toaster";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";

export function ContactSection() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  return (
    <section id="contact" className="border-t border-[var(--color-border)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title="Contact" subtitle="Let's build something together." />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="animate-fade-up" style={{ animationFillMode: "both" }}>
            <h3 className="font-heading text-3xl font-bold tracking-tight">
              Let&apos;s work together
            </h3>
            <p className="mt-4 text-[var(--color-muted)]">
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>
            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="flex items-center gap-3 text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail size={18} className="text-primary" />
                </div>
                <span>{siteConfig.links.email}</span>
              </a>
              <div className="flex items-center gap-3 text-[var(--color-muted)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin size={18} className="text-primary" />
                </div>
                <span>{profile.location}</span>
              </div>
              <a
                href="tel:+918104017448"
                className="flex items-center gap-3 text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone size={18} className="text-primary" />
                </div>
                <span>+91-81040 17448</span>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/50"
              >
                GitHub
                <ArrowUpRight size={14} />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/50"
              >
                LinkedIn
                <ArrowUpRight size={14} />
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-dark"
              >
                <FileDown size={14} />
                Download Resume
              </a>
            </div>
          </div>
          <div className="animate-fade-up rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const subject = (form.elements.namedItem("subject") as HTMLInputElement).value;
                const body = (form.elements.namedItem("body") as HTMLTextAreaElement).value;
                setSending(true);
                window.location.href = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                setTimeout(() => {
                  setSending(false);
                  toast("Message composer opened in your email client", "success");
                }, 500);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={5}
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  placeholder="Your message..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-dark disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader size="sm" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <Mail size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
