/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { mockSarkariPosts } from './data/mockJobs';
import { SarkariPost, PostCategory, Department, Qualification, SalaryBand } from './types/job';
import { Header } from './components/Header';
import { QuickHighlightsGrid } from './components/QuickHighlightsGrid';
import { FastUpdatesGrid } from './components/FastUpdatesGrid';
import { SarkariFooter } from './components/SarkariFooter';
import { CategoryDetailView } from './components/CategoryDetailView';
import { FullPagePostView } from './components/FullPagePostView';
import { FloatingShareButton } from './components/FloatingShareButton';

import { getVisitedPostIds, markPostVisited } from './utils/visitedPosts';
import { checkAndNotifyPostStatusChanges } from './utils/alertManager';

import { AdminEditingPanelModal } from './components/admin/AdminEditingPanelModal';
import { AgeCalculatorModal } from './components/tools/AgeCalculatorModal';
import { PhotoResizerTool } from './components/tools/PhotoResizerTool';
import { EligibilityMatcherModal } from './components/tools/EligibilityMatcherModal';
import { BookmarkedJobsModal } from './components/BookmarkedJobsModal';
import { JobAlertsModal } from './components/JobAlertsModal';

const getPostSalaryBand = (post: SarkariPost): SalaryBand => {
  if (post.salaryBand) return post.salaryBand;
  if (post.department === 'UPSC') return 'Above 1 Lakh';
  if (post.department === 'Medical' || post.department === 'Engineering') return '50K - 1 Lakh';
  const titleLower = (post.title + ' ' + post.slug).toLowerCase();
  if (titleLower.includes('anganwadi') || titleLower.includes('apprentice') || titleLower.includes('peon')) {
    return 'Below 25K';
  }
  if (titleLower.includes('police') || titleLower.includes('constable') || titleLower.includes('group d') || titleLower.includes('mts')) {
    return '25K - 50K';
  }
  return '25K - 50K';
};

export default function App() {
  // Master Posts State (Prioritizes code updates and mock posts over stale storage cache)
  const [allPosts, setAllPosts] = useState<SarkariPost[]>(() => {
    try {
      const saved = localStorage.getItem('sarkari_admin_posts_v5');
      let customAdminPosts: SarkariPost[] = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const mockIds = new Set(mockSarkariPosts.map(p => p.id));
          customAdminPosts = parsed.filter((p: SarkariPost) => !mockIds.has(p.id));
        }
      }
      return [...mockSarkariPosts, ...customAdminPosts];
    } catch (e) {
      console.error('Failed to load posts from storage', e);
    }
    return mockSarkariPosts;
  });

  // Save posts to localStorage and broadcast real-time update whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('sarkari_admin_posts_v5', JSON.stringify(allPosts));
      window.dispatchEvent(new CustomEvent('sarkari_posts_updated', { detail: allPosts }));
    } catch (e) {
      console.error('Failed to save posts', e);
    }
  }, [allPosts]);

  // Real-time event listener for synchronization across components without page refresh
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sarkari_admin_posts_v3' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setAllPosts(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    const handleCustomPostUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setAllPosts(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sarkari_posts_updated', handleCustomPostUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sarkari_posts_updated', handleCustomPostUpdate);
    };
  }, []);

  // Admin Modal state
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Navigation & Category filter state
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedQual, setSelectedQual] = useState<Qualification | 'All'>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedSalary, setSelectedSalary] = useState<SalaryBand>('All');

  // Full-page active post state
  const [selectedPost, setSelectedPost] = useState<SarkariPost | null>(null);

  // Modals state for tools
  const [isAgeCalcOpen, setIsAgeCalcOpen] = useState<boolean>(false);
  const [isPhotoResizerOpen, setIsPhotoResizerOpen] = useState<boolean>(false);
  const [isJobFinderOpen, setIsJobFinderOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isJobAlertsOpen, setIsJobAlertsOpen] = useState<boolean>(false);

  // Global Live Word Edit State across the entire website and all sections
  const [isGlobalWordEditActive, setIsGlobalWordEditActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sarkari_global_word_edit') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleGlobalWordEdit = () => {
    setIsGlobalWordEditActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sarkari_global_word_edit', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Post Mutation Handlers for Admin Panel
  const handleAddPost = (newPost: SarkariPost) => {
    setAllPosts((prev) => [newPost, ...prev]);
  };

  const handleUpdatePost = (updatedPost: SarkariPost) => {
    setAllPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    if (selectedPost && selectedPost.id === updatedPost.id) {
      setSelectedPost(updatedPost);
    }
  };

  const handleDeletePost = (postId: string) => {
    setAllPosts((prev) => prev.filter((p) => p.id !== postId));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleResetToDefault = () => {
    setAllPosts(mockSarkariPosts);
    try {
      localStorage.removeItem('sarkari_admin_posts_v2');
      localStorage.removeItem('sarkari_admin_posts_v3');
      localStorage.setItem('sarkari_admin_posts_v3', JSON.stringify(mockSarkariPosts));
      localStorage.setItem('sarkari_admin_posts_v2', JSON.stringify(mockSarkariPosts));
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-prompt Job Alerts modal for new users on initial visit
  useEffect(() => {
    const hasSeenAlerts = localStorage.getItem('sarkari_job_alerts_seen');
    if (!hasSeenAlerts) {
      const timer = setTimeout(() => {
        setIsJobAlertsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Preference state
  const [isHindi, setIsHindi] = useState<boolean>(false);
  const [isClassicTheme, setIsClassicTheme] = useState<boolean>(false);

  // Bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sarkari_saved_jobs');
      return saved ? JSON.parse(saved) : ['job-1', 'job-2'];
    } catch {
      return ['job-1', 'job-2'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sarkari_saved_jobs', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  // Secret Keyboard Shortcut (Ctrl + Shift + A) & URL check to open Hidden Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    const checkAdminQuery = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setIsAdminOpen(true);
      }
    };

    checkAdminQuery();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkAdminQuery);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkAdminQuery);
    };
  }, []);

  // Handle URL hash routing to open full page for specific post or back to home
  useEffect(() => {
    // Dynamic title management
    if (selectedPost) {
      document.title = `${selectedPost.shortTitle || selectedPost.title} - Sarkari Result`;
    } else {
      document.title = 'Sarkari Result 2026 - Official Job Alerts & Notifications';
    }

    const handleHash = () => {
      // Check if user landed via shared link
      const isShare = 
        window.location.search.toLowerCase().includes('share') || 
        window.location.hash.toLowerCase().includes('share') ||
        (document.referrer && (
          document.referrer.toLowerCase().includes('whatsapp') ||
          document.referrer.toLowerCase().includes('telegram') ||
          document.referrer.toLowerCase().includes('facebook') ||
          document.referrer.toLowerCase().includes('t.co')
        ));
      if (isShare) {
        try {
          sessionStorage.setItem('sarkari_opened_via_share_link', 'true');
        } catch (e) {
          console.error(e);
        }
      }

      const rawHash = window.location.hash.replace('#', '').replace('post/', '').replace('post-', '');
      const cleanSlug = rawHash.split('?')[0].split('&')[0];
      if (cleanSlug) {
        const found = allPosts.find((p) => p.slug === cleanSlug);
        if (found) {
          setSelectedPost(found);
          return;
        }
      }
      // If empty hash or unrecognized, if we are not explicitly setting, leave as is
      if (!window.location.hash) {
        setSelectedPost(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [allPosts]);

  // Monitor status changes for saved post alerts ('Upcoming' -> 'Active')
  useEffect(() => {
    if (allPosts && allPosts.length > 0) {
      checkAndNotifyPostStatusChanges(allPosts);
    }
  }, [allPosts]);

  // Visited Post IDs state for changing link colors on click / view
  const [visitedPostIds, setVisitedPostIds] = useState<Set<string>>(() => getVisitedPostIds());

  const handleOpenPostFullPage = (post: SarkariPost) => {
    setSelectedPost(post);
    setVisitedPostIds(prev => {
      const next = new Set(prev);
      next.add(post.id);
      if (post.slug) next.add(post.slug);
      markPostVisited(post.id);
      if (post.slug) markPostVisited(post.slug);
      return next;
    });
    window.location.hash = `post/${post.slug}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    setSelectedPost(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSlug = (slug: string) => {
    const post = allPosts.find((p) => p.slug === slug);
    if (post) {
      handleOpenPostFullPage(post);
    }
  };

  const handleToggleBookmark = (postId: string) => {
    setBookmarkedIds((prev) => 
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleClearAllBookmarks = () => {
    setBookmarkedIds([]);
  };

  const bookmarkedPosts = useMemo(() => {
    return allPosts.filter((p) => bookmarkedIds.includes(p.id));
  }, [allPosts, bookmarkedIds]);

  // Filtered posts based on search query, department, qualification, state
  const filteredPosts = useMemo(() => {
    let result = allPosts.filter((post) => {
      if (selectedDept !== 'All' && post.department !== selectedDept) return false;
      if (selectedQual !== 'All' && !post.qualifications.includes(selectedQual)) return false;
      if (selectedState !== 'All States') {
        if (post.state !== 'All India' && post.state !== selectedState) return false;
      }
      if (selectedSalary !== 'All') {
        const postBand = getPostSalaryBand(post);
        if (postBand !== selectedSalary) return false;
      }
      return true;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      
      const scored = result.map(post => {
        let score = 0;
        if (post.title.toLowerCase().includes(q)) score += 10;
        if (post.shortTitle.toLowerCase().includes(q)) score += 10;
        if (post.department.toLowerCase().includes(q)) score += 5;
        if (post.shortInfo.toLowerCase().includes(q)) score += 5;
        if (post.state.toLowerCase().includes(q)) score += 3;
        if (post.qualifications.some(qual => qual.toLowerCase().includes(q))) score += 3;
        if (post.hindiTitle && post.hindiTitle.toLowerCase().includes(q)) score += 3;
        return { post, score };
      });

      result = scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.post);
    }
    
    return result;
  }, [allPosts, searchQuery, selectedDept, selectedQual, selectedState, selectedSalary]);

const parsePostDate = (dateStr?: string): number => {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;

  const parts = dateStr.split(/[\/\-\.]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day).getTime();
    }
  }
  return 0;
};

const sortSectionPostsByLatest = (posts: SarkariPost[]): SarkariPost[] => {
  return [...posts].sort((a, b) => {
    // 1. Explicit newest badge prioritization (sabse uper)
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;

    // 2. Hot badge prioritization
    if (a.isHot && !b.isHot) return -1;
    if (!a.isHot && b.isHot) return 1;

    // 3. Post date timestamp descending (most recent date at the top)
    const timeA = parsePostDate(a.postDate);
    const timeB = parsePostDate(b.postDate);
    if (timeA !== timeB) {
      return timeB - timeA;
    }

    return 0;
  });
};

  // Categorized slices - sorted section-wise with latest posts at the very top (sabse uper)
  const results = useMemo(() => sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === 'result')), [filteredPosts]);
  const admitCards = useMemo(() => sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === 'admit_card')), [filteredPosts]);
  const latestJobs = useMemo(() => sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === 'latest_jobs')), [filteredPosts]);
  const answerKeys = useMemo(() => sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === 'answer_key')), [filteredPosts]);
  const syllabi = useMemo(() => sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === 'syllabus')), [filteredPosts]);
  const admissions = useMemo(() => sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === 'admission')), [filteredPosts]);
  const certificates = useMemo(() => sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === 'certificate_verification')), [filteredPosts]);
  const importantServices = useMemo(() => sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === 'important')), [filteredPosts]);

  // Category specific list for drill-down view - also sorted with latest on top
  const categorySpecificPosts = useMemo(() => {
    if (activeCategory === 'all') return [];
    return sortSectionPostsByLatest(filteredPosts.filter((p) => p.category === activeCategory));
  }, [activeCategory, filteredPosts]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedQual('All');
    setSelectedState('All States');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isClassicTheme ? 'bg-[#fffbf0]' : 'bg-slate-50'}`}>
      {/* Global Live Word Edit Status & Control Bar */}
      {isGlobalWordEditActive && (
        <div className="bg-slate-950 text-amber-300 border-b-2 border-amber-400 py-2 px-3 sm:px-6 sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-sans shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <span className="bg-[#ab1616] text-white font-black text-[11px] px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
              LIVE
            </span>
            <span className="font-extrabold text-white text-sm">
              वर्ड एडिट चालू है (LIVE)
            </span>
            <span className="text-amber-200 hidden md:inline font-medium">
              — पूरी वेबसाइट, 8-बॉक्स हेडलाइट और सभी सेक्शन के किसी भी शब्द/शीर्षक पर क्लिक करके तुरंत एडिट करें!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-xs cursor-pointer shadow-xs"
            >
              + नया पोस्ट जोड़ें
            </button>
            <button
              type="button"
              onClick={handleToggleGlobalWordEdit}
              className="bg-amber-400 hover:bg-yellow-300 text-slate-950 font-black px-3 py-1 rounded text-xs cursor-pointer shadow-xs transition-colors"
              title="वर्ड एडिट मोड बंद करें"
            >
              ✕ एडिट मोड बंद करें
            </button>
          </div>
        </div>
      )}

      {/* 1. Header (Classic Sarkari Result Masthead, Black Menu Bar & Integrated Search) */}
      <Header
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setSelectedPost(null);
          setActiveCategory(cat);
          setSearchQuery('');
          setSelectedDept('All');
          setSelectedQual('All');
          setSelectedState('All States');
          setSelectedSalary('All');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bookmarkCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenAgeCalculator={() => setIsAgeCalcOpen(true)}
        onOpenPhotoResizer={() => setIsPhotoResizerOpen(true)}
        onOpenJobFinder={() => setIsJobFinderOpen(true)}
        onOpenJobAlerts={() => setIsJobAlertsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isHindi={isHindi}
        onToggleHindi={() => setIsHindi(!isHindi)}
        isClassicTheme={isClassicTheme}
        onToggleTheme={() => setIsClassicTheme(!isClassicTheme)}
        onSearchFocus={() => {
          document.querySelector('input')?.focus();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPostBySlug={handleSelectSlug}
        allPosts={allPosts}
      />

      {/* 2. Conditional Full Page View or Main Home Portal */}
      {selectedPost ? (
        /* Full Page View when clicking any link */
        <FullPagePostView
          post={selectedPost}
          allPosts={allPosts}
          onBack={handleBackToHome}
          onSelectPost={handleOpenPostFullPage}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          isBookmarked={bookmarkedIds.includes(selectedPost.id)}
          onToggleBookmark={handleToggleBookmark}
          onOpenAgeCalculator={() => setIsAgeCalcOpen(true)}
          onOpenPhotoResizer={() => setIsPhotoResizerOpen(true)}
          isHindi={isHindi}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenDirectEditor={() => setIsAdminOpen(true)}
          isGlobalWordEditActive={isGlobalWordEditActive}
          onToggleGlobalWordEdit={handleToggleGlobalWordEdit}
        />
      ) : (
        /* Home Main View */
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3">
          {/* Quick Highlights 8-box Grid (Headlight: Dynamic Top 8 Latest Posts) */}
          <QuickHighlightsGrid 
            posts={allPosts} 
            onSelectHighlight={handleSelectSlug} 
            visitedPostIds={visitedPostIds}
            bookmarkedIds={bookmarkedIds}
            isGlobalWordEditActive={isGlobalWordEditActive}
            onUpdatePost={handleUpdatePost}
          />

          {/* Active Search / Filter Status Banner */}
          {searchQuery.trim() && (
            <div className="my-3 bg-amber-50 border-2 border-amber-500 p-3 rounded flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span>🔍 Search Results for:</span>
                <span className="text-[#ab1616] font-black underline">"{searchQuery}"</span>
                <span className="text-xs bg-amber-200 px-2 py-0.5 rounded text-amber-900 font-extrabold">
                  {filteredPosts.length} Results Found
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs bg-[#ab1616] hover:bg-red-800 text-white font-bold px-3 py-1 rounded cursor-pointer"
              >
                Clear Search & Show All
              </button>
            </div>
          )}

          {/* Dynamic Content: Drill-down Category view or Authentic 3-Column Tables */}
          {activeCategory !== 'all' ? (
            <CategoryDetailView
              category={activeCategory}
              posts={categorySpecificPosts}
              onSelectPost={handleOpenPostFullPage}
              onBackToHome={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setSelectedDept('All');
                setSelectedQual('All');
                setSelectedState('All States');
                setSelectedSalary('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isHindi={isHindi}
              visitedPostIds={visitedPostIds}
              isGlobalWordEditActive={isGlobalWordEditActive}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
              onAddNewPost={() => setIsAdminOpen(true)}
            />
          ) : (
            <>
              {/* Primary Grid: Result | Latest Jobs / Admit Card (Authentic 2-Col Mobile & 3-Col Desktop) */}
              <FastUpdatesGrid
                results={results}
                admitCards={admitCards}
                latestJobs={latestJobs}
                answerKeys={answerKeys}
                syllabi={syllabi}
                important={importantServices}
                admissions={admissions}
                certificates={certificates}
                onSelectPost={handleOpenPostFullPage}
                onViewCategory={(cat) => {
                  setSelectedPost(null);
                  setActiveCategory(cat);
                  setSearchQuery('');
                  setSelectedDept('All');
                  setSelectedQual('All');
                  setSelectedState('All States');
                  setSelectedSalary('All');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isHindi={isHindi}
                onOpenAppInfo={() => setIsJobAlertsOpen(true)}
                visitedPostIds={visitedPostIds}
                isGlobalWordEditActive={isGlobalWordEditActive}
                onUpdatePost={handleUpdatePost}
                onAddNewPost={() => setIsAdminOpen(true)}
                onDeletePost={handleDeletePost}
              />

            </>
          )}
        </main>
      )}

      {/* 4. Footer (Authentic Sarkari Result 4-Column Directory & Legal Section) */}
      <SarkariFooter
        onOpenAgeCalculator={() => setIsAgeCalcOpen(true)}
        onOpenPhotoResizer={() => setIsPhotoResizerOpen(true)}
        onOpenJobFinder={() => setIsJobFinderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectPost={handleOpenPostFullPage}
        onOpenPostBySlug={handleSelectSlug}
        isHindi={isHindi}
        onCategoryChange={(cat) => {
          setSelectedPost(null);
          setActiveCategory(cat);
          setSearchQuery('');
          setSelectedDept('All');
          setSelectedQual('All');
          setSelectedState('All States');
          setSelectedSalary('All');
        }}
        onSelectDept={(dept) => {
          setSelectedPost(null);
          setActiveCategory('all');
          setSelectedDept(dept);
          setSearchQuery('');
          setSelectedQual('All');
          setSelectedState('All States');
          setSelectedSalary('All');
        }}
        onSelectState={(state) => {
          setSelectedPost(null);
          setActiveCategory('all');
          setSelectedState(state);
          setSearchQuery('');
          setSelectedDept('All');
          setSelectedQual('All');
          setSelectedSalary('All');
        }}
        onSearchQuery={(q) => {
          setSelectedPost(null);
          setActiveCategory('all');
          setSearchQuery(q);
          setSelectedDept('All');
          setSelectedQual('All');
          setSelectedState('All States');
          setSelectedSalary('All');
        }}
      />

      {/* Candidate Tools Modals */}
      {isAgeCalcOpen && (
        <AgeCalculatorModal
          isOpen={isAgeCalcOpen}
          onClose={() => setIsAgeCalcOpen(false)}
        />
      )}

      {isPhotoResizerOpen && (
        <PhotoResizerTool
          isOpen={isPhotoResizerOpen}
          onClose={() => setIsPhotoResizerOpen(false)}
        />
      )}

      {isJobFinderOpen && (
        <EligibilityMatcherModal
          isOpen={isJobFinderOpen}
          onClose={() => setIsJobFinderOpen(false)}
          posts={allPosts}
          onSelectPost={handleOpenPostFullPage}
        />
      )}

      {isBookmarksOpen && (
        <BookmarkedJobsModal
          isOpen={isBookmarksOpen}
          onClose={() => setIsBookmarksOpen(false)}
          bookmarkedPosts={bookmarkedPosts}
          onSelectPost={handleOpenPostFullPage}
          onRemoveBookmark={handleToggleBookmark}
          onClearAll={handleClearAllBookmarks}
        />
      )}

      {isJobAlertsOpen && (
        <JobAlertsModal
          isOpen={isJobAlertsOpen}
          onClose={() => setIsJobAlertsOpen(false)}
        />
      )}

      {/* Admin Post Editing & Management Panel */}
      {isAdminOpen && (
        <AdminEditingPanelModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          posts={allPosts}
          onAddPost={handleAddPost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          onResetToDefault={handleResetToDefault}
          onSelectPost={handleOpenPostFullPage}
          initialPostToEdit={selectedPost}
          isHindi={isHindi}
        />
      )}

      <FloatingShareButton currentPost={selectedPost} isHindi={isHindi} />

      {/* Floating Live Word Edit Quick Toggle Pill (Accessible anywhere across the site) */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          type="button"
          onClick={handleToggleGlobalWordEdit}
          className={`font-black text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-all border ${
            isGlobalWordEditActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-300 ring-4 ring-emerald-300/40 animate-pulse'
              : 'bg-slate-950 hover:bg-neutral-800 text-amber-300 border-amber-400 hover:scale-105'
          }`}
          title="पूरी वेबसाइट पर वर्ड एडिट चालू/बंद करें"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isGlobalWordEditActive ? 'bg-white animate-ping' : 'bg-emerald-400'}`}></span>
          <span>{isGlobalWordEditActive ? '🟢 वर्ड एडिट चालू है (LIVE)' : '✏️ वर्ड एडिट चालू करें (LIVE)'}</span>
        </button>
      </div>

    </div>
  );
}
