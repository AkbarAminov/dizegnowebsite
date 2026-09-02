import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api";
import { revalidatePublicSite } from "@/lib/projects";
import { UploadError, prepareUpload, storeUpload } from "@/lib/uploads";

export async function POST(request: Request, { params }: RouteContext<"/api/admin/projects/[id]/images">) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, select: { _count: { select: { images: true } } } });
  if (!project) return jsonError("Project not found", 404);

  const formData = await request.formData();
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
  if (files.length === 0) return jsonError("No files provided", 400);

  // Validate every file first so a bad one rejects the whole batch cleanly.
  let prepared;
  try {
    prepared = await Promise.all(files.map(prepareUpload));
  } catch (error) {
    if (error instanceof UploadError) return jsonError(error.message, 400);
    throw error;
  }

  const stored = await Promise.all(prepared.map(storeUpload));
  const images = await prisma.$transaction(
    stored.map((upload, i) =>
      prisma.projectImage.create({ data: { ...upload, projectId: id, order: project._count.images + i } })
    )
  );

  revalidatePublicSite();
  return Response.json(images, { status: 201 });
}
