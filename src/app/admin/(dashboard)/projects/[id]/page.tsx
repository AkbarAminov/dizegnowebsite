import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProjectCategories } from "@/lib/projects";
import { UPLOAD_RULES } from "@/lib/uploads";
import { ProjectForm } from "../../ProjectForm";
import { ImageManager } from "../../ImageManager";
import { cardClass, secondaryButtonClass } from "../../ui";

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
    <div className="mx-auto max-w-6xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100">
        <ArrowLeft size={15} />
        Projects
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              project.published ? "bg-green-500/15 text-green-400" : "bg-white/10 text-neutral-400"
            }`}
          >
            {project.published ? "Published" : "Draft"}
          </span>
        </div>
        {project.published && (
          <a href={`/work/${project.slug}/`} target="_blank" rel="noreferrer" className={secondaryButtonClass}>
            <ExternalLink size={16} />
            View on site
          </a>
        )}
      </div>

      <div className="mt-6">
        <ProjectForm
          projectId={project.id}
          categories={categories}
          published={project.published}
          pinned={project.pinned}
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

      <section className={`mt-6 ${cardClass}`}>
        <div className="p-5">
          <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">Images &amp; video</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Saved as soon as you add them — the form above does not need to be saved for these.
          </p>
        </div>
        <div className="p-5 pt-0">
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
      </section>
    </div>
  );
}
