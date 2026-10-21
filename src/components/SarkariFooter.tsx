import React from 'react';
import { Send, AlertTriangle, MessageCircle, ExternalLink } from 'lucide-react';
import { SarkariPost } from '../types/job';

interface SarkariFooterProps {
  onOpenAgeCalculator?: () => void;
  onOpenPhotoResizer?: () => void;
  onOpenJobFinder?: () => void;
  onOpenAdmin?: () => void;
  onSelectPost?: (post: SarkariPost) => void;
  onOpenPostBySlug: (slug: string) => void;
  isHindi: boolean;
}

export const SarkariFooter: React.FC<SarkariFooterProps> = ({
  onOpenAgeCalculator: _onOpenAgeCalculator,
  onOpenPhotoResizer: _onOpenPhotoResizer,
  onOpenJobFinder: _onOpenJobFinder,
  onOpenAdmin,
  onOpenPostBySlug,
  isHindi
}) => {
  return (
    <footer className="w-full bg-white text-slate-800 text-xs mt-10 border-t-4 border-[#ab1616] shadow-sm">
      {/* 1. Official Social Alert Ribbon */}
      <div className="bg-[#ab1616] text-white py-3 px-4 text-center border-b border-red-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm font-bold flex items-center gap-2">
            <span className="text-amber-300 font-black text-lg">★</span>
            <span>Join Sarkari Result Official Channels for Fastest Job Alerts & Exam Updates</span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 px-4 py-2 rounded-xs font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer border border-emerald-300"
              title="Join Official WhatsApp Channel"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 text-emerald-100" />
              <span>WhatsApp Channel</span>
            </a>

            <a 
              href="https://t.me/newsarkariresultt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#229ED9] hover:bg-[#1d8cb0] text-white px-4 py-2 rounded-xs font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              title="Join Official Telegram Channel"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Telegram Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main 3-Column Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 border-b border-slate-700">
          
          {/* Column 1: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider border-b border-slate-300 pb-1.5 flex items-center gap-1.5">
              <span className="text-amber-500">■</span>
              <span>Quick Links (महत्वपूर्ण लिंक्स)</span>
            </h3>
            <ul className="space-y-2 text-slate-700 text-xs">
              <li>
                <a href="#results" className="hover:text-[#7e22ce] hover:underline flex items-center gap-1">
                  <span>• Sarkari Result 2026</span>
                </a>
              </li>
              <li>
                <a href="#latest_jobs" className="hover:text-[#7e22ce] hover:underline flex items-center gap-1">
                  <span>• Latest Online Form 2026</span>
                </a>
              </li>
              <li>
                <a href="#admit_card" className="hover:text-[#7e22ce] hover:underline flex items-center gap-1">
                  <span>• Sarkari Admit Card Download</span>
                </a>
              </li>
              <li>
                <a href="#answer_key" className="hover:text-[#7e22ce] hover:underline flex items-center gap-1">
                  <span>• Official Answer Key & Solutions</span>
                </a>
              </li>
              <li>
                <a href="#syllabus" className="hover:text-[#7e22ce] hover:underline flex items-center gap-1">
                  <span>• Exam Scheme & Syllabus PDF</span>
                </a>
              </li>
              <li>
                <a href="#admission" className="hover:text-[#7e22ce] hover:underline flex items-center gap-1">
                  <span>• University & College Admission</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Recruitment Boards */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider border-b border-slate-300 pb-1.5 flex items-center gap-1.5">
              <span className="text-amber-500">■</span>
              <span>Top Recruitment (भर्ती बोर्ड)</span>
            </h3>
            <ul className="space-y-2 text-slate-700 text-xs">
              <li>
                <button onClick={() => onOpenPostBySlug('supreme-court-sci-attendant-admit-card-2026')} className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer">
                  • Supreme Court of India (SCI)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPostBySlug('ssc-cgl-2026-online-form')} className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer">
                  • Staff Selection Commission (SSC)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPostBySlug('upsc-civil-services-pre-2026-online-form')} className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer">
                  • Union Public Service Commission (UPSC)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPostBySlug('rrb-technician-grade-i-iii-recruitment-2026')} className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer">
                  • Railway Recruitment Board (RRB)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPostBySlug('up-police-constable-re-exam-result-2026')} className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer">
                  • State Police Constable & SI
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPostBySlug('ctet-july-2026-online-form')} className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer">
                  • Teaching (CTET / REET / TET)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: State Government Jobs */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider border-b border-slate-300 pb-1.5 flex items-center gap-1.5">
              <span className="text-amber-500">■</span>
              <span>State Jobs (राज्य-वार नौकरी)</span>
            </h3>
            <ul className="space-y-2 text-slate-700 text-xs">
              <li>
                <span className="hover:text-[#7e22ce] cursor-pointer">• Uttar Pradesh Sarkari Result</span>
              </li>
              <li>
                <span className="hover:text-[#7e22ce] cursor-pointer">• Bihar Government Vacancy & BPSC</span>
              </li>
              <li>
                <span className="hover:text-[#7e22ce] cursor-pointer">• Rajasthan Govt Jobs & RSMSSB</span>
              </li>
              <li>
                <span className="hover:text-[#7e22ce] cursor-pointer">• Madhya Pradesh MPESB Online</span>
              </li>
              <li>
                <span className="hover:text-[#7e22ce] cursor-pointer">• Delhi DSSSB & High Court Recruitment</span>
              </li>
              <li>
                <span className="hover:text-[#7e22ce] cursor-pointer">• All India Central Government Jobs</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Authentic Sarkari Result High-Visibility Disclaimer Box */}
        <div className="my-6 border-2 border-red-300 bg-slate-50 rounded-xs p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between gap-2 text-red-700 font-black text-sm uppercase">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{isHindi ? 'महत्वपूर्ण सूचना (Disclaimer Notice)' : 'Official Disclaimer Notice'}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {isHindi ? (
              <>
                <strong className="text-[#7e22ce] font-bold">Disclaimer: </strong>
                Sarkari Result एक स्वतंत्र शैक्षणिक समाचार व रोजगार सूचना मंच है। इस वेबसाइट पर प्रकाशित सभी जानकारियां केवल परीक्षार्थियों की तत्काल सूचना हेतु हैं और इसे किसी भी प्रकार से कानूनी दस्तावेज (Legal Document) नहीं माना जा सकता। यद्यपि हम सभी सूचनाओं को आधिकारिक विज्ञप्ति से जांचकर प्रकाशित करते हैं, फिर भी किसी भी भर्ती में आवेदन करने या शुल्क भुगतान करने से पहले संबंधित आयोग/विभाग की आधिकारिक वेबसाइट पर मूल अधिसूचना अवश्य पढ़ें।
              </>
            ) : (
              <>
                <strong className="text-[#7e22ce] font-bold">Disclaimer: </strong>
                The Examination Results / Marks published on this Website are only for immediate information to examinees and do not constitute a legal document. While all efforts have been made to make the information on this website authentic, Sarkari Result is not responsible for any inadvertent error that may have crept into the results or notifications published. Candidates must cross-check all details with the official recruitment board website before taking action.
              </>
            )}
          </p>
        </div>

        {/* 4. Bottom Copyright & Admin Strip */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs">
          <div className="text-center sm:text-left">
            <span>Copyright © 2026 Sarkari Result - </span>
            <span 
              onClick={onOpenAdmin} 
              className="cursor-default select-none"
              title="Sarkari Result"
            >
              All Rights Reserved.
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => onOpenPostBySlug('privacy-policy')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPostBySlug('disclaimer')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPostBySlug('rules-and-regulations')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              Rules
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPostBySlug('contact-us')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
