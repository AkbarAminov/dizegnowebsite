"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";

// Each service is long enough that showing all six expanded turns the page
// into a wall of text, so they collapse to a row of numbered titles.
//
// The detail stays mounted while collapsed (clipped by a 0fr grid row rather
// than unmounted) for two reasons: the copy is the page's main indexable
// content, and an in-page link like /services/#service-3 still finds its
// target. `inert` keeps collapsed content out of the tab order.
export function ServicesAccordion({
  items,
  includesLabel,
  resultLabel,
}: {
  items: Dictionary["services"]["items"];
  includesLabel: string;
  resultLabel: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ol className="mt-14 border-t border-white/15 md:mt-20">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <li key={item.title} id={`service-${i + 1}`} className="scroll-mt-24 border-b border-white/15">
            <h2>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                aria-controls={`service-panel-${i + 1}`}
                className="group grid w-full grid-cols-[2rem_minmax(0,1fr)_1.5rem] items-baseline gap-x-3 py-8 text-left md:grid-cols-[3rem_minmax(0,1fr)_2rem] md:gap-x-8 md:py-10"
              >
                <span className="text-sm opacity-40">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xl font-medium uppercase tracking-tight transition-opacity duration-200 group-hover:opacity-70 md:text-3xl">
                  {item.title}
                </span>
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="justify-self-end text-xl leading-none text-accent md:text-2xl"
                  aria-hidden
                >
                  +
                </motion.span>
              </button>
            </h2>

            <div
              id={`service-panel-${i + 1}`}
              inert={!open}
              className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid gap-8 pb-10 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-x-8 md:pb-14 lg:gap-x-8">
                  <div className="hidden md:block" aria-hidden />
                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                    <p className="max-w-xl text-base opacity-80">{item.summary}</p>
                    <div>
                      <p className="text-xs uppercase tracking-tight opacity-50">{includesLabel}</p>
                      <ul className="mt-3 flex flex-col gap-2 text-sm">
                        {item.includes.map((line) => (
                          <li key={line} className="flex gap-3">
                            <span className="text-accent" aria-hidden>
                              &mdash;
                            </span>
                            {line}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-6 text-xs uppercase tracking-tight opacity-50">{resultLabel}</p>
                      <p className="mt-2 max-w-md text-sm">{item.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
