"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ContactForm } from "./ContactForm";
import { useContactPopup } from "./ContactPopupProvider";

export function ContactPopup() {
  const { open, setOpen } = useContactPopup();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open contact form"
        className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e10c] text-2xl leading-none text-black shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 md:right-8 md:bottom-8"
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
            <motion.div
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-md bg-white p-8 text-black shadow-2xl md:p-10"
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

              <h2 className="text-2xl font-medium uppercase tracking-tight md:text-3xl">
                Get in touch
              </h2>
              <p className="mt-3 max-w-sm text-sm opacity-70">
                Have a project in mind? Send a short note and we&apos;ll get back to you.
              </p>

              <div className="mt-4 flex flex-col gap-1 text-sm">
                <a href="mailto:dizegno.design@gmail.com" className="underline underline-offset-4 opacity-80 transition-opacity duration-200 hover:opacity-100">
                  dizegno.design@gmail.com
                </a>
                <a href="tel:+998933938274" className="underline underline-offset-4 opacity-80 transition-opacity duration-200 hover:opacity-100">
                  +998 93 393 82 74
                </a>
                <a
                  href="https://t.me/Here_for"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 opacity-80 transition-opacity duration-200 hover:opacity-100"
                >
                  Telegram — @Here_for
                </a>
              </div>

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
