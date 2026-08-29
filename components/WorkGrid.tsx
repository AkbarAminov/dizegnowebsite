import type { Project } from "@/lib/types";
import { WorkGridItem } from "./WorkGridItem";

// Plain modular grid — Main and Work pages. 2 columns (1 on mobile),
// every card the same aspect ratio, no dense-flow/empty-module variety.
// Side padding uses the same px-5 value as the gap between cards, so
// the edge margin matches the inter-card spacing exactly.
export function WorkGrid({ projects, eager = true }: { projects: Project[]; eager?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-5 px-5 sm:grid-cols-2">
      {projects.map((project, i) => (
        <WorkGridItem key={project.slug} project={project} priority={eager && i < 2} />
      ))}
    </div>
  );
}
