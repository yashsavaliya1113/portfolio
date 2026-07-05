import { siteConfig } from "@/config/site";
import { navigation } from "@/config/navigation";
import { socialLinks } from "@/config/social";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
              {siteConfig.name.split(" ")[0]}
              <span className="text-primary">.</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-[var(--color-muted)] leading-relaxed">
              Full Stack .NET Developer building production-grade SaaS applications with ASP.NET Core, Angular, and Azure.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Connect
            </h3>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  {siteConfig.links.email}
                </a>
              </li>
              <li>
                <a
                  href="tel:+918104017448"
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  +91-81040 17448
                </a>
              </li>
              <li className="text-sm text-[var(--color-muted)]">Ahmedabad, Gujarat, India</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] py-6 sm:flex-row">
          <p className="text-xs text-[var(--color-muted)]">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--color-text)] transition-colors"
            >
              Next.js
            </a>
            {" & "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--color-text)] transition-colors"
            >
              Tailwind
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
