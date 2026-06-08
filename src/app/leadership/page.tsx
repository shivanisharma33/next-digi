import type { Metadata } from 'next';
import Leadership from '../../components/Leadership';

export const metadata: Metadata = {
  title: 'Leadership & Board of Directors | DigiPowerX',
  description: 'Meet the executive leadership team and Board of Directors guiding DigiPowerX’s mission to vertically integrate energy and high-density GPU computing.',
  openGraph: {
    title: 'Leadership & Board of Directors | DigiPowerX',
    description: 'Meet the executive leadership team and Board of Directors guiding DigiPowerX’s mission to vertically integrate energy and high-density GPU computing.',
  },
};

export default function Page() {
  return <Leadership />;
}
