"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { useLockBodyScroll } from "./useLockBodyScroll";

// The whole overlay is the control surface: left third = previous, right
// third = next, middle = close. A custom cursor shows which zone is active.
type Zone = "prev" | "close" | "next";

const ZONE_ICON: Record<Zone, string> = { prev: "←", close: "×", next: "→" };

function zoneAt(clientX: number, rect: DOMRect): Zone {
  const relative = (clientX - rect.left) / rect.width;
  if (relative < 1 / 3) return "prev";
  if (relative > 2 / 3) return "next";
  return "close";
}

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
  const hasMany = images.length > 1;

  useLockBodyScroll(true);

  const goPrev = useCallback(() => {
    setDirection(-1);
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const goNext = useCallback(() => {
    setDirection(1);
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext]);

  function zoneForEvent(event: React.MouseEvent): Zone | null {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return hasMany ? zoneAt(event.clientX, rect) : "close";
  }

  function handleMouseMove(event: React.MouseEvent) {
    setZone(zoneForEvent(event));
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    }
  }

  function handleClick(event: React.MouseEvent) {
    const clicked = zoneForEvent(event);
    if (clicked === "prev") goPrev();
    else if (clicked === "next") goNext();
    else onClose();
  }

  const image = images[index];

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex cursor-none items-center justify-center bg-black/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setZone(null)}
      onClick={handleClick}
    >
      {hasMany && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-sm uppercase tracking-tight text-white/60">
          {index + 1} / {images.length}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          // A video needs real pointer events to be playable; images let
          // clicks fall through to the zone navigation.
          className={`relative h-[80vh] w-[85vw] ${
            image.type === "youtube" ? "pointer-events-auto" : "pointer-events-none"
          }`}
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
          ) : (
            <Image
              src={image.src}
              alt={alt}
              fill
              sizes="85vw"
              className="object-contain"
              priority
              unoptimized={image.type === "gif"}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div
        ref={cursorRef}
        className={`pointer-events-none fixed top-0 left-0 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl leading-none text-black transition-opacity duration-200 ${
          zone ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        {zone ? ZONE_ICON[zone] : ""}
      </div>
    </motion.div>
  );
}
