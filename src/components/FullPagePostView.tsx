import React, { useEffect, useMemo, useState } from 'react';
import { SarkariPost } from '../types/job';
import { getProcessedImportantDates } from '../utils/dateUtils';
import { 
  ExternalLink, 
  ChevronRight,
  Home,
  Send,
  MessageCircle,
  Trash2,
  Plus,
  ShieldCheck,
  Settings,
  BookOpen
} from 'lucide-react';
import { isPostAlertActive, togglePostAlert, getPostStatus } from '../utils/alertManager';
import { PostAlertModal } from './PostAlertModal';
import { ALL_RRB_BOARDS } from '../data/rrbBoards';

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
  onOpenDirectEditor?: () => void;
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
  onOpenAdmin,
  onOpenDirectEditor
}) => {
  const faqs = getPostFAQs(post);

  const [isAlertActive, setIsAlertActive] = React.useState<boolean>(() => isPostAlertActive(post.id));
  const [isAlertModalOpen, setIsAlertModalOpen] = React.useState<boolean>(false);
  const [alertFeedback, setAlertFeedback] = React.useState<string | null>(null);
  const [hiddenSections, setHiddenSections] = React.useState<Record<string, boolean>>({});

  const isAdmin = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('sarkari_admin_auth') === 'true';
  }, []);

  const renderSectionControls = (sectionId: string, sectionTitle: string) => {
    if (!isAdmin) return null;
    return (
      <div className="flex items-center gap-1.5 font-sans font-normal text-xs my-1 sm:my-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenDirectEditor) onOpenDirectEditor();
            else if (onOpenAdmin) onOpenAdmin();
          }}
          className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-2xs text-[11px]"
          title={`${sectionTitle} एडिट करें`}
        >
          <span>✏️</span>
          <span>एडिट करें</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`क्या आप वाकई "${sectionTitle}" सेक्शन को इस पोस्ट से हटाना चाहते हैं?`)) {
              setHiddenSections(prev => ({ ...prev, [sectionId]: true }));
              setAlertFeedback(`"${sectionTitle}" सेक्शन हटा दिया गया है।`);
            }
          }}
          className="bg-red-100 hover:bg-red-200 text-red-950 border border-red-300 font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-2xs text-[11px]"
          title={`${sectionTitle} सेक्शन हटाएं`}
        >
          <Trash2 className="w-3 h-3 text-red-600" />
          <span>सेक्शन हटाएं</span>
        </button>
      </div>
    );
  };

  const renderHiddenBanner = (sectionId: string, sectionTitle: string) => {
    if (!hiddenSections[sectionId]) return null;
    return (
      <div className="bg-slate-100 border border-dashed border-slate-300 p-3 rounded text-xs font-semibold text-slate-600 flex items-center justify-between gap-2 my-2 font-sans">
        <span className="flex items-center gap-1.5">
          <span>🚫</span>
          <span><strong>{sectionTitle}</strong> (सेक्शन हटाया गया है)</span>
        </span>
        <button
          type="button"
          onClick={() => {
            setHiddenSections(prev => ({ ...prev, [sectionId]: false }));
            setAlertFeedback(`"${sectionTitle}" सेक्शन वापस ला दिया गया है।`);
          }}
          className="text-blue-700 hover:underline font-bold cursor-pointer"
        >
          ↩️ वापस लाएं (Restore)
        </button>
      </div>
    );
  };

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

    /*
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
    */
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

  // Contextual Latest Jobs (excluding current open post)
  const contextualLatestJobs = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];
    return allPosts
      .filter((p) => p.id !== post.id && p.slug !== post.slug)
      .slice(0, 3);
  }, [allPosts, post]);

  // Related Posts: Strictly jobs related to current open post by department, keywords & category
  const relatedPosts = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];

    const currentTitleWords = (post.title + ' ' + (post.shortTitle || '') + ' ' + (post.department || '')).toLowerCase().split(/\s+/).filter(w => w.length > 3);

    // 1. Same department posts
    const sameDept = allPosts.filter(
      (p) => p.id !== post.id && p.slug !== post.slug && p.department === post.department
    );

    // 2. Matching title keywords
    const keywordMatches = allPosts.filter(
      (p) => p.id !== post.id && p.slug !== post.slug && !sameDept.some((s) => s.id === p.id) &&
             currentTitleWords.some(w => p.title.toLowerCase().includes(w) || p.shortTitle.toLowerCase().includes(w))
    );

    // 3. Same category posts
    const sameCat = allPosts.filter(
      (p) => p.id !== post.id && p.slug !== post.slug && p.category === post.category && 
             !sameDept.some((s) => s.id === p.id) && !keywordMatches.some((k) => k.id === p.id)
    );

    const pool = [...sameDept, ...keywordMatches, ...sameCat];

    if (pool.length < 3) {
      const remaining = allPosts.filter(
        (p) => p.id !== post.id && p.slug !== post.slug && !pool.some((item) => item.id === p.id)
      );
      return [...pool, ...remaining].slice(0, 3);
    }

    return pool.slice(0, 3);
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
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
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

  // Check if post is Railway / RRB related to show All RRB Bharti Important Section
  const isRailwayPost = useMemo(() => {
    const titleLower = (post.title || '').toLowerCase();
    const shortTitleLower = (post.shortTitle || '').toLowerCase();
    return (
      post.department === 'Railway' ||
      titleLower.includes('railway') ||
      titleLower.includes('rrb') ||
      titleLower.includes('rrc') ||
      titleLower.includes('station master') ||
      titleLower.includes('ntpc') ||
      shortTitleLower.includes('rrb') ||
      shortTitleLower.includes('railway')
    );
  }, [post.department, post.title, post.shortTitle]);

  const [rrbSearch, setRrbSearch] = useState('');
  const filteredRrbBoards = useMemo(() => {
    if (!rrbSearch.trim()) return ALL_RRB_BOARDS;
    const q = rrbSearch.toLowerCase().trim();
    return ALL_RRB_BOARDS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.hindiName.toLowerCase().includes(q) ||
        b.zone.toLowerCase().includes(q)
    );
  }, [rrbSearch]);

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

  const categoryBreakdowns = useMemo(() => {
    if (!post.vacancyBreakdown || post.vacancyBreakdown.length === 0) return [];
    return post.vacancyBreakdown.filter(
      (v) =>
        v.categoryBreakdown &&
        Object.values(v.categoryBreakdown).some(
          (val) => val !== undefined && val !== '' && val !== null && val !== '-'
        )
    );
  }, [post.vacancyBreakdown]);

  return (
    <div 
      className="w-full min-h-screen bg-[#f3f4f6] pb-20 font-post font-mangal text-[14px] sm:text-[16px] md:text-[18px]"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif"
      }}
    >
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
        </nav>

        {/* Admin Mode Active Controls Bar - Only visible when Admin is authenticated */}
        {isAdmin && (
          <div className="mb-2.5 bg-slate-900 text-white px-3 py-2 rounded border-b-2 border-red-600 flex flex-wrap items-center justify-between gap-2 shadow-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                कंट्रोल्स (Admin Mode Active)
              </span>
              <span className="text-xs text-slate-300 font-semibold hidden md:inline truncate max-w-xs">
                {post.shortTitle || post.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* 1. Direct Post Editor */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenDirectEditor) onOpenDirectEditor();
                  else if (onOpenAdmin) onOpenAdmin();
                }}
                className="bg-[#ab1616] hover:bg-red-700 text-white font-black text-xs px-2.5 py-1 rounded flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                title="डायरेक्ट पोस्ट एडिटर खोलें"
              >
                <span>⚡</span>
                <span>डायरेक्ट पोस्ट एडिटर</span>
              </button>

              {/* 2. Add New Section */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenDirectEditor) onOpenDirectEditor();
                  else if (onOpenAdmin) onOpenAdmin();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-2.5 py-1 rounded flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                title="नया सेक्शन या लिंक जोड़ें"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ नया सेक्शन जोड़ें</span>
              </button>

              {/* 3. Delete Post - Only Admin */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenDirectEditor) onOpenDirectEditor();
                  else if (onOpenAdmin) onOpenAdmin();
                }}
                className="bg-red-950 hover:bg-red-900 text-red-200 hover:text-white border border-red-700 font-bold text-xs px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                title="डिलीट करें (केवल व्यवस्थापक / Admin Only)"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>डिलीट (Only Admin)</span>
              </button>
            </div>
          </div>
        )}

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

                  {/* Row 2: Post Date / Update */}
                  <tr className="border-b border-slate-200">
                    <td className="p-3 sm:p-4 text-[#ff0000] font-bold text-[14pt] align-top border-r border-slate-200 w-28 sm:w-56 shrink-0 leading-tight">
                      Post Date / Update :
                    </td>
                    <td className="p-3 sm:p-4 text-slate-900 font-semibold text-[12pt] align-top">
                      <span>{post.postDate} | 08:40 PM</span>
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

          {/* Social Channels 2-Box Grid directly below Short Info (Telegram & WhatsApp) */}
          <div className="px-3 sm:px-5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 bg-slate-50/70 border-b border-slate-200">
            {/* Telegram */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-full bg-[#229ED9] flex items-center justify-center text-white shrink-0 shadow-2xs text-xs font-bold">
                  ✈
                </div>
                <span className="font-bold text-[11pt] sm:text-[12pt] text-slate-900">Telegram Channel</span>
              </div>
              <a
                href="https://t.me/newsarkariresultt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#229ED9] hover:bg-[#1a85ba] text-white text-[10pt] sm:text-[11pt] font-bold px-3 py-1 rounded shadow-2xs cursor-pointer transition-colors"
              >
                Join Us
              </a>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-2xs text-xs font-bold">
                  💬
                </div>
                <span className="font-bold text-[11pt] sm:text-[12pt] text-slate-900">WhatsApp Channel</span>
              </div>
              <a
                href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1fae53] text-white text-[10pt] sm:text-[11pt] font-bold px-3 py-1 rounded shadow-2xs cursor-pointer transition-colors"
              >
                Join Us
              </a>
            </div>
          </div>

          {/* Section Body Details */}
          <div className="p-4 sm:p-7 md:p-9 space-y-6 sm:space-y-8 md:space-y-9 text-slate-900 text-[10pt] font-post">
            
            {/* Center Header Details */}
            <div className="text-center py-4 border-b border-slate-200 space-y-1.5">
              <h1 className="text-[#ff00ff] font-black text-[11pt] font-sans tracking-tight" style={{ color: '#ff00ff' }}>
                {getDepartmentHeader(post.department, post.title, isInformationalPost)}
              </h1>
              <h2 className="text-[#008000] font-black text-[11pt] font-sans leading-snug" style={{ color: '#008000' }}>
                {post.shortTitle || post.title}
              </h2>
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

            {/* IF RECRUITMENT JOB POST: Render Authentic Sarkari Result Tables & Boxes */}
            {!isInformationalPost && (
              <>
                {/* Horizontal Side-by-Side 2-Column Table for Important Dates & Application Fee */}
                {!hiddenSections['sec_dates_fee'] ? (
                  <div className="border border-slate-400 bg-white text-[11.5pt] shadow-2xs overflow-hidden">
                    <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-800 font-sans">
                      <span>📍 Important Dates & Application Fee Section</span>
                      {renderSectionControls('sec_dates_fee', 'Important Dates & Fee')}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-400">
                      {/* Left Column: Important Dates */}
                      <div className="p-4 sm:p-6 space-y-3">
                        <h3 
                          className="font-black text-[15pt] sm:text-[16pt] border-b border-slate-200 pb-2.5 text-center font-sans tracking-tight"
                          style={{ color: '#008000' }}
                        >
                          Important Dates
                        </h3>
                        <ul className="space-y-2.5 text-[11.5pt] text-slate-800 pt-1 leading-relaxed">
                          {getProcessedImportantDates(post).map((d, idx) => (
                            <li key={idx} className="leading-snug">
                              <span className="text-slate-800 font-medium">• {d.label} : </span>
                              <span className={d.isHighlight ? 'text-[#ff0000] font-bold' : 'text-slate-900 font-bold'}>
                                {d.value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right Column: Application Fee */}
                      <div className="p-4 sm:p-6 space-y-3">
                        <h3 
                          className="font-black text-[15pt] sm:text-[16pt] border-b border-slate-200 pb-2.5 text-center font-sans tracking-tight"
                          style={{ color: '#008000' }}
                        >
                          Application Fee
                        </h3>
                        <ul className="space-y-2.5 text-[11.5pt] text-slate-800 pt-1 leading-relaxed">
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
                          <li className="leading-snug text-slate-700 pt-1.5 border-t border-slate-100 mt-2">
                            • Pay the Examination Fee Through Debit Card, Credit Card, Net Banking or UPI Mode Only.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : renderHiddenBanner('sec_dates_fee', 'Important Dates & Fee')}

                {/* Age Limit Box */}
                {!isServiceOrScheme && post.ageLimit.asOnDate && (
                  !hiddenSections['sec_age_limit'] ? (
                    <div className="border border-slate-400 bg-white p-4 sm:p-6 text-[11.5pt] space-y-3 shadow-2xs text-center">
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2.5">
                        <h3 className="font-black text-[14pt] sm:text-[16pt] font-sans">
                          <span style={{ color: '#008000' }}>{post.shortTitle} Notification 2026 : </span>
                          <span style={{ color: '#ff00ff' }}>Age Limit as on {post.ageLimit.asOnDate}</span>
                        </h3>
                        {renderSectionControls('sec_age_limit', 'Age Limit Box')}
                      </div>
                      <ul className="space-y-2 text-slate-800 pt-1 leading-relaxed text-[11.5pt] text-left max-w-2xl mx-auto">
                        {post.ageLimit.minAge && (
                          <li>• Minimum Age : <strong className="font-bold text-slate-900">{post.ageLimit.minAge} Years.</strong></li>
                        )}
                        {post.ageLimit.maxAge && (
                          <li>• Maximum Age : <strong className="font-bold text-slate-900">{post.ageLimit.maxAge} Years.</strong></li>
                        )}
                        {post.ageLimit.notes ? (
                          <li className="text-slate-700">• {post.ageLimit.notes}</li>
                        ) : (
                          <li className="text-slate-700">• Age Relaxation Extra as per {post.department} {post.shortTitle} Recruitment Rules.</li>
                        )}
                      </ul>
                    </div>
                  ) : renderHiddenBanner('sec_age_limit', 'Age Limit Box')
                )}


                {/* Vacancy Details Table */}
                {post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
                  <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
                    <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[15pt] font-black uppercase tracking-wide text-center" style={{ backgroundColor: '#008000' }}>
                      <span className="text-white">{post.shortTitle} Recruitment 2026 : Vacancy Details Total </span>
                      <span className="text-yellow-200">{post.totalVacancies} Post</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-black text-[12pt] sm:text-[13pt]">
                            <th className="p-3 sm:p-3.5 border-r border-slate-400 w-1/4" style={{ color: '#ff00ff' }}>Post Name</th>
                            <th className="p-3 sm:p-3.5 border-r border-slate-400 w-1/6 text-center" style={{ color: '#008000' }}>Total Post</th>
                            <th className="p-3 sm:p-3.5" style={{ color: '#008000' }}>{post.shortTitle} Eligibility Criteria</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300 text-[11.5pt]">
                          {post.vacancyBreakdown.map((v, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3 sm:p-3.5 align-top font-bold text-blue-900 border-r border-slate-400">
                                {v.postName}
                              </td>
                              <td className="p-3 sm:p-3.5 align-top text-center font-bold text-slate-900 border-r border-slate-400">
                                {v.totalPosts}
                              </td>
                              <td className="p-3 sm:p-3.5 align-top text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                                {v.eligibility}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Category Wise Vacancy Details Table (Renders ONLY if categoryBreakdown data exists) */}
                {categoryBreakdowns.length > 0 && (
                  <div className="border border-slate-400 bg-white overflow-hidden text-[10pt] shadow-2xs">
                    <div className="text-white px-4 py-2.5 text-[11pt] font-black uppercase tracking-wide text-center" style={{ backgroundColor: '#008000' }}>
                      <span className="text-white">{post.shortTitle} Category Wise Vacancy Details</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-center border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-black text-[10.5pt]">
                            <th className="p-2.5 sm:p-3 border-r border-slate-400 text-left">Post Name</th>
                            <th className="p-2.5 sm:p-3 border-r border-slate-400" style={{ color: '#ff00ff' }}>UR / GEN</th>
                            <th className="p-2.5 sm:p-3 border-r border-slate-400" style={{ color: '#008000' }}>EWS</th>
                            <th className="p-2.5 sm:p-3 border-r border-slate-400" style={{ color: '#0000ff' }}>OBC</th>
                            <th className="p-2.5 sm:p-3 border-r border-slate-400" style={{ color: '#ab1616' }}>SC</th>
                            <th className="p-2.5 sm:p-3 border-r border-slate-400" style={{ color: '#7e22ce' }}>ST</th>
                            <th className="p-2.5 sm:p-3 font-bold">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300 text-[10pt]">
                          {categoryBreakdowns.map((v, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2.5 sm:p-3 text-left font-bold text-blue-900 border-r border-slate-400">
                                {v.postName}
                              </td>
                              <td className="p-2.5 sm:p-3 font-bold border-r border-slate-400">{v.categoryBreakdown?.gen ?? '-'}</td>
                              <td className="p-2.5 sm:p-3 font-bold border-r border-slate-400">{v.categoryBreakdown?.ews ?? '-'}</td>
                              <td className="p-2.5 sm:p-3 font-bold border-r border-slate-400">{v.categoryBreakdown?.obc ?? '-'}</td>
                              <td className="p-2.5 sm:p-3 font-bold border-r border-slate-400">{v.categoryBreakdown?.sc ?? '-'}</td>
                              <td className="p-2.5 sm:p-3 font-bold border-r border-slate-400">{v.categoryBreakdown?.st ?? '-'}</td>
                              <td className="p-2.5 sm:p-3 font-black text-slate-900">{v.totalPosts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* State-Wise Vacancy Details Table (Renders ONLY IF stateBreakdown data exists) */}
                {post.stateBreakdown && post.stateBreakdown.length > 0 && (
                  !hiddenSections['sec_state_vacancy'] ? (
                    <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
                      <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[15pt] font-black uppercase tracking-wide flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: '#008000' }}>
                        <span>{post.shortTitle} State-Wise Vacancy Details</span>
                        {renderSectionControls('sec_state_vacancy', 'State-Wise Vacancy')}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-black text-[11.5pt] sm:text-[12.5pt]">
                              <th className="p-3 border-r border-slate-400" style={{ color: '#ff00ff' }}>State / UT Name</th>
                              <th className="p-3 border-r border-slate-400 text-center" style={{ color: '#008000' }}>Total Posts</th>
                              <th className="p-3 border-r border-slate-400 text-center text-blue-900">GEN</th>
                              <th className="p-3 border-r border-slate-400 text-center text-emerald-800">OBC</th>
                              <th className="p-3 border-r border-slate-400 text-center text-purple-800">EWS</th>
                              <th className="p-3 border-r border-slate-400 text-center text-red-800">SC</th>
                              <th className="p-3 border-r border-slate-400 text-center text-amber-800">ST</th>
                              <th className="p-3">Eligibility / Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300 text-[11pt]">
                            {post.stateBreakdown.map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-blue-900 border-r border-slate-400">• {s.stateName}</td>
                                <td className="p-3 text-center font-bold text-slate-900 border-r border-slate-400">{s.totalPosts}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{s.genPosts ?? '-'}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{s.obcPosts ?? '-'}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{s.ewsPosts ?? '-'}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{s.scPosts ?? '-'}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{s.stPosts ?? '-'}</td>
                                <td className="p-3 text-slate-700 font-sans">{s.eligibilityNote || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : renderHiddenBanner('sec_state_vacancy', 'State-Wise Vacancy')
                )}

                {/* Zone-Wise / Regional Vacancy Details Table (Renders ONLY IF zoneBreakdown data exists) */}
                {post.zoneBreakdown && post.zoneBreakdown.length > 0 && (
                  !hiddenSections['sec_zone_vacancy'] ? (
                    <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
                      <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[15pt] font-black uppercase tracking-wide flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: '#008000' }}>
                        <span>{post.shortTitle} Zone-Wise / Regional Vacancy Details</span>
                        {renderSectionControls('sec_zone_vacancy', 'Zone-Wise Vacancy')}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-black text-[11.5pt] sm:text-[12.5pt]">
                              <th className="p-3 border-r border-slate-400" style={{ color: '#ff00ff' }}>Zone / Board Name</th>
                              <th className="p-3 border-r border-slate-400 text-center" style={{ color: '#008000' }}>Total Posts</th>
                              <th className="p-3 border-r border-slate-400 text-center text-blue-900">GEN</th>
                              <th className="p-3 border-r border-slate-400 text-center text-emerald-800">OBC</th>
                              <th className="p-3 border-r border-slate-400 text-center text-purple-800">EWS</th>
                              <th className="p-3 border-r border-slate-400 text-center text-red-800">SC</th>
                              <th className="p-3 border-r border-slate-400 text-center text-amber-800">ST</th>
                              <th className="p-3 text-center">Action / Portal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300 text-[11pt]">
                            {post.zoneBreakdown.map((z, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-blue-900 border-r border-slate-400">
                                  <div>• {z.zoneName}</div>
                                  {z.hindiZoneName && <div className="text-[10pt] text-slate-500 font-normal">{z.hindiZoneName}</div>}
                                </td>
                                <td className="p-3 text-center font-bold text-slate-900 border-r border-slate-400">{z.totalPosts}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{z.genPosts ?? '-'}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{z.obcPosts ?? '-'}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{z.ewsPosts ?? '-'}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{z.scPosts ?? '-'}</td>
                                <td className="p-3 text-center text-slate-800 border-r border-slate-400">{z.stPosts ?? '-'}</td>
                                <td className="p-3 text-center">
                                  <a
                                    href={z.applyLink || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#1432c7] hover:bg-blue-800 text-white font-bold px-3 py-1 rounded text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                                  >
                                    <span>Apply</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : renderHiddenBanner('sec_zone_vacancy', 'Zone-Wise Vacancy')
                )}

                {/* Salary & Pay Scale Table (वेतन सारणी) */}
                {(post.salary || (post.salaryBreakdown && post.salaryBreakdown.length > 0)) && (
                  <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
                    <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[15pt] font-black uppercase tracking-wide text-center" style={{ backgroundColor: '#008000' }}>
                      {post.shortTitle} Pay Scale & Salary Details (वेतन सारणी)
                    </div>
                    <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-300">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-slate-800 text-[11.5pt]">
                        <span><strong>Pay Scale (वेतनमान): </strong>{post.salary || 'As per 7th Pay Commission (7th CPC)'}</span>
                        {post.salaryBand && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-[11pt] border border-emerald-300">
                            Band: {post.salaryBand}
                          </span>
                        )}
                      </div>
                    </div>
                    {post.salaryBreakdown && post.salaryBreakdown.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-black text-[12pt] sm:text-[13pt]">
                              <th className="p-3 border-r border-slate-400">Post Name</th>
                              <th className="p-3 border-r border-slate-400 text-center">Pay Level</th>
                              <th className="p-3 border-r border-slate-400">Basic Pay</th>
                              <th className="p-3 border-r border-slate-400">In-Hand Salary</th>
                              <th className="p-3">Allowances / Grade Pay</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300 text-[11.5pt]">
                            {post.salaryBreakdown.map((sal, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-blue-900 border-r border-slate-400">{sal.postName}</td>
                                <td className="p-3 text-center font-bold text-emerald-700 border-r border-slate-400">{sal.payLevel}</td>
                                <td className="p-3 font-bold text-slate-900 border-r border-slate-400">{sal.basicPay}</td>
                                <td className="p-3 font-bold text-purple-900 border-r border-slate-400">{sal.inHandSalary || '-'}</td>
                                <td className="p-3 text-slate-700">{sal.allowances || sal.gradePay || 'DA, HRA, TA as per Govt Norms'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Exam Scheme & Paper Pattern Table (Renders ONLY IF post.paperPattern.subjects exists) */}
                {post.paperPattern && post.paperPattern.subjects && post.paperPattern.subjects.length > 0 && (
                  !hiddenSections['sec_paper_pattern'] ? (
                    <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
                      <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[15pt] font-black uppercase tracking-wide flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: '#008000' }}>
                        <span>{post.paperPattern.examName || `${post.shortTitle} Examination Scheme & Paper Pattern`}</span>
                        {renderSectionControls('sec_paper_pattern', 'Paper Pattern')}
                      </div>
                      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11pt]">
                        {post.paperPattern.examMode && (
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 block text-[10pt]">Exam Mode</span>
                            <strong className="text-slate-900">{post.paperPattern.examMode}</strong>
                          </div>
                        )}
                        {post.paperPattern.totalDuration && (
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 block text-[10pt]">Total Duration</span>
                            <strong className="text-blue-900">{post.paperPattern.totalDuration}</strong>
                          </div>
                        )}
                        {post.paperPattern.totalQuestions && (
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 block text-[10pt]">Total Questions</span>
                            <strong className="text-slate-900">{post.paperPattern.totalQuestions} Ques</strong>
                          </div>
                        )}
                        {post.paperPattern.negativeMarking && (
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <span className="text-slate-500 block text-[10pt]">Negative Marking</span>
                            <strong className="text-red-600">{post.paperPattern.negativeMarking}</strong>
                          </div>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-black text-[12pt] sm:text-[13pt]">
                              <th className="p-3 border-r border-slate-400">Subject / Test Paper</th>
                              <th className="p-3 border-r border-slate-400 text-center">Questions</th>
                              <th className="p-3 border-r border-slate-400 text-center">Maximum Marks</th>
                              <th className="p-3">Duration / Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300 text-[11.5pt]">
                            {post.paperPattern.subjects.map((sub, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-slate-900 border-r border-slate-400">{sub.subjectName}</td>
                                <td className="p-3 text-center font-bold text-blue-900 border-r border-slate-400">{sub.totalQuestions || '-'}</td>
                                <td className="p-3 text-center font-bold text-emerald-800 border-r border-slate-400">{sub.totalMarks || '-'}</td>
                                <td className="p-3 text-slate-700">{sub.duration || sub.remarks || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : renderHiddenBanner('sec_paper_pattern', 'Paper Pattern')
                )}

                {/* Mode of Selection (Renders ONLY IF post.selectionProcess data exists) */}
                {post.selectionProcess && post.selectionProcess.length > 0 && (
                  !hiddenSections['sec_selection_process'] ? (
                    <div className="border border-slate-400 bg-white p-4 sm:p-6 text-[11.5pt] space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2.5">
                        <h4 
                          className="font-black text-[14pt] sm:text-[16pt] font-sans"
                          style={{ color: '#008000' }}
                        >
                          {post.shortTitle} Selection Process / Mode of Selection
                        </h4>
                        {renderSectionControls('sec_selection_process', 'Selection Process')}
                      </div>
                      <div className="pt-1">
                        <p className="text-slate-800 mb-3 leading-relaxed font-sans text-[11.5pt]">
                          The recruitment board will select eligible candidates through the following sequential stages:
                        </p>
                        <ol className="space-y-2.5 text-slate-900 font-medium text-[11.5pt]">
                          {post.selectionProcess.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded border border-slate-200">
                              <span className="font-bold text-white text-[11pt] px-2.5 py-0.5 rounded shrink-0 mt-0.5" style={{ backgroundColor: '#008000' }}>Stage {idx + 1}</span>
                              <span className="leading-relaxed text-slate-800">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ) : renderHiddenBanner('sec_selection_process', 'Selection Process')
                )}

                {/* How to Fill Form Section */}
                {post.howToApplySteps && post.howToApplySteps.length > 0 && (
                  <div className="border border-slate-400 bg-white p-4 sm:p-6 text-[11.5pt] space-y-3 shadow-2xs">
                    <h4 className="font-black text-[14pt] sm:text-[16pt] border-b border-slate-200 pb-2.5 font-sans">
                      <span style={{ color: '#008000' }}>How to Fill </span>
                      <span style={{ color: '#ff00ff' }}>{post.shortTitle} Recruitment Online Form 2026</span>
                    </h4>
                    <ul className="space-y-2.5 text-slate-800 pt-1 leading-relaxed text-[11.5pt]">
                      {post.howToApplySteps.map((step, idx) => (
                        <li key={idx}>• {step}</li>
                      ))}
                      <li className="font-bold pt-2 border-t border-slate-200 mt-2.5 text-center text-[12pt] sm:text-[13pt]" style={{ color: '#ff00ff' }}>
                        Interested Candidates Can Read the Full Notification Before Apply Online
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* Useful Important Links Table (Includes WhatsApp, Telegram, Instagram & X) */}
            <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
              <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[16pt] font-black uppercase tracking-wide text-center" style={{ backgroundColor: '#008000' }}>
                Some Useful Important Links
              </div>
              <div className="divide-y divide-slate-300 text-[11.5pt]">
                {/* Apply Online Link */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 gap-4">
                  <span className="font-bold text-[12pt] sm:text-[13pt]" style={{ color: '#ff00ff' }}>
                    • Apply Online
                  </span>
                  <a
                    href={post.directLinks.find(l => l.label.toLowerCase().includes('apply'))?.url || 'https://main.sci.gov.in/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-white font-bold rounded-xs text-[11.5pt] shadow-2xs cursor-pointer shrink-0 transition-colors bg-[#0000ff] hover:bg-blue-800"
                  >
                    <span>Click Here</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Download Notification Link */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 gap-4">
                  <span className="font-bold text-[12pt] sm:text-[13pt]" style={{ color: '#ff00ff' }}>
                    • Download Notification
                  </span>
                  <a
                    href={post.directLinks.find(l => l.label.toLowerCase().includes('notification'))?.url || 'https://main.sci.gov.in/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-white font-bold rounded-xs text-[11.5pt] shadow-2xs cursor-pointer shrink-0 transition-colors bg-[#0000ff] hover:bg-blue-800"
                  >
                    <span>Click Here</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Join Official WhatsApp Channel Link */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 gap-4">
                  <span className="font-bold text-[11pt] sm:text-[12pt]" style={{ color: '#ff00ff' }}>
                    • Join Official WhatsApp Channel
                  </span>
                  <a
                    href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-white font-bold rounded-xs text-[10pt] sm:text-[11pt] shadow-2xs cursor-pointer shrink-0 transition-colors bg-[#25D366] hover:bg-emerald-600"
                  >
                    <span>Click Here</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Join Official Telegram Channel Link */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 gap-4">
                  <span className="font-bold text-[11pt] sm:text-[12pt]" style={{ color: '#ff00ff' }}>
                    • Join Official Telegram Channel
                  </span>
                  <a
                    href="https://t.me/newsarkariresultt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-white font-bold rounded-xs text-[10pt] sm:text-[11pt] shadow-2xs cursor-pointer shrink-0 transition-colors bg-[#229ED9] hover:bg-sky-600"
                  >
                    <span>Click Here</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Official Website Link */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 gap-4">
                  <span className="font-bold text-[12pt] sm:text-[13pt]" style={{ color: '#ff00ff' }}>
                    • SCI Official Website
                  </span>
                  <a
                    href="https://main.sci.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-white font-bold rounded-xs text-[11.5pt] shadow-2xs cursor-pointer shrink-0 transition-colors bg-[#0000ff] hover:bg-blue-800"
                  >
                    <span>Click Here</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Any additional direct links */}
                {allDirectLinks.filter(l => 
                  !l.label.toLowerCase().includes('apply') && 
                  !l.label.toLowerCase().includes('notification') && 
                  !l.label.toLowerCase().includes('whatsapp') && 
                  !l.label.toLowerCase().includes('telegram') && 
                  !l.label.toLowerCase().includes('official website')
                ).map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 gap-4">
                    <span className="font-bold text-[12pt] sm:text-[13pt]" style={{ color: '#ff00ff' }}>
                      • {link.label}
                    </span>
                    <a
                      href={link.url || 'https://main.sci.gov.in/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-white font-bold rounded-xs text-[11.5pt] shadow-2xs cursor-pointer shrink-0 transition-colors bg-[#0000ff] hover:bg-blue-800"
                    >
                      <span>{link.actionText || 'Click Here'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>




            {/* Frequently Asked Questions (FAQ) Section - Placed JUST BELOW Important Links */}
            {faqs.length > 0 && (
              !hiddenSections['sec_faqs'] ? (
                <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
                  <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[16pt] font-black uppercase tracking-wide flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: '#008000' }}>
                    <span>Frequently Asked Questions (FAQ) – {post.shortTitle}</span>
                    {renderSectionControls('sec_faqs', 'FAQs')}
                  </div>
                  <div className="p-4 sm:p-7 divide-y divide-slate-200 space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="pt-4 first:pt-0 space-y-1.5">
                        <h5 
                          className="font-bold text-[13pt] sm:text-[14pt] leading-snug flex items-start gap-1.5 font-sans"
                          style={{ color: idx % 2 === 0 ? '#ff00ff' : '#008000' }}
                        >
                          <span>Q.{idx + 1} : </span>
                          <span>{faq.question}</span>
                        </h5>
                        <div className="text-slate-800 text-[11.5pt] pl-4 sm:pl-6 leading-relaxed font-sans">
                          <span className="text-slate-900 font-bold text-[11.5pt] mr-1">Ans.</span> 
                          <span>{faq.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : renderHiddenBanner('sec_faqs', 'FAQs')
            )}

            {/* 1. Latest Jobs Section (Vertical Stack) */}
            <div className="border border-slate-300 bg-white rounded-xs overflow-hidden shadow-2xs font-sans">
              <div className="bg-[#1e3a8a] text-white px-4 sm:px-5 py-3 text-[14px] sm:text-[16px] font-black uppercase tracking-wide flex items-center justify-between">
                <span>🔥 LATEST JOBS & NOTIFICATIONS</span>
                <span className="text-xs bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded uppercase">Latest Updates</span>
              </div>
              <div className="divide-y divide-slate-200">
                {contextualLatestJobs.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onSelectPost && onSelectPost(item)}
                    className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1 flex-1">
                      <a
                        href={`#post/${item.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onSelectPost) onSelectPost(item);
                        }}
                        className="text-[#0000cc] group-hover:text-red-700 font-bold text-[14px] sm:text-[16px] leading-snug hover:underline block"
                      >
                        • {item.title}
                      </a>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                        <span>{item.department || 'Government Job'}</span>
                        {item.lastDate && (
                          <span>• Last Date: <strong className="text-slate-800">{item.lastDate}</strong></span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPost) onSelectPost(item);
                      }}
                      className="bg-[#1432c7] hover:bg-blue-800 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Recent Posts Section (Vertical Stack) */}
            <div className="border border-slate-300 bg-white rounded-xs overflow-hidden shadow-2xs font-sans">
              <div className="bg-[#ab1616] text-white px-4 sm:px-5 py-3 text-[14px] sm:text-[16px] font-black uppercase tracking-wide flex items-center justify-between">
                <span>RELATED & RECENT POSTS</span>
                <span className="text-xs bg-white/20 text-white font-bold px-2 py-0.5 rounded capitalize font-sans">
                  {getCategoryLabel(post.category)}
                </span>
              </div>
              <div className="divide-y divide-slate-200">
                {relatedPosts.slice(0, 3).map((related) => (
                  <div 
                    key={related.id}
                    onClick={() => onSelectPost && onSelectPost(related)}
                    className="p-3.5 sm:p-4 hover:bg-amber-50/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1 flex-1">
                      <a
                        href={`#post/${related.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onSelectPost) onSelectPost(related);
                        }}
                        className="text-[#0000cc] group-hover:text-red-700 font-bold text-[14px] sm:text-[16px] leading-snug hover:underline block"
                      >
                        • {related.title}
                      </a>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                        <span>{related.department || 'Other'}</span>
                        {related.lastDate && (
                          <span>• Last Date: <strong className="text-slate-800">{related.lastDate}</strong></span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPost) onSelectPost(related);
                      }}
                      className="bg-[#1432c7] hover:bg-blue-800 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
