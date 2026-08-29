"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

// Shared grid card, reused by WorkGrid and RelatedProjectsGrid — both
// plain uniform grids, so `aspectClass` just carries a fixed ratio.
export function WorkGridItem({
  project,
  priority = false,
  aspectClass = "aspect-[4/3]",
}: {
  project: Project;
  priority?: boolean;
  aspectClass?: string;
}) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  // Label follows the pointer via direct DOM writes on the ref (not
  // React state) so it tracks every pixel of mouse movement without a
  // re-render per event. The label itself stays permanently mounted —
  // only its opacity toggles — otherwise the ref wouldn't exist yet on
  // the very first mousemove that reveals it (classic mount-order race).
  // Horizontal position tracks the cursor; vertical is pinned a fixed
  // ~8px above it (translate(-50%,-100%) lifts the label by its own
  // height so its bottom edge sits at that point, not its top).
  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !labelRef.current) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    labelRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%) translateY(-8px)`;
  }

  return (
    <Link
      ref={containerRef}
      href={`/work/${project.slug}/`}
      className={`group relative block overflow-hidden bg-neutral-800 ${aspectClass}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        loading={priority ? undefined : "lazy"}
        priority={priority}
      />

      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/35" />

      <span
        ref={labelRef}
        className={`pointer-events-none absolute top-0 left-0 z-10 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium uppercase tracking-tight text-white transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="inline-block rotate-45 text-[#f0e10c]" aria-hidden>
          &uarr;
        </span>
        {project.title}
      </span>
    </Link>
  );
}
