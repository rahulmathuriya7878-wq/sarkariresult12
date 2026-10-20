import React from 'react';
import { SarkariPost } from '../types/job';
import { ChevronRight } from 'lucide-react';
import { isPostVisited } from '../utils/visitedPosts';

interface CertificateVerificationSectionProps {
  certificates: SarkariPost[];
  important: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  isHindi: boolean;
  onViewCategory?: (category: 'certificate_verification' | 'important') => void;
  visitedPostIds?: Set<string>;
}

export const CertificateVerificationSection: React.FC<CertificateVerificationSectionProps> = ({
  certificates,
  important,
  onSelectPost,
  isHindi,
  onViewCategory,
  visitedPostIds = new Set()
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
      {/* 1. Certificate Verification */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-3 px-4 text-center">
          <h2 className="font-black text-[21px] sm:text-[25px] tracking-wide uppercase leading-tight">
            {isHindi ? 'प्रमाण पत्र सत्यापन (Certificate Verification)' : 'Certificate Verification'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {certificates.slice(0, 100).map((post) => {
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
        <div className="bg-[#ab1616] text-white py-3 px-4 text-center">
          <h2 className="font-black text-[21px] sm:text-[25px] tracking-wide uppercase leading-tight">
            {isHindi ? 'महत्वपूर्ण (Important)' : 'Important'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-200 flex-1 p-2">
          {/* Quick Social Channels for Fast Important Alerts */}
          <li className="py-2.5 px-2 sm:px-3 bg-emerald-50/80 hover:bg-emerald-100/80 transition-colors flex items-center justify-between gap-2 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shrink-0 animate-pulse" />
              <a
                href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-[17px] sm:text-[19px] text-emerald-900 hover:underline flex items-center gap-1.5"
              >
                <span>💬 WhatsApp Channel जॉइन करें (Fast Alerts)</span>
              </a>
            </div>
            <a
              href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white text-xs font-black px-2.5 py-1 rounded shadow-2xs hover:bg-[#1fae53] shrink-0"
            >
              Join Us
            </a>
          </li>

          <li className="py-2.5 px-2 sm:px-3 bg-sky-50/80 hover:bg-sky-100/80 transition-colors flex items-center justify-between gap-2 border-b border-sky-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#229ED9] shrink-0 animate-pulse" />
              <a
                href="https://t.me/newsarkariresultt"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-[17px] sm:text-[19px] text-sky-900 hover:underline flex items-center gap-1.5"
              >
                <span>📢 Telegram Channel जॉइन करें (Instant Updates)</span>
              </a>
            </div>
            <a
              href="https://t.me/newsarkariresultt"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#229ED9] text-white text-xs font-black px-2.5 py-1 rounded shadow-2xs hover:bg-[#1a85ba] shrink-0"
            >
              Join Us
            </a>
          </li>

          {important.slice(0, 100).map((post) => {
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
                  {post.lastDate && (
                    <span className="text-base text-red-600 block font-bold mt-1.5">
                      Last Date: {post.lastDate}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
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
