import React, { useState, useEffect } from 'react';
import { SarkariPost } from '../types/job';
import { getProcessedImportantDates, getHowToApplyHindiSteps, getApplyDates } from '../utils/dateUtils';
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
  GraduationCap,
  Award,
  Users,
  BookOpen
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
  const [linksList, setLinksList] = useState(post?.directLinks || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customActionText, setCustomActionText] = useState('Click Here');
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState<'apply' | 'notification' | 'syllabus' | 'official'>('apply');

  useEffect(() => {
    if (post) {
      setLinksList(post.directLinks);
    }
  }, [post]);

  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel || !customUrl) {
      alert('Please enter both Link Label and URL / PDF link.');
      return;
    }
    const newLink = {
      label: customLabel,
      actionText: customActionText || 'Click Here',
      type: customType,
      url: customUrl,
      isPrimary: customType === 'apply'
    };
    setLinksList([...linksList, newLink]);
    setCustomLabel('');
    setCustomUrl('');
    setCustomActionText('Click Here');
    setIsAddModalOpen(false);
  };

  if (!isOpen || !post) return null;

  const handleShare = () => {
    const postUrl = window.location.origin + '#' + post.slug;
    const shareText = `🚨 *${post.title}*\n🎯 *Department:* ${post.department}\n🔗 Details: ${postUrl}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: postUrl
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isRajasthanJob = 
    post.state === 'Rajasthan' || 
    post.title.toLowerCase().includes('rajasthan') || 
    post.slug.toLowerCase().includes('rajasthan') || 
    post.shortTitle.toLowerCase().includes('rajasthan') ||
    post.title.toLowerCase().includes('rsmssb') ||
    post.title.toLowerCase().includes('rpsc') ||
    post.title.toLowerCase().includes('ruhs');

  const isUpscJob = 
    post.department === 'UPSC' || 
    post.title.toLowerCase().includes('upsc') || 
    post.slug.toLowerCase().includes('upsc') ||
    post.shortTitle.toLowerCase().includes('upsc');

  const isRailwayJob = 
    post.department === 'Railway' || 
    post.title.toLowerCase().includes('railway') || 
    post.title.toLowerCase().includes('rrb') || 
    post.slug.toLowerCase().includes('railway') || 
    post.slug.toLowerCase().includes('rrb') ||
    post.shortTitle.toLowerCase().includes('rrb');

  const upscLoginUrl = 'https://upsconline.nic.in/candidate/realms/candidate-portal/login-actions/authenticate?execution=dbd830c6-ec01-4843-b36b-1698ce52fb62&client_id=account&tab_id=kgIbmuNADOk&client_data=eyJydSI6Imh0dHBzOi8vdXBzY29ubGluZS5uaWMuaW4vY2FuZGlkYXRlL3JlYWxtcy9jYW5kaWRhdGUtcG9ydGFsL2FjY291bnQvbG9naW4tcmVkaXJlY3QiLCJydCI6ImNvZGUiLCJzdCI6IjAvMmYzMTgzZjYtMTE2Ny05ZDY0LTA1N2EtNmUyODZhYmM5NWM0In0';
  const upscRegisterUrl = 'https://upsconline.nic.in/candidate/realms/candidate-portal/login-actions/registration?execution=5cc68339-a3de-4411-b6ff-23460bba7ad6&client_id=account&tab_id=kgIbmuNADOk&client_data=eyJydSI6Imh0dHBzOi8vdXBzY29ubGluZS5uaWMuaW4vY2FuZGlkYXRlL3JlYWxtcy9jYW5kaWRhdGUtcG9ydGFsL2FjY291bnQvbG9naW4tcmVkaXJlY3QiLCJydCI6ImNvZGUiLCJzdCI6IjAvMmYzMTgzZjYtMTE2Ny05ZDY0LTA1N2EtNmUyODZhYmM5NWM0In0';
  const upscOfficialUrl = 'https://www.upsc.gov.in/';

  const isSscJob = 
    post.department === 'SSC' || 
    post.title.toLowerCase().includes('ssc') || 
    post.slug.toLowerCase().includes('ssc') ||
    post.shortTitle.toLowerCase().includes('ssc');

  const sscOfficialUrl = 'https://ssc.gov.in/';
  const sscLoginUrl = 'https://ssc.gov.in/login';
  const sscRegisterUrl = 'https://ssc.gov.in/candidate-portal/one-time-registration/home-page';

  const handleLinkAction = (link: { label: string; actionText: string; type: string; url?: string }) => {
    // Automatic SSC Portal Routing for all SSC jobs
    if (isSscJob) {
      const text = (link.label + ' ' + link.actionText).toLowerCase();
      if (link.type === 'official' || text.includes('official website') || text.includes('official portal') || text.includes('ssc portal') || text.includes('ssc official')) {
        window.open(sscOfficialUrl, '_blank');
        return;
      }
      if (text.includes('login') || text.includes('sign in') || text.includes('signin') || text.includes('already registered')) {
        window.open(sscLoginUrl, '_blank');
        return;
      }
      if (link.type === 'apply' || text.includes('register') || text.includes('registration') || text.includes('apply') || text.includes('otr')) {
        window.open(sscRegisterUrl, '_blank');
        return;
      }
    }
    // Automatic Rajasthan SSO Portal Routing for all Rajasthan jobs
    if (isRajasthanJob) {
      const text = (link.label + ' ' + link.actionText).toLowerCase();
      if (text.includes('login') || text.includes('sign in') || text.includes('signin') || text.includes('sso login') || text.includes('already registered')) {
        window.open('https://sso.rajasthan.gov.in/signin', '_blank');
        return;
      }
      if (link.type === 'apply' || text.includes('register') || text.includes('registration') || text.includes('apply') || text.includes('otr')) {
        window.open('https://sso.rajasthan.gov.in/register', '_blank');
        return;
      }
    }
    // Automatic UPSC Portal Routing for all UPSC jobs
    if (isUpscJob) {
      const text = (link.label + ' ' + link.actionText).toLowerCase();
      if (link.type === 'official' || text.includes('official website') || text.includes('official portal') || text.includes('upsc portal') || text.includes('upsc official')) {
        window.open(upscOfficialUrl, '_blank');
        return;
      }
      if (text.includes('login') || text.includes('sign in') || text.includes('signin') || text.includes('already registered')) {
        window.open(upscLoginUrl, '_blank');
        return;
      }
      if (link.type === 'apply' || text.includes('register') || text.includes('registration') || text.includes('apply')) {
        window.open(upscRegisterUrl, '_blank');
        return;
      }
    }

    // Automatic Railway Portal Routing for all Railway jobs
    if (isRailwayJob) {
      const text = (link.label + ' ' + link.actionText).toLowerCase();
      if (link.type === 'official' || text.includes('official website') || text.includes('official portal') || text.includes('rrb recruitment portal') || text.includes('rrb portal')) {
        window.open('https://www.rrbapply.gov.in/#/auth/landing', '_blank');
        return;
      }
      if (text.includes('login') || text.includes('sign in') || text.includes('signin') || text.includes('already registered')) {
        window.open('https://www.rrbapply.gov.in/#/auth/home', '_blank');
        return;
      }
      if (link.type === 'apply' || text.includes('register') || text.includes('registration') || text.includes('apply')) {
        window.open('https://www.rrbapply.gov.in/#/auth/home?flag=true', '_blank');
        return;
      }
    }

    if (link.url) {
      window.open(link.url, '_blank');
      return;
    }
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
              onClick={handleShare}
              className="p-1.5 rounded-md hover:bg-black/20 text-white/90 hover:text-white transition-colors"
              title="Share job details"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4 text-amber-300" />}
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

          {/* Summary Boxes Section */}
          <div className="space-y-4">
            {/* 1. Vacancy Details & Number of Posts Box (SABSE UPER - Topmost) */}
            {post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
              <div className="border border-blue-900 rounded-lg overflow-hidden bg-white shadow-2xs">
                <div className="bg-blue-950 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  Vacancy Details & Number of Posts (वेकेंसी विवरण व कुल पद)
                </div>
                <div className="p-3 text-xs space-y-2.5 bg-blue-50/20 text-slate-800">
                  {post.vacancyBreakdown.map((v, idx) => (
                    <div key={idx} className="space-y-1 pb-2 border-b border-blue-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center font-bold text-blue-950">
                        <span>{v.postName}</span>
                        <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[11px] font-black">Total: {v.totalPosts}</span>
                      </div>
                      {v.nonTspPosts !== undefined && v.tspPosts !== undefined && post.state === 'Rajasthan' && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                          <div className="bg-blue-50 p-1 rounded border border-blue-200">Non-TSP: <strong className="text-blue-900 font-bold">{v.nonTspPosts}</strong></div>
                          <div className="bg-amber-50 p-1 rounded border border-amber-200">TSP: <strong className="text-amber-900 font-bold">{v.tspPosts}</strong></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Important Dates Box */}
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="bg-red-800 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-300" />
                Important Dates (महत्वपूर्ण तिथियाँ)
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {getProcessedImportantDates(post).map((d, idx) => (
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

            {/* 3. Application Fee Box */}
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

            {/* 4. Age Limit Box */}
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

            {/* 5. Category Wise Posts Box */}
            {post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
              <div className="border border-emerald-900 rounded-lg overflow-hidden bg-white shadow-2xs">
                <div className="bg-emerald-950 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-300" />
                  Category Wise Posts (वर्ग-वार पद)
                </div>
                <div className="p-3 text-xs space-y-2 bg-emerald-50/20 text-slate-800">
                  {post.vacancyBreakdown.map((v, idx) => (
                    <div key={idx} className="space-y-1 pb-2 border-b border-emerald-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center font-bold text-emerald-950">
                        <span>{v.postName}</span>
                        <span className="text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded text-[10px] font-black">Total: {v.totalPosts}</span>
                      </div>
                      {v.categoryBreakdown ? (
                        <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-[11px] font-semibold text-slate-700">
                          <div className="bg-white p-1 border border-slate-200 rounded flex justify-between"><span>GEN:</span> <strong className="text-slate-900 font-bold">{v.categoryBreakdown.gen ?? '-'}</strong></div>
                          <div className="bg-white p-1 border border-slate-200 rounded flex justify-between"><span>OBC:</span> <strong className="text-slate-900 font-bold">{v.categoryBreakdown.obc ?? '-'}</strong></div>
                          <div className="bg-white p-1 border border-slate-200 rounded flex justify-between"><span>EWS:</span> <strong className="text-slate-900 font-bold">{v.categoryBreakdown.ews ?? '-'}</strong></div>
                          <div className="bg-white p-1 border border-slate-200 rounded flex justify-between"><span>SC:</span> <strong className="text-slate-900 font-bold">{v.categoryBreakdown.sc ?? '-'}</strong></div>
                          <div className="bg-white p-1 border border-slate-200 rounded flex justify-between"><span>ST:</span> <strong className="text-slate-900 font-bold">{v.categoryBreakdown.st ?? '-'}</strong></div>
                        </div>
                      ) : (
                        <div className="text-slate-500 italic text-[10px]">As per rule</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Post-Wise Eligibility Box */}
            {post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
              <div className="border border-amber-800 rounded-lg overflow-hidden bg-white shadow-2xs">
                <div className="bg-amber-900 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  Post-Wise Eligibility (पद-वार पात्रता व शैक्षणिक योग्यता)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-800 border-collapse">
                    <thead className="bg-amber-100 text-amber-950">
                      <tr>
                        <th className="p-2 text-left border border-amber-200">Post Name</th>
                        <th className="p-2 text-left border border-amber-200">Eligibility Criteria</th>
                        <th className="p-2 text-center border border-amber-200">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200">
                      {post.vacancyBreakdown.map((v, idx) => (
                        <tr key={idx} className="bg-white hover:bg-amber-50">
                          <td className="p-2 border border-amber-200 font-bold text-amber-950">{v.postName}</td>
                          <td className="p-2 border border-amber-200">
                            <div className="space-y-1">
                              {v.eligibility.split('\n').map((line, lIdx) => (
                                <p key={lIdx} className="leading-relaxed font-medium">{line}</p>
                              ))}
                            </div>
                          </td>
                          <td className="p-2 border border-amber-200 text-center font-black text-emerald-800">{v.totalPosts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. Mode of Selection Box (SABSE NICHE - Bottommost) */}
            <div className="border border-indigo-900 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="bg-indigo-900 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-300" />
                Mode of Selection (चयन प्रक्रिया)
              </div>
              <div className="p-3 text-xs space-y-2 bg-indigo-50/20 text-slate-800">
                {post.vacancyBreakdown.some(v => v.modeOfSelection) ? (
                  post.vacancyBreakdown.map((v, idx) => (
                    <div key={idx} className="space-y-1 pb-2 border-b border-indigo-100 last:border-0 last:pb-0">
                      <strong className="text-indigo-950 block">{v.postName}:</strong>
                      <p className="text-slate-700 leading-relaxed">{v.modeOfSelection}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-1.5 text-slate-700 font-medium text-xs">
                    As per official notification (आधिकारिक अधिसूचना के अनुसार)
                  </div>
                )}
              </div>
            </div>
          </div>



          {/* How to Fill Form Steps (Not shown for Important / Certificate Verification services) */}
          {post.category !== 'important' && post.category !== 'certificate_verification' && (
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="bg-slate-800 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>How to Fill {post.shortTitle} Online Form (आवेदन कैसे करें)</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded">
                  Apply Date
                </span>
              </div>
              <div className="p-3.5 text-xs space-y-3 bg-slate-50/50">
                {/* How to Apply Date Banner */}
                <div className="bg-red-50 border-l-4 border-red-700 p-2.5 rounded-r text-red-950 font-medium">
                  <div className="font-extrabold text-xs text-red-800 mb-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-700 shrink-0" />
                    How to Apply Online Date (ऑनलाइन आवेदन की तिथि):
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    उम्मीदवार <span className="text-red-700 font-black">{getApplyDates(post).startDate}</span> से <span className="text-red-700 font-black">{getApplyDates(post).lastDate}</span> तक ऑनलाइन आवेदन कर सकते हैं।
                  </p>
                </div>

                <ol className="list-decimal pl-4 space-y-2 text-slate-800">
                  {getHowToApplyHindiSteps(post).map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <strong className="text-red-800">{step.title}: </strong>
                      <span>{step.desc}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* The Iconic Sarkari Useful Links Table */}
          <div className="border-2 border-red-800 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-red-800 text-white py-2.5 px-4 font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-between gap-2">
              <span>Some Useful Important Links (महत्वपूर्ण उपयोगी लिंक्स)</span>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-2.5 py-1 rounded text-xs font-black shadow-2xs cursor-pointer shrink-0 uppercase tracking-normal"
              >
                + Add Link / PDF
              </button>
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {linksList.map((link, idx) => {
                const isOfficial = link.type === 'official' || link.label.toLowerCase().includes('official website') || link.label.toLowerCase().includes('वेबसाइट');
                const actionDisplay = isOfficial ? 'Click Here' : link.actionText;

                return (
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
                      <span>{actionDisplay}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-slate-100 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Sarkari Result · Best & Fast Government Job Portal in India
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

      {/* Custom Link / PDF Addition Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                ➕ Add Custom Link or PDF (नया लिंक या पीडीएफ जोड़ें)
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddCustomLink} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Title / Label (e.g. Download Merit List PDF)</label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="e.g. Download District Merit List PDF"
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Button Text (e.g. Click Here / PDF / Download)</label>
                <input
                  type="text"
                  value={customActionText}
                  onChange={(e) => setCustomActionText(e.target.value)}
                  placeholder="Click Here"
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Link URL or PDF URL (https://...)</label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://portal.gov.in/notification.pdf"
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700 font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Category</label>
                <select
                  value={customType}
                  onChange={(e: any) => setCustomType(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700 bg-white"
                >
                  <option value="apply">Apply Online / Registration</option>
                  <option value="notification">Notification PDF</option>
                  <option value="syllabus">Syllabus PDF</option>
                  <option value="official">Official Website</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-800 hover:bg-red-900 rounded shadow-xs cursor-pointer"
                >
                  Add Link Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
