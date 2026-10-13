import React from 'react';
import { SarkariPost } from '../types/job';
import { ChevronRight } from 'lucide-react';

interface SarkariThreeColumnGridProps {
  results: SarkariPost[];
  admitCards: SarkariPost[];
  latestJobs: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onViewCategory: (category: 'result' | 'admit_card' | 'latest_jobs') => void;
  isHindi: boolean;
}

export const SarkariThreeColumnGrid: React.FC<SarkariThreeColumnGridProps> = ({
  results,
  admitCards,
  latestJobs,
  onSelectPost,
  onViewCategory,
  isHindi
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
      {/* 1. Result Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2 px-3 text-center">
          <h2 className="font-extrabold text-base tracking-wide uppercase">
            {isHindi ? 'परिणाम (Result)' : 'Result'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-1">
          {results.slice(0, 10).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2 px-2 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-1.5 text-xs"
            >
              <span className="text-[#ab1616] font-black leading-tight">•</span>
              <div className="flex-1">
                <span className="font-semibold text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.resultDate && (
                  <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                    Declared: {post.resultDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {results.length === 0 && (
            <li className="p-4 text-center text-xs text-slate-400">
              No results available.
            </li>
          )}
        </ul>

        <div className="p-1.5 text-center bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => onViewCategory('result')}
            className="text-xs font-bold text-[#ab1616] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View More Result</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Admit Card Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2 px-3 text-center">
          <h2 className="font-extrabold text-base tracking-wide uppercase">
            {isHindi ? 'प्रवेश पत्र (Admit Card)' : 'Admit Card'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-1">
          {admitCards.slice(0, 10).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2 px-2 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-1.5 text-xs"
            >
              <span className="text-[#ab1616] font-black leading-tight">•</span>
              <div className="flex-1">
                <span className="font-semibold text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.examDate && (
                  <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                    Exam Date: {post.examDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {admitCards.length === 0 && (
            <li className="p-4 text-center text-xs text-slate-400">
              No admit cards available.
            </li>
          )}
        </ul>

        <div className="p-1.5 text-center bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => onViewCategory('admit_card')}
            className="text-xs font-bold text-[#ab1616] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View More Admit Card</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Latest Jobs Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2 px-3 text-center">
          <h2 className="font-extrabold text-base tracking-wide uppercase">
            {isHindi ? 'सरकारी नौकरी (Latest Jobs)' : 'Latest Jobs'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-1">
          {latestJobs.slice(0, 10).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2 px-2 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-1.5 text-xs"
            >
              <span className="text-[#ab1616] font-black leading-tight">•</span>
              <div className="flex-1">
                <span className="font-semibold text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.lastDate && (
                  <span className="text-[10px] text-red-600 block font-semibold mt-0.5">
                    Last Date: {post.lastDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {latestJobs.length === 0 && (
            <li className="p-4 text-center text-xs text-slate-400">
              No job notifications available.
            </li>
          )}
        </ul>

        <div className="p-1.5 text-center bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => onViewCategory('latest_jobs')}
            className="text-xs font-bold text-[#ab1616] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View More Latest Jobs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
