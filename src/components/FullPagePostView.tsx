import React, { useEffect, useMemo, useState } from 'react';
import { SarkariPost, DirectLinkItem, StateVacancyItem, ZoneVacancyItem, SalaryBreakdownItem, ExamSubjectItem } from '../types/job';
import { getProcessedImportantDates, toIso8601Date, formatDisplayDate } from '../utils/dateUtils';
import { sanitizeUrl, deduplicateLinks, getCleanShareUrl } from '../utils/urlUtils';

export const getProcessedDirectLinks = (post: SarkariPost): DirectLinkItem[] => {
  const pAny = post as any;
  let existing: DirectLinkItem[] = post.directLinks && post.directLinks.length > 0 
    ? post.directLinks.map(l => ({ ...l, url: sanitizeUrl(l.url) })) 
    : [];

  if (existing.length === 0) {
    if (post.category === 'result') {
      existing.push({ label: 'Download Result / Score Card', actionText: 'Click Here', type: 'result', url: sanitizeUrl(pAny.resultUrl || 'https://sarkariresult12.vercel.app/#') });
    } else if (post.category === 'admit_card') {
      existing.push({ label: 'Download Admit Card / Hall Ticket', actionText: 'Click Here', type: 'admit_card', url: sanitizeUrl(pAny.admitCardUrl || 'https://sarkariresult12.vercel.app/#') });
    } else if (post.category === 'answer_key') {
      existing.push({ label: 'Download Answer Key & Solution Paper', actionText: 'Click Here', type: 'answer_key', url: sanitizeUrl(pAny.answerKeyUrl || 'https://sarkariresult12.vercel.app/#') });
    } else {
      existing.push({ label: 'Apply Online', actionText: 'Click Here', type: 'apply', url: sanitizeUrl(pAny.applyUrl || 'https://sarkariresult12.vercel.app/#'), isPrimary: true });
    }
    existing.push({ label: 'Download Detailed Notification (PDF)', actionText: 'Click Here', type: 'notification', url: sanitizeUrl(pAny.notificationUrl || 'https://sarkariresult12.vercel.app/#'), isPdf: true });
    existing.push({ label: `${post.department || 'Official'} Website`, actionText: 'Click Here', type: 'official', url: sanitizeUrl(pAny.officialWebsite || 'https://sarkariresult12.vercel.app/#') });
  }

  // Normalize notification links to Download Detailed Notification (PDF) and Click Here
  existing = existing.map(l => {
    const cleanUrl = sanitizeUrl(l.url);
    if (l.type === 'notification' || (l.label && l.label.toLowerCase().includes('notification'))) {
      const isDetailed = l.label.toLowerCase().includes('detailed');
      const hasPdf = l.label.includes('(PDF)') || l.label.includes('PDF');
      let finalLabel = l.label;
      if (!isDetailed && !hasPdf) {
        finalLabel = 'Download Detailed Notification (PDF)';
      } else if (!hasPdf) {
        finalLabel = `${l.label} (PDF)`;
      } else if (!isDetailed) {
        finalLabel = l.label.replace(/notification/i, 'Detailed Notification');
      }
      return {
        ...l,
        label: finalLabel,
        actionText: 'Click Here',
        isPdf: true,
        type: 'notification',
        url: cleanUrl
      };
    }
    return { ...l, url: cleanUrl };
  });

  // Deduplicate direct links by label and URL to solve double link issue
  return deduplicateLinks(existing);
};
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
  BookOpen,
  FileText,
  Download,
  Upload,
  Share2,
  Copy,
  X,
  Edit3,
  Check,
  Hash
} from 'lucide-react';
import { isPostAlertActive, togglePostAlert, getPostStatus } from '../utils/alertManager';
import { PostAlertModal } from './PostAlertModal';
import { ALL_RRB_BOARDS } from '../data/rrbBoards';
import { getPostViralTags, formatViralTagsString } from '../utils/viralTagsHelper';
import { CANONICAL_DOMAIN } from '../utils/seoHelpers';
import { AdBanner } from './common/AdBanner';

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
  onUpdatePost?: (updatedPost: SarkariPost) => void;
  onDeletePost?: (postId: string) => void;
  isGlobalWordEditActive?: boolean;
  onToggleGlobalWordEdit?: () => void;
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
  const postName = post.shortTitle || post.title;
  const qual = post.qualifications && post.qualifications.length > 0 ? post.qualifications.join(', ') : 'अधिसूचना अनुसार';
  
  let age = 'नियमानुसार';
  if (post.ageLimit?.minAge && post.ageLimit?.maxAge) {
    age = `${post.ageLimit.minAge} से ${post.ageLimit.maxAge} वर्ष`;
  } else if (post.ageLimit?.minAge) {
    age = `न्यूनतम ${post.ageLimit.minAge} वर्ष`;
  } else if (post.ageLimit?.maxAge) {
    age = `अधिकतम ${post.ageLimit.maxAge} वर्ष`;
  }

  // Extract start date from importantDates
  const startDateItem = post.importantDates?.find(d => 
    d.label.toLowerCase().includes('begin') || 
    d.label.toLowerCase().includes('start') || 
    d.label.toLowerCase().includes('opening') ||
    d.label.toLowerCase().includes('released')
  );
  const startDate = startDateItem ? startDateItem.value : (post.postDate ? post.postDate.split('|')[0].trim() : 'जारी है');
  const lastDate = post.lastDate || 'अधिसूचना देखें';

  const cleanUrl = sanitizeUrl(postUrl);

  return `🥳🥳 सरकारी नौकरी बड़ा अपडेट 🥳🥳\n🎯🎯 भर्ती का नाम: ${postName}\nकुल पद: ${post.totalVacancies || 'अधिसूचना अनुसार'}\nयोग्यता: ${qual}\nआयु सीमा: ${age}\n👉आवेदन की प्रारंभ तिथि: ${startDate}\n👉आवेदन की अंतिम तिथि: ${lastDate}\n🔥🔥 संपूर्ण विवरण पढ़ें व ऑनलाइन फॉर्म भरें:\n${cleanUrl}`;
};

// Helper to bold application date ranges and keywords in shortInfo
const renderFormattedShortInfo = (text: string) => {
  const datePattern =
    '(\\d{1,2}[/-]\\d{1,2}[/-]\\d{4}\\s+to\\s+\\d{1,2}[/-]\\d{1,2}[/-]\\d{4}|\\d{1,2}\\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{4}\\s+to\\s+\\d{1,2}\\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{4})';
  const splitRegex = new RegExp(datePattern, 'gi');
  const matchRegex = new RegExp(`^${datePattern}$`, 'i');
  const parts = text.split(splitRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (matchRegex.test(part)) {
          return <strong key={i} className="font-bold text-black">{part}</strong>;
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
  onOpenDirectEditor,
  onUpdatePost,
  onDeletePost,
  onOpenPhotoResizer,
  isGlobalWordEditActive = false,
  onToggleGlobalWordEdit
}) => {
  const isAdmin = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('sarkari_admin_auth') === 'true';
  }, []);

  // Direct In-Place Word & Section Edit Mode State
  const [editablePost, setEditablePost] = useState<SarkariPost>(() => {
    const processedDates = getProcessedImportantDates(post);
    const processedLinks = getProcessedDirectLinks(post);
    return {
      ...post,
      importantDates: post.importantDates && post.importantDates.length > 0 ? post.importantDates : processedDates,
      directLinks: processedLinks,
      customFaqs: post.customFaqs && post.customFaqs.length > 0 ? post.customFaqs : getPostFAQs(post)
    };
  });
  const [isDirectEditMode, setIsDirectEditMode] = useState<boolean>(() => isAdmin && isGlobalWordEditActive);

  // Sync edit mode when global edit mode changes
  useEffect(() => {
    if (isGlobalWordEditActive !== undefined) {
      setIsDirectEditMode(isAdmin && isGlobalWordEditActive);
    }
  }, [isGlobalWordEditActive, isAdmin]);

  const currentPostIdRef = React.useRef(post.id);
  const lastSavedJsonRef = React.useRef<string>('');
  const onUpdatePostRef = React.useRef(onUpdatePost);

  useEffect(() => {
    onUpdatePostRef.current = onUpdatePost;
  }, [onUpdatePost]);

  // Synchronize initial state when user switches to a different post
  useEffect(() => {
    if (post.id !== currentPostIdRef.current) {
      currentPostIdRef.current = post.id;
      const processedDates = getProcessedImportantDates(post);
      const processedLinks = getProcessedDirectLinks(post);
      const initial: SarkariPost = {
        ...post,
        importantDates: post.importantDates && post.importantDates.length > 0 ? post.importantDates : processedDates,
        directLinks: processedLinks,
        customFaqs: post.customFaqs && post.customFaqs.length > 0 ? post.customFaqs : getPostFAQs(post)
      };
      lastSavedJsonRef.current = JSON.stringify(initial);
      setEditablePost(initial);
    }
  }, [post.id]);

  const faqs = useMemo(() => {
    const list = editablePost.customFaqs && editablePost.customFaqs.length > 0 
      ? editablePost.customFaqs 
      : getPostFAQs(editablePost);
    return list.slice(0, 4);
  }, [editablePost]);

  const [isAlertActive, setIsAlertActive] = React.useState<boolean>(() => isPostAlertActive(post.id));
  const [isAlertModalOpen, setIsAlertModalOpen] = React.useState<boolean>(false);
  const [alertFeedback, setAlertFeedback] = React.useState<string | null>(null);
  const [hiddenSections, setHiddenSections] = React.useState<Record<string, boolean>>({});
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfUploadTargetIndex, setPdfUploadTargetIndex] = useState<number | null>(null);
  const pdfFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Viral Tags computed for this post
  const viralTags = useMemo(() => {
    return getPostViralTags(editablePost);
  }, [editablePost]);

  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState<boolean>(false);
  const [newTagInput, setNewTagInput] = useState<string>('');

  const handleCopyTag = (tag: string) => {
    try {
      navigator.clipboard.writeText(tag);
      setCopiedTag(tag);
      setTimeout(() => setCopiedTag(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyAllTags = () => {
    try {
      const allText = formatViralTagsString(viralTags);
      navigator.clipboard.writeText(allText);
      setIsCopiedAll(true);
      setTimeout(() => setIsCopiedAll(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleShareWhatsApp = () => {
    const baseUrl = typeof window !== 'undefined' && !window.location.host.includes('run.app') && !window.location.host.includes('localhost')
      ? window.location.origin 
      : 'https://sarkariresult12.vercel.app';
    const cleanSlug = editablePost.slug || `post-${editablePost.id}`;
    const postUrl = `${baseUrl}/post/${cleanSlug}`;
    const tagsStr = formatViralTagsString(viralTags);
    const msg = `🔥 *${editablePost.shortTitle || editablePost.title}*\n\n🏛️ विभाग: ${editablePost.department || 'सरकारी विभाग'}\n📅 अंतिम तिथि: ${editablePost.lastDate || 'विस्तृत सूचना देखें'}\n\n👉 *ऑनलाइन आवेदन व आधिकारिक लिंक:* \n${postUrl}\n\n${tagsStr}\n\n📲 सबसे तेज सरकारी रिजल्ट व जॉब्स अपडेट: https://t.me/newsarkariresultt`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddCustomTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
    const currentTags = editablePost.viralTags && editablePost.viralTags.length > 0 ? editablePost.viralTags : viralTags;
    if (!currentTags.includes(cleanTag)) {
      setEditablePost(prev => ({
        ...prev,
        viralTags: [...currentTags, cleanTag]
      }));
    }
    setNewTagInput('');
  };

  const handleResetViralTags = () => {
    setEditablePost(prev => {
      const next = { ...prev };
      delete next.viralTags;
      return next;
    });
  };

  // Real-time automatic persistence: only persists when editablePost actually changes
  useEffect(() => {
    const currentJson = JSON.stringify(editablePost);
    if (!lastSavedJsonRef.current) {
      lastSavedJsonRef.current = currentJson;
      return;
    }
    if (currentJson === lastSavedJsonRef.current) return;
    lastSavedJsonRef.current = currentJson;

    // पैरेंट कंपोनेंट व Firestore में अपडेट
    if (onUpdatePostRef.current) {
      onUpdatePostRef.current(editablePost);
    }
    // LocalStorage में तुरंत सुरक्षित व कस्टम इवेंट डिस्पाच
    try {
      const saved = localStorage.getItem('sarkari_admin_posts_v5');
      let currentArr: SarkariPost[] = saved ? JSON.parse(saved) : [];
      const idx = currentArr.findIndex(p => p.id === editablePost.id);
      if (idx >= 0) {
        currentArr[idx] = editablePost;
      } else {
        currentArr.push(editablePost);
      }
      localStorage.setItem('sarkari_admin_posts_v5', JSON.stringify(currentArr));
      window.dispatchEvent(new CustomEvent('sarkari_posts_updated', { detail: currentArr }));
    } catch (e) {
      console.error(e);
    }
  }, [editablePost]);

  // Reusable Word-by-Word In-Place Editable Component
  const EditableText: React.FC<{
    value?: string | number;
    onChange: (val: string) => void;
    className?: string;
    style?: React.CSSProperties;
    as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'div' | 'p' | 'td';
    placeholder?: string;
    titlePrefix?: string;
  }> = ({
    value = '',
    onChange,
    className = '',
    style,
    as: Tag = 'span',
    placeholder = '...',
    titlePrefix = 'टेक्स्ट'
  }) => {
    const strVal = String(value ?? '');
    
    // यदि वर्ड एडिट मोड बंद है तो साधारण टेक्स्ट दिखाएं
    if (!isDirectEditMode) {
      return (
        <Tag className={className} style={style}>
          {strVal || placeholder}
        </Tag>
      );
    }

    // वर्ड एडिट मोड चालू होने पर सीधे क्लिक करके टाइप करें
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        style={style}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && Tag !== 'p' && Tag !== 'div') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        onBlur={(e) => {
          const updated = e.currentTarget.innerText.trim();
          if (updated !== strVal) {
            onChange(updated);
          }
        }}
        className={`${className} outline-none cursor-text transition-all hover:bg-amber-100/90 focus:bg-amber-50 focus:ring-2 focus:ring-amber-500 rounded px-1 -mx-0.5 border-b border-dashed border-amber-500 min-w-[20px] inline-block`}
        title={`क्लिक करके ${titlePrefix} बदलें (Click to edit text)`}
      >
        {strVal || placeholder}
      </Tag>
    );
  };

  // Helper row actions for editing directly inside sections
  const handleAddDateItem = () => {
    setEditablePost(prev => ({
      ...prev,
      importantDates: [...(prev.importantDates || []), { label: 'New Date Label', value: 'DD/MM/2026' }]
    }));
  };

  const handleDeleteDateItem = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      importantDates: prev.importantDates.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeeItem = () => {
    setEditablePost(prev => ({
      ...prev,
      applicationFee: [...(prev.applicationFee || []), { category: 'General / OBC / EWS', amount: '₹ 100/-' }]
    }));
  };

  const handleDeleteFeeItem = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      applicationFee: prev.applicationFee.filter((_, i) => i !== index)
    }));
  };

  const handleAddVacancyRow = () => {
    setEditablePost(prev => ({
      ...prev,
      vacancyBreakdown: [
        ...(prev.vacancyBreakdown || []),
        {
          postName: 'New Recruitment Post Name',
          totalPosts: '100',
          eligibility: 'Bachelor Degree in Any Stream from Recognized University in India.'
        }
      ]
    }));
  };

  const handleDeleteVacancyRow = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      vacancyBreakdown: prev.vacancyBreakdown.filter((_, i) => i !== index)
    }));
  };

  const defaultRrbZones: ZoneVacancyItem[] = useMemo(
    () =>
      ALL_RRB_BOARDS.map((b) => ({
        zoneName: `${b.name} — ${b.zone}`,
        hindiZoneName: b.hindiName,
        totalPosts: 'As per Notice',
        genPosts: '-',
        obcPosts: '-',
        ewsPosts: '-',
        scPosts: '-',
        stPosts: '-',
        applyLink: b.applyUrl || b.website,
      })),
    []
  );

  const updateStateRow = (index: number, patch: Partial<StateVacancyItem>) => {
    setEditablePost(prev => {
      const base = [...(prev.stateBreakdown || [])];
      if (!base[index]) return prev;
      base[index] = { ...base[index], ...patch };
      return { ...prev, stateBreakdown: base };
    });
  };

  const handleAddStateRow = () => {
    setEditablePost(prev => ({
      ...prev,
      stateBreakdown: [
        ...(prev.stateBreakdown || []),
        {
          stateName: 'Uttar Pradesh',
          totalPosts: '-',
          genPosts: '-',
          obcPosts: '-',
          ewsPosts: '-',
          scPosts: '-',
          stPosts: '-',
          eligibilityNote: 'All India',
        },
      ],
    }));
  };

  const handleDeleteStateRow = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      stateBreakdown: (prev.stateBreakdown || []).filter((_, i) => i !== index),
    }));
  };

  const updateZoneRow = (index: number, patch: Partial<ZoneVacancyItem>) => {
    setEditablePost(prev => {
      const base =
        prev.zoneBreakdown && prev.zoneBreakdown.length > 0
          ? [...prev.zoneBreakdown]
          : defaultRrbZones.map(item => ({ ...item }));
      base[index] = { ...base[index], ...patch };
      return { ...prev, zoneBreakdown: base };
    });
  };

  const handleAddZoneRow = () => {
    setEditablePost(prev => {
      const base =
        prev.zoneBreakdown && prev.zoneBreakdown.length > 0
          ? [...prev.zoneBreakdown]
          : defaultRrbZones.map(item => ({ ...item }));
      return {
        ...prev,
        zoneBreakdown: [
          ...base,
          {
            zoneName: 'RRB New Board / Zone',
            totalPosts: '-',
            genPosts: '-',
            obcPosts: '-',
            ewsPosts: '-',
            scPosts: '-',
            stPosts: '-',
            applyLink: 'https://www.rrbapply.gov.in/',
          },
        ],
      };
    });
  };

  const handleDeleteZoneRow = (index: number) => {
    setEditablePost(prev => {
      const base =
        prev.zoneBreakdown && prev.zoneBreakdown.length > 0
          ? [...prev.zoneBreakdown]
          : defaultRrbZones.map(item => ({ ...item }));
      return {
        ...prev,
        zoneBreakdown: base.filter((_, i) => i !== index),
      };
    });
  };

  const handleAddSelectionStage = () => {
    setEditablePost(prev => ({
      ...prev,
      selectionProcess: [...(prev.selectionProcess || []), 'Computer Based Examination / Interview Stage']
    }));
  };

  const handleDeleteSelectionStage = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      selectionProcess: (prev.selectionProcess || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddApplyStep = () => {
    setEditablePost(prev => ({
      ...prev,
      howToApplySteps: [...(prev.howToApplySteps || []), 'Candidate must read notification thoroughly before applying.']
    }));
  };

  const handleDeleteApplyStep = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      howToApplySteps: prev.howToApplySteps.filter((_, i) => i !== index)
    }));
  };

  const defaultSalaryRows: SalaryBreakdownItem[] = useMemo(() => {
    const vacs = editablePost.vacancyBreakdown || [];
    if (vacs.length > 0) {
      return vacs.map((v) => ({
        postName: v.postName,
        payLevel: 'As per 7th CPC',
        basicPay: editablePost.salary || 'As per Official Notification',
        inHandSalary: 'As per Govt Rules',
        allowances: 'DA, HRA, TA & Medical as per Govt Norms',
      }));
    }
    return [
      {
        postName: editablePost.shortTitle || editablePost.title,
        payLevel: 'As per 7th CPC',
        basicPay: editablePost.salary || 'As per Official Notification',
        inHandSalary: 'As per Govt Rules',
        allowances: 'DA, HRA, TA & Medical as per Govt Norms',
      },
    ];
  }, [editablePost.vacancyBreakdown, editablePost.shortTitle, editablePost.title, editablePost.salary]);

  const displayedSalaryRows = useMemo(() => {
    return editablePost.salaryBreakdown && editablePost.salaryBreakdown.length > 0
      ? editablePost.salaryBreakdown
      : defaultSalaryRows;
  }, [editablePost.salaryBreakdown, defaultSalaryRows]);

  const updateSalaryRow = (index: number, patch: Partial<SalaryBreakdownItem>) => {
    setEditablePost(prev => {
      const base =
        prev.salaryBreakdown && prev.salaryBreakdown.length > 0
          ? [...prev.salaryBreakdown]
          : defaultSalaryRows.map(item => ({ ...item }));
      if (!base[index]) return prev;
      base[index] = { ...base[index], ...patch };
      return { ...prev, salaryBreakdown: base };
    });
  };

  const handleAddSalaryRow = () => {
    setEditablePost(prev => {
      const base =
        prev.salaryBreakdown && prev.salaryBreakdown.length > 0
          ? [...prev.salaryBreakdown]
          : defaultSalaryRows.map(item => ({ ...item }));
      return {
        ...prev,
        salaryBreakdown: [
          ...base,
          {
            postName: 'New Post Name',
            payLevel: 'Pay Level 6',
            basicPay: 'As per Notification',
            inHandSalary: '-',
            allowances: 'DA, HRA, TA as per Govt Norms',
          },
        ],
      };
    });
  };

  const handleDeleteSalaryRow = (index: number) => {
    setEditablePost(prev => {
      const base =
        prev.salaryBreakdown && prev.salaryBreakdown.length > 0
          ? [...prev.salaryBreakdown]
          : defaultSalaryRows.map(item => ({ ...item }));
      return {
        ...prev,
        salaryBreakdown: base.filter((_, i) => i !== index),
      };
    });
  };

  const defaultPaperSubjects: ExamSubjectItem[] = useMemo(
    () => [
      { subjectName: 'General Intelligence & Reasoning', totalQuestions: 'As per Syllabus', totalMarks: 'As per Syllabus', duration: 'Composite Duration' },
      { subjectName: 'General Awareness / General Knowledge', totalQuestions: 'As per Syllabus', totalMarks: 'As per Syllabus', duration: 'Composite Duration' },
      { subjectName: 'Quantitative Aptitude / Mathematics', totalQuestions: 'As per Syllabus', totalMarks: 'As per Syllabus', duration: 'Composite Duration' },
      { subjectName: 'General English / Hindi / Concerned Subject', totalQuestions: 'As per Syllabus', totalMarks: 'As per Syllabus', duration: 'Composite Duration' },
    ],
    []
  );

  const displayedPaperSubjects = useMemo(() => {
    return editablePost.paperPattern?.subjects && editablePost.paperPattern.subjects.length > 0
      ? editablePost.paperPattern.subjects
      : defaultPaperSubjects;
  }, [editablePost.paperPattern?.subjects, defaultPaperSubjects]);

  const updatePaperSubjectRow = (index: number, patch: Partial<ExamSubjectItem>) => {
    setEditablePost(prev => {
      const existingPattern = prev.paperPattern || {};
      const baseSubjects =
        existingPattern.subjects && existingPattern.subjects.length > 0
          ? [...existingPattern.subjects]
          : defaultPaperSubjects.map(item => ({ ...item }));
      if (!baseSubjects[index]) return prev;
      baseSubjects[index] = { ...baseSubjects[index], ...patch };
      return {
        ...prev,
        paperPattern: {
          ...existingPattern,
          subjects: baseSubjects,
        },
      };
    });
  };

  const handleAddPaperSubjectRow = () => {
    setEditablePost(prev => {
      const existingPattern = prev.paperPattern || {};
      const baseSubjects =
        existingPattern.subjects && existingPattern.subjects.length > 0
          ? [...existingPattern.subjects]
          : defaultPaperSubjects.map(item => ({ ...item }));
      return {
        ...prev,
        paperPattern: {
          ...existingPattern,
          subjects: [
            ...baseSubjects,
            {
              subjectName: 'New Subject / Paper',
              totalQuestions: '-',
              totalMarks: '-',
              duration: '-',
            },
          ],
        },
      };
    });
  };

  const handleDeletePaperSubjectRow = (index: number) => {
    setEditablePost(prev => {
      const existingPattern = prev.paperPattern || {};
      const baseSubjects =
        existingPattern.subjects && existingPattern.subjects.length > 0
          ? [...existingPattern.subjects]
          : defaultPaperSubjects.map(item => ({ ...item }));
      return {
        ...prev,
        paperPattern: {
          ...existingPattern,
          subjects: baseSubjects.filter((_, i) => i !== index),
        },
      };
    });
  };

  const handleAddDirectLink = () => {
    setEditablePost(prev => ({
      ...prev,
      directLinks: [
        ...(prev.directLinks || []),
        {
          label: 'Direct Download Official Link',
          actionText: 'Click Here',
          type: 'official',
          url: 'https://sarkariresult12.vercel.app/#'
        }
      ]
    }));
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('कृपया केवल PDF (.pdf) फ़ाइल चुनें (Please select only PDF files).');
      return;
    }

    const fileSizeKb = Math.round(file.size / 1024);
    const fileSizeStr = fileSizeKb > 1024 ? `${(fileSizeKb / 1024).toFixed(2)} MB` : `${fileSizeKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const cleanFileName = file.name.replace(/\.pdf$/i, '');

      setEditablePost(prev => {
        const list = [...(prev.directLinks || [])];
        if (pdfUploadTargetIndex !== null && pdfUploadTargetIndex >= 0 && pdfUploadTargetIndex < list.length) {
          list[pdfUploadTargetIndex] = {
            ...list[pdfUploadTargetIndex],
            url: dataUrl,
            fileName: file.name,
            fileSize: fileSizeStr,
            isPdf: true,
            actionText: list[pdfUploadTargetIndex].actionText || 'Download PDF'
          };
        } else {
          list.push({
            label: `Download ${cleanFileName} (PDF)`,
            actionText: 'Download PDF',
            type: 'notification',
            url: dataUrl,
            fileName: file.name,
            fileSize: fileSizeStr,
            isPdf: true,
            isPrimary: true
          });
        }
        return { ...prev, directLinks: list };
      });

      setAlertFeedback(`✅ PDF फ़ाइल "${file.name}" (${fileSizeStr}) सफलतापूर्वक जोड़ी गई!`);
      setTimeout(() => setAlertFeedback(null), 3500);
      setIsPdfModalOpen(false);
      setPdfUploadTargetIndex(null);
      if (pdfFileInputRef.current) pdfFileInputRef.current.value = '';
    };

    reader.readAsDataURL(file);
  };

  const handleAddPresetPdfLink = (label: string, defaultActionText: string = 'Click Here', type: any = 'notification') => {
    const customUrl = prompt(`"${label}" के लिए PDF URL या Google Drive लिंक दर्ज करें (Enter PDF Link / Drive Link):`, 'https://');
    if (customUrl === null) return;
    
    setEditablePost(prev => ({
      ...prev,
      directLinks: [
        ...(prev.directLinks || []),
        {
          label: label,
          actionText: defaultActionText,
          type: type,
          url: customUrl.trim() || 'https://sarkariresult12.vercel.app/#',
          isPdf: true,
          isPrimary: true
        }
      ]
    }));
    setAlertFeedback(`✅ PDF लिंक "${label}" जोड़ा गया!`);
    setTimeout(() => setAlertFeedback(null), 3000);
    setIsPdfModalOpen(false);
  };

  const handleAttachPdfToLink = (index: number) => {
    setPdfUploadTargetIndex(index);
    if (pdfFileInputRef.current) {
      pdfFileInputRef.current.value = '';
      pdfFileInputRef.current.click();
    }
  };

  const handleDeleteDirectLink = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      directLinks: prev.directLinks.filter((_, i) => i !== index)
    }));
  };

  // Move Important Link Down (नीचे करें)
  const handleMoveDownDirectLink = (index: number) => {
    const currentLinks = editablePost.directLinks || [];
    if (index >= currentLinks.length - 1) return;
    const nextList = [...currentLinks];
    const temp = nextList[index];
    nextList[index] = nextList[index + 1];
    nextList[index + 1] = temp;
    
    const updatedPost = { ...editablePost, directLinks: nextList };
    setEditablePost(updatedPost);
    
    if (onUpdatePost) {
      onUpdatePost(updatedPost);
    }
    try {
      const saved = localStorage.getItem('sarkari_admin_posts_v5');
      let currentArr: SarkariPost[] = saved ? JSON.parse(saved) : [];
      const pIdx = currentArr.findIndex(p => p.id === updatedPost.id);
      if (pIdx >= 0) {
        currentArr[pIdx] = updatedPost;
      } else {
        currentArr.push(updatedPost);
      }
      localStorage.setItem('sarkari_admin_posts_v5', JSON.stringify(currentArr));
      window.dispatchEvent(new CustomEvent('sarkari_posts_updated', { detail: currentArr }));
    } catch (e) {
      console.error(e);
    }
    setAlertFeedback(`⬇️ "${temp.label}" लिंक को नीचे कर दिया गया है!`);
    setTimeout(() => setAlertFeedback(null), 3000);
  };

  // Move Important Link Up (ऊपर करें)
  const handleMoveUpDirectLink = (index: number) => {
    const currentLinks = editablePost.directLinks || [];
    if (index <= 0) return;
    const nextList = [...currentLinks];
    const temp = nextList[index];
    nextList[index] = nextList[index - 1];
    nextList[index - 1] = temp;
    
    const updatedPost = { ...editablePost, directLinks: nextList };
    setEditablePost(updatedPost);
    
    if (onUpdatePost) {
      onUpdatePost(updatedPost);
    }
    try {
      const saved = localStorage.getItem('sarkari_admin_posts_v5');
      let currentArr: SarkariPost[] = saved ? JSON.parse(saved) : [];
      const pIdx = currentArr.findIndex(p => p.id === updatedPost.id);
      if (pIdx >= 0) {
        currentArr[pIdx] = updatedPost;
      } else {
        currentArr.push(updatedPost);
      }
      localStorage.setItem('sarkari_admin_posts_v5', JSON.stringify(currentArr));
      window.dispatchEvent(new CustomEvent('sarkari_posts_updated', { detail: currentArr }));
    } catch (e) {
      console.error(e);
    }
    setAlertFeedback(`⬆️ "${temp.label}" लिंक को ऊपर कर दिया गया है!`);
    setTimeout(() => setAlertFeedback(null), 3000);
  };


  const handleAddFAQ = () => {
    setEditablePost(prev => {
      const currentList = prev.customFaqs || faqs || [];
      return {
        ...prev,
        customFaqs: [
          ...currentList,
          {
            question: `How to check ${prev.shortTitle || prev.title} latest status online?`,
            answer: 'Candidates can visit Sarkari Result website and click on the direct official links provided in the Important Links table above.'
          }
        ]
      };
    });
  };

  const handleDeleteFAQ = (index: number) => {
    setEditablePost(prev => {
      const currentList = prev.customFaqs || faqs || [];
      return {
        ...prev,
        customFaqs: currentList.filter((_, i) => i !== index)
      };
    });
  };

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
    const originalTitle = document.title;
    document.title = `${post.title} - Sarkari Result`;

    // Dynamic Canonical URL injection for SEO & Google Search Indexing
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    let createdCanonical = false;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
      createdCanonical = true;
    }
    const originalCanonical = canonicalLink.href || '';
    const baseUrl = typeof window !== 'undefined' && !window.location.host.includes('run.app') && !window.location.host.includes('localhost')
      ? window.location.origin.replace(/\/+$/, '') 
      : CANONICAL_DOMAIN;
    const cleanCanonicalUrl = `${baseUrl}/post/${post.slug || post.id}`;
    const currentUrl = cleanCanonicalUrl;
    canonicalLink.href = cleanCanonicalUrl;

    // Dynamic Meta Description update
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    let createdDesc = false;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
      createdDesc = true;
    }
    const originalDesc = metaDesc.getAttribute('content') || '';
    const postDesc = (post.shortInfo || `${post.title} check official recruitment notice, important dates, eligibility, total vacancies, online application fee, selection process, and direct download link.`).replace(/\n+/g, ' ').slice(0, 160);
    metaDesc.setAttribute('content', postDesc);

    // Dynamic Meta Keywords & News Keywords injection for Organic Search & Google Discover
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    let createdKeywords = false;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
      createdKeywords = true;
    }
    const originalKeywords = metaKeywords.getAttribute('content') || '';
    const keywordsStr = viralTags.map(t => t.replace(/^#/, '')).join(', ');
    metaKeywords.setAttribute('content', keywordsStr);

    let metaNewsKeywords = document.querySelector('meta[name="news_keywords"]') as HTMLMetaElement | null;
    let createdNewsKeywords = false;
    if (!metaNewsKeywords) {
      metaNewsKeywords = document.createElement('meta');
      metaNewsKeywords.name = 'news_keywords';
      document.head.appendChild(metaNewsKeywords);
      createdNewsKeywords = true;
    }
    const originalNewsKeywords = metaNewsKeywords.getAttribute('content') || '';
    metaNewsKeywords.setAttribute('content', keywordsStr);

    let metaTwitterKeywords = document.querySelector('meta[name="twitter:keywords"]') as HTMLMetaElement | null;
    let createdTwitterKeywords = false;
    if (!metaTwitterKeywords) {
      metaTwitterKeywords = document.createElement('meta');
      metaTwitterKeywords.name = 'twitter:keywords';
      document.head.appendChild(metaTwitterKeywords);
      createdTwitterKeywords = true;
    }
    const originalTwitterKeywords = metaTwitterKeywords.getAttribute('content') || '';
    metaTwitterKeywords.setAttribute('content', keywordsStr);

    // Dynamic OG Meta Tags
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.setAttribute('content', `${post.title} - Sarkari Result`);

    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.setAttribute('content', postDesc);

    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (ogUrl) ogUrl.setAttribute('content', currentUrl);

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

    // Dynamic JobPosting Schema injection for recruitment/job posts
    const jobScriptId = 'post-job-jsonld-schema';
    let jobScriptTag = document.getElementById(jobScriptId) as HTMLScriptElement | null;
    if (['latest_jobs', 'result', 'admit_card', 'admission'].includes(post.category)) {
      if (!jobScriptTag) {
        jobScriptTag = document.createElement('script');
        jobScriptTag.id = jobScriptId;
        jobScriptTag.type = 'application/ld+json';
        document.head.appendChild(jobScriptTag);
      }
      const jobPostingSchema = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": post.title,
        "description": post.shortInfo || post.title,
        "keywords": keywordsStr,
        "identifier": {
          "@type": "PropertyValue",
          "name": post.department || "Government of India",
          "value": post.id
        },
        "datePosted": toIso8601Date(post.postDate),
        "validThrough": toIso8601Date(post.lastDate || "2026-12-31"),
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
          "@type": "Organization",
          "name": post.department || "Government of India",
          "sameAs": baseUrl
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          }
        }
      };
      jobScriptTag.textContent = JSON.stringify(jobPostingSchema);
    } else if (jobScriptTag) {
      jobScriptTag.remove();
    }

    return () => {
      document.title = originalTitle;
      if (canonicalLink) {
        if (createdCanonical) canonicalLink.remove();
        else canonicalLink.href = originalCanonical;
      }
      if (metaDesc) {
        if (createdDesc) metaDesc.remove();
        else metaDesc.setAttribute('content', originalDesc);
      }
      if (metaKeywords) {
        if (createdKeywords) metaKeywords.remove();
        else metaKeywords.setAttribute('content', originalKeywords);
      }
      if (metaNewsKeywords) {
        if (createdNewsKeywords) metaNewsKeywords.remove();
        else metaNewsKeywords.setAttribute('content', originalNewsKeywords);
      }
      if (metaTwitterKeywords) {
        if (createdTwitterKeywords) metaTwitterKeywords.remove();
        else metaTwitterKeywords.setAttribute('content', originalTwitterKeywords);
      }
      const existingFaq = document.getElementById(faqScriptId);
      if (existingFaq) existingFaq.remove();
      const existingBc = document.getElementById(breadcrumbScriptId);
      if (existingBc) existingBc.remove();
      const existingJob = document.getElementById(jobScriptId);
      if (existingJob) existingJob.remove();
    };
  }, [post, faqs, viralTags]);

  const isServiceOrScheme = post.category === 'important' || post.category === 'certificate_verification';

  // Only show Age Relaxation Rules and Selection Process for main recruitment categories
  const showRecruitmentDetails = ['latest_jobs', 'result', 'admit_card', 'answer_key'].includes(post.category);

  // Identify statutory & informational posts (About Us, Privacy Policy, Disclaimer, Terms & Rules, Contact Us)
  const isInformationalPost = useMemo(() => {
    return (
      post.slug === 'disclaimer' || 
      post.slug === 'rules-and-regulations' || 
      post.slug === 'contact-us' ||
      post.slug === 'about-us' ||
      post.slug === 'privacy-policy' ||
      (post.category === 'important' && (
        post.slug.includes('disclaimer') || 
        post.slug.includes('rules') || 
        post.slug.includes('contact') ||
        post.slug.includes('about') ||
        post.slug.includes('privacy')
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

  // Identify Central Government / All India vacancies for State-Wise Post Details
  const isCentralVacancy = useMemo(() => {
    if (isServiceOrScheme || isInformationalPost) return false;
    const stateLower = (editablePost.state || '').toLowerCase().trim();
    return (
      stateLower === 'all india' ||
      stateLower === 'central' ||
      ['UPSC', 'SSC', 'Railway', 'Defence'].includes(editablePost.department)
    );
  }, [isServiceOrScheme, isInformationalPost, editablePost.state, editablePost.department]);

  const displayedStateRows = useMemo(() => {
    return editablePost.stateBreakdown && editablePost.stateBreakdown.length > 0
      ? editablePost.stateBreakdown
      : [];
  }, [editablePost.stateBreakdown]);

  const displayedZoneRows = useMemo(() => {
    const base =
      editablePost.zoneBreakdown && editablePost.zoneBreakdown.length > 0
        ? editablePost.zoneBreakdown
        : isRailwayPost && !isServiceOrScheme && !isInformationalPost
          ? defaultRrbZones
          : [];
    if (!rrbSearch.trim()) return base.map((z, idx) => ({ z, idx }));
    const q = rrbSearch.toLowerCase().trim();
    return base
      .map((z, idx) => ({ z, idx }))
      .filter(
        ({ z }) =>
          z.zoneName.toLowerCase().includes(q) ||
          (z.hindiZoneName || '').toLowerCase().includes(q)
      );
  }, [editablePost.zoneBreakdown, isRailwayPost, isServiceOrScheme, isInformationalPost, defaultRrbZones, rrbSearch]);

  // Useful Links for all posts (excluding social channels)
  const allDirectLinks = useMemo(() => {
    const existing = [...(post.directLinks || [])];
    return existing.filter(l => 
      !l.label?.toLowerCase().includes('whatsapp') && 
      !l.label?.toLowerCase().includes('telegram') && 
      !l.url?.toLowerCase().includes('whatsapp') && 
      !l.url?.toLowerCase().includes('t.me')
    );
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
    <div 
      className="single-post w-full min-h-screen bg-[#f3f4f6] pb-20 font-post font-mangal"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif"
      }}
    >
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-5">
        
        {/* Navigation Breadcrumbs (Home > Category > Post Title) & Actions */}
        <nav aria-label="Breadcrumb navigation" className="mb-2 bg-white border border-slate-200 rounded-t-xs px-3 sm:px-4 py-2 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
          <ol className="flex items-center gap-1.5 sm:gap-2 text-slate-700 text-[12px] leading-[18px] flex-wrap font-sans">
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

          <div className="flex items-center gap-2">
            {/* Share Button with requested format */}
            <button
              type="button"
              onClick={() => {
                const url = getCleanShareUrl(editablePost.slug || editablePost.id);
                const shareText = getCategoryShareText(editablePost, url);
                if (navigator.share) {
                  navigator.share({
                    title: editablePost.title,
                    text: shareText
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(shareText);
                  setAlertFeedback('✅ शेयर फॉर्मेट कॉपी हो गया है! (Share format copied)');
                  setTimeout(() => setAlertFeedback(null), 3500);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer shadow-xs font-sans"
              title="शेयर फॉर्मेट कॉपी करें"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share / शेयर</span>
            </button>

            {/* Toggle Word In-Place Edit Mode Button (Only for authenticated Admins) */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  const next = !isDirectEditMode;
                  setIsDirectEditMode(next);
                  if (onToggleGlobalWordEdit) {
                    if ((next && !isGlobalWordEditActive) || (!next && isGlobalWordEditActive)) {
                      onToggleGlobalWordEdit();
                    }
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-xs transition cursor-pointer shadow-xs ${
                  isDirectEditMode
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
                title="वर्ड इन-प्लेस एडिट मोड ऑन/ऑफ करें (In-Place Word Edit Mode)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isDirectEditMode ? '✓ वर्ड इन-प्लेस एडिट सक्रिय' : '✏️ वर्ड इन-प्लेस एडिट मोड'}</span>
              </button>
            )}
          </div>
        </nav>

        {/* Direct In-Place Click-to-Edit Mode Control Bar (Hidden by default, only shown when active) */}
        {isDirectEditMode && (
          <div className="mb-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-3.5 py-2.5 rounded shadow-xs border border-amber-600 flex flex-wrap items-center justify-between gap-2 font-sans animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="bg-slate-950 text-amber-300 font-extrabold text-xs px-2.5 py-1 rounded flex items-center gap-1.5 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                वर्ड एडिट चालू है (LIVE)
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-950">
                ⚡ पोस्ट के किसी भी शब्द, हेडिंग, तारीख, फीस या पद पर क्लिक करके सीधे टाइप करें!
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Hide Direct Word Edit bar */}
              <button
                type="button"
                onClick={() => {
                  setIsDirectEditMode(false);
                  if (onToggleGlobalWordEdit && isGlobalWordEditActive) {
                    onToggleGlobalWordEdit();
                  }
                }}
                className="bg-slate-950 hover:bg-neutral-800 text-white font-bold text-xs px-3 py-1.5 rounded cursor-pointer shadow-xs border border-slate-700 flex items-center gap-1"
                title="डायरेक्ट वर्ड एडिट बार छिपाएं (Hide)"
              >
                <span>✕</span>
                <span>छिपाएं</span>
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
        <article className="inside-article entry-content bg-white p-2 sm:p-4">
          {/* Classic SarkariResult Two-Column Post Header (Name Of Post / Post Date / Short Information) */}
          <div
            className="mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="w-[108px] sm:w-[175px] align-top text-center font-bold text-[#ff0000] text-[14px] sm:text-[16px] leading-snug pr-2 sm:pr-4 pb-4 pt-1">
                    Name Of Post :
                  </td>
                  <td className="align-top pb-4 pt-0.5 pl-1 sm:pl-2">
                    <EditableText
                      as="h1"
                      value={editablePost.title}
                      onChange={(val) => setEditablePost(prev => ({ ...prev, title: val }))}
                      className="m-0 block w-full text-left text-[20px] sm:text-[24px] font-bold text-[#ff0000] leading-[1.28]"
                      titlePrefix="पोस्ट का शीर्षक (Title)"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="w-[108px] sm:w-[175px] align-top text-center font-bold text-[#ff0000] text-[14px] sm:text-[16px] leading-snug pr-2 sm:pr-4 pb-4 pt-0.5">
                    Post Date / Update :
                  </td>
                  <td className="align-top text-left text-[15px] sm:text-[16px] font-normal text-black pb-4 pt-0.5 pl-1 sm:pl-2">
                    {isDirectEditMode ? (
                      <EditableText
                        value={editablePost.postDate}
                        onChange={(val) => setEditablePost(prev => ({ ...prev, postDate: val }))}
                        className="text-black"
                        titlePrefix="पोस्ट की तिथि (Post Date)"
                      />
                    ) : (
                      <span>{formatDisplayDate(editablePost.postDate)}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="w-[108px] sm:w-[175px] align-top text-center font-bold text-[#ff0000] text-[14px] sm:text-[16px] leading-snug pr-2 sm:pr-4 pb-2 pt-0.5">
                    Short Information
                  </td>
                  <td className="align-top text-left text-[14.5px] sm:text-[15.5px] font-normal text-black leading-[1.52] pb-2 pt-0.5 pl-1 sm:pl-2">
                    {isDirectEditMode ? (
                      <EditableText
                        as="span"
                        value={editablePost.shortInfo}
                        onChange={(val) => setEditablePost(prev => ({ ...prev, shortInfo: val }))}
                        titlePrefix="संक्षिप्त जानकारी (Short Info)"
                      />
                    ) : (
                      <span>{renderFormattedShortInfo(editablePost.shortInfo)}</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Social Bar */}
          <div className="social-bar">
            <a
              href="https://t.me/newsarkariresultt"
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill pill-tg"
            >
              Join Telegram
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill pill-wa"
            >
              Join WhatsApp
            </a>
          </div>

          {/* In-Article Outstream Video / Display Ad Slot (placed below social bar, outside tables) */}
          <div className="my-3">
            <AdBanner placement="postTop" onOpenTool={onOpenPhotoResizer} />
          </div>

          {/* Section Body Details */}
          <div className="space-y-4 text-slate-900">
            {/* IF INFORMATIONAL POST (About Us, Privacy Policy, Disclaimer, Terms & Rules, Contact Us): Render Article with Ad Sections */}
            {isInformationalPost && (
              <div className="space-y-4">
                {post.vacancyBreakdown && post.vacancyBreakdown.length > 0 && (
                  <div className="space-y-4">
                    {post.vacancyBreakdown.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <div className="border border-black bg-white p-4 space-y-2">
                          <h4 className="text-[#008000] font-bold text-base border-b border-slate-200 pb-2">
                            {item.postName}
                          </h4>
                          <div className="text-slate-900 leading-relaxed whitespace-pre-line pt-1 text-sm">
                            {item.eligibility}
                          </div>
                        </div>

                        {idx === 0 && (
                          <div className="my-3">
                            <AdBanner placement="homeMid" onOpenTool={onOpenPhotoResizer} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {post.howToApplySteps && post.howToApplySteps.length > 0 && (
                  <div className="border border-black bg-white p-4 space-y-2">
                    <h4 className="text-[#008000] font-bold text-base border-b border-slate-200 pb-2">
                      {post.shortTitle} Guidelines &amp; Important Information
                    </h4>
                    <ul className="space-y-1.5 text-slate-900 pt-1 leading-relaxed text-sm list-disc pl-5">
                      {post.howToApplySteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="my-3">
                  <AdBanner placement="postBottom" onOpenTool={onOpenPhotoResizer} />
                </div>
              </div>
            )}

            {/* IF RECRUITMENT JOB POST: Render SarkariResult .sr-table Tables */}
            {!isInformationalPost && (
              <>
                {/* Important Dates & Application Fee Table */}
                {!hiddenSections['sec_dates_fee'] && (
                  <div className="overflow-x-auto">
                    <table className="sr-table">
                      <thead>
                        <tr>
                          <th colSpan={2} className="sr-table-head-maroon">
                            <EditableText
                              value={editablePost.shortTitle || editablePost.title}
                              onChange={(val) => setEditablePost(prev => ({ ...prev, shortTitle: val }))}
                              className="text-white font-bold"
                              titlePrefix="भर्ती / योजना का नाम (Short Title)"
                            />{' '}
                            — Short Details of Notification
                          </th>
                        </tr>
                        <tr>
                          <th className="sr-table-head-green" style={{ width: '50%' }}>
                            Important Dates
                          </th>
                          <th className="sr-table-head-green" style={{ width: '50%' }}>
                            Application Fee
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <ul>
                              {(editablePost.importantDates || []).map((d, idx) => (
                                <li key={idx}>
                                  <EditableText
                                    value={d.label}
                                    onChange={(val) => {
                                      setEditablePost(prev => {
                                        const nextDates = [...prev.importantDates];
                                        nextDates[idx] = { ...nextDates[idx], label: val };
                                        return { ...prev, importantDates: nextDates };
                                      });
                                    }}
                                    titlePrefix="तारीख का नाम (Date Label)"
                                  />
                                  {' : '}
                                  <strong className={d.isHighlight ? 'badge-red' : ''}>
                                    <EditableText
                                      value={d.value}
                                      onChange={(val) => {
                                        setEditablePost(prev => {
                                          const nextDates = [...prev.importantDates];
                                          nextDates[idx] = { ...nextDates[idx], value: val };
                                          return { ...prev, importantDates: nextDates };
                                        });
                                      }}
                                      className={d.isHighlight ? 'badge-red' : 'font-bold'}
                                      titlePrefix="तारीख (Date Value)"
                                    />
                                  </strong>
                                  {isDirectEditMode && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDateItem(idx)}
                                      className="ml-2 text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold"
                                      title="यह तारीख हटाएं"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                            {isDirectEditMode && (
                              <button
                                type="button"
                                onClick={handleAddDateItem}
                                className="mt-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                              >
                                <span>+ नई तारीख जोड़ें (Add Date)</span>
                              </button>
                            )}
                          </td>
                          <td>
                            <ul>
                              {editablePost.applicationFee && editablePost.applicationFee.length > 0 ? (
                                editablePost.applicationFee.map((fee, idx) => (
                                  <li key={idx}>
                                    <EditableText
                                      value={fee.category}
                                      onChange={(val) => {
                                        setEditablePost(prev => {
                                          const nextFees = [...prev.applicationFee];
                                          nextFees[idx] = { ...nextFees[idx], category: val };
                                          return { ...prev, applicationFee: nextFees };
                                        });
                                      }}
                                      titlePrefix="शुल्क श्रेणी (Category)"
                                    />
                                    {' : '}
                                    <strong>
                                      <EditableText
                                        value={fee.amount}
                                        onChange={(val) => {
                                          setEditablePost(prev => {
                                            const nextFees = [...prev.applicationFee];
                                            nextFees[idx] = { ...nextFees[idx], amount: val };
                                            return { ...prev, applicationFee: nextFees };
                                          });
                                        }}
                                        titlePrefix="शुल्क राशि (Amount)"
                                      />
                                    </strong>
                                    {isDirectEditMode && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteFeeItem(idx)}
                                        className="ml-2 text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold"
                                        title="यह फीस हटाएं"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </li>
                                ))
                              ) : (
                                <li>No Application Fee</li>
                              )}
                              <li>Pay the Examination Fee through Debit Card, Credit Card, Net Banking, or UPI Mode Only.</li>
                            </ul>
                            {isDirectEditMode && (
                              <button
                                type="button"
                                onClick={handleAddFeeItem}
                                className="mt-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                              >
                                <span>+ नई फीस श्रेणी जोड़ें (Add Fee)</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Separate Age Limit Details Table */}
                {!isServiceOrScheme &&
                  editablePost.ageLimit &&
                  (editablePost.ageLimit.asOnDate ||
                    editablePost.ageLimit.minAge ||
                    editablePost.ageLimit.maxAge) &&
                  !hiddenSections['sec_age_limit'] && (
                    <div className="overflow-x-auto">
                      <table className="sr-table">
                        <thead>
                          <tr>
                            <th className="sr-table-head-green">
                              <EditableText
                                value={editablePost.shortTitle || editablePost.title}
                                onChange={(val) => setEditablePost(prev => ({ ...prev, shortTitle: val }))}
                                className="text-white font-bold"
                                titlePrefix="भर्ती का नाम (Short Title)"
                              />{' '}
                              : Age Limit Details
                              {editablePost.ageLimit.asOnDate ? (
                                <>
                                  {' '}(as on{' '}
                                  <EditableText
                                    value={editablePost.ageLimit.asOnDate}
                                    onChange={(val) =>
                                      setEditablePost(prev => ({
                                        ...prev,
                                        ageLimit: { ...prev.ageLimit, asOnDate: val }
                                      }))
                                    }
                                    className="text-yellow-200 font-bold"
                                    titlePrefix="आयु गणना तिथि (As On Date)"
                                  />
                                  )
                                </>
                              ) : null}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <ul>
                                {(editablePost.ageLimit.minAge !== undefined || isDirectEditMode) && (
                                  <li>
                                    Minimum Age :{' '}
                                    <strong>
                                      <EditableText
                                        value={editablePost.ageLimit.minAge ?? ''}
                                        onChange={(val) =>
                                          setEditablePost(prev => ({
                                            ...prev,
                                            ageLimit: { ...prev.ageLimit, minAge: Number(val) || undefined }
                                          }))
                                        }
                                        titlePrefix="न्यूनतम आयु (Min Age)"
                                      />{' '}
                                      Years
                                    </strong>
                                  </li>
                                )}
                                {(editablePost.ageLimit.maxAge !== undefined || isDirectEditMode) && (
                                  <li>
                                    Maximum Age :{' '}
                                    <strong>
                                      <EditableText
                                        value={editablePost.ageLimit.maxAge ?? ''}
                                        onChange={(val) =>
                                          setEditablePost(prev => ({
                                            ...prev,
                                            ageLimit: { ...prev.ageLimit, maxAge: Number(val) || undefined }
                                          }))
                                        }
                                        titlePrefix="अधिकतम आयु (Max Age)"
                                      />{' '}
                                      Years
                                    </strong>
                                  </li>
                                )}
                                <li>
                                  <EditableText
                                    value={
                                      editablePost.ageLimit.notes ||
                                      'Age Relaxation Extra as per Official Recruitment Rules.'
                                    }
                                    onChange={(val) =>
                                      setEditablePost(prev => ({
                                        ...prev,
                                        ageLimit: { ...prev.ageLimit, notes: val }
                                      }))
                                    }
                                    titlePrefix="आयु छूट नियम (Age Relaxation Notes)"
                                  />
                                </li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                {/* Separate Vacancy Details Table */}
                {editablePost.vacancyBreakdown && editablePost.vacancyBreakdown.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="sr-table">
                      <thead>
                        <tr>
                          <th colSpan={3} className="sr-table-head-green">
                            Vacancy Details Total :{' '}
                            <EditableText
                              value={editablePost.totalVacancies}
                              onChange={(val) => setEditablePost(prev => ({ ...prev, totalVacancies: val }))}
                              className="text-yellow-200 font-bold"
                              titlePrefix="कुल पद (Total Vacancies)"
                            />{' '}
                            Posts
                          </th>
                        </tr>
                        <tr>
                          <th>Post Name</th>
                          <th style={{ width: '18%', textAlign: 'center' }}>Total Post</th>
                          <th>Eligibility Criteria</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editablePost.vacancyBreakdown.map((v, idx) => (
                          <tr key={idx}>
                            <td>
                              <strong>
                                <EditableText
                                  value={v.postName}
                                  onChange={(val) => {
                                    setEditablePost(prev => {
                                      const nextV = [...prev.vacancyBreakdown];
                                      nextV[idx] = { ...nextV[idx], postName: val };
                                      return { ...prev, vacancyBreakdown: nextV };
                                    });
                                  }}
                                  titlePrefix="पद का नाम (Post Name)"
                                />
                              </strong>
                              {isDirectEditMode && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVacancyRow(idx)}
                                  className="ml-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs px-2 py-0.5 rounded cursor-pointer"
                                  title="यह पद हटाएं"
                                >
                                  ✕ हटाएं
                                </button>
                              )}
                            </td>
                            <td className="center-cell">
                              <EditableText
                                value={v.totalPosts}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = { ...nextV[idx], totalPosts: val };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="पद संख्या (Posts Count)"
                              />
                            </td>
                            <td className="whitespace-pre-line">
                              <EditableText
                                as="div"
                                value={v.eligibility}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = { ...nextV[idx], eligibility: val };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="योग्यता पात्रता (Eligibility)"
                              />
                            </td>
                          </tr>
                        ))}
                        {isDirectEditMode && (
                          <tr>
                            <td colSpan={3} className="bg-slate-50 text-right">
                              <button
                                type="button"
                                onClick={handleAddVacancyRow}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                              >
                                <span>+ नया पद पंक्ति जोड़ें (Add Vacancy Row)</span>
                              </button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}


                {/* Category Wise Vacancy Details Table (Directly Below Vacancy Details) */}
                {!isServiceOrScheme && editablePost.vacancyBreakdown && editablePost.vacancyBreakdown.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="sr-table">
                      <thead>
                        <tr>
                          <th colSpan={7} className="sr-table-head-green">
                            <EditableText
                              value={editablePost.shortTitle || editablePost.title}
                              onChange={(val) => setEditablePost(prev => ({ ...prev, shortTitle: val }))}
                              className="text-white font-bold"
                              titlePrefix="भर्ती का नाम (Short Title)"
                            />{' '}
                            : Category Wise Vacancy Details
                          </th>
                        </tr>
                        <tr className="bg-slate-100">
                          <th className="text-left">Post Name</th>
                          <th className="text-center" style={{ color: '#ff00ff' }}>UR / GEN</th>
                          <th className="text-center" style={{ color: '#008000' }}>EWS</th>
                          <th className="text-center" style={{ color: '#0000ff' }}>OBC</th>
                          <th className="text-center" style={{ color: '#ab1616' }}>SC</th>
                          <th className="text-center" style={{ color: '#7e22ce' }}>ST</th>
                          <th className="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editablePost.vacancyBreakdown.map((v, idx) => (
                          <tr key={idx}>
                            <td className="font-bold">
                              <EditableText
                                value={v.postName}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = { ...nextV[idx], postName: val };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="पद का नाम (Post Name)"
                              />
                            </td>
                            <td className="center-cell">
                              <EditableText
                                value={v.categoryBreakdown?.gen ?? '-'}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = {
                                      ...nextV[idx],
                                      categoryBreakdown: { ...(nextV[idx].categoryBreakdown || {}), gen: val }
                                    };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="UR / GEN पद"
                              />
                            </td>
                            <td className="center-cell">
                              <EditableText
                                value={v.categoryBreakdown?.ews ?? '-'}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = {
                                      ...nextV[idx],
                                      categoryBreakdown: { ...(nextV[idx].categoryBreakdown || {}), ews: val }
                                    };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="EWS पद"
                              />
                            </td>
                            <td className="center-cell">
                              <EditableText
                                value={v.categoryBreakdown?.obc ?? '-'}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = {
                                      ...nextV[idx],
                                      categoryBreakdown: { ...(nextV[idx].categoryBreakdown || {}), obc: val }
                                    };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="OBC पद"
                              />
                            </td>
                            <td className="center-cell">
                              <EditableText
                                value={v.categoryBreakdown?.sc ?? '-'}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = {
                                      ...nextV[idx],
                                      categoryBreakdown: { ...(nextV[idx].categoryBreakdown || {}), sc: val }
                                    };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="SC पद"
                              />
                            </td>
                            <td className="center-cell">
                              <EditableText
                                value={v.categoryBreakdown?.st ?? '-'}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = {
                                      ...nextV[idx],
                                      categoryBreakdown: { ...(nextV[idx].categoryBreakdown || {}), st: val }
                                    };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="ST पद"
                              />
                            </td>
                            <td className="center-cell">
                              <EditableText
                                value={v.totalPosts}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextV = [...prev.vacancyBreakdown];
                                    nextV[idx] = { ...nextV[idx], totalPosts: val };
                                    return { ...prev, vacancyBreakdown: nextV };
                                  });
                                }}
                                titlePrefix="कुल पद (Total Posts)"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Ad Section between Category Wise Vacancy Details and Subsequent Sections */}
                <AdBanner placement="postMid" onOpenTool={onOpenPhotoResizer} />

                {/* State-Wise Vacancy Details Table (Renders ONLY when stateBreakdown data exists) */}
                {displayedStateRows.length > 0 ? (
                  !hiddenSections['sec_state_vacancy'] ? (
                    <div className="overflow-x-auto">
                      <table className="sr-table">
                        <thead>
                          <tr>
                            <th colSpan={isDirectEditMode ? 9 : 8} className="sr-table-head-green">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="flex-1 text-center">
                                  {editablePost.shortTitle || editablePost.title} : State-Wise Vacancy Details
                                </span>
                                {renderSectionControls('sec_state_vacancy', 'State-Wise Vacancy')}
                              </div>
                            </th>
                          </tr>
                          <tr className="bg-slate-100">
                            <th className="text-left" style={{ color: '#ff00ff' }}>State / UT Name</th>
                            <th className="text-center" style={{ color: '#008000' }}>Total Posts</th>
                            <th className="text-center text-blue-900">GEN</th>
                            <th className="text-center text-emerald-800">OBC</th>
                            <th className="text-center text-purple-800">EWS</th>
                            <th className="text-center text-red-800">SC</th>
                            <th className="text-center text-amber-800">ST</th>
                            <th className="text-left">Remarks</th>
                            {isDirectEditMode && <th className="text-center">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {displayedStateRows.map((s, idx) => (
                            <tr key={idx}>
                              <td className="font-bold text-blue-900">
                                <EditableText
                                  value={s.stateName}
                                  onChange={(val) => updateStateRow(idx, { stateName: val })}
                                  titlePrefix="राज्य का नाम (State)"
                                />
                              </td>
                              <td className="center-cell">
                                <EditableText
                                  value={s.totalPosts}
                                  onChange={(val) => updateStateRow(idx, { totalPosts: val })}
                                  titlePrefix="कुल पद (Total Posts)"
                                />
                              </td>
                              <td className="center-cell">
                                <EditableText
                                  value={s.genPosts ?? '-'}
                                  onChange={(val) => updateStateRow(idx, { genPosts: val })}
                                  titlePrefix="GEN पद"
                                />
                              </td>
                              <td className="center-cell">
                                <EditableText
                                  value={s.obcPosts ?? '-'}
                                  onChange={(val) => updateStateRow(idx, { obcPosts: val })}
                                  titlePrefix="OBC पद"
                                />
                              </td>
                              <td className="center-cell">
                                <EditableText
                                  value={s.ewsPosts ?? '-'}
                                  onChange={(val) => updateStateRow(idx, { ewsPosts: val })}
                                  titlePrefix="EWS पद"
                                />
                              </td>
                              <td className="center-cell">
                                <EditableText
                                  value={s.scPosts ?? '-'}
                                  onChange={(val) => updateStateRow(idx, { scPosts: val })}
                                  titlePrefix="SC पद"
                                />
                              </td>
                              <td className="center-cell">
                                <EditableText
                                  value={s.stPosts ?? '-'}
                                  onChange={(val) => updateStateRow(idx, { stPosts: val })}
                                  titlePrefix="ST पद"
                                />
                              </td>
                              <td>
                                <EditableText
                                  value={s.eligibilityNote || 'All India'}
                                  onChange={(val) => updateStateRow(idx, { eligibilityNote: val })}
                                  titlePrefix="टिप्पणी (Remarks)"
                                />
                              </td>
                              {isDirectEditMode && (
                                <td className="center-cell">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStateRow(idx)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs px-2 py-0.5 rounded cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                          {isDirectEditMode && (
                            <tr>
                              <td colSpan={9} className="bg-slate-50 text-right">
                                <button
                                  type="button"
                                  onClick={handleAddStateRow}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                                >
                                  + नया राज्य जोड़ें (Add State Row)
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : renderHiddenBanner('sec_state_vacancy', 'State-Wise Vacancy')
                ) : (
                  isDirectEditMode && isCentralVacancy && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddStateRow}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        + Add State-Wise Vacancy Row
                      </button>
                    </div>
                  )
                )}

                {/* Zone-Wise / RRB Board Vacancy Details Table (All Railway / RRB Posts & Custom Zones) */}
                {(displayedZoneRows.length > 0 || (isRailwayPost && !isServiceOrScheme && !isInformationalPost)) && (
                  !hiddenSections['sec_zone_vacancy'] ? (
                    <div className="overflow-x-auto">
                      <table className="sr-table">
                        <thead>
                          <tr>
                            <th colSpan={isDirectEditMode ? 9 : 8} className="sr-table-head-green">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="flex-1 text-center">
                                  {editablePost.shortTitle || editablePost.title} : RRB Zone-Wise Vacancy Details
                                </span>
                                {renderSectionControls('sec_zone_vacancy', 'Zone-Wise Vacancy')}
                              </div>
                            </th>
                          </tr>
                          {isRailwayPost && (
                            <tr>
                              <th colSpan={isDirectEditMode ? 9 : 8} className="bg-slate-50 p-2 font-normal text-left">
                                <div className="flex items-center gap-2 max-w-sm">
                                  <input
                                    type="text"
                                    value={rrbSearch}
                                    onChange={(e) => setRrbSearch(e.target.value)}
                                    placeholder="Filter RRB Board / Zone (e.g. Ajmer, Patna, WR)..."
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#008000]"
                                  />
                                  {rrbSearch && (
                                    <button
                                      type="button"
                                      onClick={() => setRrbSearch('')}
                                      className="text-xs font-bold text-red-700 hover:underline cursor-pointer shrink-0"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              </th>
                            </tr>
                          )}
                          <tr className="bg-slate-100">
                            <th className="text-left" style={{ color: '#ff00ff' }}>RRB Board / Zone Name</th>
                            <th className="text-center" style={{ color: '#008000' }}>Total Posts</th>
                            <th className="text-center text-blue-900">GEN</th>
                            <th className="text-center text-emerald-800">OBC</th>
                            <th className="text-center text-purple-800">EWS</th>
                            <th className="text-center text-red-800">SC</th>
                            <th className="text-center text-amber-800">ST</th>
                            <th className="text-center">Official Portal</th>
                            {isDirectEditMode && <th className="text-center">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {displayedZoneRows.length > 0 ? (
                            displayedZoneRows.map(({ z, idx }) => (
                              <tr key={idx}>
                                <td className="font-bold text-blue-900">
                                  <EditableText
                                    value={z.zoneName}
                                    onChange={(val) => updateZoneRow(idx, { zoneName: val })}
                                    titlePrefix="ज़ोन / आरआरबी नाम (Zone)"
                                  />
                                  {z.hindiZoneName && (
                                    <div className="text-xs text-slate-600 font-normal">{z.hindiZoneName}</div>
                                  )}
                                </td>
                                <td className="center-cell">
                                  <EditableText
                                    value={z.totalPosts}
                                    onChange={(val) => updateZoneRow(idx, { totalPosts: val })}
                                    titlePrefix="कुल पद (Total Posts)"
                                  />
                                </td>
                                <td className="center-cell">
                                  <EditableText
                                    value={z.genPosts ?? '-'}
                                    onChange={(val) => updateZoneRow(idx, { genPosts: val })}
                                    titlePrefix="GEN पद"
                                  />
                                </td>
                                <td className="center-cell">
                                  <EditableText
                                    value={z.obcPosts ?? '-'}
                                    onChange={(val) => updateZoneRow(idx, { obcPosts: val })}
                                    titlePrefix="OBC पद"
                                  />
                                </td>
                                <td className="center-cell">
                                  <EditableText
                                    value={z.ewsPosts ?? '-'}
                                    onChange={(val) => updateZoneRow(idx, { ewsPosts: val })}
                                    titlePrefix="EWS पद"
                                  />
                                </td>
                                <td className="center-cell">
                                  <EditableText
                                    value={z.scPosts ?? '-'}
                                    onChange={(val) => updateZoneRow(idx, { scPosts: val })}
                                    titlePrefix="SC पद"
                                  />
                                </td>
                                <td className="center-cell">
                                  <EditableText
                                    value={z.stPosts ?? '-'}
                                    onChange={(val) => updateZoneRow(idx, { stPosts: val })}
                                    titlePrefix="ST पद"
                                  />
                                </td>
                                <td className="center-cell">
                                  <a
                                    href={sanitizeUrl(z.applyLink || 'https://www.rrbapply.gov.in/')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sr-link-blue font-bold"
                                  >
                                    Click Here
                                  </a>
                                </td>
                                {isDirectEditMode && (
                                  <td className="center-cell">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteZoneRow(idx)}
                                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs px-2 py-0.5 rounded cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={isDirectEditMode ? 9 : 8} className="center-cell text-slate-600">
                                No matching RRB Board / Zone found for &ldquo;{rrbSearch}&rdquo;.
                              </td>
                            </tr>
                          )}
                          {isDirectEditMode && (
                            <tr>
                              <td colSpan={9} className="bg-slate-50 text-right">
                                <button
                                  type="button"
                                  onClick={handleAddZoneRow}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                                >
                                  + नया ज़ोन जोड़ें (Add RRB Zone Row)
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : renderHiddenBanner('sec_zone_vacancy', 'Zone-Wise Vacancy')
                )}

                {/* Salary & Pay Scale Table (वेतन सारणी) */}
                {!isServiceOrScheme && !isInformationalPost && (
                  !hiddenSections['sec_salary'] ? (
                    <div className="overflow-x-auto">
                      <table className="sr-table">
                        <thead>
                          <tr>
                            <th colSpan={isDirectEditMode ? 6 : 5} className="sr-table-head-green">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="flex-1 text-center">
                                  {editablePost.shortTitle || editablePost.title} — Pay Scale &amp; Salary Details (वेतन सारणी)
                                </span>
                                {renderSectionControls('sec_salary', 'Salary (वेतन सारणी)')}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th colSpan={isDirectEditMode ? 6 : 5} className="bg-slate-50 text-left font-normal">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-slate-900">
                                <span>
                                  <strong>Pay Scale (वेतनमान): </strong>
                                  <EditableText
                                    value={editablePost.salary || 'As per 7th Pay Commission (7th CPC)'}
                                    onChange={(val) => setEditablePost(prev => ({ ...prev, salary: val }))}
                                    titlePrefix="वेतनमान (Pay Scale)"
                                  />
                                </span>
                                {editablePost.salaryBand && editablePost.salaryBand !== 'All' && (
                                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-xs border border-emerald-300">
                                    Band: {editablePost.salaryBand}
                                  </span>
                                )}
                              </div>
                            </th>
                          </tr>
                          <tr className="bg-slate-100">
                            <th className="text-left" style={{ color: '#ff00ff' }}>Post Name</th>
                            <th className="text-center" style={{ color: '#008000' }}>Pay Level</th>
                            <th className="text-left text-blue-900">Basic Pay</th>
                            <th className="text-left text-purple-900">In-Hand Salary</th>
                            <th className="text-left">Allowances / Grade Pay</th>
                            {isDirectEditMode && <th className="text-center">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {displayedSalaryRows.map((sal, idx) => (
                            <tr key={idx}>
                              <td className="font-bold text-blue-900">
                                <EditableText
                                  value={sal.postName}
                                  onChange={(val) => updateSalaryRow(idx, { postName: val })}
                                  titlePrefix="पद का नाम (Post Name)"
                                />
                              </td>
                              <td className="center-cell text-emerald-800">
                                <EditableText
                                  value={sal.payLevel}
                                  onChange={(val) => updateSalaryRow(idx, { payLevel: val })}
                                  titlePrefix="पे लेवल (Pay Level)"
                                />
                              </td>
                              <td className="font-bold text-slate-900">
                                <EditableText
                                  value={sal.basicPay}
                                  onChange={(val) => updateSalaryRow(idx, { basicPay: val })}
                                  titlePrefix="बेसिक पे (Basic Pay)"
                                />
                              </td>
                              <td className="font-bold text-purple-900">
                                <EditableText
                                  value={sal.inHandSalary || '-'}
                                  onChange={(val) => updateSalaryRow(idx, { inHandSalary: val })}
                                  titlePrefix="इन-हैंड वेतन (In-Hand Salary)"
                                />
                              </td>
                              <td>
                                <EditableText
                                  value={sal.allowances || sal.gradePay || 'DA, HRA, TA as per Govt Norms'}
                                  onChange={(val) => updateSalaryRow(idx, { allowances: val })}
                                  titlePrefix="भत्ते (Allowances)"
                                />
                              </td>
                              {isDirectEditMode && (
                                <td className="center-cell">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSalaryRow(idx)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs px-2 py-0.5 rounded cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                          {isDirectEditMode && (
                            <tr>
                              <td colSpan={6} className="bg-slate-50 text-right">
                                <button
                                  type="button"
                                  onClick={handleAddSalaryRow}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                                >
                                  + वेतन पंक्ति जोड़ें (Add Salary Row)
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : renderHiddenBanner('sec_salary', 'Salary (वेतन सारणी)')
                )}

                {/* Exam Scheme & Paper Pattern Table (परीक्षा पैटर्न) */}
                {!isServiceOrScheme && !isInformationalPost && (
                  !hiddenSections['sec_paper_pattern'] ? (
                    <div className="overflow-x-auto">
                      <table className="sr-table">
                        <thead>
                          <tr>
                            <th colSpan={isDirectEditMode ? 5 : 4} className="sr-table-head-green">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="flex-1 text-center">
                                  <EditableText
                                    value={
                                      editablePost.paperPattern?.examName ||
                                      `${editablePost.shortTitle || editablePost.title} — Exam Pattern (परीक्षा पैटर्न)`
                                    }
                                    onChange={(val) =>
                                      setEditablePost(prev => ({
                                        ...prev,
                                        paperPattern: { ...(prev.paperPattern || {}), examName: val },
                                      }))
                                    }
                                    className="text-white font-bold"
                                    titlePrefix="परीक्षा पैटर्न शीर्षक (Exam Name)"
                                  />
                                </span>
                                {renderSectionControls('sec_paper_pattern', 'Exam Pattern')}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th colSpan={isDirectEditMode ? 5 : 4} className="bg-slate-50 font-normal text-left p-2.5">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                <div className="bg-white p-2 rounded border border-slate-300">
                                  <span className="text-slate-600 block">Exam Mode</span>
                                  <strong className="text-slate-900">
                                    <EditableText
                                      value={editablePost.paperPattern?.examMode || 'CBT / Written Exam'}
                                      onChange={(val) =>
                                        setEditablePost(prev => ({
                                          ...prev,
                                          paperPattern: { ...(prev.paperPattern || {}), examMode: val },
                                        }))
                                      }
                                      titlePrefix="परीक्षा मोड (Exam Mode)"
                                    />
                                  </strong>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-300">
                                  <span className="text-slate-600 block">Total Duration</span>
                                  <strong className="text-blue-900">
                                    <EditableText
                                      value={editablePost.paperPattern?.totalDuration || 'As per Notice'}
                                      onChange={(val) =>
                                        setEditablePost(prev => ({
                                          ...prev,
                                          paperPattern: { ...(prev.paperPattern || {}), totalDuration: val },
                                        }))
                                      }
                                      titlePrefix="कुल समय (Total Duration)"
                                    />
                                  </strong>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-300">
                                  <span className="text-slate-600 block">Total Questions</span>
                                  <strong className="text-slate-900">
                                    <EditableText
                                      value={editablePost.paperPattern?.totalQuestions ?? 'Objective / MCQ'}
                                      onChange={(val) =>
                                        setEditablePost(prev => ({
                                          ...prev,
                                          paperPattern: { ...(prev.paperPattern || {}), totalQuestions: val },
                                        }))
                                      }
                                      titlePrefix="कुल प्रश्न (Total Questions)"
                                    />
                                  </strong>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-300">
                                  <span className="text-slate-600 block">Negative Marking</span>
                                  <strong className="text-red-700">
                                    <EditableText
                                      value={editablePost.paperPattern?.negativeMarking || 'As per Official Rules'}
                                      onChange={(val) =>
                                        setEditablePost(prev => ({
                                          ...prev,
                                          paperPattern: { ...(prev.paperPattern || {}), negativeMarking: val },
                                        }))
                                      }
                                      titlePrefix="नेगेटिव मार्किंग (Negative Marking)"
                                    />
                                  </strong>
                                </div>
                              </div>
                            </th>
                          </tr>
                          <tr className="bg-slate-100">
                            <th className="text-left" style={{ color: '#ff00ff' }}>Subject / Test Paper</th>
                            <th className="text-center text-blue-900">Questions</th>
                            <th className="text-center" style={{ color: '#008000' }}>Maximum Marks</th>
                            <th className="text-left">Duration / Remarks</th>
                            {isDirectEditMode && <th className="text-center">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {displayedPaperSubjects.map((sub, idx) => (
                            <tr key={idx}>
                              <td className="font-bold text-slate-900">
                                <EditableText
                                  value={sub.subjectName}
                                  onChange={(val) => updatePaperSubjectRow(idx, { subjectName: val })}
                                  titlePrefix="विषय (Subject)"
                                />
                              </td>
                              <td className="center-cell text-blue-900">
                                <EditableText
                                  value={sub.totalQuestions || '-'}
                                  onChange={(val) => updatePaperSubjectRow(idx, { totalQuestions: val })}
                                  titlePrefix="प्रश्न संख्या (Questions)"
                                />
                              </td>
                              <td className="center-cell text-emerald-800">
                                <EditableText
                                  value={sub.totalMarks || '-'}
                                  onChange={(val) => updatePaperSubjectRow(idx, { totalMarks: val })}
                                  titlePrefix="अधिकतम अंक (Max Marks)"
                                />
                              </td>
                              <td>
                                <EditableText
                                  value={sub.duration || sub.remarks || '-'}
                                  onChange={(val) => updatePaperSubjectRow(idx, { duration: val })}
                                  titlePrefix="समय / टिप्पणी (Duration / Remarks)"
                                />
                              </td>
                              {isDirectEditMode && (
                                <td className="center-cell">
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePaperSubjectRow(idx)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs px-2 py-0.5 rounded cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                          {isDirectEditMode && (
                            <tr>
                              <td colSpan={5} className="bg-slate-50 text-right">
                                <button
                                  type="button"
                                  onClick={handleAddPaperSubjectRow}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                                >
                                  + विषय जोड़ें (Add Subject Row)
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : renderHiddenBanner('sec_paper_pattern', 'Exam Pattern')
                )}

                {/* Mode of Selection (Renders ONLY IF post.selectionProcess data exists) */}
                {editablePost.selectionProcess && editablePost.selectionProcess.length > 0 && (
                  !hiddenSections['sec_selection_process'] ? (
                    <div className="border border-slate-400 bg-white p-3.5 sm:p-5 text-[10pt] space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2">
                        <h4 
                          className="font-black text-[11pt] font-sans text-blue-700"
                        >
                          {editablePost.shortTitle} Selection Process / Mode of Selection
                        </h4>
                        {renderSectionControls('sec_selection_process', 'Selection Process')}
                      </div>
                      <div className="pt-1">
                        <p className="text-slate-800 mb-2 leading-relaxed font-sans text-[10pt]">
                          The recruitment board will select eligible candidates through the following sequential stages:
                        </p>
                        <ol className="space-y-2 text-slate-900 font-medium text-[10pt]">
                          {editablePost.selectionProcess.map((step, idx) => (
                            <li key={idx} className="flex items-start justify-between gap-2.5 bg-slate-50/80 p-2.5 rounded border border-slate-200">
                              <div className="flex items-start gap-2.5 flex-1">
                                <span className="font-bold text-white text-[10pt] px-2 py-0.5 rounded shrink-0 mt-0.5 bg-blue-700">Stage {idx + 1}</span>
                                <div className="leading-relaxed text-slate-800 flex-1">
                                  <EditableText
                                    value={step}
                                    onChange={(val) => {
                                      setEditablePost(prev => {
                                        const nextSteps = [...(prev.selectionProcess || [])];
                                        nextSteps[idx] = val;
                                        return { ...prev, selectionProcess: nextSteps };
                                      });
                                    }}
                                    titlePrefix="चयन प्रक्रिया चरण (Selection Stage)"
                                  />
                                </div>
                              </div>
                              {isDirectEditMode && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSelectionStage(idx)}
                                  className="text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold"
                                  title="यह स्टेज हटाएं"
                                >
                                  ✕
                                </button>
                              )}
                            </li>
                          ))}
                        </ol>
                        {isDirectEditMode && (
                          <button
                            type="button"
                            onClick={handleAddSelectionStage}
                            className="mt-2.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ नया चयन स्टेज जोड़ें (Add Stage)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : renderHiddenBanner('sec_selection_process', 'Selection Process')
                )}

                {/* How to Fill Form Table */}
                {(() => {
                  const steps = (editablePost.howToApplySteps && editablePost.howToApplySteps.length >= 5) 
                    ? editablePost.howToApplySteps 
                    : [
                        `${editablePost.shortTitle || editablePost.title} Recruitment 2026 के लिए ऑनलाइन आवेदन करने से पहले सभी अभ्यर्थी आधिकारिक अधिसूचना (Official Notification) को ध्यानपूर्वक पढ़ें।`,
                        `सरकारी रिजल्ट (Sarkari Result) पोर्टल पर उपलब्ध डायरेक्ट 'Apply Online' लिंक पर क्लिक करें और संबंधित विभाग की आधिकारिक वेबसाइट पर जाएं।`,
                        `अपने सभी आवश्यक दस्तावेज जैसे 10वीं/12वीं/स्नातक अंकतालिका, पासपोर्ट साइज़ फोटो, हस्ताक्षर (Signature), आईडी प्रूफ (Aadhaar Card) और जाति/निवास प्रमाण पत्र को अपने पास तैयार रखें।`,
                        `ऑनलाइन आवेदन फॉर्म में अपना नाम, माता-पिता का नाम, जन्मतिथि, शैक्षणिक योग्यता और अन्य सभी व्यक्तिगत विवरण बिल्कुल सही-सही भरें।`,
                        `फॉर्म सबमिट करने से पहले एक बार 'Preview' विकल्प की सहायता से अपने द्वारा भरी गई सभी प्रविष्टियों की अच्छी तरह जांच कर लें ताकि भविष्य में किसी त्रुटि की संभावना न रहे।`,
                        `अपनी श्रेणी (General/OBC/SC/ST/EWS) के अनुसार निर्धारित परीक्षा शुल्क (Examination Fee) का भुगतान ऑनलाइन नेट बैंकिंग, डेबिट कार्ड, क्रेडिट कार्ड या UPI के माध्यम से सुरक्षित रूप से करें।`,
                        `अंतिम रूप से फॉर्म सबमिट होने के बाद अपने आवेदन पत्र का फाइनल प्रिंटआउट (Confirmation Page) अवश्य डाउनलोड कर लें और सुरक्षित रख लें।`
                      ];

                  return (
                    <table className="sr-table">
                      <thead>
                        <tr>
                          <th className="sr-table-head-maroon">How to Fill Online Application Form</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <ul>
                              {steps.map((step, idx) => (
                                <li key={idx}>
                                  <EditableText
                                    value={step}
                                    onChange={(val) => {
                                      setEditablePost(prev => {
                                        const nextSteps = [...(prev.howToApplySteps && prev.howToApplySteps.length >= 5 ? prev.howToApplySteps : steps)];
                                        nextSteps[idx] = val;
                                        return { ...prev, howToApplySteps: nextSteps };
                                      });
                                    }}
                                    titlePrefix="आवेदन निर्देश (Instruction Step)"
                                  />
                                  {isDirectEditMode && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteApplyStep(idx)}
                                      className="ml-2 text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold"
                                      title="यह निर्देश हटाएं"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                            {isDirectEditMode && (
                              <button
                                type="button"
                                onClick={handleAddApplyStep}
                                className="mt-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                              >
                                <span>+ नया निर्देश पंक्ति जोड़ें (Add Step)</span>
                              </button>
                            )}
                            <div className="font-bold pt-2 border-t border-slate-200 mt-2 text-center label-magenta">
                              Interested Candidates Can Read the Full Notification Before Apply Online
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })()}
              </>
            )}

            {/* Post Mid Ad Unit (Directly Above Useful Important Links Table) */}
            <AdBanner placement="postMid" onOpenTool={onOpenPhotoResizer} />

            {/* Some Useful Important Links Table */}
            <div className="overflow-x-auto">
              {isAdmin && (
                <div className="bg-slate-100 border border-b-0 border-black px-3.5 py-2 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-700">एडमिन टूल्स (Important Links Controls):</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setPdfUploadTargetIndex(null);
                        if (pdfFileInputRef.current) {
                          pdfFileInputRef.current.value = '';
                          pdfFileInputRef.current.click();
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                      title="डिवाइस से नई PDF फ़ाइल अपलोड करें"
                    >
                      <span className="text-xs">+ 📄</span>
                      <span>PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddDirectLink}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                      title="नया लिंक जोड़ें"
                    >
                      <span className="text-xs">+ 🔗</span>
                      <span>लिंक</span>
                    </button>

                    {renderSectionControls('sec_important_links', 'Important Links')}
                  </div>
                </div>
              )}

              <table className="sr-table">
                <thead>
                  <tr>
                    <th colSpan={2} className="sr-table-head-green">
                      Some Useful Important Links
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(editablePost.directLinks || [])
                    .filter(l => 
                      !l.label?.toLowerCase().includes('whatsapp') && 
                      !l.label?.toLowerCase().includes('telegram') && 
                      !l.url?.toLowerCase().includes('whatsapp') && 
                      !l.url?.toLowerCase().includes('t.me')
                    )
                    .map((link, idx) => {
                      const isPdf = Boolean(
                        link.isPdf ||
                        link.type === 'notification' ||
                        link.type === 'syllabus' ||
                        link.label.toLowerCase().includes('pdf') ||
                        link.actionText?.toLowerCase().includes('pdf') ||
                        (link.url && (
                          link.url.toLowerCase().endsWith('.pdf') ||
                          link.url.toLowerCase().includes('.pdf?') ||
                          link.url.startsWith('data:application/pdf')
                        ))
                      );

                      return (
                        <tr key={idx}>
                          <td className="center-cell label-magenta" style={{ width: '50%' }}>
                            <EditableText
                              value={link.label}
                              onChange={(newVal) => {
                                setEditablePost(prev => {
                                  const list = [...(prev.directLinks || [])];
                                  list[idx] = { ...list[idx], label: newVal };
                                  return { ...prev, directLinks: list };
                                });
                              }}
                              titlePrefix="लिंक का नाम"
                            />
                          </td>
                          <td className="center-cell" style={{ width: '50%' }}>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              <a
                                href={link.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={isPdf ? (link.fileName || `${(link.label || 'file').replace(/\s+/g, '_')}.pdf`) : undefined}
                                className="sr-link-blue"
                              >
                                {link.actionText || 'Click Here'}
                              </a>

                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleAttachPdfToLink(idx)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-[11px] px-2 py-0.5 rounded cursor-pointer inline-flex items-center gap-1 shadow-2xs transition-colors"
                                  title="इस पंक्ति के लिए PDF फ़ाइल चुनें/अपलोड करें"
                                >
                                  <FileText className="w-3 h-3 text-slate-500" />
                                  <span>PDF</span>
                                </button>
                              )}

                              {isDirectEditMode && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveUpDirectLink(idx)}
                                    disabled={idx === 0}
                                    className="text-xs text-slate-600 hover:bg-slate-200 p-1 rounded cursor-pointer disabled:opacity-30"
                                    title="ऊपर करें"
                                  >
                                    ⬆️
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveDownDirectLink(idx)}
                                    disabled={idx === (editablePost.directLinks || []).length - 1}
                                    className="text-xs text-slate-600 hover:bg-slate-200 p-1 rounded cursor-pointer disabled:opacity-30"
                                    title="नीचे करें"
                                  >
                                    ⬇️
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newUrl = prompt('लिंक का URL दर्ज करें (Enter URL):', link.url || 'https://');
                                      if (newUrl !== null) {
                                        setEditablePost(prev => {
                                          const list = [...(prev.directLinks || [])];
                                          list[idx] = { ...list[idx], url: newUrl.trim() };
                                          return { ...prev, directLinks: list };
                                        });
                                      }
                                    }}
                                    className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                                    title="URL बदलें"
                                  >
                                    🔗
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDirectLink(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs px-1 hover:bg-red-50 rounded cursor-pointer font-bold"
                                    title="हटाएं"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Join WhatsApp & Telegram Channel Section */}
            {/* Join WhatsApp & Telegram Channel Section */}
            <div className="border border-slate-300 bg-white rounded-xs overflow-hidden text-[10pt] shadow-2xs my-4 font-sans">
              <div className="text-white px-4 py-2.5 text-[11pt] font-extrabold uppercase tracking-wide" style={{ backgroundColor: '#008000' }}>
                <span>Join Official Channels</span>
              </div>
              <div className="divide-y divide-slate-200 text-[10pt]">
                {/* Join WhatsApp Channel */}
                <div className="flex flex-row items-center justify-between p-3 sm:p-3.5 hover:bg-slate-50 gap-2 sm:gap-4 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-bold text-slate-800 text-[10.5pt]">
                      Join WhatsApp Channel
                    </span>
                  </div>
                  <a
                    href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-3 py-1 text-white font-bold text-[10pt] bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs cursor-pointer transition-colors"
                  >
                    <span>Click Here</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Join Telegram Channel */}
                <div className="flex flex-row items-center justify-between p-3 sm:p-3.5 hover:bg-slate-50 gap-2 sm:gap-4 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-bold text-slate-800 text-[10.5pt]">
                      Join Telegram Channel
                    </span>
                  </div>
                  <a
                    href="https://t.me/newsarkariresultt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-3 py-1 text-white font-bold text-[10pt] bg-[#229ED9] hover:bg-sky-600 rounded-md shadow-2xs cursor-pointer transition-colors"
                  >
                    <span>Click Here</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions (FAQ) Section - Placed JUST BELOW Important Links */}
            {faqs.length > 0 && (
              !hiddenSections['sec_faqs'] ? (
                <div className="border border-slate-300 bg-white rounded-xl overflow-hidden text-[10pt] shadow-2xs my-4 font-sans">
                  <div className="bg-white text-slate-900 px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-black text-[11pt] sm:text-[12pt] font-sans">
                      <span style={{ color: '#008000' }}>{editablePost.shortTitle || editablePost.title} </span>
                      <span style={{ color: '#ff00ff' }}>Frequently Asked Questions (FAQs)</span>
                    </h3>
                    {renderSectionControls('sec_faqs', 'FAQs')}
                  </div>
                  <div className="p-3.5 sm:p-5 divide-y divide-slate-200 space-y-3">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="pt-3 first:pt-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-[10.5pt] leading-snug flex items-start gap-1.5 font-sans flex-1 text-slate-900">
                            <span>Q.{idx + 1} : </span>
                            <div className="flex-1">
                              <EditableText
                                value={faq.question}
                                onChange={(val) => {
                                  setEditablePost(prev => {
                                    const nextFaqs = [...(prev.customFaqs || faqs)];
                                    nextFaqs[idx] = { ...nextFaqs[idx], question: val };
                                    return { ...prev, customFaqs: nextFaqs };
                                  });
                                }}
                                titlePrefix="FAQ प्रश्न (Question)"
                              />
                            </div>
                          </h5>
                          {isDirectEditMode && (
                            <button
                              type="button"
                              onClick={() => handleDeleteFAQ(idx)}
                              className="text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold"
                              title="यह FAQ बताएं"
                            >
                              ✕ हटाएं
                            </button>
                          )}
                        </div>
                        <div className="text-slate-800 text-[10pt] pl-4 sm:pl-6 leading-relaxed font-sans">
                          <span className="text-slate-900 font-bold text-[10pt] mr-1">Ans.</span> 
                          <EditableText
                            as="span"
                            value={faq.answer}
                            onChange={(val) => {
                              setEditablePost(prev => {
                                const nextFaqs = [...(prev.customFaqs || faqs)];
                                nextFaqs[idx] = { ...nextFaqs[idx], answer: val };
                                return { ...prev, customFaqs: nextFaqs };
                              });
                            }}
                            titlePrefix="FAQ उत्तर (Answer)"
                          />
                        </div>
                      </div>
                    ))}
                    {isDirectEditMode && (
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handleAddFAQ}
                          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <span>+ नया FAQ सवाल-जवाब जोड़ें (Add FAQ)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : renderHiddenBanner('sec_faqs', 'FAQs')
            )}

            {/* Post Bottom Ad Unit (Above Candidate Tools & Footer) */}
            <AdBanner placement="postBottom" onOpenTool={onOpenPhotoResizer} />

            {/* 🔥 Trending Viral Search Tags & Keywords Section - Hidden for regular visitors, visible only to Admin in Direct Edit Mode */}
            {isDirectEditMode && (
              !hiddenSections['sec_viral_tags'] ? (
                <div className="border-2 border-amber-300 bg-gradient-to-br from-amber-50/40 via-white to-red-50/30 rounded-xl overflow-hidden shadow-xs my-5 font-sans">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl animate-pulse">🔥</span>
                      <div>
                        <h3 className="font-black text-[12pt] sm:text-[13pt] tracking-wide uppercase flex items-center gap-1.5 text-white">
                          <span>Viral Tags & Search Keywords</span>
                          <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded shadow-2xs ml-1.5 uppercase">
                            Admin Only (Hidden from Users)
                          </span>
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-red-100 font-medium">
                          Active in background meta keywords and Schema.org for Google Search SEO, but hidden from visitors.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-2xs">
                        {viralTags.length} Viral Tags
                      </span>
                      {renderSectionControls('sec_viral_tags', 'Viral Tags')}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Informational Subtext */}
                    <div className="flex items-start gap-2 text-xs text-slate-700 bg-white/90 p-3 rounded-lg border border-slate-200">
                      <span className="text-red-600 font-bold text-sm shrink-0">💡</span>
                      <p className="leading-relaxed">
                        ये वायरल टैग्स बैकग्राउंड में <strong>Google Search Keywords</strong>, <strong>Meta SEO</strong>, और <strong>Schema.org Rich Snippets</strong> के लिए पूर्णतः सक्रिय हैं। सामान्य उपयोगकर्ताओं को यह पैनल दिखाई नहीं देगा।
                      </p>
                    </div>

                    {/* Viral Tags Pills Cloud */}
                    <div className="flex flex-wrap items-center gap-2">
                      {viralTags.map((tag) => {
                        const isJustCopied = copiedTag === tag;
                        return (
                          <div key={tag} className="inline-flex items-center">
                            <button
                              type="button"
                              onClick={() => handleCopyTag(tag)}
                              title="Click to copy this viral tag"
                              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
                                isJustCopied
                                  ? 'bg-emerald-600 text-white border-emerald-700 scale-105'
                                  : 'bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border-slate-300 hover:border-red-400'
                              }`}
                            >
                              <Hash className={`w-3.5 h-3.5 ${isJustCopied ? 'text-white' : 'text-red-600 group-hover:scale-110 transition-transform'}`} />
                              <span>{tag.replace(/^#/, '')}</span>
                              {isJustCopied ? (
                                <Check className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400 group-hover:text-red-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                            {isDirectEditMode && (
                              <button
                                type="button"
                                onClick={() => {
                                  const current = editablePost.viralTags && editablePost.viralTags.length > 0 ? editablePost.viralTags : viralTags;
                                  setEditablePost(prev => ({
                                    ...prev,
                                    viralTags: current.filter(t => t !== tag)
                                  }));
                                }}
                                className="ml-1 text-red-500 hover:text-red-700 font-black text-xs px-1 cursor-pointer"
                                title="हटाएं (Remove tag)"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyAllTags}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer shadow-sm ${
                            isCopiedAll 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          {isCopiedAll ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-200" />
                              <span>Copied All Tags! (सभी टैग्स कॉपी हो गए)</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>📋 Copy All Tags (सभी टैग्स कॉपी करें)</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleShareWhatsApp}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Share on WhatsApp with Tags</span>
                        </button>

                        <a
                          href="https://t.me/newsarkariresultt"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#229ED9] hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 fill-current" />
                          <span>Join Telegram Channel</span>
                        </a>
                      </div>

                      {copiedTag && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 flex items-center gap-1 animate-pulse">
                          <Check className="w-3.5 h-3.5" />
                          "{copiedTag}" क्लिपबोर्ड में कॉपी हो गया!
                        </span>
                      )}
                    </div>

                    {/* Direct Admin Edit Tag Controls */}
                    <div className="mt-3 p-3 bg-red-50/70 border border-red-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-red-900 flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 text-red-700" />
                          <span>Admin Tag Editor (कस्टम टैग्स जोड़ें / बदलें)</span>
                        </span>
                        {editablePost.viralTags && editablePost.viralTags.length > 0 && (
                          <button
                            type="button"
                            onClick={handleResetViralTags}
                            className="text-[11px] font-bold text-slate-600 hover:text-red-700 underline cursor-pointer"
                          >
                            Reset to Auto-Generated Tags
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">#</span>
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomTag();
                              }
                            }}
                            placeholder="नया वायरल टैग लिखें (e.g. PoliceCutOff2026)"
                            className="w-full pl-6 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-semibold focus:outline-none focus:border-red-600"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCustomTag}
                          className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold cursor-pointer"
                        >
                          + Add Tag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : renderHiddenBanner('sec_viral_tags', 'Viral Tags')
            )}

            {/* 1. Latest Jobs Section (Vertical Stack) */}
            <div className="border border-slate-300 bg-white rounded-xs overflow-hidden shadow-2xs font-sans">
              <div className="text-white px-4 sm:px-5 py-3 text-[14px] sm:text-[16px] font-black uppercase tracking-wide flex items-center justify-between" style={{ backgroundColor: '#008000' }}>
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
              <div className="text-white px-4 sm:px-5 py-3 text-[14px] sm:text-[16px] font-black uppercase tracking-wide flex items-center justify-between" style={{ backgroundColor: '#008000' }}>
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


      {/* Hidden PDF File Input */}
      <input
        type="file"
        ref={pdfFileInputRef}
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handlePdfFileChange}
      />

      {/* Add / Attach PDF Dialog Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-300 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-rose-700 text-white">
              <div className="flex items-center gap-2 font-black text-sm">
                <FileText className="w-4 h-4" />
                <span>
                  {pdfUploadTargetIndex !== null ? 'मौजूदा लिंक के लिए PDF अपलोड करें' : 'नया PDF डॉक्यूमेंट जोड़ें'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="text-white hover:bg-rose-800 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 space-y-1">
                <p className="font-bold">📄 PDF फाइल अपलोड निर्देश:</p>
                <p>कंप्यूटर या मोबाइल से कोई भी आधिकारिक PDF (नोटिफिकेशन, सिलेबस, रिजल्ट, फॉर्म) चुनें। यह तुरंत लिंक के साथ अटैच होकर डाउनलोड करने योग्य बन जाएगी।</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  PDF फ़ाइल चुनें (.pdf)
                </label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handlePdfFileChange}
                  className="block w-full text-xs text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-rose-600 file:text-white hover:file:bg-rose-700 cursor-pointer border border-slate-300 rounded p-1 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-3 py-1.5 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-300 cursor-pointer"
                >
                  रद्द करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
