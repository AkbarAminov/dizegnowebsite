"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABELS, localeHref, stripLocale } from "@/lib/i18n";

// Same page in every language. Client-side only because the current path
// comes from usePathname.
export function FooterLanguageLinks() {
  const { locale: current, path } = stripLocale(usePathname());

  return (
    <ul className="flex gap-3 text-sm uppercase tracking-tight">
      {LOCALES.map((locale) => (
        <li key={locale}>
          <Link
            href={localeHref(locale, path)}
            aria-current={locale === current ? "true" : undefined}
            className={
              locale === current ? "text-white" : "text-white/50 transition-colors duration-200 hover:text-white"
            }
          >
            {LOCALE_LABELS[locale]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
