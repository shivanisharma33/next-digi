import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
    ],
  },
  async redirects() {
    return [
      // Canonicalize www → apex so SEO signals aren't split across two hosts.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.digipowerx.com' }],
        destination: 'https://digipowerx.com/:path*',
        permanent: true,
      },
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
  async headers() {
    // Baseline security headers applied to every response. A full
    // Content-Security-Policy is intentionally omitted: the site relies on
    // inline <style> blocks and WebGL, so a strict CSP needs dedicated testing
    // before it can be enabled without breaking pages.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
