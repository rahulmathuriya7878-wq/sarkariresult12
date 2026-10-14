import React, { useMemo } from 'react';
import { SarkariPost } from '../types/job';
import { mockSarkariPosts } from '../data/mockJobs';

interface QuickHighlightsGridProps {
  onSelectHighlight: (slug: string) => void;
  posts?: SarkariPost[];
}

const GRADIENT_PALETTE = [
  'from-[#ab1616] to-red-800',
  'from-blue-600 to-blue-800',
  'from-amber-600 to-amber-700',
  'from-emerald-600 to-emerald-800',
  'from-purple-600 to-purple-800',
  'from-teal-600 to-teal-800',
  'from-indigo-600 to-indigo-800',
  'from-orange-600 to-orange-700'
];

export const QuickHighlightsGrid: React.FC<QuickHighlightsGridProps> = ({ 
  onSelectHighlight,
  posts = mockSarkariPosts 
}) => {
  // Dynamically select latest added posts
  const dynamicHighlights = useMemo(() => {
    // Filter posts marked as new or hot, maintaining newest order
    const latestItems = [...posts]
      .filter((p) => p.isNew || p.isHot)
      .slice(0, 6);

    const selected = latestItems.length >= 6 ? latestItems : posts.slice(0, 6);

    return selected.map((post, idx) => {
      let subText = 'Apply Online';
      if (post.category === 'admit_card') {
        subText = 'Download Admit Card';
      } else if (post.category === 'result') {
        subText = 'Check Result / Score';
      } else if (post.category === 'answer_key') {
        subText = 'Check Answer Key';
      } else if (post.category === 'admission') {
        subText = 'Admission Open 2026';
      } else if (post.totalVacancies) {
        subText = `${post.totalVacancies} Posts Online Form`;
      }

      return {
        id: post.id,
        slug: post.slug,
        title: post.shortTitle || post.title,
        sub: subText,
        color: GRADIENT_PALETTE[idx % GRADIENT_PALETTE.length],
        isNew: post.isNew
      };
    });
  }, [posts]);

  return (
    <div className="w-full pt-2 pb-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
        {dynamicHighlights.map((box) => (
          <button
            key={box.id}
            onClick={() => onSelectHighlight(box.slug)}
            className={`bg-gradient-to-r ${box.color} hover:opacity-95 text-white p-2 sm:p-2.5 rounded-xs shadow-xs transition-all text-center flex flex-col items-center justify-center min-h-[56px] border border-black/15 group cursor-pointer active:scale-98 relative overflow-hidden`}
          >
            {box.isNew && (
              <span className="absolute top-0 right-0 bg-yellow-400 text-black text-[8px] font-black px-1.5 py-0.5 rounded-bl-xs uppercase tracking-wider animate-pulse">
                NEW
              </span>
            )}
            <span className="font-extrabold text-xs sm:text-sm tracking-tight leading-tight line-clamp-1 group-hover:underline">
              {box.title}
            </span>
            <span className="text-[10px] text-yellow-200 font-semibold leading-tight mt-0.5 line-clamp-1">
              {box.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
