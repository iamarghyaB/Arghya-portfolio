import type { NextConfig } from 'next';

const config: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  agentRules: false,
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
};

export default config;
