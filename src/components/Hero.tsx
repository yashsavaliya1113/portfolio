"use client";

import { ArrowDown, FileDown } from "lucide-react";
import Link from "next/link";
import { profile } from "@/config/profile";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px] animate-pulse-glow" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="animate-fade-in text-sm font-medium text-primary">
              Hello, I&apos;m
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight animate-fade-up sm:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              {profile.name}
              <span className="text-primary">.</span>
            </h1>
            <p className="mt-4 text-xl text-[var(--color-muted)] animate-fade-up sm:text-2xl" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              {profile.title}
            </p>
            <div className="mt-4 space-y-1 animate-fade-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
              {profile.tagline.map((line, i) => (
                <p key={i} className="text-lg text-[var(--color-muted)] sm:text-xl">
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-6 max-w-lg text-[var(--color-muted)] animate-fade-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
              {profile.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary-dark"
              >
                View Projects
                <ArrowDown size={14} />
              </Link>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-medium transition-all hover:border-primary/50"
              >
                <FileDown size={14} />
                Download Resume
              </a>
            </div>
          </div>
          <div className="hidden animate-scale-in lg:block" style={{ animationDelay: "0.3s" }}>
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-[var(--color-border)] overflow-hidden">
                <img
                  src={profile.avatar}
                  alt={`${profile.name} — Full Stack .NET Developer`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
