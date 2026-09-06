"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { GalleryImage } from "@/lib/types";
import { MediaThumbnail } from "./MediaThumbnail";

// Most visitors never open the lightbox, so it is split out of the page bundle.
const Lightbox = dynamic(() => import("./Lightbox").then((mod) => mod.Lightbox), { ssr: false });

// Deterministic, position-based tile sizes (1x1, 2x1, 1x2, 2x2) so server
// and client markup match and the collage looks the same for any list length.
const TALL = [false, true, false, false, true, false, true];
const WIDE = [false, true, false, false, true];

function tileClass(index: number) {
  // Wide tiles only apply from `sm` up; below that the grid is one column.
  const wide = WIDE[index % WIDE.length] ? "sm:col-span-2" : "col-span-1";
  const tall = TALL[index % TALL.length] ? "row-span-2" : "row-span-1";
  return `${wide} ${tall}`;
}

export function ProjectGallery({ images, alt }: { images: GalleryImage[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-3 grid grid-cols-1 gap-3 px-5 [grid-auto-flow:dense] sm:mt-4 lg:mt-5 auto-rows-[45vw] sm:auto-rows-[32vw] sm:grid-cols-2 sm:gap-4 md:px-8 lg:auto-rows-[clamp(180px,22vw,260px)] lg:gap-5">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Open ${image.type === "youtube" ? "video" : "image"} ${i + 1}`}
            className={`group relative block overflow-hidden bg-neutral-800 ${tileClass(i)}`}
          >
            <MediaThumbnail
              src={image.src}
              type={image.type}
              fitMode={image.fitMode}
              alt={`${alt} — ${i + 1}`}
              sizes="(min-width: 640px) 50vw, 100vw"
              priority={i < 2}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
              <span className="text-sm font-medium uppercase tracking-tight text-white">View</span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            images={images}
            index={openIndex}
            alt={alt}
            onClose={() => setOpenIndex(null)}
            onNavigate={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}
