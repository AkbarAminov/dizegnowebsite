import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { pickTranslation } from "@/lib/projects";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { ProjectsTable } from "./ProjectsTable";
import { primaryButtonClass } from "./ui";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 }, translations: true },
  });

  const published = projects.filter((project) => project.published).length;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {projects.length === 0
              ? "Nothing here yet."
              : `${published} of ${projects.length} published on the site.`}
          </p>
        </div>
        <Link href="/admin/projects/new" className={primaryButtonClass}>
          <Plus size={16} />
          New project
        </Link>
      </div>

      <div className="mt-6">
        <ProjectsTable
          projects={projects.map((project) => ({
            id: project.id,
            title: pickTranslation(project.translations, DEFAULT_LOCALE)?.title || "Untitled",
            slug: project.slug,
            published: project.published,
            pinned: project.pinned,
            createdAt: project.createdAt.toISOString(),
            thumbnail: project.images[0] ?? null,
          }))}
        />
      </div>
    </div>
  );
}
