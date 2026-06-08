import type { MetadataRoute } from 'next';
import { generateSlug } from '../utils/slugify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://digipowerx.com';

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/services',
    '/energy',
    '/data-centers',
    '/neocloudz',
    '/careers',
    '/sec-filings',
    '/leadership',
    '/press-releases',
    '/investors',
    '/documents-charters',
    '/privacy-policy',
    '/terms-of-use',
    '/email-alerts',
    '/mission-vision',
    '/global-network',
    '/partnership',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  let pressReleaseUrls: any[] = [];
  try {
    const res = await fetch('https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/press-releases?fields=title,documentId&pagination[pageSize]=100');
    if (res.ok) {
      const json = await res.json();
      pressReleaseUrls = (json.data || []).map((item: any) => {
        const slug = generateSlug(item.title, item.documentId);
        return {
          url: `${baseUrl}/press-releases/${slug}`,
          lastModified: new Date(item.date || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      });
    }
  } catch (e) {
    console.error('Failed to generate sitemap for press releases:', e);
  }

  let secFilingUrls: any[] = [];
  try {
    const res = await fetch('https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/sec-filings?fields=type,date,documentId&pagination[pageSize]=100');
    if (res.ok) {
      const json = await res.json();
      secFilingUrls = (json.data || []).map((item: any) => {
        const title = `${item.type || 'Filing'} Report`;
        const slug = generateSlug(title, item.documentId);
        return {
          url: `${baseUrl}/sec-filings/${slug}`,
          lastModified: new Date(item.date || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        };
      });
    }
  } catch (e) {
    console.error('Failed to generate sitemap for SEC filings:', e);
  }

  return [...staticPages, ...pressReleaseUrls, ...secFilingUrls];
}
