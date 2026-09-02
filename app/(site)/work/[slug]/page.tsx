import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectInfoPanel } from "@/components/ProjectInfoPanel";
import { ProjectGallery } from "@/components/ProjectGallery";
import { WorkGrid } from "@/components/WorkGrid";
import { getPublishedProjects } from "@/lib/projects";

type Props = PageProps<"/work/[slug]">;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getPublishedProjects()).find((p) => p.slug === slug);
  return { title: project?.title ?? "Work" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = await getPublishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  // Prev/next wrap around so every project has both links.
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const related = projects.filter((p) => p.slug !== slug).slice(0, 6);

  return (
    <section className="min-h-screen pt-16 md:pt-20">
      <div className="relative">
        <ProjectInfoPanel project={project} />
        <ProjectGallery images={project.gallery} alt={project.title} />
      </div>

      {projects.length > 1 && (
        <nav className="mt-10 flex items-center justify-between border-t border-white/15 px-5 py-6 text-sm uppercase tracking-tight md:px-8">
          <Link
            href={`/work/${prev.slug}/`}
            className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
          >
            <span className="inline-block text-accent transition-transform duration-200 ease-out group-hover:-translate-x-1">
              &larr;
            </span>
            Previous project
          </Link>
          <Link
            href={`/work/${next.slug}/`}
            className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
          >
            Next project
            <span className="inline-block text-accent transition-transform duration-200 ease-out group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </nav>
      )}

      {related.length > 0 && (
        <div className="pt-10 pb-20">
          <h2 className="mb-6 px-5 text-xl uppercase tracking-tight opacity-60 md:px-8">Related projects</h2>
          <WorkGrid projects={related} columns={3} />
        </div>
      )}
    </section>
  );
}
