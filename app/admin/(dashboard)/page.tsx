import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectsTable } from "./ProjectsTable";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-100">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
        >
          + New project
        </Link>
      </div>

      <div className="mt-6">
        <ProjectsTable
          projects={projects.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            published: p.published,
            pinned: p.pinned,
            createdAt: p.createdAt.toISOString(),
            thumbnail: p.images[0]?.url ?? null,
          }))}
        />
      </div>
    </div>
  );
}
