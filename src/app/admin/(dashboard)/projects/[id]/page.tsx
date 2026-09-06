import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProjectCategories } from "@/lib/projects";
import { UPLOAD_RULES } from "@/lib/uploads";
import { ProjectForm } from "../../ProjectForm";
import { ImageManager } from "../../ImageManager";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } }, fields: { orderBy: { order: "asc" } } },
    }),
    getProjectCategories(),
  ]);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <div className="mt-6 max-w-2xl">
          <ProjectForm
            projectId={project.id}
            categories={categories}
            initial={{
              title: project.title,
              slug: project.slug,
              category: project.category ?? "",
              year: project.year ? String(project.year) : "",
              description: project.description ?? "",
              production: project.production ?? "",
              fields: project.fields.map(({ label, value }) => ({ label, value })),
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Images</h2>
        <div className="mt-4">
          <ImageManager
            projectId={project.id}
            uploadRules={UPLOAD_RULES}
            images={project.images.map((image) => ({
              id: image.id,
              url: image.url,
              type: image.type,
              fitMode: image.fitMode === "contain" ? "contain" : "cover",
            }))}
          />
        </div>
      </div>
    </div>
  );
}
