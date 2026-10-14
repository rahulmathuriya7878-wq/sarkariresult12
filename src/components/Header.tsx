import React from 'react';
import { 
  Calculator, 
  Image as ImageIcon, 
  Bookmark, 
  Sparkles, 
  Globe, 
  Search
} from 'lucide-react';
import { PostCategory } from '../types/job';

interface HeaderProps {
  activeCategory: PostCategory | 'all';
  onCategoryChange: (category: PostCategory | 'all') => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenAgeCalculator: () => void;
  onOpenPhotoResizer: () => void;
  onOpenJobFinder: () => void;
  isHindi: boolean;
  onToggleHindi: () => void;
  onSearchFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onCategoryChange,
  bookmarkCount,
  onOpenBookmarks,
  onOpenAgeCalculator,
  onOpenPhotoResizer,
  onOpenJobFinder,
  isHindi,
  onToggleHindi,
  onSearchFocus
}) => {
  return (
    <header className="w-full">
      {/* 1. Iconic Sarkari Result Top Banner */}
      <div className="bg-[#ab1616] text-white py-3 sm:py-4 px-3 text-center border-b border-red-900 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="w-10 hidden sm:block"></div>
          <button
            onClick={() => onCategoryChange('all')}
            className="inline-block text-center cursor-pointer group mx-auto"
          >
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-white font-sans drop-shadow-xs group-hover:opacity-95">
              SARKARI RESULT
            </h1>
          </button>
          
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Sarkari Result',
                  text: 'Check Latest Govt Jobs, Admit Card and Results on Sarkari Result',
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Portal link copied to clipboard!');
              }
            }}
            className="bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Share Portal"
          >
            <span>Share 🔗</span>
          </button>
        </div>
      </div>

      {/* 2. Black Navigation Ribbon (Exact sarkariresult.com menu) */}
      <div className="bg-black text-white border-b-2 border-[#ab1616] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between">
          <nav className="flex items-center overflow-x-auto no-scrollbar py-0.5 text-xs font-bold divide-x divide-neutral-800">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-[#ab1616] transition-colors uppercase cursor-pointer ${
                activeCategory === 'all' ? 'bg-[#ab1616] text-white' : 'text-neutral-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onCategoryChange('latest_jobs')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-[#ab1616] transition-colors uppercase cursor-pointer ${
                activeCategory === 'latest_jobs' ? 'bg-[#ab1616] text-white' : 'text-neutral-200'
              }`}
            >
              Latest Jobs
            </button>
            <button
              onClick={() => onCategoryChange('result')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-[#ab1616] transition-colors uppercase cursor-pointer ${
                activeCategory === 'result' ? 'bg-[#ab1616] text-white' : 'text-neutral-200'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => onCategoryChange('admit_card')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-[#ab1616] transition-colors uppercase cursor-pointer ${
                activeCategory === 'admit_card' ? 'bg-[#ab1616] text-white' : 'text-neutral-200'
              }`}
            >
              Admit Card
            </button>
            <button
              onClick={() => onCategoryChange('answer_key')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-[#ab1616] transition-colors uppercase cursor-pointer ${
                activeCategory === 'answer_key' ? 'bg-[#ab1616] text-white' : 'text-neutral-200'
              }`}
            >
              Answer Key
            </button>
            <button
              onClick={() => onCategoryChange('syllabus')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-[#ab1616] transition-colors uppercase cursor-pointer ${
                activeCategory === 'syllabus' ? 'bg-[#ab1616] text-white' : 'text-neutral-200'
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => onCategoryChange('admission')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-[#ab1616] transition-colors uppercase cursor-pointer ${
                activeCategory === 'admission' ? 'bg-[#ab1616] text-white' : 'text-neutral-200'
              }`}
            >
              Admission
            </button>
            <button
              onClick={() => onCategoryChange('certificate_verification')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-[#ab1616] transition-colors uppercase cursor-pointer ${
                activeCategory === 'certificate_verification' ? 'bg-[#ab1616] text-white' : 'text-neutral-200'
              }`}
            >
              Certificates
            </button>
          </nav>

          {/* Quick utility icons on right */}
          <div className="flex items-center gap-1 shrink-0 pl-2">
            <button
              onClick={onSearchFocus}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
              title="Search Vacancies"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAgeCalculator}
              className="hidden md:flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
              title="Age Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-300" />
              <span>Age Calc</span>
            </button>
            <button
              onClick={onOpenPhotoResizer}
              className="hidden md:flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
              title="Photo Resizer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>Photo Tool</span>
            </button>
            <button
              onClick={onToggleHindi}
              className="px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
            >
              {isHindi ? 'ENG' : 'हिंदी'}
            </button>
            <button
              onClick={onOpenBookmarks}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-[#ab1616] text-white rounded transition-colors cursor-pointer"
              title="Saved Jobs"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{bookmarkCount}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
