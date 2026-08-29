import { Section } from "@/components/Section";
import { WorkGrid } from "@/components/WorkGrid";
import { getAllProjects } from "@/lib/projects";

export default async function HomePage() {
  console.time("[render] HomePage total");
  const projects = await getAllProjects();

  const page = (
    <Section theme="dark" className="min-h-screen px-0 pt-24 pb-20 md:pt-28">
      <WorkGrid projects={projects} />
    </Section>
  );
  console.timeEnd("[render] HomePage total");
  return page;
}
