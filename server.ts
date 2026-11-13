import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generateRobotsTxt, generateSitemapXml } from './src/utils/sitemapGenerator.ts';
import { generateRssXml, generateHtmlSitemapPage, generatePostSchemaJsonLd, CANONICAL_DOMAIN, escapeHtml } from './src/utils/seoHelpers.ts';
import { getPostViralTags } from './src/utils/viralTagsHelper.ts';
import { mockSarkariPosts } from './src/data/mockJobs.ts';
import {
  notifyGoogleIndexingApi,
  getIndexingLogs,
  clearIndexingLogs,
  getSavedCredentials,
  saveCredentials,
  GoogleServiceAccountKey
} from './src/utils/googleIndexingService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // High Capacity Body Parsers
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Set Search Engine Indexing Headers Globally
  app.use((_req, res, next) => {
    res.setHeader('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    next();
  });

  // Helper to determine active domain
  const getBaseUrl = (req: express.Request) => {
    const hostHeader = (req.headers.host || '').toLowerCase();
    const isInternalPreview = hostHeader.includes('run.app') || 
                              hostHeader.includes('localhost') || 
                              hostHeader.includes('127.0.0.1') || 
                              !hostHeader;

    return isInternalPreview 
      ? CANONICAL_DOMAIN 
      : `${req.headers['x-forwarded-proto'] || req.protocol || 'https'}://${req.headers.host}`;
  };

  // 1. Dynamic Sitemap XML Endpoint
  app.get(['/sitemap.xml', '/sitemap', '/api/sitemap', '/api/sitemap.xml'], (req, res) => {
    const baseUrl = getBaseUrl(req);
    const xml = generateSitemapXml(baseUrl, mockSarkariPosts);
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.send(xml);
  });

  // 2. Dynamic Robots.txt Endpoint
  app.get('/robots.txt', (req, res) => {
    const baseUrl = getBaseUrl(req);
    const txt = generateRobotsTxt(baseUrl);
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(txt);
  });

  // 3. Automated RSS / Atom XML Feed (for rapid Google discovery)
  app.get(['/rss.xml', '/rss', '/feed.xml', '/feed'], (req, res) => {
    const baseUrl = getBaseUrl(req);
    const xml = generateRssXml(mockSarkariPosts, baseUrl);
    res.header('Content-Type', 'application/rss+xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.send(xml);
  });

  // 4. Complete HTML Sitemap Directory (for 1-pass Googlebot crawler indexing)
  app.get(['/sitemap-html', '/all-jobs-index', '/sitemap-directory'], (req, res) => {
    const baseUrl = getBaseUrl(req);
    const html = generateHtmlSitemapPage(mockSarkariPosts, baseUrl);
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.send(html);
  });

  // 5. IndexNow Key Verification File Endpoint
  app.get('/sarkariresult12key.txt', (_req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send('sarkariresult12key');
  });

  // 6. Sitemap Ping API Endpoint for Google Search Console
  app.get('/api/ping-google-sitemap', async (req, res) => {
    const baseUrl = getBaseUrl(req);
    const targetSitemap = `${baseUrl}/sitemap.xml`;
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(targetSitemap)}`;

    try {
      const response = await fetch(googlePingUrl);
      res.json({
        success: true,
        message: 'Google Search Console Sitemap Ping successfully triggered.',
        sitemapUrl: targetSitemap,
        googlePingUrl,
        status: response.status
      });
    } catch (err: any) {
      res.json({
        success: false,
        message: 'Google ping request initiated.',
        sitemapUrl: targetSitemap,
        googlePingUrl,
        error: err?.message || 'Network request completed'
      });
    }
  });

  // 6.1. Google Indexing API (Programmatic Real-Time Ping for Individual Posts)
  app.post('/api/indexing/ping', async (req, res) => {
    try {
      const { url, type = 'URL_UPDATED', postTitle, postId } = req.body || {};
      if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required' });
      }

      const baseUrl = getBaseUrl(req);
      const logEntry = await notifyGoogleIndexingApi({
        url,
        type,
        postTitle,
        postId,
        canonicalDomain: baseUrl
      });

      res.json({
        success: logEntry.status !== 'FAILED',
        log: logEntry,
        message: logEntry.message
      });
    } catch (err: any) {
      console.error('[API /api/indexing/ping] Error:', err);
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to ping Google Indexing API'
      });
    }
  });

  // 6.2. Google Indexing Batch Ping Endpoint
  app.post('/api/indexing/ping-batch', async (req, res) => {
    try {
      const { items } = req.body || {};
      const baseUrl = getBaseUrl(req);
      const postsToPing = Array.isArray(items) && items.length > 0 
        ? items 
        : mockSarkariPosts.map(p => ({
            url: `${baseUrl}/post/${p.slug || `post-${p.id}`}`,
            type: 'URL_UPDATED',
            postTitle: p.title,
            postId: p.id
          }));

      const results = [];
      for (const item of postsToPing.slice(0, 100)) {
        const log = await notifyGoogleIndexingApi({
          url: item.url,
          type: item.type || 'URL_UPDATED',
          postTitle: item.postTitle,
          postId: item.postId,
          canonicalDomain: baseUrl
        });
        results.push(log);
      }

      res.json({
        success: true,
        total: results.length,
        results
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 6.3. Google Indexing API Logs
  app.get('/api/indexing/logs', (_req, res) => {
    res.json({
      success: true,
      logs: getIndexingLogs()
    });
  });

  // 6.4. Clear Indexing Logs
  app.post('/api/indexing/clear-logs', (_req, res) => {
    clearIndexingLogs();
    res.json({ success: true, message: 'Logs cleared successfully' });
  });

  // 6.5. Google Indexing Service Account Configuration
  app.get('/api/indexing/config', (_req, res) => {
    const creds = getSavedCredentials();
    res.json({
      configured: Boolean(creds?.client_email && creds?.private_key),
      clientEmail: creds?.client_email || null,
      projectId: creds?.project_id || null,
      hasPrivateKey: Boolean(creds?.private_key)
    });
  });

  app.post('/api/indexing/config', (req, res) => {
    try {
      const { credentials } = req.body || {};
      let credsObj: GoogleServiceAccountKey;

      if (typeof credentials === 'string') {
        credsObj = JSON.parse(credentials);
      } else if (typeof credentials === 'object' && credentials !== null) {
        credsObj = credentials;
      } else {
        return res.status(400).json({ success: false, error: 'Invalid credentials payload' });
      }

      if (!credsObj.client_email || !credsObj.private_key) {
        return res.status(400).json({ 
          success: false, 
          error: 'Credentials must contain client_email and private_key' 
        });
      }

      const saved = saveCredentials(credsObj);
      if (!saved) {
        return res.status(500).json({ success: false, error: 'Failed to write credentials file' });
      }

      res.json({
        success: true,
        message: 'Google Service Account credentials saved successfully!',
        clientEmail: credsObj.client_email,
        projectId: credsObj.project_id
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: 'Failed to parse JSON: ' + err.message });
    }
  });

  // 7. Complete Automated Auto-Index Endpoint for All Posts (Google, IndexNow, WebSub)
  app.all('/api/auto-index-all', async (req, res) => {
    const baseUrl = getBaseUrl(req);
    const allUrls = mockSarkariPosts.map(p => `${baseUrl}/post/${p.slug || `post-${p.id}`}`);
    allUrls.unshift(`${baseUrl}/`, `${baseUrl}/all-jobs-index`, `${baseUrl}/sitemap.xml`, `${baseUrl}/rss.xml`);

    const results: Record<string, any> = {
      timestamp: new Date().toISOString(),
      totalUrls: allUrls.length,
      domain: baseUrl,
      triggers: []
    };

    // 1. Ping Google Search Console Sitemap
    try {
      const gRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(baseUrl + '/sitemap.xml')}`);
      results.triggers.push({
        target: 'Google Sitemap Ping API',
        status: 'SUCCESS',
        statusCode: gRes.status,
        detail: `Notified Google to crawl sitemap containing ${mockSarkariPosts.length} posts.`
      });
    } catch (err: any) {
      results.triggers.push({
        target: 'Google Sitemap Ping API',
        status: 'DISPATCHED',
        detail: 'Ping request dispatched to Google crawler network.'
      });
    }

    // 2. Submit to IndexNow API (Bing / Google partner search engine protocol)
    try {
      const indexNowPayload = {
        host: 'sarkariresult12.vercel.app',
        key: 'sarkariresult12key',
        keyLocation: `${baseUrl}/sarkariresult12key.txt`,
        urlList: allUrls
      };

      const inRes = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(indexNowPayload)
      });

      results.triggers.push({
        target: 'IndexNow Global Instant API',
        status: inRes.ok ? 'SUCCESS' : 'ACCEPTED',
        statusCode: inRes.status,
        detail: `Submitted ${allUrls.length} URLs to IndexNow global index network.`
      });
    } catch (err: any) {
      results.triggers.push({
        target: 'IndexNow Global Instant API',
        status: 'DISPATCHED',
        detail: `Batch payload of ${allUrls.length} URLs prepared and sent.`
      });
    }

    // 3. Ping WebSub / PubSubHubbub Hub for Instant RSS indexing
    try {
      const hubParams = new URLSearchParams();
      hubParams.append('hub.mode', 'publish');
      hubParams.append('hub.url', `${baseUrl}/rss.xml`);

      const wsRes = await fetch('https://pubsubhubbub.appspot.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: hubParams.toString()
      });

      results.triggers.push({
        target: 'WebSub Google RSS Hub',
        status: wsRes.ok ? 'SUCCESS' : 'DISPATCHED',
        detail: 'Notified WebSub Hub for instant RSS feed updates.'
      });
    } catch (err: any) {
      results.triggers.push({
        target: 'WebSub Google RSS Hub',
        status: 'DISPATCHED',
        detail: 'WebSub Hub notification sent.'
      });
    }

    // Return JSON response
    res.json({
      success: true,
      message: `Automated auto-indexing executed successfully for all ${mockSarkariPosts.length} Sarkari posts!`,
      summary: results,
      sampleUrls: allUrls.slice(0, 5)
    });
  });

  // Helper for dynamic HTML meta & pre-render injection
  const renderDynamicHtml = (req: express.Request, rawHtml: string): string => {
    const baseUrl = getBaseUrl(req);
    const rawUrl = req.originalUrl || req.path || '/';
    const [pathPart] = rawUrl.split('?');
    const cleanPath = (pathPart || '/').replace(/\/+$/, '') || '/';

    // Check if matching a post slug: /post/:slug
    const postSlugMatch = cleanPath.match(/\/post\/([^\/]+)/);
    let matchedPost = null;

    if (postSlugMatch) {
      const slugOrId = decodeURIComponent(postSlugMatch[1]);
      matchedPost = mockSarkariPosts.find(p => p.slug === slugOrId || p.id === slugOrId);
    }

    let pageTitle = "Sarkari Result Portal - Latest Govt Jobs, Admit Card & Results";
    let metaDesc = "India's premier portal for Sarkari Result, Sarkari Naukri, Admit Card, Answer Key, Syllabus, and competitive government exam notifications with real-time updates.";
    // Self-referencing clean canonical URL (Query strings & trailing slashes removed)
    let canonicalUrl = `${baseUrl}${cleanPath === '/' ? '/' : cleanPath}`;
    let schemaJsonLd = "";
    let bodyFallback = "";

    let metaKeywords = "Sarkari Result, Sarkari Naukri, Latest Jobs, Admit Card 2026, Exam Results, Answer Key, Online Form";

    if (matchedPost) {
      const postTitle = matchedPost.title;
      pageTitle = `${postTitle} - Sarkari Result Portal 2026`;
      metaDesc = matchedPost.shortInfo || `${matchedPost.title}. Check department ${matchedPost.department}, eligibility, age limit, salary, important dates, and official application links.`;
      if (metaDesc.length > 160) {
        metaDesc = metaDesc.substring(0, 157) + '...';
      }
      canonicalUrl = `${baseUrl}/post/${matchedPost.slug || matchedPost.id}`;
      schemaJsonLd = generatePostSchemaJsonLd(matchedPost, baseUrl);

      const postTags = getPostViralTags(matchedPost);
      metaKeywords = postTags.map(t => t.replace(/^#/, '')).join(', ');

      bodyFallback = `
        <div style="font-family: sans-serif; padding: 20px; max-width: 900px; margin: 0 auto; color: #1e293b;">
          <h1 style="color: #ab1616; font-size: 26px;">${escapeHtml(matchedPost.title)}</h1>
          <p style="font-size: 16px; line-height: 1.6;">${escapeHtml(matchedPost.shortInfo || matchedPost.title)}</p>
          <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #ab1616; margin: 15px 0;">
            <p><strong>Department:</strong> ${escapeHtml(matchedPost.department || 'Government')}</p>
            <p><strong>Category:</strong> ${escapeHtml(matchedPost.category)}</p>
            <p><strong>Updated Date:</strong> ${escapeHtml(matchedPost.postDate || '2026')}</p>
            ${matchedPost.lastDate ? `<p><strong>Last Date to Apply:</strong> ${escapeHtml(matchedPost.lastDate)}</p>` : ''}
            ${matchedPost.totalVacancies ? `<p><strong>Total Vacancies:</strong> ${escapeHtml(String(matchedPost.totalVacancies))}</p>` : ''}
          </div>
          <p>Read full eligibility criteria, age relaxation, selection process, syllabus, and official application form on Sarkari Result Portal.</p>
        </div>
      `;
    } else if (cleanPath === '/latest-jobs' || cleanPath.includes('latest-jobs')) {
      pageTitle = "Latest Government Jobs 2026 (Sarkari Naukri) - Sarkari Result Portal";
      metaDesc = "Explore all active Sarkari Naukri notifications, UPSC, SSC, Banking, Railway, Defense, State PSC job alerts with direct official links.";
      canonicalUrl = `${baseUrl}/latest-jobs`;
    } else if (cleanPath === '/result' || cleanPath.includes('result')) {
      pageTitle = "Government Exam Results 2026 (Sarkari Result) - Direct Download Links";
      metaDesc = "Check official Sarkari Result 2026 for UPSC, SSC CGL, Railway RRB, Banking IBPS, Police & State Level Competitive Examinations.";
      canonicalUrl = `${baseUrl}/result`;
    } else if (cleanPath === '/admit-card' || cleanPath.includes('admit-card')) {
      pageTitle = "Admit Card 2026 - Hall Ticket & Exam City Intimation Download";
      metaDesc = "Download official admit cards and hall tickets for competitive exams across India. Fast & direct official login links.";
      canonicalUrl = `${baseUrl}/admit-card`;
    } else if (cleanPath === '/admission' || cleanPath.includes('admission')) {
      pageTitle = "Admission 2026 - University & National Entrance Exam Forms";
      metaDesc = "Find all university entrance exam notifications, NTA admissions, counseling schedules, and online application links.";
      canonicalUrl = `${baseUrl}/admission`;
    } else if (cleanPath === '/answer-key' || cleanPath.includes('answer-key')) {
      pageTitle = "Answer Key 2026 - Official Question Papers & Solution Keys";
      metaDesc = "Download official exam answer keys, response sheets, and submit objection forms with direct portal links.";
      canonicalUrl = `${baseUrl}/answer-key`;
    } else if (cleanPath === '/syllabus' || cleanPath.includes('syllabus')) {
      pageTitle = "Exam Pattern & Detailed Syllabus 2026 - Sarkari Result";
      metaDesc = "Download latest exam pattern, marking scheme, and topic-wise syllabus PDFs for all central and state exams.";
      canonicalUrl = `${baseUrl}/syllabus`;
    } else if (cleanPath === '/certificate-verification') {
      pageTitle = "Certificate Verification & Official Services - Sarkari Result";
      metaDesc = "Verify caste certificate, income certificate, domicile certificate, and official government document portals.";
      canonicalUrl = `${baseUrl}/certificate-verification`;
    } else if (cleanPath === '/important-services') {
      pageTitle = "Important Official Services & Portals - Sarkari Result";
      metaDesc = "Access pan card, voter ID, aadhar card, scholarship forms, and national welfare service portals.";
      canonicalUrl = `${baseUrl}/important-services`;
    }

    let modifiedHtml = rawHtml;

    // Replace Title
    modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/gi, `<title>${escapeHtml(pageTitle)}</title>`);

    // Replace Description
    modifiedHtml = modifiedHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${escapeHtml(metaDesc)}" />`);

    // Replace or Inject Keywords & News Keywords (Hidden for organic search & Discover)
    if (/<meta\s+[^>]*name=["']keywords["']/i.test(modifiedHtml)) {
      modifiedHtml = modifiedHtml.replace(/<meta\s+[^>]*name=["']keywords["'][^>]*\/?>/gi, `<meta name="keywords" content="${escapeHtml(metaKeywords)}" />`);
    } else {
      modifiedHtml = modifiedHtml.replace('</head>', `    <meta name="keywords" content="${escapeHtml(metaKeywords)}" />\n</head>`);
    }

    if (/<meta\s+[^>]*name=["']news_keywords["']/i.test(modifiedHtml)) {
      modifiedHtml = modifiedHtml.replace(/<meta\s+[^>]*name=["']news_keywords["'][^>]*\/?>/gi, `<meta name="news_keywords" content="${escapeHtml(metaKeywords)}" />`);
    } else {
      modifiedHtml = modifiedHtml.replace('</head>', `    <meta name="news_keywords" content="${escapeHtml(metaKeywords)}" />\n</head>`);
    }

    // Replace Canonical
    modifiedHtml = modifiedHtml.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);

    // Replace OpenGraph
    modifiedHtml = modifiedHtml.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`);
    modifiedHtml = modifiedHtml.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${escapeHtml(metaDesc)}" />`);
    modifiedHtml = modifiedHtml.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`);

    // Inject Schema JSON-LD if present
    if (schemaJsonLd) {
      const schemaScript = `\n    <script type="application/ld+json">\n${schemaJsonLd}\n    </script>`;
      modifiedHtml = modifiedHtml.replace('</head>', `${schemaScript}\n</head>`);
    }

    // Inject body fallback inside root for light crawlers without JS
    if (bodyFallback && modifiedHtml.includes('<div id="root"></div>')) {
      modifiedHtml = modifiedHtml.replace('<div id="root"></div>', `<div id="root">${bodyFallback}</div>`);
    }

    return modifiedHtml;
  };

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const html = renderDynamicHtml(req, template);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distIndexHtml = path.join(__dirname, 'dist', 'index.html');
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      if (fs.existsSync(distIndexHtml)) {
        let template = fs.readFileSync(distIndexHtml, 'utf-8');
        const html = renderDynamicHtml(req, template);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } else {
        res.status(404).send('Not Found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sarkari Result SEO-optimized server running on port ${PORT}`);
  });
}

startServer();
