import { promises as fs } from "node:fs";
import path from "node:path";

export type StoredFile = {
  url: string;
  width: number;
  height: number;
  // Detected from the file's actual content (via image-size), not just
  // its extension — lets callers tell a real .gif from a .jpg renamed
  // to .gif before deciding how the frontend should render it.
  format: string;
};

export interface Storage {
  save(file: File): Promise<StoredFile>;
  remove(url: string): Promise<void>;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const UPLOAD_URL_PREFIX = "/uploads";

// Local-disk implementation used until a production image host is wired
// up. Swap the `storage` export below for an S3/Cloudinary-backed
// implementation of the same Storage interface — nothing else in the app
// needs to change.
class LocalStorage implements Storage {
  async save(file: File): Promise<StoredFile> {
    const { imageSize } = await import("image-size");

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    const dimensions = imageSize(buffer);
    if (!dimensions.width || !dimensions.height) {
      throw new Error("Could not read image dimensions");
    }

    return {
      url: `${UPLOAD_URL_PREFIX}/${filename}`,
      width: dimensions.width,
      height: dimensions.height,
      format: dimensions.type ?? "",
    };
  }

  async remove(url: string): Promise<void> {
    if (!url.startsWith(UPLOAD_URL_PREFIX)) return;
    const filename = url.slice(UPLOAD_URL_PREFIX.length + 1);
    await fs.rm(path.join(UPLOAD_DIR, filename), { force: true });
  }
}

export const storage: Storage = new LocalStorage();
