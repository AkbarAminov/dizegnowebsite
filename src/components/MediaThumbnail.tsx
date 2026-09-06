import Image from "next/image";
import { Play } from "lucide-react";
import type { FitMode, MediaType } from "@/lib/types";
import { youtubeThumbnail } from "@/lib/youtube";

// Fills its (relatively positioned) parent with an image, an animated gif
// or a YouTube preview. Used by the project gallery and the admin image list.
export function MediaThumbnail({
  src,
  type,
  alt,
  sizes,
  fitMode = "cover",
  priority = false,
  playIconSize = 40,
}: {
  src: string;
  type: MediaType;
  alt: string;
  sizes: string;
  fitMode?: FitMode;
  priority?: boolean;
  playIconSize?: number;
}) {
  if (type === "youtube") {
    return (
      <>
        <Image src={youtubeThumbnail(src)} alt={alt} fill sizes={sizes} className="object-cover" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <Play size={playIconSize} className="fill-white text-white" />
        </div>
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={fitMode === "contain" ? "object-contain" : "object-cover"}
      priority={priority}
      // Optimisation would strip the animation from a gif.
      unoptimized={type === "gif"}
    />
  );
}
