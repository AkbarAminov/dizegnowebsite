import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every internal link uses a trailing slash; this avoids a 308 redirect
  // from "/work/" to "/work" on each navigation.
  trailingSlash: true,
  images: {
    // Any quality an <Image> asks for must be listed here, or Next falls
    // back to the default 75. Project covers and gallery tiles use 90.
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" }, // seed data
      { protocol: "https", hostname: "img.youtube.com" }, // video thumbnails
    ],
  },
};

export default nextConfig;
