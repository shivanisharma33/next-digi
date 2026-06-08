import type { Metadata } from 'next';
import Careers from '../../components/Careers';

export const metadata: Metadata = {
  title: 'Careers | DigiPowerX - Join the Computational Grid',
  description: 'Join the team building the future of vertically integrated energy and high-density GPU computing. Explore open positions in engineering, operations, and security.',
  openGraph: {
    title: 'Careers | DigiPowerX - Join the Computational Grid',
    description: 'Join the team building the future of vertically integrated energy and high-density GPU computing. Explore open positions in engineering, operations, and security.',
  },
};

export default function Page() {
  return <Careers />;
}
