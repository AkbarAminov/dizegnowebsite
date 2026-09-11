"use client";

import type { Dictionary } from "@/lib/i18n";
import { useContactPopup } from "./ContactPopup";
import { RevealOnScroll } from "./RevealOnScroll";

export function EndCTA({ dict }: { dict: Dictionary["endCta"] }) {
  const { setOpen } = useContactPopup();

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-canvas px-6 py-24 text-center">
      <RevealOnScroll className="max-w-4xl text-2xl font-bold uppercase tracking-tight md:text-5xl">
        <p className="text-white">{dict.line1}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto mt-2 block max-w-3xl cursor-pointer uppercase leading-[1.2] text-accent transition-opacity duration-200 hover:opacity-70"
        >
          {dict.cta}
        </button>
      </RevealOnScroll>
    </div>
  );
}
