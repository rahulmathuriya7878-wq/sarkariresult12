import React from 'react';
import { SarkariPost } from '../types/job';
import { ChevronRight } from 'lucide-react';

interface CertificateVerificationSectionProps {
  certificates: SarkariPost[];
  important: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  isHindi: boolean;
  onViewCategory?: (category: 'certificate_verification' | 'important') => void;
}

export const CertificateVerificationSection: React.FC<CertificateVerificationSectionProps> = ({
  certificates,
  important,
  onSelectPost,
  isHindi,
  onViewCategory
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
      {/* 1. Certificate Verification */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-3.5 px-4 text-center">
          <h2 className="font-black text-lg sm:text-xl tracking-wide uppercase">
            {isHindi ? 'प्रमाण पत्र सत्यापन (Certificate Verification)' : 'Certificate Verification'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {certificates.slice(0, 8).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-3 px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-3"
            >
              <span className="text-[#ab1616] font-black leading-tight text-lg">•</span>
              <div className="flex-1">
                <span className="font-extrabold text-lg sm:text-xl text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {onViewCategory && (
          <div className="p-3 text-center bg-slate-100 border-t border-slate-300">
            <button
              onClick={() => onViewCategory('certificate_verification')}
              className="text-base sm:text-lg font-extrabold text-[#ab1616] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View More Certificates</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Important Section */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-3.5 px-4 text-center">
          <h2 className="font-black text-lg sm:text-xl tracking-wide uppercase">
            {isHindi ? 'महत्वपूर्ण (Important)' : 'Important'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {important.slice(0, 8).map((post) => (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-3 px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-3"
            >
              <span className="text-[#ab1616] font-black leading-tight text-lg">•</span>
              <div className="flex-1">
                <span className="font-extrabold text-lg sm:text-xl text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                  {post.shortTitle}
                </span>
                {post.lastDate && (
                  <span className="text-base text-red-600 block font-bold mt-2">
                    Last Date: {post.lastDate}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        {onViewCategory && (
          <div className="p-3 text-center bg-slate-100 border-t border-slate-300">
            <button
              onClick={() => onViewCategory('important')}
              className="text-base sm:text-lg font-extrabold text-[#ab1616] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View More Important</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
