import React, { useMemo } from 'react';
import { SarkariPost } from '../types/job';
import { getPostClickMap, getPostClicks } from '../utils/visitedPosts';

interface QuickHighlightsGridProps {
  onSelectHighlight: (slug: string) => void;
  posts?: SarkariPost[];
  visitedPostIds?: Set<string>;
  bookmarkedIds?: string[];
  isGlobalWordEditActive?: boolean;
  onUpdatePost?: (updatedPost: SarkariPost) => void;
}

const HIGHLIGHT_COLORS = [
  { bgColor: 'bg-[#828800]', borderColor: 'border-[#6c7100]' }, // Olive Gold
  { bgColor: 'bg-[#1432c7]', borderColor: 'border-[#0f269a]' }, // Royal Blue
  { bgColor: 'bg-[#f45700]', borderColor: 'border-[#c94800]' }, // Vibrant Orange
  { bgColor: 'bg-[#850000]', borderColor: 'border-[#660000]' }, // Deep Crimson
  { bgColor: 'bg-[#ea1b0d]', borderColor: 'border-[#bd1408]' }, // Fire Red
  { bgColor: 'bg-[#007b22]', borderColor: 'border-[#005f1a]' }, // Forest Emerald
  { bgColor: 'bg-[#cf2489]', borderColor: 'border-[#aa1c6f]' }, // Hot Magenta
  { bgColor: 'bg-[#2185d0]', borderColor: 'border-[#196aa7]' }, // Sky Cerulean
];

export const QuickHighlightsGrid: React.FC<QuickHighlightsGridProps> = ({ 
  onSelectHighlight,
  posts = [],
  visitedPostIds = new Set(),
  bookmarkedIds = [],
  isGlobalWordEditActive = false,
  onUpdatePost
}) => {
  // Dynamically select top 8 highlights based on 4-day freshness rule & high click retention
  const highlightItems = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const clickMap = getPostClickMap();
    const now = Date.now();
    const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;

    // 1. Deduplicate posts strictly by normalized title, slug and ID
    const seen = new Set<string>();
    const uniquePosts: SarkariPost[] = [];

    for (const p of posts) {
      const normTitle = (p.shortTitle || p.title || '').trim().toLowerCase();
      const normSlug = (p.slug || '').trim().toLowerCase();
      const key = `${p.id}::${normSlug}::${normTitle}`;
      if (!seen.has(key) && !seen.has(normTitle)) {
        seen.add(key);
        seen.add(normTitle);
        uniquePosts.push(p);
      }
    }

    // 2. Filter & Score posts based on 4-Day Freshness & High Clicks
    const scoredCandidates = uniquePosts.map((post, idx) => {
      const clicks = getPostClicks(post, clickMap);
      
      // Determine post age in milliseconds
      let postTime = now - (idx * 6 * 60 * 60 * 1000); // default fallback relative timestamp
      if (post.postDate) {
        try {
          const cleanDate = post.postDate.split('|')[0].trim();
          if (/^\d{4}-\d{2}-\d{2}/.test(cleanDate)) {
            const parsed = new Date(cleanDate).getTime();
            if (!isNaN(parsed)) postTime = parsed;
          } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(cleanDate)) {
            const [d, m, y] = cleanDate.split('/');
            const parsed = new Date(Number(y), Number(m) - 1, Number(d)).getTime();
            if (!isNaN(parsed)) postTime = parsed;
          }
        } catch {
          // ignore parse error
        }
      }

      const ageMs = Math.max(0, now - postTime);
      const isWithin4Days = ageMs <= FOUR_DAYS_MS || Boolean(post.isNew);
      const isOlderThan4Days = ageMs > FOUR_DAYS_MS && !post.isNew;

      // RULE: Posts > 4 days old with NO clicks and NOT hot get excluded ("4 din baad hata de")
      const keepInHighlights = isWithin4Days || clicks > 0 || Boolean(post.isHot);

      // Scoring formula: High Clicks get top weight, followed by Newness and Freshness
      let score = 0;
      if (keepInHighlights) {
        score += clicks * 15000; // Major priority boost for high clicks!
        if (post.isNew) score += 50000;
        if (isWithin4Days) score += 20000;
        if ((post as any).isUpdated) score += 10000;
        if (post.isHot) score += 8000;

        // Recency decay weighting
        score += Math.max(0, 10000 - Math.floor(ageMs / (1000 * 60 * 60)));
      }

      return {
        post,
        score,
        clicks,
        isWithin4Days,
        keepInHighlights
      };
    });

    // 3. Filter out posts older than 4 days with zero clicks/engagement
    const eligibleScored = scoredCandidates.filter(item => item.keepInHighlights);

    // Fallback: If less than 8 posts are eligible, include top recent posts so grid always stays full (8 boxes)
    const finalCandidates = eligibleScored.length >= 8 
      ? eligibleScored 
      : scoredCandidates;

    // 4. Sort by score descending (high-click & fresh posts on top)
    finalCandidates.sort((a, b) => b.score - a.score);

    // Take top 8 highlights strictly
    return finalCandidates.slice(0, 8).map(({ post, clicks }, idx) => {
      const colorScheme = HIGHLIGHT_COLORS[idx % HIGHLIGHT_COLORS.length];
      const isBookmarked = bookmarkedIds.includes(post.id);
      const isVisited = visitedPostIds.has(post.id) || (post.slug && visitedPostIds.has(post.slug));

      let badgeText: string | null = null;
      if (clicks >= 2) badgeText = `🔥 ${clicks} CLICKS`;
      else if (clicks === 1) badgeText = 'POPULAR';
      else if (post.isNew) badgeText = 'NEW';
      else if ((post as any).isUpdated) badgeText = 'UPDATED';
      else if (post.isHot) badgeText = 'HOT';
      else if (isVisited) badgeText = 'TRENDING';
      else if (isBookmarked) badgeText = 'SAVED';

      return {
        post,
        id: post.id,
        slug: post.slug,
        title: post.shortTitle || post.title,
        bgColor: colorScheme.bgColor,
        borderColor: colorScheme.borderColor,
        badgeText,
        clicks
      };
    });
  }, [posts, visitedPostIds, bookmarkedIds]);

  if (highlightItems.length === 0) return null;

  return (
    <div className="w-full pt-1 pb-3">
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
