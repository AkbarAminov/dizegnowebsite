import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProjectCategories, pickTranslation } from "@/lib/projects";
import { UPLOAD_RULES } from "@/lib/uploads";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import { ProjectForm, type ProjectFormValues } from "../../ProjectForm";
import { ImageManager } from "../../ImageManager";
import { cardClass, secondaryButtonClass } from "../../ui";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        fields: { orderBy: { order: "asc" } },
        translations: true,
      },
    }),
    getProjectCategories(),
  ]);
  if (!project) notFound();

  const displayTitle = pickTranslation(project.translations, DEFAULT_LOCALE)?.title || "Untitled";
  const initial: ProjectFormValues = {
    slug: project.slug,
    year: project.year ? String(project.year) : "",
    translations: Object.fromEntries(
      LOCALES.map((locale) => {
        const t = project.translations.find((row) => row.locale === locale);
        return [locale, { title: t?.title ?? "", category: t?.category ?? "", description: t?.description ?? "", production: t?.production ?? "" }];
      })
    ) as ProjectFormValues["translations"],
    fields: project.fields.map((field) => ({
      translations: field.translations as ProjectFormValues["fields"][number]["translations"],
    })),
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100">
        <ArrowLeft size={15} />
        Projects
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{displayTitle}</h1>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              project.published ? "bg-green-500/15 text-green-400" : "bg-white/10 text-neutral-400"
            }`}
          >
            {project.published ? "Published" : "Draft"}
          </span>
        </div>
        {project.published && (
          <a href={`/work/${project.slug}/`} target="_blank" rel="noreferrer" className={secondaryButtonClass}>
            <ExternalLink size={16} />
            View on site
          </a>
        )}
      </div>

      <div className="mt-6">
        <ProjectForm
          projectId={project.id}
          categories={categories}
          published={project.published}
          pinned={project.pinned}
          initial={initial}
        />
      </div>

      <section className={`mt-6 ${cardClass}`}>
        <div className="p-5">
          <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">Images &amp; video</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Saved as soon as you add them — the form above does not need to be saved for these.
          </p>
        </div>
        <div className="p-5 pt-0">
          <ImageManager
            projectId={project.id}
            uploadRules={UPLOAD_RULES}
            images={project.images.map((image) => ({
              id: image.id,
              url: image.url,
              type: image.type,
              fitMode: image.fitMode === "contain" ? "contain" : "cover",
            }))}
          />
        </div>
      </section>
    </div>
  );
}
