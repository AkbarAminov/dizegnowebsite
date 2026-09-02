"use client";

import { useRef, useId, useState } from "react";
import { GripVertical, Maximize, X } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FitMode, MediaType } from "@/lib/types";
import { MediaThumbnail } from "@/components/MediaThumbnail";
import { api, inputClass, secondaryButtonClass } from "./ui";

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
  const [error, setError] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  // Stable id keeps dnd-kit's generated aria attributes identical on server and client.
  const dndId = useId();
  const base = `/api/admin/projects/${projectId}/images`;

  async function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const next = arrayMove(
      rows,
      rows.findIndex((row) => row.id === active.id),
      rows.findIndex((row) => row.id === over.id)
    );
    setRows(next);
    const result = await api(`${base}/reorder`, "PATCH", { order: next.map((row) => row.id) });
    if (!result.ok) setError(result.error);
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setBusy("upload");
    setError("");

    const formData = new FormData();
    for (const file of files) formData.append("files", file);

    const result = await api<ImageRow[]>(base, "POST", formData);
    if (result.ok) setRows((current) => [...current, ...result.data]);
    else setError(result.error);

    setBusy(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAddYoutube(event: React.FormEvent) {
    event.preventDefault();
    setBusy("youtube");
    setError("");

    const result = await api<ImageRow>(`${base}/youtube`, "POST", { url: youtubeUrl });
    if (result.ok) {
      setRows((current) => [...current, result.data]);
      setYoutubeUrl("");
    } else {
      setError(result.error);
    }
    setBusy(null);
  }

  async function toggleFitMode(image: ImageRow) {
    const fitMode: FitMode = image.fitMode === "cover" ? "contain" : "cover";
    setRows((current) => current.map((row) => (row.id === image.id ? { ...row, fitMode } : row)));
    const result = await api(`${base}/${image.id}`, "PATCH", { fitMode });
    if (!result.ok) setError(result.error);
  }

  async function handleDelete(image: ImageRow) {
    setRows((current) => current.filter((row) => row.id !== image.id));
    const result = await api(`${base}/${image.id}`, "DELETE");
    if (!result.ok) setError(result.error);
  }

  return (
    <div>
      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rows.map((row) => row.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {rows.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onDelete={() => handleDelete(image)}
                onToggleFitMode={() => toggleFitMode(image)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {rows.length === 0 && <p className="text-sm text-neutral-500">No images yet.</p>}

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <label className={`inline-block cursor-pointer border-dashed ${secondaryButtonClass}`}>
          {busy === "upload" ? "Uploading..." : "+ Upload images or gifs"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(event) => handleUpload(event.target.files)}
            className="hidden"
            disabled={busy !== null}
          />
        </label>

        <form onSubmit={handleAddYoutube} className="flex items-center gap-2">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder="Paste a YouTube URL"
            required
            className={`w-56 ${inputClass}`}
          />
          <button type="submit" disabled={busy !== null} className={secondaryButtonClass}>
            {busy === "youtube" ? "Adding..." : "+ Add video"}
          </button>
        </form>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <p className="mt-2 text-xs text-neutral-500">{uploadRules}</p>
    </div>
  );
}

function SortableImage({
  image,
  onDelete,
  onToggleFitMode,
}: {
  image: ImageRow;
  onDelete: () => void;
  onToggleFitMode: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative aspect-square overflow-hidden rounded border border-white/10 bg-black ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <MediaThumbnail src={image.url} type={image.type} alt="" sizes="200px" playIconSize={24} />

      {image.type !== "image" && (
        <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
          {image.type}
        </span>
      )}

      {image.type !== "youtube" && (
        <button
          type="button"
          onClick={onToggleFitMode}
          className={`absolute right-1 bottom-1 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
            image.fitMode === "contain" ? "text-accent" : "text-white"
          }`}
          title={image.fitMode === "contain" ? "Showing the full image" : "Cropped to fill the tile"}
        >
          <Maximize size={10} />
          {image.fitMode}
        </button>
      )}

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 cursor-grab rounded bg-black/60 p-1 text-white"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-1 right-1 rounded bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete image"
      >
        <X size={14} />
      </button>
    </div>
  );
}
