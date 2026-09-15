"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/lib/types";
import { localeHref, type Locale } from "@/lib/i18n";

// Sticky title bar; the details panel drops down over the gallery instead
// of pushing it. Below lg (tablet and phone) a back-to-work link is shown
// and the row groups left instead of spreading title/toggle to opposite
// edges, which felt cramped against a long title on a narrow screen.
//
// The panel stays mounted while closed (faded out, inert) so the project
// description and credits are part of the server-rendered HTML — that text
// is what search engines index for the page.
export function ProjectInfoPanel({
  project,
  lang,
  toggleLabel,
  aboutLabel,
  backLabel,
}: {
  project: Project;
  lang: Locale;
  toggleLabel: string;
  aboutLabel: string;
  backLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-16 z-30 md:top-20">
      <div className="border-b border-white/15 bg-canvas px-5 py-5 md:px-8 lg:flex lg:items-center lg:justify-between lg:gap-4">
        <Link
          href={localeHref(lang, "/work/")}
          className="flex items-center gap-1.5 text-sm uppercase tracking-tight text-white/60 transition-colors duration-200 hover:text-white lg:hidden"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>

        <h1 className="project-title mt-3.5 min-w-0 font-medium uppercase tracking-tight lg:mt-0">{project.title}</h1>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="mt-4 flex items-center gap-2 whitespace-nowrap text-sm uppercase tracking-tight text-accent transition-opacity duration-200 hover:opacity-70 lg:mt-0 lg:shrink-0"
        >
          {toggleLabel}
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

      <motion.div
        initial={false}
        animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden={!open}
        inert={!open}
        className={`absolute inset-x-0 top-full z-20 border-b border-white/15 bg-canvas px-5 py-10 md:px-8 md:py-16 ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <h2 className="sr-only">{aboutLabel}</h2>
        <div className="grid gap-10 md:grid-cols-[3fr_2fr]">
          <p className="max-w-2xl text-base opacity-80">{project.description}</p>

          <dl>
            {project.credits.map((credit, i) => (
              <div
                key={i}
                className="flex justify-between gap-4 border-t border-white/15 py-3 text-sm uppercase tracking-tight first:border-t-0"
              >
                <dt className="opacity-50">{credit.label}</dt>
                <dd className="text-right">{credit.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </div>
  );
}
