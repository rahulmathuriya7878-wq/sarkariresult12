import React, { useState } from 'react';
import { mockSarkariPosts } from '../data/mockJobs';
import { generateSitemapXml } from '../utils/sitemapGenerator';
import { FileCode, Download, Copy, Check, Search, ExternalLink, Globe } from 'lucide-react';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (slug: string) => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onSelectPost,
}) => {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const xmlContent = generateSitemapXml(window.location.origin);

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => console.error('Failed to copy: ', err));
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredPosts = mockSarkariPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.slug.toLowerCase().includes(search.toLowerCase()) ||
    post.shortTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-2xl border border-slate-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h2 className="font-extrabold text-base sm:text-lg">
              Dynamic XML Sitemap Generator & SEO Indexer
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer px-2"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold flex items-center gap-1.5 text-xs">
                <Globe className="w-4 h-4 text-amber-700" />
                <span>Live Public Endpoint: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">/sitemap.xml</code></span>
              </p>
              <p className="text-[11px] text-amber-900 mt-1">
                Total {mockSarkariPosts.length} job post slugs automatically indexed for Google & Search Console.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleCopyXml}
                className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy XML'}</span>
              </button>
              <button
                onClick={handleDownloadXml}
                className="bg-[#ab1616] hover:bg-red-900 text-white px-3 py-1.5 rounded font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download sitemap.xml</span>
              </button>
            </div>
          </div>

          {/* Search Slugs */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search indexed job post slugs or titles..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-red-700"
            />
          </div>

          {/* Table of Slugs */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-slate-100 p-2 font-bold text-xs text-slate-700 grid grid-cols-12 gap-2 uppercase tracking-wide">
              <span className="col-span-8">Job Post Title & URL Slug</span>
              <span className="col-span-4 text-right">Action / Priority</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-2.5 hover:bg-slate-50 grid grid-cols-12 gap-2 items-center text-xs">
                  <div className="col-span-8">
                    <p className="font-bold text-slate-900 line-clamp-1">{post.title}</p>
                    <p className="font-mono text-[10px] text-blue-700 font-semibold truncate">
                      {window.location.origin}/#{post.slug}
                    </p>
                  </div>
                  <div className="col-span-4 text-right flex items-center justify-end gap-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded font-bold">
                      {post.isHot ? '0.95' : '0.85'}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPost(post.slug);
                      }}
                      className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 px-2 py-1 rounded font-bold cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
