import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PROJECTS_CACHE_TAG } from "@/lib/projects";

const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const match = url.match(YOUTUBE_ID_PATTERN);
  if (!match) {
    return NextResponse.json({ error: "Not a recognizable YouTube URL" }, { status: 400 });
  }

  const count = await prisma.projectImage.count({ where: { projectId: id } });
  const image = await prisma.projectImage.create({
    data: {
      projectId: id,
      url: `https://www.youtube.com/embed/${match[1]}`,
      // No real dimensions for a video — a 16:9 placeholder keeps grid
      // sizing (lib/gridLayout.ts) working without a type-specific case.
      width: 1280,
      height: 720,
      order: count,
      type: "youtube",
    },
  });

  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
  return NextResponse.json(image, { status: 201 });
}
