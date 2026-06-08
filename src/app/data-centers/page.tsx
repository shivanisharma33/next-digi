import type { Metadata } from 'next';
import DataCenter from '../../components/DataCenter';

export const metadata: Metadata = {
  title: 'Data Centers | DigiPowerX - AI-Ready High-Density Facilities',
  description: 'DigiPowerX designs and operates high-density, liquid-cooled Tier III modular data centers engineered explicitly for GPU clusters and extreme compute efficiency.',
  openGraph: {
    title: 'Data Centers | DigiPowerX - AI-Ready High-Density Facilities',
    description: 'DigiPowerX designs and operates high-density, liquid-cooled Tier III modular data centers engineered explicitly for GPU clusters and extreme compute efficiency.',
  },
};

export default function Page() {
  return <DataCenter />;
}
