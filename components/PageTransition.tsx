"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * We couldn't confirm the reference site's exact page-transition timing
 * without a live browser session (see research notes), so this is an
 * original fade/rise transition, not a measured copy.
 *
 * Caveat: Next's App Router doesn't guarantee the outgoing route stays
 * mounted for an exit animation (data for the new route can start
 * streaming immediately). Keying AnimatePresence by pathname and passing
 * the RSC-rendered `children` through is the standard workaround, but a
 * genuinely reliable exit animation would need every route to resolve
 * instantly or to opt into `export const dynamic = "force-static"`.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
