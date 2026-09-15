import { ImageResponse } from "next/og";
import { WORDMARK_PATHS } from "@/lib/logoPaths";

// Home-screen / bookmark icon: the "D" of the wordmark in the accent colour.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
        }}
      >
        <svg viewBox="0 0 110.6 147.26" width={84} height={112}>
          <path d={WORDMARK_PATHS[0]} fill="#f0e10c" />
        </svg>
      </div>
    ),
    size
  );
}
