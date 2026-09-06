import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectsTable } from "./ProjectsTable";
import { primaryButtonClass } from "./ui";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/admin/projects/new" className={primaryButtonClass}>
          + New project
        </Link>
      </div>

      <div className="mt-6">
        <ProjectsTable
          projects={projects.map((project) => ({
            id: project.id,
            title: project.title,
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
