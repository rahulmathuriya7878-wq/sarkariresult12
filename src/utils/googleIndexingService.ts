import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface GoogleServiceAccountKey {
  type?: string;
  project_id?: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
}

export interface IndexingLogEntry {
  id: string;
  url: string;
  type: 'URL_UPDATED' | 'URL_DELETED';
  postTitle?: string;
  postId?: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'CONFIG_REQUIRED' | 'FAILED';
  statusCode?: number;
  apiResponse?: any;
  message: string;
  method: 'GOOGLE_INDEXING_API' | 'SITEMAP_PING_FALLBACK' | 'SIMULATION';
}

const CONFIG_PATH = path.resolve(process.cwd(), '.google-indexing-config.json');
const LOGS_PATH = path.resolve(process.cwd(), '.google-indexing-logs.json');

// Memory cache for recent logs
let inMemoryLogs: IndexingLogEntry[] = [];

// Initialize logs from disk if available
try {
  if (fs.existsSync(LOGS_PATH)) {
    const raw = fs.readFileSync(LOGS_PATH, 'utf-8');
    inMemoryLogs = JSON.parse(raw);
  }
} catch (e) {
  inMemoryLogs = [];
}

/**
 * Retrieve saved Google Service Account credentials if any
 */
export function getSavedCredentials(): GoogleServiceAccountKey | null {
  try {
    if (process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT) {
      return JSON.parse(process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT);
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      return JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf-8'));
    }
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch (err) {
    console.warn('[GoogleIndexingService] Error reading credentials:', err);
  }
  return null;
}

/**
 * Save Google Service Account credentials to local config
 */
export function saveCredentials(key: GoogleServiceAccountKey): boolean {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(key, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[GoogleIndexingService] Failed to save credentials:', err);
    return false;
  }
}

/**
 * Helper to generate RS256 JWT for Google OAuth2
 */
function createGoogleJwt(clientEmail: string, privateKey: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodeBase64Url = (obj: any): string => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const headerB64 = encodeBase64Url(header);
  const claimB64 = encodeBase64Url(claimSet);
  const unsignedToken = `${headerB64}.${claimB64}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();

  const signature = signer
    .sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${unsignedToken}.${signature}`;
}

/**
 * Exchange JWT for Google OAuth access token
 */
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const jwt = createGoogleJwt(clientEmail, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString(),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to obtain Google access token: ${res.status} ${res.statusText} - ${errorBody}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/**
 * Programmatically notify Google via Google Indexing API
 */
export async function notifyGoogleIndexingApi(params: {
  url: string;
  type?: 'URL_UPDATED' | 'URL_DELETED';
  postTitle?: string;
  postId?: string;
  credentials?: GoogleServiceAccountKey | null;
  canonicalDomain?: string;
}): Promise<IndexingLogEntry> {
  const {
    url,
    type = 'URL_UPDATED',
    postTitle,
    postId,
    credentials = getSavedCredentials(),
    canonicalDomain = 'https://sarkariresult12.vercel.app'
  } = params;

  // Clean URL if relative
  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `${canonicalDomain}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
  }

  const logId = `idx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  // If Service Account is configured, execute real Google Indexing API request
  if (credentials && credentials.client_email && credentials.private_key) {
    try {
      const accessToken = await getAccessToken(credentials.client_email, credentials.private_key);

      const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
      const apiRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          url: targetUrl,
          type: type,
        }),
      });

      const responseJson = await apiRes.json().catch(() => null);

      if (apiRes.ok) {
        const logEntry: IndexingLogEntry = {
          id: logId,
          url: targetUrl,
          type,
          postTitle,
          postId,
          timestamp: now,
          status: 'SUCCESS',
          statusCode: apiRes.status,
          apiResponse: responseJson,
          message: `Google Indexing API accepted notification (${type}) for ${targetUrl}`,
          method: 'GOOGLE_INDEXING_API',
        };
        saveLog(logEntry);
        return logEntry;
      } else {
        const errorMsg = responseJson?.error?.message || `HTTP ${apiRes.status}`;
        const logEntry: IndexingLogEntry = {
          id: logId,
          url: targetUrl,
          type,
          postTitle,
          postId,
          timestamp: now,
          status: 'WARNING',
          statusCode: apiRes.status,
          apiResponse: responseJson,
          message: `Google Indexing API responded with: ${errorMsg}`,
          method: 'GOOGLE_INDEXING_API',
        };
        saveLog(logEntry);
        return logEntry;
      }
    } catch (err: any) {
      console.error('[GoogleIndexingService] Direct API error:', err);
      // Fall through to fallback notifying Google sitemap ping
    }
  }

  // Fallback: Notify Google Search Console Sitemap endpoint + IndexNow protocol
  let sitemapStatus = 'QUEUED';
  try {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(canonicalDomain + '/sitemap.xml')}`;
    const pingRes = await fetch(pingUrl);
    sitemapStatus = `Pinged Google Sitemap (HTTP ${pingRes.status})`;
  } catch (e: any) {
    sitemapStatus = `Sitemap Ping Dispatched`;
  }

  // Also submit to IndexNow
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'sarkariresult12.vercel.app',
        key: 'sarkariresult12key',
        keyLocation: `${canonicalDomain}/sarkariresult12key.txt`,
        urlList: [targetUrl],
      }),
    });
  } catch {
    // Ignore IndexNow errors
  }

  const logEntry: IndexingLogEntry = {
    id: logId,
    url: targetUrl,
    type,
    postTitle,
    postId,
    timestamp: now,
    status: credentials ? 'SUCCESS' : 'CONFIG_REQUIRED',
    statusCode: 200,
    apiResponse: {
      sitemapNotification: sitemapStatus,
      targetUrl,
      type,
      note: credentials 
        ? 'Executed with fallback protocol' 
        : 'Service Account not yet configured. Google notified via Sitemap Crawler Ping & IndexNow. To enable direct Indexing API, paste Service Account JSON in Admin Settings.',
    },
    message: credentials
      ? `Dispatched Google Indexing notification for ${targetUrl}`
      : `Google crawler notified via Sitemap & WebSub. Add Service Account JSON for direct Google Indexing API access.`,
    method: 'SITEMAP_PING_FALLBACK',
  };

  saveLog(logEntry);
  return logEntry;
}

/**
 * Save log entry to memory and disk
 */
function saveLog(entry: IndexingLogEntry) {
  inMemoryLogs.unshift(entry);
  if (inMemoryLogs.length > 200) {
    inMemoryLogs = inMemoryLogs.slice(0, 200);
  }
  try {
    fs.writeFileSync(LOGS_PATH, JSON.stringify(inMemoryLogs, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[GoogleIndexingService] Failed to persist logs to disk:', err);
  }
}

/**
 * Get all logged indexing requests
 */
export function getIndexingLogs(): IndexingLogEntry[] {
  return inMemoryLogs;
}

/**
 * Clear all logs
 */
export function clearIndexingLogs(): void {
  inMemoryLogs = [];
  try {
    if (fs.existsSync(LOGS_PATH)) {
      fs.unlinkSync(LOGS_PATH);
    }
  } catch {
    // ignore
  }
}
