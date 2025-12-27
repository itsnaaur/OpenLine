import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix workspace root detection - explicitly set to current directory
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
