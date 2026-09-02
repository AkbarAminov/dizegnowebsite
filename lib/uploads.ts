import { promises as fs } from "node:fs";
import path from "node:path";
import { readImageInfo, type ImageInfo } from "./imageInfo";

// Uploaded images live on local disk under public/uploads and are served by
// Next as static files. For a serverless host, replace the two functions
// below with an S3/R2/Cloudinary implementation; nothing else touches the
// filesystem.

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const URL_PREFIX = "/uploads/";
const MAX_BYTES = 20 * 1024 * 1024;
const MIN_SIDE = 800;

export const UPLOAD_RULES = "JPG, PNG, WEBP or GIF, up to 20 MB, shortest side at least 800px.";

export class UploadError extends Error {}

export type PreparedUpload = { buffer: Buffer; info: ImageInfo };

export type StoredUpload = { url: string; width: number; height: number; type: "image" | "gif" };

/** Validates a file without writing it, so a batch can be rejected as a whole. */
export async function prepareUpload(file: File): Promise<PreparedUpload> {
  if (file.size > MAX_BYTES) {
    throw new UploadError(`${file.name}: file is larger than ${MAX_BYTES / 1024 / 1024} MB`);
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const info = readImageInfo(buffer);
  if (!info) {
    throw new UploadError(`${file.name}: unsupported file type, use JPG, PNG, WEBP or GIF`);
  }
  if (Math.min(info.width, info.height) < MIN_SIDE) {
    throw new UploadError(`${file.name}: shortest side must be at least ${MIN_SIDE}px`);
  }
  return { buffer, info };
}

export async function storeUpload({ buffer, info }: PreparedUpload): Promise<StoredUpload> {
  const extension = info.format === "jpeg" ? "jpg" : info.format;
  const filename = `${crypto.randomUUID()}.${extension}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return {
    url: URL_PREFIX + filename,
    width: info.width,
    height: info.height,
    type: info.format === "gif" ? "gif" : "image",
  };
}

export async function removeUpload(url: string) {
  // Remote URLs (seed data, YouTube embeds) are not ours to delete.
  if (!url.startsWith(URL_PREFIX)) return;
  await fs.rm(path.join(UPLOAD_DIR, path.basename(url)), { force: true });
}
