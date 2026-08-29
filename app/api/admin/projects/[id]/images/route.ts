import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { validateImageFile } from "@/lib/validation";
import { PROJECTS_CACHE_TAG } from "@/lib/projects";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  for (const file of files) {
    const error = await validateImageFile(file);
    if (error) return NextResponse.json({ error }, { status: 400 });
  }

  const count = await prisma.projectImage.count({ where: { projectId: id } });

  const images = await Promise.all(
    files.map(async (file, i) => {
      const stored = await storage.save(file);
      return prisma.projectImage.create({
        data: {
          projectId: id,
          url: stored.url,
          width: stored.width,
          height: stored.height,
          order: count + i,
          type: stored.format === "gif" ? "gif" : "image",
        },
      });
    })
  );

  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json(images, { status: 201 });
}
