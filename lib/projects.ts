import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import type { AnswerSection, Project } from "./types";
import answersData from "./data/answers.json";
import { prisma } from "./prisma";

const answerSections = answersData as AnswerSection[];

// Every admin mutation (create/update/delete/reorder project or image)
// calls revalidateTag(PROJECTS_CACHE_TAG) so published changes show up
// on the public site immediately; the revalidate window below is just a
// safety-net upper bound on staleness, not the primary invalidation path.
export const PROJECTS_CACHE_TAG = "projects";

const projectInclude = {
  images: { orderBy: { order: "asc" as const } },
  fields: { orderBy: { order: "asc" as const } },
} satisfies Prisma.ProjectInclude;

type ProjectRow = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

function toProject(row: ProjectRow): Project {
  const gallery = row.images.map((image) => ({
    src: image.url,
    width: image.width,
    height: image.height,
    type: image.type,
    fitMode: image.fitMode === "contain" ? ("contain" as const) : ("cover" as const),
  }));

  const credits = [
    ...(row.year ? [{ label: "Year", value: String(row.year) }] : []),
    ...(row.production ? [{ label: "Production", value: row.production }] : []),
    ...row.fields.map((field) => ({ label: field.label, value: field.value })),
  ];

  // Prefer a real image for the thumbnail (homepage/work grid cards) —
  // a gif works fine there too, but a youtube embed URL can't render
  // inside next/image at all, so skip straight to the first plain image
  // if the gallery's first item happens to be a video.
  const thumbnail = gallery.find((image) => image.type !== "youtube") ?? gallery[0];

  return {
    slug: row.slug,
    title: row.title,
    category: row.category ?? "",
    year: row.year ?? 0,
    description: row.description ?? "",
    disciplines: row.category ? [row.category] : [],
    span: row.span === "wide" || row.span === "tall" ? row.span : "normal",
    thumbnail: thumbnail?.src ?? "",
    gallery,
    credits,
  };
}

const getAllProjectsCached = unstable_cache(
  async (): Promise<Project[]> => {
    console.time("[db] project.findMany (getAllProjects)");
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ pinned: "desc" }, { order: "asc" }],
      include: projectInclude,
    });
    console.timeEnd("[db] project.findMany (getAllProjects)");
    return rows.map(toProject);
  },
  ["all-projects"],
  { tags: [PROJECTS_CACHE_TAG], revalidate: 60 }
);

export async function getAllProjects(): Promise<Project[]> {
  return getAllProjectsCached();
}

const getProjectCached = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    console.time(`[db] project.findFirst (${slug})`);
    const row = await prisma.project.findFirst({
      where: { slug, published: true },
      include: projectInclude,
    });
    console.timeEnd(`[db] project.findFirst (${slug})`);
    return row ? toProject(row) : null;
  },
  ["project-by-slug"],
  { tags: [PROJECTS_CACHE_TAG], revalidate: 60 }
);

export async function getProject(slug: string): Promise<Project | undefined> {
  const project = await getProjectCached(slug);
  return project ?? undefined;
}

export async function getAdjacentProjects(
  slug: string
): Promise<{ prev: Project | undefined; next: Project | undefined }> {
  const projects = await getAllProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { prev, next };
}

export function getAllAnswers(): AnswerSection[] {
  return answerSections;
}
