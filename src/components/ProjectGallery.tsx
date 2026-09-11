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

// A row's height is derived from its images' own aspect ratios (see
// justified-row math below) but is capped here so a row of narrow/tall
// images never balloons into a giant block — object-fit: cover on the
// image absorbs the difference by center-cropping, nothing gets distorted.
const MAX_ROW_HEIGHT = "min(68vh, 620px)";

// Rows of 2 by default. An odd count would otherwise strand a single image
// on the last row, so that trailing row-of-2 plus the leftover single image
// become one row of 3 instead: 5 -> 2+3, 7 -> 2+2+3, 9 -> 2+2+2+3. A total
// of 1 or 2 is just its own row (nothing to redistribute).
function groupIntoRows<T>(items: T[]): T[][] {
  const n = items.length;
  if (n === 0) return [];
  if (n <= 2) return [items];
  const sizes = n % 2 === 0 ? Array(n / 2).fill(2) : [...Array((n - 3) / 2).fill(2), 3];
  const rows: T[][] = [];
  let cursor = 0;
  for (const size of sizes) {
    rows.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  return rows;
}

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
  const rows = groupIntoRows(images.map((image, index) => ({ image, index })));

  return (
    <>
      <div className="mt-3 flex flex-col gap-3 px-5 sm:mt-4 sm:gap-4 md:px-8 lg:mt-5 lg:gap-5">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-3 sm:gap-4 lg:gap-5">
            {row.map(({ image, index }) => {
              // Every image in a row shares one target height; giving each
              // tile flex-grow equal to its own aspect ratio (width/height,
              // with flex-basis 0) makes the browser distribute the row's
              // width so that shared height falls out automatically — a
              // wide image naturally claims more width than a narrow one,
              // and the row always sums to exactly 100%.
              const ratio = image.width / image.height;
              return (
                <RevealOnScroll
                  key={image.src}
                  delay={Math.min(index * 0.05, 0.35)}
                  className="min-w-0 overflow-hidden bg-neutral-800"
                  style={{ flexGrow: ratio, flexBasis: 0, aspectRatio: `${ratio}`, maxHeight: MAX_ROW_HEIGHT }}
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
                      sizes="(min-width: 640px) 50vw, 100vw"
                      priority={index < 2}
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                      <span className="text-sm font-medium uppercase tracking-tight text-white">{dict.view}</span>
                    </div>
                  </button>
                </RevealOnScroll>
              );
            })}
          </div>
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
