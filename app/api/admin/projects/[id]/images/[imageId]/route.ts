import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { PROJECTS_CACHE_TAG } from "@/lib/projects";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { imageId } = await params;
  const body = await request.json().catch(() => null);
  if (body?.fitMode !== "cover" && body?.fitMode !== "contain") {
    return NextResponse.json({ error: "fitMode must be 'cover' or 'contain'" }, { status: 400 });
  }

  const image = await prisma.projectImage.update({
    where: { id: imageId },
    data: { fitMode: body.fitMode },
  });

  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json(image);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { imageId } = await params;
  const image = await prisma.projectImage.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await storage.remove(image.url);
  await prisma.projectImage.delete({ where: { id: imageId } });

  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json({ ok: true });
}
