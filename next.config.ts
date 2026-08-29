import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every internal link in this project uses a trailing slash (matching the
  // reference site's URL style) — this avoids Next's default 308 redirect
  // from "/work/" to "/work".
  trailingSlash: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
