import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@maptiler/sdk': require.resolve('@maptiler/sdk'),
    };
    return config;
  },
};

export default nextConfig;
