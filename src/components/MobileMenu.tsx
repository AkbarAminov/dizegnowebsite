"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { LOCALES, LOCALE_LABELS, localeHref, stripLocale, type Dictionary, type Locale } from "@/lib/i18n";
import { useLockBodyScroll } from "./useLockBodyScroll";

const listVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  closed: { opacity: 0, y: 16, transition: { duration: 0.2 } },
};

export function MobileMenu({
  open,
  onClose,
  lang,
  dict,
}: {
  open: boolean;
  onClose: () => void;
  lang: Locale;
  dict: Dictionary;
}) {
  useLockBodyScroll(open);
  const { path } = stripLocale(usePathname());
  // The current language always leads; English (when not itself the
  // current one) keeps the middle spot, so RU/UZ trade the outer slots.
  const orderedLocales = [lang, ...LOCALES.filter((l) => l !== lang).sort((a, b) => (a === "en" ? -1 : b === "en" ? 1 : 0))];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col justify-center bg-canvas text-white md:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.ul
            className="flex flex-col gap-2 px-8"
            variants={listVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {NAV_LINKS.map((link) => (
              <motion.li key={link.href} variants={itemVariants}>
                <Link
                  href={localeHref(lang, link.href)}
                  onClick={onClose}
                  className="text-[12vw] leading-[1.1] font-medium uppercase tracking-tight"
                >
                  {dict.nav[link.key]}
                </Link>
              </motion.li>
            ))}
            <motion.li
              variants={itemVariants}
              className="mt-4 flex items-center gap-3 text-2xl font-medium uppercase tracking-tight"
            >
              <Globe size={22} strokeWidth={1.75} aria-hidden />
              {orderedLocales.map((locale, i) => (
                <span key={locale} className="flex items-center gap-3">
                  {i > 0 && <span className="text-white/20">|</span>}
                  <Link
                    href={localeHref(locale, path)}
                    onClick={onClose}
                    className={
                      locale === lang
                        ? "text-white"
                        : "text-white/40 transition-colors duration-200 hover:text-white/70"
                    }
                  >
                    {LOCALE_LABELS[locale]}
                  </Link>
                </span>
              ))}
            </motion.li>
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
