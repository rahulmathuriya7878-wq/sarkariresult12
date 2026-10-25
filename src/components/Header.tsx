import React, { useState, useRef, useEffect } from 'react';
import { 
  Search,
  ChevronDown,
  ChevronUp,
  Menu,
  X
} from 'lucide-react';
import { PostCategory } from '../types/job';
import { SarkariPost } from '../types/job';

interface HeaderProps {
  activeCategory: PostCategory | 'all';
  onCategoryChange: (category: PostCategory | 'all') => void;
  bookmarkCount?: number;
  onOpenBookmarks?: () => void;
  onOpenAgeCalculator?: () => void;
  onOpenPhotoResizer?: () => void;
  onOpenJobFinder?: () => void;
  onOpenJobAlerts?: () => void;
  onOpenAdmin?: () => void;
  isHindi: boolean;
  onToggleHindi?: () => void;
  onSearchFocus?: () => void;
  isClassicTheme?: boolean;
  onToggleTheme?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPostBySlug: (slug: string) => void;
  allPosts: SarkariPost[];
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onCategoryChange,
  isHindi: _isHindi,
  searchQuery,
  onSearchChange,
  onOpenPostBySlug,
  allPosts
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close More dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (cat: PostCategory | 'all') => {
    onCategoryChange(cat);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaticDocClick = (slug: string) => {
    onOpenPostBySlug(slug);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trendingTags = [
    { label: 'Supreme Court Form 2026', slug: 'supreme-court-court-master-online-form-2026' },
    { label: 'UP Primary Teacher', slug: 'upessc-up-primary-teacher-super-tet-2026' },
    { label: 'BPSC TRE 4.0', slug: 'bpsc-school-teacher-tre-4-online-form-2026' },
    { label: 'Railway NTPC', slug: 'rrb-ntpc-12th-level-recruitment-2026' },
    { label: 'UP Police Constable', slug: 'up-police-constable-final-result-2026' },
    { label: 'BAR AIBE 2026', slug: 'all-india-bar-aibe-xix-2026-online-form' },
  ];

  return (
    <header className="w-full bg-white shadow-xs">
      {/* 1. Compact Minimum Sarkari Result Crimson Masthead */}
      <div className="bg-[#ab1616] text-white py-1 sm:py-1.5 px-3 sm:px-6 border-b border-red-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Title with Seal */}
          <div 
            onClick={() => handleNavClick('all')}
            className="cursor-pointer group flex items-center gap-2 select-none"
          >
            {/* Compact Logo Image */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-400 shadow-xs shrink-0 bg-white flex items-center justify-center p-0.5">
              <img 
                src="/sarkari-result-logo.jpg" 
                alt="Sarkari Result Emblem Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[#facc15] font-serif text-sm sm:text-base leading-none">★</span>
              <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-wide uppercase text-white font-serif leading-none">
                SARKARI RESULT
              </h1>
              <span className="text-[#facc15] font-serif text-sm sm:text-base leading-none">★</span>
            </div>
          </div>

          <a 
            href="https://sarkariresult12.vercel.app/#" 
            className="text-amber-300 hover:text-yellow-200 font-bold text-[11px] sm:text-xs tracking-wider font-sans underline truncate max-w-[150px] sm:max-w-none"
            title="Sarkari Result Official Portal"
          >
            sarkariresult12.vercel.app
          </a>
        </div>
      </div>

      {/* Running Live Alert Ribbon (Header Ribbon) */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold py-1.5 px-3 overflow-hidden whitespace-nowrap shadow-inner border-y border-amber-600 text-xs sm:text-sm font-sans flex items-center gap-2">
        <span className="bg-slate-950 text-amber-400 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider flex items-center gap-1 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          LIVE UPDATES
        </span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-marquee cursor-pointer select-none">
            <span className="mx-4 text-slate-950 font-black hover:underline" onClick={() => onOpenPostBySlug('upsc-cds-ii-result-2026')}>
              🔥 UPSC CDS II Result 2026 Written Exam Declared - Click to Check Roll No List!
            </span>
            <span className="text-red-900 font-extrabold mx-2">★</span>
            <span className="mx-4 text-slate-950 font-black hover:underline" onClick={() => onOpenPostBySlug('rrb-station-master-recruitment-2026')}>
              ⚡ Railway RRB Station Master 994 Posts Online Form 2026 Active!
            </span>
            <span className="text-red-900 font-extrabold mx-2">★</span>
            <span className="mx-4 text-slate-950 font-black hover:underline" onClick={() => onOpenPostBySlug('bpsc-school-teacher-tre-4-online-form-2026')}>
              📢 BPSC School Teacher TRE 4.0 Form Open Now!
            </span>
            <span className="text-red-900 font-extrabold mx-2">★</span>
            <span className="mx-4 text-slate-950 font-black hover:underline" onClick={() => onOpenPostBySlug('up-police-constable-final-result-2026')}>
              🏆 UP Police Constable Final Result 2026 Declared!
            </span>
            <span className="text-red-900 font-extrabold mx-2">★</span>

            {/* Repeat for seamless continuous scrolling */}
            <span className="mx-4 text-slate-950 font-black hover:underline" onClick={() => onOpenPostBySlug('upsc-cds-ii-result-2026')}>
              🔥 UPSC CDS II Result 2026 Written Exam Declared - Click to Check Roll No List!
            </span>
            <span className="text-red-900 font-extrabold mx-2">★</span>
            <span className="mx-4 text-slate-950 font-black hover:underline" onClick={() => onOpenPostBySlug('rrb-station-master-recruitment-2026')}>
              ⚡ Railway RRB Station Master 994 Posts Online Form 2026 Active!
            </span>
            <span className="text-red-900 font-extrabold mx-2">★</span>
            <span className="mx-4 text-slate-950 font-black hover:underline" onClick={() => onOpenPostBySlug('bpsc-school-teacher-tre-4-online-form-2026')}>
              📢 BPSC School Teacher TRE 4.0 Form Open Now!
            </span>
            <span className="text-red-900 font-extrabold mx-2">★</span>
            <span className="mx-4 text-slate-950 font-black hover:underline" onClick={() => onOpenPostBySlug('up-police-constable-final-result-2026')}>
              🏆 UP Police Constable Final Result 2026 Declared!
            </span>
          </div>
        </div>
      </div>

      {/* 2. Responsive Navigation Bar */}
      <div className="bg-black text-white border-b-2 border-red-900 sticky top-0 z-50 shadow-md">
        {/* Mobile Header Bar (md:hidden) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2 text-white font-extrabold text-sm sm:text-base cursor-pointer py-1 px-2 hover:bg-neutral-800 rounded-xs select-none transition-colors"
          >
            {isMobileMenuOpen ? (
              <>
                <X className="w-5 h-5 text-white" />
                <span>Menu</span>
              </>
            ) : (
              <>
                <Menu className="w-5 h-5 text-white" />
                <span>Menu</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="p-1.5 text-white hover:bg-neutral-800 rounded-xs cursor-pointer select-none transition-colors"
            title="Search Sarkari Result"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Mobile Vertical Drawer (Exact Match to Screenshot) */}
        {isMobileMenuOpen && (
          <div className="md:hidden sticky top-full bg-black text-white border-t border-neutral-800 pb-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex flex-col py-1">
              <button
                onClick={() => handleNavClick('all')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'all' ? 'text-purple-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('latest_jobs')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'latest_jobs' ? 'text-purple-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Latest Job
              </button>

              <button
                onClick={() => handleNavClick('admit_card')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'admit_card' ? 'text-purple-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Admit Card
              </button>

              <button
                onClick={() => handleNavClick('result')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'result' ? 'text-purple-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Results
              </button>

              <button
                onClick={() => handleNavClick('syllabus')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'syllabus' ? 'text-purple-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Syllabus
              </button>

              <button
                onClick={() => handleNavClick('admission')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'admission' ? 'text-purple-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Admission
              </button>

              {/* Mobile More Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                  className="w-full flex items-center justify-between px-5 py-3 text-[16px] font-bold text-white hover:bg-neutral-900 tracking-wide transition-colors cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileMoreOpen && (
                  <div className="bg-neutral-950 pl-4 border-l-2 border-red-700 my-1 divide-y divide-neutral-900 text-[15px]">
                    <button
                      onClick={() => handleNavClick('answer_key')}
                      className="w-full text-left px-4 py-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      🔑 Answer Key
                    </button>
                    <button
                      onClick={() => handleNavClick('certificate_verification')}
                      className="w-full text-left px-4 py-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      📜 Certificate Verification
                    </button>
                    <button
                      onClick={() => handleNavClick('important')}
                      className="w-full text-left px-4 py-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      📌 Important Links
                    </button>
                    <button
                      onClick={() => handleStaticDocClick('privacy-policy')}
                      className="w-full text-left px-4 py-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      🔒 Privacy Policy
                    </button>
                    <button
                      onClick={() => handleStaticDocClick('disclaimer')}
                      className="w-full text-left px-4 py-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      ⚠️ Disclaimer
                    </button>
                    <button
                      onClick={() => handleStaticDocClick('rules-and-regulations')}
                      className="w-full text-left px-4 py-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      📋 Rules & Regulations
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Navigation Bar (hidden md:flex) with Segoe UI 12pt */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between font-headlight">
          <nav className="flex items-stretch flex-1 overflow-x-auto no-scrollbar divide-x divide-neutral-700 font-headlight font-black tracking-wide uppercase">
            <button
              onClick={() => handleNavClick('all')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 font-headlight ${
                activeCategory === 'all' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('latest_jobs')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 font-headlight ${
                activeCategory === 'latest_jobs' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Latest Job
            </button>

            <button
              onClick={() => handleNavClick('admit_card')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 font-headlight ${
                activeCategory === 'admit_card' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Admit Card
            </button>

            <button
              onClick={() => handleNavClick('result')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 font-headlight ${
                activeCategory === 'result' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Results
            </button>

            <button
              onClick={() => handleNavClick('syllabus')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 font-headlight ${
                activeCategory === 'syllabus' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Syllabus
            </button>

            <button
              onClick={() => handleNavClick('admission')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 font-headlight ${
                activeCategory === 'admission' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Admission
            </button>

            {/* Desktop More Button */}
            <div className="relative shrink-0 font-headlight" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="bg-white text-black font-extrabold px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1 hover:bg-neutral-200 transition-colors cursor-pointer h-full font-headlight"
              >
                <span>More</span>
                {isMoreOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isMoreOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-0 w-52 bg-white text-slate-900 shadow-xl border-2 border-red-800 z-50 py-1 divide-y divide-slate-100 animate-fade-in font-bold text-xs normal-case">
                  <button
                    onClick={() => handleNavClick('answer_key')}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-[#ab1616] transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>🔑 Answer Key</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('certificate_verification')}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-[#ab1616] transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>📜 Certificate Verification</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('important')}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-[#ab1616] transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>📌 Important Links</span>
                  </button>
                  <button
                    onClick={() => handleStaticDocClick('privacy-policy')}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-[#ab1616] transition-colors cursor-pointer flex items-center justify-between text-purple-800"
                  >
                    <span>🔒 Privacy Policy</span>
                  </button>
                  <button
                    onClick={() => handleStaticDocClick('disclaimer')}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-[#ab1616] transition-colors cursor-pointer flex items-center justify-between text-amber-800"
                  >
                    <span>⚠️ Disclaimer</span>
                  </button>
                  <button
                    onClick={() => handleStaticDocClick('rules-and-regulations')}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-[#ab1616] transition-colors cursor-pointer flex items-center justify-between text-blue-800"
                  >
                    <span>📋 Rules & Regulations</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Search Icon */}
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-black hover:bg-neutral-800 text-white transition-colors cursor-pointer flex items-center justify-center shrink-0 border-l border-neutral-700"
            title="Search Sarkari Result"
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* 3. Google Search Style Dropdown when search icon is clicked */}
      {isSearchVisible && (
        <div className="bg-white border-b-2 border-slate-300 py-3 px-3 sm:px-6 shadow-md">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                {/* Google-style search icon */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Search className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search Govt Jobs, Admit Card, Results, Syllabus (Google Style)..."
                  className="w-full pl-10 pr-24 py-2.5 text-sm bg-white border border-slate-300 rounded-full shadow-inner focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-slate-900 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                  >
                    Clear ✕
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (!searchQuery.trim()) {
                    onSearchChange('UPSC');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide cursor-pointer transition-all shadow-sm shrink-0 flex items-center justify-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Google Search</span>
              </button>
            </div>

            {/* Quick Trending Keyword Google-style Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2.5 text-[11px] sm:text-xs">
              <span className="font-bold text-slate-500 shrink-0">Trending Searches:</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => onSearchChange(tag.label)}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Auto-suggested Categories Dropdown */}
            {searchQuery.length > 1 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-2 text-sm">
                {Array.from(new Set(allPosts
                  .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.department.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 5)
                  .map(p => p.department)
                )).map(dept => (
                  <button
                    key={dept}
                    onClick={() => {
                      onSearchChange(dept);
                      setIsSearchVisible(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700 rounded-md"
                  >
                    Filter by: {dept}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
