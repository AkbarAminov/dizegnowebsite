"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { focusRing, inputClass } from "./ui";

// Multi-select over the known categories, plus a field for inventing a new
// one. The closed control reads as a normal form input; opening it reveals
// a checkbox per category and the add field underneath.
//
// A new category isn't stored anywhere of its own — it exists because a
// project carries it, so it only becomes an option for other projects once
// this one is saved (the page feeds `options` from what's already in use).
export function CategorySelect({
  id,
  selected,
  options,
  onChange,
}: {
  id: string;
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
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

  // Anything ticked on this project but not yet in `options` (just typed, or
  // coined before the list was last loaded) still needs a row of its own.
  const rows = useMemo(() => {
    const merged = [...options];
    for (const category of selected) {
      if (!merged.some((option) => option.toLowerCase() === category.toLowerCase())) merged.push(category);
    }
    return merged;
  }, [options, selected]);

  const trimmedDraft = draft.trim();
  const duplicate = rows.some((row) => row.toLowerCase() === trimmedDraft.toLowerCase());
  const canAdd = trimmedDraft.length > 0 && !duplicate;

  function toggle(category: string) {
    const next = selected.some((value) => value.toLowerCase() === category.toLowerCase())
      ? selected.filter((value) => value.toLowerCase() !== category.toLowerCase())
      : // Keep list order rather than click order, so the summary line and
        // the public site read the same way every time.
        rows.filter((row) => row === category || selected.includes(row));
    onChange(next);
  }

  function addDraft() {
    if (!canAdd) return;
    onChange([...selected, trimmedDraft]);
    setDraft("");
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
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-white/15 bg-panel shadow-lg">
          <div role="listbox" aria-multiselectable className="max-h-64 overflow-y-auto py-1">
            {rows.map((category) => {
              const checked = selected.some((value) => value.toLowerCase() === category.toLowerCase());
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

          <div className="flex items-center gap-2 border-t border-white/10 p-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                // Enter must not reach the surrounding form and submit it.
                if (event.key === "Enter") {
                  event.preventDefault();
                  addDraft();
                }
              }}
              placeholder="Add a category…"
              aria-label="Add a category"
              maxLength={40}
              className={`${inputClass} py-1.5`}
            />
            <button
              type="button"
              onClick={addDraft}
              disabled={!canAdd}
              aria-label="Add category"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/15 text-neutral-300 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
            >
              <Plus size={16} />
            </button>
          </div>
          {duplicate && trimmedDraft.length > 0 && (
            <p className="px-3 pb-2 text-xs text-neutral-500">Already in the list.</p>
          )}
        </div>
      )}
    </div>
  );
}
