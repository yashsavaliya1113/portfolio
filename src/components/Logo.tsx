import Link from "next/link";

/**
 * Site logo: the "Y" mark plus the "Yash." wordmark. Links home.
 * The mark is inlined (no extra request) and uses a solid fill, so it can appear in both the header and the footer
 * without duplicate gradient ids. The favicon (public/icon.svg) is the same shape with a gradient.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Yash Savaliya, home" className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true" focusable="false" className="h-8 w-8 shrink-0">
        <rect width="64" height="64" rx="15" fill="#2563eb" />
        <path
          d="M19 17 32 33 45 17M32 33V49"
          fill="none"
          stroke="#fff"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="46.5" cy="47" r="4.2" fill="#bfdbfe" />
      </svg>
      <span className="font-heading text-lg font-semibold tracking-tight">
        Yash<span className="text-primary">.</span>
      </span>
    </Link>
  );
}
