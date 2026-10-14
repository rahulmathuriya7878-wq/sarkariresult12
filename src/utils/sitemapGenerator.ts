import { mockSarkariPosts } from '../data/mockJobs';

export function generateSitemapXml(baseUrl: string = ''): string {
  const domain = baseUrl.replace(/\/$/, '') || 'https://ais-pre-whrtzakdpynxkkxdqr2cbs-313809848943.asia-east1.run.app';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { path: '', priority: '1.0', changefreq: 'always' },
    { path: '#latest_jobs', priority: '0.9', changefreq: 'hourly' },
    { path: '#result', priority: '0.9', changefreq: 'hourly' },
    { path: '#admit_card', priority: '0.9', changefreq: 'hourly' },
    { path: '#answer_key', priority: '0.8', changefreq: 'daily' },
    { path: '#syllabus', priority: '0.8', changefreq: 'weekly' },
    { path: '#admission', priority: '0.8', changefreq: 'daily' },
    { path: '#certificate_verification', priority: '0.7', changefreq: 'weekly' },
    { path: '#important', priority: '0.7', changefreq: 'weekly' },
  ];

  const staticUrlsXml = staticRoutes
    .map(
      (route) => `  <url>
    <loc>${domain}/${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n');

  const postUrlsXml = mockSarkariPosts
    .map((post) => {
      const priority = post.isHot ? '0.95' : '0.85';
      return `  <url>
    <loc>${domain}/#${post.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<!-- Auto-Generated Dynamic Sitemap - Total Indexed Job Posts: ${mockSarkariPosts.length} -->
${staticUrlsXml}
${postUrlsXml}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string = ''): string {
  const domain = baseUrl.replace(/\/$/, '') || 'https://ais-pre-whrtzakdpynxkkxdqr2cbs-313809848943.asia-east1.run.app';
  return `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`;
}
