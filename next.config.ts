import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hq4kwe0qszgc9vxs.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
