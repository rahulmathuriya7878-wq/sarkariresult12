import React from 'react';
import { SarkariPost } from '../types/job';
import { ChevronRight } from 'lucide-react';

interface SarkariSecondaryGridProps {
  answerKeys: SarkariPost[];
  syllabi: SarkariPost[];
  admissions: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onViewCategory: (category: 'answer_key' | 'syllabus' | 'admission') => void;
  isHindi: boolean;
}

export const SarkariSecondaryGrid: React.FC<SarkariSecondaryGridProps> = ({
  answerKeys,
  syllabi,
  admissions,
  onSelectPost,
  onViewCategory,
  isHindi
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
      {/* 1. Answer Key Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2 px-3 text-center">
          <h2 className="font-extrabold text-sm sm:text-base uppercase tracking-wider">
            {isHindi ? 'उत्तर कुंजी (Answer Key)' : 'Answer Key'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-1">
          {answerKeys.slice(0, 8).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2.5 px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-2 text-sm sm:text-base"
            >
              <span className="text-[#ab1616] font-black leading-tight text-base">•</span>
              <div className="flex-1">
                <span className="font-bold text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="p-2 text-center bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => onViewCategory('answer_key')}
            className="text-sm font-bold text-[#ab1616] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Answer Key</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Syllabus Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2 px-3 text-center">
          <h2 className="font-extrabold text-sm sm:text-base uppercase tracking-wider">
            {isHindi ? 'सिलेबस (Syllabus)' : 'Syllabus'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-1">
          {syllabi.slice(0, 8).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2.5 px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-2 text-sm sm:text-base"
            >
              <span className="text-[#ab1616] font-black leading-tight text-base">•</span>
              <div className="flex-1">
                <span className="font-bold text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="p-2 text-center bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => onViewCategory('syllabus')}
            className="text-sm font-bold text-[#ab1616] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Syllabus</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Admission Column */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-3 px-3 text-center">
          <h2 className="font-extrabold text-lg sm:text-xl tracking-wide uppercase">
            {isHindi ? 'प्रवेश (Admission)' : 'Admission'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-2">
          {admissions.slice(0, 8).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-3 px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-2.5 text-base sm:text-lg"
            >
              <span className="text-[#ab1616] font-black leading-tight text-lg">•</span>
              <div className="flex-1">
                <span className="font-bold text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="p-2.5 text-center bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => onViewCategory('admission')}
            className="text-base font-bold text-[#ab1616] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View More Admission</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
