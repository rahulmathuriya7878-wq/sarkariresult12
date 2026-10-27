import React, { useState, useMemo, useEffect } from 'react';
import { 
  SarkariPost, 
  PostCategory, 
  Department, 
  Qualification, 
  SalaryBand,
  ApplicationFeeItem,
  ImportantDateItem,
  DirectLinkItem,
  VacancyBreakdown,
  SalaryBreakdownItem,
  PaperPattern,
  ExamSubjectItem
} from '../../types/job';
import { 
  X, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Save, 
  RotateCcw, 
  Lock, 
  Unlock, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Link as LinkIcon, 
  DollarSign, 
  Users, 
  Download, 
  Upload,
  ArrowLeft,
  HelpCircle,
  Eye,
  CheckCircle2,
  Layers,
  Sparkles,
  Bot,
  Globe
} from 'lucide-react';
import { getPostFAQs } from '../FullPagePostView';
import { AIBlogWriter } from './AIBlogWriter';
import { GoogleIndexationManager } from './GoogleIndexationManager';
import { readPdfFileAsDataUrl } from '../../utils/pdfGenerator';
import { validateIso8601 } from '../../utils/dateUtils';

interface AdminEditingPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: SarkariPost[];
  onAddPost: (post: SarkariPost) => void;
  onUpdatePost: (post: SarkariPost) => void;
  onDeletePost: (postId: string) => void;
  onResetToDefault: () => void;
  onSelectPost?: (post: SarkariPost) => void;
  isHindi?: boolean;
  initialPostToEdit?: SarkariPost | null;
  isGlobalWordEditActive?: boolean;
  onToggleGlobalWordEdit?: () => void;
  onStartDirectWordEdit?: (post?: SarkariPost) => void;
}

const CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'latest_jobs', label: 'Latest Jobs (सरकारी नौकरी)' },
  { value: 'result', label: 'Result (परिणाम)' },
  { value: 'admit_card', label: 'Admit Card (प्रवेश पत्र)' },
  { value: 'answer_key', label: 'Answer Key (उत्तर कुंजी)' },
  { value: 'syllabus', label: 'Syllabus (सिलेबस)' },
  { value: 'admission', label: 'Admission (प्रवेश)' },
  { value: 'certificate_verification', label: 'Certificate Verification (प्रमाण पत्र सत्यापन)' },
  { value: 'important', label: 'Important (महत्वपूर्ण)' },
];

const DEPARTMENTS: Department[] = [
  'UPSC', 'SSC', 'Railway', 'Banking', 'Defence', 'State PSC', 'Teaching', 'Police', 'Engineering', 'Medical', 'Other'
];

const QUALIFICATIONS: Qualification[] = [
  '10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma / ITI', 'B.Tech / BE', 'B.Ed / CTET', 'Medical / Nursing'
];

const SALARY_BANDS: SalaryBand[] = [
  'Below 25K', '25K - 50K', '50K - 1 Lakh', 'Above 1 Lakh'
];

const createEmptyPost = (): SarkariPost => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();
  const todayStr = `${day} ${month} ${year}`;
  const id = `job-${Date.now()}`;

  return {
    id,
    slug: `post-${Date.now()}`,
    title: '',
    shortTitle: '',
    hindiTitle: '',
    category: 'latest_jobs',
    department: 'Other',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: todayStr,
    shortInfo: '',
    isHot: false,
    isNew: true,
    lastDate: '',
    examDate: '',
    totalVacancies: '',
    salary: '₹ 25,500 - ₹ 81,100/-',
    salaryBand: '25K - 50K',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 100/-' },
      { category: 'SC / ST / PwD', amount: '₹ 0/-' }
    ],
    feePaymentMode: 'Pay fee online via Debit Card, Credit Card, Net Banking or UPI.',
    ageLimit: {
      asOnDate: `01/01/${year}`,
      minAge: 18,
      maxAge: 35,
      notes: 'Age relaxation applicable as per government rules.'
    },
    importantDates: [
      { label: 'Online Application Begin', value: `${day}/${String(now.getMonth() + 1).padStart(2, '0')}/${year}` },
      { label: 'Last Date for Apply Online', value: `30/${String(now.getMonth() + 2).padStart(2, '0')}/${year}`, isHighlight: true }
    ],
    vacancyBreakdown: [
      {
        postName: '',
        totalPosts: '',
        eligibility: ''
      }
    ],
    howToApplySteps: [
      'Visit the official website.',
      'Click on Registration / Apply Online link.',
      'Fill required details, upload photograph & signature.',
      'Pay application fee and take final printout.'
    ],
    directLinks: [
      { label: 'Apply Online', actionText: 'Apply Online', type: 'apply', url: '', isPrimary: true },
      { label: 'Download Notification PDF', actionText: 'Click Here (PDF)', type: 'notification', url: '' },
      { label: 'Official Website', actionText: 'Click Here', type: 'official', url: '' }
    ]
  };
};

export const AdminEditingPanelModal: React.FC<AdminEditingPanelModalProps> = ({
  isOpen,
  onClose,
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onResetToDefault,
  onSelectPost,
  initialPostToEdit,
  isGlobalWordEditActive,
  onToggleGlobalWordEdit,
  onStartDirectWordEdit
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sarkari_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');

  // Filter & Search in Table
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Main Admin Panel Modules: 1. Full Post Editor, 2. AI Blog Writer
  const [adminMainTab, setAdminMainTab] = useState<'editor' | 'ai_blog'>('editor');
  const [isGscModalOpen, setIsGscModalOpen] = useState<boolean>(false);

  // Editor State
  const [editingPost, setEditingPost] = useState<SarkariPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'dates_fees' | 'links' | 'vacancy' | 'faqs'>('basic');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<SarkariPost | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Automatically open direct editor when initialPostToEdit is passed or select first post
  useEffect(() => {
    if (isOpen) {
      if (initialPostToEdit) {
        setEditingPost(JSON.parse(JSON.stringify(initialPostToEdit)));
        setIsCreatingNew(false);
      } else if (!editingPost && posts && posts.length > 0) {
        setEditingPost(JSON.parse(JSON.stringify(posts[0])));
        setIsCreatingNew(false);
      }
    }
  }, [initialPostToEdit, isOpen, posts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const adminPdfInputRef = React.useRef<HTMLInputElement>(null);

  const handleAdminPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;
    try {
      const { dataUrl, fileName, fileSize } = await readPdfFileAsDataUrl(file);
      const cleanName = fileName.replace(/\.pdf$/i, '');
      const existingPdfIndex = editingPost.directLinks.findIndex(l => l.isPdf || l.type === 'notification');
      
      let updatedLinks = [...editingPost.directLinks];
      if (existingPdfIndex >= 0) {
        updatedLinks[existingPdfIndex] = {
          ...updatedLinks[existingPdfIndex],
          url: dataUrl,
          fileName,
          fileSize,
          isPdf: true,
          actionText: updatedLinks[existingPdfIndex].actionText || 'Download PDF'
        };
      } else {
        updatedLinks.push({
          label: `Download Official Notification (${cleanName}) PDF`,
          actionText: 'Click Here',
          type: 'notification',
          url: dataUrl,
          fileName,
          fileSize,
          isPdf: true,
          isPrimary: true
        });
      }
      setEditingPost({ 
        ...editingPost, 
        directLinks: updatedLinks,
        pdfAttachment: {
          fileName,
          fileSize,
          url: dataUrl,
          uploadedAt: new Date().toISOString()
        }
      });
      showToast(`✅ PDF फ़ाइल "${fileName}" (${fileSize}) पोस्ट के साथ अपलोड हो गई!`);
      if (adminPdfInputRef.current) adminPdfInputRef.current.value = '';
    } catch (err: any) {
      alert(err.message || 'PDF अपलोड करने में विफल');
    }
  };

  const handleRemovePdf = (targetUrlOrIndex?: string | number) => {
    if (!editingPost) return;
    let updatedLinks = [...editingPost.directLinks];
    if (typeof targetUrlOrIndex === 'number') {
      updatedLinks = updatedLinks.filter((_, i) => i !== targetUrlOrIndex);
    } else if (typeof targetUrlOrIndex === 'string') {
      updatedLinks = updatedLinks.filter(l => l.url !== targetUrlOrIndex);
    } else {
      updatedLinks = updatedLinks.filter(l => !l.isPdf && l.type !== 'notification');
    }
    setEditingPost({
      ...editingPost,
      directLinks: updatedLinks,
      pdfAttachment: undefined
    });
    showToast('🗑️ PDF दस्तावेज हटा दिया गया (PDF attachment removed)!');
  };

  const ADMIN_PASSWORD = '78787739277877139203';

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sarkari_admin_auth', 'true');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sarkari_admin_auth');
    setEditingPost(null);
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      if (filterDept !== 'all' && p.department !== filterDept) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          p.title.toLowerCase().includes(q) ||
          p.shortTitle.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.notificationNumber && p.notificationNumber.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [posts, filterCategory, filterDept, searchQuery]);

  // Start Adding New Post
  const handleStartCreate = () => {
    setEditingPost(createEmptyPost());
    setIsCreatingNew(true);
    setActiveTab('basic');
  };

  // Start Editing Existing Post
  const handleStartEdit = (post: SarkariPost) => {
    // deep clone so we can discard edits if cancelled
    setEditingPost(JSON.parse(JSON.stringify(post)));
    setIsCreatingNew(false);
    setActiveTab('basic');
  };

  // Duplicate a Post
  const handleDuplicatePost = (post: SarkariPost) => {
    const cloned: SarkariPost = JSON.parse(JSON.stringify(post));
    cloned.id = `job-${Date.now()}`;
    cloned.slug = `${cloned.slug}-copy-${Date.now().toString().slice(-4)}`;
    cloned.title = `[Copy] ${cloned.title}`;
    cloned.shortTitle = `[Copy] ${cloned.shortTitle}`;
    cloned.postDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    cloned.isNew = true;
    onAddPost(cloned);
    showToast(`Post duplicated successfully!`);
  };

  // Delete a Post confirmation trigger
  const handleConfirmDelete = () => {
    if (!postToDelete) return;
    const deletedTitle = postToDelete.shortTitle || postToDelete.title;
    onDeletePost(postToDelete.id);
    if (editingPost?.id === postToDelete.id) {
      setEditingPost(null);
    }
    showToast(`Post "${deletedTitle}" deleted successfully!`);
    setPostToDelete(null);
  };

  // Save changes
  const handleQuickSave = (stayInEditor: boolean = false, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPost) return;

    const dateValidation = validateIso8601(editingPost.postDate);
    if (!dateValidation.isValid) {
      showToast(`⚠️ Warning: datePosted is not in ISO 8601 format.`);
    }

    if (!editingPost.title.trim() || !editingPost.shortTitle.trim()) {
      showToast('⚠️ Please provide both Title and Short Title.');
      return;
    }

    // Auto-generate slug if blank
    if (!editingPost.slug.trim()) {
      editingPost.slug = editingPost.shortTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Ensure updated post is marked as new so it goes live at the top of the section immediately
    editingPost.isNew = true;

    if (isCreatingNew) {
      onAddPost(editingPost);
      try {
        const updatedList = [editingPost, ...posts];
        localStorage.setItem('sarkari_admin_posts_v3', JSON.stringify(updatedList));
        localStorage.setItem('sarkari_admin_posts_v2', JSON.stringify(updatedList));
      } catch (err) {
        console.error(err);
      }
      showToast(`🚀 Live Success: New post published live!`);
      if (!stayInEditor) {
        setEditingPost(null);
        setIsCreatingNew(false);
      } else {
        setIsCreatingNew(false);
      }
    } else {
      onUpdatePost(editingPost);
      try {
        const updatedList = posts.map(p => p.id === editingPost.id ? editingPost : p);
        localStorage.setItem('sarkari_admin_posts_v3', JSON.stringify(updatedList));
        localStorage.setItem('sarkari_admin_posts_v2', JSON.stringify(updatedList));
      } catch (err) {
        console.error(err);
      }
      showToast(`🚀 Live Success: Post updated and published live!`);
      if (!stayInEditor) {
        setEditingPost(null);
      }
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    handleQuickSave(false, e);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sarkari_result_posts_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Posts database exported as JSON!');
  };

  // File Upload JSON Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0 && imported[0].id && imported[0].title) {
          if (window.confirm(`Found ${imported.length} posts in backup. Do you want to replace current posts database?`)) {
            // Replace by updating or adding each
            imported.forEach((p: SarkariPost) => onUpdatePost(p));
            showToast(`Imported ${imported.length} posts!`);
          }
        } else {
          alert('Invalid JSON structure. Expected array of SarkariPost items.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-6xl h-full sm:h-[94vh] max-h-full sm:max-h-[94vh] rounded-none sm:rounded-md shadow-2xl border-0 sm:border-2 border-slate-700 flex flex-col overflow-hidden relative text-slate-800">
        
        {/* Top-level Hidden PDF File Input */}
        <input 
          type="file" 
          ref={adminPdfInputRef} 
          accept="application/pdf,.pdf" 
          onChange={handleAdminPdfUpload} 
          className="hidden" 
        />

        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-16 right-6 z-50 bg-emerald-700 text-white px-4 py-2 rounded shadow-lg text-sm font-bold flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-[#ab1616] text-white px-4 py-3 flex items-center justify-between border-b border-red-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-400 text-slate-900 font-black flex items-center justify-center text-sm shadow-xs">
              ⚡
            </div>

          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={() => setIsGscModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs bg-amber-400 hover:bg-amber-500 text-red-950 px-3 py-1.5 rounded font-black cursor-pointer transition-colors shadow-2xs border border-amber-300"
                  title="Google Search Console Indexing Manager & Sitemap Pinger"
                >
                  <Globe className="w-4 h-4 text-red-950" />
                  <span>🔍 GSC Indexing Manager</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-1 text-xs bg-red-900 hover:bg-red-950 text-white px-2.5 py-1.5 rounded font-bold cursor-pointer transition-colors"
                  title="Sign out of admin"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock / Exit</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded cursor-pointer transition-colors"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two Exclusive Admin Modules: 1. Direct Section & Post Editor, 2. AI Blog Writer */}
        {isAuthenticated && (
          <div className="bg-slate-900 text-white px-3 sm:px-4 py-2 border-b border-slate-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0 shadow-md">
            <div className="flex items-center gap-2 flex-wrap">

            </div>

            <div className="text-[11px] text-slate-400 font-bold hidden md:flex items-center gap-2">
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                कुल पोस्ट्स: <strong className="text-white">{posts.length}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Quick Action Bar (New Post, Save, Publish, Direct Word Edit) */}
        {isAuthenticated && adminMainTab === 'editor' && (
          <div className="bg-white border-b border-slate-300 px-3 sm:px-4 py-2 flex items-center justify-between gap-2.5 shrink-0 shadow-2xs flex-wrap">


            <div className="flex items-center gap-2">


              <button
                type="button"
                onClick={handleStartCreate}
                className="bg-[#ab1616] hover:bg-red-800 text-white text-xs font-black px-3 py-1.5 rounded shrink-0 cursor-pointer shadow-2xs transition-colors flex items-center gap-1"
                title="नई पोस्ट बनाएं"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ नई पोस्ट</span>
              </button>

              {editingPost && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickSave(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3 py-1.5 rounded shrink-0 cursor-pointer shadow-2xs transition-colors flex items-center gap-1"
                    title="Quick Save and stay in editor"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>अपडेट करें</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleQuickSave(false);
                      setTimeout(() => window.location.reload(), 400);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3 py-1.5 rounded shrink-0 cursor-pointer shadow-2xs transition-colors flex items-center gap-1"
                    title="Publish Live & Reload portal"
                  >
                    <span>🚀 पब्लिश लाइव</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Login Guard View */
          <div className="flex-1 flex items-center justify-center p-6 bg-white">
            <div className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-sm max-w-md w-full space-y-5 text-center">
              <div className="w-14 h-14 bg-red-50 text-[#ab1616] rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Admin Authentication Required</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter Admin Password to manage notifications, edit posts, and update dates.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter Admin Password
                  </label>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter Admin Password"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#ab1616] hover:bg-red-800 text-white font-bold text-sm py-2.5 rounded transition-colors cursor-pointer shadow-sm"
                  >
                    Unlock Admin Panel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : editingPost ? (
          /* POST EDITOR FORM */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
            {/* Clean Section Navigation Bar */}
            <div className="bg-slate-100 border-b md:border-b-0 md:border-r border-slate-300 px-3 sm:px-4 py-2 flex flex-col md:w-52 shrink-0 gap-2">
              <div className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                {isCreatingNew ? '+ New Post' : `Editing: ${editingPost.shortTitle || editingPost.title}`}
              </div>


              {/* Horizontal Navigation on Mobile / Vertical on Desktop */}
              <div className="flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
                <a href="#sec-basic" className="px-2.5 py-1 rounded font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-1 transition-colors">📍 Info</a>
                <a href="#sec-dates-fees" className="px-2.5 py-1 rounded font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-1 transition-colors">📅 Dates & Fees</a>
                <a href="#sec-vacancy" className="px-2.5 py-1 rounded font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-1 transition-colors">📊 Vacancy</a>
                <a href="#sec-salary" className="px-2.5 py-1 rounded font-bold bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 shrink-0 flex items-center gap-1 transition-colors">💵 Salary</a>
                <a href="#sec-exam-pattern" className="px-2.5 py-1 rounded font-bold bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 shrink-0 flex items-center gap-1 transition-colors">📝 Pattern</a>
                <a href="#sec-links" className="px-2.5 py-1 rounded font-bold bg-white hover:bg-purple-50 text-purple-900 border border-purple-300 shrink-0 flex items-center gap-1 transition-colors">🔗 Links</a>
                <a href="#sec-steps" className="px-2.5 py-1 rounded font-bold bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-1 transition-colors">✍️ Steps</a>
                <a href="#sec-faqs" className="px-2.5 py-1 rounded font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-1 transition-colors">❓ FAQs</a>
              </div>
            </div>

            {/* Form Fields - All Sections Stacked Vertically */}
            <form onSubmit={handleSavePost} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 relative">

              {/* SECTION 1: BASIC INFO */}
              <div id="sec-basic" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-2">
                  <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    SECTION 1
                  </span>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    📍 General Post Information (सामान्य जानकारी)
                  </h3>
                </div>
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Post Title <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingPost({
                            ...editingPost,
                            title: val,
                            shortTitle: editingPost.shortTitle || val
                          });
                        }}
                        placeholder="e.g. Supreme Court of India Junior Court Attendant Recruitment 2026 Online Form (130 Posts)"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-semibold text-slate-900 focus:outline-none focus:border-red-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Short Title (Used on 3-Column Grids) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingPost.shortTitle}
                        onChange={(e) => setEditingPost({ ...editingPost, shortTitle: e.target.value })}
                        placeholder="e.g. Supreme Court Attendant 2026 Online Form"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-semibold text-slate-900 focus:outline-none focus:border-red-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hindi Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingPost.hindiTitle || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, hindiTitle: e.target.value })}
                        placeholder="e.g. सुप्रीम कोर्ट जूनियर कोर्ट अटेंडेंट भर्ती 2026 ऑनलाइन आवेदन फॉर्म"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700 font-hindi"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Section Category <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as PostCategory })}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-bold text-slate-900 focus:outline-none focus:border-red-700 bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Department
                      </label>
                      <select
                        value={editingPost.department}
                        onChange={(e) => setEditingPost({ ...editingPost, department: e.target.value as Department })}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-bold text-slate-900 focus:outline-none focus:border-red-700 bg-white"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        State / Jurisdiction
                      </label>
                      <input
                        type="text"
                        value={editingPost.state}
                        onChange={(e) => setEditingPost({ ...editingPost, state: e.target.value })}
                        placeholder="e.g. All India / Uttar Pradesh / Rajasthan"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Post Date / Timestamp (ISO 8601 Recommended)
                      </label>
                      <input
                        type="text"
                        value={editingPost.postDate}
                        onChange={(e) => setEditingPost({ ...editingPost, postDate: e.target.value })}
                        placeholder="e.g. 2026-10-26T00:00:00Z or 19 October 2026"
                        className={`w-full px-3 py-2 border rounded text-sm text-slate-900 focus:outline-none ${
                          !validateIso8601(editingPost.postDate).isValid
                            ? 'border-amber-500 bg-amber-50/50 focus:border-amber-600'
                            : 'border-slate-300 focus:border-red-700'
                        }`}
                      />
                      {!validateIso8601(editingPost.postDate).isValid && (
                        <p className="text-[11px] text-amber-800 font-semibold mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Warning: Date is not in ISO 8601 format (e.g., YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ). Required for Google JobPosting schema.</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Notification Number / Advt No.
                      </label>
                      <input
                        type="text"
                        value={editingPost.notificationNumber || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, notificationNumber: e.target.value })}
                        placeholder="e.g. Advt No. 04/2026"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                        placeholder="e.g. supreme-court-attendant-recruitment-2026"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono text-slate-700 focus:outline-none focus:border-red-700"
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-6 pt-2 border-t border-slate-200">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={editingPost.isNew || false}
                        onChange={(e) => setEditingPost({ ...editingPost, isNew: e.target.checked })}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <span>Mark as "New" (Shows New badge)</span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={editingPost.isHot || false}
                        onChange={(e) => setEditingPost({ ...editingPost, isHot: e.target.checked })}
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                      <span>Mark as "Hot" (High Priority)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-700">Status:</label>
                      <select
                        value={editingPost.status || (editingPost.isUpcoming ? 'upcoming' : 'active')}
                        onChange={(e) => {
                          const val = e.target.value as 'upcoming' | 'active' | 'closed';
                          setEditingPost({
                            ...editingPost,
                            status: val,
                            isUpcoming: val === 'upcoming'
                          });
                        }}
                        className="px-2.5 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:border-red-700 bg-white"
                      >
                        <option value="active">Active (आवेदन जारी - Open)</option>
                        <option value="upcoming">Upcoming (आगामी - Link Soon)</option>
                        <option value="closed">Closed (समाप्त)</option>
                      </select>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Required Qualifications (Select All That Apply):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {QUALIFICATIONS.map((q) => {
                        const isSelected = editingPost.qualifications.includes(q);
                        return (
                          <button
                            key={q}
                            type="button"
                            onClick={() => {
                              const updated = isSelected 
                                ? editingPost.qualifications.filter((item) => item !== q)
                                : [...editingPost.qualifications, q];
                              setEditingPost({ ...editingPost, qualifications: updated });
                            }}
                            className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors border ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {q}
                          </button>
                        );
                      })}
                    </div>
                  </div>



                  {/* Short Information */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Information / Overview
                    </label>
                    <textarea
                      rows={3}
                      value={editingPost.shortInfo}
                      onChange={(e) => setEditingPost({ ...editingPost, shortInfo: e.target.value })}
                      placeholder="Summary of post, conducting authority, and opening dates..."
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATES, FEES & AGE LIMIT */}
              <div id="sec-dates-fees" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-6 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-2">
                  <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    SECTION 2
                  </span>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    📅 Important Dates, Fees & Age Criteria (तिथि, शुल्क एवं आयु सीमा)
                  </h3>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Quick Dates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Last Date
                      </label>
                      <input
                        type="text"
                        value={editingPost.lastDate || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, lastDate: e.target.value })}
                        placeholder="e.g. 28/10/2026"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Exam Date
                      </label>
                      <input
                        type="text"
                        value={editingPost.examDate || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, examDate: e.target.value })}
                        placeholder="e.g. 14-18 December 2026"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Admit Card Date
                      </label>
                      <input
                        type="text"
                        value={editingPost.admitCardDate || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, admitCardDate: e.target.value })}
                        placeholder="e.g. 07/12/2026"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Result Date
                      </label>
                      <input
                        type="text"
                        value={editingPost.resultDate || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, resultDate: e.target.value })}
                        placeholder="e.g. Declared 15/10/2026"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700"
                      />
                    </div>
                  </div>

                  {/* Vacancies & Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Total Vacancies
                      </label>
                      <input
                        type="text"
                        value={editingPost.totalVacancies || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, totalVacancies: e.target.value })}
                        placeholder="e.g. 130 Posts or 130"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Salary Description
                      </label>
                      <input
                        type="text"
                        value={editingPost.salary || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, salary: e.target.value })}
                        placeholder="e.g. ₹ 21,700 - ₹ 69,100/-"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Salary Band Filter
                      </label>
                      <select
                        value={editingPost.salaryBand || '25K - 50K'}
                        onChange={(e) => setEditingPost({ ...editingPost, salaryBand: e.target.value as SalaryBand })}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700 bg-white"
                      >
                        {SALARY_BANDS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Age Limit */}
                  <div className="bg-slate-50 border border-slate-300 p-4 rounded space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      Age Limit Criteria
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Min Age</label>
                        <input
                          type="number"
                          value={editingPost.ageLimit?.minAge || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            ageLimit: { ...editingPost.ageLimit, minAge: e.target.value ? parseInt(e.target.value) : undefined }
                          })}
                          placeholder="e.g. 18"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Age</label>
                        <input
                          type="number"
                          value={editingPost.ageLimit?.maxAge || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            ageLimit: { ...editingPost.ageLimit, maxAge: e.target.value ? parseInt(e.target.value) : undefined }
                          })}
                          placeholder="e.g. 30"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Age Calculated As On Date</label>
                        <input
                          type="text"
                          value={editingPost.ageLimit?.asOnDate || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            ageLimit: { ...editingPost.ageLimit, asOnDate: e.target.value }
                          })}
                          placeholder="e.g. 01/12/2026"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Important Dates Table Editor */}
                  <div className="border border-slate-300 rounded overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                      <span className="text-xs font-black uppercase text-slate-800">
                        Detailed Important Dates Table
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            importantDates: [
                              ...editingPost.importantDates,
                              { label: 'Event Name', value: 'Date / Schedule', isHighlight: false }
                            ]
                          });
                        }}
                        className="text-xs bg-slate-800 hover:bg-black text-white px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Add Date Row
                      </button>
                    </div>
                    <div className="p-3 space-y-2">
                      {editingPost.importantDates.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...editingPost.importantDates];
                              updated[idx].label = e.target.value;
                              setEditingPost({ ...editingPost, importantDates: updated });
                            }}
                            placeholder="Event Label (e.g. Application Begin)"
                            className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => {
                              const updated = [...editingPost.importantDates];
                              updated[idx].value = e.target.value;
                              setEditingPost({ ...editingPost, importantDates: updated });
                            }}
                            placeholder="Date Value (e.g. 15/10/2026)"
                            className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-800"
                          />
                          <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isHighlight || false}
                              onChange={(e) => {
                                const updated = [...editingPost.importantDates];
                                updated[idx].isHighlight = e.target.checked;
                                setEditingPost({ ...editingPost, importantDates: updated });
                              }}
                            />
                            <span>Highlight</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPost({
                                ...editingPost,
                                importantDates: editingPost.importantDates.filter((_, i) => i !== idx)
                              });
                            }}
                            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            title="Remove date"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Application Fee Editor */}
                  <div className="border border-slate-300 rounded overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                      <span className="text-xs font-black uppercase text-slate-800">
                        Application Fee Structure
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            applicationFee: [
                              ...editingPost.applicationFee,
                              { category: 'Category', amount: '₹ 0/-' }
                            ]
                          });
                        }}
                        className="text-xs bg-slate-800 hover:bg-black text-white px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Add Fee Row
                      </button>
                    </div>
                    <div className="p-3 space-y-2">
                      {editingPost.applicationFee.map((fee, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={fee.category}
                            onChange={(e) => {
                              const updated = [...editingPost.applicationFee];
                              updated[idx].category = e.target.value;
                              setEditingPost({ ...editingPost, applicationFee: updated });
                            }}
                            placeholder="Category (e.g. General / OBC)"
                            className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={fee.amount}
                            onChange={(e) => {
                              const updated = [...editingPost.applicationFee];
                              updated[idx].amount = e.target.value;
                              setEditingPost({ ...editingPost, applicationFee: updated });
                            }}
                            placeholder="Fee Amount (e.g. ₹ 100/-)"
                            className="w-40 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPost({
                                ...editingPost,
                                applicationFee: editingPost.applicationFee.filter((_, i) => i !== idx)
                              });
                            }}
                            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            title="Remove fee row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: VACANCIES BREAKDOWN & ELIGIBILITY */}
              <div id="sec-vacancy" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-6 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      SECTION 3
                    </span>
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                      📊 Vacancy Breakdown & Eligibility (पद विवरण व योग्यता)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost({
                        ...editingPost,
                        vacancyBreakdown: [
                          ...editingPost.vacancyBreakdown,
                          { 
                            postName: 'New Post Name', 
                            totalPosts: '0', 
                            eligibility: 'Educational qualification details as per official gazette.',
                            categoryBreakdown: { gen: 0, obc: 0, ews: 0, sc: 0, st: 0 }
                          }
                        ]
                      });
                    }}
                    className="text-xs bg-[#ab1616] hover:bg-red-800 text-white px-3 py-1 rounded font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    + Add Post Breakdown
                  </button>
                </div>

                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="bg-white p-3.5 rounded border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">Total Consolidated Vacancies (कुल पद संख्या):</label>
                      <p className="text-[11px] text-slate-500">Total number of seats advertised across all categories.</p>
                    </div>
                    <input
                      type="text"
                      value={editingPost.totalVacancies || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, totalVacancies: e.target.value })}
                      placeholder="e.g. 130 or 2,987 Posts"
                      className="w-full sm:w-48 px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-blue-900"
                    />
                  </div>

                  {/* Vacancy Breakdown Cards */}
                  <div className="space-y-3">
                    {editingPost.vacancyBreakdown.map((item, idx) => (
                      <div key={idx} className="bg-white border border-slate-300 p-4 rounded space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                            <span className="text-emerald-600">■</span>
                            <span>Post Entry #{idx + 1}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPost({
                                ...editingPost,
                                vacancyBreakdown: editingPost.vacancyBreakdown.filter((_, i) => i !== idx)
                              });
                            }}
                            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            title="Delete this vacancy item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Post / Cadre Name</label>
                            <input
                              type="text"
                              value={item.postName}
                              onChange={(e) => {
                                const updated = [...editingPost.vacancyBreakdown];
                                updated[idx].postName = e.target.value;
                                setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                              }}
                              placeholder="Post Name (e.g. Station Master / Junior Court Attendant)"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Total Posts for Cadre</label>
                            <input
                              type="text"
                              value={item.totalPosts}
                              onChange={(e) => {
                                const updated = [...editingPost.vacancyBreakdown];
                                updated[idx].totalPosts = e.target.value;
                                setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                              }}
                              placeholder="Total (e.g. 130)"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold text-emerald-800"
                            />
                          </div>
                        </div>

                        {/* Category Breakdown (UR, OBC, EWS, SC, ST) */}
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                            Category-wise Seat Quota (Optional)
                          </label>
                          <div className="grid grid-cols-5 gap-1.5">
                            <div>
                              <span className="block text-[10px] font-bold text-slate-600">UR / Gen</span>
                              <input
                                type="text"
                                value={item.categoryBreakdown?.gen || ''}
                                onChange={(e) => {
                                  const updated = [...editingPost.vacancyBreakdown];
                                  updated[idx].categoryBreakdown = { ...(updated[idx].categoryBreakdown || {}), gen: e.target.value };
                                  setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                                }}
                                placeholder="0"
                                className="w-full px-1.5 py-1 border border-slate-300 rounded text-xs font-semibold text-center bg-white"
                              />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-600">OBC</span>
                              <input
                                type="text"
                                value={item.categoryBreakdown?.obc || ''}
                                onChange={(e) => {
                                  const updated = [...editingPost.vacancyBreakdown];
                                  updated[idx].categoryBreakdown = { ...(updated[idx].categoryBreakdown || {}), obc: e.target.value };
                                  setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                                }}
                                placeholder="0"
                                className="w-full px-1.5 py-1 border border-slate-300 rounded text-xs font-semibold text-center bg-white"
                              />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-600">EWS</span>
                              <input
                                type="text"
                                value={item.categoryBreakdown?.ews || ''}
                                onChange={(e) => {
                                  const updated = [...editingPost.vacancyBreakdown];
                                  updated[idx].categoryBreakdown = { ...(updated[idx].categoryBreakdown || {}), ews: e.target.value };
                                  setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                                }}
                                placeholder="0"
                                className="w-full px-1.5 py-1 border border-slate-300 rounded text-xs font-semibold text-center bg-white"
                              />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-600">SC</span>
                              <input
                                type="text"
                                value={item.categoryBreakdown?.sc || ''}
                                onChange={(e) => {
                                  const updated = [...editingPost.vacancyBreakdown];
                                  updated[idx].categoryBreakdown = { ...(updated[idx].categoryBreakdown || {}), sc: e.target.value };
                                  setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                                }}
                                placeholder="0"
                                className="w-full px-1.5 py-1 border border-slate-300 rounded text-xs font-semibold text-center bg-white"
                              />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-600">ST</span>
                              <input
                                type="text"
                                value={item.categoryBreakdown?.st || ''}
                                onChange={(e) => {
                                  const updated = [...editingPost.vacancyBreakdown];
                                  updated[idx].categoryBreakdown = { ...(updated[idx].categoryBreakdown || {}), st: e.target.value };
                                  setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                                }}
                                placeholder="0"
                                className="w-full px-1.5 py-1 border border-slate-300 rounded text-xs font-semibold text-center bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Eligibility Criteria & Educational Qualification</label>
                          <textarea
                            rows={3}
                            value={item.eligibility}
                            onChange={(e) => {
                              const updated = [...editingPost.vacancyBreakdown];
                              updated[idx].eligibility = e.target.value;
                              setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                            }}
                            placeholder="• Bachelor Degree in any stream from recognized University.&#10;• Basic computer operations knowledge."
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs leading-relaxed font-sans"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 4: PAY SCALE & SALARY DETAILS TABLE */}
              <div id="sec-salary" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      SECTION 4
                    </span>
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                      💵 Pay Scale & Salary Table (वेतन सारणी व पे-स्केल)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const vacs = editingPost.vacancyBreakdown || [];
                        if (vacs.length === 0) {
                          showToast('⚠️ No vacancies found to populate. Add vacancies first!');
                          return;
                        }
                        const generated: SalaryBreakdownItem[] = vacs.map(v => ({
                          postName: v.postName || 'Post Name',
                          payLevel: 'Pay Level 6 (7th CPC)',
                          basicPay: '₹ 35,400 - ₹ 1,12,400/-',
                          inHandSalary: '₹ 56,000 - ₹ 62,000 / month',
                          allowances: 'DA, HRA, TA & Medical as per Govt Norms'
                        }));
                        setEditingPost({ ...editingPost, salaryBreakdown: generated });
                        showToast('Populated salary table rows from Vacancy Breakdown!');
                      }}
                      className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded font-bold cursor-pointer transition-colors shadow-2xs"
                      title="Auto populate salary table rows using post names from vacancy breakdown"
                    >
                      ⚡ Auto-Fill from Vacancies
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingPost.salaryBreakdown || [];
                        setEditingPost({
                          ...editingPost,
                          salaryBreakdown: [
                            ...current,
                            {
                              postName: editingPost.vacancyBreakdown?.[0]?.postName || 'Post Name',
                              payLevel: 'Pay Level 6',
                              basicPay: '₹ 35,400 - ₹ 1,12,400/-',
                              inHandSalary: '₹ 56,000 - ₹ 62,000/-',
                              allowances: 'DA, HRA, Transport Allowance'
                            }
                          ]
                        });
                      }}
                      className="text-xs bg-[#ab1616] hover:bg-red-800 text-white px-3 py-1 rounded font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      + Add Salary Row
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-w-4xl mx-auto">
                  {/* Overall Summary Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded border border-slate-300">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Overall Pay Scale Text (मुख्य वेतनमान)
                      </label>
                      <input
                        type="text"
                        value={editingPost.salary || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, salary: e.target.value })}
                        placeholder="e.g. ₹ 35,400 - ₹ 1,12,400/- (Pay Level 6)"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Salary Band Filter (वेतन श्रेणी)
                      </label>
                      <select
                        value={editingPost.salaryBand || '25K - 50K'}
                        onChange={(e: any) => setEditingPost({ ...editingPost, salaryBand: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold bg-white"
                      >
                        {SALARY_BANDS.map(band => (
                          <option key={band} value={band}>{band}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Post-wise Salary Breakdown Rows */}
                  <div className="space-y-3">
                    {(!editingPost.salaryBreakdown || editingPost.salaryBreakdown.length === 0) ? (
                      <div className="border border-dashed border-slate-300 p-5 rounded text-center text-xs text-slate-600 bg-white">
                        <p className="font-bold text-slate-800">No Post-Wise Salary Breakdown Rows Configured</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Click "+ Add Salary Row" or "⚡ Auto-Fill from Vacancies" to show an official Pay Scale & Salary Table in this post.
                        </p>
                      </div>
                    ) : (
                      editingPost.salaryBreakdown.map((item, sIdx) => (
                        <div key={sIdx} className="bg-white border border-slate-300 p-3.5 rounded space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                            <span className="text-xs font-black text-slate-800 uppercase">
                              Salary Row #{sIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const list = (editingPost.salaryBreakdown || []).filter((_, i) => i !== sIdx);
                                setEditingPost({ ...editingPost, salaryBreakdown: list });
                              }}
                              className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                              title="Remove Salary Row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600">Post Name (पद का नाम)</label>
                              <input
                                type="text"
                                value={item.postName}
                                onChange={(e) => {
                                  const list = [...(editingPost.salaryBreakdown || [])];
                                  list[sIdx].postName = e.target.value;
                                  setEditingPost({ ...editingPost, salaryBreakdown: list });
                                }}
                                placeholder="e.g. Station Master"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold text-blue-900"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600">Pay Level (वेतन स्तर)</label>
                              <input
                                type="text"
                                value={item.payLevel}
                                onChange={(e) => {
                                  const list = [...(editingPost.salaryBreakdown || [])];
                                  list[sIdx].payLevel = e.target.value;
                                  setEditingPost({ ...editingPost, salaryBreakdown: list });
                                }}
                                placeholder="e.g. Level 6 (7th CPC)"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold text-emerald-700"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600">Basic Pay Range</label>
                              <input
                                type="text"
                                value={item.basicPay}
                                onChange={(e) => {
                                  const list = [...(editingPost.salaryBreakdown || [])];
                                  list[sIdx].basicPay = e.target.value;
                                  setEditingPost({ ...editingPost, salaryBreakdown: list });
                                }}
                                placeholder="e.g. ₹ 35,400 - ₹ 1,12,400/-"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600">In-Hand / Gross Salary</label>
                              <input
                                type="text"
                                value={item.inHandSalary || ''}
                                onChange={(e) => {
                                  const list = [...(editingPost.salaryBreakdown || [])];
                                  list[sIdx].inHandSalary = e.target.value;
                                  setEditingPost({ ...editingPost, salaryBreakdown: list });
                                }}
                                placeholder="e.g. ₹ 56,000 - ₹ 62,000 / month"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-purple-900"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600">Allowances & Benefits</label>
                              <input
                                type="text"
                                value={item.allowances || ''}
                                onChange={(e) => {
                                  const list = [...(editingPost.salaryBreakdown || [])];
                                  list[sIdx].allowances = e.target.value;
                                  setEditingPost({ ...editingPost, salaryBreakdown: list });
                                }}
                                placeholder="e.g. DA, HRA, Transport Allowance, Medical"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: EXAM PATTERN & SELECTION PROCESS */}
              <div id="sec-exam-pattern" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      SECTION 5
                    </span>
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                      📝 Exam Pattern & Selection Scheme (परीक्षा पैटर्न व चयन प्रक्रिया)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentSubjects = editingPost.paperPattern?.subjects || [];
                      const updatedPattern: PaperPattern = {
                        ...(editingPost.paperPattern || {
                          examName: `${editingPost.shortTitle} CBT-1 Exam Pattern`,
                          examMode: 'Computer Based Test (CBT)',
                          totalQuestions: 100,
                          totalMarks: 100,
                          totalDuration: '90 Minutes',
                          negativeMarking: '1/3rd Mark for each wrong answer',
                          mediumOfExam: 'Hindi & English'
                        }),
                        subjects: [
                          ...currentSubjects,
                          { subjectName: 'New Subject / Section', totalQuestions: 25, totalMarks: 25, duration: 'As per schedule' }
                        ]
                      };
                      setEditingPost({ ...editingPost, paperPattern: updatedPattern });
                    }}
                    className="text-xs bg-[#ab1616] hover:bg-red-800 text-white px-3 py-1 rounded font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    + Add Subject Row
                  </button>
                </div>

                <div className="space-y-4 max-w-4xl mx-auto">
                  {/* Exam Overview Inputs */}
                  <div className="bg-white border border-slate-300 p-4 rounded space-y-3">
                    <div className="text-xs font-black text-slate-800 uppercase border-b border-slate-200 pb-1">
                      General Exam Scheme Parameters
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Exam Scheme Title</label>
                        <input
                          type="text"
                          value={editingPost.paperPattern?.examName || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            paperPattern: { ...(editingPost.paperPattern || {}), examName: e.target.value }
                          })}
                          placeholder="e.g. CBT-1 Computer Based Examination Scheme"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Exam Mode</label>
                        <input
                          type="text"
                          value={editingPost.paperPattern?.examMode || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            paperPattern: { ...(editingPost.paperPattern || {}), examMode: e.target.value }
                          })}
                          placeholder="e.g. Online Computer Based Test (CBT) / Offline OMR"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Questions</label>
                        <input
                          type="text"
                          value={editingPost.paperPattern?.totalQuestions || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            paperPattern: { ...(editingPost.paperPattern || {}), totalQuestions: e.target.value }
                          })}
                          placeholder="e.g. 100"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Marks</label>
                        <input
                          type="text"
                          value={editingPost.paperPattern?.totalMarks || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            paperPattern: { ...(editingPost.paperPattern || {}), totalMarks: e.target.value }
                          })}
                          placeholder="e.g. 100"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-bold text-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Duration</label>
                        <input
                          type="text"
                          value={editingPost.paperPattern?.totalDuration || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            paperPattern: { ...(editingPost.paperPattern || {}), totalDuration: e.target.value }
                          })}
                          placeholder="e.g. 90 Minutes"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-bold text-blue-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Negative Marking</label>
                        <input
                          type="text"
                          value={editingPost.paperPattern?.negativeMarking || ''}
                          onChange={(e) => setEditingPost({
                            ...editingPost,
                            paperPattern: { ...(editingPost.paperPattern || {}), negativeMarking: e.target.value }
                          })}
                          placeholder="e.g. 1/3rd Mark"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-bold text-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Breakdown Rows */}
                  <div className="border border-slate-300 rounded overflow-hidden bg-white">
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-800">
                        Subject-wise Questions & Marks Distribution
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      {(!editingPost.paperPattern?.subjects || editingPost.paperPattern.subjects.length === 0) ? (
                        <p className="text-xs text-slate-500 italic text-center py-2">
                          No subjects added. Click "+ Add Subject Row" above to specify exam subjects.
                        </p>
                      ) : (
                        editingPost.paperPattern.subjects.map((sub, subIdx) => (
                          <div key={subIdx} className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                            <input
                              type="text"
                              value={sub.subjectName}
                              onChange={(e) => {
                                const list = [...(editingPost.paperPattern?.subjects || [])];
                                list[subIdx].subjectName = e.target.value;
                                setEditingPost({
                                  ...editingPost,
                                  paperPattern: { ...editingPost.paperPattern, subjects: list }
                                });
                              }}
                              placeholder="Subject Name (e.g. Mathematics)"
                              className="flex-1 w-full sm:w-auto px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-900"
                            />
                            <input
                              type="text"
                              value={sub.totalQuestions || ''}
                              onChange={(e) => {
                                const list = [...(editingPost.paperPattern?.subjects || [])];
                                list[subIdx].totalQuestions = e.target.value;
                                setEditingPost({
                                  ...editingPost,
                                  paperPattern: { ...editingPost.paperPattern, subjects: list }
                                });
                              }}
                              placeholder="Questions (e.g. 30)"
                              className="w-full sm:w-28 px-2 py-1.5 border border-slate-300 rounded text-xs font-semibold text-blue-900"
                            />
                            <input
                              type="text"
                              value={sub.totalMarks || ''}
                              onChange={(e) => {
                                const list = [...(editingPost.paperPattern?.subjects || [])];
                                list[subIdx].totalMarks = e.target.value;
                                setEditingPost({
                                  ...editingPost,
                                  paperPattern: { ...editingPost.paperPattern, subjects: list }
                                });
                              }}
                              placeholder="Marks (e.g. 30)"
                              className="w-full sm:w-28 px-2 py-1.5 border border-slate-300 rounded text-xs font-semibold text-emerald-800"
                            />
                            <input
                              type="text"
                              value={sub.duration || ''}
                              onChange={(e) => {
                                const list = [...(editingPost.paperPattern?.subjects || [])];
                                list[subIdx].duration = e.target.value;
                                setEditingPost({
                                  ...editingPost,
                                  paperPattern: { ...editingPost.paperPattern, subjects: list }
                                });
                              }}
                              placeholder="Remarks / Section Time"
                              className="w-full sm:w-36 px-2 py-1.5 border border-slate-300 rounded text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const list = (editingPost.paperPattern?.subjects || []).filter((_, i) => i !== subIdx);
                                setEditingPost({
                                  ...editingPost,
                                  paperPattern: { ...editingPost.paperPattern, subjects: list }
                                });
                              }}
                              className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                              title="Remove Subject"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Selection Process Stages */}
                  <div className="bg-white border border-slate-300 p-4 rounded space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <span className="text-xs font-black text-slate-800 uppercase">
                        Sequential Selection Process Stages (चयन प्रक्रिया के चरण)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const list = editingPost.selectionProcess || [];
                          setEditingPost({
                            ...editingPost,
                            selectionProcess: [...list, 'New Selection Stage Description']
                          });
                        }}
                        className="text-xs bg-slate-800 hover:bg-black text-white px-2.5 py-1 rounded font-bold cursor-pointer"
                      >
                        + Add Stage
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(!editingPost.selectionProcess || editingPost.selectionProcess.length === 0) ? (
                        <p className="text-xs text-slate-500 italic py-1">
                          Default 4 stages (CBT, Skill/PET, DV, Medical) will be displayed. Click "+ Add Stage" to customize.
                        </p>
                      ) : (
                        editingPost.selectionProcess.map((stage, stIdx) => (
                          <div key={stIdx} className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-[#16a34a] text-white px-2 py-1 rounded shrink-0">
                              Stage {stIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={stage}
                              onChange={(e) => {
                                const list = [...(editingPost.selectionProcess || [])];
                                list[stIdx] = e.target.value;
                                setEditingPost({ ...editingPost, selectionProcess: list });
                              }}
                              className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const list = (editingPost.selectionProcess || []).filter((_, i) => i !== stIdx);
                                setEditingPost({ ...editingPost, selectionProcess: list });
                              }}
                              className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: DIRECT OFFICIAL LINKS */}
              <div id="sec-links" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      SECTION 6
                    </span>
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                      🔗 Direct Important Links (आधिकारिक डायरेक्ट लिंक)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost({
                        ...editingPost,
                        directLinks: [
                          ...editingPost.directLinks,
                          { label: 'New Link Label', actionText: 'Click Here', type: 'apply', url: '', isPrimary: false }
                        ]
                      });
                    }}
                    className="text-xs bg-[#ab1616] hover:bg-red-800 text-white px-3 py-1.5 rounded font-bold cursor-pointer"
                  >
                    + Add New Link
                  </button>
                </div>

                <div className="space-y-4 max-w-4xl mx-auto">
                  {/* Dedicated PDF File Attachment Card */}
                  <div className="bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 border-2 border-dashed border-red-300 rounded-lg p-3.5 sm:p-4 shadow-2xs space-y-3">
                    <input 
                      type="file" 
                      ref={adminPdfInputRef} 
                      accept="application/pdf,.pdf" 
                      onChange={handleAdminPdfUpload} 
                      className="hidden" 
                    />
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-red-600 text-white rounded-md shadow-2xs font-bold text-lg">📄</span>
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                            अपलोड करें ऑफिशियल PDF नोटिफिकेशन / सिलेबस (Upload Official PDF)
                          </h4>
                          <p className="text-[11px] text-slate-600 font-medium">
                            कंप्यूटर या फोन से PDF अपलोड करें (अधिकतम 15MB)। अभ्यर्थी सीधे डाउनलोड कर सकेंगे।
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => adminPdfInputRef.current?.click()}
                        className="bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-md shadow-2xs cursor-pointer flex items-center gap-1.5 transition-all hover:scale-102 active:scale-98"
                      >
                        <Upload className="w-4 h-4" />
                        <span>📁 PDF फ़ाइल चुनें</span>
                      </button>
                    </div>

                    {/* Show attached PDFs list */}
                    {editingPost.directLinks.some(l => l.isPdf || l.fileName || (l.url && l.url.startsWith('data:application/pdf'))) && (
                      <div className="bg-white p-2.5 rounded border border-red-200 space-y-1.5">
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                          📎 वर्तमान में संलग्न (Attached PDFs):
                        </span>
                        <div className="space-y-1">
                          {editingPost.directLinks.filter(l => l.isPdf || l.fileName || (l.url && l.url.startsWith('data:application/pdf'))).map((pdfLink, pdfIdx) => (
                            <div key={pdfIdx} className="flex items-center justify-between bg-red-50 p-2 rounded text-xs border border-red-200">
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-bold text-rose-700">📄</span>
                                <span className="font-bold text-slate-900 truncate">{pdfLink.fileName || pdfLink.label}</span>
                                {pdfLink.fileSize && <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-bold">{pdfLink.fileSize}</span>}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {pdfLink.url && (
                                  <a
                                    href={pdfLink.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={pdfLink.fileName || 'notification.pdf'}
                                    className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-bold cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>देखें / डाउनलोड</span>
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemovePdf(pdfLink.url)}
                                  className="text-[10px] bg-red-100 hover:bg-red-200 text-red-800 p-1 rounded font-bold cursor-pointer border border-red-300"
                                  title="इस PDF फ़ाइल को पोस्ट से हटाएं"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-700" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Template Link Buttons */}
                  <div className="bg-white p-3 rounded border border-slate-300 space-y-2">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                      ⚡ 1-Click Quick Add Link Templates (तुरंत लिंक जोड़ें):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            directLinks: [
                              ...editingPost.directLinks,
                              { label: 'Apply Online (आवेदन करें)', actionText: 'Click Here', type: 'apply', url: 'https://', isPrimary: true }
                            ]
                          });
                          showToast('Added "Apply Online" link!');
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 border border-slate-300 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Apply Online
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            directLinks: [
                              ...editingPost.directLinks,
                              { label: 'Check Application Status & Exam City Slip', actionText: 'Click Here', type: 'exam_city', url: 'https://', isPrimary: false }
                            ]
                          });
                          showToast('Added "Exam City / Status" link!');
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 border border-slate-300 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Exam City Slip
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            directLinks: [
                              ...editingPost.directLinks,
                              { label: 'Download Admit Card', actionText: 'Click Here', type: 'admit_card', url: 'https://', isPrimary: false }
                            ]
                          });
                          showToast('Added "Admit Card" link!');
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 border border-slate-300 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Admit Card
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            directLinks: [
                              ...editingPost.directLinks,
                              { label: 'Download Answer Key & Objection Link', actionText: 'Click Here', type: 'answer_key', url: 'https://', isPrimary: false }
                            ]
                          });
                          showToast('Added "Answer Key" link!');
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 border border-slate-300 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Answer Key
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            directLinks: [
                              ...editingPost.directLinks,
                              { label: 'Download Result / Cutoff Marks', actionText: 'Click Here', type: 'result', url: 'https://', isPrimary: false }
                            ]
                          });
                          showToast('Added "Result" link!');
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 border border-slate-300 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Result
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            directLinks: [
                              ...editingPost.directLinks,
                              { label: 'Download Official Notification PDF', actionText: 'Click Here', type: 'notification', url: 'https://', isPrimary: false }
                            ]
                          });
                          showToast('Added "Notification PDF" link!');
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 border border-slate-300 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Notification PDF
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            directLinks: [
                              ...editingPost.directLinks,
                              { label: 'Download Syllabus & Exam Pattern', actionText: 'Click Here', type: 'syllabus', url: 'https://', isPrimary: false }
                            ]
                          });
                          showToast('Added "Syllabus" link!');
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 border border-slate-300 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Syllabus PDF
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            directLinks: [
                              ...editingPost.directLinks,
                              { label: 'Official Website', actionText: 'Click Here', type: 'official', url: 'https://', isPrimary: false }
                            ]
                          });
                          showToast('Added "Official Website" link!');
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-800 border border-slate-300 px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Official Website
                      </button>
                    </div>
                  </div>

                  {/* Links List */}
                  <div className="space-y-3">
                    {editingPost.directLinks.map((link, idx) => (
                      <div key={idx} className="bg-white border border-slate-300 p-3 rounded space-y-2 shadow-2xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600">Link Label</label>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                const updated = [...editingPost.directLinks];
                                updated[idx].label = e.target.value;
                                setEditingPost({ ...editingPost, directLinks: updated });
                              }}
                              placeholder="e.g. Apply Online / Candidate Login"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600">Button Text</label>
                            <input
                              type="text"
                              value={link.actionText}
                              onChange={(e) => {
                                const updated = [...editingPost.directLinks];
                                updated[idx].actionText = e.target.value;
                                setEditingPost({ ...editingPost, directLinks: updated });
                              }}
                              placeholder="e.g. Click Here / Registration / Login"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600">Link Type</label>
                            <select
                              value={link.type}
                              onChange={(e: any) => {
                                const updated = [...editingPost.directLinks];
                                updated[idx].type = e.target.value;
                                setEditingPost({ ...editingPost, directLinks: updated });
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold bg-white"
                            >
                              <option value="apply">Apply Online / Registration</option>
                              <option value="exam_city">Exam City Slip / Status</option>
                              <option value="admit_card">Admit Card Link</option>
                              <option value="answer_key">Answer Key Link</option>
                              <option value="result">Result Link</option>
                              <option value="notification">Notification PDF</option>
                              <option value="syllabus">Syllabus PDF</option>
                              <option value="official">Official Website</option>
                              <option value="other">Other Link</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={link.url || ''}
                            onChange={(e) => {
                              const updated = [...editingPost.directLinks];
                              updated[idx].url = e.target.value;
                              setEditingPost({ ...editingPost, directLinks: updated });
                            }}
                            placeholder="Full URL (https://examinationservices.nic.in/... or https://portal.gov.in)"
                            className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono text-slate-800"
                          />
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={link.isPrimary || false}
                              onChange={(e) => {
                                const updated = [...editingPost.directLinks];
                                updated[idx].isPrimary = e.target.checked;
                                setEditingPost({ ...editingPost, directLinks: updated });
                              }}
                            />
                            <span>Primary Action</span>
                          </label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === editingPost.directLinks.length - 1}
                              onClick={() => {
                                if (idx >= editingPost.directLinks.length - 1) return;
                                const list = [...editingPost.directLinks];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                setEditingPost({ ...editingPost, directLinks: list });
                                showToast('लिंक नीचे कर दिया गया है (Link moved down)!');
                              }}
                              className="text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-1 rounded border border-amber-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5"
                              title="इस लिंक को नीचे करें (Move Link Down)"
                            >
                              <span>⬇️</span>
                              <span>नीचे</span>
                            </button>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx === 0) return;
                                const list = [...editingPost.directLinks];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                setEditingPost({ ...editingPost, directLinks: list });
                                showToast('लिंक ऊपर कर दिया गया है (Link moved up)!');
                              }}
                              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5"
                              title="इस लिंक को ऊपर करें (Move Link Up)"
                            >
                              <span>⬆️</span>
                              <span>ऊपर</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPost({
                                  ...editingPost,
                                  directLinks: editingPost.directLinks.filter((_, i) => i !== idx)
                                });
                              }}
                              className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                              title="Delete link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 7: HOW TO APPLY STEPS */}
              <div id="sec-steps" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-2">
                  <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    SECTION 7
                  </span>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    ✍️ How to Apply Online Steps (आवेदन करने के चरण)
                  </h3>
                </div>
                <div className="space-y-3 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Step by Step Instructions for Candidates (1 Step per line):
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const standardSteps = [
                          `${editingPost.department || 'Board'} Recruitment 2026 Notification has been issued. Candidate can apply online between specified dates.`,
                          `Candidate Must Read the Full Gazette Notification Before Apply the Recruitment Application Form.`,
                          `Kindly Check and Collect All Document - Eligibility, ID Proof, Address Details, Basic Details.`,
                          `Kindly Ready Scan Document Related to Recruitment Form - Photo, Sign, ID Proof, Certificate etc.`,
                          `Before Submit the Application Form Must Check the Preview and All Columns Carefully.`,
                          `If Candidate Required to Paying the Application Fee Must Submit. If You have Not the Required Application Fees Your Form is Not Completed.`,
                          `Take A Print Out of Final Submitted Form for Future Reference.`
                        ];
                        setEditingPost({ ...editingPost, howToApplySteps: standardSteps });
                        showToast('Pre-filled standard 7 application steps!');
                      }}
                      className="text-xs bg-slate-800 hover:bg-black text-white px-2.5 py-1 rounded font-bold cursor-pointer"
                    >
                      Pre-fill Standard Steps
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={editingPost.howToApplySteps.join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(l => l.trim().length > 0);
                      setEditingPost({ ...editingPost, howToApplySteps: lines });
                    }}
                    placeholder="Step 1: Visit official website...&#10;Step 2: Complete registration...&#10;Step 3: Upload photograph & signature..."
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 leading-relaxed font-mono bg-white"
                  />
                </div>
              </div>

              {/* SECTION 8: CUSTOM FAQS */}
              <div id="sec-faqs" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-6 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-2">
                  <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    SECTION 8
                  </span>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    ❓ Custom FAQs Manager (सामान्य प्रश्न - उत्तर)
                  </h3>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-xs text-slate-800 space-y-1">
                    <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-700" />
                      <span>Post-Specific Dynamic FAQ Manager (प्रश्न और उत्तर)</span>
                    </div>
                    <p>
                      Add, edit, or delete custom questions and answers specific to this job post. These FAQs will render dynamically at the bottom of the post detail page and update Google Search FAQ Schema JSON-LD.
                    </p>
                  </div>

                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-3 rounded border border-slate-300">
                    <div className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                      <span>Configured FAQs ({editingPost.customFaqs?.length || 0})</span>
                      {editingPost.customFaqs && editingPost.customFaqs.length > 0 && (
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                          Custom FAQs Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const current = editingPost.customFaqs || [];
                          setEditingPost({
                            ...editingPost,
                            customFaqs: [
                              ...current,
                              { question: 'Enter your question here?', answer: 'Enter detailed answer here...' }
                            ]
                          });
                        }}
                        className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded font-bold cursor-pointer transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Question</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (editingPost.customFaqs && editingPost.customFaqs.length > 0) {
                            if (!window.confirm('Replace current FAQs with auto-generated default questions?')) return;
                          }
                          const defaults = getPostFAQs(editingPost);
                          setEditingPost({
                            ...editingPost,
                            customFaqs: JSON.parse(JSON.stringify(defaults))
                          });
                          showToast('Pre-filled 8 default FAQs for editing!');
                        }}
                        className="text-xs bg-slate-800 hover:bg-black text-white px-3 py-1.5 rounded font-bold cursor-pointer transition-colors inline-flex items-center gap-1 shadow-2xs"
                        title="Pre-fill standard 8 questions based on post dates, fee, and eligibility"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Pre-fill Default FAQs</span>
                      </button>

                      {editingPost.customFaqs && editingPost.customFaqs.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Clear custom FAQs? System will fall back to auto-generated default questions.')) {
                              setEditingPost({ ...editingPost, customFaqs: [] });
                              showToast('Cleared custom FAQs.');
                            }
                          }}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 px-2.5 py-1.5 rounded font-bold cursor-pointer transition-colors"
                        >
                          Clear FAQs
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FAQ Items List */}
                  {(!editingPost.customFaqs || editingPost.customFaqs.length === 0) ? (
                    <div className="border border-dashed border-slate-300 p-8 text-center rounded bg-slate-50 space-y-3">
                      <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">No Custom FAQs Configured</p>
                        <p className="text-xs text-slate-600 mt-1 max-w-lg mx-auto">
                          This post currently displays 8 auto-generated standard FAQs (Application Last Date, Age Limit, Vacancies, Fee, Qualifications, Pay Scale, Selection Process, and How to Apply).
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const defaults = getPostFAQs(editingPost);
                            setEditingPost({ ...editingPost, customFaqs: JSON.parse(JSON.stringify(defaults)) });
                          }}
                          className="px-4 py-2 bg-[#ab1616] hover:bg-red-800 text-white rounded text-xs font-bold cursor-pointer shadow-xs"
                        >
                          Load Default FAQs to Customize
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPost({
                              ...editingPost,
                              customFaqs: [{ question: 'What is the last date to apply online?', answer: 'The last date is mentioned in official notification.' }]
                            });
                          }}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold cursor-pointer"
                        >
                          + Create New FAQ From Scratch
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editingPost.customFaqs.map((faq, idx) => (
                        <div key={idx} className="bg-white border border-slate-300 rounded p-4 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-[#cc0000] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                Q.{idx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-600">
                                FAQ Question #{idx + 1}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const list = [...(editingPost.customFaqs || [])];
                                  const temp = list[idx];
                                  list[idx] = list[idx - 1];
                                  list[idx - 1] = temp;
                                  setEditingPost({ ...editingPost, customFaqs: list });
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs font-bold cursor-pointer transition-colors"
                                title="Move Question Up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={idx === (editingPost.customFaqs?.length || 1) - 1}
                                onClick={() => {
                                  const list = [...(editingPost.customFaqs || [])];
                                  const temp = list[idx];
                                  list[idx] = list[idx + 1];
                                  list[idx + 1] = temp;
                                  setEditingPost({ ...editingPost, customFaqs: list });
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs font-bold cursor-pointer transition-colors"
                                title="Move Question Down"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...(editingPost.customFaqs || [])];
                                  list.splice(idx + 1, 0, JSON.parse(JSON.stringify(faq)));
                                  setEditingPost({ ...editingPost, customFaqs: list });
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold cursor-pointer transition-colors"
                                title="Duplicate Question"
                              >
                                Duplicate
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = (editingPost.customFaqs || []).filter((_, i) => i !== idx);
                                  setEditingPost({ ...editingPost, customFaqs: list });
                                }}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer transition-colors"
                                title="Delete Question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Question (प्रश्न) :
                            </label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const list = [...(editingPost.customFaqs || [])];
                                list[idx].question = e.target.value;
                                setEditingPost({ ...editingPost, customFaqs: list });
                              }}
                              placeholder="e.g. What is the last date to apply online for this post?"
                              className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:border-red-700"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Answer (उत्तर) :
                            </label>
                            <textarea
                              rows={3}
                              value={faq.answer}
                              onChange={(e) => {
                                const list = [...(editingPost.customFaqs || [])];
                                list[idx].answer = e.target.value;
                                setEditingPost({ ...editingPost, customFaqs: list });
                              }}
                              placeholder="e.g. Candidates can fill online form before the deadline specified..."
                              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-red-700 font-sans"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions Bar - Optimized for Mobile & Desktop */}
              <div className="border border-slate-300 py-3 px-3 sm:px-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between sticky bottom-0 bg-white rounded-none sm:rounded shadow-lg z-20 mt-4 gap-2.5">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-center"
                  >
                    Cancel & Discard
                  </button>
                  {!isCreatingNew && (
                    <button
                      type="button"
                      onClick={() => setPostToDelete(editingPost)}
                      className="flex-1 sm:flex-none px-3.5 py-2.5 sm:py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 rounded text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      title="Permanently delete this post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete (हटाएं)</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#ab1616] hover:bg-red-800 text-white font-black text-sm px-6 py-3 sm:py-2.5 rounded shadow-md cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isCreatingNew ? 'Save New Post (नई पोस्ट सेव करें)' : 'Save Changes (अपडेट सेव करें)'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Direct Editor Prompt if editingPost is unselected */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3 bg-white">
            <div className="w-14 h-14 bg-red-50 text-[#ab1616] rounded-full flex items-center justify-center text-2xl shadow-inner mx-auto">
              ⚡
            </div>
            <h4 className="text-base font-black text-slate-900">
              संपूर्ण पोस्ट संपादक (Full Admin Post Editor)
            </h4>
            <p className="text-xs text-slate-500 max-w-md">
              प्रत्येक बॉक्स, पद विवरण, वेतन सारणी, परीक्षा पैटर्न और लिंक्स को आसानी से अपडेट करें।
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (posts.length > 0) handleStartEdit(posts[0]);
                  else handleStartCreate();
                }}
                className="bg-[#ab1616] hover:bg-red-800 text-white px-4 py-2 rounded text-xs font-black cursor-pointer shadow-xs"
              >
                पोस्ट लोड करें व एडिट करें
              </button>
              <button
                type="button"
                onClick={handleStartCreate}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-xs font-black cursor-pointer shadow-xs"
              >
                + नई पोस्ट बनाएं
              </button>
            </div>
          </div>
        )}

        {/* Custom Non-blocking Delete Confirmation Modal */}
        {postToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-2xl border-2 border-red-300 space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Delete Post Confirmation</h3>
                  <p className="text-xs text-slate-500">क्या आप वाकई इस पोस्ट को हटाना चाहते हैं?</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900 text-sm leading-snug">{postToDelete.title}</div>
                <div className="text-slate-500 text-[11px]">
                  <strong>Category:</strong> {postToDelete.category} • <strong>ID:</strong> {postToDelete.id}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                यह पोस्ट पोर्टल और सभी सेक्शन्स से तुरंत हटा दी जाएगी। क्या आप आगे बढ़ना चाहते हैं?
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPostToDelete(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel (रद्द करें)
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete (हाँ, पोस्ट हटाएं)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Non-blocking Reset Confirmation Modal */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-2xl border-2 border-amber-300 space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Reset All Posts to Default?</h3>
                  <p className="text-xs text-slate-500">सभी आधिकारिक डिफ़ॉल्ट पोस्ट्स को पुनर्स्थापित करें?</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                वेबसाइट की सभी 87+ मूल डिफ़ॉल्ट सरकारी पोस्ट्स पुनः लोड हो जाएंगी।
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel (रद्द करें)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetToDefault();
                    setIsResetConfirmOpen(false);
                    showToast('All 87+ official posts reset to defaults!');
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Confirm Reset (रीसेट करें)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google Search Console Indexing Manager Modal */}
        <GoogleIndexationManager
          posts={posts}
          isOpen={isGscModalOpen}
          onClose={() => setIsGscModalOpen(false)}
        />
      </div>
    </div>
  );
};
