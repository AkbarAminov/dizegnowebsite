import { prisma } from "@/lib/prisma";
import { isUniqueViolation, jsonError, parseBody } from "@/lib/api";
import { projectPatchSchema } from "@/lib/validation";
import { revalidatePublicSite } from "@/lib/projects";
import { removeUpload } from "@/lib/uploads";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/projects/[id]">) {
  const { id } = await params;
  const parsed = await parseBody(request, projectPatchSchema);
  if (!parsed.ok) return parsed.response;
  const { fields, ...data } = parsed.data;

  try {
    const [project] = await prisma.$transaction([
      prisma.project.update({ where: { id }, data }),
      // Credit rows are replaced wholesale when the form sends them.
      ...(fields
        ? [
            prisma.projectField.deleteMany({ where: { projectId: id } }),
            prisma.projectField.createMany({
              data: fields.map((field, order) => ({ ...field, order, projectId: id })),
            }),
          ]
        : []),
    ]);
    revalidatePublicSite();
    return Response.json(project);
  } catch (error) {
    if (isUniqueViolation(error)) return jsonError("Slug is already in use", 409);
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/projects/[id]">) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { images: true } });
  if (!project) return jsonError("Project not found", 404);

  await prisma.project.delete({ where: { id } });
  await Promise.all(project.images.map((image) => removeUpload(image.url)));

  revalidatePublicSite();
  return Response.json({ ok: true });
}
