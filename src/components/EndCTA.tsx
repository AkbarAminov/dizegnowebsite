"use client";

import type { Dictionary } from "@/lib/i18n";
import { useContactPopup } from "./ContactPopup";
import { RevealOnScroll } from "./RevealOnScroll";

export function EndCTA({ dict }: { dict: Dictionary["endCta"] }) {
  const { setOpen } = useContactPopup();

  return (
    <div className="flex min-h-[30dvh] items-center justify-center bg-canvas px-6 py-14 text-center lg:min-h-[50dvh] lg:py-24">
      <RevealOnScroll className="max-w-4xl text-2xl font-bold uppercase tracking-tight md:text-5xl">
        <p className="text-white">{dict.line1}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto mt-2 flex max-w-3xl cursor-pointer items-center justify-center gap-1 uppercase leading-[1.2] text-accent transition-opacity duration-200 hover:opacity-70"
        >
          {dict.cta}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
            className="h-[0.75em] w-[0.75em] shrink-0 pt-[0.1em]"
            aria-hidden
          >
            <path d="M7 7h10v10" />
            <path d="M8 17 15 9" />
          </svg>
        </button>
      </RevealOnScroll>
    </div>
  );
}
