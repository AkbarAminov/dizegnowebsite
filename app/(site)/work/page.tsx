import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { WorkFilter } from "@/components/WorkFilter";
import { getPublishedProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Work" };

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="min-h-screen pt-28 pb-20 md:pt-36">
      <RevealOnScroll className="mb-10 px-5 md:px-8">
        <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">Work</h1>
      </RevealOnScroll>

      <WorkFilter projects={projects} />
    </section>
  );
}
