import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID + '.ufs.sh',
        pathname: '/f/*',
      },
    ],
  },
};

export default nextConfig;
