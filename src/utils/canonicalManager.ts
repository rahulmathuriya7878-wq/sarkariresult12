import { CANONICAL_DOMAIN } from './seoHelpers';

/**
 * Normalizes any URL or path to a clean, canonical URL:
 * - Strips trailing slashes (except root '/')
 * - Strips all tracking & query parameters (?utm_*, ?fbclid, ?ref, ?share, ?m=1)
 * - Strips URL hash fragments (#...)
 * - Enforces the primary production domain (https://sarkariresult12.vercel.app)
 */
export function getCleanCanonicalUrl(pathOrUrl?: string, customDomain?: string): string {
  const domain = (customDomain || CANONICAL_DOMAIN).replace(/\/+$/, '');

  if (!pathOrUrl) {
    if (typeof window !== 'undefined') {
      pathOrUrl = window.location.pathname;
    } else {
      pathOrUrl = '/';
    }
  }

  // Extract path part (strip query strings and hash)
  let cleanPath = pathOrUrl;
  try {
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      const parsed = new URL(pathOrUrl);
      cleanPath = parsed.pathname;
    } else {
      cleanPath = pathOrUrl.split('?')[0].split('#')[0];
    }
  } catch {
    cleanPath = pathOrUrl.split('?')[0].split('#')[0];
  }

  // Normalize path
  if (!cleanPath || cleanPath === '/' || cleanPath === '') {
    return `${domain}/`;
  }

  // Remove trailing slashes on sub-paths: e.g. /post/xyz/ -> /post/xyz
  cleanPath = cleanPath.replace(/\/+$/, '');
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }

  return `${domain}${cleanPath}`;
}

/**
 * Updates or injects the <link rel="canonical"> tag and <meta property="og:url">
 * in document.head to ensure 100% self-referential canonical compliance for Google Search Console.
 */
export function updateDocumentCanonical(pathOrUrl?: string, customDomain?: string): string {
  if (typeof document === 'undefined') return '';

  const canonicalUrl = getCleanCanonicalUrl(pathOrUrl, customDomain);

  // 1. Update <link rel="canonical">
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;

  // 2. Update <meta property="og:url">
  let ogUrlMeta = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
  if (!ogUrlMeta) {
    ogUrlMeta = document.createElement('meta');
    ogUrlMeta.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrlMeta);
  }
  ogUrlMeta.setAttribute('content', canonicalUrl);

  return canonicalUrl;
}
