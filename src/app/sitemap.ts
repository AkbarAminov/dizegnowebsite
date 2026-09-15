import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { LOCALES, localeHref } from "@/lib/i18n";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

// Refreshed on the same schedule as the pages it lists.
export const revalidate = 3600;

const STATIC_PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/work/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/answers/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact/", priority: 0.7, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: [{ pinned: "desc" }, { order: "asc" }],
  });

  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, extra: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">) => {
    // One entry per locale, each listing every language version (hreflang).
    for (const locale of LOCALES) {
      entries.push({
        url: absoluteUrl(localeHref(locale, path)),
        alternates: { languages: languageAlternates(path) },
        ...extra,
      });
    }
  };

  const now = new Date();
  for (const page of STATIC_PAGES) {
    add(page.path, { lastModified: now, changeFrequency: page.changeFrequency, priority: page.priority });
  }
  for (const project of projects) {
    add(`/work/${project.slug}/`, { lastModified: project.updatedAt, changeFrequency: "monthly", priority: 0.7 });
  }
  return entries;
}
