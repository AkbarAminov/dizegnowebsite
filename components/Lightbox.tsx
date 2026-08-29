"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";

type Zone = "prev" | "close" | "next";

function getZone(clientX: number, rect: DOMRect): Zone {
  const relX = (clientX - rect.left) / rect.width;
  if (relX < 1 / 3) return "prev";
  if (relX > 2 / 3) return "next";
  return "close";
}

const ZONE_ICON: Record<Zone, string> = { prev: "←", close: "×", next: "→" };

export function Lightbox({
  images,
  index,
  alt,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number;
  alt: string;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const [zone, setZone] = useState<Zone | null>(null);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const goPrev = useCallback(() => {
    setDirection(-1);
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const goNext = useCallback(() => {
    setDirection(1);
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZone(images.length > 1 ? getZone(e.clientX, rect) : "close");
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }
  }

  function handleClick(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clicked = images.length > 1 ? getZone(e.clientX, rect) : "close";
    if (clicked === "prev") goPrev();
    else if (clicked === "next") goNext();
    else onClose();
  }

  const image = images[index];

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
      style={{ cursor: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setZone(null)}
      onClick={handleClick}
    >
      {images.length > 1 && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-sm uppercase tracking-tight text-white/60">
          {index + 1} / {images.length}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={index}
          // YouTube needs real pointer events to be playable at all — the
          // surrounding backdrop is still large enough for zone-based
          // prev/next/close clicks around it. Image/gif stay
          // pointer-events-none so clicks fall through to the zone
          // navigation as before.
          className={`relative h-[80vh] w-[85vw] ${
            image.type === "youtube" ? "pointer-events-auto" : "pointer-events-none"
          }`}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {image.type === "youtube" ? (
            <iframe
              src={image.src}
              title={alt}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : image.type === "gif" ? (
            // eslint-disable-next-line @next/next/no-img-element -- next/image would strip gif animation
            <img src={image.src} alt={alt} className="h-full w-full object-contain" />
          ) : (
            <Image
              src={image.src}
              alt={alt}
              fill
              sizes="85vw"
              className="object-contain"
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div
        ref={cursorRef}
        className={`pointer-events-none fixed top-0 left-0 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0e10c] text-xl leading-none text-black transition-opacity duration-200 ${
          zone ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        {zone ? ZONE_ICON[zone] : ""}
      </div>
    </motion.div>
  );
}
