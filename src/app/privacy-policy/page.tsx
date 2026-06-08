import type { Metadata } from 'next';
import PrivacyPolicy from '../../components/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy | DigiPowerX',
  description: 'Read the privacy policy details for DigiPowerX. Learn how we collect, use, protect, and disclose your operational and user information.',
  openGraph: {
    title: 'Privacy Policy | DigiPowerX',
    description: 'Read the privacy policy details for DigiPowerX. Learn how we collect, use, protect, and disclose your operational and user information.',
  },
};

export default function Page() {
  return <PrivacyPolicy />;
}
