import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: '/front_end',
};

export default nextConfig;