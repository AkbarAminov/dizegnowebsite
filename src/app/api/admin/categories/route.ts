import { prisma } from "@/lib/prisma";
import { isUniqueViolation, jsonError, parseBody } from "@/lib/api";
import { categorySchema } from "@/lib/validation";
import { revalidatePublicSite } from "@/lib/projects";

export async function POST(request: Request) {
  const parsed = await parseBody(request, categorySchema);
  if (!parsed.ok) return parsed.response;

  try {
    // New categories go to the bottom of the list; the admin moves them up.
    const last = await prisma.category.aggregate({ _max: { order: true } });
    const category = await prisma.category.create({
      data: { name: parsed.data.name, order: (last._max.order ?? -1) + 1 },
    });
    revalidatePublicSite();
    return Response.json({ id: category.id, name: category.name, projects: 0 }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) return jsonError("This category already exists", 409);
    throw error;
  }
}
