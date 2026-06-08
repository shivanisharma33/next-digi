import type { Metadata } from 'next';
import Infrastructure from '../../components/Infrastructure';

export const metadata: Metadata = {
  title: 'Energy Infrastructure | DigiPowerX - Controlled Power Generation',
  description: 'DigiPowerX owns and operates high-density energy generation assets and substations, providing dedicated behind-the-meter energy for scalable AI computing.',
  openGraph: {
    title: 'Energy Infrastructure | DigiPowerX - Controlled Power Generation',
    description: 'DigiPowerX owns and operates high-density energy generation assets and substations, providing dedicated behind-the-meter energy for scalable AI computing.',
  },
};

export default function Page() {
  return <Infrastructure />;
}
