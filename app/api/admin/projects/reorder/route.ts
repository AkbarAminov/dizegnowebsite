import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PROJECTS_CACHE_TAG } from "@/lib/projects";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body?.order)) {
    return NextResponse.json({ error: "order must be an array of project ids" }, { status: 400 });
  }

  await prisma.$transaction(
    body.order.map((id: string, index: number) =>
      prisma.project.update({ where: { id }, data: { order: index } })
    )
  );

  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json({ ok: true });
}
