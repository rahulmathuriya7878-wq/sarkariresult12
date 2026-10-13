import React, { useEffect, useState } from 'react';
import { SarkariPost } from '../types/job';
import { 
  ArrowLeft, 
  Printer, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Check, 
  ExternalLink, 
  Calendar, 
  CreditCard, 
  UserCheck, 
  FileText, 
  Calculator, 
  AlertCircle,
  Building,
  GraduationCap,
  ChevronRight,
  Send,
  Home
} from 'lucide-react';

interface FullPagePostViewProps {
  post: SarkariPost;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  onOpenAgeCalculator: () => void;
  onOpenPhotoResizer: () => void;
  isHindi: boolean;
}

export const FullPagePostView: React.FC<FullPagePostViewProps> = ({
  post,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onOpenAgeCalculator,
  onOpenPhotoResizer,
  isHindi
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSimulationLink, setActiveSimulationLink] = useState<{ title: string; action: string; content: string } | null>(null);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [post.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '#' + post.slug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLinkAction = (link: { label: string; actionText: string; type: string }) => {
    let content = '';
    if (link.type === 'apply') {
      content = `Application Portal for ${post.shortTitle} is ACTIVE. Register your One Time Registration (OTR), upload candidate photograph & signature, and submit online fee before ${post.lastDate || 'the closing date'}.`;
    } else if (link.type === 'notification') {
      content = `Official Notification Document (${post.notificationNumber || 'Official Advt Notice'}) has been verified. Download and read all terms and conditions before applying.`;
    } else if (link.type === 'admit_card') {
      content = `E-Admit Card / Hall Ticket gateway for ${post.shortTitle}. Enter your Registration No. and Date of Birth to check your allotted Exam City & download Call Letter.`;
    } else if (link.type === 'result') {
      content = `Official Selection Merit List & Category-wise Cutoff marks published for ${post.shortTitle}.`;
    } else if (link.type === 'syllabus') {
      content = `Complete Subject Syllabus & Examination Scheme PDF for ${post.shortTitle}.`;
    } else {
      content = `Official Portal link for ${post.department} recruitment authority.`;
    }

    setActiveSimulationLink({
      title: link.label,
      action: link.actionText,
      content
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-100/70 pb-16">
      {/* 1. Sticky Action / Navigation Bar */}
      <div className="bg-[#ab1616] text-white py-2.5 px-4 sticky top-0 z-40 shadow-md border-b border-red-900">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/25 hover:bg-black/40 text-white rounded font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? '← मुख्य पृष्ठ (Home)' : '← Back to Home Page'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(post.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-black/25 hover:bg-black/40 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              title="Save / Bookmark"
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-yellow-300" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-black/25 hover:bg-black/40 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              title="Print Notification"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-black/25 hover:bg-black/40 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              title="Share / Copy Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Document Container */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
          <button onClick={onBack} className="hover:text-[#ab1616] flex items-center gap-1 cursor-pointer font-medium">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="capitalize text-slate-600">{post.category.replace('_', ' ')}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-900 truncate max-w-xs">{post.shortTitle}</span>
        </nav>

        {/* Paper Container */}
        <article className="bg-white rounded-xs shadow-xs border border-slate-300 overflow-hidden">
          {/* Post Header */}
          <div className="p-5 sm:p-8 text-center border-b border-slate-200 bg-linear-to-b from-red-50/30 to-white">
            <div className="inline-block bg-[#ab1616] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-xs uppercase tracking-wider mb-2">
              {post.department} · {post.state}
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-[#ab1616] leading-tight font-sans">
              {post.title}
            </h1>

            {post.hindiTitle && (
              <p className="text-base sm:text-lg font-bold text-slate-800 mt-2 font-serif">
                {post.hindiTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-4 text-xs text-slate-600 border-t border-slate-200/80 pt-3">
              <span>Post Date: <strong className="text-slate-900">{post.postDate}</strong></span>
              <span aria-hidden="true" className="text-slate-300">|</span>
              <span>Advertisement No: <strong className="text-slate-900">{post.notificationNumber || 'Official Notice'}</strong></span>
              {post.totalVacancies && (
                <>
                  <span aria-hidden="true" className="text-slate-300">|</span>
                  <span>Total Vacancies: <strong className="text-emerald-700 font-bold">{post.totalVacancies} Posts</strong></span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-6 text-slate-800 text-sm">
            {/* Short Info Box */}
            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-xs text-xs sm:text-sm leading-relaxed text-amber-950">
              <strong className="text-amber-900 uppercase font-bold block mb-1">Short Information / संक्षिप्त जानकारी:</strong>
              {post.shortInfo}
            </div>

            {/* Quick Tools Row for Candidate */}
            <div className="bg-slate-50 p-3 rounded-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#ab1616]" />
                Useful Candidate Tools for this Application:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAgeCalculator}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-semibold transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#ab1616]" />
                  Check Age Eligibility
                </button>
                <button
                  onClick={onOpenPhotoResizer}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-semibold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  Resize Photo (20-50 KB)
                </button>
              </div>
            </div>

            {/* 2-Column Split: Important Dates & Application Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Important Dates Box */}
              <div className="border-2 border-[#ab1616] rounded-xs overflow-hidden bg-white shadow-2xs">
                <div className="bg-[#ab1616] text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yellow-300" />
                  Important Dates (महत्वपूर्ण तिथियां)
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {post.importantDates.map((d, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-3 ${d.isHighlight ? 'bg-red-50/90 font-bold text-red-950' : 'text-slate-800'}`}
                    >
                      <span>{d.label}</span>
                      <span className={d.isHighlight ? 'text-[#ab1616] font-extrabold' : 'text-slate-900 font-semibold'}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Fee Box */}
              <div className="border-2 border-slate-800 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-300" />
                  Application Fee (आवेदन शुल्क)
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {post.applicationFee.length > 0 ? (
                    post.applicationFee.map((fee, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3">
                        <span className="text-slate-700">{fee.category}</span>
                        <strong className="text-slate-900 font-bold">{fee.amount}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-slate-500 italic">No Application Fee for this notification / Result update.</div>
                  )}
                  {post.feePaymentMode && (
                    <div className="p-3 bg-slate-50 text-xs text-slate-600">
                      <strong>Payment Mode: </strong>{post.feePaymentMode}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Age Limit Box */}
            {post.ageLimit.asOnDate && (
              <div className="border border-emerald-800 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-emerald-800 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-200" />
                    Age Limit as on {post.ageLimit.asOnDate} (आयु सीमा)
                  </div>
                  <button
                    onClick={onOpenAgeCalculator}
                    className="text-xs underline text-amber-200 hover:text-white transition-colors cursor-pointer"
                  >
                    Calculate My Age Now →
                  </button>
                </div>
                <div className="p-4 text-xs sm:text-sm space-y-2 bg-emerald-50/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium text-slate-800">
                    {post.ageLimit.minAge && <div>Minimum Age: <strong className="text-slate-900 font-bold">{post.ageLimit.minAge} Years.</strong></div>}
                    {post.ageLimit.maxAge && <div>Maximum Age: <strong className="text-slate-900 font-bold">{post.ageLimit.maxAge} Years.</strong></div>}
                  </div>
                  {post.ageLimit.notes && (
                    <p className="text-xs text-slate-600 italic pt-1 border-t border-slate-100">
                      {post.ageLimit.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Vacancy Details Table */}
            {post.vacancyBreakdown.length > 0 && (
              <div className="border border-blue-900 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-blue-950 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  Vacancy Details & Eligibility Criteria (कुल पद व पात्रता)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                        <th className="p-3">Post Name</th>
                        <th className="p-3 w-28 text-center">Total Posts</th>
                        <th className="p-3">Eligibility Criteria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {post.vacancyBreakdown.map((vac, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{vac.postName}</td>
                          <td className="p-3 text-center font-bold text-emerald-700 text-base">{vac.totalPosts}</td>
                          <td className="p-3 text-slate-700 leading-relaxed">{vac.eligibility}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* How to Fill Form Steps */}
            {post.howToApplySteps.length > 0 && (
              <div className="border border-slate-300 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-slate-800 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  How to Fill {post.shortTitle} Online Form (आवेदन कैसे करें)
                </div>
                <div className="p-4 text-xs sm:text-sm space-y-2 bg-slate-50/50">
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
                    {post.howToApplySteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* The Iconic Sarkari Useful Links Table */}
            <div className="border-2 border-[#ab1616] rounded-xs overflow-hidden bg-white shadow-sm">
              <div className="bg-[#ab1616] text-white text-center py-3 px-4 font-extrabold text-sm sm:text-base tracking-wide uppercase">
                Interested Candidates Can Read the Full Notification Before Apply Online
                <span className="block text-xs font-normal text-yellow-200 mt-0.5">
                  SOME USEFUL IMPORTANT LINKS (महत्वपूर्ण उपयोगी लिंक्स)
                </span>
              </div>
              <div className="divide-y divide-slate-200 text-xs sm:text-sm">
                {post.directLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 hover:bg-red-50/40 transition-colors">
                    <span className="font-bold text-slate-900">{link.label}</span>
                    <button
                      type="button"
                      onClick={() => handleLinkAction(link)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xs font-bold text-xs shadow-2xs transition-all cursor-pointer ${
                        link.isPrimary 
                          ? 'bg-[#ab1616] hover:bg-red-800 text-white text-sm' 
                          : 'bg-[#0000cc] hover:bg-blue-800 text-white'
                      }`}
                    >
                      <span>{link.actionText}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Home Button at bottom of page */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                onClick={onBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isHindi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Sarkari Result Home Page'}</span>
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs text-red-700 hover:underline font-semibold cursor-pointer"
              >
                ↑ Go to Top of Page
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* Simulated Action Gateway Modal */}
      {activeSimulationLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700" />
                {activeSimulationLink.title}
              </h3>
              <button 
                onClick={() => setActiveSimulationLink(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeSimulationLink.content}
            </p>
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-[11px] text-emerald-800 font-mono">
              ✓ Verified Official Gateway Link
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveSimulationLink(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-800 hover:bg-red-900 rounded transition-colors cursor-pointer"
              >
                Close Gateway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
