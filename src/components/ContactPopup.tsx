"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ContactForm } from "./ContactForm";
import { ContactLinks } from "./ContactLinks";
import { useLockBodyScroll } from "./useLockBodyScroll";

// One modal, opened from both the floating "+" button and the end-of-page CTA.

const ContactPopupContext = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

export function ContactPopupProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <ContactPopupContext.Provider value={{ open, setOpen }}>{children}</ContactPopupContext.Provider>;
}

export function useContactPopup() {
  const context = useContext(ContactPopupContext);
  if (!context) throw new Error("useContactPopup must be used within ContactPopupProvider");
  return context;
}

export function ContactPopup() {
  const { open, setOpen } = useContactPopup();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, setOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open contact form"
        className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl leading-none text-black shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 md:right-8 md:bottom-8"
      >
        +
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-hidden />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-popup-title"
              className="relative max-h-full w-full max-w-md overflow-y-auto bg-white p-8 text-black shadow-2xl md:p-10"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 text-2xl leading-none transition-opacity duration-200 hover:opacity-60"
              >
                &times;
              </button>

              <h2 id="contact-popup-title" className="text-2xl font-medium uppercase tracking-tight md:text-3xl">
                Get in touch
              </h2>
              <p className="mt-3 max-w-sm text-sm opacity-70">
                Have a project in mind? Send a short note and we&apos;ll get back to you.
              </p>
              <ContactLinks className="mt-4 gap-1" />

              <div className="mt-8">
                <ContactForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
