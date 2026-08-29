import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { ProjectInfoPanel } from "@/components/ProjectInfoPanel";
import { ProjectGallery } from "@/components/ProjectGallery";
import { RelatedProjectsGrid } from "@/components/RelatedProjectsGrid";
import { getAdjacentProjects, getAllProjects, getProject } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project ? `${project.title} — Dizegno` : "Work — Dizegno" };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  console.time("[render] ProjectPage total");
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const { prev, next } = await getAdjacentProjects(project.slug);
  const allProjects = await getAllProjects();
  const related = allProjects.filter((p) => p.slug !== project.slug).slice(0, 6);

  console.time("[render] ProjectGallery JSX");
  const page = (
    <Section theme="dark" className="min-h-screen pt-16 md:pt-20">
      <div className="relative">
        <ProjectInfoPanel project={project} />
        <ProjectGallery images={project.gallery} alt={project.title} />
      </div>

      <nav className="flex items-center justify-between border-t border-white/15 px-5 py-6 text-sm uppercase tracking-tight md:px-8">
        {prev ? (
          <Link
            href={`/work/${prev.slug}/`}
            className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
          >
            <span className="inline-block text-[#f0e10c] transition-transform duration-200 ease-out group-hover:-translate-x-1">
              &larr;
            </span>
            Previous project
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/work/${next.slug}/`}
            className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
          >
            Next project
            <span className="inline-block text-[#f0e10c] transition-transform duration-200 ease-out group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {related.length > 0 && (
        <div className="pt-10 pb-20">
          <h2 className="mb-6 px-5 text-xl uppercase tracking-tight opacity-60 md:px-8">
            Related projects
          </h2>
          <RelatedProjectsGrid projects={related} />
        </div>
      )}
    </Section>
  );
  console.timeEnd("[render] ProjectGallery JSX");
  console.timeEnd("[render] ProjectPage total");
  return page;
}
