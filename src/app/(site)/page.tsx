import { WorkGrid } from "@/components/WorkGrid";
import { getPublishedProjects } from "@/lib/projects";

export default async function HomePage() {
  const projects = await getPublishedProjects();

  return (
    <section className="min-h-screen pt-24 pb-20 md:pt-28">
      <WorkGrid projects={projects} />
    </section>
  );
}
