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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
      {/* 1. Latest Jobs Column */}
      <div className="border-2 border-slate-800 bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-slate-900 text-white py-3.5 px-4 text-center">
          <h2 className="font-black text-lg sm:text-xl tracking-wide uppercase">
            {isHindi ? 'सरकारी नौकरी (Latest Jobs)' : 'Latest Jobs'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {latestJobs.slice(0, 10).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-3 px-3 hover:bg-slate-100 transition-colors cursor-pointer group flex items-start gap-3"
            >
              <span className="text-slate-900 font-black leading-tight text-lg">•</span>
              <div className="flex-1">
                <span className="font-extrabold text-lg sm:text-xl text-[#0000cc] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.lastDate && (
                  <span className="text-base text-red-700 block font-bold mt-2">
                    Last Date: {post.lastDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {latestJobs.length === 0 && (
            <li className="p-4 text-center text-base text-slate-500 font-medium">
              No job notifications available.
            </li>
          )}
        </ul>

        <div className="p-3 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('latest_jobs')}
            className="text-base sm:text-lg font-extrabold text-slate-900 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Latest Jobs</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Admit Card Column */}
      <div className="border-2 border-slate-800 bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-slate-900 text-white py-3.5 px-4 text-center">
          <h2 className="font-black text-lg sm:text-xl tracking-wide uppercase">
            {isHindi ? 'प्रवेश पत्र (Admit Card)' : 'Admit Card'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {admitCards.slice(0, 10).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-3 px-3 hover:bg-slate-100 transition-colors cursor-pointer group flex items-start gap-3"
            >
              <span className="text-slate-900 font-black leading-tight text-lg">•</span>
              <div className="flex-1">
                <span className="font-extrabold text-lg sm:text-xl text-[#0000cc] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.examDate && (
                  <span className="text-base text-slate-900 block font-bold mt-2">
                    Exam Date: {post.examDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {admitCards.length === 0 && (
            <li className="p-4 text-center text-base text-slate-500 font-medium">
              No admit cards available.
            </li>
          )}
        </ul>

        <div className="p-3 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('admit_card')}
            className="text-base sm:text-lg font-extrabold text-slate-900 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Admit Card</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Result Column */}
      <div className="border-2 border-slate-800 bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-slate-900 text-white py-3.5 px-4 text-center">
          <h2 className="font-black text-lg sm:text-xl tracking-wide uppercase">
            {isHindi ? 'परिणाम (Result)' : 'Result'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {results.slice(0, 10).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-3 px-3 hover:bg-slate-100 transition-colors cursor-pointer group flex items-start gap-3"
            >
              <span className="text-slate-900 font-black leading-tight text-lg">•</span>
              <div className="flex-1">
                <span className="font-extrabold text-lg sm:text-xl text-[#0000cc] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.resultDate && (
                  <span className="text-base text-slate-900 block font-bold mt-2">
                    Declared: {post.resultDate}
                  </span>
                )}
              </div>
            </li>
          ))}

          {results.length === 0 && (
            <li className="p-4 text-center text-base text-slate-500 font-medium">
              No results available.
            </li>
          )}
        </ul>

        <div className="p-3 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('result')}
            className="text-base sm:text-lg font-extrabold text-slate-900 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Result</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
