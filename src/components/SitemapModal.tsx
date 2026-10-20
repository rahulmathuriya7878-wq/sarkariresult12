import React, { useState } from 'react';
import { SarkariPost } from '../types/job';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: SarkariPost[];
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  posts
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const baseUrl = window.location.origin;

  // Generate standard XML sitemap
  const generateXml = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Homepage
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += '    <changefreq>hourly</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';

    // Categories
    const categories = ['latest_jobs', 'result', 'admit_card', 'answer_key', 'syllabus', 'admission'];
    categories.forEach(cat => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/?category=${cat}</loc>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });

    // Dynamic Posts
    posts.forEach(post => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/post/${post.slug}</loc>\n`;
      xml += `    <lastmod>${post.postDate || new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  };

  const sitemapXml = generateXml();

  const handleDownload = () => {
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sitemapXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white rounded-xs shadow-2xl border-2 border-red-800 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#ab1616] text-white px-4 py-3 flex items-center justify-between border-b border-red-900">
          <div className="flex items-center gap-2 font-black text-base uppercase font-serif">
            <FileText className="w-5 h-5 text-yellow-300" />
            <span>XML Sitemap Generator (Search Engine Indexing)</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-slate-900">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-3 text-xs sm:text-sm text-blue-900 space-y-1">
            <p className="font-bold">SEO & Crawler Indexing Optimization</p>
            <p>
              This dynamically generated <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">sitemap.xml</code> indexes all {posts.length} active government job listings, exam results, admit cards, and category portals for Google, Bing, and other search engines.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Preview (XML Format):</span>
              <span className="text-emerald-700 font-extrabold">{posts.length + 7} URLs Indexed</span>
            </div>
            <textarea
              readOnly
              value={sitemapXml}
              className="w-full h-64 font-mono text-xs bg-slate-900 text-emerald-300 p-3 rounded-xs border border-slate-700 focus:outline-hidden select-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-4 py-3 border-t border-slate-300 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xs font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <span>Copy XML Code</span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="bg-[#ab1616] hover:bg-red-800 text-white px-5 py-2 rounded-xs font-black text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download sitemap.xml</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
