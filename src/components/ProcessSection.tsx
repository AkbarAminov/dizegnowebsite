"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { RevealOnScroll } from "./RevealOnScroll";

export function ProcessSection({ copy }: { copy: Dictionary["services"]["process"] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);

  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
    // A track that fits on screen has nothing to scroll, so show it as full.
    setProgress(max <= 0 ? 1 : el.scrollLeft / max);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  // Scrolls by exactly one column, whatever its current responsive width is.
  function scrollByColumn(direction: 1 | -1) {
    const el = trackRef.current;
    const column = columnRefs.current[0];
    if (!el || !column) return;
    el.scrollBy({ left: direction * column.offsetWidth, behavior: "smooth" });
  }

  function focusColumn(index: number) {
    const clamped = Math.max(0, Math.min(copy.steps.length - 1, index));
    const column = columnRefs.current[clamped];
    if (!column) return;
    column.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    column.focus({ preventScroll: true });
  }

  return (
    <section className="pb-20 md:pb-28">
      <RevealOnScroll className="flex items-end justify-between gap-6 px-5 md:px-8">
        <h2 className="text-2xl font-medium uppercase tracking-tight md:text-4xl">
          {copy.title}
          <span className="block opacity-55">{copy.subtitle}</span>
        </h2>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => scrollByColumn(-1)}
            disabled={!canPrev}
            aria-label={copy.prevAria}
            className={`flex h-14 w-14 items-center justify-center rounded-full border border-white/30 transition-opacity duration-200 ${
              canPrev ? "cursor-pointer hover:border-white/60" : "cursor-default opacity-35"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByColumn(1)}
            disabled={!canNext}
            aria-label={copy.nextAria}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black transition-opacity duration-200 ${
              canNext ? "cursor-pointer hover:opacity-90" : "cursor-default opacity-35"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </RevealOnScroll>

      {/* Every divider is a border on the column itself, so the rules scroll
          with the content (the last column closes the row on its right). The
          track's own padding — mirrored by scroll-padding so snapping lands
          in the same place — starts the first column on the same vertical as
          the progress bar below, rather than flush to the page edge. */}
      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-5 scroll-px-5 md:mt-14 md:px-8 md:scroll-px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {copy.steps.map((step, i) => (
          <div
            key={step.title}
            ref={(el) => {
              columnRefs.current[i] = el;
            }}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                focusColumn(i + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusColumn(i - 1);
              }
            }}
            className="flex min-h-[420px] w-[85vw] shrink-0 snap-start flex-col border-l border-white/15 px-5 py-8 last:border-r focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:w-1/2 md:px-8 xl:w-1/3"
          >
            <span className="text-[clamp(4rem,7vw,110px)] leading-[0.85] font-normal tracking-tight">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="mt-auto pt-10">
              <h3 className="text-base uppercase leading-[1.4]">{step.title}</h3>
              <p className="mt-3 text-[13px] leading-[1.5] opacity-60">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 px-5 md:px-8">
        <div className="h-px w-full bg-white/15">
          <div
            className="h-px bg-accent transition-[width] duration-150 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
