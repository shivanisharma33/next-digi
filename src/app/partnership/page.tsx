import type { Metadata } from 'next';
import Partnership from '../../components/Partnership';

export const metadata: Metadata = {
  title: 'Partnerships | DigiPowerX - Scaling Digital Infrastructure',
  description: 'Collaborate with DigiPowerX to co-sell, integrate, and scale advanced high-density computing and energy solutions.',
  openGraph: {
    title: 'Partnerships | DigiPowerX - Scaling Digital Infrastructure',
    description: 'Collaborate with DigiPowerX to co-sell, integrate, and scale advanced high-density computing and energy solutions.',
  },
};

export default function Page() {
  return <Partnership />;
}
