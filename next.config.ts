import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      '@react-three/drei',
    ],
  },
  async redirects() {
    return [
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/data-center', destination: '/data-centers', permanent: true },
      { source: '/infrastructure', destination: '/energy', permanent: true },
      { source: '/press-release', destination: '/press-releases', permanent: true },
      { source: '/news', destination: '/press-releases', permanent: true },
      { source: '/newsroom', destination: '/press-releases', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-of-use', permanent: true },
      { source: '/terms-of-service', destination: '/terms-of-use', permanent: true },
      { source: '/careers-at-digipowerx', destination: '/careers', permanent: true },
      { source: '/jobs', destination: '/careers', permanent: true },
      { source: '/leadership-team', destination: '/leadership', permanent: true },
      { source: '/team', destination: '/leadership', permanent: true },
      { source: '/sec-filing', destination: '/sec-filings', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thankful-miracle-1ed8bdfdaf.strapiapp.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
