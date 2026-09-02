import { prisma } from "@/lib/prisma";
import { jsonError, parseBody } from "@/lib/api";
import { fitModeSchema } from "@/lib/validation";
import { revalidatePublicSite } from "@/lib/projects";
import { removeUpload } from "@/lib/uploads";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/projects/[id]/images/[imageId]">) {
  const { id, imageId } = await params;
  const parsed = await parseBody(request, fitModeSchema);
  if (!parsed.ok) return parsed.response;

  const { count } = await prisma.projectImage.updateMany({ where: { id: imageId, projectId: id }, data: parsed.data });
  if (count === 0) return jsonError("Image not found", 404);

  revalidatePublicSite();
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/projects/[id]/images/[imageId]">) {
  const { id, imageId } = await params;
  const image = await prisma.projectImage.findFirst({ where: { id: imageId, projectId: id } });
  if (!image) return jsonError("Image not found", 404);

  await prisma.projectImage.delete({ where: { id: imageId } });
  await removeUpload(image.url);

  revalidatePublicSite();
  return Response.json({ ok: true });
}
