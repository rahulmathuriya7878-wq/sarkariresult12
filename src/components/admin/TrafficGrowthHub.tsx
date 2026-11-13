import React, { useState } from 'react';
import { SarkariPost } from '../../types/job';
import { 
  TrendingUp, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Zap, 
  X
} from 'lucide-react';

interface TrafficGrowthHubProps {
  posts: SarkariPost[];
  isOpen: boolean;
  onClose: () => void;
  onOpenGscManager?: () => void;
}

export const TrafficGrowthHub: React.FC<TrafficGrowthHubProps> = ({
  posts,
  isOpen,
  onClose,
  onOpenGscManager
}) => {
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?.id || '');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'keywords' | 'checklist'>('whatsapp');

  if (!isOpen) return null;

  const CANONICAL_DOMAIN = 'https://sarkariresult12.vercel.app';
  const selectedPost = posts.find(p => p.id === selectedPostId) || posts[0];
  const postUrl = selectedPost ? `${CANONICAL_DOMAIN}/post/${selectedPost.slug || selectedPost.id}` : CANONICAL_DOMAIN;

  // Viral WhatsApp broadcast copy
  const whatsappTemplate = selectedPost ? 
`🔥 *सरकारी भर्ती व रिजल्ट सबसे पहले (Sarkari Result 2026)* 🔥

📌 *भर्ती का नाम:* ${selectedPost.title}
🏢 *विभाग:* ${selectedPost.department || 'Government of India'}
📅 *अंतिम तिथि:* ${selectedPost.lastDate || 'जल्द आवेदन करें'}
🎓 *योग्यता:* ${selectedPost.qualifications?.join(', ') || '10th / 12th / Graduate'}
${selectedPost.totalVacancies ? `📊 *कुल पद:* ${selectedPost.totalVacancies}\n` : ''}
🔗 *ऑनलाइन आवेदन व आधिकारिक नोटिफिकेशन लिंक:*
${postUrl}

📲 *जॉइन ऑफिशियल व्हाट्सएप चैनल (डेली अलर्ट):*
https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j

👉 अपने सभी दोस्तों, कॉलेज ग्रुप्स व व्हाट्सएप स्टेटस पर तुरंत शेयर करें ताकि किसी भी छात्र का फॉर्म न छूटे!` : '';

  // Telegram broadcast copy
  const telegramTemplate = selectedPost ?
`📢 **${selectedPost.title}**

🏢 **विभाग:** ${selectedPost.department || 'Govt Department'}
📅 **अंतिम तिथि:** ${selectedPost.lastDate || 'Active Now'}
🎓 **योग्यता:** ${selectedPost.qualifications?.join(', ') || 'Check Notification'}
${selectedPost.totalVacancies ? `📊 **कुल पद:** ${selectedPost.totalVacancies}\n` : ''}
👉 **डायरेक्ट फॉर्म व सिलेबस लिंक:**
${postUrl}

✈️ **जॉइन ऑफिशियल टेलीग्राम चैनल:**
https://t.me/newsarkariresultt` : '';

  const copyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappTemplate)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(selectedPost?.title || '')}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  // High volume search keywords
  const trendingKeywords = [
    { keyword: 'Sarkari Result 2026', volume: '25,000,000+', competition: 'High', intent: 'Navigational', note: 'Primary branding term' },
    { keyword: 'Sarkari Naukri 2026', volume: '14,000,000+', competition: 'High', intent: 'Commercial', note: 'Used across all states' },
    { keyword: 'UP Police Constable Result 2026', volume: '4,500,000+', competition: 'Medium', intent: 'Informational', note: 'High viral trending in UP' },
    { keyword: 'Railway RRB NTPC Online Form 2026', volume: '5,800,000+', competition: 'High', intent: 'Transactional', note: 'All-India mass recruitment' },
    { keyword: 'BPSC Teacher TRE 4.0 Online Form', volume: '3,200,000+', competition: 'Medium', intent: 'Transactional', note: 'Trending in Bihar & UP' },
    { keyword: 'CTET 2026 Admit Card', volume: '3,100,000+', competition: 'Medium', intent: 'Informational', note: 'Teacher eligibility examination' },
    { keyword: 'SSC GD Constable Answer Key 2026', volume: '4,000,000+', competition: 'Medium', intent: 'Informational', note: 'Defense recruitment' },
    { keyword: 'RPSC 2nd Grade Teacher Result', volume: '1,900,000+', competition: 'Low', intent: 'Informational', note: 'Rajasthan State PSC' },
    { keyword: 'Supreme Court Junior Court Attendant Form', volume: '1,400,000+', competition: 'Low', intent: 'Transactional', note: 'Judiciary fast search' },
    { keyword: 'Air Force Hindi Typist Form 2026', volume: '800,000+', competition: 'Low', intent: 'Transactional', note: 'Defense offline form' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-red-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Header */}
        <div className="bg-[#ab1616] text-white p-4 flex items-center justify-between border-b border-red-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-red-950 p-2 rounded-lg font-black shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-wide font-serif text-white flex items-center gap-2">
                <span>Website Traffic & Viral Growth Hub (वेबसाइट पर ट्रैफिक कैसे बढ़ाएं)</span>
              </h2>
              <p className="text-xs text-amber-200 font-medium">
                1-Click WhatsApp Group Broadcasts, Telegram Sharing & Google SEO Ranking Strategies
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-red-800 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-950 flex items-center justify-between gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'whatsapp' 
                  ? 'bg-amber-400 text-red-950 font-black shadow-xs' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp & Telegram Viral Blast</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('keywords')}
              className={`text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'keywords' 
                  ? 'bg-amber-400 text-red-950 font-black shadow-xs' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Top 2026 Search Keywords</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'checklist' 
                  ? 'bg-amber-400 text-red-950 font-black shadow-xs' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Traffic Growth Blueprint</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">

          {/* TAB 1: WHATSAPP & TELEGRAM BROADCAST */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-5">
              {/* Post Selector */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Select Job / Notification to Generate Viral Message:
                </label>
                <select
                  value={selectedPostId}
                  onChange={(e) => setSelectedPostId(e.target.value)}
                  className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:border-red-600 truncate"
                >
                  {posts.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.category}] {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* WhatsApp Broadcast Card */}
              <div className="bg-white p-4 sm:p-5 rounded-lg border-2 border-emerald-500 shadow-sm space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      💬
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        WhatsApp Group & Channel Viral Format
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Optimized with bold fonts & emojis for highest click-through rate in student WhatsApp groups.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyText(whatsappTemplate, 'whatsapp')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      {copiedType === 'whatsapp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'whatsapp' ? 'Copied Message!' : 'Copy for WhatsApp'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenWhatsApp}
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform active:scale-95"
                    >
                      <span>Share on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 text-emerald-400 p-3.5 rounded font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
                  {whatsappTemplate}
                </div>
              </div>

              {/* Telegram Channel Broadcast Card */}
              <div className="bg-white p-4 sm:p-5 rounded-lg border-2 border-blue-400 shadow-sm space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#0088cc] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      ✈️
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        Telegram Channel Broadcast Format
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Markdown text with direct links for Telegram channels and study groups.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyText(telegramTemplate, 'telegram')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      {copiedType === 'telegram' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'telegram' ? 'Copied Message!' : 'Copy for Telegram'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenTelegram}
                      className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform active:scale-95"
                    >
                      <span>Share on Telegram</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 text-blue-300 p-3.5 rounded font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto border border-slate-800">
                  {telegramTemplate}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KEYWORDS */}
          {activeTab === 'keywords' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-base mb-1">
                  High-Search-Volume Keywords in India (2026)
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Incorporate these high-intent phrases in post titles, short info, and syllabus sections to capture maximum organic Google search traffic.
                </p>

                <div className="overflow-x-auto border border-slate-200 rounded-md">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Search Keyword</th>
                        <th className="p-2.5">Est. Monthly Searches</th>
                        <th className="p-2.5">Competition</th>
                        <th className="p-2.5">Best Placement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {trendingKeywords.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">
                            {item.keyword}
                          </td>
                          <td className="p-2.5 font-mono text-emerald-700 font-extrabold">
                            {item.volume}
                          </td>
                          <td className="p-2.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.competition === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                              item.competition === 'Medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.competition}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600 text-[11px]">
                            {item.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRAFFIC GROWTH BLUEPRINT */}
          {activeTab === 'checklist' && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-red-900 font-extrabold text-base border-b pb-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Proven 5-Pillar Strategy to Scale to 100,000+ Daily Visitors</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                    <span>WhatsApp Community Groups (80% Instant Traffic)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Create 10 to 20 WhatsApp broadcast channels and community groups. Share each new job notification within 5 minutes of release using our viral template.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                    <span>Telegram Channel Alerts</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Telegram channels have no member limits. Post direct notifications with official PDF links. Each post gets forwarded to thousands of study channels automatically.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">3</span>
                    <span>Google Indexing API & Google Discover</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Use the <strong>Google Indexing Manager</strong> in our admin panel to ping Google within seconds of publishing. Googlebot indexes job URLs within 5-15 minutes!
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">4</span>
                    <span>PWA Mobile App Retention</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Our portal is a 100% PWA compliant app. Encourage users to tap "Add to Home Screen" so they get a native app icon and visit multiple times a day.
                  </p>
                </div>
              </div>

              {/* Quick Action Button to GSC Indexer */}
              <div className="pt-2 flex justify-end">
                {onOpenGscManager && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGscManager();
                    }}
                    className="bg-[#ab1616] hover:bg-red-800 text-white font-bold text-xs px-4 py-2 rounded shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Open Google Indexing Manager Now</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Portal Domain: <strong className="text-slate-800">{CANONICAL_DOMAIN}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
