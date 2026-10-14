import React from 'react';
import { Send, Smartphone, ShieldCheck } from 'lucide-react';

interface SarkariFooterProps {
  onOpenAgeCalculator: () => void;
  onOpenPhotoResizer: () => void;
  onOpenJobFinder: () => void;
  onOpenSitemap?: () => void;
  isHindi: boolean;
}

export const SarkariFooter: React.FC<SarkariFooterProps> = ({
  onOpenAgeCalculator,
  onOpenPhotoResizer,
  onOpenJobFinder,
  onOpenSitemap,
  isHindi
}) => {
  return (
    <footer className="w-full bg-[#f8f9fa] border-t-2 border-slate-800 text-slate-700 text-xs mt-8">
      {/* Telegram / WhatsApp alert strip */}
      <div className="bg-slate-900 text-white py-2 px-3 text-center text-xs font-bold">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1.5">
            <Send className="w-4 h-4 text-yellow-300" />
            Join Rajasthan Vacancy Official Telegram Channel for Fast Updates
          </span>
          <button 
            onClick={() => window.open('https://t.me/newsarkariresultt', '_blank')}
            className="bg-white hover:bg-yellow-100 text-slate-900 px-2.5 py-0.5 rounded-xs font-black text-[11px] cursor-pointer"
          >
            Join Now
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Authentic Rajasthan Vacancy SEO Information Text Block */}
        <div className="bg-white p-4 border border-slate-200 rounded-xs space-y-3 text-[11px] leading-relaxed text-slate-600">
          <h3 className="text-xs font-bold text-slate-900 uppercase">
            Rajasthan Vacancy (RajasthanVacancy.in) : Rajasthan Government Jobs & Bharti Portal
          </h3>
          <p>
            Find all latest Rajasthan government jobs (Rajasthan Sarkari Naukri) and recruitment notifications issued by <strong>RSMSSB (RSSB), RPSC, Rajasthan Police, High Court, Animal Husbandry, Medical & Health, Teacher Bharti (1st Grade, 2nd Grade, REET), LDC, Patwari, VDO, and Pashu Paricharak</strong>.
          </p>
          <p>
            <strong>RajasthanVacancy.in</strong> is Rajasthan's premier portal for <strong>Latest Jobs, Admit Cards, Exam Results, Answer Keys, Detailed Syllabus, CET Updates, and Online Application Forms</strong> with direct verified official links.
          </p>
        </div>

        {/* Quick Links Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-[#ab1616] uppercase mb-2">Central Exams</h4>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• UPSC Civil Services (IAS / IPS)</li>
              <li>• SSC CGL, CHSL, MTS & GD</li>
              <li>• Railway RRB NTPC & Group D</li>
              <li>• IBPS PO, Clerk & SO</li>
              <li>• NTA NEET UG & JEE Main</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#ab1616] uppercase mb-2">State Recruitments</h4>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• UP Police Constable & SI</li>
              <li>• UPSSSC PET & Lekhpal</li>
              <li>• BPSC 71st CCE Bihar</li>
              <li>• Bihar Police Constable CSBC</li>
              <li>• Rajasthan Police & REET</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#ab1616] uppercase mb-2">Candidate Tools</h4>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>
                <button onClick={onOpenAgeCalculator} className="text-[#0000cc] hover:underline cursor-pointer">
                  • Online Age Calculator
                </button>
              </li>
              <li>
                <button onClick={onOpenPhotoResizer} className="text-[#0000cc] hover:underline cursor-pointer">
                  • Photo & Signature Resizer (KB)
                </button>
              </li>
              <li>
                <button onClick={onOpenJobFinder} className="text-[#0000cc] hover:underline cursor-pointer">
                  • Job Finder by Qualification
                </button>
              </li>
              <li>
                <button onClick={onOpenSitemap} className="text-[#0000cc] hover:underline font-bold cursor-pointer">
                  • Dynamic XML Sitemap (SEO)
                </button>
              </li>
              <li>• PAN Card Online Apply</li>
              <li>• Aadhaar PVC Card Download</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#ab1616] uppercase mb-2">Board Results</h4>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• UP Board 10th & 12th Result</li>
              <li>• CBSE Class 10th & 12th Result</li>
              <li>• Bihar Board BSEB Matric Result</li>
              <li>• Rajasthan RBSE Board Result</li>
              <li>• ICSE / ISC Examination Result</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 leading-normal">
          <p>
            <strong>Disclaimer:</strong> Sarkari Result is an educational news portal and is not associated with any government agency or recruitment board. While we strive to ensure all information is accurate and up-to-date, candidates are requested to verify details from official government notifications before taking action.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-slate-600 border-t border-slate-200 pt-3 font-medium flex flex-wrap items-center justify-center gap-2">
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
