import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockSarkariPosts } from '../src/data/mockJobs.ts';
import { 
  generatePostSchemaJsonLd, 
  generateRssXml, 
  generateHtmlSitemapPage, 
  CANONICAL_DOMAIN, 
  escapeHtml 
} from '../src/utils/seoHelpers.ts';
import { getPostViralTags } from '../src/utils/viralTagsHelper.ts';
import { generateSitemapXml, generateRobotsTxt } from '../src/utils/sitemapGenerator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

export async function generateStaticPages() {
  console.log('🚀 [SSG Engine] Generating static HTML pages with self-referential canonical tags for Google Indexing...');

  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ [SSG Engine] dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');

  // Helper to replace meta tags in template
  function createPageHtml(params: {
    pageTitle: string;
    metaDesc: string;
    canonicalUrl: string;
    metaKeywords: string;
    schemaJsonLd?: string;
    bodyHtml?: string;
  }): string {
    let html = baseHtml;

    // Title
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${escapeHtml(params.pageTitle)}</title>`);

    // Description
    html = html.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/gi, `<meta name="description" content="${escapeHtml(params.metaDesc)}" />`);

    // Keywords
    if (/<meta\s+[^>]*name=["']keywords["']/i.test(html)) {
      html = html.replace(/<meta\s+[^>]*name=["']keywords["'][^>]*\/?>/gi, `<meta name="keywords" content="${escapeHtml(params.metaKeywords)}" />`);
    } else {
      html = html.replace('</head>', `    <meta name="keywords" content="${escapeHtml(params.metaKeywords)}" />\n</head>`);
    }

    // Exact Self-Referencing Canonical URL (Crucial for fixing "Alternate page with proper canonical tag")
    html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/gi, `<link rel="canonical" href="${escapeHtml(params.canonicalUrl)}" />`);

    // OpenGraph Tags
    html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:title" content="${escapeHtml(params.pageTitle)}" />`);
    html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:description" content="${escapeHtml(params.metaDesc)}" />`);
    html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:url" content="${escapeHtml(params.canonicalUrl)}" />`);

    // Schema.org JSON-LD
    if (params.schemaJsonLd) {
      const schemaScript = `\n    <script type="application/ld+json">\n${params.schemaJsonLd}\n    </script>`;
      html = html.replace('</head>', `${schemaScript}\n</head>`);
    }

    // Body content for crawlers
    if (params.bodyHtml && html.includes('<div id="root"></div>')) {
      html = html.replace('<div id="root"></div>', `<div id="root">${params.bodyHtml}</div>`);
    }

    return html;
  }

  // 1. Generate Static Pages for ALL Posts
  let postCount = 0;
  for (const post of mockSarkariPosts) {
    const slug = post.slug || `post-${post.id}`;
    const postDir = path.join(distDir, 'post', slug);
    fs.mkdirSync(postDir, { recursive: true });

    const postCanonicalUrl = `${CANONICAL_DOMAIN}/post/${slug}`;
    const pageTitle = `${post.title} - Sarkari Result Portal 2026`;
    let metaDesc = post.shortInfo || `${post.title}. Official recruitment notification, dates, eligibility criteria, and direct application form link.`;
    if (metaDesc.length > 160) {
      metaDesc = metaDesc.substring(0, 157) + '...';
    }

    const postViralTags = getPostViralTags(post);
    const metaKeywords = postViralTags.map(t => t.replace(/^#/, '')).join(', ');
    const schemaJsonLd = generatePostSchemaJsonLd(post, CANONICAL_DOMAIN);

    const tagsHtml = postViralTags
      .map(t => `<span style="display:inline-block; background:#f1f5f9; color:#ab1616; border:1px solid #e2e8f0; font-size:12px; font-weight:bold; padding:3px 8px; border-radius:4px; margin:2px 4px 2px 0;">${escapeHtml(t)}</span>`)
      .join(' ');

    const bodyHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; max-width: 900px; margin: 0 auto; color: #1e293b;">
        <h1 style="color: #ab1616; font-size: 26px; font-weight: 800; line-height: 1.3;">${escapeHtml(post.title)}</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #334155;">${escapeHtml(post.shortInfo || post.title)}</p>
        <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #ab1616; margin: 15px 0; border-radius: 4px;">
          <p style="margin: 4px 0;"><strong>Department:</strong> ${escapeHtml(post.department || 'Government of India')}</p>
          <p style="margin: 4px 0;"><strong>Category:</strong> ${escapeHtml(post.category)}</p>
          <p style="margin: 4px 0;"><strong>Updated Date:</strong> ${escapeHtml(post.postDate || '2026')}</p>
          ${post.lastDate ? `<p style="margin: 4px 0;"><strong>Last Date to Apply:</strong> ${escapeHtml(post.lastDate)}</p>` : ''}
          ${post.totalVacancies ? `<p style="margin: 4px 0;"><strong>Total Vacancies:</strong> ${escapeHtml(String(post.totalVacancies))}</p>` : ''}
        </div>
        <div style="margin: 20px 0; padding: 15px; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px;">
          <p style="font-weight: bold; margin-bottom: 8px; color: #0f172a;">🔥 Trending Viral Search Tags & Keywords:</p>
          <div>${tagsHtml}</div>
        </div>
        <p style="line-height: 1.6;">Check full eligibility criteria, age limits, syllabus, direct links, and official notification on Sarkari Result Portal.</p>
      </div>
    `;

    const postHtml = createPageHtml({
      pageTitle,
      metaDesc,
      canonicalUrl: postCanonicalUrl,
      metaKeywords,
      schemaJsonLd,
      bodyHtml
    });

    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, 'utf-8');
    postCount++;
  }
  console.log(`✅ [SSG Engine] Generated ${postCount} static post pages with self-referencing canonical URLs.`);

  // 2. Generate Static Pages for Core Portals
  const portals = [
    {
      pathName: 'latest-jobs',
      title: 'Latest Government Jobs 2026 (Sarkari Naukri) - Sarkari Result Portal',
      desc: 'Explore all active Sarkari Naukri notifications, UPSC, SSC, Banking, Railway, Defense, State PSC job alerts with direct official links.'
    },
    {
      pathName: 'result',
      title: 'Government Exam Results 2026 (Sarkari Result) - Direct Download Links',
      desc: 'Check official Sarkari Result 2026 for UPSC, SSC CGL, Railway RRB, Banking IBPS, Police & State Level Competitive Examinations.'
    },
    {
      pathName: 'admit-card',
      title: 'Admit Card 2026 - Hall Ticket & Exam City Intimation Download',
      desc: 'Download official admit cards and hall tickets for competitive exams across India. Fast & direct official login links.'
    },
    {
      pathName: 'admission',
      title: 'Admission 2026 - University & National Entrance Exam Forms',
      desc: 'Find all university entrance exam notifications, NTA admissions, counseling schedules, and online application links.'
    },
    {
      pathName: 'answer-key',
      title: 'Answer Key 2026 - Official Question Papers & Solution Keys',
      desc: 'Download official exam answer keys, response sheets, and submit objection forms with direct portal links.'
    },
    {
      pathName: 'syllabus',
      title: 'Exam Pattern & Detailed Syllabus 2026 - Sarkari Result',
      desc: 'Download latest exam pattern, marking scheme, and topic-wise syllabus PDFs for all central and state exams.'
    },
    {
      pathName: 'certificate-verification',
      title: 'Certificate Verification & Official Services - Sarkari Result',
      desc: 'Verify caste certificate, income certificate, domicile certificate, and official government document portals.'
    },
    {
      pathName: 'important-services',
      title: 'Important Official Services & Portals - Sarkari Result',
      desc: 'Access pan card, voter ID, aadhar card, scholarship forms, and national welfare service portals.'
    }
  ];

  for (const portal of portals) {
    const portalDir = path.join(distDir, portal.pathName);
    fs.mkdirSync(portalDir, { recursive: true });

    const portalCanonicalUrl = `${CANONICAL_DOMAIN}/${portal.pathName}`;
    const portalHtml = createPageHtml({
      pageTitle: portal.title,
      metaDesc: portal.desc,
      canonicalUrl: portalCanonicalUrl,
      metaKeywords: 'Sarkari Result, Sarkari Naukri, Latest Jobs, Admit Card 2026, Exam Results, Answer Key'
    });

    fs.writeFileSync(path.join(portalDir, 'index.html'), portalHtml, 'utf-8');
  }
  console.log(`✅ [SSG Engine] Generated ${portals.length} core portal static pages.`);

  // 3. Generate Static XML Sitemap, Robots.txt, and RSS feed
  const sitemapXml = generateSitemapXml(CANONICAL_DOMAIN, mockSarkariPosts);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  const robotsTxt = generateRobotsTxt(CANONICAL_DOMAIN);
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');

  const rssXml = generateRssXml(mockSarkariPosts, CANONICAL_DOMAIN);
  fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf-8');

  // HTML Sitemap Directory
  const sitemapDir = path.join(distDir, 'all-jobs-index');
  fs.mkdirSync(sitemapDir, { recursive: true });
  const htmlSitemap = generateHtmlSitemapPage(mockSarkariPosts, CANONICAL_DOMAIN);
  fs.writeFileSync(path.join(sitemapDir, 'index.html'), htmlSitemap, 'utf-8');

  console.log('🎉 [SSG Engine] All static assets and self-referencing canonical pages generated successfully in dist/!');
}

generateStaticPages().catch(err => {
  console.error('❌ [SSG Engine] Error generating static pages:', err);
  process.exit(1);
});
