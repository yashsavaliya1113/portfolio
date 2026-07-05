"use client";

import { useState } from "react";
import { Menu, X, FileDown } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
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
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-dark"
            >
              <FileDown size={14} />
              Resume
            </a>
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
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white"
          >
            <FileDown size={14} />
            Download Resume
          </a>
        </div>
      </div>
    </header>
  );
}
