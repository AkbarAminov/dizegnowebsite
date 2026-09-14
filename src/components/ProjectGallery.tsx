"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { GalleryImage } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import { MediaThumbnail } from "./MediaThumbnail";
import { RevealOnScroll } from "./RevealOnScroll";

// Most visitors never open the lightbox, so it is split out of the page bundle.
const Lightbox = dynamic(() => import("./Lightbox").then((mod) => mod.Lightbox), { ssr: false });

export function ProjectGallery({
  images,
  alt,
  dict,
}: {
  images: GalleryImage[];
  alt: string;
  dict: Dictionary["gallery"];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* Uniform two-up grid — every tile the same size, so the grid stays
          perfectly even regardless of each image's own aspect ratio. One
          column below lg (tablet and phone), two columns from lg up. */}
      <div className="mt-3 grid grid-cols-1 gap-3 px-5 sm:mt-4 sm:gap-4 md:px-8 lg:mt-5 lg:grid-cols-2 lg:gap-5">
        {images.map((image, index) => (
          <RevealOnScroll
            key={image.src}
            delay={Math.min(index * 0.05, 0.35)}
            className="aspect-[4/3] overflow-hidden bg-neutral-800"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`${image.type === "youtube" ? dict.openVideo : dict.openImage} ${index + 1}`}
              className="group relative block h-full w-full"
            >
              <MediaThumbnail
                src={image.src}
                type={image.type}
                fitMode={image.fitMode}
                alt={`${alt} — ${index + 1}`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={index < 2}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                <span className="text-sm font-medium uppercase tracking-tight text-white">{dict.view}</span>
              </div>
            </button>
          </RevealOnScroll>
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
