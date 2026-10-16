import React from 'react';
import { 
  Calculator, 
  Image as ImageIcon, 
  Bookmark, 
  Sparkles, 
  Globe, 
  Search,
  BellRing,
  MessageCircle
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
  onOpenJobAlerts?: () => void;
  isHindi: boolean;
  onToggleHindi: () => void;
  onSearchFocus: () => void;
  isClassicTheme?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onCategoryChange,
  bookmarkCount,
  onOpenBookmarks,
  onOpenAgeCalculator,
  onOpenPhotoResizer,
  onOpenJobFinder,
  onOpenJobAlerts,
  isHindi,
  onToggleHindi,
  onSearchFocus,
  isClassicTheme = true,
  onToggleTheme
}) => {
  return (
    <header className="w-full">
      {/* 1. Iconic Sarkari Result Top Banner (Normal Clean Look) */}
      <div className="bg-[#ab1616] text-white py-3 sm:py-4 px-3 text-center border-b border-red-900 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="w-10 hidden sm:block"></div>
          <button
            onClick={() => onCategoryChange('all')}
            className="inline-flex items-center justify-center gap-2.5 text-center cursor-pointer group mx-auto"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center shadow-md border-2 border-amber-300 text-xl sm:text-2xl shrink-0">
              ★
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-white font-sans drop-shadow-xs group-hover:opacity-95 leading-none">
                SARKARI RESULT
              </h1>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <a
              href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 px-2.5 sm:px-3 py-1.5 rounded text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0 border border-emerald-300 active:scale-95"
              title="Join Official WhatsApp Channel"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 text-emerald-100" />
              <span className="hidden sm:inline">Join</span>
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Sarkari Result',
                    text: 'Check Latest Govt Jobs, Admit Card and Results on Sarkari Result',
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href).then(() => {
                      alert('Portal link copied to clipboard!');
                  }).catch(err => console.error('Failed to copy: ', err));
                }
              }}
              className="bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-white/20"
              title="Share Portal"
            >
              <span>Share 🔗</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Black Navigation Ribbon (Sarkari Result menu) */}
      <div className="bg-black text-white border-b-2 border-slate-700 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between">
          <nav className="flex items-center overflow-x-auto no-scrollbar py-0.5 text-xs font-bold divide-x divide-neutral-800">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                activeCategory === 'all' ? 'bg-slate-800 text-white' : 'text-neutral-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onCategoryChange('latest_jobs')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                activeCategory === 'latest_jobs' ? 'bg-slate-800 text-white' : 'text-neutral-200'
              }`}
            >
              Latest Jobs
            </button>
            <button
              onClick={() => onCategoryChange('result')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                activeCategory === 'result' ? 'bg-slate-800 text-white' : 'text-neutral-200'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => onCategoryChange('admit_card')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                activeCategory === 'admit_card' ? 'bg-slate-800 text-white' : 'text-neutral-200'
              }`}
            >
              Admit Card
            </button>
            <button
              onClick={() => onCategoryChange('answer_key')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                activeCategory === 'answer_key' ? 'bg-slate-800 text-white' : 'text-neutral-200'
              }`}
            >
              Answer Key
            </button>
            <button
              onClick={() => onCategoryChange('syllabus')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                activeCategory === 'syllabus' ? 'bg-slate-800 text-white' : 'text-neutral-200'
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => onCategoryChange('admission')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                activeCategory === 'admission' ? 'bg-slate-800 text-white' : 'text-neutral-200'
              }`}
            >
              Admission
            </button>
            <button
              onClick={() => onCategoryChange('certificate_verification')}
              className={`px-3 py-2 whitespace-nowrap hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                activeCategory === 'certificate_verification' ? 'bg-slate-800 text-white' : 'text-neutral-200'
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
              onClick={onOpenJobAlerts}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 rounded transition-colors cursor-pointer shadow-2xs"
              title="Get Job Alerts"
            >
              <BellRing className="w-3.5 h-3.5 text-slate-900 animate-pulse" />
              <span className="hidden sm:inline">Job Alerts</span>
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
