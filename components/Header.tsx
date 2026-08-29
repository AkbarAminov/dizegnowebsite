"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/work/", label: "Work" },
  { href: "/answers/", label: "Answers" },
  { href: "/contact/", label: "Contact" },
];

// Every page on the site is dark now, so the header is always dark too —
// no more per-section light/dark tracking (that broke down on tall pages
// anyway: a section taller than the viewport can never satisfy an
// "X% of the element is visible" inview threshold).
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-black px-5 text-white md:h-20 md:px-8">
      <Link href="/" className="group shrink-0">
        <Logo className="h-7 w-auto" />
      </Link>

      <nav className="hidden gap-6 text-sm uppercase tracking-tight md:flex">
        {LINKS.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-opacity duration-200 hover:opacity-60 ${
                active ? "opacity-100" : "opacity-70"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="relative z-50 flex h-6 w-7 flex-col justify-between md:hidden"
      >
        <span
          className={`h-px w-full bg-current transition-transform duration-300 ${
            menuOpen ? "translate-y-[11px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-px w-full bg-current transition-opacity duration-300 ${
            menuOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-px w-full bg-current transition-transform duration-300 ${
            menuOpen ? "-translate-y-[11px] -rotate-45" : ""
          }`}
        />
      </button>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
