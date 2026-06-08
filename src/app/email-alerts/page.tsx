import type { Metadata } from 'next';
import EmailAlerts from '../../components/EmailAlerts';

export const metadata: Metadata = {
  title: 'Email Alerts | DigiPowerX',
  description: 'Subscribe to receive real-time email disclosures, financial statements, and regulatory updates from DigiPowerX Corporation.',
  openGraph: {
    title: 'Email Alerts | DigiPowerX',
    description: 'Subscribe to receive real-time email disclosures, financial statements, and regulatory updates from DigiPowerX Corporation.',
  },
};

export default function Page() {
  return <EmailAlerts />;
}
