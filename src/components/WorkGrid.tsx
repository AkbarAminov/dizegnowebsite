"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { localeHref, type Locale } from "@/lib/i18n";
import { RevealOnScroll } from "./RevealOnScroll";

const COLUMN_CLASSES = {
  2: "grid-cols-1 gap-5 px-5 sm:grid-cols-2",
  3: "grid-cols-1 gap-3 px-5 sm:grid-cols-2 sm:gap-4 md:px-8 lg:grid-cols-3 lg:gap-5",
};

// Uniform project grid used on Home, Work and the "related projects" strip.
export function WorkGrid({
  projects,
  lang,
  columns = 2,
}: {
  projects: Project[];
  lang: Locale;
  columns?: 2 | 3;
}) {
  return (
    <div className={`grid ${COLUMN_CLASSES[columns]}`}>
      {projects.map((project, i) => (
        <WorkCard key={project.slug} project={project} lang={lang} priority={i < 2} index={i} />
      ))}
    </div>
  );
}

function WorkCard({
  project,
  lang,
  priority,
  index,
}: {
  project: Project;
  lang: Locale;
  priority: boolean;
  index: number;
}) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);

  // The title label follows the pointer via direct DOM writes, so there is
  // no re-render per mouse move. It stays mounted and only toggles opacity.
  function handleMouseMove(event: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !labelRef.current) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    labelRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%) translateY(-8px)`;
  }

  return (
    <RevealOnScroll delay={Math.min(index * 0.06, 0.3)}>
      <Link
        ref={containerRef}
        href={localeHref(lang, `/work/${project.slug}/`)}
        className="group relative block aspect-[4/3] overflow-hidden bg-neutral-800"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {project.thumbnail && (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            priority={priority}
          />
        )}

        <div className="pointer-events-none absolute inset-0 transition-colors duration-200 group-hover:bg-black/35" />

        <span
          ref={labelRef}
          className={`pointer-events-none absolute top-0 left-0 z-10 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium uppercase tracking-tight text-white transition-opacity duration-200 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="inline-block rotate-45 text-accent" aria-hidden>
            &uarr;
          </span>
          {project.title}
        </span>
      </Link>
    </RevealOnScroll>
  );
}
