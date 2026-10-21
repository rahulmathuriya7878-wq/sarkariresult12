import React from 'react';
import { SarkariPost } from '../types/job';

interface QuickHighlightsGridProps {
  onSelectHighlight: (slug: string) => void;
  posts?: SarkariPost[];
  visitedPostIds?: Set<string>;
  bookmarkedIds?: string[];
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
  posts = [],
  visitedPostIds = new Set(),
  bookmarkedIds = []
}) => {
  // Dynamically select top 8 posts, scoring by clicks (visited) and saves (bookmarked) for Trending / High Demand badge
  const highlightItems = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const scoredPosts = posts.map((post, idx) => {
      let score = 0;
      const isBookmarked = bookmarkedIds.includes(post.id);
      const isVisited = visitedPostIds.has(post.id) || (post.slug && visitedPostIds.has(post.slug));
      
      if (isBookmarked) score += 15; // High weight for save actions
      if (isVisited) score += 5;    // Weight for click/view actions
      score += (posts.length - idx) * 0.05; // baseline recency

      return { post, score, isBookmarked, isVisited };
    });

    // Sort by engagement score descending
    scoredPosts.sort((a, b) => b.score - a.score);

    return scoredPosts.slice(0, 8).map(({ post, isBookmarked, isVisited }, idx) => {
      const colorScheme = HIGHLIGHT_COLORS[idx % HIGHLIGHT_COLORS.length];
      const badgeText = isBookmarked ? 'Saved' : isVisited ? 'Trending' : idx === 0 ? 'Hot' : null;

      return {
        id: post.id,
        slug: post.slug,
        title: post.shortTitle || post.title,
        bgColor: colorScheme.bgColor,
        borderColor: colorScheme.borderColor,
        badgeText
      };
    });
  }, [posts, visitedPostIds, bookmarkedIds]);

  if (highlightItems.length === 0) return null;

  return (
    <div className="w-full pt-2 pb-3">
      {/* 2-column grid on mobile, 4-col on tablet, 8-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
        {highlightItems.map((box) => (
          <button
            key={box.id}
            onClick={() => onSelectHighlight(box.slug)}
            className={`${box.bgColor} ${box.borderColor} hover:opacity-95 text-white px-2 py-2.5 sm:py-3 rounded-xs shadow-xs transition-transform active:scale-98 text-center flex flex-col items-center justify-center min-h-[58px] sm:min-h-[64px] border cursor-pointer select-none group relative overflow-hidden`}
          >
            {box.badgeText && (
              <span className="absolute top-0.5 right-1 bg-yellow-400 text-slate-950 text-[8px] font-black px-1 py-0 rounded-xs uppercase tracking-tighter shadow-2xs">
                {box.badgeText}
              </span>
            )}
            <span className="font-black text-xs sm:text-[13px] leading-tight text-white group-hover:underline">
              {box.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
