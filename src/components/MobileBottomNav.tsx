import React from 'react';
import { Home, Briefcase, FileText, Award, Bookmark } from 'lucide-react';
import { PostCategory } from '../types/job';

interface MobileBottomNavProps {
  activeCategory: PostCategory | 'all';
  onCategoryChange: (category: PostCategory | 'all') => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onCategoryChange,
  bookmarkCount,
  onOpenBookmarks
}) => {
  return (
    <nav aria-label="Mobile Bottom Navigation" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black text-white border-t-2 border-[#ab1616] py-2 px-3 flex items-center justify-around text-[11px] font-bold shadow-lg">
      <button
        onClick={() => onCategoryChange('all')}
        className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
          activeCategory === 'all' ? 'text-yellow-300' : 'text-neutral-300'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onCategoryChange('latest_jobs')}
        className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
          activeCategory === 'latest_jobs' ? 'text-yellow-300' : 'text-neutral-300'
        }`}
      >
        <Briefcase className="w-4 h-4" />
        <span>Jobs</span>
      </button>

      <button
        onClick={() => onCategoryChange('admit_card')}
        className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
          activeCategory === 'admit_card' ? 'text-yellow-300' : 'text-neutral-300'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span>Admit</span>
      </button>

      <button
        onClick={() => onCategoryChange('result')}
        className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
          activeCategory === 'result' ? 'text-yellow-300' : 'text-neutral-300'
        }`}
      >
        <Award className="w-4 h-4" />
        <span>Result</span>
      </button>

      <button
        onClick={onOpenBookmarks}
        className="flex flex-col items-center gap-0.5 text-neutral-300 hover:text-white transition-colors cursor-pointer relative"
      >
        <Bookmark className="w-4 h-4 text-yellow-300" />
        <span>Saved</span>
        {bookmarkCount > 0 && (
          <span className="absolute -top-1 right-1 bg-red-600 text-white font-extrabold text-[9px] px-1 rounded-full">
            {bookmarkCount}
          </span>
        )}
      </button>
    </nav>
  );
};
