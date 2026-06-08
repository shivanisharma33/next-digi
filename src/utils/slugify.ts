/**
 * Converts a string into a clean, URL-friendly slug.
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Dynamically generates a slug by combining a slugified title/description and the documentId.
 */
export function generateSlug(title: string, documentId: string): string {
  const safeTitle = slugify(title) || 'document';
  return `${safeTitle}-${documentId}`;
}

/**
 * Extracts the 24-character alphanumeric documentId from the end of a slug.
 */
export function extractDocumentId(slug: string): string {
  if (!slug) return '';
  const parts = slug.split('-');
  return parts[parts.length - 1] || '';
}
