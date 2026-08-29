import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PROJECTS_CACHE_TAG } from "@/lib/projects";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.slug) {
    return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
  }

  const existing = await prisma.project.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const count = await prisma.project.count();
  const project = await prisma.project.create({
    data: {
      title: body.title,
      slug: body.slug,
      category: body.category || null,
      year: body.year ? Number(body.year) : null,
      description: body.description || null,
      production: body.production || null,
      span: body.span || "normal",
      order: count,
      published: false,
    },
  });

  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json(project, { status: 201 });
}
