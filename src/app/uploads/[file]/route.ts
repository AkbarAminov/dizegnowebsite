import { readUpload, uploadContentType } from "@/lib/uploads";

// `next start` only serves the files that were in public/ when the server
// booted, so images uploaded from the admin afterwards would 404 — and with
// them next/image, which fetches the original through this same server.
// Serving uploads from a route keeps them working without a restart.
export async function GET(_request: Request, { params }: RouteContext<"/uploads/[file]">) {
  const { file } = await params;

  const contentType = uploadContentType(file);
  if (!contentType) return new Response("Not found", { status: 404 });

  const body = await readUpload(file);
  if (!body) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": contentType,
      // Filenames are random and never reused, so the file is immutable.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
