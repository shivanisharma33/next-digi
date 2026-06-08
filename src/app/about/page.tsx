import type { Metadata } from 'next';
import About from '../../components/About';

export const metadata: Metadata = {
  title: 'About Us | DigiPowerX - Vertically Integrated Infrastructure',
  description: 'Learn about DigiPowerX, a vertically integrated AI infrastructure company controlling power, data centers, and GPU compute across the U.S.',
  openGraph: {
    title: 'About Us | DigiPowerX - Vertically Integrated Infrastructure',
    description: 'Learn about DigiPowerX, a vertically integrated AI infrastructure company controlling power, data centers, and GPU compute across the U.S.',
  },
};

export default function Page() {
  return <About />;
}
