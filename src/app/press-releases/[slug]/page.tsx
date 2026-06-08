import type { Metadata } from 'next';
import PressReleaseDetailPage from '../../../components/PressReleaseDetailPage';
import { extractDocumentId } from '../../../utils/slugify';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const documentId = extractDocumentId(slug);
  if (!documentId) {
    return {
      title: 'Press Release Detail | DigiPowerX',
    };
  }

  try {
    const res = await fetch(`https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/press-releases/${documentId}`);
    if (!res.ok) throw new Error();
    const json = await res.json();
    const release = json.data;
    if (!release) throw new Error();

    const title = `${release.title} | DigiPowerX Press Release`;
    const desc = release.content ? release.content.slice(0, 160).replace(/\s+/g, ' ').trim() + '...' : 'Read the official DigiPowerX Press Release.';

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
      title: 'Press Release Detail | DigiPowerX',
      description: 'Read the official press release for DigiPowerX Corporation.',
    };
  }
}

export default function Page() {
  return <PressReleaseDetailPage />;
}
