"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileDown } from "lucide-react";
import { resumes } from "@/config/resumes";

interface Props {
  label?: string;
  /** "primary" is the filled button, "outline" the bordered one. */
  variant?: "primary" | "outline";
  /** Where the menu opens relative to the button. */
  align?: "left" | "right";
  className?: string;
}

const styles = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  outline: "border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-primary/50",
};

/** One button that lets the visitor choose which resume to download (.NET Developer or Data Analyst). */
export function ResumeDownload({ label = "Resume", variant = "outline", align = "left", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="resume-menu"
        className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${styles[variant]}`}
      >
        <FileDown size={14} aria-hidden="true" />
        {label}
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          id="resume-menu"
          className={`absolute z-50 mt-2 w-72 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {resumes.map((r) => (
            <li key={r.id}>
              <a
                href={r.href}
                download={r.filename}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--color-surface)]"
              >
                <span className="block text-sm font-medium text-[var(--color-text)]">{r.label}</span>
                <span className="block text-xs text-[var(--color-muted)]">{r.description}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
