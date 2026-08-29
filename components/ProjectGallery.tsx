"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Play } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { getCardSpanClass } from "@/lib/gridLayout";
import { getYoutubeThumbnail } from "@/lib/youtube";

// Code-split out of the initial project-page bundle — most visitors
// never open the lightbox, so its own module (cursor tracking, zone
// detection, nav logic) shouldn't have to load before the gallery grid
// itself is interactive.
const Lightbox = dynamic(() => import("./Lightbox").then((mod) => mod.Lightbox), {
  ssr: false,
});

// `grid-auto-flow: dense` + position-based col/row-span (lib/gridLayout.ts,
// shapes limited to 1x1/2x1/1x2/2x2) — previously this ran on
// react-masonry-css with each tile sized to its image's own aspect
// ratio, but a column-based masonry library can't produce a tile wider
// than one column, so "wide" tiles weren't possible here at all. Capped
// at 2 columns (never 3) to keep gallery tiles larger than the homepage
// grid's, matching the original masonry's `default: 2` column count.
export function ProjectGallery({ images, alt }: { images: GalleryImage[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 px-5 [grid-auto-flow:dense] auto-rows-[45vw] sm:auto-rows-[32vw] sm:grid-cols-2 sm:gap-4 md:px-8 lg:auto-rows-[clamp(180px,22vw,260px)] lg:gap-5">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`group relative block overflow-hidden bg-neutral-800 ${getCardSpanClass(i)}`}
          >
            {image.type === "youtube" ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail, not a next.config remote pattern */}
                <img
                  src={getYoutubeThumbnail(image.src)}
                  alt={`${alt} — video ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={i < 2 ? undefined : "lazy"}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play size={40} className="fill-white text-white" />
                </div>
              </>
            ) : image.type === "gif" ? (
              // eslint-disable-next-line @next/next/no-img-element -- next/image would strip gif animation
              <img
                src={image.src}
                alt={`${alt} — image ${i + 1}`}
                className={`absolute inset-0 h-full w-full ${
                  image.fitMode === "contain" ? "object-contain" : "object-cover"
                }`}
                loading={i < 2 ? undefined : "lazy"}
              />
            ) : (
              <Image
                src={image.src}
                alt={`${alt} — image ${i + 1}`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className={image.fitMode === "contain" ? "object-contain" : "object-cover"}
                loading={i < 2 ? undefined : "lazy"}
                priority={i < 2}
              />
            )}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
              <span className="text-sm font-medium uppercase tracking-tight text-white">
                View
              </span>
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
