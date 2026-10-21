import React, { useEffect, useMemo } from 'react';
import { SarkariPost } from '../types/job';
import { getProcessedImportantDates } from '../utils/dateUtils';
import { 
  ExternalLink, 
  ChevronRight,
  Home,
  Send,
  MessageCircle,
  Bell,
  BellRing
} from 'lucide-react';
import { isPostAlertActive, togglePostAlert, getPostStatus } from '../utils/alertManager';
import { PostAlertModal } from './PostAlertModal';

interface FullPagePostViewProps {
  post: SarkariPost;
  onBack: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (postId: string) => void;
  onOpenAgeCalculator?: () => void;
  onOpenPhotoResizer?: () => void;
  isHindi?: boolean;
  onSelectPost?: (post: SarkariPost) => void;
  allPosts?: SarkariPost[];
  onOpenAdmin?: () => void;
}

export interface PostFAQ {
  question: string;
  answer: string;
}

export const getPostFAQs = (post: SarkariPost): PostFAQ[] => {
  if (post.customFaqs && post.customFaqs.length > 0) {
    return post.customFaqs;
  }

  const faqs: PostFAQ[] = [];

  // Q1: What is the last date to apply online?
  if (post.lastDate) {
    faqs.push({
      question: `What is the last date to apply online for ${post.shortTitle}?`,
      answer: `The last date to apply online for ${post.title} is ${post.lastDate}. Candidates are advised to submit the online form before the deadline.`
    });
  }

  // Q2: What is the age limit?
  if (post.ageLimit && post.ageLimit.asOnDate) {
    const ageDetails = [
      post.ageLimit.minAge ? `Minimum Age: ${post.ageLimit.minAge} Years.` : '',
      post.ageLimit.maxAge ? `Maximum Age: ${post.ageLimit.maxAge} Years.` : '',
      post.ageLimit.notes ? post.ageLimit.notes : 'Age relaxation is applicable as per official recruitment rules.'
    ].filter(Boolean).join(' ');

    faqs.push({
      question: `What is the age limit for ${post.shortTitle}?`,
      answer: `Candidate age limit as on ${post.ageLimit.asOnDate}: ${ageDetails}`
    });
  }

  // Q3: Total vacancies
  if (post.totalVacancies) {
    faqs.push({
      question: `How many total vacancies are available in ${post.shortTitle}?`,
      answer: `There are a total of ${post.totalVacancies} vacancies announced under this recruitment.`
    });
  }

  // Q4: Application Fee
  if (post.applicationFee && post.applicationFee.length > 0) {
    const feeStr = post.applicationFee.map(f => `${f.category}: ${f.amount}`).join(', ');
    faqs.push({
      question: `How much is the application fee for ${post.shortTitle}?`,
      answer: `Category-wise application fee: ${feeStr}. Payment can be made online through Net Banking, Debit/Credit Card or UPI.`
    });
  }

  // Q5: Eligibility
  if (post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && post.vacancyBreakdown[0].eligibility) {
    const cleanEligibility = post.vacancyBreakdown[0].eligibility.replace(/•/g, '').trim().replace(/\n+/g, ' ');
    faqs.push({
      question: `What is the minimum eligibility qualification for ${post.shortTitle}?`,
      answer: cleanEligibility
    });
  } else if (post.qualifications && post.qualifications.length > 0) {
    faqs.push({
      question: `What is the required qualification for ${post.shortTitle}?`,
      answer: `Candidates must possess ${post.qualifications.join(', ')} from a recognized University or Institute in India.`
    });
  }


  // Q7: Selection Process
  faqs.push({
    question: `What is the selection process for ${post.shortTitle}?`,
    answer: post.selectionProcess && post.selectionProcess.length > 0
      ? `The selection process consists of: ${post.selectionProcess.join(' → ')}.`
      : `Selection is based on Computer Based Written Exam (CBT), Skill Test / Physical Test (if applicable), Document Verification, and Medical Exam.`
  });

  // Q8: How to apply
  faqs.push({
    question: `How can I apply online for ${post.shortTitle}?`,
    answer: `Candidates can apply online through the official portal via Sarkari Result. Navigate to '${post.shortTitle}', check the eligibility criteria, and click on the direct 'Apply Online' link. Read the official notification thoroughly before applying.`
  });

  return faqs;
};

export const getCategoryShareText = (post: SarkariPost, postUrl: string): string => {
  const postName = post.title || post.shortTitle;
  const qual = post.qualifications && post.qualifications.length > 0 ? post.qualifications.join(', ') : 'अधिसूचना अनुसार';
  const age = post.ageLimit?.minAge && post.ageLimit?.maxAge ? `${post.ageLimit.minAge} से ${post.ageLimit.maxAge} वर्ष` : 'नियमानुसार';
  const fee = post.applicationFee && post.applicationFee.length > 0 ? post.applicationFee[0].amount : 'नियमानुसार';

  switch (post.category) {
    case 'result':
      return `🔴 *सरकारी रिजल्ट बड़ा अपडेट* 🔴\n\n📜 *परीक्षा/परिणाम:* ${postName}\n🗓️ *परिणाम तिथि:* ${post.resultDate || post.postDate || 'घोषित'}\n✅ *स्थिति:* रिजल्ट व मेरिट लिस्ट उपलब्ध\n\n👇 *अपना रिजल्ट व स्कोरकार्ड देखने हेतु क्लिक करें:*\n${postUrl}`;

    case 'admit_card':
      return `🎫 *सरकारी एडमिट कार्ड अपडेट* 🎫\n\n📝 *परीक्षा का नाम:* ${postName}\n🗓️ *परीक्षा / हॉल टिकट तिथि:* ${post.admitCardDate || post.examDate || 'जारी हुआ'}\n🎓 *योग्य उम्मीदवार:* ${qual}\n\n👇 *अपना एडमिट कार्ड डाउनलोड करने हेतु क्लिक करें:*\n${postUrl}`;

    case 'answer_key':
      return `🔑 *सरकारी उत्तर कुंजी (Answer Key) अपडेट* 🔑\n\n📝 *परीक्षा का नाम:* ${postName}\n🗓️ *उत्तर कुंजी तिथि:* ${post.postDate || 'जारी हुई'}\n\n👇 *आंसर की डाउनलोड करें व आपत्ति दर्ज करें:*\n${postUrl}`;

    case 'syllabus':
      return `📚 *सरकारी परीक्षा सिलेबस व पैटर्न* 📚\n\n📝 *परीक्षा का नाम:* ${postName}\n🎓 *योग्यता:* ${qual}\n\n👇 *नया सिलेबस व परीक्षा पैटर्न PDF डाउनलोड करें:*\n${postUrl}`;

    case 'admission':
      return `🎓 *सरकारी एडमिशन फॉर्म अपडेट* 🎓\n\n📝 *कोर्स/प्रवेश का नाम:* ${postName}\n🎓 *योग्यता:* ${qual}\n⏳ *आवेदन की अंतिम तिथि:* ${post.lastDate || 'अधिसूचना देखें'}\n\n👇 *ऑनलाइन एडमिशन फॉर्म भरने हेतु क्लिक करें:*\n${postUrl}`;

    case 'certificate_verification':
    case 'important':
      return `🌐 *सरकारी डिजिटल सेवा व सत्यापन पोर्टल* 🌐\n\n📜 *सेवा/प्रमाणपत्र:* ${postName}\n\n👇 *डिजिटल सत्यापन व ऑनलाइन आवेदन हेतु क्लिक करें:*\n${postUrl}`;

    case 'latest_jobs':
    default:
      return `🚨 *सरकारी नौकरी बड़ा अपडेट* 🚨\n\n📋 *भर्ती का नाम:* ${postName}\n🔢 *कुल पद:* ${post.totalVacancies || 'अधिसूचना देखें'}\n🎓 *योग्यता:* ${qual}\n🎂 *आयु सीमा:* ${age}\n💳 *आवेदन शुल्क:* ${fee}\n⏳ *आवेदन की अंतिम तिथि:* ${post.lastDate || 'अधिसूचना देखें'}\n\n👇 *संपूर्ण विवरण पढ़ें व ऑनलाइन फॉर्म भरें:*\n${postUrl}`;
  }
};

// Helper to bold application date ranges and keywords in shortInfo
const renderFormattedShortInfo = (text: string) => {
  // Regex to bold dates like "25 October 2026 to 15 November 2026" or similar patterns
  const dateRegex = /(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+to\s+\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/gi;
  const parts = text.split(dateRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (dateRegex.test(part)) {
          return <strong key={i} className="font-bold text-slate-900">{part}</strong>;
        }
        return part;
      })}
    </>
  );
};

export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'latest_jobs':
      return 'Latest Jobs';
    case 'admit_card':
      return 'Admit Card';
    case 'result':
      return 'Result';
    case 'answer_key':
      return 'Answer Key';
    case 'syllabus':
      return 'Syllabus';
    case 'admission':
      return 'Admission';
    case 'certificate_verification':
      return 'Certificate Verification';
    case 'important':
      return 'Important';
    default:
      return category.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

const getDepartmentHeader = (dept: string, postTitle: string, isInfo: boolean): string => {
  if (isInfo) return 'Sarkari Result Official Notice';
  const titleLower = (postTitle + ' ' + dept).toLowerCase();
  if (titleLower.includes('supreme court') || titleLower.includes('court master') || titleLower.includes('sci')) {
    return 'Supreme Court of India (SCI)';
  }
  if (dept === 'UPSC' || titleLower.includes('upsc') || titleLower.includes('civil services') || titleLower.includes('cds')) {
    return 'Union Public Service Commission (UPSC)';
  }
  if (dept === 'SSC' || titleLower.includes('staff selection') || titleLower.includes('ssc')) {
    return 'Staff Selection Commission (SSC)';
  }
  if (dept === 'Railway' || titleLower.includes('railway') || titleLower.includes('rrb') || titleLower.includes('rrc') || titleLower.includes('alp')) {
    return 'Railway Recruitment Board (RRB / RRC)';
  }
  if (dept === 'Banking' || titleLower.includes('ibps') || titleLower.includes('sbi') || titleLower.includes('bank')) {
    return 'Institute of Banking Personnel Selection (IBPS / SBI)';
  }
  if (dept === 'Police' || titleLower.includes('police') || titleLower.includes('constable') || titleLower.includes('si ')) {
    return 'Police Recruitment & Promotion Board';
  }
  if (dept === 'Teaching' || titleLower.includes('tet') || titleLower.includes('ctet') || titleLower.includes('teacher')) {
    return 'Teacher Eligibility & Education Board';
  }
  if (dept && dept !== 'Other') return dept;
  return 'Supreme Court of India (SCI)';
};

export const FullPagePostView: React.FC<FullPagePostViewProps> = ({
  post,
  onBack,
  isBookmarked = false,
  onToggleBookmark,
  onSelectPost,
  isHindi,
  allPosts = [],
  onOpenAdmin
}) => {
  const faqs = getPostFAQs(post);

  const [isAlertActive, setIsAlertActive] = React.useState<boolean>(() => isPostAlertActive(post.id));
  const [isAlertModalOpen, setIsAlertModalOpen] = React.useState<boolean>(false);
  const [alertFeedback, setAlertFeedback] = React.useState<string | null>(null);

  useEffect(() => {
    setIsAlertActive(isPostAlertActive(post.id));
  }, [post.id]);

  // Auto-open Alert modal ONLY if user opens via share link for the first time ("User pahli baar open kare tabhi vo bhi share link se open kare")
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isSharedLink = 
      window.location.search.toLowerCase().includes('share') || 
      window.location.hash.toLowerCase().includes('share') ||
      sessionStorage.getItem('sarkari_opened_via_share_link') === 'true' ||
      (document.referrer && (
        document.referrer.toLowerCase().includes('whatsapp') ||
        document.referrer.toLowerCase().includes('telegram') ||
        document.referrer.toLowerCase().includes('facebook') ||
        document.referrer.toLowerCase().includes('t.co')
      ));

    const hasSeenAlert = localStorage.getItem(`sarkari_alert_seen_${post.id}`);

    if (isSharedLink && !hasSeenAlert) {
      // Mark as seen so it will NOT auto-open again on subsequent visits
      try {
        localStorage.setItem(`sarkari_alert_seen_${post.id}`, 'true');
      } catch (e) {
        console.error(e);
      }

      const timer = setTimeout(() => {
        setIsAlertModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [post.id]);

  const handleAlertToggle = async () => {
    const res = await togglePostAlert(post);
    setIsAlertActive(res.isAlertSet);
    if (res.isAlertSet) {
      if (res.permission === 'granted') {
        setAlertFeedback('🔔 Job Alert Set! Browser notification will trigger as soon as status becomes Active.');
      } else if (res.permission === 'denied') {
        setAlertFeedback('⚠️ Alert Saved! Note: Browser notifications are currently blocked in site settings.');
      } else {
        setAlertFeedback('🔔 Alert Saved to your Watchlist!');
      }
      if (onToggleBookmark && !isBookmarked) {
        onToggleBookmark(post.id);
      }
    } else {
      setAlertFeedback('Alert removed for this post.');
    }
    setTimeout(() => setAlertFeedback(null), 4000);
  };

  // Related Posts: 3 other jobs from the same category or department
  const relatedPosts = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];

    // Prioritize same category posts
    const sameCat = allPosts.filter(
      (p) => p.id !== post.id && p.category === post.category
    );

    // Same department
    const sameDept = allPosts.filter(
      (p) => p.id !== post.id && p.department === post.department && !sameCat.some((c) => c.id === p.id)
    );

    const candidates = [...sameCat, ...sameDept];

    if (candidates.length < 3) {
      const remaining = allPosts.filter(
        (p) => p.id !== post.id && !candidates.some((c) => c.id === p.id)
      );
      return [...candidates, ...remaining].slice(0, 3);
    }

    return candidates.slice(0, 3);
  }, [allPosts, post]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = `${post.title} - Sarkari Result`;

    // Dynamic FAQ Schema injection for each post
    const faqScriptId = 'post-faq-jsonld-schema';
    let faqScriptTag = document.getElementById(faqScriptId) as HTMLScriptElement | null;
    if (!faqScriptTag) {
      faqScriptTag = document.createElement('script');
      faqScriptTag.id = faqScriptId;
      faqScriptTag.type = 'application/ld+json';
      document.head.appendChild(faqScriptTag);
    }
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    };
    faqScriptTag.textContent = JSON.stringify(faqSchema);

    // Dynamic Breadcrumb Schema injection for SEO
    const breadcrumbScriptId = 'post-breadcrumb-jsonld-schema';
    let breadcrumbScriptTag = document.getElementById(breadcrumbScriptId) as HTMLScriptElement | null;
    if (!breadcrumbScriptTag) {
      breadcrumbScriptTag = document.createElement('script');
      breadcrumbScriptTag.id = breadcrumbScriptId;
      breadcrumbScriptTag.type = 'application/ld+json';
      document.head.appendChild(breadcrumbScriptTag);
    }
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.sarkariresult.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `${baseUrl}/post/${post.slug}`;
    const categoryName = getCategoryLabel(post.category);

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": categoryName,
          "item": `${baseUrl}/#${post.category}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.shortTitle || post.title,
          "item": currentUrl
        }
      ]
    };
    breadcrumbScriptTag.textContent = JSON.stringify(breadcrumbSchema);

    return () => {
      const existingFaq = document.getElementById(faqScriptId);
      if (existingFaq) existingFaq.remove();
      const existingBc = document.getElementById(breadcrumbScriptId);
      if (existingBc) existingBc.remove();
    };
  }, [post, faqs]);

  const isServiceOrScheme = post.category === 'important' || post.category === 'certificate_verification';

  // Only show Age Relaxation Rules and Selection Process for main recruitment categories
  const showRecruitmentDetails = ['latest_jobs', 'result', 'admit_card', 'answer_key'].includes(post.category);

  // Identify statutory & informational posts (Disclaimer, Rules, Contact Us, etc.)
  const isInformationalPost = useMemo(() => {
    return (
      post.slug === 'disclaimer' || 
      post.slug === 'rules-and-regulations' || 
      post.slug === 'contact-us' ||
      (post.category === 'important' && (
        post.slug.includes('disclaimer') || 
        post.slug.includes('rules') || 
        post.slug.includes('contact')
      ))
    );
  }, [post.slug, post.category]);

  // Ensure WhatsApp & Telegram channel links are included in Useful Links for all posts
  const allDirectLinks = useMemo(() => {
    const existing = [...post.directLinks];
    const hasWhatsapp = existing.some(l => l.label.toLowerCase().includes('whatsapp'));
    const hasTelegram = existing.some(l => l.label.toLowerCase().includes('telegram'));

    const result = [...existing];

    if (!hasWhatsapp) {
      result.push({
        label: 'Join Official WhatsApp Channel for Fast Job Alerts',
        actionText: 'Join WhatsApp',
        type: 'official',
        url: 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j',
        isPrimary: true
      });
    }

    if (!hasTelegram) {
      result.push({
        label: 'Join Official Telegram Channel',
        actionText: 'Join Telegram',
        type: 'official',
        url: 'https://t.me/newsarkariresultt'
      });
    }

    return result;
  }, [post.directLinks]);

  // Category breadcrumb text (e.g. "Admit card updates", "Latest jobs updates", "Result updates")
  const getCategoryUpdatesLabel = () => {
    switch (post.category) {
      case 'admit_card':
        return 'Admit card updates';
      case 'result':
        return 'Result updates';
      case 'latest_jobs':
        return 'Latest jobs updates';
      case 'answer_key':
        return 'Answer key updates';
      case 'admission':
        return 'Admission updates';
      case 'certificate_verification':
        return 'Certificate Verification updates';
      default:
        return 'Recruitment updates';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] pb-20 text-[15px] font-sans">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-5">
        
        {/* Navigation Breadcrumbs (Home > Category > Post Title) & Actions */}
        <nav aria-label="Breadcrumb navigation" className="mb-2 bg-white border border-slate-200 rounded-t-xs px-3 sm:px-4 py-2 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
          <ol className="flex items-center gap-1.5 sm:gap-2 text-slate-700 text-[13px] sm:text-[14px] flex-wrap font-sans">
            <li className="flex items-center gap-1">
              <button 
                onClick={onBack} 
                className="hover:text-[#cc0000] text-slate-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Go to Home"
              >
                <Home className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Home</span>
              </button>
            </li>

            <li className="text-slate-400 font-bold select-none">&gt;</li>

            <li className="flex items-center gap-1">
              <button
                onClick={onBack}
                className="hover:text-[#cc0000] text-slate-800 font-bold transition-colors cursor-pointer capitalize"
                title={`View ${getCategoryLabel(post.category)} posts`}
              >
                {getCategoryLabel(post.category)}
              </button>
            </li>

            <li className="text-slate-400 font-bold select-none">&gt;</li>

            <li className="text-slate-900 font-bold truncate max-w-[140px] sm:max-w-[260px] md:max-w-[360px]" title={post.title}>
              {post.shortTitle || post.title}
            </li>
          </ol>

          {/* Alert Me Quick Action Button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-bold cursor-pointer transition-all shadow-2xs ${
                isAlertActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
              title="Click to open Job Alert settings popup"
            >
              {isAlertActive ? (
                <>
                  <BellRing className="w-4 h-4 animate-bounce text-slate-950" />
                  <span>Alert Set 🔔</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Alert Me 🔔</span>
                </>
              )}
            </button>
          </div>
        </nav>

        {/* Alert Toast Feedback */}
        {alertFeedback && (
          <div className="mb-2 bg-amber-50 border border-amber-300 text-amber-950 px-3.5 py-2 rounded text-[13px] font-semibold flex items-center justify-between shadow-2xs animate-fade-in">
            <span>{alertFeedback}</span>
            <button onClick={() => setAlertFeedback(null)} className="text-amber-800 font-bold text-xs hover:underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Main Document Paper Container */}
        <article className="bg-white rounded-b-xs shadow-xs border border-slate-300 overflow-hidden">
          
          {/* Post Header Table - EXACT layout, colors and typography from Screenshot_20261020-155228.Chrome_5245ca1c.png */}
          <div className="p-3 sm:p-5 border-b border-slate-200 bg-white">
            <div className="border border-slate-200 rounded-xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {/* Row 1: Name Of Post */}
                  <tr className="border-b border-slate-200">
                    <td className="p-3 sm:p-4 text-[#ff0000] font-bold text-[16pt] align-top border-r border-slate-200 w-28 sm:w-56 shrink-0 leading-tight">
                      Name Of Post :
                    </td>
                    <td className="p-3 sm:p-4 align-top">
                      <h1 className="text-[#ff0000] font-black text-[16pt] leading-snug tracking-tight font-serif">
                        {post.title}
                      </h1>
                    </td>
                  </tr>

                  {/* Row 2: Post Date / Update & Status */}
                  <tr className="border-b border-slate-200">
                    <td className="p-3 sm:p-4 text-[#ff0000] font-bold text-[14pt] align-top border-r border-slate-200 w-28 sm:w-56 shrink-0 leading-tight">
                      Post Date / Status :
                    </td>
                    <td className="p-3 sm:p-4 text-slate-900 font-semibold text-[12pt] align-top flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{post.postDate} | 08:40 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPostStatus(post) === 'upcoming' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-bold text-xs">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            <span>Upcoming (आगामी)</span>
                          </span>
                        ) : getPostStatus(post) === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-full font-bold text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            <span>Active (आवेदन जारी)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded-full font-bold text-xs">
                            <span>Closed</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Row 3: Short Information */}
                  <tr>
                    <td className="p-3 sm:p-4 text-[#ff0000] font-bold text-[14pt] align-top border-r border-slate-200 w-28 sm:w-56 shrink-0 leading-tight">
                      Short Information :
                    </td>
                    <td className="p-3 sm:p-4 text-slate-800 text-[12pt] leading-relaxed align-top">
                      <div className="text-slate-900 text-[12pt] leading-relaxed font-sans">
                        {renderFormattedShortInfo(post.shortInfo)}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Channels 2x2 Grid Strip directly below Short Info - Matching Screenshot_20261020-155228.Chrome_5245ca1c.png */}
          <div className="px-3 sm:px-5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 bg-slate-50/50 border-b border-slate-200">
            {/* Telegram Pill */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#229ED9] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Send className="w-4 h-4 ml-[-1px]" />
                </div>
                <span className="font-bold text-[12pt] text-slate-900">Telegram</span>
              </div>
              <a
                href="https://t.me/newsarkariresultt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#229ED9] hover:bg-[#1a85ba] text-white text-[12pt] font-bold px-4 py-1.5 rounded-md shadow-2xs cursor-pointer transition-colors"
              >
                Join Us
              </a>
            </div>

            {/* WhatsApp Pill */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="font-bold text-[12pt] text-slate-900">WhatsApp</span>
              </div>
              <a
                href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1fae53] text-white text-[12pt] font-bold px-4 py-1.5 rounded-md shadow-2xs cursor-pointer transition-colors"
              >
                Join Us
              </a>
            </div>
          </div>



          {/* Section Body Details */}
          <div className="p-5 sm:p-8 md:p-10 space-y-7 sm:space-y-9 md:space-y-10 text-slate-900 text-[12pt]">
            
            {/* Center Header Details (Organization, Title) - Matching Screenshot */}
            <div className="text-center py-4 border-b border-slate-200 space-y-2">
              <h2 
                className="text-[#16a34a] font-black text-[16pt] sm:text-[18pt] font-sans uppercase tracking-tight"
                style={{ color: '#16a34a' }}
              >
                {getDepartmentHeader(post.department, post.title, isInformationalPost)}
              </h2>
              <div 
                className="text-[#c026d3] font-bold text-[14pt] sm:text-[15pt] leading-snug font-sans"
                style={{ color: '#c026d3' }}
              >
                {post.title || post.shortTitle}
              </div>
            </div>

            {/* IF INFORMATIONAL POST (Disclaimer, Rules, Contact Us): Render Normal Article Layout */}
            {isInformationalPost && (
              <div className="space-y-6 sm:space-y-7">
                {/* Informational Policy & Contact Cards */}
                {post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
                  <div className="space-y-6">
                    {post.vacancyBreakdown.map((item, idx) => (
                      <div key={idx} className="border border-slate-300 bg-white p-5 sm:p-7 text-[12pt] space-y-3 shadow-2xs">
                        <h4 
                          className="text-[#16a34a] font-black text-[16pt] border-b border-slate-200 pb-2.5 font-sans"
                          style={{ color: '#16a34a' }}
                        >
                          {item.postName}
                        </h4>
                        <div className="text-slate-800 leading-relaxed whitespace-pre-line font-sans pt-1 text-[12pt]">
                          {item.eligibility}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Informational Guidelines / Instructions */}
                {post.howToApplySteps && post.howToApplySteps.length > 0 && (
                  <div className="border border-slate-300 bg-white p-5 sm:p-7 text-[12pt] space-y-3.5 shadow-2xs">
                    <h4 
                      className="text-[#16a34a] font-black text-[16pt] border-b border-slate-200 pb-3 font-sans"
                      style={{ color: '#16a34a' }}
                    >
                      {post.shortTitle} Guidelines & Important Information
                    </h4>
                    <ul className="space-y-3 text-slate-800 pt-1 leading-relaxed text-[12pt]">
                      {post.howToApplySteps.map((step, idx) => (
                        <li key={idx}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* IF RECRUITMENT JOB POST: Render Recruitment Specific Tables & Boxes */}
            {!isInformationalPost && (
              <>
                {/* Horizontal Side-by-Side 2-Column Table for Important Dates & Application Fee */}
                <div className="border border-slate-300 bg-white grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300 text-[12pt] shadow-2xs">
                  
                  {/* Left Column: Important Dates */}
                  <div className="p-5 sm:p-7 space-y-3.5">
                    <h3 
                      className="text-[#16a34a] font-black text-[16pt] border-b border-slate-200 pb-3 text-center font-sans uppercase"
                      style={{ color: '#16a34a' }}
                    >
                      Important Dates
                    </h3>
                    <ul className="space-y-3 text-[12pt] text-slate-800 pt-1 leading-relaxed">
                      {getProcessedImportantDates(post).map((d, idx) => (
                        <li key={idx} className="leading-snug">
                          <span className="text-slate-800 font-medium">• {d.label} : </span>
                          <span className={d.isHighlight ? 'text-[#dc2626] font-bold' : 'text-slate-900 font-bold'}>
                            {d.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Application Fee */}
                  <div className="p-5 sm:p-7 space-y-3.5">
                    <h3 
                      className="text-[#16a34a] font-black text-[16pt] border-b border-slate-200 pb-3 text-center font-sans uppercase"
                      style={{ color: '#16a34a' }}
                    >
                      Application Fee
                    </h3>
                    <ul className="space-y-3 text-[12pt] text-slate-800 pt-1 leading-relaxed">
                      {post.applicationFee.length > 0 ? (
                        post.applicationFee.map((fee, idx) => (
                          <li key={idx} className="leading-snug">
                            <span className="text-slate-800 font-medium">• {fee.category} : </span>
                            <span className="text-slate-900 font-bold">{fee.amount}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-600 italic leading-snug">• No Application Fee</li>
                      )}
                      <li className="leading-snug text-slate-700 pt-1.5 border-t border-slate-100 mt-2.5">
                        • Pay the Examination Fee Through Cash at E-Challan / Net Banking / Debit Card / Credit Card / UPI Mode Only
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Age Limit Box */}
                {!isServiceOrScheme && post.ageLimit.asOnDate && (
                  <div className="border border-slate-300 bg-white p-5 sm:p-7 text-[12pt] space-y-3.5 shadow-2xs">
                    <h4 
                      className="text-[#16a34a] font-black text-[16pt] border-b border-slate-200 pb-3 font-sans"
                      style={{ color: '#16a34a' }}
                    >
                      {post.shortTitle} Age Limit as on {post.ageLimit.asOnDate}
                    </h4>
                    <ul className="space-y-2.5 text-slate-800 pt-1 leading-relaxed text-[12pt]">
                      {post.ageLimit.minAge && (
                        <li>• Minimum Age : <strong className="font-bold text-slate-900">{post.ageLimit.minAge} Years.</strong></li>
                      )}
                      {post.ageLimit.maxAge && (
                        <li>• Maximum Age : <strong className="font-bold text-slate-900">{post.ageLimit.maxAge} Years.</strong></li>
                      )}
                      {post.ageLimit.notes ? (
                        <li className="text-slate-700">• {post.ageLimit.notes}</li>
                      ) : (
                        <li className="text-slate-700">• Age Relaxation Extra as per Official Recruitment Rules for SC / ST / OBC / PwD / Ex-Servicemen.</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Category-Wise Age Relaxation Rule Table (Only for Latest Jobs, Result, Admit Card, Answer Key) */}
                {showRecruitmentDetails && !isServiceOrScheme && post.ageLimit.asOnDate && (
                  <div className="border border-slate-300 bg-white overflow-hidden text-[12pt] shadow-2xs">
                    <div className="bg-[#16a34a] text-white px-5 py-3 text-[16pt] font-black uppercase tracking-wide text-center">
                      {post.shortTitle} Category-Wise Age Relaxation Rules
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-black text-[14pt]">
                            <th className="p-4 sm:p-4.5 border-r border-slate-300 w-1/2">Reserved Category</th>
                            <th className="p-4 sm:p-4.5">Age Relaxation Permissible (Upper Limit)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800 text-[12pt]">
                          <tr className="hover:bg-slate-50/50">
                            <td className="p-4 sm:p-4.5 border-r border-slate-300 font-semibold">• OBC (Other Backward Classes)</td>
                            <td className="p-4 sm:p-4.5 font-bold text-slate-900">03 Years Extra</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="p-4 sm:p-4.5 border-r border-slate-300 font-semibold">• SC / ST (Scheduled Castes / Scheduled Tribes)</td>
                            <td className="p-4 sm:p-4.5 font-bold text-slate-900">05 Years Extra</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="p-4 sm:p-4.5 border-r border-slate-300 font-semibold">• PwD (Persons with Benchmark Disabilities)</td>
                            <td className="p-4 sm:p-4.5 font-bold text-slate-900">10 Years Extra</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="p-4 sm:p-4.5 border-r border-slate-300 font-semibold">• Ex-Servicemen (ESM)</td>
                            <td className="p-4 sm:p-4.5 font-bold text-slate-900">03 Years after military service deduction</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Vacancy Details Table */}
                {post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
                  <div className="border border-slate-300 bg-white overflow-hidden text-[12pt] shadow-2xs">
                    <div className="bg-[#16a34a] text-white px-5 py-3 text-[16pt] font-black uppercase tracking-wide text-center">
                      {post.shortTitle} Vacancy Details Total : {post.totalVacancies} Posts
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-black text-[14pt]">
                            <th className="p-4 sm:p-4.5 border-r border-slate-300 w-1/4">Post Name</th>
                            <th className="p-4 sm:p-4.5 border-r border-slate-300 w-1/6 text-center">Total Post</th>
                            <th className="p-4 sm:p-4.5">Eligibility Criteria</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-[12pt]">
                          {post.vacancyBreakdown.map((v, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-4 sm:p-4.5 align-top font-bold text-blue-900 border-r border-slate-300">
                                {v.postName}
                              </td>
                              <td className="p-4 sm:p-4.5 align-top text-center font-bold text-slate-900 border-r border-slate-300">
                                {v.totalPosts}
                              </td>
                              <td className="p-4 sm:p-4.5 align-top text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                                {v.eligibility}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Mode of Selection & Examination Scheme (Only for Latest Jobs, Result, Admit Card, Answer Key) */}
                {showRecruitmentDetails && (
                  <div className="border border-slate-300 bg-white p-5 sm:p-7 text-[12pt] space-y-3.5 shadow-2xs">
                    <h4 
                      className="text-[#16a34a] font-black text-[16pt] border-b border-slate-200 pb-3 font-sans"
                      style={{ color: '#16a34a' }}
                    >
                      {post.shortTitle} Selection Process / Mode of Selection
                    </h4>
                    <div className="pt-1">
                      <p className="text-slate-800 mb-3.5 leading-relaxed font-sans text-[12pt]">
                        The recruitment board will select eligible candidates through the following sequential stages:
                      </p>
                      <ol className="space-y-3 text-slate-900 font-medium text-[12pt]">
                        {post.selectionProcess && post.selectionProcess.length > 0 ? (
                          post.selectionProcess.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 bg-slate-50/80 p-3.5 sm:p-4 rounded border border-slate-200">
                              <span className="font-bold text-white bg-[#16a34a] text-[12pt] px-2.5 py-1 rounded shrink-0 mt-0.5">Stage {idx + 1}</span>
                              <span className="leading-relaxed text-slate-800">{step}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-start gap-3 bg-slate-50/80 p-3.5 sm:p-4 rounded border border-slate-200">
                              <span className="font-bold text-white bg-[#16a34a] text-[12pt] px-2.5 py-1 rounded shrink-0 mt-0.5">Stage 1</span>
                              <span className="leading-relaxed text-slate-800"><strong>Computer Based Test (CBT) / Written Entrance Exam :</strong> Objective type multiple choice questions covering General Awareness, Quantitative Aptitude, Reasoning Ability, and General Knowledge.</span>
                            </li>
                            <li className="flex items-start gap-3 bg-slate-50/80 p-3.5 sm:p-4 rounded border border-slate-200">
                              <span className="font-bold text-white bg-[#16a34a] text-[12pt] px-2.5 py-1 rounded shrink-0 mt-0.5">Stage 2</span>
                              <span className="leading-relaxed text-slate-800"><strong>Skill Test / Physical Standard & Efficiency Test (PET/PST) :</strong> Qualifying nature skill test or physical standards evaluation as applicable for specific post code.</span>
                            </li>
                            <li className="flex items-start gap-3 bg-slate-50/80 p-3.5 sm:p-4 rounded border border-slate-200">
                              <span className="font-bold text-white bg-[#16a34a] text-[12pt] px-2.5 py-1 rounded shrink-0 mt-0.5">Stage 3</span>
                              <span className="leading-relaxed text-slate-800"><strong>Document Verification (DV) :</strong> Verification of original educational certificates, category caste certificates, domicile proof, and photo identity proof.</span>
                            </li>
                            <li className="flex items-start gap-3 bg-slate-50/80 p-3.5 sm:p-4 rounded border border-slate-200">
                              <span className="font-bold text-white bg-[#16a34a] text-[12pt] px-2.5 py-1 rounded shrink-0 mt-0.5">Stage 4</span>
                              <span className="leading-relaxed text-slate-800"><strong>Detailed Medical Examination (DME) :</strong> Final medical fitness checkup by authorized medical board prior to issuance of appointment letter.</span>
                            </li>
                          </>
                        )}
                      </ol>
                    </div>
                  </div>
                )}

                {/* How to Fill Form Section */}
                {post.howToApplySteps && post.howToApplySteps.length > 0 && (
                  <div className="border border-slate-300 bg-white p-5 sm:p-7 text-[12pt] space-y-3.5 shadow-2xs">
                    <h4 
                      className="text-[#16a34a] font-black text-[16pt] border-b border-slate-200 pb-3 font-sans"
                      style={{ color: '#16a34a' }}
                    >
                      How to Fill {post.shortTitle} Online Form
                    </h4>
                    <ul className="space-y-3 text-slate-800 pt-1 leading-relaxed text-[12pt]">
                      {post.howToApplySteps.map((step, idx) => (
                        <li key={idx}>• {step}</li>
                      ))}
                      <li className="text-[#dc2626] font-bold pt-1.5 border-t border-slate-100 mt-3">
                        • Interested Candidate Can Read the Full Notification Before Apply Online.
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* Useful Important Links Table (Includes WhatsApp & Telegram for ALL Posts) */}
            <div className="border border-slate-300 bg-white overflow-hidden text-[12pt] shadow-2xs">
              <div className="bg-[#dc2626] text-white px-5 py-3 text-[16pt] font-black uppercase tracking-wide text-center">
                Some Useful Important Links
              </div>
              <div className="divide-y divide-slate-200 text-[12pt]">
                {allDirectLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 sm:p-4.5 hover:bg-slate-50 gap-4">
                    <span className="font-bold text-slate-900">• {link.label}</span>
                    <a
                      href={link.url || 'https://main.sci.gov.in/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 px-4.5 py-2 text-white font-bold rounded-xs text-[12pt] shadow-2xs cursor-pointer shrink-0 transition-colors ${
                        link.label.toLowerCase().includes('whatsapp') 
                          ? 'bg-[#25D366] hover:bg-[#1fae53] text-slate-950 font-black' 
                          : link.label.toLowerCase().includes('telegram')
                          ? 'bg-[#229ED9] hover:bg-[#1a85ba]'
                          : 'bg-[#1432c7] hover:bg-blue-800'
                      }`}
                    >
                      <span>{link.actionText || 'Click Here'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Posts Section - 3 Suggestions from Same Category or Department (JUST ABOVE FAQ) */}
            {relatedPosts.length > 0 && (
              <div className="border border-slate-300 bg-white overflow-hidden text-[12pt] shadow-2xs">
                <div className="bg-[#dc2626] text-white px-5 py-3 text-[16pt] font-black uppercase tracking-wide flex items-center justify-between">
                  <span>
                    {isHindi ? 'सम्बंधित रिक्तियां एवं अपडेट्स (Related Posts)' : 'Related Posts & Updates'}
                  </span>
                  <span className="text-[12pt] bg-white/20 px-2.5 py-0.5 rounded font-normal capitalize">
                    {post.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="divide-y divide-slate-200 text-[12pt]">
                  {relatedPosts.map((related) => (
                    <div 
                      key={related.id} 
                      className="p-4 sm:p-5 hover:bg-amber-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                      onClick={() => {
                        if (onSelectPost) onSelectPost(related);
                      }}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-[12pt] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                            {related.department}
                          </span>
                          {related.isNew && (
                            <span className="text-[12pt] font-extrabold px-1.5 py-0.5 bg-red-600 text-white rounded">
                              NEW
                            </span>
                          )}
                          {related.lastDate && (
                            <span className="text-[12pt] text-slate-600">
                              Last Date: <strong className="text-slate-900">{related.lastDate}</strong>
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-[14pt] text-blue-900 group-hover:text-[#dc2626] group-hover:underline transition-colors leading-snug">
                          • {related.title}
                        </h4>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectPost) onSelectPost(related);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2 bg-[#1432c7] hover:bg-blue-800 text-white font-bold rounded-xs text-[12pt] shadow-2xs cursor-pointer shrink-0 transition-colors self-start sm:self-auto"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frequently Asked Questions (FAQ) Section */}
            {faqs.length > 0 && (
              <div className="border border-slate-300 bg-white overflow-hidden text-[12pt] shadow-2xs">
                <div className="bg-[#16a34a] text-white px-5 py-3 text-[16pt] font-black uppercase tracking-wide text-center">
                  Frequently Asked Questions (FAQ) – {post.shortTitle}
                </div>
                <div className="p-5 sm:p-8 divide-y divide-slate-100 space-y-5">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="pt-5 first:pt-0">
                      <h5 className="font-bold text-emerald-950 text-[14pt] leading-snug flex items-start gap-2">
                        <span className="font-black text-[#dc2626] text-[14pt] shrink-0">Q.{idx + 1}</span>
                        <span className="text-[14pt]">{faq.question}</span>
                      </h5>
                      <p className="text-slate-800 text-[12pt] mt-2 pl-7 sm:pl-8 leading-normal font-sans">
                        <strong className="text-slate-900 font-bold text-[12pt]">Ans.</strong> {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* Post Alert Popup Modal */}
      <PostAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        post={post}
        onAlertChange={(active) => setIsAlertActive(active)}
      />
    </div>
  );
};
