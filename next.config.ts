import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Data is cached at runtime with per-source lifetimes ('use cache' + cacheLife), never frozen at build.
  cacheComponents: true,
  experimental: {
    // The root layout lives under app/[locale], so unmatched URLs need app/global-not-found.tsx.
    globalNotFound: true,
  },
};

export default nextConfig;
