import type { Metadata } from 'next';
import Home from '../components/Home';

export const metadata: Metadata = {
  title: 'DigiPowerX - Energy, Data Centers, and Bare-Metal GPU Compute',
  description: 'DigiPowerX owns and operates vertically integrated AI infrastructure — from owned power generation and high-density campuses to NeoCloudz bare-metal GPU clusters.',
  openGraph: {
    title: 'DigiPowerX - Energy, Data Centers, and Bare-Metal GPU Compute',
    description: 'DigiPowerX owns and operates vertically integrated AI infrastructure — from owned power generation and high-density campuses to NeoCloudz bare-metal GPU clusters.',
    type: 'website',
  },
};

export default function Page() {
  return <Home />;
}
