import type { Metadata } from 'next';
import SECFilings from '../../components/SECFilings';

export const metadata: Metadata = {
  title: 'SEC Filings | DigiPowerX - Investor Relations',
  description: 'Access the latest SEC filings, financial reports, and regulatory documentation for DigiPowerX Corporation (NASDAQ: DGXX).',
  openGraph: {
    title: 'SEC Filings | DigiPowerX - Investor Relations',
    description: 'Access the latest SEC filings, financial reports, and regulatory documentation for DigiPowerX Corporation (NASDAQ: DGXX).',
  },
};

export default function Page() {
  return <SECFilings />;
}
