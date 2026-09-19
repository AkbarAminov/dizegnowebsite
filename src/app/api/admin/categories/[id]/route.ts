import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api";
import { revalidatePublicSite } from "@/lib/projects";
import { sanitiseCategories } from "@/lib/categories";

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/categories/[id]">) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return jsonError("Category not found", 404);

  // Projects store names, not ids, so the name is stripped from every
  // project that carries it — otherwise it would linger in the /work/
  // filter with nothing left to manage it from.
  const name = category.name.toLowerCase();
  const projects = await prisma.project.findMany({ select: { id: true, categories: true } });
  const affected = projects
    .map((project) => ({ id: project.id, categories: sanitiseCategories(project.categories) }))
    .filter((project) => project.categories.some((value) => value.toLowerCase() === name));

  await prisma.$transaction([
    prisma.category.delete({ where: { id } }),
    ...affected.map((project) =>
      prisma.project.update({
        where: { id: project.id },
        data: { categories: project.categories.filter((value) => value.toLowerCase() !== name) },
      })
    ),
  ]);

  revalidatePublicSite();
  return Response.json({ ok: true, projects: affected.length });
}
