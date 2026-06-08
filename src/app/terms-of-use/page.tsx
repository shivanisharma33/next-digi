import type { Metadata } from 'next';
import TermsOfUse from '../../components/TermsOfUse';

export const metadata: Metadata = {
  title: 'Terms of Use | DigiPowerX',
  description: 'Read the terms of use agreement for accessing and using DigiPowerX services, platforms, and official web portals.',
  openGraph: {
    title: 'Terms of Use | DigiPowerX',
    description: 'Read the terms of use agreement for accessing and using DigiPowerX services, platforms, and official web portals.',
  },
};

export default function Page() {
  return <TermsOfUse />;
}
