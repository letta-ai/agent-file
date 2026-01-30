/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // Empty turbopack config to silence webpack vs turbopack warning
  turbopack: {},
  images: {
    // Disable image optimization for local images to avoid issues with @ in paths
    unoptimized: true,
  },
};

module.exports = nextConfig;
