import { cache } from "react";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { Project } from "./types";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { preventOrphans } from "./typography";
import { sanitiseCategories } from "./categories";

const include = {
  images: { orderBy: { order: "asc" } },
  fields: { orderBy: { order: "asc" } },
  translations: true,
} satisfies Prisma.ProjectInclude;

type ProjectRow = Prisma.ProjectGetPayload<{ include: typeof include }>;
type FieldTranslations = Partial<Record<Locale, { label: string; value: string }>>;

// "Year"/"Production" are UI labels attached to DB values, not DB content
// themselves, so they're translated here rather than stored per project.
const CREDIT_LABELS: Record<Locale, { year: string; production: string }> = {
  ru: { year: "Год", production: "Продакшн" },
  en: { year: "Year", production: "Production" },
  uz: { year: "Yil", production: "Prodakshn" },
};

// A translation "exists" for fallback purposes only once it has a title —
// every project always has a row for every locale (created empty by the
// admin form), so falling back on row *presence* alone would never actually
// fall back to anything.
export function pickTranslation<T extends { locale: Locale; title: string | null }>(
  translations: T[],
  locale: Locale
): T | undefined {
  const translated = (t: T) => Boolean(t.title?.trim());
  return (
    translations.find((t) => t.locale === locale && translated(t)) ??
    translations.find((t) => t.locale === "en" && translated(t)) ??
    translations.find(translated) ??
    translations.find((t) => t.locale === locale)
  );
}

function pickFieldTranslation(translations: Prisma.JsonValue, locale: Locale) {
  const byLocale = translations as FieldTranslations;
  const filled = (t?: { label: string; value: string }) => Boolean(t?.label?.trim() && t?.value?.trim());
  if (filled(byLocale[locale])) return byLocale[locale];
  if (filled(byLocale.en)) return byLocale.en;
  return Object.values(byLocale).find(filled);
}

function toProject(row: ProjectRow, locale: Locale): Project {
  const t = pickTranslation(row.translations, locale);
  const labels = CREDIT_LABELS[locale];

  const gallery = row.images.map((image) => ({
    src: image.url,
    width: image.width,
    height: image.height,
    type: image.type,
    fitMode: image.fitMode === "contain" ? ("contain" as const) : ("cover" as const),
  }));

  return {
    slug: row.slug,
    title: preventOrphans(t?.title ?? "", locale),
    categories: sanitiseCategories(row.categories),
    description: preventOrphans(t?.description ?? "", locale),
    // A YouTube embed cannot be a card thumbnail; prefer the first real image.
    thumbnail: (gallery.find((image) => image.type !== "youtube") ?? gallery[0])?.src ?? null,
    gallery,
    credits: [
      ...(row.year ? [{ label: preventOrphans(labels.year, locale), value: String(row.year) }] : []),
      ...(t?.production
        ? [{ label: preventOrphans(labels.production, locale), value: preventOrphans(t.production, locale) }]
        : []),
      ...row.fields.flatMap((field) => {
        const translation = pickFieldTranslation(field.translations, locale);
        return translation
          ? [{ label: preventOrphans(translation.label, locale), value: preventOrphans(translation.value, locale) }]
          : [];
      }),
    ],
  };
}

/**
 * Published projects, pinned first, translated for `locale`. Wrapped in
 * React `cache` so a page and its `generateMetadata` share one query per
 * request (per locale).
 */
export const getPublishedProjects = cache(async (locale: Locale = DEFAULT_LOCALE): Promise<Project[]> => {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ pinned: "desc" }, { order: "asc" }],
    include,
  });
  return rows.map((row) => toProject(row, locale));
});

/**
 * Public pages are statically rendered. Call this after every admin
 * mutation so the next visit re-renders them with fresh data.
 */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}
