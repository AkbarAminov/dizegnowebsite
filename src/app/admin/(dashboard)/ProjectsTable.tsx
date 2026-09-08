"use client";

import { useCallback, useId, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, GripVertical, ImageOff, Pencil, Pin, Trash2 } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MediaType } from "@/lib/types";
import { MediaThumbnail } from "@/components/MediaThumbnail";
import { ConfirmDialog } from "./ConfirmDialog";
import { Switch } from "./Switch";
import { Toast, type ToastMessage } from "./Toast";
import { api, iconButtonClass, primaryButtonClass } from "./ui";

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
  const [toast, setToast] = useState<ToastMessage>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  // Stable id keeps dnd-kit's generated aria attributes identical on server and client.
  const dndId = useId();
  const dismissToast = useCallback(() => setToast(null), []);

  // Optimistic update; on failure the page is refreshed to the server state.
  async function run(update: (rows: ProjectRow[]) => ProjectRow[], request: () => ReturnType<typeof api>, done: string) {
    setRows(update);
    const result = await request();
    if (result.ok) {
      setToast({ text: done, tone: "success" });
    } else {
      setToast({ text: result.error, tone: "error" });
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
      () => api("/api/admin/projects/reorder", "PATCH", { order: next.map((row) => row.id) }),
      "Order updated"
    );
  }

  function patchRow(row: ProjectRow, patch: Partial<Pick<ProjectRow, "published" | "pinned">>, done: string) {
    run(
      (current) => current.map((r) => (r.id === row.id ? { ...r, ...patch } : r)),
      () => api(`/api/admin/projects/${row.id}`, "PATCH", patch),
      done
    );
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const row = pendingDelete;
    setPendingDelete(null);
    run(
      (current) => current.filter((r) => r.id !== row.id),
      () => api(`/api/admin/projects/${row.id}`, "DELETE"),
      `"${row.title}" deleted`
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-neutral-900/40 px-6 py-16 text-center">
        <p className="text-sm font-medium text-neutral-200">No projects yet</p>
        <p className="mt-1 text-sm text-neutral-500">Create one, add its images, then publish it to the site.</p>
        <Link href="/admin/projects/new" className={`mt-6 ${primaryButtonClass}`}>
          New project
        </Link>
      </div>
    );
  }

  return (
    <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-900/60">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-xs tracking-wide text-neutral-400 uppercase">
            <tr>
              <th className="w-10 px-4 py-3" title="Drag a row to change the order on the site">
                <span className="sr-only">Reorder</span>
              </th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Visible on site</th>
              <th className="w-24 px-4 py-3 font-medium">Featured</th>
              <th className="w-28 px-4 py-3 font-medium">Created</th>
              <th className="w-32 px-4 py-3" />
            </tr>
          </thead>
          <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {rows.map((row) => (
                <SortableRow
                  key={row.id}
                  row={row}
                  onTogglePublished={() =>
                    patchRow(
                      row,
                      { published: !row.published },
                      row.published ? `"${row.title}" moved to drafts` : `"${row.title}" is live`
                    )
                  }
                  onTogglePinned={() =>
                    patchRow(row, { pinned: !row.pinned }, row.pinned ? "Unfeatured" : "Featured — shows first")
                  }
                  onDelete={() => setPendingDelete(row)}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Drag the handle on the left to change the order projects appear in. Featured projects always come first.
      </p>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.title}"?`}
        description="The project and all of its images will be removed from the site. This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
      <Toast message={toast} onDismiss={dismissToast} />
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
      className={`border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.02] ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <td className="px-4 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing ${iconButtonClass}`}
          aria-label={`Reorder ${row.title}`}
          title="Drag to change the order on the site"
        >
          <GripVertical size={16} />
        </button>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded bg-white/5">
            {row.thumbnail ? (
              <MediaThumbnail src={row.thumbnail.url} type={row.thumbnail.type} alt="" sizes="64px" playIconSize={14} />
            ) : (
              <ImageOff size={14} className="absolute inset-0 m-auto text-neutral-600" aria-label="No images yet" />
            )}
          </div>
          <div className="min-w-0">
            <Link href={`/admin/projects/${row.id}`} className="font-medium text-neutral-100 hover:underline">
              {row.title}
            </Link>
            <p className="truncate text-xs text-neutral-500">/work/{row.slug}/</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <Switch
          checked={row.published}
          onChange={onTogglePublished}
          label={row.published ? "Published" : "Draft"}
          description={row.published ? "Anyone can see it" : "Hidden from visitors"}
        />
      </td>

      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onTogglePinned}
          aria-pressed={row.pinned}
          className={`${iconButtonClass} ${row.pinned ? "text-accent hover:text-accent" : ""}`}
          title={row.pinned ? "Featured — click to unfeature" : "Feature this project so it shows first"}
        >
          <Pin size={16} fill={row.pinned ? "currentColor" : "none"} />
          <span className="sr-only">{row.pinned ? "Unfeature project" : "Feature project"}</span>
        </button>
      </td>

      <td className="px-4 py-3 text-neutral-500">{new Date(row.createdAt).toLocaleDateString()}</td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          {row.published && (
            <a
              href={`/work/${row.slug}/`}
              target="_blank"
              rel="noreferrer"
              className={iconButtonClass}
              title="Open on the site"
            >
              <ExternalLink size={16} />
              <span className="sr-only">Open {row.title} on the site</span>
            </a>
          )}
          <Link href={`/admin/projects/${row.id}`} className={iconButtonClass} title="Edit project">
            <Pencil size={16} />
            <span className="sr-only">Edit {row.title}</span>
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className={`${iconButtonClass} hover:bg-red-500/10 hover:text-red-400`}
            title="Delete project"
          >
            <Trash2 size={16} />
            <span className="sr-only">Delete {row.title}</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
