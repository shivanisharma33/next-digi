import type { Metadata } from 'next';
import Services from '../../components/Services';

export const metadata: Metadata = {
  title: 'Our Services | DigiPowerX - High-Density AI Infrastructure',
  description: 'Explore our services including high-density data center colocation, power infrastructure access, and NeoCloudz bare-metal GPU clusters.',
  openGraph: {
    title: 'Our Services | DigiPowerX - High-Density AI Infrastructure',
    description: 'Explore our services including high-density data center colocation, power infrastructure access, and NeoCloudz bare-metal GPU clusters.',
  },
};

export default function Page() {
  return <Services />;
}
