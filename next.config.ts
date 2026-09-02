import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every internal link uses a trailing slash; this avoids a 308 redirect
  // from "/work/" to "/work" on each navigation.
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" }, // seed data
      { protocol: "https", hostname: "img.youtube.com" }, // video thumbnails
    ],
  },
};

export default nextConfig;
