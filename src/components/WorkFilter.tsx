"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { WorkGrid } from "./WorkGrid";

// Client-side category filter over the already-fetched project list.
export function WorkFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const categories = Array.from(new Set(projects.flatMap((p) => (p.category ? [p.category] : []))));

  if (categories.length === 0) return <WorkGrid projects={projects} />;

  const filtered = active ? projects.filter((p) => p.category === active) : projects;

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 px-5 text-sm uppercase tracking-tight md:mb-10 md:px-8">
        <FilterButton label="All" active={active === null} onClick={() => setActive(null)} />
        {categories.map((category) => (
          <FilterButton
            key={category}
            label={category}
            active={active === category}
            onClick={() => setActive(category)}
          />
        ))}
      </div>

      <WorkGrid projects={filtered} />
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border-b-2 pb-1 transition-colors duration-200 ${
        active ? "border-accent text-accent" : "border-transparent text-white/60 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
