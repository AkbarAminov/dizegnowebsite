"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import type { CategoryOption } from "@/lib/projects";
import { CATEGORY_MAX_LENGTH, orderByVocabulary } from "@/lib/categories";
import { ConfirmDialog } from "./ConfirmDialog";
import { api, focusRing, iconButtonClass, inputClass } from "./ui";

// Multi-select over the Category table, which it also manages: the add
// field creates a category straight away, and "Edit" turns the rows into a
// list that can be reordered (the priority the /work/ filter follows) or
// pruned. Those changes are saved immediately, independent of the project
// form around it.
export function CategorySelect({
  id,
  selected,
  options,
  onChange,
  onDelete,
}: {
  id: string;
  selected: string[];
  options: CategoryOption[];
  onChange: (next: string[]) => void;
  // A deleted category is also gone from the saved project, not just the
  // form's current value — the form needs both to stay in step.
  onDelete: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState(options);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CategoryOption | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The confirm dialog handles its own Escape; it must not close this too.
    if (!open || pendingDelete) return;
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
  }, [open, pendingDelete]);

  const names = items.map((item) => item.name);
  const summary = orderByVocabulary(selected, names);
  const isSelected = (name: string) => selected.some((value) => value.toLowerCase() === name.toLowerCase());

  const trimmedDraft = draft.trim();
  const duplicate = names.some((name) => name.toLowerCase() === trimmedDraft.toLowerCase());
  const canAdd = trimmedDraft.length > 0 && !duplicate && !adding;

  function toggle(name: string) {
    // Kept in list order rather than click order, so the summary line and
    // the public site read the same way every time.
    onChange(
      isSelected(name)
        ? selected.filter((value) => value.toLowerCase() !== name.toLowerCase())
        : orderByVocabulary([...selected, name], names)
    );
  }

  async function addDraft() {
    if (!canAdd) return;
    setAdding(true);
    setError(null);
    const result = await api<CategoryOption>("/api/admin/categories", "POST", { name: trimmedDraft });
    setAdding(false);
    if (!result.ok) return setError(result.error);
    setItems((current) => [...current, result.data]);
    // A category typed in select mode is meant for this project.
    if (!editing) onChange([...summary, result.data.name]);
    setDraft("");
  }

  async function move(index: number, offset: -1 | 1) {
    const previous = items;
    const next = [...items];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    setItems(next);
    setError(null);
    const result = await api("/api/admin/categories/reorder", "PATCH", { order: next.map((item) => item.id) });
    if (!result.ok) {
      setItems(previous);
      setError(result.error);
    }
  }

  async function confirmDelete() {
    const category = pendingDelete;
    if (!category) return;
    setPendingDelete(null);
    setError(null);
    const result = await api(`/api/admin/categories/${category.id}`, "DELETE");
    if (!result.ok) return setError(result.error);
    setItems((current) => current.filter((item) => item.id !== category.id));
    onDelete(category.name);
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
        <span className={summary.length ? "truncate" : "truncate text-neutral-500"}>
          {summary.length ? summary.join(", ") : "Select categories"}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full min-w-80 overflow-hidden rounded-md border border-white/15 bg-panel shadow-lg">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 py-1.5 pr-1.5 pl-3">
            <span className="text-xs text-neutral-500">
              {editing ? "Order of the Work page filter" : `${items.length} categories`}
            </span>
            <button
              type="button"
              onClick={() => {
                setEditing((value) => !value);
                setError(null);
              }}
              className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-neutral-300 transition-colors hover:bg-white/5 hover:text-white ${focusRing}`}
            >
              {editing ? <Check size={13} /> : <Pencil size={13} />}
              {editing ? "Done" : "Edit list"}
            </button>
          </div>

          {editing ? (
            <ul className="max-h-64 overflow-y-auto py-1">
              {items.map((item, index) => (
                <li key={item.id} className="flex items-center gap-2 py-1 pr-1.5 pl-3 text-sm text-neutral-200">
                  <span className="min-w-0 flex-1 truncate">{item.name}</span>
                  {item.projects > 0 && (
                    <span className="shrink-0 text-xs text-neutral-500">
                      {item.projects} {item.projects === 1 ? "project" : "projects"}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${item.name} up`}
                    className={`${iconButtonClass} disabled:pointer-events-none disabled:opacity-30`}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${item.name} down`}
                    className={`${iconButtonClass} disabled:pointer-events-none disabled:opacity-30`}
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    aria-label={`Delete ${item.name}`}
                    className={`${iconButtonClass} hover:text-red-400`}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
              {items.length === 0 && <li className="px-3 py-2 text-sm text-neutral-500">No categories yet.</li>}
            </ul>
          ) : (
            <div role="listbox" aria-multiselectable className="max-h-64 overflow-y-auto py-1">
              {items.map((item) => {
                const checked = isSelected(item.name);
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggle(item.name)}
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
                    {item.name}
                  </button>
                );
              })}
              {items.length === 0 && <p className="px-3 py-2 text-sm text-neutral-500">No categories yet.</p>}
            </div>
          )}

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
              maxLength={CATEGORY_MAX_LENGTH}
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
          {error && <p className="px-3 pb-2 text-xs text-red-400">{error}</p>}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete “${pendingDelete?.name}”?`}
        description={
          pendingDelete?.projects
            ? `It will also be removed from ${pendingDelete.projects} ${
                pendingDelete.projects === 1 ? "project" : "projects"
              }. This cannot be undone.`
            : "This cannot be undone."
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
