"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import { localeHref, stripLocale, type Dictionary, type Locale } from "@/lib/i18n";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { path: activePath } = stripLocale(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-canvas px-5 text-white md:h-20 md:px-8">
      <Link href={localeHref(lang, "/")} className="group shrink-0" aria-label={dict.nav.homeAria}>
        <Logo className="h-7 w-auto" />
      </Link>

      <nav className="hidden items-center gap-6 text-sm uppercase tracking-tight md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={localeHref(lang, link.href)}
            className={`transition-opacity duration-200 hover:opacity-60 ${
              activePath.startsWith(link.href) ? "opacity-100" : "opacity-70"
            }`}
          >
            {dict.nav[link.key]}
          </Link>
        ))}
        <LanguageSwitcher className="ml-2" />
      </nav>

      <button
        type="button"
        aria-label={menuOpen ? dict.nav.menuCloseAria : dict.nav.menuOpenAria}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="relative z-50 flex h-6 w-7 flex-col justify-between md:hidden"
      >
        <span
          className={`h-px w-full bg-current transition-transform duration-300 ${
            menuOpen ? "translate-y-[11px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-px w-full bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`h-px w-full bg-current transition-transform duration-300 ${
            menuOpen ? "-translate-y-[11px] -rotate-45" : ""
          }`}
        />
      </button>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} dict={dict} />
    </header>
  );
}
