"use client";

import { useState } from "react";
import { Menu, X, FileDown } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ResumeDownload } from "./ResumeDownload";
import { resumes } from "@/config/resumes";
import { navigation } from "@/config/navigation";
import { profile } from "@/config/profile";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const progress = useScrollProgress();

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="absolute inset-0 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl" />
      <div
        className="absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-150"
        style={{ width: `${progress * 100}%` }}
      />
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          {profile.name.split(" ")[0]}
          <span className="text-primary">.</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle />
            <ResumeDownload label="Resume" variant="primary" align="right" />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)] transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 space-y-1 border-t border-[var(--color-border)] pt-3">
            <p className="px-3 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">Download resume</p>
            {resumes.map((r) => (
              <a
                key={r.id}
                href={r.href}
                download={r.filename}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)]"
              >
                <FileDown size={14} aria-hidden="true" />
                {r.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
