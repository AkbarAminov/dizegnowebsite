"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GripVertical, Pencil, Pin, Trash2 } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MediaType } from "@/lib/types";
import { MediaThumbnail } from "@/components/MediaThumbnail";
import { ConfirmDialog } from "./ConfirmDialog";
import { api } from "./ui";

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  pinned: boolean;
  createdAt: string;
  thumbnail: { url: string; type: MediaType } | null;
};

export function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(projects);
  const [pendingDelete, setPendingDelete] = useState<ProjectRow | null>(null);
  const [error, setError] = useState("");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  // Stable id keeps dnd-kit's generated aria attributes identical on server and client.
  const dndId = useId();

  // Optimistic update; on failure the page is refreshed to the server state.
  async function run(update: (rows: ProjectRow[]) => ProjectRow[], request: () => ReturnType<typeof api>) {
    setError("");
    setRows(update);
    const result = await request();
    if (!result.ok) {
      setError(result.error);
      router.refresh();
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const next = arrayMove(
      rows,
      rows.findIndex((row) => row.id === active.id),
      rows.findIndex((row) => row.id === over.id)
    );
    run(
      () => next,
      () => api("/api/admin/projects/reorder", "PATCH", { order: next.map((row) => row.id) })
    );
  }

  function patchRow(row: ProjectRow, patch: Partial<Pick<ProjectRow, "published" | "pinned">>) {
    run(
      (current) => current.map((r) => (r.id === row.id ? { ...r, ...patch } : r)),
      () => api(`/api/admin/projects/${row.id}`, "PATCH", patch)
    );
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const row = pendingDelete;
    setPendingDelete(null);
    run(
      (current) => current.filter((r) => r.id !== row.id),
      () => api(`/api/admin/projects/${row.id}`, "DELETE")
    );
  }

  return (
    <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900">
        <table className="w-full min-w-[640px] text-left text-sm">
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
          <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {rows.map((row) => (
                <SortableRow
                  key={row.id}
                  row={row}
                  onTogglePublished={() => patchRow(row, { published: !row.published })}
                  onTogglePinned={() => patchRow(row, { pinned: !row.pinned })}
                  onDelete={() => setPendingDelete(row)}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
        {rows.length === 0 && <p className="p-8 text-center text-sm text-neutral-500">No projects yet.</p>}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete project "${pendingDelete?.title}"?`}
        description="All of its images will be deleted too."
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
  row: ProjectRow;
  onTogglePublished: () => void;
  onTogglePinned: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`border-b border-white/5 last:border-0 ${row.pinned ? "bg-accent/[0.06]" : ""} ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <td className="px-4 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-neutral-500 hover:text-neutral-200"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="relative h-10 w-14 overflow-hidden rounded bg-white/5">
          {row.thumbnail && (
            <MediaThumbnail src={row.thumbnail.url} type={row.thumbnail.type} alt="" sizes="56px" playIconSize={14} />
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
            row.published ? "bg-green-500/15 text-green-400" : "bg-white/10 text-neutral-400"
          }`}
        >
          {row.published ? "Published" : "Draft"}
        </button>
      </td>
      <td className="px-4 py-3 text-neutral-500">{new Date(row.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onTogglePinned}
            className={row.pinned ? "text-accent" : "text-neutral-500 hover:text-neutral-200"}
            aria-label={row.pinned ? "Unpin project" : "Pin project"}
            aria-pressed={row.pinned}
          >
            <Pin size={16} fill={row.pinned ? "currentColor" : "none"} />
          </button>
          <Link href={`/admin/projects/${row.id}`} className="text-neutral-400 hover:text-neutral-100" aria-label="Edit project">
            <Pencil size={16} />
          </Link>
          <button type="button" onClick={onDelete} className="text-red-500 hover:text-red-400" aria-label="Delete project">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
