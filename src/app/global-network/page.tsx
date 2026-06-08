import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Network | DigiPowerX - Multi-region US Footprint',
  description: 'Explore our multi-region US footprint linked by diverse-path fiber backbone and unified operational control plane from grid to GPU.',
  openGraph: {
    title: 'Global Network | DigiPowerX - Multi-region US Footprint',
    description: 'Explore our multi-region US footprint linked by diverse-path fiber backbone and unified operational control plane from grid to GPU.',
  },
};

import GlobalNetwork from '../../components/GlobalNetwork';

export default function Page() {
  return <GlobalNetwork />;
}
