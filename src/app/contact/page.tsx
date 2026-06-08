import type { Metadata } from 'next';
import Contact from '../../components/Contact';

export const metadata: Metadata = {
  title: 'Contact Us | DigiPowerX - Vertically Integrated Infrastructure',
  description: 'Get in touch with the DigiPowerX team to discuss AI high-density data center colocation, power capacity, or GPU compute requirements.',
  openGraph: {
    title: 'Contact Us | DigiPowerX - Vertically Integrated Infrastructure',
    description: 'Get in touch with the DigiPowerX team to discuss AI high-density data center colocation, power capacity, or GPU compute requirements.',
  },
};

export default function Page() {
  return <Contact />;
}
