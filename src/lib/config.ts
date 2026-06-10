/**
 * Centralized runtime configuration.
 *
 * Prefer environment variables so the app can be pointed at staging/prod
 * (or a migrated CMS) without code changes. The literals below are fallbacks
 * that preserve the current production behaviour when the vars are unset.
 */

/** Base origin of the Strapi CMS that serves press releases, filings, etc. */
export const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://thankful-miracle-1ed8bdfdaf.strapiapp.com'
).replace(/\/$/, '');

/** Canonical public site origin (apex, no trailing slash). Used for SEO/metadata. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://digipowerx.com'
).replace(/\/$/, '');
