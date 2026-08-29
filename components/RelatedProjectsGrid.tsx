import type { Project } from "@/lib/types";
import { WorkGridItem } from "./WorkGridItem";

// Deliberately not masonry: a plain fixed grid so every card reads as
// the same size (same width, same forced aspect ratio) — a calmer,
// uniform close to the project page rather than another scattered
// collage. Reuses WorkGridItem for the card markup/hover so the
// darken + arrow + label-above-cursor behavior stays identical.
export function RelatedProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-2 sm:gap-4 md:px-8 lg:grid-cols-3 lg:gap-5">
      {projects.map((project) => (
        <WorkGridItem key={project.slug} project={project} aspectClass="aspect-[4/3]" />
      ))}
    </div>
  );
}
