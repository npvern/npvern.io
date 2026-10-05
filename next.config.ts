import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Poster frames for embedded YouTube demo videos.
    remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
  },
};

export default nextConfig;
