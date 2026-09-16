import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const PARTNERS_DIR = path.join(process.cwd(), "public/partners");
const IMAGE_EXTENSIONS = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp"]);

// Reads whatever logo files are actually in public/partners at build time —
// drop a file in, it shows up, no code change needed. Sorted by filename,
// so a "01-", "02-" prefix controls the order if that matters.
function getPartnerLogos(): string[] {
  let files: string[];
  try {
    files = fs.readdirSync(PARTNERS_DIR);
  } catch {
    return [];
  }
  return files.filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())).sort((a, b) => a.localeCompare(b));
}

// "01-north-star.svg" -> "north star": drop the extension and any leading
// order-prefix, then turn separators into spaces for the alt text.
function labelFromFilename(file: string): string {
  return path
    .basename(file, path.extname(file))
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export function PartnersMarquee({ label }: { label: string }) {
  const logos = getPartnerLogos();
  if (logos.length === 0) return null;

  // Doubled so the strip can loop seamlessly at exactly -50%; longer lists
  // get a proportionally longer loop so the scroll speed stays consistent.
  const track = [...logos, ...logos];
  const durationSeconds = Math.max(20, logos.length * 4);

  return (
    // No visible heading by design; the label is kept for screen readers so
    // the strip still announces what it is.
    <section aria-label={label}>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-16" style={{ animationDuration: `${durationSeconds}s` }}>
          {track.map((file, i) => (
            <div
              key={`${file}-${i}`}
              className="relative h-16 w-[166px] shrink-0 md:h-[74px] md:w-[202px]"
              aria-hidden={i >= logos.length}
            >
              <Image
                src={`/partners/${file}`}
                alt={i < logos.length ? labelFromFilename(file) : ""}
                fill
                sizes="200px"
                className="object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                unoptimized={file.toLowerCase().endsWith(".svg")}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
