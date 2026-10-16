import React, { useEffect, useState } from 'react';
import { SarkariPost } from '../types/job';
import { mockSarkariPosts } from '../data/mockJobs';
import { getProcessedImportantDates, getHowToApplyHindiSteps, getApplyDates } from '../utils/dateUtils';
import { 
  ArrowLeft, 
  Printer, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Check, 
  ExternalLink, 
  Calendar, 
  Clock,
  CreditCard, 
  UserCheck, 
  FileText, 
  Calculator, 
  AlertCircle,
  Building,
  GraduationCap,
  ChevronRight,
  Home,
  LogIn,
  UserPlus,
  HelpCircle,
  Award,
  Users,
  BookOpen,
  FileSpreadsheet,
  MessageCircle
} from 'lucide-react';

interface FullPagePostViewProps {
  post: SarkariPost;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  onOpenAgeCalculator: () => void;
  onOpenPhotoResizer: () => void;
  isHindi: boolean;
  onSelectPost?: (post: SarkariPost) => void;
}

const getDetailedHowToApplyEnglish = (post: SarkariPost, isRajasthanJob: boolean) => {
  const portalName = isRajasthanJob 
    ? 'SSO Rajasthan Official Portal (sso.rajasthan.gov.in) or the official recruitment board website'
    : 'the official recruitment board portal';

  return [
    {
      stepNumber: '1',
      title: 'Visit Official Portal & Complete Registration / OTR',
      desc: `First visit ${portalName}. New candidates must click on "New Registration" or "One Time Registration (OTR)". Fill in active mobile number, email ID, and Aadhaar card details to generate registration credentials via OTP verification.`
    },
    {
      stepNumber: '2',
      title: 'Log In with Registration Credentials / SSO ID',
      desc: `Log in using your Registration ID / SSO ID and password. Navigate to the Recruitment Dashboard and click on the active online form link for "${post.shortTitle}".`
    },
    {
      stepNumber: '3',
      title: 'Enter Personal, Educational & Address Details',
      desc: `Fill in your candidate name, father's name, date of birth, reservation category (General/OBC/EWS/SC/ST), and permanent address strictly according to 10th (Matriculation) marksheet.`
    },
    {
      stepNumber: '4',
      title: 'Upload Scanned Passport Photo, Signature & Documents',
      desc: `Upload recent passport-size colored photograph (light background, 20 KB to 50 KB) and signature on white paper (10 KB to 20 KB) in JPG/JPEG format along with required caste or domicile certificates.`
    },
    {
      stepNumber: '5',
      title: 'Preview Application Form & Check Details',
      desc: `Click on "Preview Application" to thoroughly verify all entries including spelling, DOB, category, and educational qualifications before final submission.`
    },
    {
      stepNumber: '6',
      title: 'Pay Category-Wise Application Fee Online',
      desc: post.applicationFee && post.applicationFee.length > 0
        ? `Pay the requisite application fee online using Net Banking, Debit/Credit Card, UPI, or E-Mitra Kiosk. If your category is exempt, submit the form directly.`
        : `Submit the application form.`
    },
    {
      stepNumber: '7',
      title: 'Download & Print Final Submitted Application Form',
      desc: `After successful submission, click "Print Application Form" and save 2-3 copies of the submitted application PDF and fee receipt for future admit card downloads and document verification.`
    }
  ];
};

export const hasCategoryBreakdownData = (v?: { categoryBreakdown?: { gen?: number | string; obc?: number | string; ews?: number | string; sc?: number | string; st?: number | string } }) => {
  if (!v || !v.categoryBreakdown) return false;
  const cb = v.categoryBreakdown;
  const total = [cb.gen, cb.obc, cb.ews, cb.sc, cb.st].reduce<number>((acc, val) => {
    if (val === undefined || val === null || val === '' || val === '-') return acc;
    const num = Number(val);
    return acc + (isNaN(num) ? 1 : num);
  }, 0);
  return total > 0;
};

export const getPostShareText = (post: SarkariPost): string => {
  const lines: string[] = [];
  
  lines.push(`🚨 *${post.title}*`);
  lines.push('──────────────────────');
  
  if (post.shortTitle && post.shortTitle !== post.title) {
    lines.push(`📌 *भर्ती:* ${post.shortTitle}`);
  }
  
  lines.push(`🏛️ *विभाग:* ${post.department} (${post.state})`);
  
  if (post.totalVacancies) {
    lines.push(`🎯 *कुल पद:* ${post.totalVacancies} Posts`);
  }
  
  if (post.qualifications && post.qualifications.length > 0) {
    lines.push(`🎓 *योग्यता:* ${post.qualifications.join(', ')}`);
  }
  
  if (post.lastDate) {
    lines.push(`⏳ *ऑनलाइन आवेदन की अंतिम तिथि:* ${post.lastDate}`);
  } else if (post.importantDates && post.importantDates.length > 0) {
    const mainDate = post.importantDates.find(d => d.isHighlight) || post.importantDates[0];
    lines.push(`📅 *${mainDate.label}:* ${mainDate.value}`);
  }
  
  if (post.applicationFee && post.applicationFee.length > 0) {
    const feeSummary = post.applicationFee
      .map(f => `${f.category}: ${f.amount}`)
      .slice(0, 2)
      .join(' | ');
    lines.push(`💰 *आवेदन शुल्क:* ${feeSummary}`);
  }
  
  if (post.ageLimit && (post.ageLimit.minAge || post.ageLimit.maxAge)) {
    const ageArr = [];
    if (post.ageLimit.minAge) ageArr.push(`न्यूनतम ${post.ageLimit.minAge} वर्ष`);
    if (post.ageLimit.maxAge) ageArr.push(`अधिकतम ${post.ageLimit.maxAge} वर्ष`);
    lines.push(`👤 *आयु सीमा:* ${ageArr.join(', ')}`);
  }
  
  lines.push('──────────────────────');
  lines.push(`🔗 *आधिकारिक डायरेक्ट लिंक और नोटिफिकेशन:*`);
  const postUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}#${post.slug}`
    : '';
  if (postUrl) {
    lines.push(postUrl);
  }
  lines.push(`\n📲 *सरकारी रिजल्ट* - सबसे तेज़ और सत्यापित सरकारी नौकरी पोर्टल`);
  
  return lines.join('\n');
};

export const FullPagePostView: React.FC<FullPagePostViewProps> = ({
  post,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onOpenAgeCalculator,
  onOpenPhotoResizer,
  isHindi,
  onSelectPost
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareSuccessToast, setShareSuccessToast] = useState(false);
  const [activeSimulationLink, setActiveSimulationLink] = useState<{ title: string; action: string; content: string } | null>(null);
  const [linksList, setLinksList] = useState(post.directLinks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [customLabel, setCustomLabel] = useState('');
  const [customActionText, setCustomActionText] = useState('Click Here');
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState<'apply' | 'notification' | 'syllabus' | 'official'>('apply');

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

  // Scroll to top on page mount & update SEO meta tags & canonical link dynamically
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Dynamic Document Title
    document.title = `${post.title} - Sarkari Result Portal`;

    // Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', post.shortInfo || `${post.title} online application form, last date, eligibility, fee, and official notification details on Sarkari Result.`);

    // Dynamic Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', `${window.location.origin}/#${post.slug}`);

    return () => {
      document.title = 'Sarkari Result Portal - Latest Govt Jobs, Admit Card & Results';
      if (metaDesc) {
        metaDesc.setAttribute('content', "India's premier portal for Sarkari Result, Sarkari Naukri, Admit Card, Answer Key, Syllabus, and competitive government exam notifications with real-time updates.");
      }
    };
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '#' + post.slug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    const shareText = getPostShareText(post);
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share closed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShareSuccessToast(true);
      setTimeout(() => setShareSuccessToast(false), 3000);
    }
  };

  const handleSocialShare = (platform: 'whatsapp' | 'telegram' | 'share' | 'copy') => {
    const shareText = getPostShareText(post);
    const currentUrl = window.location.href;

    if (platform === 'whatsapp') {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    } else if (platform === 'telegram') {
      const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`;
      window.open(url, '_blank');
    } else if (platform === 'share') {
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: shareText,
          url: currentUrl
        }).catch(() => {
          navigator.clipboard.writeText(shareText).then(() => {
            setShareSuccessToast(true);
            setTimeout(() => setShareSuccessToast(false), 3000);
          }).catch(err => console.error('Failed to copy: ', err));
        });
      } else {
        navigator.clipboard.writeText(shareText).then(() => {
          setShareSuccessToast(true);
          setTimeout(() => setShareSuccessToast(false), 3000);
        }).catch(err => console.error('Failed to copy: ', err));
      }
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareText).then(() => {
        setShareSuccessToast(true);
        setTimeout(() => setShareSuccessToast(false), 3000);
      }).catch(err => console.error('Failed to copy: ', err));
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

  const isSscJob = 
    post.department === 'SSC' || 
    post.title.toLowerCase().includes('ssc') || 
    post.slug.toLowerCase().includes('ssc') ||
    post.shortTitle.toLowerCase().includes('ssc');

  const isItbpJob = 
    post.title.toLowerCase().includes('itbp') || 
    post.slug.toLowerCase().includes('itbp') || 
    post.shortTitle.toLowerCase().includes('itbp');

  const itbpSignupUrl = 'https://recruitment.itbpolice.nic.in/registrations/applicant-signup';
  const itbpLoginUrl = 'https://recruitment.itbpolice.nic.in/applicant-profile-details/applicant-login';
  const itbpOfficialUrl = 'https://itbpolice.nic.in/';

  const upscLoginUrl = 'https://upsconline.nic.in/candidate/realms/candidate-portal/login-actions/authenticate?execution=dbd830c6-ec01-4843-b36b-1698ce52fb62&client_id=account&tab_id=kgIbmuNADOk&client_data=eyJydSI6Imh0dHBzOi8vdXBzY29ubGluZS5uaWMuaW4vY2FuZGlkYXRlL3JlYWxtcy9jYW5kaWRhdGUtcG9ydGFsL2FjY291bnQvbG9naW4tcmVkaXJlY3QiLCJydCI6ImNvZGUiLCJzdCI6IjAvMmYzMTgzZjYtMTE2Ny05ZDY0LTA1N2EtNmUyODZhYmM5NWM0In0';
  const upscRegisterUrl = 'https://upsconline.nic.in/candidate/realms/candidate-portal/login-actions/registration?execution=5cc68339-a3de-4411-b6ff-23460bba7ad6&client_id=account&tab_id=kgIbmuNADOk&client_data=eyJydSI6Imh0dHBzOi8vdXBzY29ubGluZS5uaWMuaW4vY2FuZGlkYXRlL3JlYWxtcy9jYW5kaWRhdGUtcG9ydGFsL2FjY291bnQvbG9naW4tcmVkaXJlY3QiLCJydCI6ImNvZGUiLCJzdCI6IjAvMmYzMTgzZjYtMTE2Ny05ZDY0LTA1N2EtNmUyODZhYmM5NWM0In0';
  const upscOfficialUrl = 'https://www.upsc.gov.in/';

  const sscOfficialUrl = 'https://ssc.gov.in/';
  const sscLoginUrl = 'https://ssc.gov.in/login';
  const sscRegisterUrl = 'https://ssc.gov.in/candidate-portal/one-time-registration/home-page';

  const handleLinkAction = (link: { label: string; actionText: string; type: string; url?: string }) => {
    // Automatic ITBP Portal Routing for all ITBP jobs
    if (isItbpJob) {
      const text = (link.label + ' ' + link.actionText).toLowerCase();
      if (text.includes('login') || text.includes('sign in') || text.includes('signin') || text.includes('already registered')) {
        window.open(itbpLoginUrl, '_blank');
        return;
      }
      if (link.type === 'apply' || text.includes('register') || text.includes('registration') || text.includes('apply') || text.includes('signup')) {
        window.open(itbpSignupUrl, '_blank');
        return;
      }
      if (link.type === 'official' || text.includes('official website') || text.includes('official portal')) {
        window.open(itbpOfficialUrl, '_blank');
        return;
      }
    }
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

    if (link.url) {
      window.open(link.url, '_blank');
      return;
    }
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

  const isServiceOrScheme = post.category === 'important' || post.category === 'certificate_verification';

  return (
    <>
      <div className="w-full min-h-screen bg-slate-100/70 pb-16">


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
          {/* Post Header - Classic Sarkari Result Standard Table Format */}
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
            <div className="border-2 border-[#ab1616] rounded-xs overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <td className="p-3 sm:p-4 text-slate-900 font-extrabold text-xs sm:text-sm whitespace-nowrap align-top border-r border-slate-200 w-32 sm:w-44">
                      Name Of Post :
                    </td>
                    <td className="p-3 sm:p-4 text-[#ab1616] font-extrabold text-base sm:text-xl leading-snug">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
                        <h1 className="flex-1">{post.title}</h1>
                        <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-md text-xs sm:text-sm font-bold shadow-2xs">
                          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Last Updated: <span className="font-extrabold text-emerald-900">{post.postDate}</span></span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-slate-200 bg-white">
                    <td className="p-3 sm:p-4 text-slate-900 font-extrabold text-xs sm:text-sm whitespace-nowrap align-top border-r border-slate-200">
                      Post Date / Update :
                    </td>
                    <td className="p-3 sm:p-4 text-slate-800 font-bold text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span>{post.postDate}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" /> Official Timestamp
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr className="bg-slate-50/80">
                    <td className="p-3 sm:p-4 text-slate-900 font-extrabold text-xs sm:text-sm whitespace-nowrap align-top border-r border-slate-200">
                      Short Information :
                    </td>
                    <td className="p-3 sm:p-4 text-slate-800 text-xs sm:text-sm leading-relaxed font-normal">
                      <p className="text-slate-800 leading-relaxed font-normal">
                        {post.shortInfo || `${post.department} has released ${post.title} notification. Those candidates who are interested in this recruitment exam can apply online. Read the official notification for eligibility, selection process, age limit, syllabus and all other information.`}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-6 text-slate-800 text-sm">
            {/* Social Media Sharing Section */}
            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-md shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs sm:text-sm">
                  <Share2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Share This Job Vacancy with Friends:</span>
                  {shareSuccessToast && (
                    <span className="text-[11px] bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded shadow-2xs animate-fade-in">
                      Copied to Clipboard!
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* WhatsApp Share */}
                  <button
                    type="button"
                    onClick={() => handleSocialShare('whatsapp')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded shadow-2xs transition-all cursor-pointer active:scale-95"
                    title="Share on WhatsApp"
                  >
                    <span className="font-sans">WhatsApp</span>
                  </button>

                  {/* Telegram */}
                  <button
                    type="button"
                    onClick={() => handleSocialShare('telegram')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#229ED9] hover:bg-[#1d8cb0] text-white text-xs font-bold rounded shadow-2xs transition-all cursor-pointer active:scale-95"
                    title="Share on Telegram"
                  >
                    <span className="font-sans">Telegram</span>
                  </button>

                  {/* Share Button (Native Web Share & Copy) */}
                  <button
                    type="button"
                    onClick={() => handleSocialShare('share')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ab1616] to-red-800 hover:from-red-900 hover:to-red-950 text-white text-sm font-black rounded-md shadow-md transition-all cursor-pointer active:scale-95 hover:shadow-lg hover:-translate-y-0.5"
                    title="Share Job Details"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                    <span>Share Job Vacancy</span>
                  </button>
                </div>
              </div>
            </div>




            {/* Summary Boxes Section - Standard Sarkari Result Format */}
            <div className="space-y-5">
              {/* 1. Vacancy Details & Number of Posts Box (SABSE UPER - Topmost) */}
              {post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
                <div className="border-2 border-blue-900 rounded-md overflow-hidden bg-white shadow-2xs">
                  <div className="bg-blue-950 text-white px-4 py-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4.5 h-4.5 text-amber-300" />
                    Vacancy Details & Number of Posts (वेकेंसी विवरण व कुल पद)
                  </div>
                  <div className="p-4 text-sm sm:text-base space-y-3 bg-blue-50/20 text-slate-800">
                    {post.vacancyBreakdown.map((v, idx) => (
                      <div key={idx} className="space-y-1.5 pb-2.5 border-b border-blue-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center font-bold text-blue-950">
                          <span>{v.postName}</span>
                          <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded text-xs sm:text-sm font-black">Total: {v.totalPosts}</span>
                        </div>
                        {v.nonTspPosts !== undefined && v.tspPosts !== undefined && post.state === 'Rajasthan' && (
                          <div className="grid grid-cols-2 gap-2 pt-1 text-xs sm:text-sm">
                            <div className="bg-blue-50 p-2 rounded border border-blue-200">Non-TSP Area: <strong className="text-blue-900 font-bold">{v.nonTspPosts}</strong></div>
                            <div className="bg-amber-50 p-2 rounded border border-amber-200">TSP Area: <strong className="text-amber-900 font-bold">{v.tspPosts}</strong></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Important Dates Box */}
              <div className="border-2 border-[#ab1616] rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-[#ab1616] text-white px-4 py-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-yellow-300" />
                  Important Dates (महत्वपूर्ण तिथियाँ)
                </div>
                <div className="divide-y divide-slate-100 text-sm sm:text-base">
                  {getProcessedImportantDates(post).map((d, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-3.5 ${d.isHighlight ? 'bg-red-50/90 font-bold text-red-950' : 'text-slate-800'}`}
                    >
                      <span>{d.label}</span>
                      <span className={d.isHighlight ? 'text-[#ab1616] font-black' : 'text-slate-900 font-bold'}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Application Fee Box - Important / Certificate Verification me nahi darshana */}
              {!isServiceOrScheme && (
                <div className="border-2 border-slate-800 rounded-md overflow-hidden bg-white shadow-2xs">
                  <div className="bg-slate-900 text-white px-4 py-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4.5 h-4.5 text-amber-300" />
                    Application Fee (आवेदन शुल्क)
                  </div>
                  <div className="divide-y divide-slate-100 text-sm sm:text-base">
                    {post.applicationFee.length > 0 ? (
                      post.applicationFee.map((fee, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5">
                          <span className="text-slate-800 font-medium">{fee.category}</span>
                          <strong className="text-slate-900 font-extrabold">{fee.amount}</strong>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-slate-500 italic">No Application Fee for this notification / Result update.</div>
                    )}
                    {post.feePaymentMode && (
                      <div className="p-3.5 bg-slate-50 text-xs sm:text-sm text-slate-700">
                        <strong>Payment Mode: </strong>{post.feePaymentMode}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Age Limit Box - Important / Certificate Verification me nahi darshana */}
              {!isServiceOrScheme && post.ageLimit.asOnDate && (
                <div className="border-2 border-emerald-800 rounded-md overflow-hidden bg-white shadow-2xs">
                  <div className="bg-emerald-800 text-white px-4 py-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4.5 h-4.5 text-emerald-200" />
                      Age Limit as on {post.ageLimit.asOnDate} (आयु सीमा)
                    </div>
                    <button
                      onClick={onOpenAgeCalculator}
                      className="text-xs sm:text-sm underline text-amber-200 hover:text-white transition-colors cursor-pointer font-bold"
                    >
                      Calculate My Age Now →
                    </button>
                  </div>
                  <div className="p-4 text-sm sm:text-base space-y-2 bg-emerald-50/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium text-slate-800">
                      {post.ageLimit.minAge && <div>Minimum Age: <strong className="text-slate-900 font-bold">{post.ageLimit.minAge} Years.</strong></div>}
                      {post.ageLimit.maxAge && <div>Maximum Age: <strong className="text-slate-900 font-bold">{post.ageLimit.maxAge} Years.</strong></div>}
                    </div>
                    {post.ageLimit.notes && (
                      <p className="text-xs sm:text-sm text-slate-600 italic pt-1 border-t border-slate-100">
                        {post.ageLimit.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Category Wise Posts Box - Important / Certificate Verification me nahi darshana */}
              {!isServiceOrScheme && post.vacancyBreakdown && post.vacancyBreakdown.some(v => hasCategoryBreakdownData(v)) && (
                <div className="border-2 border-emerald-900 rounded-md overflow-hidden bg-white shadow-2xs">
                  <div className="bg-emerald-950 text-white px-4 py-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4.5 h-4.5 text-amber-300" />
                    Category Wise Posts (वर्ग-वार पद)
                  </div>
                  <div className="p-4 text-sm sm:text-base space-y-3 bg-emerald-50/20 text-slate-800">
                    {post.vacancyBreakdown.filter(v => hasCategoryBreakdownData(v)).map((v, idx) => (
                      <div key={idx} className="space-y-1.5 pb-2.5 border-b border-emerald-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center font-bold text-emerald-950">
                          <span>{v.postName}</span>
                          <span className="text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded text-xs sm:text-sm font-black">Total: {v.totalPosts}</span>
                        </div>
                        {v.categoryBreakdown && (
                          <div className="grid grid-cols-2 gap-2 pt-2 text-xs sm:text-sm font-semibold text-slate-700">
                            <div className="bg-white p-2 border border-slate-200 rounded flex justify-between"><span>GEN:</span> <strong className="text-slate-900 font-extrabold">{v.categoryBreakdown.gen ?? '-'}</strong></div>
                            <div className="bg-white p-2 border border-slate-200 rounded flex justify-between"><span>OBC:</span> <strong className="text-slate-900 font-extrabold">{v.categoryBreakdown.obc ?? '-'}</strong></div>
                            <div className="bg-white p-2 border border-slate-200 rounded flex justify-between"><span>EWS:</span> <strong className="text-slate-900 font-extrabold">{v.categoryBreakdown.ews ?? '-'}</strong></div>
                            <div className="bg-white p-2 border border-slate-200 rounded flex justify-between"><span>SC:</span> <strong className="text-slate-900 font-extrabold">{v.categoryBreakdown.sc ?? '-'}</strong></div>
                            <div className="bg-white p-2 border border-slate-200 rounded flex justify-between"><span>ST:</span> <strong className="text-slate-900 font-extrabold">{v.categoryBreakdown.st ?? '-'}</strong></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Post-Wise Eligibility Box - Important / Certificate Verification me nahi darshana */}
              {!isServiceOrScheme && post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
                <div className="border-2 border-amber-800 rounded-md overflow-hidden bg-white shadow-2xs">
                  <div className="bg-amber-900 text-white px-4 py-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-amber-300" />
                    Post-Wise Eligibility (पद-वार पात्रता व शैक्षणिक योग्यता)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm text-slate-800 border-collapse">
                      <thead className="bg-amber-100 text-amber-950">
                        <tr>
                          <th className="p-3 text-left border border-amber-200">Post Name (पद का नाम)</th>
                          <th className="p-3 text-left border border-amber-200">Eligibility Criteria (पात्रता व योग्यता)</th>
                          <th className="p-3 text-center border border-amber-200">Total Posts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-200">
                        {post.vacancyBreakdown.map((v, idx) => (
                          <tr key={idx} className="bg-white hover:bg-amber-50">
                            <td className="p-3 border border-amber-200 font-bold text-amber-950">{v.postName}</td>
                            <td className="p-3 border border-amber-200">
                              <div className="space-y-1.5">
                                {v.eligibility.split('\n').map((line, lIdx) => (
                                  <p key={lIdx} className="leading-relaxed font-medium">{line}</p>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 border border-amber-200 text-center font-black text-emerald-800">{v.totalPosts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 7. Paper Pattern & Exam Scheme Box - Ye box tabhi dikhega jab paper pattern or uski subject ki jaankari hogi */}
              {post.paperPattern && post.paperPattern.subjects && post.paperPattern.subjects.length > 0 && (
                <div className="border-2 border-purple-900 rounded-md overflow-hidden bg-white shadow-sm">
                  <div className="bg-purple-950 text-white px-4 py-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4.5 h-4.5 text-amber-300 shrink-0" />
                      <span>{post.paperPattern.examName ? `${post.paperPattern.examName} : Exam Scheme & Paper Pattern (परीक्षा पैटर्न व अंक भार)` : 'Exam Scheme & Paper Pattern (परीक्षा पैटर्न व विषय-वार अंक भार)'}</span>
                    </div>
                    {post.paperPattern.examMode && (
                      <span className="text-[11px] sm:text-xs bg-amber-400 text-slate-900 font-black px-2.5 py-0.5 rounded uppercase tracking-tight shrink-0 self-start sm:self-auto">
                        {post.paperPattern.examMode}
                      </span>
                    )}
                  </div>

                  <div className="p-4 text-xs sm:text-sm space-y-4 bg-white text-slate-800">
                    {/* Quick Metrics Bar - Sirf wahi metrics dikhenge jinka data darj hoga */}
                    {(post.paperPattern.totalQuestions || post.paperPattern.totalMarks || post.paperPattern.totalDuration || post.paperPattern.negativeMarking || post.paperPattern.mediumOfExam) && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-purple-50/70 p-3 rounded-md border border-purple-200 text-slate-800 font-medium">
                        {post.paperPattern.totalQuestions && (
                          <div className="bg-white p-2.5 rounded border border-purple-100 flex flex-col justify-center shadow-2xs">
                            <span className="text-[11px] text-slate-500 font-bold">Total Questions (कुल प्रश्न):</span>
                            <strong className="text-purple-950 text-sm sm:text-base font-black">{post.paperPattern.totalQuestions} प्रश्न</strong>
                          </div>
                        )}
                        {post.paperPattern.totalMarks && (
                          <div className="bg-white p-2.5 rounded border border-purple-100 flex flex-col justify-center shadow-2xs">
                            <span className="text-[11px] text-slate-500 font-bold">Total Marks (कुल पूर्णांक):</span>
                            <strong className="text-emerald-800 text-sm sm:text-base font-black">{post.paperPattern.totalMarks} अंक</strong>
                          </div>
                        )}
                        {post.paperPattern.totalDuration && (
                          <div className="bg-white p-2.5 rounded border border-purple-100 flex flex-col justify-center shadow-2xs">
                            <span className="text-[11px] text-slate-500 font-bold">Duration (समयावधि):</span>
                            <strong className="text-blue-900 text-xs sm:text-sm font-black">{post.paperPattern.totalDuration}</strong>
                          </div>
                        )}
                        {post.paperPattern.negativeMarking && (
                          <div className="bg-white p-2.5 rounded border border-purple-100 flex flex-col justify-center shadow-2xs">
                            <span className="text-[11px] text-slate-500 font-bold">Negative Marking:</span>
                            <strong className="text-red-700 text-xs sm:text-sm font-black">{post.paperPattern.negativeMarking}</strong>
                          </div>
                        )}
                        {post.paperPattern.mediumOfExam && (
                          <div className="bg-white p-2.5 rounded border border-purple-100 flex flex-col justify-center shadow-2xs col-span-2 sm:col-span-4">
                            <span className="text-[11px] text-slate-500 font-bold">Medium / Language of Exam:</span>
                            <strong className="text-slate-800 text-xs sm:text-sm font-bold">{post.paperPattern.mediumOfExam}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Subject-Wise Paper Marks Weightage Table (Tabhi dikhega jab subjects ki jaankari darj hogi) */}
                    {(() => {
                      const subjects = post.paperPattern.subjects;
                      const hasQuestions = subjects.some(s => s.totalQuestions !== undefined && s.totalQuestions !== null && s.totalQuestions !== '');
                      const hasMarks = subjects.some(s => s.totalMarks !== undefined && s.totalMarks !== null && s.totalMarks !== '');
                      const hasDuration = subjects.some(s => s.duration !== undefined && s.duration !== null && s.duration !== '');
                      const hasRemarks = subjects.some(s => s.remarks !== undefined && s.remarks !== null && s.remarks !== '');

                      return (
                        <div className="overflow-x-auto border-2 border-purple-200 rounded-md shadow-2xs">
                          <table className="w-full text-xs sm:text-sm text-slate-800 border-collapse">
                            <thead className="bg-purple-100 text-purple-950 font-bold">
                              <tr>
                                <th className="p-2.5 text-center border-b border-purple-200 w-12">क्र.सं.</th>
                                <th className="p-2.5 text-left border-b border-purple-200">विषय / सेक्शन का नाम (Subject / Section)</th>
                                {hasQuestions && (
                                  <th className="p-2.5 text-center border-b border-purple-200">प्रश्नों की संख्या (Questions)</th>
                                )}
                                {hasMarks && (
                                  <th className="p-2.5 text-center border-b border-purple-200">विषय-वार अंक भार (Marks Weightage)</th>
                                )}
                                {hasDuration && (
                                  <th className="p-2.5 text-center border-b border-purple-200">समयावधि (Duration)</th>
                                )}
                                {hasRemarks && (
                                  <th className="p-2.5 text-left border-b border-purple-200">विवरण / स्तर (Remarks)</th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-purple-100">
                              {subjects.map((sub, sIdx) => (
                                <tr key={sIdx} className="hover:bg-purple-50/60 transition-colors">
                                  <td className="p-2.5 text-slate-500 font-mono font-bold text-center">{sIdx + 1}</td>
                                  <td className="p-2.5 font-bold text-purple-950">{sub.subjectName}</td>
                                  {hasQuestions && (
                                    <td className="p-2.5 text-center font-extrabold text-slate-900">{sub.totalQuestions ?? '-'}</td>
                                  )}
                                  {hasMarks && (
                                    <td className="p-2.5 text-center font-black text-emerald-800">{sub.totalMarks ?? '-'} अंक</td>
                                  )}
                                  {hasDuration && (
                                    <td className="p-2.5 text-center text-blue-900 font-semibold">{sub.duration ?? '-'}</td>
                                  )}
                                  {hasRemarks && (
                                    <td className="p-2.5 text-slate-600 italic text-xs">{sub.remarks ?? '-'}</td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                            {/* Total Row (Kul Yog) */}
                            {(hasQuestions || hasMarks || post.paperPattern.totalQuestions || post.paperPattern.totalMarks) && (
                              <tfoot className="bg-purple-950 text-white font-extrabold">
                                <tr>
                                  <td colSpan={2} className="p-2.5 text-right font-black uppercase tracking-wider text-xs sm:text-sm">
                                    Total Weightage (कुल योग):
                                  </td>
                                  {hasQuestions && (
                                    <td className="p-2.5 text-center font-black text-amber-300 text-xs sm:text-sm">
                                      {post.paperPattern.totalQuestions !== undefined && post.paperPattern.totalQuestions !== null
                                        ? post.paperPattern.totalQuestions
                                        : (subjects.reduce((sum, s) => {
                                            const val = typeof s.totalQuestions === 'number' ? s.totalQuestions : parseInt(String(s.totalQuestions || '0'), 10);
                                            return sum + (isNaN(val) ? 0 : val);
                                          }, 0) || '-')}
                                    </td>
                                  )}
                                  {hasMarks && (
                                    <td className="p-2.5 text-center font-black text-yellow-300 text-xs sm:text-sm">
                                      {post.paperPattern.totalMarks ? `${post.paperPattern.totalMarks} अंक` : 
                                        `${subjects.reduce((sum, s) => {
                                          const val = typeof s.totalMarks === 'number' ? s.totalMarks : parseInt(String(s.totalMarks || '0'), 10);
                                          return sum + (isNaN(val) ? 0 : val);
                                        }, 0) || '-'} अंक`}
                                    </td>
                                  )}
                                  {hasDuration && (
                                    <td className="p-2.5 text-center text-slate-300 font-semibold text-xs">
                                      {post.paperPattern.totalDuration || '-'}
                                    </td>
                                  )}
                                  {hasRemarks && (
                                    <td className="p-2.5"></td>
                                  )}
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        </div>
                      );
                    })()}

                    {/* Paper Pattern Notes / Guidelines (agar data darj ho tabhi dikhega) */}
                    {post.paperPattern.notes && post.paperPattern.notes.length > 0 && (
                      <div className="bg-amber-50/90 border-l-4 border-amber-600 p-3 rounded-r text-amber-950 space-y-1">
                        <strong className="block text-xs sm:text-sm font-bold text-amber-900">
                          महत्वपूर्ण परीक्षा निर्देश एवं अंकन नियम (Exam Marking Rules & Pattern Guidelines):
                        </strong>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-800">
                          {post.paperPattern.notes.map((note, nIdx) => (
                            <li key={nIdx} className="leading-relaxed">{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 8. Mode of Selection Box - Important / Certificate Verification me nahi darshana */}
              {!isServiceOrScheme && (
                <div className="border-2 border-indigo-900 rounded-md overflow-hidden bg-white shadow-2xs">
                  <div className="bg-indigo-950 text-white px-4 py-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-amber-300" />
                    Mode of Selection (चयन प्रक्रिया)
                  </div>
                  <div className="p-4 text-sm sm:text-base space-y-3 bg-indigo-50/20 text-slate-800">
                    {post.vacancyBreakdown.some(v => v.modeOfSelection) ? (
                      post.vacancyBreakdown.map((v, idx) => (
                        <div key={idx} className="space-y-1 pb-2 border-b border-indigo-100 last:border-0 last:pb-0">
                          <strong className="text-indigo-950 block font-bold">{v.postName}:</strong>
                          <p className="text-slate-800 leading-relaxed font-normal">{v.modeOfSelection}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-2 text-slate-800 font-medium">
                        As per official notification (आधिकारिक अधिसूचना के अनुसार)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>



            {/* How to Apply Section */}
            {post.category !== 'important' && post.category !== 'certificate_verification' && (
              <div className="border border-blue-900 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-blue-950 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-300" />
                    {post.shortTitle} : How to Apply Online (आवेदन कैसे करें)
                  </div>
                  <span className="text-[11px] bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded">
                    How to Apply Date
                  </span>
                </div>
                <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm text-slate-800">
                  {/* Highlighted How to Apply Online Date Banner */}
                  <div className="bg-red-50 border-l-4 border-red-700 p-3 rounded-r text-red-950 font-medium">
                    <div className="font-extrabold text-sm sm:text-base text-red-800 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-700 shrink-0" />
                      How to Apply Online Date (ऑनलाइन आवेदन की तिथि):
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      उम्मीदवार <span className="text-red-700 font-black">{getApplyDates(post).startDate}</span> से <span className="text-red-700 font-black">{getApplyDates(post).lastDate}</span> तक ऑनलाइन आवेदन कर सकते हैं।
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 italic">
                      (Candidate Can Apply Online Between {getApplyDates(post).startDate} to {getApplyDates(post).lastDate})
                    </p>
                  </div>

                  {/* Step-by-Step Instructions in Hindi */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wide">
                      ऑनलाइन आवेदन पत्र भरने की प्रक्रिया (Step-by-Step Instructions):
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2.5 text-slate-800">
                      {getHowToApplyHindiSteps(post).map((step, index) => (
                        <li key={index} className="leading-relaxed">
                          <strong className="text-red-800">{step.title}: </strong>
                          <span>{step.desc}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {post.howToApplySteps && post.howToApplySteps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <strong className="text-slate-900 block mb-1">Official Board Guidelines:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {post.howToApplySteps.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* The Iconic Sarkari Useful Links Table */}
            <div className="border-2 border-[#ab1616] rounded-xs overflow-hidden bg-white shadow-sm">
              <div className="bg-[#ab1616] text-white py-3 px-4 font-extrabold text-sm sm:text-base tracking-wide uppercase flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-center sm:text-left">
                  {post.category === 'important' || post.category === 'certificate_verification'
                    ? 'Direct Official Portal Links & Verified Services'
                    : 'Interested Candidates Can Read the Full Notification Before Apply Online'}
                  <span className="block text-xs font-normal text-yellow-200 mt-0.5">
                    SOME USEFUL IMPORTANT LINKS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded text-xs font-black shadow-xs cursor-pointer shrink-0 uppercase tracking-normal"
                >
                  Admin: + Add PDF / Link
                </button>
              </div>
              <div className="divide-y divide-slate-200 text-sm sm:text-base">
                {linksList.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <span className="font-extrabold text-[#0000cc]">
                      {link.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLinkAction(link)}
                      className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xs font-black text-sm sm:text-base shadow-xs transition-all cursor-pointer uppercase shrink-0 ${
                        link.isPrimary 
                          ? 'bg-slate-900 hover:bg-black text-white' 
                          : 'bg-[#0000cc] hover:bg-blue-900 text-white'
                      }`}
                    >
                      {link.type === 'official' || link.label.toLowerCase().includes('official website') || link.label.toLowerCase().includes('वेबसाइट') ? (
                        <>
                          <span>Click Here</span>
                          <ExternalLink className="w-4 h-4" />
                        </>
                      ) : link.actionText.toLowerCase().includes('login') ? (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>Login</span>
                        </>
                      ) : link.actionText.toLowerCase().includes('register') || link.actionText.toLowerCase().includes('registration') ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Registration</span>
                        </>
                      ) : (
                        <>
                          <span>{link.actionText}</span>
                          <ExternalLink className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                ))}
                {/* Join Sarkari Result Channel Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 transition-colors gap-3">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-2">
                    <span>Join Sarkari Result Channel</span>
                    <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded font-bold">Fast Updates</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.open('https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j', '_blank')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xs font-black text-sm sm:text-base shadow-xs transition-all cursor-pointer uppercase bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 border border-emerald-300"
                    >
                      <MessageCircle className="w-4 h-4 fill-slate-950 text-emerald-100" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open('https://t.me/newsarkariresultt', '_blank')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xs font-black text-sm sm:text-base shadow-xs transition-all cursor-pointer uppercase bg-sky-700 hover:bg-sky-800 text-white"
                    >
                      <span>Telegram</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Wise FAQ Section - Always placed at the bottom of the post (Hindi Translated) */}
            <div className="border border-amber-600 rounded-md overflow-hidden bg-white shadow-2xs">
              <div className="bg-amber-900 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-300" />
                  {post.shortTitle} : बार-बार पूछे जाने वाले प्रश्न (FAQ - हिंदी में)
                </span>
                <span className="text-[10px] bg-amber-700 text-amber-100 px-2 py-0.5 rounded font-bold normal-case">
                  भर्ती सहायता केंद्र (Helpdesk)
                </span>
              </div>
              <div className="p-4 space-y-3 bg-amber-50/20 text-xs sm:text-sm">
                <div className="space-y-2">
                  <details className="group bg-white border border-amber-200 rounded p-3 shadow-2xs open:border-amber-500 transition-all">
                    <summary className="font-extrabold text-slate-900 cursor-pointer flex items-center justify-between gap-2 list-none">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shrink-0">Q1</span>
                        <span>{post.shortTitle} के लिए ऑनलाइन आवेदन करने की अंतिम तिथि (Last Date) क्या है?</span>
                      </span>
                      <span className="text-amber-800 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-2 pl-7 text-slate-700 leading-relaxed font-medium">
                      {post.shortTitle} के लिए ऑनलाइन आवेदन फॉर्म जमा करने की अंतिम तिथि <strong className="text-red-700 font-bold">{post.lastDate || 'आधिकारिक अधिसूचना में निर्दिष्ट'}</strong> है। उम्मीदवारों को सलाह दी जाती है कि वे अंतिम समय की सर्वर त्रुटियों से बचने के लिए समय से पहले आवेदन पूरा करें।
                    </p>
                  </details>

                  <details className="group bg-white border border-amber-200 rounded p-3 shadow-2xs open:border-amber-500 transition-all">
                    <summary className="font-extrabold text-slate-900 cursor-pointer flex items-center justify-between gap-2 list-none">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shrink-0">Q2</span>
                        <span>इस भर्ती के लिए आवेदन शुल्क (Application Fee) कितना है और भुगतान कैसे होगा?</span>
                      </span>
                      <span className="text-amber-800 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-2 pl-7 text-slate-700 leading-relaxed space-y-1">
                      {post.applicationFee.length > 0 ? (
                        <>
                          <p className="font-semibold text-slate-900">वर्ग-वार आवेदन शुल्क संरचना (Category-wise Application Fee):</p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {post.applicationFee.map((f, i) => (
                              <li key={i}>{f.category}: <strong className="text-slate-900">{f.amount}</strong></li>
                            ))}
                          </ul>
                          {post.feePaymentMode && <p className="text-xs text-slate-600 mt-1">भुगतान का माध्यम (Payment Mode): {post.feePaymentMode}</p>}
                        </>
                      ) : (
                        <p>इस अधिसूचना के लिए कोई आवेदन शुल्क देय नहीं है (No Application Fee).</p>
                      )}
                    </div>
                  </details>

                  <details className="group bg-white border border-amber-200 rounded p-3 shadow-2xs open:border-amber-500 transition-all">
                    <summary className="font-extrabold text-slate-900 cursor-pointer flex items-center justify-between gap-2 list-none">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shrink-0">Q3</span>
                        <span>इस भर्ती के लिए पात्रता मानदंड (Eligibility & Qualification) क्या है?</span>
                      </span>
                      <span className="text-amber-800 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-2 pl-7 text-slate-700 leading-relaxed space-y-1">
                      {post.vacancyBreakdown.length > 0 ? (
                        post.vacancyBreakdown.map((v, i) => (
                          <p key={i}>• <strong className="text-slate-900">{v.postName} ({v.totalPosts} पद):</strong> {v.eligibility}</p>
                        ))
                      ) : (
                        <p>विस्तृत शैक्षणिक योग्यता एवं पात्रता हेतु कृपया आधिकारिक अधिसूचना (Notification PDF) डाउनलोड करके पढ़ें।</p>
                      )}
                    </div>
                  </details>

                  <details className="group bg-white border border-amber-200 rounded p-3 shadow-2xs open:border-amber-500 transition-all">
                    <summary className="font-extrabold text-slate-900 cursor-pointer flex items-center justify-between gap-2 list-none">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shrink-0">Q4</span>
                        <span>इस पद के लिए चयन प्रक्रिया (Mode of Selection) क्या है?</span>
                      </span>
                      <span className="text-amber-800 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-2 pl-7 text-slate-700 leading-relaxed space-y-1">
                      <p className="font-semibold text-slate-900">इस भर्ती के लिए चयन प्रक्रिया में निम्नलिखित चरण शामिल होंगे:</p>
                      <ul className="list-disc pl-4 space-y-0.5 font-medium">
                        <li>चरण 1: लिखित परीक्षा / कंप्यूटर आधारित परीक्षा (CBT Exam)</li>
                        <li>चरण 2: शारीरिक मानक / दक्षता परीक्षण / टाइपिंग या कौशल परीक्षा (यदि लागू हो)</li>
                        <li>चरण 3: दस्तावेज़ सत्यापन (Document Verification - DV)</li>
                        <li>चरण 4: चिकित्सीय परीक्षण (Medical Examination) एवं अंतिम मेरिट सूची</li>
                      </ul>
                      <p className="text-xs text-slate-600 mt-1">सटीक परीक्षा पैटर्न, सिलेबस और मार्किंग स्कीम हेतु आधिकारिक विज्ञप्ति देखें।</p>
                    </div>
                  </details>

                  <details className="group bg-white border border-amber-200 rounded p-3 shadow-2xs open:border-amber-500 transition-all">
                    <summary className="font-extrabold text-slate-900 cursor-pointer flex items-center justify-between gap-2 list-none">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shrink-0">Q5</span>
                        <span>Is there upper age limit relaxation provided?</span>
                      </span>
                      <span className="text-amber-800 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-2 pl-7 text-slate-700 leading-relaxed font-medium">
                      Yes, upper age limit relaxation is applicable for reserved categories (OBC, SC, ST, EWS, PwD, Ex-Servicemen) strictly as per government regulations and official advertisement rules.
                    </p>
                  </details>

                  <details className="group bg-white border border-amber-200 rounded p-3 shadow-2xs open:border-amber-500 transition-all">
                    <summary className="font-extrabold text-slate-900 cursor-pointer flex items-center justify-between gap-2 list-none">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shrink-0">Q6</span>
                        <span>How and when can candidates download Admit Card and check Result?</span>
                      </span>
                      <span className="text-amber-800 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-2 pl-7 text-slate-700 leading-relaxed font-medium">
                      E-Admit cards are published 7 to 10 days before the exam date on the official recruitment portal. Log in using your <strong className="text-slate-900">Registration Number</strong> and <strong className="text-slate-900">Date of Birth</strong> to download your Hall Ticket. Stay tuned to Sarkari Result for direct verified download links.
                    </p>
                  </details>
                </div>
              </div>
            </div>

            {/* Back to Home Button at bottom of page */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                onClick={onBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sarkari Result Home Page</span>
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs text-red-700 hover:underline font-semibold cursor-pointer"
              >
                ↑ Go to Top of Page
              </button>
            </div>

            {/* Latest Jobs and Related Posts Section - Enhanced Sarkari Result Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 border-t-2 border-slate-300 pt-6">
              {/* Latest Jobs Column */}
              <div className="border-2 border-[#ab1616] bg-white rounded-xs overflow-hidden shadow-2xs flex flex-col">
                <div className="bg-[#ab1616] text-white py-3 px-4 text-center">
                  <h3 className="font-black text-base sm:text-lg tracking-wide uppercase">
                    {isHindi ? 'नवीनतम नौकरियां (Latest Jobs)' : 'Latest Jobs'}
                  </h3>
                </div>
                <ul className="divide-y divide-slate-200 flex-1 p-2">
                  {mockSarkariPosts.slice(0, 3).map((p) => (
                    <li 
                      key={p.id} 
                      onClick={() => onSelectPost && onSelectPost(p)}
                      className="py-3 px-3 hover:bg-red-50/50 transition-colors cursor-pointer group flex items-start gap-3"
                    >
                      <span className="text-[#ab1616] font-black leading-tight text-lg">•</span>
                      <div className="flex-1">
                        <span className="font-extrabold text-sm sm:text-base text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline leading-snug block">
                          {p.shortTitle || p.title}
                        </span>
                        {p.lastDate && (
                          <span className="text-xs text-red-700 block font-bold mt-1">
                            Last Date: {p.lastDate}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Posts Column */}
              <div className="border-2 border-indigo-900 bg-white rounded-xs overflow-hidden shadow-2xs flex flex-col">
                <div className="bg-indigo-950 text-white py-3 px-4 text-center">
                  <h3 className="font-black text-base sm:text-lg tracking-wide uppercase">
                    {isHindi ? 'सम्बंधित पोस्ट (Related Posts)' : 'Related Posts'}
                  </h3>
                </div>
                <ul className="divide-y divide-slate-200 flex-1 p-2">
                  {mockSarkariPosts
                    .filter(p => p.id !== post.id && (p.category === post.category || p.department === post.department))
                    .slice(0, 3)
                    .map((p) => (
                      <li 
                        key={p.id} 
                        onClick={() => onSelectPost && onSelectPost(p)}
                        className="py-3 px-3 hover:bg-indigo-50/50 transition-colors cursor-pointer group flex items-start gap-3"
                      >
                        <span className="text-indigo-900 font-black leading-tight text-lg">•</span>
                        <div className="flex-1">
                          <span className="font-extrabold text-sm sm:text-base text-[#0000cc] group-hover:text-indigo-900 group-hover:underline leading-snug block">
                            {p.shortTitle || p.title}
                          </span>
                          <span className="text-xs text-slate-600 block font-semibold mt-1">
                            Category: <span className="capitalize">{p.category.replace('_', ' ')}</span> · Dept: {p.department}
                          </span>
                        </div>
                      </li>
                    ))}
                  {mockSarkariPosts.filter(p => p.id !== post.id && (p.category === post.category || p.department === post.department)).length === 0 && (
                    <li className="p-4 text-center text-xs text-slate-500 font-medium">
                      No related posts found.
                    </li>
                  )}
                </ul>
              </div>
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
      {/* Custom Link / PDF Addition Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                ➕ Admin: Add PDF / Link
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
                <label className="block font-bold text-slate-700 mb-1">Link Title / Label (e.g. Download Admit Card)</label>
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
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#ab1616] hover:bg-red-900 rounded shadow-xs cursor-pointer"
                >
                  Add Link Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
};
