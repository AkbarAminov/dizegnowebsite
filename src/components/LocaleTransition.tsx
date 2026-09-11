"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { stripLocale } from "@/lib/i18n";

// Switching language changes the [lang] segment, which remounts the whole
// site layout (header included) rather than just the page content — so the
// usual per-page PageTransition doesn't get a chance to animate it. This
// keys on the *locale* only (not the full path), so it stays out of the way
// for ordinary in-locale navigation and only cross-fades on a language
// switch, where the whole tree changes together.
export function LocaleTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;

  const { locale } = stripLocale(pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={locale}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
