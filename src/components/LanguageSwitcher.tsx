"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS, localeHref, stripLocale } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { locale: current, path } = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const others = LOCALES.filter((locale) => locale !== current);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 text-sm uppercase tracking-tight text-white/70 transition-opacity duration-200 hover:opacity-60"
      >
        <Globe size={15} strokeWidth={1.75} aria-hidden />
        {LOCALE_LABELS[current]}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute top-full right-0 z-50 mt-2 min-w-[4.5rem] overflow-hidden rounded-md border border-white/15 bg-canvas py-1 shadow-lg"
          >
            {others.map((locale) => (
              <Link
                key={locale}
                href={localeHref(locale, path)}
                onClick={() => setOpen(false)}
                role="option"
                className="block px-3 py-2 text-sm uppercase tracking-tight text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                {LOCALE_LABELS[locale]}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
