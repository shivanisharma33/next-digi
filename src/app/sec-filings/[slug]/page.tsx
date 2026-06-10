import type { Metadata } from 'next';
import FilingDetailPage from '../../../components/FilingDetailPage';
import { extractDocumentId } from '../../../utils/slugify';
import { STRAPI_URL } from '../../../lib/config';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const documentId = extractDocumentId(slug);
  if (!documentId) {
    return {
      title: 'SEC Filing Detail | DigiPowerX',
    };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/sec-filings/${documentId}`);
    if (!res.ok) throw new Error();
    const json = await res.json();
    const filing = json.data;
    if (!filing) throw new Error();

    const formType = filing.type || filing.form_type || 'Filing';
    const title = `${formType} - SEC Filing Detail | DigiPowerX`;
    const desc = filing.description || `Read the official ${formType} SEC filing for DigiPowerX Corporation.`;

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
      },
    };
  } catch (e) {
    return {
      title: 'SEC Filing Detail | DigiPowerX',
      description: 'Read the official SEC filing for DigiPowerX Corporation.',
    };
  }
}

export default function Page() {
  return <FilingDetailPage />;
}
