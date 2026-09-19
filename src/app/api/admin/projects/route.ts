import { prisma } from "@/lib/prisma";
import { isUniqueViolation, jsonError, parseBody } from "@/lib/api";
import { projectSchema, validateProjectInput } from "@/lib/validation";
import { resolveCategories, revalidatePublicSite } from "@/lib/projects";
import { LOCALES } from "@/lib/i18n";

export async function POST(request: Request) {
  const parsed = await parseBody(request, projectSchema);
  if (!parsed.ok) return parsed.response;
  const titleError = validateProjectInput(parsed.data);
  if (titleError) return jsonError(titleError, 400);

  const { fields, translations, categories, ...data } = parsed.data;

  try {
    const project = await prisma.project.create({
      data: {
        ...data,
        categories: await resolveCategories(categories),
        order: await prisma.project.count(),
        translations: { create: LOCALES.map((locale) => ({ locale, ...translations[locale] })) },
        fields: { create: fields.map((field, order) => ({ order, translations: field.translations })) },
      },
    });
    revalidatePublicSite();
    return Response.json(project, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) return jsonError("Slug is already in use", 409);
    throw error;
  }
}
