import type { Metadata } from 'next';
import PressRelease from '../../components/PressRelease';

export const metadata: Metadata = {
  title: 'Press Releases | DigiPowerX - Corporate News & Updates',
  description: 'Access the latest official press releases, newsroom updates, and corporate announcements from DigiPowerX Corporation.',
  openGraph: {
    title: 'Press Releases | DigiPowerX - Corporate News & Updates',
    description: 'Access the latest official press releases, newsroom updates, and corporate announcements from DigiPowerX Corporation.',
  },
};

export default function Page() {
  return <PressRelease />;
}
