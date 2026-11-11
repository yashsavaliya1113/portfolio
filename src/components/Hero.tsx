import { ArrowRight, FileDown } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/GitHubIcon";
import { profile } from "@/config/profile";
import { siteConfig } from "@/config/site";

/** First screen: name, positioning, core technologies and links to the work. No entrance animations, so the LCP text paints immediately. */
export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center pt-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-medium text-primary">Hello, I&apos;m</p>
            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-4 text-xl font-medium sm:text-2xl">{profile.title}</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{profile.tagline[0]}</p>
            <p className="mt-6 max-w-xl text-[var(--color-muted)]">{profile.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                View projects
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/blog/"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/50"
              >
                Read articles
              </Link>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/50"
              >
                <GitHubIcon size={14} />
                GitHub
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/50"
              >
                <FileDown size={14} />
                Resume
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <picture>
                {profile.avatarWebp && <source srcSet={profile.avatarWebp} type="image/webp" />}
                <img
                  src={profile.avatar}
                  alt={`${profile.name}, ${profile.title}`}
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
