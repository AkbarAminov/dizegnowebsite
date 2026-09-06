import { prisma } from "@/lib/prisma";
import { isUniqueViolation, jsonError, parseBody } from "@/lib/api";
import { projectSchema } from "@/lib/validation";
import { revalidatePublicSite } from "@/lib/projects";

export async function POST(request: Request) {
  const parsed = await parseBody(request, projectSchema);
  if (!parsed.ok) return parsed.response;
  const { fields, ...data } = parsed.data;

  try {
    const project = await prisma.project.create({
      data: {
        ...data,
        order: await prisma.project.count(),
        fields: { create: fields.map((field, order) => ({ ...field, order })) },
      },
    });
    revalidatePublicSite();
    return Response.json(project, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) return jsonError("Slug is already in use", 409);
    throw error;
  }
}
