/**
 * Utility functions for URL sanitization and preventing double-link / duplicate protocol issues.
 */

/**
 * Clean and sanitize a URL string by stripping duplicate protocol prefixes,
 * nested base URLs, double slashes, and redundant query/hash parameters.
 */
export function sanitizeUrl(rawUrl?: string): string {
  if (!rawUrl) return 'https://sarkariresult12.vercel.app/#';

  let clean = rawUrl.trim();

  // 1. Handle nested/double URLs like "https://domain.comhttps://other.com" or "https://nta.ac.in//https://jeemain.nta.nic.in/"
  const protocolMatches = clean.match(/https?:\/\/[^\s]+/gi);
  if (protocolMatches && protocolMatches.length > 1) {
    clean = protocolMatches[protocolMatches.length - 1];
  }

  // 2. Fix duplicated protocol prefixes e.g. "https://https://" or "http://https://"
  clean = clean.replace(/^(https?:\/\/)+/gi, 'https://');

  // 3. Fix double domain concatenation e.g. "https://sarkariresult12.vercel.app/https://sarkariresult12.vercel.app/..."
  const canonicalBase = 'https://sarkariresult12.vercel.app';
  if (clean.indexOf(canonicalBase) !== clean.lastIndexOf(canonicalBase)) {
    clean = clean.substring(clean.lastIndexOf(canonicalBase));
  }

  // 4. Clean trailing/duplicated slashes after domain (except protocol)
  clean = clean.replace(/(https?:\/\/[^\/]+)\/\/+/g, '$1/');

  return clean;
}

/**
 * Formats a clean share link for a post, ensuring no double hashes or duplicate params.
 */
export function getCleanShareUrl(postSlugOrId?: string, domain: string = 'https://sarkariresult12.vercel.app'): string {
  const base = domain.replace(/\/+$/, '');
  if (!postSlugOrId) {
    return `${base}/?ref=share`;
  }
  return `${base}/#post/${postSlugOrId}?ref=share`;
}

/**
 * Deduplicates an array of link items by label and sanitized URL to eliminate double link rows.
 */
export function deduplicateLinks<T extends { label?: string; url?: string }>(links: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of links) {
    const cleanUrlStr = item.url ? sanitizeUrl(item.url) : '';
    const normLabel = (item.label || '').trim().toLowerCase();
    const key = `${normLabel}::${cleanUrlStr}`;

    if (!seen.has(key)) {
      seen.add(key);
      result.push({
        ...item,
        url: cleanUrlStr || item.url
      });
    }
  }

  return result;
}
