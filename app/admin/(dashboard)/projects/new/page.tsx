import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../../ProjectForm";

export default async function NewProjectPage() {
  const rows = await prisma.project.findMany({
    where: { category: { not: null } },
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  const categories = rows.map((r) => r.category!).filter(Boolean);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-100">New project</h1>
      <div className="mt-6 max-w-2xl">
        <ProjectForm mode="create" categories={categories} />
      </div>
    </div>
  );
}
