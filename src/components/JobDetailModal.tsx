import React, { useState } from 'react';
import { SarkariPost } from '../types/job';
import { 
  X, 
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
  GraduationCap
} from 'lucide-react';

interface JobDetailModalProps {
  post: SarkariPost | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  onOpenAgeCalculator: () => void;
  onOpenPhotoResizer: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenAgeCalculator,
  onOpenPhotoResizer
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSimulationLink, setActiveSimulationLink] = useState<{ title: string; action: string; content: string } | null>(null);

  if (!isOpen || !post) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '#' + post.slug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLinkAction = (link: { label: string; actionText: string; type: string }) => {
    // Show high-fidelity action simulation dialog
    let content = '';
    if (link.type === 'apply') {
      content = `Application Portal for ${post.shortTitle} is ACTIVE. Follow the registration guidelines, upload signature and live photograph, and complete fee transaction before ${post.lastDate || 'the last date'}.`;
    } else if (link.type === 'notification') {
      content = `Official Notification (${post.notificationNumber || 'Advt Notice'}) has been published. Read eligibility criteria, exam scheme, and reservation quotas carefully.`;
    } else if (link.type === 'admit_card') {
      content = `E-Admit Card / Hall Ticket download portal for ${post.shortTitle}. Enter your Registration Number and Date of Birth to view exam shift timings & venue.`;
    } else if (link.type === 'result') {
      content = `Official Merit List & Cutoff marks released for ${post.shortTitle}. Check qualified candidate roll numbers in the selection list.`;
    } else if (link.type === 'syllabus') {
      content = `Detailed written exam syllabus and examination marking pattern for ${post.shortTitle}. Negative marking and topic-wise marks distribution available.`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="bg-[#8b0000] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <Building className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-tight uppercase truncate">
              {post.department} · {post.state}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleBookmark(post.id)}
              className="p-1.5 rounded-md hover:bg-black/20 text-white/90 hover:text-white transition-colors"
              title={isBookmarked ? "Remove from Bookmarks" : "Save / Bookmark this post"}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-300" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-md hover:bg-black/20 text-white/90 hover:text-white transition-colors"
              title="Print Notification"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-md hover:bg-black/20 text-white/90 hover:text-white transition-colors"
              title="Copy link to clipboard"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-black/20 text-white/90 hover:text-white transition-colors ml-1"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Post Title Banner (Iconic Sarkari Result Style) */}
          <div className="text-center border-b border-slate-200 pb-5">
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#991b1b] leading-snug">
              {post.title}
            </h1>
            {post.hindiTitle && (
              <p className="text-sm font-semibold text-slate-700 mt-1 font-serif">
                {post.hindiTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-600">
              <span>Post Date: <strong className="text-slate-900">{post.postDate}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Advt No: <strong className="text-slate-900">{post.notificationNumber || 'Official Notice'}</strong></span>
              {post.totalVacancies && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Total Vacancy: <strong className="text-emerald-700 font-bold">{post.totalVacancies} Posts</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Short Info Box */}
          <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-lg text-xs leading-relaxed text-amber-950">
            <strong className="text-amber-900 uppercase font-bold">Short Information: </strong>
            {post.shortInfo}
          </div>

          {/* Quick Helper Tools Prompt Bar */}
          <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-700">Applicant Quick Tools:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAgeCalculator}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-red-700" />
                Check Age Eligibility
              </button>
              <button
                onClick={onOpenPhotoResizer}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                Photo / Signature Resizer
              </button>
            </div>
          </div>

          {/* 2-Column Split: Important Dates & Application Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Important Dates Box */}
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="bg-red-800 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-300" />
                Important Dates (महत्वपूर्ण तिथियां)
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {post.importantDates.map((d, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-2.5 ${d.isHighlight ? 'bg-red-50/80 font-bold text-red-950' : 'text-slate-800'}`}
                  >
                    <span>{d.label}</span>
                    <span className={d.isHighlight ? 'text-red-700' : 'text-slate-900 font-semibold'}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Fee Box */}
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="bg-slate-800 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-300" />
                Application Fee (आवेदन शुल्क)
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {post.applicationFee.length > 0 ? (
                  post.applicationFee.map((fee, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5">
                      <span className="text-slate-700">{fee.category}</span>
                      <strong className="text-slate-900">{fee.amount}</strong>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-slate-500 italic">No Application Fee for this notification / Result update.</div>
                )}
                {post.feePaymentMode && (
                  <div className="p-2.5 bg-slate-50 text-[11px] text-slate-600">
                    <strong>Payment Mode: </strong>{post.feePaymentMode}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Age Limit Box */}
          {post.ageLimit.asOnDate && (
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="bg-emerald-800 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-200" />
                  Age Limit as on {post.ageLimit.asOnDate} (आयु सीमा)
                </div>
                <button
                  onClick={onOpenAgeCalculator}
                  className="text-[11px] underline hover:text-amber-200 transition-colors"
                >
                  Calculate My Age
                </button>
              </div>
              <div className="p-3.5 text-xs space-y-2 bg-emerald-50/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium text-slate-800">
                  {post.ageLimit.minAge && <div>Minimum Age: <strong className="text-slate-900">{post.ageLimit.minAge} Years.</strong></div>}
                  {post.ageLimit.maxAge && <div>Maximum Age: <strong className="text-slate-900">{post.ageLimit.maxAge} Years.</strong></div>}
                </div>
                {post.ageLimit.notes && (
                  <p className="text-[11px] text-slate-600 italic">
                    {post.ageLimit.notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Vacancy Details Table */}
          {post.vacancyBreakdown.length > 0 && (
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="bg-blue-900 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                Vacancy Details & Eligibility Criteria (कुल पद व पात्रता)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="p-2.5">Post Name</th>
                      <th className="p-2.5 w-24 text-center">Total Post</th>
                      <th className="p-2.5">Eligibility Criteria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {post.vacancyBreakdown.map((vac, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{vac.postName}</td>
                        <td className="p-2.5 text-center font-bold text-emerald-700">{vac.totalPosts}</td>
                        <td className="p-2.5 text-slate-700 leading-relaxed">{vac.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* How to Fill Form Steps */}
          {post.howToApplySteps.length > 0 && (
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="bg-slate-700 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider">
                How to Fill {post.shortTitle} Online Form (आवेदन कैसे करें)
              </div>
              <div className="p-3.5 text-xs space-y-2 bg-slate-50/50">
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700 leading-relaxed">
                  {post.howToApplySteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* The Iconic Sarkari Useful Links Table */}
          <div className="border-2 border-red-800 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-red-800 text-white text-center py-2.5 px-4 font-bold text-sm tracking-wide uppercase">
              Some Useful Important Links (महत्वपूर्ण उपयोगी लिंक्स)
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {post.directLinks.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-red-50/30 transition-colors">
                  <span className="font-bold text-slate-800">{link.label}</span>
                  <button
                    type="button"
                    onClick={() => handleLinkAction(link)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-sm font-bold text-xs shadow-2xs transition-all cursor-pointer ${
                      link.isPrimary 
                        ? 'bg-red-700 hover:bg-red-800 text-white' 
                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                    }`}
                  >
                    <span>{link.actionText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-slate-100 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            SarkariResult.Com · Best & Fast Government Job Portal in India
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Action Dialog */}
      {activeSimulationLink && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700" />
                {activeSimulationLink.title}
              </h3>
              <button 
                onClick={() => setActiveSimulationLink(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeSimulationLink.content}
            </p>
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 text-[11px] text-slate-500 font-mono">
              STATUS: Verified Official Gateway · Safe Link
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveSimulationLink(null)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-800 rounded hover:bg-red-900 transition-colors cursor-pointer"
              >
                Proceed to Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
