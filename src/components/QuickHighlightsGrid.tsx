import React from 'react';
import { SarkariPost } from '../types/job';

interface QuickHighlightsGridProps {
  onSelectHighlight: (slug: string) => void;
  posts?: SarkariPost[];
  visitedPostIds?: Set<string>;
  bookmarkedIds?: string[];
  isGlobalWordEditActive?: boolean;
  onUpdatePost?: (updatedPost: SarkariPost) => void;
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
  bookmarkedIds = [],
  isGlobalWordEditActive = false,
  onUpdatePost
}) => {
  // Dynamically select top 8 posts, scoring by clicks (visited) and saves (bookmarked) for Trending / High Demand badge
  const highlightItems = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const scoredPosts = posts.map((post, idx) => {
      let score = 0;
      const isBookmarked = bookmarkedIds.includes(post.id);
      const isVisited = visitedPostIds.has(post.id) || (post.slug && visitedPostIds.has(post.slug));
      
      if (post.isNew) score += 200; // Highest priority to ensure new posts in any section land in Quick Highlights
      if (post.isHot) score += 50; // Priority for hot updates
      if (isBookmarked) score += 15;
      if (isVisited) score += 5;
      score += (posts.length - idx) * 0.1; // Recency weighting

      return { post, score, isBookmarked, isVisited };
    });

    // Sort by engagement score descending
    scoredPosts.sort((a, b) => b.score - a.score);

    return scoredPosts.slice(0, 8).map(({ post, isBookmarked, isVisited }, idx) => {
      const colorScheme = HIGHLIGHT_COLORS[idx % HIGHLIGHT_COLORS.length];
      const badgeText = isBookmarked ? 'Saved' : isVisited ? 'Trending' : idx === 0 ? 'Hot' : null;

      return {
        post,
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
          <div
            key={box.id}
            onClick={() => {
              if (!isGlobalWordEditActive) {
                onSelectHighlight(box.slug);
              }
            }}
            className={`${box.bgColor} ${box.borderColor} hover:opacity-95 text-white px-2 py-2.5 sm:py-3 rounded-xs shadow-xs transition-transform active:scale-98 text-center flex flex-col items-center justify-center min-h-[58px] sm:min-h-[64px] border cursor-pointer select-none group relative overflow-hidden`}
          >
            {box.badgeText && (
              <span className="absolute top-0.5 right-1 bg-yellow-400 text-slate-950 text-[8px] font-black px-1 py-0 rounded-xs uppercase tracking-tighter shadow-2xs">
                {box.badgeText}
              </span>
            )}
            {isGlobalWordEditActive ? (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updated = e.currentTarget.innerText.trim();
                  if (updated && updated !== box.title && onUpdatePost) {
                    onUpdatePost({
                      ...box.post,
                      shortTitle: updated,
                      title: updated
                    });
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="font-black text-xs sm:text-[13px] leading-tight text-white outline-none hover:bg-black/40 focus:bg-black/60 px-1 rounded border-b border-dashed border-yellow-300 cursor-text"
                title="क्लिक करके हेडलाइट शीर्षक बदलें (Click to edit headline)"
              >
                {box.title}
              </span>
            ) : (
              <span className="font-black text-xs sm:text-[13px] leading-tight text-white group-hover:underline">
                {box.title}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
