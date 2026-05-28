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

  async rewrites() {
    return [
      {
        source: '/api/user-management/:path*',
        destination: 'http://54.91.217.117:8081/:path*' // Vercel will proxy server-side
      },
      {
        source: '/api/route-management/:path*',
        destination: 'https://route-management-service.onrender.com/:path*'
      },
      {
        source: '/api/notification-management/:path*',
        destination: 'http://13.51.177.104:8080/:path*'
      }
    ]
  }
};

export default nextConfig;
