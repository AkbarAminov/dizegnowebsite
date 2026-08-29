import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PROJECTS_CACHE_TAG } from "@/lib/projects";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await params;
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body?.order)) {
    return NextResponse.json({ error: "order must be an array of image ids" }, { status: 400 });
  }

  await prisma.$transaction(
    body.order.map((imageId: string, index: number) =>
      prisma.projectImage.update({ where: { id: imageId }, data: { order: index } })
    )
  );

  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json({ ok: true });
}
