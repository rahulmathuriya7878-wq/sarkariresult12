import React, { useEffect, useMemo, useState } from 'react';
import { SarkariPost, DirectLinkItem } from '../types/job';
import { getProcessedImportantDates } from '../utils/dateUtils';

export const getProcessedDirectLinks = (post: SarkariPost): DirectLinkItem[] => {
  let existing: DirectLinkItem[] = post.directLinks && post.directLinks.length > 0 
    ? post.directLinks.map(l => ({ ...l })) 
    : [];
  
  // Filter out any WhatsApp or Telegram channel links
  existing = existing.filter(l => 
    !l.label?.toLowerCase().includes('whatsapp') && 
    !l.label?.toLowerCase().includes('telegram') && 
    !l.url?.toLowerCase().includes('whatsapp') && 
    !l.url?.toLowerCase().includes('t.me')
  );

  if (existing.length === 0) {
    if (post.category === 'result') {
      existing.push({ label: 'Download Result / Score Card', actionText: 'Click Here', type: 'result', url: 'https://sarkariresult.com' });
    } else if (post.category === 'admit_card') {
      existing.push({ label: 'Download Admit Card / Hall Ticket', actionText: 'Click Here', type: 'admit_card', url: 'https://sarkariresult.com' });
    } else if (post.category === 'answer_key') {
      existing.push({ label: 'Download Answer Key & Solution Paper', actionText: 'Click Here', type: 'answer_key', url: 'https://sarkariresult.com' });
    } else {
      existing.push({ label: 'Apply Online', actionText: 'Click Here', type: 'apply', url: 'https://sarkariresult.com', isPrimary: true });
    }
    existing.push({ label: 'Download Notification', actionText: 'Click Here', type: 'notification', url: 'https://sarkariresult.com' });
    existing.push({ label: `${post.department || 'Official'} Website`, actionText: 'Click Here', type: 'official', url: 'https://sarkariresult.com' });
  }

  return existing;
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
  onOpenDirectEditor,
  onUpdatePost,
  onDeletePost,
  isGlobalWordEditActive = false,
  onToggleGlobalWordEdit
}) => {
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
  const [isDirectEditMode, setIsDirectEditMode] = useState<boolean>(() => isGlobalWordEditActive);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sync edit mode when global edit mode changes
  useEffect(() => {
    if (isGlobalWordEditActive !== undefined) {
      setIsDirectEditMode(isGlobalWordEditActive);
    }
  }, [isGlobalWordEditActive]);

  useEffect(() => {
    const processedDates = getProcessedImportantDates(post);
    const processedLinks = getProcessedDirectLinks(post);
    setEditablePost({
      ...post,
      importantDates: post.importantDates && post.importantDates.length > 0 ? post.importantDates : processedDates,
      directLinks: processedLinks,
      customFaqs: post.customFaqs && post.customFaqs.length > 0 ? post.customFaqs : getPostFAQs(post)
    });
    setHasUnsavedChanges(false);
  }, [post]);

  const faqs = useMemo(() => {
    if (editablePost.customFaqs && editablePost.customFaqs.length > 0) {
      return editablePost.customFaqs;
    }
    return getPostFAQs(editablePost);
  }, [editablePost]);

  const [isAlertActive, setIsAlertActive] = React.useState<boolean>(() => isPostAlertActive(post.id));
  const [isAlertModalOpen, setIsAlertModalOpen] = React.useState<boolean>(false);
  const [alertFeedback, setAlertFeedback] = React.useState<string | null>(null);
  const [hiddenSections, setHiddenSections] = React.useState<Record<string, boolean>>({});

  const isAdmin = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('sarkari_admin_auth') === 'true';
  }, []);

  // Save all in-place word & section updates
  const handleSaveAllChanges = () => {
    if (onUpdatePost) {
      onUpdatePost(editablePost);
    }
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
    setHasUnsavedChanges(false);
  };

  // Real-time automatic persistence: whenever editablePost updates during edit mode, auto-save to localStorage
  const hasLoadedRef = React.useRef(false);
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      return;
    }
    if (isDirectEditMode) {
      if (onUpdatePost) {
        onUpdatePost(editablePost);
      }
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
    }
  }, [editablePost, isDirectEditMode, onUpdatePost]);

  // Reusable Word-by-Word In-Place Editable Component
  const EditableText: React.FC<{
    value: string | number | undefined;
    onChange: (newVal: string) => void;
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
    if (!isDirectEditMode) {
      return (
        <Tag className={className} style={style}>
          {strVal || placeholder}
        </Tag>
      );
    }

    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        style={style}
        onBlur={(e) => {
          const updated = e.currentTarget.innerText.trim();
          if (updated !== strVal) {
            onChange(updated);
            setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
  };

  const handleDeleteDateItem = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      importantDates: prev.importantDates.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddFeeItem = () => {
    setEditablePost(prev => ({
      ...prev,
      applicationFee: [...(prev.applicationFee || []), { category: 'General / OBC / EWS', amount: '₹ 100/-' }]
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteFeeItem = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      applicationFee: prev.applicationFee.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
  };

  const handleDeleteVacancyRow = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      vacancyBreakdown: prev.vacancyBreakdown.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddSelectionStage = () => {
    setEditablePost(prev => ({
      ...prev,
      selectionProcess: [...(prev.selectionProcess || []), 'Computer Based Examination / Interview Stage']
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteSelectionStage = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      selectionProcess: (prev.selectionProcess || []).filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddApplyStep = () => {
    setEditablePost(prev => ({
      ...prev,
      howToApplySteps: [...(prev.howToApplySteps || []), 'Candidate must read notification thoroughly before applying.']
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteApplyStep = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      howToApplySteps: prev.howToApplySteps.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
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
          url: 'https://sarkariresult.com'
        }
      ]
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteDirectLink = (index: number) => {
    setEditablePost(prev => ({
      ...prev,
      directLinks: prev.directLinks.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
    
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
    setHasUnsavedChanges(true);
    
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

  // Delete Entire Post Handler for Word Editor
  const handleDeleteCurrentPost = () => {
    const postTitle = post.title || post.shortTitle;
    if (confirm(`⚠️ क्या आप वाकई पूरी पोस्ट "${postTitle}" को डिलीट (Delete) करना चाहते हैं?\n\nयह पोस्ट वेबसाइट से पूरी तरह हट जाएगी।`)) {
      if (onDeletePost) {
        onDeletePost(post.id);
      }
      try {
        const saved = localStorage.getItem('sarkari_admin_posts_v5');
        if (saved) {
          const parsed: SarkariPost[] = JSON.parse(saved);
          const filtered = parsed.filter(p => p.id !== post.id);
          localStorage.setItem('sarkari_admin_posts_v5', JSON.stringify(filtered));
          window.dispatchEvent(new CustomEvent('sarkari_posts_updated', { detail: filtered }));
        }
      } catch (e) {
        console.error(e);
      }
      onBack();
    }
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
    setHasUnsavedChanges(true);
  };

  const handleDeleteFAQ = (index: number) => {
    setEditablePost(prev => {
      const currentList = prev.customFaqs || faqs || [];
      return {
        ...prev,
        customFaqs: currentList.filter((_, i) => i !== index)
      };
    });
    setHasUnsavedChanges(true);
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

        {/* Direct In-Place Click-to-Edit Mode Control Bar (Hidden by default, only shown when active) */}
        {isDirectEditMode && (
          <div className="mb-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-3.5 py-2.5 rounded shadow-xs border border-amber-600 flex flex-wrap items-center justify-between gap-2 font-sans animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="bg-slate-950 text-amber-300 font-extrabold text-xs px-2.5 py-1 rounded flex items-center gap-1.5 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                वर्ड एडिट चालू है (LIVE)
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-950">
                ⚡ पोस्ट के किसी भी शब्द, हेडिंग, तारीख, फीस या पद पर क्लिक करके सीधे टाइप करें!
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Word Editor Delete Post Option */}
              <button
                type="button"
                onClick={handleDeleteCurrentPost}
                className="bg-red-700 hover:bg-red-800 text-white font-black text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-red-900"
                title="इस पूरी पोस्ट को हटाएं (Delete Post)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>🗑️ पोस्ट Delete करें</span>
              </button>

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
                      <EditableText
                        as="h1"
                        value={editablePost.title}
                        onChange={(val) => setEditablePost(prev => ({ ...prev, title: val }))}
                        className="text-[#ff0000] font-black text-[16pt] leading-snug tracking-tight font-serif"
                        titlePrefix="पोस्ट का शीर्षक (Title)"
                      />
                    </td>
                  </tr>

                  {/* Row 2: Post Date / Update */}
                  <tr className="border-b border-slate-200">
                    <td className="p-3 sm:p-4 text-[#ff0000] font-bold text-[14pt] align-top border-r border-slate-200 w-28 sm:w-56 shrink-0 leading-tight">
                      Post Date / Update :
                    </td>
                    <td className="p-3 sm:p-4 text-slate-900 font-semibold text-[12pt] align-top">
                      <EditableText
                        value={editablePost.postDate}
                        onChange={(val) => setEditablePost(prev => ({ ...prev, postDate: val }))}
                        className="text-slate-900 font-semibold text-[12pt]"
                        titlePrefix="पोस्ट की तिथि (Post Date)"
                      />
                      <span className="ml-1 text-slate-600 font-normal">| 08:40 PM</span>
                    </td>
                  </tr>

                  {/* Row 3: Short Information */}
                  <tr>
                    <td className="p-3 sm:p-4 text-[#ff0000] font-bold text-[14pt] align-top border-r border-slate-200 w-28 sm:w-56 shrink-0 leading-tight">
                      Short Information :
                    </td>
                    <td className="p-3 sm:p-4 text-slate-800 text-[12pt] leading-relaxed align-top">
                      {isDirectEditMode ? (
                        <EditableText
                          as="div"
                          value={editablePost.shortInfo}
                          onChange={(val) => setEditablePost(prev => ({ ...prev, shortInfo: val }))}
                          className="text-slate-900 text-[12pt] leading-relaxed font-sans"
                          titlePrefix="संक्षिप्त जानकारी (Short Info)"
                        />
                      ) : (
                        <div className="text-slate-900 text-[12pt] leading-relaxed font-sans">
                          {renderFormattedShortInfo(editablePost.shortInfo)}
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
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
                          {(editablePost.importantDates || []).map((d, idx) => (
                            <li key={idx} className="leading-snug flex items-center justify-between gap-2">
                              <div>
                                <span className="text-slate-800 font-medium">• </span>
                                <EditableText
                                  value={d.label}
                                  onChange={(val) => {
                                    setEditablePost(prev => {
                                      const nextDates = [...prev.importantDates];
                                      nextDates[idx] = { ...nextDates[idx], label: val };
                                      return { ...prev, importantDates: nextDates };
                                    });
                                  }}
                                  className="text-slate-800 font-medium"
                                  titlePrefix="तारीख का नाम (Date Label)"
                                />
                                <span className="text-slate-800 font-medium"> : </span>
                                <EditableText
                                  value={d.value}
                                  onChange={(val) => {
                                    setEditablePost(prev => {
                                      const nextDates = [...prev.importantDates];
                                      nextDates[idx] = { ...nextDates[idx], value: val };
                                      return { ...prev, importantDates: nextDates };
                                    });
                                  }}
                                  className={d.isHighlight ? 'text-[#ff0000] font-bold' : 'text-slate-900 font-bold'}
                                  titlePrefix="तारीख (Date Value)"
                                />
                              </div>
                              {isDirectEditMode && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDateItem(idx)}
                                  className="text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold"
                                  title="यह तारीख हटाएं"
                                >
                                  ✕ हटाएं
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                        {isDirectEditMode && (
                          <button
                            type="button"
                            onClick={handleAddDateItem}
                            className="mt-2.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ नई तारीख जोड़ें (Add Date)</span>
                          </button>
                        )}
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
                          {editablePost.applicationFee && editablePost.applicationFee.length > 0 ? (
                            editablePost.applicationFee.map((fee, idx) => (
                              <li key={idx} className="leading-snug flex items-center justify-between gap-2">
                                <div>
                                  <span className="text-slate-800 font-medium">• </span>
                                  <EditableText
                                    value={fee.category}
                                    onChange={(val) => {
                                      setEditablePost(prev => {
                                        const nextFees = [...prev.applicationFee];
                                        nextFees[idx] = { ...nextFees[idx], category: val };
                                        return { ...prev, applicationFee: nextFees };
                                      });
                                    }}
                                    className="text-slate-800 font-medium"
                                    titlePrefix="शुल्क श्रेणी (Category)"
                                  />
                                  <span className="text-slate-800 font-medium"> : </span>
                                  <EditableText
                                    value={fee.amount}
                                    onChange={(val) => {
                                      setEditablePost(prev => {
                                        const nextFees = [...prev.applicationFee];
                                        nextFees[idx] = { ...nextFees[idx], amount: val };
                                        return { ...prev, applicationFee: nextFees };
                                      });
                                    }}
                                    className="text-slate-900 font-bold"
                                    titlePrefix="शुल्क राशि (Amount)"
                                  />
                                </div>
                                {isDirectEditMode && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFeeItem(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold"
                                    title="यह फीस हटाएं"
                                  >
                                    ✕ हटाएं
                                  </button>
                                )}
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-600 italic leading-snug">• No Application Fee</li>
                          )}
                          <li className="leading-snug text-slate-700 pt-1.5 border-t border-slate-100 mt-2">
                            • Pay the Examination Fee Through Debit Card, Credit Card, Net Banking or UPI Mode Only.
                          </li>
                        </ul>
                        {isDirectEditMode && (
                          <button
                            type="button"
                            onClick={handleAddFeeItem}
                            className="mt-2.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ नई फीस श्रेणी जोड़ें (Add Fee)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : renderHiddenBanner('sec_dates_fee', 'Important Dates & Fee')}

                {/* Age Limit Box */}
                {!isServiceOrScheme && editablePost.ageLimit.asOnDate && (
                  !hiddenSections['sec_age_limit'] ? (
                    <div className="border border-slate-400 bg-white p-4 sm:p-6 text-[11.5pt] space-y-3 shadow-2xs text-center">
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2.5">
                        <h3 className="font-black text-[14pt] sm:text-[16pt] font-sans">
                          <span style={{ color: '#008000' }}>{editablePost.shortTitle} Notification 2026 : </span>
                          <span style={{ color: '#ff00ff' }}>
                            Age Limit as on{' '}
                            <EditableText
                              value={editablePost.ageLimit.asOnDate}
                              onChange={(val) => setEditablePost(prev => ({ ...prev, ageLimit: { ...prev.ageLimit, asOnDate: val } }))}
                              titlePrefix="आयु गणना तिथि (As On Date)"
                            />
                          </span>
                        </h3>
                        {renderSectionControls('sec_age_limit', 'Age Limit Box')}
                      </div>
                      <ul className="space-y-2 text-slate-800 pt-1 leading-relaxed text-[11.5pt] text-left max-w-2xl mx-auto">
                        <li>
                          • Minimum Age :{' '}
                          <strong className="font-bold text-slate-900">
                            <EditableText
                              value={editablePost.ageLimit.minAge}
                              onChange={(val) => setEditablePost(prev => ({ ...prev, ageLimit: { ...prev.ageLimit, minAge: Number(val) || undefined } }))}
                              titlePrefix="न्यूनतम आयु (Min Age)"
                            />
                            {' '}Years.
                          </strong>
                        </li>
                        <li>
                          • Maximum Age :{' '}
                          <strong className="font-bold text-slate-900">
                            <EditableText
                              value={editablePost.ageLimit.maxAge}
                              onChange={(val) => setEditablePost(prev => ({ ...prev, ageLimit: { ...prev.ageLimit, maxAge: Number(val) || undefined } }))}
                              titlePrefix="अधिकतम आयु (Max Age)"
                            />
                            {' '}Years.
                          </strong>
                        </li>
                        <li className="text-slate-700">
                          •{' '}
                          <EditableText
                            value={editablePost.ageLimit.notes || `Age Relaxation Extra as per ${editablePost.department} ${editablePost.shortTitle} Recruitment Rules.`}
                            onChange={(val) => setEditablePost(prev => ({ ...prev, ageLimit: { ...prev.ageLimit, notes: val } }))}
                            titlePrefix="आयु छूट नियम (Age Relaxation Notes)"
                          />
                        </li>
                      </ul>
                    </div>
                  ) : renderHiddenBanner('sec_age_limit', 'Age Limit Box')
                )}


                {/* Vacancy Details Table */}
                {editablePost.vacancyBreakdown && editablePost.vacancyBreakdown.length > 0 && (
                  <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
                    <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[15pt] font-black uppercase tracking-wide text-center" style={{ backgroundColor: '#008000' }}>
                      <span className="text-white">{editablePost.shortTitle} Recruitment 2026 : Vacancy Details Total </span>
                      <span className="text-yellow-200">
                        <EditableText
                          value={editablePost.totalVacancies}
                          onChange={(val) => setEditablePost(prev => ({ ...prev, totalVacancies: val }))}
                          titlePrefix="कुल पद (Total Vacancies)"
                        />
                        {' '}Post
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-black text-[12pt] sm:text-[13pt]">
                            <th className="p-3 sm:p-3.5 border-r border-slate-400 w-1/4" style={{ color: '#ff00ff' }}>Post Name</th>
                            <th className="p-3 sm:p-3.5 border-r border-slate-400 w-1/6 text-center" style={{ color: '#008000' }}>Total Post</th>
                            <th className="p-3 sm:p-3.5" style={{ color: '#008000' }}>{editablePost.shortTitle} Eligibility Criteria</th>
                            {isDirectEditMode && <th className="p-3 text-center text-red-600">Action</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300 text-[11.5pt]">
                          {editablePost.vacancyBreakdown.map((v, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3 sm:p-3.5 align-top font-bold text-blue-900 border-r border-slate-400">
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
                              <td className="p-3 sm:p-3.5 align-top text-center font-bold text-slate-900 border-r border-slate-400">
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
                              <td className="p-3 sm:p-3.5 align-top text-slate-800 leading-relaxed whitespace-pre-line font-sans">
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
                              {isDirectEditMode && (
                                <td className="p-3 text-center align-top border-l border-slate-300">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVacancyRow(idx)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs px-2 py-1 rounded cursor-pointer"
                                    title="यह पद हटाएं"
                                  >
                                    ✕ हटाएं
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {isDirectEditMode && (
                      <div className="p-3 bg-slate-50 border-t border-slate-300 flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddVacancyRow}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <span>+ नया पद पंक्ति जोड़ें (Add Vacancy Row)</span>
                        </button>
                      </div>
                    )}
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
                {editablePost.selectionProcess && editablePost.selectionProcess.length > 0 && (
                  !hiddenSections['sec_selection_process'] ? (
                    <div className="border border-slate-400 bg-white p-4 sm:p-6 text-[11.5pt] space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2.5">
                        <h4 
                          className="font-black text-[14pt] sm:text-[16pt] font-sans"
                          style={{ color: '#008000' }}
                        >
                          {editablePost.shortTitle} Selection Process / Mode of Selection
                        </h4>
                        {renderSectionControls('sec_selection_process', 'Selection Process')}
                      </div>
                      <div className="pt-1">
                        <p className="text-slate-800 mb-3 leading-relaxed font-sans text-[11.5pt]">
                          The recruitment board will select eligible candidates through the following sequential stages:
                        </p>
                        <ol className="space-y-2.5 text-slate-900 font-medium text-[11.5pt]">
                          {editablePost.selectionProcess.map((step, idx) => (
                            <li key={idx} className="flex items-start justify-between gap-2.5 bg-slate-50/80 p-3 rounded border border-slate-200">
                              <div className="flex items-start gap-2.5 flex-1">
                                <span className="font-bold text-white text-[11pt] px-2.5 py-0.5 rounded shrink-0 mt-0.5" style={{ backgroundColor: '#008000' }}>Stage {idx + 1}</span>
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
                            className="mt-3 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ नया चयन स्टेज जोड़ें (Add Stage)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : renderHiddenBanner('sec_selection_process', 'Selection Process')
                )}

                {/* How to Fill Form Section */}
                {editablePost.howToApplySteps && editablePost.howToApplySteps.length > 0 && (
                  <div className="border border-slate-400 bg-white p-4 sm:p-6 text-[11.5pt] space-y-3 shadow-2xs">
                    <h4 className="font-black text-[14pt] sm:text-[16pt] border-b border-slate-200 pb-2.5 font-sans">
                      <span style={{ color: '#008000' }}>How to Fill </span>
                      <span style={{ color: '#ff00ff' }}>{editablePost.shortTitle} Recruitment Online Form 2026</span>
                    </h4>
                    <ul className="space-y-2.5 text-slate-800 pt-1 leading-relaxed text-[11.5pt]">
                      {editablePost.howToApplySteps.map((step, idx) => (
                        <li key={idx} className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span>• </span>
                            <EditableText
                              value={step}
                              onChange={(val) => {
                                setEditablePost(prev => {
                                  const nextSteps = [...prev.howToApplySteps];
                                  nextSteps[idx] = val;
                                  return { ...prev, howToApplySteps: nextSteps };
                                });
                              }}
                              titlePrefix="आवेदन निर्देश (Instruction Step)"
                            />
                          </div>
                          {isDirectEditMode && (
                            <button
                              type="button"
                              onClick={() => handleDeleteApplyStep(idx)}
                              className="text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold"
                              title="यह निर्देश हटाएं"
                            >
                              ✕
                            </button>
                          )}
                        </li>
                      ))}
                      {isDirectEditMode && (
                        <li>
                          <button
                            type="button"
                            onClick={handleAddApplyStep}
                            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ नया निर्देश पंक्ति जोड़ें (Add Step)</span>
                          </button>
                        </li>
                      )}
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
              <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[16pt] font-black uppercase tracking-wide flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: '#008000' }}>
                <span>Some Useful Important Links</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-yellow-400 text-slate-950 font-bold px-2 py-0.5 rounded shadow-2xs">
                    {(editablePost.directLinks || []).length} लिंक्स
                  </span>
                  {isDirectEditMode && (
                    <button
                      type="button"
                      onClick={handleAddDirectLink}
                      className="text-xs bg-white text-emerald-900 hover:bg-emerald-100 font-black px-2.5 py-1 rounded shadow-2xs cursor-pointer flex items-center gap-1"
                      title="नया महत्वपूर्ण लिंक जोड़ें"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ नया लिंक जोड़ें</span>
                    </button>
                  )}
                </div>
              </div>

              {/* User Guide Banner for Moving Links (Only visible in Edit Mode) */}
              {isDirectEditMode && (
                <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-amber-950 gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="text-base">💡</span>
                    <span><strong>लिंक रीऑर्डर विकल्प:</strong> किसी भी लिंक को नीचे करने के लिए <strong>"⬇️ नीचे करें"</strong> बटन पर क्लिक करें।</span>
                  </span>
                  <span className="text-emerald-700 font-extrabold text-[11px]">
                    ✏️ वर्ड एडिटर चालू: लिंक नाम व URL पर क्लिक करके सीधे टाइप करें
                  </span>
                </div>
              )}

              <div className="divide-y divide-slate-300 text-[11.5pt]">
                {(editablePost.directLinks || []).map((link, idx) => {
                  const isWhatsapp = link.label.toLowerCase().includes('whatsapp') || (link.url && link.url.includes('whatsapp'));
                  const isTelegram = link.label.toLowerCase().includes('telegram') || (link.url && link.url.includes('t.me'));
                  const btnBg = isWhatsapp 
                    ? 'bg-[#25D366] hover:bg-emerald-600' 
                    : isTelegram 
                      ? 'bg-[#229ED9] hover:bg-sky-600' 
                      : 'bg-[#0000ff] hover:bg-blue-800';

                  const isLastLink = idx === (editablePost.directLinks || []).length - 1;
                  const isFirstLink = idx === 0;

                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 gap-2.5 sm:gap-4 transition-colors ${
                        link.isPrimary ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      {/* Left: Link Label */}
                      <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                        <span className="font-black text-slate-700 text-lg leading-none shrink-0 mt-0.5 sm:mt-0">•</span>
                        <div className="flex-1 min-w-0">
                          <EditableText
                            value={link.label}
                            onChange={(newVal) => {
                              setEditablePost(prev => {
                                const list = [...(prev.directLinks || [])];
                                list[idx] = { ...list[idx], label: newVal };
                                return { ...prev, directLinks: list };
                              });
                              setHasUnsavedChanges(true);
                            }}
                            className="font-bold text-[12pt] sm:text-[13pt] break-words block leading-snug cursor-text"
                            style={{ color: '#ff00ff' }}
                            titlePrefix="लिंक का नाम"
                          />
                          {link.url && isDirectEditMode && (
                            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-xs sm:max-w-md mt-0.5">
                              {link.url}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Reorder Controls (Move Down / Move Up) & Action Button */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-center flex-wrap">
                        {/* Option to Move Link Down (नीचे करने का विकल्प - Edit Mode only) */}
                        {isDirectEditMode && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleMoveDownDirectLink(idx)}
                              disabled={isLastLink}
                              className={`text-xs font-black px-2.5 py-1.5 rounded flex items-center gap-1 transition-all border ${
                                isLastLink
                                  ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer'
                              }`}
                              title="इस लिंक को एक स्थान नीचे करें (Move Link Down)"
                            >
                              <span className="text-sm">⬇️</span>
                              <span>नीचे करें</span>
                            </button>

                            {/* Option to Move Link Up (ऊपर करने का विकल्प) */}
                            <button
                              type="button"
                              onClick={() => handleMoveUpDirectLink(idx)}
                              disabled={isFirstLink}
                              className={`text-xs font-bold px-2 py-1.5 rounded flex items-center gap-1 transition-all border ${
                                isFirstLink
                                  ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer'
                              }`}
                              title="इस लिंक को ऊपर करें (Move Link Up)"
                            >
                              <span className="text-sm">⬆️</span>
                              <span className="hidden sm:inline">ऊपर</span>
                            </button>
                          </>
                        )}

                        {/* Click Here Action Button */}
                        <a
                          href={link.url || 'https://sarkariresult.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-white font-bold rounded-xs text-[11pt] sm:text-[11.5pt] shadow-2xs cursor-pointer transition-all hover:scale-102 ${btnBg}`}
                        >
                          <span>{link.actionText || 'Click Here'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Edit Mode Quick URL & Delete buttons */}
                        {isDirectEditMode && (
                          <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
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
                                  setHasUnsavedChanges(true);
                                }
                              }}
                              className="text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-2 py-1 rounded cursor-pointer"
                              title="URL बदलें"
                            >
                              🔗 URL
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDirectLink(idx)}
                              className="text-red-500 hover:text-red-700 text-xs px-1.5 py-1 rounded hover:bg-red-50 cursor-pointer font-bold"
                              title="यह लिंक हटाएं"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>




            {/* Frequently Asked Questions (FAQ) Section - Placed JUST BELOW Important Links */}
            {faqs.length > 0 && (
              !hiddenSections['sec_faqs'] ? (
                <div className="border border-slate-400 bg-white overflow-hidden text-[11.5pt] shadow-2xs">
                  <div className="text-white px-4 py-2.5 text-[14pt] sm:text-[16pt] font-black uppercase tracking-wide flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: '#008000' }}>
                    <span>Frequently Asked Questions (FAQ) – {editablePost.shortTitle}</span>
                    {renderSectionControls('sec_faqs', 'FAQs')}
                  </div>
                  <div className="p-4 sm:p-7 divide-y divide-slate-200 space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="pt-4 first:pt-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h5 
                            className="font-bold text-[13pt] sm:text-[14pt] leading-snug flex items-start gap-1.5 font-sans flex-1"
                            style={{ color: idx % 2 === 0 ? '#ff00ff' : '#008000' }}
                          >
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
                              title="यह FAQ हटाएं"
                            >
                              ✕ हटाएं
                            </button>
                          )}
                        </div>
                        <div className="text-slate-800 text-[11.5pt] pl-4 sm:pl-6 leading-relaxed font-sans">
                          <span className="text-slate-900 font-bold text-[11.5pt] mr-1">Ans.</span> 
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
                          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                        >
                          <span>+ नया FAQ सवाल-जवाब जोड़ें (Add FAQ)</span>
                        </button>
                      </div>
                    )}
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

      {/* Floating Save / Status Bar for Word-by-Word Editing */}
      {(isDirectEditMode || hasUnsavedChanges) && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 text-white border-2 border-amber-400 px-4 py-3 rounded-full shadow-2xl flex items-center gap-3 font-sans backdrop-blur-xs max-w-[95vw] overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="text-xs sm:text-sm font-bold text-amber-300 whitespace-nowrap">
              {hasUnsavedChanges ? '⚠️ बिना सेव किए गए बदलाव हैं!' : '✏️ डायरेक्ट एडिट मोड चालू है'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSaveAllChanges}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-105 shrink-0"
          >
            <span>💾 सेव करें (Save Now)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditablePost(post);
              setHasUnsavedChanges(false);
              setAlertFeedback('परिवर्तन रद्द कर दिए गए हैं (Changes discarded).');
              setTimeout(() => setAlertFeedback(null), 3000);
            }}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs px-3 py-1.5 rounded-full cursor-pointer shrink-0"
          >
            <span>रद्द करें (Cancel)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDirectEditMode(false)}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1 font-semibold cursor-pointer shrink-0"
          >
            मोड बंद करें ✕
          </button>
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
