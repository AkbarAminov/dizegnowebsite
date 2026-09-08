import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProjectCategories } from "@/lib/projects";
import { ProjectForm } from "../../ProjectForm";

export default async function NewProjectPage() {
  const categories = await getProjectCategories();

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100">
        <ArrowLeft size={15} />
        Projects
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">New project</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Fill in the basics first. Images and publishing come right after you create it.
      </p>

      <div className="mt-6">
        <ProjectForm categories={categories} />
      </div>
    </div>
  );
}
