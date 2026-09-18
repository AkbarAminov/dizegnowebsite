"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/categories";
import { focusRing, inputClass } from "./ui";

// Multi-select over the fixed category list: the closed control reads as a
// normal form input, opening it reveals a checkbox per category.
export function CategorySelect({
  id,
  selected,
  onChange,
}: {
  id: string;
  selected: Category[];
  onChange: (next: Category[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function toggle(category: Category) {
    // Kept in CATEGORIES order rather than click order, so the summary line
    // and the public site read the same way every time.
    const next = selected.includes(category)
      ? selected.filter((value) => value !== category)
      : CATEGORIES.filter((value) => value === category || selected.includes(value));
    onChange([...next]);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`${inputClass} flex items-center justify-between gap-2 text-left`}
      >
        <span className={selected.length ? "truncate" : "truncate text-neutral-500"}>
          {selected.length ? selected.join(", ") : "Select categories"}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-white/15 bg-panel py-1 shadow-lg"
        >
          {CATEGORIES.map((category) => {
            const checked = selected.includes(category);
            return (
              <button
                key={category}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(category)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-neutral-200 transition-colors hover:bg-white/5 ${focusRing}`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                    checked ? "border-white bg-white text-black" : "border-white/30"
                  }`}
                  aria-hidden
                >
                  {checked && <Check size={12} strokeWidth={3} />}
                </span>
                {category}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
