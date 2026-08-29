import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { WorkFilter } from "@/components/WorkFilter";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Work — Dizegno" };

export default async function WorkPage() {
  console.time("[render] WorkPage total");
  const projects = await getAllProjects();

  const page = (
    <Section theme="dark" className="min-h-screen px-0 pt-28 pb-20 md:pt-36">
      <RevealOnScroll className="mb-10 px-5 md:px-8">
        <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">Work</h1>
      </RevealOnScroll>

      <WorkFilter projects={projects} />
    </Section>
  );
  console.timeEnd("[render] WorkPage total");
  return page;
}
