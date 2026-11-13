import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPostBySlug: (slug: string) => void;
  allPosts: SarkariPost[];
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onCategoryChange,
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

  // Close More dropdown when clicking outside and support Escape key / body scroll lock
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreOpen(false);
        setIsMobileMenuOpen(false);
        setIsSearchVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const activeCategoryLabel = useMemo(() => {
    switch (activeCategory) {
      case 'latest_jobs':
        return 'Latest Job';
      case 'admit_card':
        return 'Admit Card';
      case 'result':
        return 'Result';
      case 'answer_key':
        return 'Answer Key';
      case 'syllabus':
        return 'Syllabus';
      case 'admission':
        return 'Admission';
      case 'certificate_verification':
        return 'Certificate Verification';
      case 'important':
        return 'Important';
      default:
        return '';
    }
  }, [activeCategory]);

  const handleNavClick = (cat: PostCategory | 'all') => {
    onCategoryChange(cat);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaticDocClick = (slug: string) => {
    onOpenPostBySlug(slug);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamically derive trending search chips from the latest added posts
  const trendingTags = useMemo(() => {
    if (!allPosts || allPosts.length === 0) {
      return [
        { label: 'Supreme Court Form 2026', slug: 'supreme-court-court-master-online-form-2026' },
        { label: 'UP Primary Teacher', slug: 'upessc-up-primary-teacher-super-tet-2026' },
        { label: 'BPSC TRE 4.0', slug: 'bpsc-school-teacher-tre-4-online-form-2026' },
        { label: 'Railway NTPC', slug: 'rrb-ntpc-12th-level-recruitment-2026' },
        { label: 'UP Police Constable', slug: 'up-police-constable-final-result-2026' },
        { label: 'BAR AIBE 2026', slug: 'all-india-bar-aibe-xix-2026-online-form' },
      ];
    }
    return allPosts.slice(0, 6).map(p => ({
      label: p.shortTitle || p.title,
      slug: p.slug
    }));
  }, [allPosts]);

  return (
    <div className="w-full">
      {/* Site Header */}
      <header className="sr-header cursor-pointer" onClick={() => handleNavClick('all')}>
        <div className="sr-header-title">SARKARI RESULT</div>
        <div className="sr-header-sub">WWW.SARKARIRESULT12.VERCEL.APP</div>
      </header>

      {/* Navigation Sub-Bar with Collapsible Hamburger Menu */}
      <nav className="sr-nav relative" aria-label="Main Navigation">
        <div className="flex items-center min-w-0 flex-1">
          {/* Left-side Collapsible Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="sr-mobile-nav-drawer"
            aria-label="Toggle Navigation Menu"
            className="sr-nav-btn flex items-center gap-1.5 font-bold shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-white" />
            ) : (
              <Menu className="w-4 h-4 text-white" />
            )}
            <span>Menu</span>
          </button>

          {/* Compact Active Category Indicator on Small Mobile Screens */}
          {activeCategoryLabel && (
            <span className="md:hidden text-xs font-bold text-yellow-200 truncate px-2.5">
              {activeCategoryLabel}
            </span>
          )}

          {/* Desktop Horizontal Navigation Links (Left-Aligned) */}
          <div className="hidden md:flex items-center min-w-0">
            <button
              type="button"
              onClick={() => handleNavClick('all')}
              className={`sr-nav-btn ${activeCategory === 'all' ? 'active-nav' : ''}`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('latest_jobs')}
              className={`sr-nav-btn ${activeCategory === 'latest_jobs' ? 'active-nav' : ''}`}
            >
              Latest Job
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('admit_card')}
              className={`sr-nav-btn ${activeCategory === 'admit_card' ? 'active-nav' : ''}`}
            >
              Admit Card
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('result')}
              className={`sr-nav-btn ${activeCategory === 'result' ? 'active-nav' : ''}`}
            >
              Result
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('answer_key')}
              className={`sr-nav-btn ${activeCategory === 'answer_key' ? 'active-nav' : ''}`}
            >
              Answer Key
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('syllabus')}
              className={`sr-nav-btn ${activeCategory === 'syllabus' ? 'active-nav' : ''}`}
            >
              Syllabus
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('admission')}
              className={`sr-nav-btn ${activeCategory === 'admission' ? 'active-nav' : ''}`}
            >
              Admission
            </button>
            <div className="relative inline-block" ref={moreRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                aria-expanded={isMoreOpen}
                className="sr-nav-btn flex items-center gap-1"
              >
                <span>More</span>
                {isMoreOpen ? <ChevronUp className="w-3.5 h-3.5 inline" /> : <ChevronDown className="w-3.5 h-3.5 inline" />}
              </button>
              {isMoreOpen && (
                <div className="absolute left-0 top-full mt-0 w-56 bg-white text-slate-900 shadow-xl border-2 border-[#ab0000] z-50 py-1 divide-y divide-slate-200 font-bold text-xs text-left">
                  <button
                    type="button"
                    onClick={() => handleNavClick('certificate_verification')}
                    className="w-full text-left px-3 py-2.5 text-slate-900 hover:bg-red-50 hover:text-[#ab0000] cursor-pointer"
                  >
                    📜 Certificate Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('important')}
                    className="w-full text-left px-3 py-2.5 text-slate-900 hover:bg-red-50 hover:text-[#ab0000] cursor-pointer"
                  >
                    📌 Important Links
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStaticDocClick('privacy-policy')}
                    className="w-full text-left px-3 py-2.5 text-slate-900 hover:bg-red-50 hover:text-[#ab0000] cursor-pointer"
                  >
                    🔒 Privacy Policy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStaticDocClick('disclaimer')}
                    className="w-full text-left px-3 py-2.5 text-slate-900 hover:bg-red-50 hover:text-[#ab0000] cursor-pointer"
                  >
                    ⚠️ Disclaimer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStaticDocClick('rules-and-regulations')}
                    className="w-full text-left px-3 py-2.5 text-slate-900 hover:bg-red-50 hover:text-[#ab0000] cursor-pointer"
                  >
                    📋 Rules &amp; Regulations
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right-side Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          title="Search Sarkari Result"
          aria-label="Search Sarkari Result"
          aria-expanded={isSearchVisible}
          className="sr-nav-btn sr-nav-search flex items-center gap-1.5 ml-auto shrink-0"
        >
          <Search className="w-3.5 h-3.5 inline" />
          <span>Search</span>
        </button>
      </nav>

      {/* Left Slide-Out Collapsible Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="sr-mobile-nav-drawer"
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Left Drawer Panel */}
          <aside className="relative z-10 w-72 max-w-[82vw] h-full bg-[#800000] text-white shadow-2xl border-r-2 border-[#ab0000] flex flex-col overflow-y-auto">
            <div className="bg-[#ab0000] px-4 py-3 flex items-center justify-between border-b border-white/30">
              <span className="font-bold text-base tracking-wide">MENU</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Menu"
                className="p-1 hover:bg-[#5c0000] rounded cursor-pointer text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col divide-y divide-white/20">
              <button
                type="button"
                onClick={() => handleNavClick('all')}
                className={`w-full min-h-[44px] text-left px-4 py-3 text-sm font-bold cursor-pointer ${
                  activeCategory === 'all' ? 'bg-[#5c0000] text-yellow-300 border-l-4 border-yellow-300' : 'text-white hover:bg-[#5c0000]'
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('latest_jobs')}
                className={`w-full min-h-[44px] text-left px-4 py-3 text-sm font-bold cursor-pointer ${
                  activeCategory === 'latest_jobs' ? 'bg-[#5c0000] text-yellow-300 border-l-4 border-yellow-300' : 'text-white hover:bg-[#5c0000]'
                }`}
              >
                Latest Job
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('admit_card')}
                className={`w-full min-h-[44px] text-left px-4 py-3 text-sm font-bold cursor-pointer ${
                  activeCategory === 'admit_card' ? 'bg-[#5c0000] text-yellow-300 border-l-4 border-yellow-300' : 'text-white hover:bg-[#5c0000]'
                }`}
              >
                Admit Card
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('result')}
                className={`w-full min-h-[44px] text-left px-4 py-3 text-sm font-bold cursor-pointer ${
                  activeCategory === 'result' ? 'bg-[#5c0000] text-yellow-300 border-l-4 border-yellow-300' : 'text-white hover:bg-[#5c0000]'
                }`}
              >
                Result
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('answer_key')}
                className={`w-full min-h-[44px] text-left px-4 py-3 text-sm font-bold cursor-pointer ${
                  activeCategory === 'answer_key' ? 'bg-[#5c0000] text-yellow-300 border-l-4 border-yellow-300' : 'text-white hover:bg-[#5c0000]'
                }`}
              >
                Answer Key
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('syllabus')}
                className={`w-full min-h-[44px] text-left px-4 py-3 text-sm font-bold cursor-pointer ${
                  activeCategory === 'syllabus' ? 'bg-[#5c0000] text-yellow-300 border-l-4 border-yellow-300' : 'text-white hover:bg-[#5c0000]'
                }`}
              >
                Syllabus
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('admission')}
                className={`w-full min-h-[44px] text-left px-4 py-3 text-sm font-bold cursor-pointer ${
                  activeCategory === 'admission' ? 'bg-[#5c0000] text-yellow-300 border-l-4 border-yellow-300' : 'text-white hover:bg-[#5c0000]'
                }`}
              >
                Admission
              </button>

              {/* Drawer More Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-white hover:bg-[#5c0000] cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileMoreOpen && (
                  <div className="bg-[#5c0000] pl-3 divide-y divide-white/15 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => handleNavClick('certificate_verification')}
                      className="w-full text-left px-4 py-2.5 text-white hover:text-yellow-300 cursor-pointer"
                    >
                      📜 Certificate Verification
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavClick('important')}
                      className="w-full text-left px-4 py-2.5 text-white hover:text-yellow-300 cursor-pointer"
                    >
                      📌 Important Links
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStaticDocClick('privacy-policy')}
                      className="w-full text-left px-4 py-2.5 text-white hover:text-yellow-300 cursor-pointer"
                    >
                      🔒 Privacy Policy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStaticDocClick('disclaimer')}
                      className="w-full text-left px-4 py-2.5 text-white hover:text-yellow-300 cursor-pointer"
                    >
                      ⚠️ Disclaimer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStaticDocClick('rules-and-regulations')}
                      className="w-full text-left px-4 py-2.5 text-white hover:text-yellow-300 cursor-pointer"
                    >
                      📋 Rules &amp; Regulations
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Google Search Style Dropdown when search icon is clicked */}
      {isSearchVisible && (
        <div className="bg-white border-b-2 border-slate-300 py-3 px-3 sm:px-6 shadow-md">
          <div className="max-w-3xl mx-auto relative">
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
    </div>
  );
};
