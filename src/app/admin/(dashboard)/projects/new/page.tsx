import { getProjectCategories } from "@/lib/projects";
import { ProjectForm } from "../../ProjectForm";

export default async function NewProjectPage() {
  const categories = await getProjectCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold">New project</h1>
      <div className="mt-6 max-w-2xl">
        <ProjectForm categories={categories} />
      </div>
    </div>
  );
}
