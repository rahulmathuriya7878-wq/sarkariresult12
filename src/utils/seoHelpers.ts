import { SarkariPost } from '../types/job';
import { mockSarkariPosts } from '../data/mockJobs';

export const CANONICAL_DOMAIN = 'https://sarkariresult12.vercel.app';

/**
 * Escapes characters for XML and HTML safety.
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats date into standard YYYY-MM-DD
 */
export function formatDateIso(dateStr?: string): string {
  const fallback = new Date().toISOString().split('T')[0];
  if (!dateStr) return fallback;
  try {
    const timestamp = Date.parse(dateStr);
    if (!isNaN(timestamp)) {
      return new Date(timestamp).toISOString().split('T')[0];
    }
  } catch {
    // fallback
  }
  return fallback;
}

/**
 * Generates Schema.org JSON-LD (JobPosting, GovernmentService, BreadcrumbList, FAQPage)
 */
export function generatePostSchemaJsonLd(post: SarkariPost, domain: string = CANONICAL_DOMAIN): string {
  const cleanSlug = post.slug || `post-${post.id}`;
  const postUrl = `${domain}/post/${cleanSlug}`;
  const postedDate = formatDateIso(post.postDate);
  const validThroughDate = post.lastDate ? formatDateIso(post.lastDate) : '2026-12-31';

  // Category clean name
  const categoryNames: Record<string, string> = {
    latest_jobs: 'Latest Jobs',
    result: 'Exam Results',
    admit_card: 'Admit Cards',
    admission: 'Admissions',
    answer_key: 'Answer Keys',
    syllabus: 'Syllabus',
    certificate_verification: 'Certificates',
    important: 'Important Links'
  };
  const categoryLabel = categoryNames[post.category] || 'Government Updates';

  // 1. Breadcrumb List Schema
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': domain
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': categoryLabel,
        'item': `${domain}/${post.category.replace('_', '-')}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.shortTitle || post.title,
        'item': postUrl
      }
    ]
  };

  // 2. Primary Entity Schema
  let mainEntitySchema: Record<string, any>;

  if (post.category === 'latest_jobs') {
    mainEntitySchema = {
      '@type': 'JobPosting',
      '@id': `${postUrl}#job`,
      'title': post.title,
      'description': `<p>${escapeHtml(post.shortInfo || post.title)}</p><p>Department: ${post.department}, Total Vacancies: ${post.totalVacancies || 'Multiple'}, Application Deadline: ${post.lastDate || 'As per official notification'}.</p>`,
      'datePosted': postedDate,
      'validThrough': validThroughDate,
      'employmentType': 'FULL_TIME',
      'hiringOrganization': {
        '@type': 'Organization',
        'name': post.department || 'Government Organization of India',
        'sameAs': domain
      },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': post.state || 'All India',
          'addressCountry': 'IN'
        }
      },
      'occupationalCategory': 'Government Services / Public Sector',
      'baseSalary': {
        '@type': 'MonetaryAmount',
        'currency': 'INR',
        'value': {
          '@type': 'QuantitativeValue',
          'unitText': 'MONTH'
        }
      }
    };
  } else {
    mainEntitySchema = {
      '@type': 'GovernmentService',
      '@id': `${postUrl}#service`,
      'name': post.title,
      'serviceType': categoryLabel,
      'provider': {
        '@type': 'GovernmentOrganization',
        'name': post.department || 'Government of India',
        'url': domain
      },
      'description': post.shortInfo || post.title,
      'areaServed': {
        '@type': 'AdministrativeArea',
        'name': post.state || 'India'
      }
    };
  }

  // 3. News / WebPage Article Schema
  const articleSchema = {
    '@type': 'NewsArticle',
    '@id': `${postUrl}#article`,
    'headline': post.title,
    'description': post.shortInfo || post.title,
    'datePublished': postedDate,
    'dateModified': postedDate,
    'mainEntityOfPage': postUrl,
    'author': {
      '@type': 'Organization',
      'name': 'Sarkari Result Portal',
      'url': domain
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Sarkari Result Portal',
      'logo': {
        '@type': 'ImageObject',
        'url': `${domain}/sarkari-result-logo.jpg`
      }
    }
  };

  const graph = [breadcrumbSchema, mainEntitySchema, articleSchema];

  // 4. FAQ Schema if present
  const faqsList = post.faqs || post.customFaqs;
  if (faqsList && faqsList.length > 0) {
    const faqSchema = {
      '@type': 'FAQPage',
      'mainEntity': faqsList.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
    graph.push(faqSchema);
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph
  }, null, 2);
}

/**
 * Generates an automated RSS 2.0 XML feed for rapid crawler discovery.
 */
export function generateRssXml(posts: SarkariPost[] = mockSarkariPosts, domain: string = CANONICAL_DOMAIN): string {
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.postDate || 0).getTime() - new Date(a.postDate || 0).getTime())
    .slice(0, 50);

  const itemsXml = recentPosts
    .map((post) => {
      const cleanSlug = post.slug || `post-${post.id}`;
      const postUrl = `${domain}/post/${cleanSlug}`;
      const pubDate = new Date(post.postDate || Date.now()).toUTCString();
      const desc = escapeHtml(post.shortInfo || `${post.title} - Department: ${post.department}. Updated on ${post.postDate}.`);

      return `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeHtml(post.category)}</category>
      <description>${desc}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sarkari Result Portal - Latest Govt Jobs &amp; Exam Updates</title>
    <link>${domain}</link>
    <description>Real-time official alerts for Sarkari Result, Latest Govt Jobs, Admit Cards, Exam Results, Answer Keys, and Admissions in India.</description>
    <language>hi-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${domain}/sarkari-result-logo.jpg</url>
      <title>Sarkari Result Portal</title>
      <link>${domain}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;
}

/**
 * Generates a complete, lightweight HTML Sitemap Directory for Googlebot instant 1-pass crawling.
 */
export function generateHtmlSitemapPage(posts: SarkariPost[] = mockSarkariPosts, domain: string = CANONICAL_DOMAIN): string {
  const grouped: Record<string, SarkariPost[]> = {
    'latest_jobs': [],
    'result': [],
    'admit_card': [],
    'admission': [],
    'answer_key': [],
    'syllabus': [],
    'important': []
  };

  posts.forEach((p) => {
    if (grouped[p.category]) {
      grouped[p.category].push(p);
    } else {
      grouped['important'].push(p);
    }
  });

  const categoryTitles: Record<string, string> = {
    'latest_jobs': 'Latest Government Jobs (Sarkari Naukri 2026)',
    'result': 'Government Exam Results (Sarkari Result 2026)',
    'admit_card': 'Admit Cards & Exam Hall Tickets',
    'admission': 'University & Entrance Exam Admissions',
    'answer_key': 'Official Answer Keys & Objections',
    'syllabus': 'Exam Pattern & Syllabus Directory',
    'important': 'Important Services & Official Portals'
  };

  let sectionsHtml = '';
  for (const [catKey, catPosts] of Object.entries(grouped)) {
    if (catPosts.length === 0) continue;
    const catTitle = categoryTitles[catKey] || catKey.toUpperCase();
    const listItems = catPosts
      .map((p) => {
        const slug = p.slug || `post-${p.id}`;
        return `<li style="margin-bottom: 8px;">
          <a href="${domain}/post/${slug}" style="color: #ab1616; font-weight: bold; text-decoration: none;">${escapeHtml(p.title)}</a>
          <span style="color: #64748b; font-size: 13px;"> (${p.department || 'Govt'} - Date: ${p.postDate || 'Active'})</span>
        </li>`;
      })
      .join('\n');

    sectionsHtml += `
      <section style="margin-bottom: 30px;">
        <h2 style="background-color: #ab1616; color: white; padding: 10px 15px; font-size: 20px; border-radius: 4px; margin-bottom: 15px;">
          ${catTitle} (${catPosts.length})
        </h2>
        <ul style="list-style-type: square; padding-left: 20px; line-height: 1.6;">
          ${listItems}
        </ul>
      </section>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete HTML Sitemap & Index Directory - Sarkari Result Portal</title>
  <meta name="description" content="Complete indexing directory of all active Sarkari Result posts, Latest Govt Jobs, Admit Cards, Exam Results, Answer Keys, and Syllabus links.">
  <link rel="canonical" href="${domain}/all-jobs-index">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 20px; max-width: 1200px; margin: 0 auto; }
    header { border-bottom: 3px solid #ab1616; padding-bottom: 15px; margin-bottom: 25px; }
    h1 { color: #ab1616; margin: 0 0 10px 0; font-size: 28px; }
    .back-btn { display: inline-block; background: #ab1616; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-bottom: 15px; }
    .back-btn:hover { background: #881111; }
  </style>
</head>
<body>
  <header>
    <a href="${domain}/" class="back-btn">&larr; Back to Main Website</a>
    <h1>Sarkari Result Portal - Complete Indexing Directory</h1>
    <p>Comprehensive Googlebot & Search Crawler index directory for all active notifications and portals.</p>
  </header>
  <main>
    ${sectionsHtml}
  </main>
  <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e1; text-align: center; color: #64748b; font-size: 14px;">
    &copy; 2026 Sarkari Result Portal. All active pages fully indexed and compliant with sitemaps.org standards.
  </footer>
</body>
</html>`;
}
