import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MIN_IMAGE_DIMENSION = 800;

// Validated against the raw upload (mime type + byte size + decoded
// dimensions) before anything is written to disk or the DB — an early
// reject here is the only thing standing between a client's file picker
// and a broken/oversized asset in the gallery.
export async function validateImageFile(file: File): Promise<string | null> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return `${file.name}: unsupported file type — use JPG, PNG, WEBP, or GIF.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${file.name}: file is too large — max ${MAX_IMAGE_BYTES / (1024 * 1024)}MB.`;
  }

  const { imageSize } = await import("image-size");
  const buffer = Buffer.from(await file.arrayBuffer());
  const dimensions = imageSize(buffer);
  if (!dimensions.width || !dimensions.height) {
    return `${file.name}: could not read image dimensions.`;
  }
  if (Math.min(dimensions.width, dimensions.height) < MIN_IMAGE_DIMENSION) {
    return `${file.name}: resolution too low — shortest side must be at least ${MIN_IMAGE_DIMENSION}px.`;
  }

  return null;
}
