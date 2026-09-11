"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { WorkGrid } from "./WorkGrid";

// Client-side category filter over the already-fetched project list.
export function WorkFilter({ projects, lang, allLabel }: { projects: Project[]; lang: Locale; allLabel: string }) {
  const [active, setActive] = useState<string | null>(null);
  const categories = Array.from(new Set(projects.flatMap((p) => (p.category ? [p.category] : []))));

  if (categories.length === 0) return <WorkGrid projects={projects} lang={lang} />;

  const filtered = active ? projects.filter((p) => p.category === active) : projects;

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 px-5 text-sm uppercase tracking-tight md:mb-10 md:px-8">
        <FilterButton label={allLabel} active={active === null} onClick={() => setActive(null)} />
        {categories.map((category) => (
          <FilterButton
            key={category}
            label={category}
            active={active === category}
            onClick={() => setActive(category)}
          />
        ))}
      </div>

      <WorkGrid projects={filtered} lang={lang} />
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative border-b-2 border-transparent pb-1 transition-colors duration-200 ${
        active ? "text-accent" : "text-white/60 hover:text-white"
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="work-filter-underline"
          className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-accent"
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </button>
  );
}
