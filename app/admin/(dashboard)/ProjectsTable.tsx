"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GripVertical, Pencil, Pin, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ConfirmDialog } from "./ConfirmDialog";

type Row = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  pinned: boolean;
  createdAt: string;
  thumbnail: string | null;
};

export function ProjectsTable({ projects }: { projects: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(projects);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    const next = arrayMove(rows, oldIndex, newIndex);
    setRows(next);

    await fetch("/api/admin/projects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((r) => r.id) }),
    });
  }

  async function togglePublished(row: Row) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: !r.published } : r)));
    await fetch(`/api/admin/projects/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !row.published }),
    });
  }

  async function togglePinned(row: Row) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, pinned: !r.pinned } : r)));
    await fetch(`/api/admin/projects/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !row.pinned }),
    });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const row = pendingDelete;
    setPendingDelete(null);
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    await fetch(`/api/admin/projects/${row.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-neutral-400">
            <tr>
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {rows.map((row) => (
                <SortableRow
                  key={row.id}
                  row={row}
                  onTogglePublished={() => togglePublished(row)}
                  onTogglePinned={() => togglePinned(row)}
                  onDelete={() => setPendingDelete(row)}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">No projects yet.</p>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete project "${pendingDelete?.title}"?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </DndContext>
  );
}

function SortableRow({
  row,
  onTogglePublished,
  onTogglePinned,
  onDelete,
}: {
  row: Row;
  onTogglePublished: () => void;
  onTogglePinned: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`border-b border-white/5 last:border-0 ${
        row.pinned ? "bg-[#f0e10c]/[0.06]" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <td className="px-4 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-neutral-500 hover:text-neutral-200"
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="relative h-10 w-14 overflow-hidden rounded bg-white/5">
          {row.thumbnail && (
            <Image src={row.thumbnail} alt="" fill sizes="56px" className="object-cover" />
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <Link href={`/admin/projects/${row.id}`} className="font-medium hover:underline">
          {row.title}
        </Link>
        <p className="text-xs text-neutral-500">/work/{row.slug}/</p>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onTogglePublished}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            row.published
              ? "bg-green-500/15 text-green-400"
              : "bg-white/10 text-neutral-400"
          }`}
        >
          {row.published ? "Published" : "Draft"}
        </button>
      </td>
      <td className="px-4 py-3 text-neutral-500">
        {new Date(row.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onTogglePinned}
            className={row.pinned ? "text-[#f0e10c]" : "text-neutral-500 hover:text-neutral-200"}
            aria-label={row.pinned ? "Unpin project" : "Pin project"}
            aria-pressed={row.pinned}
            title={row.pinned ? "Unpin" : "Pin"}
          >
            <Pin size={16} fill={row.pinned ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/admin/projects/${row.id}`}
            className="text-neutral-400 hover:text-neutral-100"
            aria-label="Edit project"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="text-red-500 hover:text-red-400"
            aria-label="Delete project"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
