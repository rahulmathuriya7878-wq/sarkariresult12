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

const HIGHLIGHT_CLASSES = [
  'bg-c1',
  'bg-c2',
  'bg-c3',
  'bg-c4',
  'bg-c5',
  'bg-c6',
  'bg-c7',
  'bg-c8',
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
      
      let postTime = now - (idx * 6 * 60 * 60 * 1000);
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
      const keepInHighlights = isWithin4Days || clicks > 0 || Boolean(post.isHot);

      let score = 0;
      if (keepInHighlights) {
        score += clicks * 15000;
        if (post.isNew) score += 50000;
        if (isWithin4Days) score += 20000;
        if ((post as any).isUpdated) score += 10000;
        if (post.isHot) score += 8000;
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

    const eligibleScored = scoredCandidates.filter(item => item.keepInHighlights);
    const finalCandidates = eligibleScored.length >= 8 ? eligibleScored : scoredCandidates;
    finalCandidates.sort((a, b) => b.score - a.score);

    return finalCandidates.slice(0, 8).map(({ post, clicks }, idx) => {
      const bgClass = HIGHLIGHT_CLASSES[idx % HIGHLIGHT_CLASSES.length];
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
        bgClass,
        badgeText,
        clicks
      };
    });
  }, [posts, visitedPostIds, bookmarkedIds]);

  if (highlightItems.length === 0) return null;

  return (
    <div className="w-full pt-2">
      {/* 8 Featured Grid Boxes (2x4 Mobile, 4x2 Laptop/Desktop) */}
      <section className="featured-grid" aria-label="Featured Updates">
        {highlightItems.map((box) => (
          <button
            type="button"
            key={box.id}
            onClick={() => {
              if (!isGlobalWordEditActive) {
                onSelectHighlight(box.slug);
              }
            }}
            className={`featured-box ${box.bgClass}`}
          >
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
                className="outline-none hover:bg-black/40 focus:bg-black/60 px-1 rounded border-b border-dashed border-yellow-300 cursor-text"
                title="क्लिक करके हेडलाइट शीर्षक बदलें (Click to edit headline)"
              >
                {box.title}
              </span>
            ) : (
              <span>{box.title}</span>
            )}
          </button>
        ))}
      </section>
    </div>
  );
};

