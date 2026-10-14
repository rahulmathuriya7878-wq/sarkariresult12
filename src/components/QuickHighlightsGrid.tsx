import React from 'react';
import { highlightBoxes } from '../data/mockJobs';

interface QuickHighlightsGridProps {
  onSelectHighlight: (slug: string) => void;
}

export const QuickHighlightsGrid: React.FC<QuickHighlightsGridProps> = ({ onSelectHighlight }) => {
  return (
    <div className="w-full pt-2 pb-3">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {highlightBoxes.map((box) => (
          <button
            key={box.id}
            onClick={() => onSelectHighlight(box.slug)}
            className={`bg-gradient-to-r ${box.color} hover:opacity-90 text-white p-2 sm:p-2.5 rounded-xs shadow-xs transition-all text-center flex flex-col items-center justify-center min-h-[52px] border border-black/15 group cursor-pointer active:scale-98`}
          >
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
