"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";

// Sticky title bar; the details panel drops down over the gallery instead
// of pushing it.
export function ProjectInfoPanel({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-16 z-30 md:top-20">
      <div className="flex items-center justify-between gap-4 border-b border-white/15 bg-black px-5 py-5 md:px-8">
        <h1 className="project-title min-w-0 font-medium uppercase tracking-tight">{project.title}</h1>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm uppercase tracking-tight text-accent transition-opacity duration-200 hover:opacity-70"
        >
          Project info
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-xl leading-none"
            aria-hidden
          >
            +
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full z-20 border-b border-white/15 bg-black px-5 py-10 md:px-8 md:py-16"
          >
            <div className="grid gap-10 md:grid-cols-2">
              <p className="max-w-md text-base opacity-80">{project.description}</p>

              <div>
                {project.credits.map((credit, i) => (
                  <div
                    key={i}
                    className="flex justify-between gap-4 border-t border-white/15 py-3 text-sm uppercase tracking-tight first:border-t-0"
                  >
                    <span className="opacity-50">{credit.label}</span>
                    <span className="text-right">{credit.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
