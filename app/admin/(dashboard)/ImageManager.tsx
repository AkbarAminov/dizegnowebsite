"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GripVertical, Maximize, Play, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getYoutubeThumbnail } from "@/lib/youtube";

type ImageRow = {
  id: string;
  url: string;
  width: number;
  height: number;
  type: "image" | "gif" | "youtube";
  fitMode: "cover" | "contain";
};

export function ImageManager({ projectId, images }: { projectId: string; images: ImageRow[] }) {
  const [rows, setRows] = useState(images);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [addingYoutube, setAddingYoutube] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    const next = arrayMove(rows, oldIndex, newIndex);
    setRows(next);

    await fetch(`/api/admin/projects/${projectId}/images/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((r) => r.id) }),
    });
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const res = await fetch(`/api/admin/projects/${projectId}/images`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const created: ImageRow[] = await res.json();
      setRows((prev) => [...prev, ...created]);
    } else {
      const body = await res.json().catch(() => ({}));
      setUploadError(body.error ?? "Upload failed");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function toggleFitMode(image: ImageRow) {
    const fitMode = image.fitMode === "cover" ? "contain" : "cover";
    setRows((prev) => prev.map((r) => (r.id === image.id ? { ...r, fitMode } : r)));
    await fetch(`/api/admin/projects/${projectId}/images/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fitMode }),
    });
  }

  async function handleAddYoutube(e: React.FormEvent) {
    e.preventDefault();
    setAddingYoutube(true);
    setYoutubeError("");

    const res = await fetch(`/api/admin/projects/${projectId}/images/youtube`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: youtubeUrl }),
    });

    if (res.ok) {
      const created: ImageRow = await res.json();
      setRows((prev) => [...prev, created]);
      setYoutubeUrl("");
    } else {
      const body = await res.json().catch(() => ({}));
      setYoutubeError(body.error ?? "Could not add that video");
    }

    setAddingYoutube(false);
  }

  async function handleDelete(image: ImageRow) {
    setRows((prev) => prev.filter((r) => r.id !== image.id));
    await fetch(`/api/admin/projects/${projectId}/images/${image.id}`, { method: "DELETE" });
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rows.map((r) => r.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-4 gap-3">
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
        <label className="inline-block cursor-pointer rounded border border-dashed border-white/15 px-4 py-2 text-sm text-neutral-400 hover:border-white/30">
          {uploading ? "Uploading..." : "+ Upload images or gifs"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
        </label>

        <form onSubmit={handleAddYoutube} className="flex items-center gap-2">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste a YouTube URL"
            required
            className="w-56 rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-white/40"
          />
          <button
            type="submit"
            disabled={addingYoutube}
            className="rounded border border-white/15 px-4 py-2 text-sm text-neutral-400 hover:border-white/30 hover:text-neutral-100 disabled:opacity-50"
          >
            {addingYoutube ? "Adding..." : "+ Add video"}
          </button>
        </form>
      </div>
      {uploadError && <p className="mt-2 text-sm text-red-400">{uploadError}</p>}
      {youtubeError && <p className="mt-2 text-sm text-red-400">{youtubeError}</p>}
      <p className="mt-2 text-xs text-neutral-500">
        JPG, PNG, WEBP, or GIF — up to 20MB, shortest side at least 800px.
      </p>
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative aspect-square overflow-hidden rounded border border-white/10 bg-black ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {image.type === "youtube" ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail, not in next.config remotePatterns, only used in this small admin preview tile */}
          <img
            src={getYoutubeThumbnail(image.url)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Play size={24} className="fill-white text-white" />
          </div>
        </>
      ) : image.type === "gif" ? (
        // eslint-disable-next-line @next/next/no-img-element -- next/image would strip gif animation
        <img src={image.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Image src={image.url} alt="" fill sizes="200px" className="object-cover" />
      )}

      {image.type !== "image" && (
        <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
          {image.type}
        </span>
      )}

      {image.type !== "youtube" && (
        <button
          type="button"
          onClick={onToggleFitMode}
          className={`absolute bottom-1 right-1 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
            image.fitMode === "contain" ? "text-[#f0e10c]" : "text-white"
          }`}
          aria-label={
            image.fitMode === "contain" ? "Switch to cover (crop to fill)" : "Switch to contain (show full image)"
          }
          title={
            image.fitMode === "contain" ? "Contain — showing full image" : "Cover — cropped to fill"
          }
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
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-1 right-1 rounded bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100"
        aria-label="Delete image"
        title="Delete"
      >
        <X size={14} />
      </button>
    </div>
  );
}
