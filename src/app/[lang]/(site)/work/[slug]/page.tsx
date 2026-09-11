import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectInfoPanel } from "@/components/ProjectInfoPanel";
import { ProjectGallery } from "@/components/ProjectGallery";
import { WorkGrid } from "@/components/WorkGrid";
import { EndCTA } from "@/components/EndCTA";
import { getPublishedProjects } from "@/lib/projects";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale, localeHref } from "@/lib/i18n";

type Props = PageProps<"/[lang]/work/[slug]">;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const project = (await getPublishedProjects(lang)).find((p) => p.slug === slug);
  return { title: project?.title ?? "Work" };
}

export default async function ProjectPage({ params }: Props) {
  const { lang: rawLang, slug } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const [projects, dict] = await Promise.all([getPublishedProjects(lang), getDictionary(lang)]);
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  // Prev/next wrap around so every project has both links.
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const related = projects.filter((p) => p.slug !== slug).slice(0, 6);

  return (
    <>
      <section className="min-h-screen pt-16 md:pt-20">
        <div className="relative">
          <ProjectInfoPanel project={project} dict={dict.projectInfo} />
          <ProjectGallery images={project.gallery} alt={project.title} dict={dict.gallery} />
        </div>

        {projects.length > 1 && (
          <nav className="mt-10 flex items-center justify-between border-t border-white/15 px-5 py-6 text-sm uppercase tracking-tight md:px-8">
            <Link
              href={localeHref(lang, `/work/${prev.slug}/`)}
              className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
            >
              <span className="inline-block text-accent transition-transform duration-200 ease-out group-hover:-translate-x-1">
                &larr;
              </span>
              {dict.projectNav.previous}
            </Link>
            <Link
              href={localeHref(lang, `/work/${next.slug}/`)}
              className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
            >
              {dict.projectNav.next}
              <span className="inline-block text-accent transition-transform duration-200 ease-out group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </nav>
        )}

        {related.length > 0 && (
          <div className="pt-10 pb-20">
            <h2 className="mb-6 px-5 text-xl uppercase tracking-tight opacity-60 md:px-8">{dict.projectNav.related}</h2>
            <WorkGrid projects={related} lang={lang} columns={3} />
          </div>
        )}
      </section>
      <EndCTA dict={dict.endCta} />
    </>
  );
}
