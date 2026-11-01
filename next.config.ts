import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Data is cached at runtime with per-source lifetimes ('use cache' + cacheLife), never frozen at build.
  cacheComponents: true,
};

export default nextConfig;
