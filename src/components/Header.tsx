import React, { useState, useRef, useEffect } from 'react';
import { 
  Search,
  ChevronDown,
  ChevronUp,
  Menu,
  X
} from 'lucide-react';
import { PostCategory } from '../types/job';

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
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onCategoryChange,
  isHindi: _isHindi,
  searchQuery,
  onSearchChange,
  onOpenPostBySlug
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
  };

  const handleStaticDocClick = (slug: string) => {
    onOpenPostBySlug(slug);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
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
      {/* 1. Authentic Sarkari Result Crimson Masthead (Exact Website Design) */}
      <div className="bg-[#8b0000] text-white py-2.5 sm:py-3.5 px-3 sm:px-6 border-b border-red-950">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-2">
          
          {/* Brand Logo & Title with Seal */}
          <div 
            onClick={() => handleNavClick('all')}
            className="cursor-pointer group flex items-center justify-center gap-3 select-none"
          >
            {/* Official Logo Image */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-yellow-400 shadow-md shrink-0 bg-white flex items-center justify-center">
              <img 
                src="/assets/aistudio/IMG_20261020_152004_993_1b3313f3.jpg" 
                alt="Sarkari Result Logo" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <span className="text-[#facc15] font-serif text-2xl sm:text-3xl leading-none">★</span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider uppercase text-white font-serif drop-shadow-sm leading-none">
                  SARKARI RESULT
                </h1>
                <span className="text-[#facc15] font-serif text-2xl sm:text-3xl leading-none">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Responsive Navigation Bar:
          - Mobile (md:hidden): Black bar with [✕/☰ Menu] on left and [🔍] on right + Vertical black drawer (Screenshot_20261020-085212.Chrome.png)
          - Desktop (hidden md:block): Classic Sarkari Result horizontal black bar
      */}
      <div className="bg-black text-white border-b-2 border-red-900 sticky top-0 z-40 shadow-md">
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

        {/* Mobile Vertical Drawer (Exact Match to Screenshot_20261020-085212.Chrome.png) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black text-white border-t border-neutral-800 pb-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex flex-col py-1">
              <button
                onClick={() => handleNavClick('all')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'all' ? 'text-red-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('latest_jobs')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'latest_jobs' ? 'text-red-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Latest Job
              </button>

              <button
                onClick={() => handleNavClick('admit_card')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'admit_card' ? 'text-red-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Admit Card
              </button>

              <button
                onClick={() => handleNavClick('result')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'result' ? 'text-red-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Results
              </button>

              <button
                onClick={() => handleNavClick('admission')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'admission' ? 'text-red-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Admission
              </button>



              <button
                onClick={() => handleNavClick('syllabus')}
                className={`w-full text-left px-5 py-3 text-[16px] font-bold tracking-wide transition-colors cursor-pointer ${
                  activeCategory === 'syllabus' ? 'text-red-400 font-black' : 'text-white hover:bg-neutral-900'
                }`}
              >
                Syllabus
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
                    <button
                      onClick={() => handleStaticDocClick('contact-us')}
                      className="w-full text-left px-4 py-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      📞 Contact Us
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Navigation Bar (hidden md:flex) */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between">
          <nav className="flex items-stretch flex-1 overflow-x-auto no-scrollbar divide-x divide-neutral-700 text-xs sm:text-sm font-black tracking-wide uppercase">
            <button
              onClick={() => handleNavClick('all')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 ${
                activeCategory === 'all' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('latest_jobs')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 ${
                activeCategory === 'latest_jobs' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Latest Job
            </button>

            <button
              onClick={() => handleNavClick('admit_card')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 ${
                activeCategory === 'admit_card' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Admit Card
            </button>

            <button
              onClick={() => handleNavClick('result')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 ${
                activeCategory === 'result' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Results
            </button>

            <button
              onClick={() => handleNavClick('admission')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 ${
                activeCategory === 'admission' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Admission
            </button>



            <button
              onClick={() => handleNavClick('syllabus')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap hover:bg-[#ab1616] hover:text-white transition-colors cursor-pointer text-center shrink-0 ${
                activeCategory === 'syllabus' ? 'bg-[#ab1616] text-white' : 'text-neutral-100'
              }`}
            >
              Syllabus
            </button>

            {/* Desktop More Button */}
            <div className="relative shrink-0" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="bg-white text-black font-extrabold px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1 hover:bg-neutral-200 transition-colors cursor-pointer h-full text-xs sm:text-sm"
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
                  <button
                    onClick={() => handleStaticDocClick('contact-us')}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-[#ab1616] transition-colors cursor-pointer flex items-center justify-between text-emerald-800"
                  >
                    <span>📞 Contact Us</span>
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

      {/* 3. Search Bar Dropdown when search icon is clicked */}
      {isSearchVisible && (
        <div className="bg-slate-100 border-b-2 border-red-800 py-2.5 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search here for any Result, Admit Card, Latest Job, Syllabus..."
                  className="w-full pl-9 pr-20 py-2 text-sm bg-white border-2 border-red-800 rounded-xs focus:outline-hidden focus:ring-2 focus:ring-red-600 font-medium text-slate-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-200 px-2 py-0.5 rounded cursor-pointer"
                  >
                    Clear ✕
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (!searchQuery.trim()) {
                    onSearchChange('Supreme Court');
                  }
                }}
                className="bg-[#ab1616] hover:bg-red-800 text-white px-5 py-2 rounded-xs text-xs font-black uppercase tracking-wide cursor-pointer transition-colors shrink-0"
              >
                Search Sarkari
              </button>
            </div>

            {/* Quick Trending Keyword Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] sm:text-xs">
              <span className="font-extrabold text-[#ab1616] shrink-0">Trending:</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => onSearchChange(tag.label)}
                  className="text-blue-800 hover:text-[#ab1616] hover:underline cursor-pointer font-bold"
                >
                  {tag.label} |
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
