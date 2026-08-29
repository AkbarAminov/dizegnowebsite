import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../../ProjectForm";
import { ImageManager } from "../../ImageManager";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      fields: { orderBy: { order: "asc" } },
    },
  });
  if (!project) notFound();

  const categoryRows = await prisma.project.findMany({
    where: { category: { not: null } },
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  const categories = categoryRows.map((r) => r.category!).filter(Boolean);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">{project.title}</h1>
        <div className="mt-6 max-w-2xl">
          <ProjectForm
            mode="edit"
            categories={categories}
            project={{
              id: project.id,
              title: project.title,
              slug: project.slug,
              category: project.category ?? "",
              year: project.year ?? undefined,
              description: project.description ?? "",
              production: project.production ?? "",
              span: project.span === "wide" || project.span === "tall" ? project.span : "normal",
              fields: project.fields.map((f) => ({ label: f.label, value: f.value })),
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-100">Images</h2>
        <div className="mt-4">
          <ImageManager
            projectId={project.id}
            images={project.images.map((img) => ({
              id: img.id,
              url: img.url,
              width: img.width,
              height: img.height,
              type: img.type,
              fitMode: img.fitMode === "contain" ? "contain" : "cover",
            }))}
          />
        </div>
      </div>
    </div>
  );
}
