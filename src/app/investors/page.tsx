import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investor Relations | DigiPowerX',
  description: 'Explore market metrics, stock performance charts, financial disclosures, and corporate governance resources for DigiPowerX Corporation (NASDAQ: DGXX).',
  openGraph: {
    title: 'Investor Relations | DigiPowerX',
    description: 'Explore market metrics, stock performance charts, financial disclosures, and corporate governance resources for DigiPowerX Corporation (NASDAQ: DGXX).',
  },
};

import InvestorRelations from '../../components/InvestorRelations';

export default function Page() {
  return <InvestorRelations />;
}
