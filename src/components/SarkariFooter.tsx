import React from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { SarkariPost } from '../types/job';
import { mockSarkariPosts } from '../data/mockJobs';

interface SarkariFooterProps {
  onOpenAgeCalculator?: () => void;
  onOpenPhotoResizer?: () => void;
  onOpenJobFinder?: () => void;
  onOpenSitemap?: () => void;
  onSelectPost?: (post: SarkariPost) => void;
  isHindi: boolean;
}

export const SarkariFooter: React.FC<SarkariFooterProps> = ({
  onOpenAgeCalculator: _onOpenAgeCalculator,
  onOpenPhotoResizer: _onOpenPhotoResizer,
  onOpenJobFinder: _onOpenJobFinder,
  onOpenSitemap,
  onSelectPost,
  isHindi
}) => {
  const rajasthanJobs = mockSarkariPosts.filter(p => p.state === 'Rajasthan');

  return (
    <footer className="w-full bg-[#f8f9fa] border-t-2 border-slate-800 text-slate-700 text-xs mt-8">
      {/* Telegram alert strip */}
      <div className="bg-slate-900 text-white py-2.5 px-3 text-center text-xs font-bold border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <a 
            href="https://t.me/newsarkariresultt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#229ED9] hover:bg-[#1d8cb0] text-white px-4 py-2 rounded-xs font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            title="Join Official Telegram Channel"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Join Telegram</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Authentic Sarkari Result SEO Information Text Block */}
        <div className="border-2 border-[#ab1616] bg-white rounded-xs overflow-hidden shadow-2xs">
          <div className="bg-[#ab1616] text-white py-3.5 px-4 text-center sm:text-left">
            <h2 className="font-black text-lg sm:text-xl tracking-wide uppercase">
              {isHindi ? 'सरकारी रिजल्ट पोर्टल : नवीनतम सरकारी नौकरियां व परीक्षा परिणाम' : 'Sarkari Result Portal : Latest Govt Jobs, Admit Cards & Exam Results'}
            </h2>
          </div>
          <div className="p-4 sm:p-5 space-y-3 text-base sm:text-lg leading-relaxed text-slate-800 bg-white">
            <p>
              Find all latest government jobs (Sarkari Naukri) and recruitment notifications issued by <strong className="text-slate-900 font-extrabold">UPSC, SSC, Banking, Railways, Defense, State PSC, Police, and Teaching examinations</strong> across India.
            </p>
            <p>
              <strong className="text-[#ab1616] font-black">Sarkari Result</strong> is India's premier portal for <strong className="text-slate-900 font-extrabold">Latest Jobs, Admit Cards, Exam Results, Answer Keys, Detailed Syllabus, and Online Application Forms</strong> with direct verified official links.
            </p>
          </div>
        </div>

        {/* Dedicated Rajasthan Government Jobs (राजस्थान सरकारी नौकरी भर्ती सूची 2026) Section */}
        <div className="border-2 border-[#ab1616] bg-white rounded-xs overflow-hidden shadow-2xs">
          <div className="bg-[#ab1616] text-white py-3.5 px-4 text-center">
            <h2 className="font-black text-lg sm:text-xl tracking-wide uppercase flex items-center justify-center gap-2">
              <span>🏛️ {isHindi ? 'राजस्थान सरकारी नौकरी भर्ती सूची 2026' : 'Rajasthan Government Jobs List 2026 (राजस्थान सरकारी नौकरियां)'}</span>
            </h2>
          </div>

          <ul className="divide-y divide-slate-200 p-2">
            {rajasthanJobs.map((job) => (
              <li
                key={job.id}
                onClick={() => onSelectPost?.(job)}
                className="py-3.5 px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-3"
              >
                <span className="text-[#ab1616] font-black leading-tight text-lg">•</span>
                <div className="flex-1">
                  <span className="font-extrabold text-lg sm:text-xl text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug">
                    {job.title}
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs sm:text-sm font-bold">
                    {job.totalVacancies && (
                      <span className="bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded border border-emerald-300">
                        कुल पद: {typeof job.totalVacancies === 'number' ? job.totalVacancies.toLocaleString('en-IN') : job.totalVacancies} Posts
                      </span>
                    )}
                    {job.lastDate && (
                      <span className="bg-red-100 text-red-900 px-2.5 py-0.5 rounded border border-red-300">
                        अंतिम तिथि (Last Date): {job.lastDate}
                      </span>
                    )}
                    <span className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded border border-amber-300">
                      राजस्थान SSO पोर्टल भर्ती
                    </span>
                    {job.qualifications && job.qualifications.length > 0 && (
                      <span className="text-slate-600 font-medium">
                        पात्रता: {job.qualifications.join(' / ')}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Prominent Large Font Disclaimer Box */}
        <div className="border-2 border-amber-400 bg-amber-50/70 rounded-xs p-4 sm:p-5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-amber-950 font-black text-lg sm:text-xl tracking-wide uppercase">
            <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
            <span>{isHindi ? 'महत्वपूर्ण अस्वीकरण (Disclaimer)' : 'Disclaimer (महत्वपूर्ण अस्वीकरण)'}</span>
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-slate-900 font-semibold">
            {isHindi ? (
              <>
                <strong className="text-red-700 font-black">नोट / Disclaimer: </strong>
                Sarkari Result एक स्वतंत्र शैक्षणिक एवं रोजगार समाचार पोर्टल है और इसका किसी भी सरकारी विभाग, मंत्रालय अथवा भर्ती बोर्ड से कोई सीधा संबंध नहीं है। यद्यपि हम सभी जानकारियों को आधिकारिक विज्ञप्तियों से सत्यापित करके ही प्रकाशित करते हैं, फिर भी किसी भी भर्ती, प्रवेश या सेवा में आवेदन करने अथवा शुल्क भुगतान करने से पूर्व संबंधित विभाग की आधिकारिक अधिसूचना (Official Notification) अवश्य देखें।
              </>
            ) : (
              <>
                <strong className="text-red-700 font-black">Disclaimer: </strong>
                Sarkari Result is an educational news and career information portal and is not affiliated with any government agency, department, or recruitment board. While we strive to provide authentic and verified information from official sources, candidates are strictly advised to cross-check all details from official government notifications before taking action.
              </>
            )}
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs sm:text-sm text-slate-600 border-t border-slate-200 pt-3 font-medium flex flex-wrap items-center justify-center gap-2">
          <span>© 2026 Sarkari Result · All Rights Reserved · SARKARI RESULT</span>
          <span>·</span>
          <button onClick={onOpenSitemap} className="text-[#0000cc] hover:underline font-bold cursor-pointer">
            sitemap.xml
          </button>
        </div>
      </div>
    </footer>
  );
};
