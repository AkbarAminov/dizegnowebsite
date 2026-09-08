"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/site";
import { useLockBodyScroll } from "./useLockBodyScroll";

const listVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  closed: { opacity: 0, y: 16, transition: { duration: 0.2 } },
};

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useLockBodyScroll(open);

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
                  href={link.href}
                  onClick={onClose}
                  className="text-[12vw] leading-[1.1] font-medium uppercase tracking-tight"
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
