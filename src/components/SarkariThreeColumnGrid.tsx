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
      {/* 1. Latest Jobs Column */}
      <div className="border-2 border-slate-800 bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-slate-900 text-white py-2.5 px-3 text-center">
          <h2 className="font-black text-sm sm:text-base tracking-wide uppercase">
            {isHindi ? 'सरकारी नौकरी (Latest Jobs)' : 'Latest Jobs'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-1">
          {latestJobs.slice(0, 10).map((post, idx) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2.5 px-2.5 hover:bg-slate-100 transition-colors cursor-pointer group flex items-start gap-2"
            >
              <span className="text-slate-800 font-black leading-tight text-sm">•</span>
              <div className="flex-1">
                <span className="font-extrabold text-sm sm:text-base text-[#0000cc] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.lastDate && (
                  <span className="text-xs text-red-800 block font-bold mt-1">
                    Last Date: {post.lastDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {latestJobs.length === 0 && (
            <li className="p-4 text-center text-xs text-slate-500 font-medium">
              No job notifications available.
            </li>
          )}
        </ul>

        <div className="p-2 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('latest_jobs')}
            className="text-xs sm:text-sm font-extrabold text-slate-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View More Latest Jobs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Admit Card Column */}
      <div className="border-2 border-slate-800 bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-slate-900 text-white py-2.5 px-3 text-center">
          <h2 className="font-black text-sm sm:text-base tracking-wide uppercase">
            {isHindi ? 'प्रवेश पत्र (Admit Card)' : 'Admit Card'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-1">
          {admitCards.slice(0, 10).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2.5 px-2.5 hover:bg-slate-100 transition-colors cursor-pointer group flex items-start gap-2"
            >
              <span className="text-slate-800 font-black leading-tight text-sm">•</span>
              <div className="flex-1">
                <span className="font-extrabold text-sm sm:text-base text-[#0000cc] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.examDate && (
                  <span className="text-xs text-slate-800 block font-bold mt-1">
                    Exam Date: {post.examDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {admitCards.length === 0 && (
            <li className="p-4 text-center text-xs text-slate-500 font-medium">
              No admit cards available.
            </li>
          )}
        </ul>

        <div className="p-2 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('admit_card')}
            className="text-xs sm:text-sm font-extrabold text-slate-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View More Admit Card</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Result Column */}
      <div className="border-2 border-slate-800 bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-slate-900 text-white py-2.5 px-3 text-center">
          <h2 className="font-black text-sm sm:text-base tracking-wide uppercase">
            {isHindi ? 'परिणाम (Result)' : 'Result'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-1">
          {results.slice(0, 10).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2.5 px-2.5 hover:bg-slate-100 transition-colors cursor-pointer group flex items-start gap-2"
            >
              <span className="text-slate-800 font-black leading-tight text-sm">•</span>
              <div className="flex-1">
                <span className="font-extrabold text-sm sm:text-base text-[#0000cc] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.resultDate && (
                  <span className="text-xs text-slate-800 block font-bold mt-1">
                    Declared: {post.resultDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {results.length === 0 && (
            <li className="p-4 text-center text-xs text-slate-500 font-medium">
              No results available.
            </li>
          )}
        </ul>

        <div className="p-2 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('result')}
            className="text-xs sm:text-sm font-extrabold text-slate-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View More Result</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
