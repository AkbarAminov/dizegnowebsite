import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { PROJECTS_CACHE_TAG } from "@/lib/projects";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      fields: { orderBy: { order: "asc" } },
    },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.slug === "string") data.slug = body.slug;
  if (typeof body.category === "string") data.category = body.category || null;
  if (body.year !== undefined) data.year = body.year ? Number(body.year) : null;
  if (typeof body.description === "string") data.description = body.description || null;
  if (typeof body.production === "string") data.production = body.production || null;
  if (typeof body.span === "string") data.span = body.span;
  if (typeof body.published === "boolean") data.published = body.published;
  if (typeof body.pinned === "boolean") data.pinned = body.pinned;

  if (Array.isArray(body.fields)) {
    await prisma.projectField.deleteMany({ where: { projectId: id } });
    await prisma.projectField.createMany({
      data: body.fields.map((field: { label: string; value: string }, i: number) => ({
        projectId: id,
        label: field.label,
        value: field.value,
        order: i,
      })),
    });
  }

  const project = await prisma.project.update({ where: { id }, data });
  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json(project);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { images: true } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Promise.all(project.images.map((img) => storage.remove(img.url)));
  await prisma.project.delete({ where: { id } });

  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json({ ok: true });
}
