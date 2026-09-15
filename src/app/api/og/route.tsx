import { ImageResponse } from "next/og";
import { LOCKUP_PATHS, LOGO_VIEWBOX, WORDMARK_PATHS } from "@/lib/logoPaths";
import { OG_IMAGE } from "@/lib/seo";

// Default share card (Open Graph / Twitter): the wordmark on the site's
// charcoal. Rendered once at build time. Text is Latin-only on purpose —
// the built-in font has no Cyrillic, and the card is the same for every locale.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#141414",
          color: "#ffffff",
        }}
      >
        <svg viewBox={LOGO_VIEWBOX} width={880} height={113}>
          {WORDMARK_PATHS.map((d, i) => (
            <path key={i} d={d} fill="#ffffff" />
          ))}
          {LOCKUP_PATHS.map((d, i) => (
            <path key={i} d={d} fill="#f0e10c" />
          ))}
        </svg>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            letterSpacing: -0.5,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span>IDENTITY · STRATEGY · PACKAGING</span>
          <span>TASHKENT · DIZEGNOAGENCY.COM</span>
        </div>
      </div>
    ),
    { width: OG_IMAGE.width, height: OG_IMAGE.height }
  );
}
