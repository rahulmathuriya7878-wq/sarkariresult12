import React, { useState, useMemo } from 'react';
import { 
  SarkariPost, 
  PostCategory, 
  Department, 
  Qualification, 
  SalaryBand,
  ApplicationFeeItem,
  ImportantDateItem,
  DirectLinkItem,
  VacancyBreakdown
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
  HelpCircle
} from 'lucide-react';
import { getPostFAQs } from '../FullPagePostView';

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
  onSelectPost
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sarkari_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Filter & Search in Table
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor State
  const [editingPost, setEditingPost] = useState<SarkariPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'dates_fees' | 'links' | 'vacancy' | 'faqs'>('basic');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const ADMIN_PASSWORD = '78787739277877139203';

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sarkari_admin_auth', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
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

  // Delete a Post
  const handleDelete = (post: SarkariPost) => {
    if (window.confirm(`Are you sure you want to permanently delete: "${post.shortTitle}"?`)) {
      onDeletePost(post.id);
      if (editingPost?.id === post.id) {
        setEditingPost(null);
      }
      showToast(`Post "${post.shortTitle}" deleted!`);
    }
  };

  // Save changes
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (!editingPost.title.trim() || !editingPost.shortTitle.trim()) {
      alert('Please provide both Title and Short Title.');
      return;
    }

    // Auto-generate slug if blank
    if (!editingPost.slug.trim()) {
      editingPost.slug = editingPost.shortTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (isCreatingNew) {
      onAddPost(editingPost);
      showToast(`New post "${editingPost.shortTitle}" added!`);
    } else {
      onUpdatePost(editingPost);
      showToast(`Post "${editingPost.shortTitle}" updated successfully!`);
    }

    setEditingPost(null);
    setIsCreatingNew(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-6xl h-[94vh] max-h-[94vh] rounded-md shadow-2xl border-2 border-slate-700 flex flex-col overflow-hidden relative text-slate-800">
        
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
            <div>
              <h2 className="font-black text-lg sm:text-xl tracking-tight leading-none uppercase">
                Sarkari Result · Admin Management Panel
              </h2>
              <p className="text-[11px] text-red-100 font-medium">
                Live Post Editor, Create, Modify, Reorder & Manage All 100+ Portal Posts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1 text-xs bg-red-900 hover:bg-red-950 text-white px-2.5 py-1.5 rounded font-bold cursor-pointer transition-colors"
                title="Sign out of admin"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock / Exit</span>
              </button>
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
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Enter Admin Password"
                    className={`w-full px-3 py-2 border rounded text-sm focus:outline-none ${
                      pinError ? 'border-red-600 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                    }`}
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-red-600 font-bold mt-1">
                      Incorrect Password! Please enter the authorized Admin Password.
                    </p>
                  )}
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
            {/* Editor Subheader / Vertical Navigation Sidebar */}
            <div className="bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 px-4 py-3 flex flex-col md:w-60 shrink-0 gap-3">
              <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 hover:text-black bg-white border border-slate-300 px-3 py-2 rounded cursor-pointer transition-colors shadow-2xs w-full"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Posts List</span>
                </button>
                <div className="text-xs font-black text-slate-900 uppercase tracking-tight truncate w-full">
                  {isCreatingNew ? 'Create New Post' : `Editing: ${editingPost.shortTitle || editingPost.title}`}
                </div>
              </div>

              {/* Vertical Section Quick Navigation Links */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <div className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Vertical Sections
                </div>
                <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
                  <a
                    href="#sec-basic"
                    className="px-3 py-2 rounded text-xs font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-2 transition-colors shadow-2xs"
                  >
                    <span>📍</span>
                    <span>1. General Info</span>
                  </a>
                  <a
                    href="#sec-dates-fees"
                    className="px-3 py-2 rounded text-xs font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-2 transition-colors shadow-2xs"
                  >
                    <span>📅</span>
                    <span>2. Dates & Fees</span>
                  </a>
                  <a
                    href="#sec-links"
                    className="px-3 py-2 rounded text-xs font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-2 transition-colors shadow-2xs"
                  >
                    <span>🔗</span>
                    <span>3. Direct Links</span>
                  </a>
                  <a
                    href="#sec-vacancy"
                    className="px-3 py-2 rounded text-xs font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-2 transition-colors shadow-2xs"
                  >
                    <span>📊</span>
                    <span>4. Vacancies & Steps</span>
                  </a>
                  <a
                    href="#sec-faqs"
                    className="px-3 py-2 rounded text-xs font-bold bg-white hover:bg-red-50 text-slate-800 border border-slate-200 shrink-0 flex items-center gap-2 transition-colors shadow-2xs"
                  >
                    <span>❓</span>
                    <span>5. FAQs ({editingPost.customFaqs?.length || 0})</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Form Fields - All Sections Stacked Vertically */}
            <form onSubmit={handleSavePost} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
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
                        Post Date / Timestamp
                      </label>
                      <input
                        type="text"
                        value={editingPost.postDate}
                        onChange={(e) => setEditingPost({ ...editingPost, postDate: e.target.value })}
                        placeholder="e.g. 19 October 2026"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-red-700"
                      />
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

              {/* SECTION 3: DIRECT OFFICIAL LINKS */}
              <div id="sec-links" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-2">
                  <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    SECTION 3
                  </span>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    🔗 Direct Important Links (आधिकारिक डायरेक्ट लिंक)
                  </h3>
                </div>
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase">
                        Direct Important Links
                      </h4>
                      <p className="text-xs text-slate-500">
                        Links for Apply Online, Candidate Login, Notification PDF, Official Portal, etc.
                      </p>
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

                  <div className="space-y-3">
                    {editingPost.directLinks.map((link, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-300 p-3 rounded space-y-2">
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
                              <option value="notification">Notification PDF</option>
                              <option value="syllabus">Syllabus PDF</option>
                              <option value="admit_card">Admit Card Link</option>
                              <option value="result">Result Link</option>
                              <option value="answer_key">Answer Key Link</option>
                              <option value="official">Official Website</option>
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
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 4: VACANCIES & STEPS */}
              <div id="sec-vacancy" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-6 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-2">
                  <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    SECTION 4
                  </span>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    📊 Vacancies Breakdown & Application Steps (पद संख्या व प्रक्रिया)
                  </h3>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Vacancy Breakdown */}
                  <div className="border border-slate-300 rounded overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                      <span className="text-xs font-black uppercase text-slate-800">
                        Post-wise Vacancy & Eligibility
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost({
                            ...editingPost,
                            vacancyBreakdown: [
                              ...editingPost.vacancyBreakdown,
                              { postName: 'Post Name', totalPosts: '0', eligibility: 'Educational qualification details' }
                            ]
                          });
                        }}
                        className="text-xs bg-slate-800 hover:bg-black text-white px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        + Add Post Breakdown
                      </button>
                    </div>
                    <div className="p-3 space-y-3">
                      {editingPost.vacancyBreakdown.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.postName}
                              onChange={(e) => {
                                const updated = [...editingPost.vacancyBreakdown];
                                updated[idx].postName = e.target.value;
                                setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                              }}
                              placeholder="Post Name (e.g. Junior Court Attendant)"
                              className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={item.totalPosts}
                              onChange={(e) => {
                                const updated = [...editingPost.vacancyBreakdown];
                                updated[idx].totalPosts = e.target.value;
                                setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                              }}
                              placeholder="Total Posts (e.g. 130)"
                              className="w-32 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPost({
                                  ...editingPost,
                                  vacancyBreakdown: editingPost.vacancyBreakdown.filter((_, i) => i !== idx)
                                });
                              }}
                              className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={item.eligibility}
                            onChange={(e) => {
                              const updated = [...editingPost.vacancyBreakdown];
                              updated[idx].eligibility = e.target.value;
                              setEditingPost({ ...editingPost, vacancyBreakdown: updated });
                            }}
                            placeholder="Eligibility criteria for this post..."
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How to Apply Steps */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      How to Apply Steps (1 Step per line):
                    </label>
                    <textarea
                      rows={5}
                      value={editingPost.howToApplySteps.join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n').filter(l => l.trim().length > 0);
                        setEditingPost({ ...editingPost, howToApplySteps: lines });
                      }}
                      placeholder="Step 1: Visit official website...&#10;Step 2: Complete registration...&#10;Step 3: Upload photograph & signature..."
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 leading-relaxed font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: CUSTOM FAQS */}
              <div id="sec-faqs" className="bg-slate-50 border border-slate-200 rounded-md p-4 sm:p-5 space-y-6 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-2">
                  <span className="bg-[#ab1616] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    SECTION 5
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

              {/* Bottom Actions Bar */}
              <div className="border border-slate-300 pt-3 pb-3 px-4 flex items-center justify-between sticky bottom-0 bg-white rounded shadow-md z-20 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel & Discard
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-[#ab1616] hover:bg-red-800 text-white font-black text-sm px-6 py-2.5 rounded shadow-md cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isCreatingNew ? 'Save New Post' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* POSTS LIST DASHBOARD VIEW */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Toolbar - Clean Vertical Stack */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 shrink-0 space-y-3">
              {/* Vertical Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <button
                  onClick={handleStartCreate}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#ab1616] hover:bg-red-800 text-white px-4 py-2.5 rounded text-xs font-black shadow-xs cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Post (नई पोस्ट जोड़ें)</span>
                </button>

                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <button
                    onClick={onResetToDefault}
                    className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors"
                    title="Reset all posts to default dataset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded font-bold cursor-pointer"
                    title="Export posts as JSON file"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Export JSON</span>
                  </button>

                  <label className="inline-flex items-center gap-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded font-bold cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-blue-700" />
                    <span>Import JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts by title, short title, department, state..."
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs font-medium bg-white focus:outline-none focus:border-red-700"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="flex-1 sm:flex-initial px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold bg-white text-slate-700 focus:outline-none focus:border-red-700"
                  >
                    <option value="all">All Categories ({posts.length})</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label.split(' ')[0]} ({posts.filter(p => p.category === c.value).length})
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="flex-1 sm:flex-initial px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold bg-white text-slate-700 focus:outline-none focus:border-red-700"
                  >
                    <option value="all">All Depts</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Posts Count Chip */}
            <div className="px-4 py-2 bg-slate-200 border-b border-slate-300 text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Showing {filteredPosts.length} of {posts.length} Total Posts (100+ Capacity Active)</span>
              <span className="text-[11px] text-slate-500">Click Edit to modify dates, titles, or links in real-time</span>
            </div>

            {/* Posts Table List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200 bg-white">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="bg-[#ab1616] text-white px-1.5 py-0.5 rounded font-black uppercase text-[10px]">
                        {post.category.replace('_', ' ')}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold border border-slate-300">
                        {post.department}
                      </span>
                      {post.isNew && (
                        <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                          NEW
                        </span>
                      )}
                      {post.isHot && (
                        <span className="bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded font-bold text-[10px]">
                          HOT
                        </span>
                      )}
                      <span className="text-slate-400 font-mono text-[10px]">ID: {post.id}</span>
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#0000cc] transition-colors leading-snug">
                      {post.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span><strong>Short:</strong> {post.shortTitle}</span>
                      {post.totalVacancies && (
                        <span><strong>Vacancies:</strong> {post.totalVacancies}</span>
                      )}
                      {post.lastDate && (
                        <span className="text-red-700 font-bold">
                          <strong>Last Date:</strong> {post.lastDate}
                        </span>
                      )}
                      {post.examDate && (
                        <span><strong>Exam:</strong> {post.examDate}</span>
                      )}
                      {post.postDate && (
                        <span><strong>Posted:</strong> {post.postDate}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {onSelectPost && (
                      <button
                        onClick={() => {
                          onSelectPost(post);
                          onClose();
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Preview post details page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">View</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleStartEdit(post)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit this post"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDuplicatePost(post)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      title="Duplicate as new post"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Clone</span>
                    </button>

                    <button
                      onClick={() => handleDelete(post)}
                      className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-medium">
                  <p>No posts match the current filter or search criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('all');
                      setFilterDept('all');
                    }}
                    className="mt-2 text-xs text-[#ab1616] font-bold hover:underline cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
