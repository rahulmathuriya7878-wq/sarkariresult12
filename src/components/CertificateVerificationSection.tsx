import React from 'react';
import { SarkariPost } from '../types/job';

interface CertificateVerificationSectionProps {
  certificates: SarkariPost[];
  important: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  isHindi: boolean;
}

export const CertificateVerificationSection: React.FC<CertificateVerificationSectionProps> = ({
  certificates,
  important,
  onSelectPost,
  isHindi
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
      {/* 1. Certificate Verification */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2 px-3 text-center">
          <h2 className="font-extrabold text-base tracking-wide uppercase">
            {isHindi ? 'प्रमाण पत्र सत्यापन (Certificate Verification)' : 'Certificate Verification'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-1">
          {certificates.map((post) => (
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
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Important */}
      <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-2xs">
        <div className="bg-[#ab1616] text-white py-2 px-3 text-center">
          <h2 className="font-extrabold text-base tracking-wide uppercase">
            {isHindi ? 'महत्वपूर्ण (Important)' : 'Important'}
          </h2>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-1">
          {important.map((post) => (
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
        </ul>
      </div>
    </div>
  );
};
