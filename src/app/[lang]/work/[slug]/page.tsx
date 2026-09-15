import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectInfoPanel } from "@/components/ProjectInfoPanel";
import { ProjectGallery } from "@/components/ProjectGallery";
import { WorkGrid } from "@/components/WorkGrid";
import { EndCTA } from "@/components/EndCTA";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedProjects } from "@/lib/projects";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale, localeHref } from "@/lib/i18n";
import { absoluteUrl, pageMetadata, plainText, truncate } from "@/lib/seo";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structuredData";

type Props = PageProps<"/[lang]/work/[slug]">;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const [projects, dict] = await Promise.all([getPublishedProjects(lang), getDictionary(lang)]);
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: dict.notFound.title, robots: { index: false } };

  const title = plainText(project.title);
  return pageMetadata({
    lang,
    path: `/work/${project.slug}/`,
    title,
    description: project.description
      ? truncate(project.description)
      : plainText(dict.seo.projectFallback).replace("{title}", title),
    image: project.thumbnail ? { url: absoluteUrl(project.thumbnail), alt: title } : undefined,
  });
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
  const related = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="min-h-dvh pt-16 md:pt-20">
        <div className="relative">
          <ProjectInfoPanel
            project={project}
            lang={lang}
            toggleLabel={dict.projectInfo.toggle}
            aboutLabel={dict.projectInfo.aboutLabel}
            backLabel={dict.projectNav.back}
          />
          <ProjectGallery images={project.gallery} alt={project.title} dict={dict.gallery} />
        </div>

        {projects.length > 1 && (
          <nav className="mt-10 flex items-center justify-between border-t border-white/15 px-5 py-6 text-xs uppercase tracking-tight md:px-8 lg:text-sm">
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

      <JsonLd data={projectJsonLd(project, lang)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.work, path: "/work/" },
            { name: project.title, path: `/work/${project.slug}/` },
          ],
          lang
        )}
      />
    </>
  );
}
