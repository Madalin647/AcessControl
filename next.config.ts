import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  basePath: "/AcessControl",
  assetPrefix: "/AcessControl/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
