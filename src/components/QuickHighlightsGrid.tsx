import React from 'react';
import { SarkariPost } from '../types/job';

interface QuickHighlightsGridProps {
  onSelectHighlight: (slug: string) => void;
  posts?: SarkariPost[];
}

const HIGHLIGHT_COLORS = [
  { bgColor: 'bg-[#828800]', borderColor: 'border-[#6c7100]' },
  { bgColor: 'bg-[#1432c7]', borderColor: 'border-[#0f269a]' },
  { bgColor: 'bg-[#f45700]', borderColor: 'border-[#c94800]' },
  { bgColor: 'bg-[#850000]', borderColor: 'border-[#660000]' },
  { bgColor: 'bg-[#ea1b0d]', borderColor: 'border-[#bd1408]' },
  { bgColor: 'bg-[#007b22]', borderColor: 'border-[#005f1a]' },
  { bgColor: 'bg-[#cf2489]', borderColor: 'border-[#aa1c6f]' },
  { bgColor: 'bg-[#2185d0]', borderColor: 'border-[#196aa7]' },
];

export const QuickHighlightsGrid: React.FC<QuickHighlightsGridProps> = ({ 
  onSelectHighlight,
  posts = []
}) => {
  // Dynamically select top 8 latest added posts from state
  const highlightItems = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];

    // Take the top 8 posts directly (most recently added posts are at index 0..7)
    return posts.slice(0, 8).map((post, idx) => {
      const colorScheme = HIGHLIGHT_COLORS[idx % HIGHLIGHT_COLORS.length];
      return {
        id: post.id,
        slug: post.slug,
        title: post.shortTitle || post.title,
        bgColor: colorScheme.bgColor,
        borderColor: colorScheme.borderColor,
        isNew: post.isNew
      };
    });
  }, [posts]);

  if (highlightItems.length === 0) return null;

  return (
    <div className="w-full pt-2 pb-3">
      {/* 2-column grid on mobile, 4-col on tablet, 8-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
        {highlightItems.map((box) => (
          <button
            key={box.id}
            onClick={() => onSelectHighlight(box.slug)}
            className={`${box.bgColor} ${box.borderColor} hover:opacity-95 text-white px-2 py-3 sm:py-3.5 rounded-xs shadow-xs transition-transform active:scale-98 text-center flex items-center justify-center min-h-[58px] sm:min-h-[64px] border cursor-pointer select-none group relative overflow-hidden`}
          >
            <span className="font-black text-xs sm:text-[13px] leading-tight text-white group-hover:underline">
              {box.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
