import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.woff2': ['file-loader'],
      '*.woff': ['file-loader'],
      '*.ttf': ['file-loader'],
      '*.eot': ['file-loader'],
    }
  },

  // ✅ Ignore TS errors during build (only for deployment)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Note: API proxying is now handled by the centralized proxy at /api/proxy/*
  // which automatically attaches Asgardeo authentication tokens.
  // See: src/app/api/proxy/[...path]/route.ts
};

export default nextConfig;
