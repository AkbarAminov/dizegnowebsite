import { cache } from "react";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { Project } from "./types";

const include = {
  images: { orderBy: { order: "asc" } },
  fields: { orderBy: { order: "asc" } },
} satisfies Prisma.ProjectInclude;

type ProjectRow = Prisma.ProjectGetPayload<{ include: typeof include }>;

function toProject(row: ProjectRow): Project {
  const gallery = row.images.map((image) => ({
    src: image.url,
    width: image.width,
    height: image.height,
    type: image.type,
    fitMode: image.fitMode === "contain" ? ("contain" as const) : ("cover" as const),
  }));

  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description ?? "",
    // A YouTube embed cannot be a card thumbnail; prefer the first real image.
    thumbnail: (gallery.find((image) => image.type !== "youtube") ?? gallery[0])?.src ?? null,
    gallery,
    credits: [
      ...(row.year ? [{ label: "Year", value: String(row.year) }] : []),
      ...(row.production ? [{ label: "Production", value: row.production }] : []),
      ...row.fields.map(({ label, value }) => ({ label, value })),
    ],
  };
}

/**
 * Published projects, pinned first. Wrapped in React `cache` so a page and
 * its `generateMetadata` share one query per request.
 */
export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ pinned: "desc" }, { order: "asc" }],
    include,
  });
  return rows.map(toProject);
});

/** Distinct categories in use, for the admin form's suggestions. */
export async function getProjectCategories(): Promise<string[]> {
  const rows = await prisma.project.findMany({
    where: { category: { not: null } },
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  return rows.flatMap((row) => (row.category ? [row.category] : []));
}

/**
 * Public pages are statically rendered. Call this after every admin
 * mutation so the next visit re-renders them with fresh data.
 */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}
