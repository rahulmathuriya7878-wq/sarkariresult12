import React from 'react';
import { SarkariPost } from '../types/job';
import { ChevronRight } from 'lucide-react';
import { isPostVisited } from '../utils/visitedPosts';

interface SarkariSecondaryGridProps {
  answerKeys: SarkariPost[];
  syllabi: SarkariPost[];
  admissions: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onViewCategory: (category: 'answer_key' | 'syllabus' | 'admission') => void;
  isHindi: boolean;
  visitedPostIds?: Set<string>;
}

export const SarkariSecondaryGrid: React.FC<SarkariSecondaryGridProps> = ({
  answerKeys,
  syllabi,
  admissions,
  onSelectPost,
  onViewCategory,
  isHindi,
  visitedPostIds = new Set()
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
      {/* 1. Answer Key Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2.5 px-4 text-center">
          <h2 className="font-black text-[21px] sm:text-[25px] tracking-wide uppercase leading-tight">
            {isHindi ? 'उत्तर कुंजी (Answer Key)' : 'Answer Key'}
          </h2>
          <span className="block text-xs sm:text-sm font-handwriting text-yellow-200 font-bold tracking-normal normal-case mt-0.5">
            ✍️ उत्तर कुंजी व प्रश्न पत्र समाधान
          </span>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {answerKeys.slice(0, 100).map((post) => {
            const visited = isPostVisited(visitedPostIds, post);
            return (
              <li
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="py-3 px-2 sm:px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-2.5 sm:gap-3"
              >
                <span className="text-[#ab1616] font-black leading-tight text-xl shrink-0 mt-0.5">•</span>
                <div className="flex-1 min-w-0">
                  <span className={`font-extrabold text-[18px] sm:text-[21px] ${visited ? 'text-[#551a8b]' : 'text-[#0000cc]'} group-hover:text-[#ab1616] group-hover:underline leading-snug break-words block`}>
                    {post.shortTitle}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="p-3 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('answer_key')}
            className="text-base sm:text-lg font-extrabold text-[#ab1616] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Answer Key</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Syllabus Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2.5 px-4 text-center">
          <h2 className="font-black text-[21px] sm:text-[25px] tracking-wide uppercase leading-tight">
            {isHindi ? 'सिलेबस (Syllabus)' : 'Syllabus'}
          </h2>
          <span className="block text-xs sm:text-sm font-handwriting text-yellow-200 font-bold tracking-normal normal-case mt-0.5">
            ✍️ विषयवार नवीनतम पाठ्यक्रम
          </span>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {syllabi.slice(0, 100).map((post) => {
            const visited = isPostVisited(visitedPostIds, post);
            return (
              <li
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="py-3 px-2 sm:px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-2.5 sm:gap-3"
              >
                <span className="text-[#ab1616] font-black leading-tight text-xl shrink-0 mt-0.5">•</span>
                <div className="flex-1 min-w-0">
                  <span className={`font-extrabold text-[18px] sm:text-[21px] ${visited ? 'text-[#551a8b]' : 'text-[#0000cc]'} group-hover:text-[#ab1616] group-hover:underline leading-snug break-words block`}>
                    {post.shortTitle}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="p-3 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('syllabus')}
            className="text-base sm:text-lg font-extrabold text-[#ab1616] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Syllabus</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Admission Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2.5 px-4 text-center">
          <h2 className="font-black text-[21px] sm:text-[25px] tracking-wide uppercase leading-tight">
            {isHindi ? 'प्रवेश (Admission)' : 'Admission'}
          </h2>
          <span className="block text-xs sm:text-sm font-handwriting text-yellow-200 font-bold tracking-normal normal-case mt-0.5">
            ✍️ कॉलेज व प्रवेश परीक्षा विवरण
          </span>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {admissions.slice(0, 100).map((post) => {
            const visited = isPostVisited(visitedPostIds, post);
            return (
              <li
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="py-3 px-2 sm:px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-2.5 sm:gap-3"
              >
                <span className="text-[#ab1616] font-black leading-tight text-xl shrink-0 mt-0.5">•</span>
                <div className="flex-1 min-w-0">
                  <span className={`font-extrabold text-[18px] sm:text-[21px] ${visited ? 'text-[#551a8b]' : 'text-[#0000cc]'} group-hover:text-[#ab1616] group-hover:underline leading-snug break-words block`}>
                    {post.shortTitle}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="p-3 text-center bg-slate-100 border-t border-slate-300">
          <button
            onClick={() => onViewCategory('admission')}
            className="text-base sm:text-lg font-extrabold text-[#ab1616] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Admission</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
