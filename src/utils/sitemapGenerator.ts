import { mockSarkariPosts } from '../data/mockJobs';
import { SarkariPost } from '../types/job';

/**
 * Escapes characters that are invalid in XML elements.
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Parses diverse post date strings into standard YYYY-MM-DD for sitemap lastmod.
 */
function formatPostDateToIso(dateStr?: string): string {
  const fallback = new Date().toISOString().split('T')[0];
  if (!dateStr) return fallback;

  try {
    const timestamp = Date.parse(dateStr);
    if (!isNaN(timestamp)) {
      return new Date(timestamp).toISOString().split('T')[0];
    }
  } catch {
    // ignore
  }

  return fallback;
}

export interface SitemapStats {
  totalPosts: number;
  activeJobsCount: number;
  resultsCount: number;
  admissionsCount: number;
  admitCardsCount: number;
  totalUrls: number;
}

export function getSitemapStats(posts: SarkariPost[] = mockSarkariPosts): SitemapStats {
  const activeJobsCount = posts.filter((p) => p.category === 'latest_jobs').length;
  const resultsCount = posts.filter((p) => p.category === 'result').length;
  const admissionsCount = posts.filter((p) => p.category === 'admission').length;
  const admitCardsCount = posts.filter((p) => p.category === 'admit_card').length;

  return {
    totalPosts: posts.length,
    activeJobsCount,
    resultsCount,
    admissionsCount,
    admitCardsCount,
    totalUrls: posts.length + 9 // static portals + posts
  };
}

/**
 * Generates dynamic sitemap.xml strictly compliant with sitemaps.org schema.
 * Automatically indexes all active job posts, results, admission pages, and portals.
 */
export function generateSitemapXml(
  baseUrl: string = '',
  posts: SarkariPost[] = mockSarkariPosts
): string {
  const domain =
    baseUrl.replace(/\/$/, '') ||
    'https://sarkariresult12.vercel.app';
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. Core Section Portals
  const coreSections = [
    { path: '', priority: '1.0', changefreq: 'always', title: 'GovResults Builder Home' },
    { path: '#latest_jobs', priority: '0.95', changefreq: 'hourly', title: 'Active Latest Jobs Portal' },
    { path: '#result', priority: '0.95', changefreq: 'hourly', title: 'Government Exam Results Portal' },
    { path: '#admission', priority: '0.90', changefreq: 'daily', title: 'University & National Admissions Portal' },
    { path: '#admit_card', priority: '0.90', changefreq: 'daily', title: 'Admit Card Hall Tickets' },
    { path: '#answer_key', priority: '0.85', changefreq: 'daily', title: 'Official Answer Keys & Objections' },
    { path: '#syllabus', priority: '0.80', changefreq: 'weekly', title: 'Exam Pattern & Syllabus Directory' },
    { path: '#certificate_verification', priority: '0.75', changefreq: 'weekly', title: 'Certificate Verification' },
    { path: '#important', priority: '0.75', changefreq: 'weekly', title: 'Important Official Services' }
  ];

  const sectionUrlsXml = coreSections
    .map(
      (sec) => `  <!-- Section: ${sec.title} -->
  <url>
    <loc>${escapeXml(`${domain}/${sec.path}`)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${sec.changefreq}</changefreq>
    <priority>${sec.priority}</priority>
  </url>`
    )
    .join('\n');

  // 2. Active Job Posts
  const activeJobs = posts.filter((p) => p.category === 'latest_jobs');
  const activeJobsXml = activeJobs
    .map((post) => {
      const lastmod = formatPostDateToIso(post.postDate);
      const priority = post.isHot ? '0.95' : '0.90';
      const cleanSlug = post.slug || `job-${post.id}`;
      return `  <url>
    <loc>${escapeXml(`${domain}/#post/${cleanSlug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  // 3. Government Exam Results
  const results = posts.filter((p) => p.category === 'result');
  const resultsXml = results
    .map((post) => {
      const lastmod = formatPostDateToIso(post.postDate);
      const priority = post.isHot ? '0.95' : '0.90';
      const cleanSlug = post.slug || `result-${post.id}`;
      return `  <url>
    <loc>${escapeXml(`${domain}/#post/${cleanSlug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  // 4. Admissions Pages
  const admissions = posts.filter((p) => p.category === 'admission');
  const admissionsXml = admissions
    .map((post) => {
      const lastmod = formatPostDateToIso(post.postDate);
      const priority = post.isHot ? '0.90' : '0.85';
      const cleanSlug = post.slug || `admission-${post.id}`;
      return `  <url>
    <loc>${escapeXml(`${domain}/#post/${cleanSlug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  // 5. Other Posts (Admit Cards, Answer Key, Syllabus, Important)
  const otherPosts = posts.filter(
    (p) => !['latest_jobs', 'result', 'admission'].includes(p.category)
  );
  const otherPostsXml = otherPosts
    .map((post) => {
      const lastmod = formatPostDateToIso(post.postDate);
      const priority = post.category === 'admit_card' ? '0.85' : '0.75';
      const cleanSlug = post.slug || `post-${post.id}`;
      return `  <url>
    <loc>${escapeXml(`${domain}/#post/${cleanSlug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- ====================================================================== -->
  <!-- GovResults Builder Dynamic XML Sitemap                                  -->
  <!-- Total Active Job Posts: ${activeJobs.length}                          -->
  <!-- Total Exam Results: ${results.length}                                  -->
  <!-- Total Admission Notices: ${admissions.length}                         -->
  <!-- Total All Indexed Items: ${posts.length + coreSections.length}          -->
  <!-- Generated on: ${currentDate}                                          -->
  <!-- ====================================================================== -->

  <!-- CORE SECTIONS & PORTALS -->
${sectionUrlsXml}

  <!-- 1. ACTIVE JOB POSTS (${activeJobs.length}) -->
${activeJobsXml}

  <!-- 2. EXAM RESULTS & SCORECARDS (${results.length}) -->
${resultsXml}

  <!-- 3. ADMISSION NOTICES & ENTRY ENTRANCE EXAMS (${admissions.length}) -->
${admissionsXml}

  <!-- 4. ADMIT CARDS, ANSWER KEYS & SYLLABUS (${otherPosts.length}) -->
${otherPostsXml}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string = ''): string {
  const domain =
    baseUrl.replace(/\/$/, '') ||
    'https://sarkariresult12.vercel.app';
  return `User-agent: *
Allow: /

# Dynamic XML Sitemap for Search Engine Crawlers
Sitemap: ${domain}/sitemap.xml
`;
}
