import type { Metadata } from 'next';
import DocumentsCharters from '../../components/DocumentsCharters';

export const metadata: Metadata = {
  title: 'Documents & Charters | DigiPowerX - Corporate Governance',
  description: 'Access the official corporate governance documents, charters, committee mandates, and compliance records for DigiPowerX.',
  openGraph: {
    title: 'Documents & Charters | DigiPowerX - Corporate Governance',
    description: 'Access the official corporate governance documents, charters, committee mandates, and compliance records for DigiPowerX.',
  },
};

export default function Page() {
  return <DocumentsCharters />;
}
