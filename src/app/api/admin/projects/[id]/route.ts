import { prisma } from "@/lib/prisma";
import { isUniqueViolation, jsonError, parseBody } from "@/lib/api";
import { projectPatchSchema, validateProjectInput } from "@/lib/validation";
import { revalidatePublicSite } from "@/lib/projects";
import { removeUpload } from "@/lib/uploads";
import { LOCALES } from "@/lib/i18n";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/projects/[id]">) {
  const { id } = await params;
  const parsed = await parseBody(request, projectPatchSchema);
  if (!parsed.ok) return parsed.response;
  const titleError = validateProjectInput(parsed.data);
  if (titleError) return jsonError(titleError, 400);

  const { fields, translations, ...data } = parsed.data;

  try {
    const [project] = await prisma.$transaction([
      prisma.project.update({ where: { id }, data }),
      // Translations and credit rows are replaced wholesale when the form
      // sends them — the form always submits every locale together.
      ...(translations
        ? [
            prisma.projectTranslation.deleteMany({ where: { projectId: id } }),
            prisma.projectTranslation.createMany({
              data: LOCALES.map((locale) => ({ projectId: id, locale, ...translations[locale] })),
            }),
          ]
        : []),
      ...(fields
        ? [
            prisma.projectField.deleteMany({ where: { projectId: id } }),
            prisma.projectField.createMany({
              data: fields.map((field, order) => ({ order, projectId: id, translations: field.translations })),
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
