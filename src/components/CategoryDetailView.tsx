import React, { useState, useMemo } from 'react';
import { SarkariPost, PostCategory } from '../types/job';
import { ArrowLeft, ChevronRight, Search } from 'lucide-react';
import { isPostVisited } from '../utils/visitedPosts';

interface CategoryDetailViewProps {
  category: PostCategory;
  posts: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onBackToHome: () => void;
  isHindi: boolean;
  visitedPostIds?: Set<string>;
  isGlobalWordEditActive?: boolean;
  onUpdatePost?: (updatedPost: SarkariPost) => void;
  onDeletePost?: (postId: string) => void;
  onAddNewPost?: (category: PostCategory) => void;
}

const CATEGORY_TITLES: Record<PostCategory, { en: string; hi: string; subtitle: string }> = {
  latest_jobs: {
    en: 'Latest Jobs 2026',
    hi: 'नवीनतम सरकारी नौकरी 2026',
    subtitle: 'All Central & State Government Recruitment Notifications & Online Forms'
  },
  result: {
    en: 'Results 2026',
    hi: 'परीक्षा परिणाम 2026',
    subtitle: 'Check All Govt Exam Results, Merit Lists & Cutoff Marks'
  },
  admit_card: {
    en: 'Admit Card 2026',
    hi: 'प्रवेश पत्र 2026',
    subtitle: 'Download Hall Ticket, Call Letter & Exam Date Schedules'
  },
  answer_key: {
    en: 'Answer Key 2026',
    hi: 'उत्तर कुंजी 2026',
    subtitle: 'Official Question Papers, Solution Keys & Objection Windows'
  },
  syllabus: {
    en: 'Syllabus & Pattern 2026',
    hi: 'पाठ्यक्रम 2026',
    subtitle: 'Download Official Exam Syllabus, PDF & Exam Pattern'
  },
  admission: {
    en: 'Admission 2026',
    hi: 'प्रवेश फॉर्म 2026',
    subtitle: 'University, Board & College Admission Online Application Forms'
  },
  certificate_verification: {
    en: 'Certificate Verification',
    hi: 'प्रमाण पत्र सत्यापन',
    subtitle: 'Aadhaar, PAN, Voter ID, Caste, Income & Domicile Verification'
  },
  important: {
    en: 'Important Links',
    hi: 'महत्वपूर्ण लिंक',
    subtitle: 'Scholarships, Voter Services, Correction Portals & Official Links'
  }
};

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  posts,
  onSelectPost,
  onBackToHome,
  isHindi,
  visitedPostIds = new Set(),
  isGlobalWordEditActive = false,
  onUpdatePost,
  onDeletePost,
  onAddNewPost
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const categoryMeta = CATEGORY_TITLES[category] || {
    en: category.replace('_', ' ').toUpperCase(),
    hi: 'विवरण',
    subtitle: 'Official Updates'
  };

  const filteredPosts = useMemo(() => {
    if (!filterQuery.trim()) return posts;
    const q = filterQuery.toLowerCase();
    return posts.filter(
      p => p.title.toLowerCase().includes(q) ||
           p.shortTitle.toLowerCase().includes(q) ||
           p.department.toLowerCase().includes(q)
    );
  }, [posts, filterQuery]);

  return (
    <div className="space-y-3 mb-8">
      {/* Live Word Edit Indicator Banner inside Section */}
      {isGlobalWordEditActive && (
        <div className="bg-emerald-900 text-emerald-100 border-2 border-emerald-400 p-2.5 rounded-xs flex items-center justify-between gap-2 text-xs sm:text-sm font-bold shadow-md animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🟢 वर्ड एडिट चालू है (LIVE) — इस सेक्शन में किसी भी शीर्षक पर क्लिक करके सीधा एडिट करें</span>
          </div>
          {onAddNewPost && (
            <button
              type="button"
              onClick={() => onAddNewPost(category)}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-2.5 py-1 rounded text-xs cursor-pointer shadow-xs shrink-0 flex items-center gap-1"
            >
              <span>+</span>
              <span>{category === 'important' ? 'नया महत्वपूर्ण लिंक जोड़ें' : 'नया पोस्ट जोड़ें'}</span>
            </button>
          )}
        </div>
      )}

      {/* Breadcrumb Navigation & Back Button */}
      <div className="flex items-center justify-between gap-2 py-2 border-b border-slate-200">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#ab1616] hover:underline cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xs border border-red-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? '← मुख्य पृष्ठ (सभी सेक्शन)' : '← Back to Home (All Sections)'}</span>
        </button>

        <div className="text-xs font-bold text-slate-500 hidden sm:block">
          <span>Home</span> &gt; <span className="text-[#ab1616] font-extrabold">{categoryMeta.en}</span>
        </div>
      </div>

      {/* Red Section Banner Header */}
      <div className="bg-[#ab1616] text-white p-3 sm:p-4 rounded-xs border-2 border-red-950 shadow-xs text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-serif uppercase tracking-wide">
          Sarkari Result : {isHindi ? categoryMeta.hi : categoryMeta.en}
        </h1>
        <p className="text-xs sm:text-sm text-yellow-200 font-bold mt-1">
          {categoryMeta.subtitle}
        </p>
      </div>

      {/* Editorial Intro matching Screenshot_20261020-085212.Chrome.png */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xs border border-slate-300 shadow-2xs space-y-1">
        <h2 className="text-[#0000cc] font-serif font-black text-xl sm:text-2xl flex items-center gap-2">
          <span>{category === 'latest_jobs' ? 'Latest 📰 Job' : categoryMeta.en}</span>
        </h2>
        <p className="text-slate-800 text-sm sm:text-[15px] leading-relaxed font-serif">
          {category === 'latest_jobs' ? (
            <>
              The <strong className="text-[#0000cc] underline">Latest 📰 Job</strong> section of <strong className="text-[#ab1616]">Sarkari Result</strong>, powered by Sarkari Result, is one of the most important for users searching for government job vacancies, online recruitment forms, eligibility, and notifications across Central and State Governments.
            </>
          ) : (
            <>
              The <strong className="text-[#0000cc] underline">{categoryMeta.en}</strong> section of <strong className="text-[#ab1616]">Sarkari Result</strong> provides officially verified updates, direct download links, and guidelines for examinees across India.
            </>
          )}
        </p>
      </div>

      {/* Section Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder={`Search within ${categoryMeta.en}...`}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border-2 border-slate-300 rounded-xs focus:border-[#ab1616] focus:outline-hidden font-medium text-slate-900"
        />
      </div>

      {/* Clean Bulleted Posts Listing Matching Screenshot */}
      <div className="bg-white border-2 border-[#ab1616] rounded-xs overflow-hidden shadow-xs">
        <div className="bg-[#ab1616] text-white py-2.5 px-4 font-black text-center font-serif uppercase text-lg sm:text-xl border-b border-red-950 flex items-center justify-between">
          <span className="flex-1 text-center">All {categoryMeta.en} – Sarkari Result</span>
          {isGlobalWordEditActive && onAddNewPost && (
            <button
              type="button"
              onClick={() => onAddNewPost(category)}
              className="text-xs bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-2.5 py-1 rounded shadow-2xs cursor-pointer shrink-0 flex items-center gap-1"
              title={category === 'important' ? "नया महत्वपूर्ण लिंक जोड़ें" : "इस सेक्शन में नया पोस्ट जोड़ें"}
            >
              <span>+</span>
              <span>{category === 'important' ? 'महत्वपूर्ण लिंक जोड़ें' : 'जोड़ें'}</span>
            </button>
          )}
        </div>

        <ul className="divide-y divide-slate-100 p-2 sm:p-3 bg-white">
          {filteredPosts.map((post) => {
            const visited = isPostVisited(visitedPostIds, post);
            return (
              <li
                key={post.id}
                onClick={() => {
                  if (!isGlobalWordEditActive) {
                    onSelectPost(post);
                  }
                }}
                className="py-2.5 px-2 hover:bg-red-50/60 transition-colors cursor-pointer flex items-start justify-between gap-2 group"
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-slate-800 font-black text-lg leading-none shrink-0 mt-0.5">•</span>
                  <div className="flex-1 min-w-0">
                    {isGlobalWordEditActive ? (
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const updated = e.currentTarget.innerText.trim();
                          if (updated && updated !== post.title && onUpdatePost) {
                            onUpdatePost({
                              ...post,
                              title: updated,
                              shortTitle: updated
                            });
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="font-extrabold text-[15px] sm:text-[17px] md:text-[18px] text-[#0000cc] underline leading-snug break-words block font-serif outline-none hover:bg-amber-100/90 focus:bg-amber-50 focus:ring-2 focus:ring-amber-500 rounded px-1 -mx-1 border-b border-dashed border-amber-500 cursor-text"
                        title="क्लिक करके पोस्ट का शीर्षक बदलें (Click to edit title)"
                      >
                        {post.title}
                      </span>
                    ) : (
                      <span className={`font-extrabold text-[15px] sm:text-[17px] md:text-[18px] ${visited ? 'text-[#551a8b]' : 'text-[#0000cc]'} group-hover:text-[#ab1616] underline leading-snug break-words block font-serif`}>
                        {post.title}
                      </span>
                    )}

                    {post.lastDate && (
                      <div className="text-xs text-red-600 font-bold mt-1">
                        <span>Last Date: </span>
                        {isGlobalWordEditActive ? (
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const updated = e.currentTarget.innerText.trim();
                              if (updated && updated !== post.lastDate && onUpdatePost) {
                                onUpdatePost({
                                  ...post,
                                  lastDate: updated
                                });
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="outline-none hover:bg-amber-100 rounded px-1 border-b border-dashed border-amber-500 cursor-text"
                            title="क्लिक करके अंतिम तिथि बदलें"
                          >
                            {post.lastDate}
                          </span>
                        ) : (
                          <span>{post.lastDate}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isGlobalWordEditActive && onDeletePost && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`क्या आप वाकई "${post.shortTitle || post.title}" को डिलीट करना चाहते हैं?`)) {
                        onDeletePost(post.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold shrink-0 mt-0.5"
                    title="यह पोस्ट हटाएं"
                  >
                    ✕
                  </button>
                )}
              </li>
            );
          })}

          {filteredPosts.length === 0 && (
            <li className="p-6 text-center text-slate-500 font-bold text-sm">
              No updates found matching your search.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
