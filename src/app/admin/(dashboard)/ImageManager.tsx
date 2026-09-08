"use client";

import { useCallback, useId, useRef, useState } from "react";
import { GripVertical, Loader2, Maximize2, Upload, Video, X } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FitMode, MediaType } from "@/lib/types";
import { MediaThumbnail } from "@/components/MediaThumbnail";
import { Toast, type ToastMessage } from "./Toast";
import { api, focusRing, inputClass, secondaryButtonClass } from "./ui";

export type ImageRow = {
  id: string;
  url: string;
  type: MediaType;
  fitMode: FitMode;
};

export function ImageManager({
  projectId,
  images,
  uploadRules,
}: {
  projectId: string;
  images: ImageRow[];
  uploadRules: string;
}) {
  const [rows, setRows] = useState(images);
  const [busy, setBusy] = useState<"upload" | "youtube" | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<ToastMessage>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  // Stable id keeps dnd-kit's generated aria attributes identical on server and client.
  const dndId = useId();
  const base = `/api/admin/projects/${projectId}/images`;
  const dismissToast = useCallback(() => setToast(null), []);

  function fail(error: string) {
    setToast({ text: error, tone: "error" });
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const next = arrayMove(
      rows,
      rows.findIndex((row) => row.id === active.id),
      rows.findIndex((row) => row.id === over.id)
    );
    setRows(next);
    const result = await api(`${base}/reorder`, "PATCH", { order: next.map((row) => row.id) });
    if (!result.ok) fail(result.error);
  }

  async function handleUpload(files: FileList | File[] | null) {
    const list = files ? Array.from(files) : [];
    if (!list.length) return;
    setBusy("upload");

    const formData = new FormData();
    for (const file of list) formData.append("files", file);

    const result = await api<ImageRow[]>(base, "POST", formData);
    if (result.ok) {
      setRows((current) => [...current, ...result.data]);
      setToast({ text: `${result.data.length} added`, tone: "success" });
    } else {
      fail(result.error);
    }

    setBusy(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAddYoutube(event: React.FormEvent) {
    event.preventDefault();
    setBusy("youtube");

    const result = await api<ImageRow>(`${base}/youtube`, "POST", { url: youtubeUrl });
    if (result.ok) {
      setRows((current) => [...current, result.data]);
      setYoutubeUrl("");
      setToast({ text: "Video added", tone: "success" });
    } else {
      fail(result.error);
    }
    setBusy(null);
  }

  async function toggleFitMode(image: ImageRow) {
    const fitMode: FitMode = image.fitMode === "cover" ? "contain" : "cover";
    setRows((current) => current.map((row) => (row.id === image.id ? { ...row, fitMode } : row)));
    const result = await api(`${base}/${image.id}`, "PATCH", { fitMode });
    if (!result.ok) fail(result.error);
  }

  async function handleDelete(image: ImageRow) {
    setRows((current) => current.filter((row) => row.id !== image.id));
    const result = await api(`${base}/${image.id}`, "DELETE");
    if (!result.ok) fail(result.error);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragOver(false);
        handleUpload(event.dataTransfer.files);
      }}
      className={`rounded-lg transition-colors ${dragOver ? "bg-white/[0.04] outline-2 outline-dashed outline-white/40" : ""}`}
    >
      {rows.length > 0 && (
        <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={rows.map((row) => row.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {rows.map((image, index) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  isThumbnail={index === 0}
                  onDelete={() => handleDelete(image)}
                  onToggleFitMode={() => toggleFitMode(image)}
                />
              ))}
            </div>
          </SortableContext>
          <p className="mt-3 text-xs text-neutral-500">
            Drag to reorder — the first one is the thumbnail shown in the projects grid.
          </p>
        </DndContext>
      )}

      <label
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 px-6 py-10 text-center transition-colors hover:border-white/40 hover:bg-white/[0.02] ${
          rows.length === 0 ? "mt-0" : ""
        } ${busy === "upload" ? "opacity-60" : ""} ${focusRing}`}
      >
        {busy === "upload" ? (
          <Loader2 size={20} className="animate-spin text-neutral-300" />
        ) : (
          <Upload size={20} className="text-neutral-400" />
        )}
        <span className="text-sm font-medium text-neutral-200">
          {busy === "upload" ? "Uploading…" : "Drop images here or click to choose"}
        </span>
        <span className="text-xs text-neutral-500">{uploadRules}</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(event) => handleUpload(event.target.files)}
          className="sr-only"
          disabled={busy !== null}
        />
      </label>

      <form onSubmit={handleAddYoutube} className="mt-4 flex flex-wrap items-center gap-2">
        <Video size={18} className="text-neutral-500" aria-hidden />
        <input
          type="url"
          value={youtubeUrl}
          onChange={(event) => setYoutubeUrl(event.target.value)}
          placeholder="https://youtube.com/watch?v=…"
          aria-label="YouTube URL"
          required
          className={`w-72 ${inputClass}`}
        />
        <button type="submit" disabled={busy !== null} className={secondaryButtonClass}>
          {busy === "youtube" && <Loader2 size={16} className="animate-spin" />}
          Add video
        </button>
      </form>

      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}

function SortableImage({
  image,
  isThumbnail,
  onDelete,
  onToggleFitMode,
}: {
  image: ImageRow;
  isThumbnail: boolean;
  onDelete: () => void;
  onToggleFitMode: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  return (
    <figure
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-canvas ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <MediaThumbnail src={image.url} type={image.type} alt="" sizes="200px" fitMode={image.fitMode} playIconSize={24} />

      <button
        type="button"
        {...attributes}
        {...listeners}
        className={`absolute top-1.5 left-1.5 cursor-grab rounded bg-black/70 p-1 text-white active:cursor-grabbing ${focusRing}`}
        title="Drag to reorder"
      >
        <GripVertical size={14} />
        <span className="sr-only">Drag to reorder</span>
      </button>

      <button
        type="button"
        onClick={onDelete}
        // Kept visible on touch devices, where there is no hover.
        className={`absolute top-1.5 right-1.5 rounded bg-black/70 p-1 text-white transition-opacity hover:bg-red-600 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 ${focusRing}`}
        title="Remove"
      >
        <X size={14} />
        <span className="sr-only">Remove image</span>
      </button>

      <figcaption className="pointer-events-none absolute inset-x-1.5 bottom-1.5 flex items-end justify-between gap-1">
        <span className="flex gap-1">
          {isThumbnail && (
            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-black uppercase">
              Thumbnail
            </span>
          )}
          {image.type !== "image" && (
            <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
              {image.type}
            </span>
          )}
        </span>

        {image.type !== "youtube" && (
          <button
            type="button"
            onClick={onToggleFitMode}
            className={`pointer-events-auto flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
              image.fitMode === "contain" ? "text-accent" : "text-white"
            } ${focusRing}`}
            title={
              image.fitMode === "contain"
                ? "Fit: the whole image is shown — click to crop it to the tile instead"
                : "Fill: cropped to fill the tile — click to show the whole image instead"
            }
          >
            <Maximize2 size={10} />
            {image.fitMode === "contain" ? "Fit" : "Fill"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
