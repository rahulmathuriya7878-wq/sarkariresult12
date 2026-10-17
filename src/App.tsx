/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { mockSarkariPosts } from './data/mockJobs';
import { SarkariPost, PostCategory, Department, Qualification, SalaryBand } from './types/job';
import { Header } from './components/Header';
import { MarqueeTicker } from './components/MarqueeTicker';
import { QuickHighlightsGrid } from './components/QuickHighlightsGrid';
import { SarkariThreeColumnGrid } from './components/SarkariThreeColumnGrid';
import { SarkariFooter } from './components/SarkariFooter';
import { BackToTop } from './components/BackToTop';
import { CriticalAlertBanner } from './components/CriticalAlertBanner';

// Lazy-loaded secondary grids and detailed views (Code-splitting)
const SarkariSecondaryGrid = lazy(() => 
  import('./components/SarkariSecondaryGrid').then((m) => ({ default: m.SarkariSecondaryGrid }))
);
const CertificateVerificationSection = lazy(() => 
  import('./components/CertificateVerificationSection').then((m) => ({ default: m.CertificateVerificationSection }))
);
const CategoryDetailView = lazy(() => 
  import('./components/CategoryDetailView').then((m) => ({ default: m.CategoryDetailView }))
);
const FullPagePostView = lazy(() => 
  import('./components/FullPagePostView').then((m) => ({ default: m.FullPagePostView }))
);
const SarkariFAQSection = lazy(() => 
  import('./components/SarkariFAQSection').then((m) => ({ default: m.SarkariFAQSection }))
);

// Lazy-loaded modal components (Loaded only on user interaction)
const AgeCalculatorModal = lazy(() => 
  import('./components/tools/AgeCalculatorModal').then((m) => ({ default: m.AgeCalculatorModal }))
);
const PhotoResizerTool = lazy(() => 
  import('./components/tools/PhotoResizerTool').then((m) => ({ default: m.PhotoResizerTool }))
);
const EligibilityMatcherModal = lazy(() => 
  import('./components/tools/EligibilityMatcherModal').then((m) => ({ default: m.EligibilityMatcherModal }))
);
const BookmarkedJobsModal = lazy(() => 
  import('./components/BookmarkedJobsModal').then((m) => ({ default: m.BookmarkedJobsModal }))
);
const SitemapModal = lazy(() => 
  import('./components/SitemapModal').then((m) => ({ default: m.SitemapModal }))
);
const JobAlertsModal = lazy(() => 
  import('./components/JobAlertsModal').then((m) => ({ default: m.JobAlertsModal }))
);

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
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isJobAlertsOpen, setIsJobAlertsOpen] = useState<boolean>(false);

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

  // Handle URL hash routing to open full page for specific post or back to home
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').replace('post/', '').replace('post-', '');
      if (hash) {
        const found = mockSarkariPosts.find((p) => p.slug === hash);
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
  }, []);

  const handleOpenPostFullPage = (post: SarkariPost) => {
    setSelectedPost(post);
    window.location.hash = `post/${post.slug}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    setSelectedPost(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSlug = (slug: string) => {
    const post = mockSarkariPosts.find((p) => p.slug === slug);
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
    return mockSarkariPosts.filter((p) => bookmarkedIds.includes(p.id));
  }, [bookmarkedIds]);

  // Filtered posts based on search query, department, qualification, state
  const filteredPosts = useMemo(() => {
    return mockSarkariPosts.filter((post) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesText = 
          post.title.toLowerCase().includes(q) ||
          post.shortTitle.toLowerCase().includes(q) ||
          post.department.toLowerCase().includes(q) ||
          post.state.toLowerCase().includes(q) ||
          post.shortInfo.toLowerCase().includes(q) ||
          (post.hindiTitle && post.hindiTitle.toLowerCase().includes(q)) ||
          post.qualifications.some((qual) => qual.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      if (selectedDept !== 'All' && post.department !== selectedDept) {
        return false;
      }

      if (selectedQual !== 'All' && !post.qualifications.includes(selectedQual)) {
        return false;
      }

      if (selectedState !== 'All States') {
        if (post.state !== 'All India' && post.state !== selectedState) {
          return false;
        }
      }

      if (selectedSalary !== 'All') {
        const postBand = getPostSalaryBand(post);
        if (postBand !== selectedSalary) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedDept, selectedQual, selectedState, selectedSalary]);

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
      {/* 1. Header (Compact, sleek, no bulky pill buttons banner) */}
      <Header
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setSelectedPost(null);
          setActiveCategory(cat);
        }}
        bookmarkCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenAgeCalculator={() => setIsAgeCalcOpen(true)}
        onOpenPhotoResizer={() => setIsPhotoResizerOpen(true)}
        onOpenJobFinder={() => setIsJobFinderOpen(true)}
        onOpenJobAlerts={() => setIsJobAlertsOpen(true)}
        isHindi={isHindi}
        onToggleHindi={() => setIsHindi(!isHindi)}
        isClassicTheme={isClassicTheme}
        onToggleTheme={() => setIsClassicTheme(!isClassicTheme)}
        onSearchFocus={() => {
          document.querySelector('input')?.focus();
        }}
      />

      {/* 2. "Latest ko sabse uper": Flash Ticker right at the top */}
      <MarqueeTicker onSelectAlert={handleSelectSlug} />

      {/* Critical Urgent Update Banner */}
      <CriticalAlertBanner onSelectSlug={handleSelectSlug} />

      {/* 3. Conditional Full Page View or Main Home Portal */}
      {selectedPost ? (
        /* Full Page View when clicking any link */
        <Suspense fallback={
          <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-600 font-bold animate-pulse">
            <div className="inline-block p-4 bg-white border border-slate-300 rounded shadow-xs">
              Loading Official Post Details...
            </div>
          </div>
        }>
          <FullPagePostView
            post={selectedPost}
            onBack={handleBackToHome}
            isBookmarked={bookmarkedIds.includes(selectedPost.id)}
            onToggleBookmark={handleToggleBookmark}
            onOpenAgeCalculator={() => setIsAgeCalcOpen(true)}
            onOpenPhotoResizer={() => setIsPhotoResizerOpen(true)}
            isHindi={isHindi}
            onSelectPost={handleOpenPostFullPage}
          />
        </Suspense>
      ) : (
        /* Home Main View */
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3">
          {/* Quick Highlights 8-box Grid (Top Trending Vacancies) */}
          <QuickHighlightsGrid onSelectHighlight={handleSelectSlug} />

          {/* Dynamic Content: Drill-down Category view or Authentic 3-Column Tables */}
          {activeCategory !== 'all' ? (
            <Suspense fallback={
              <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-600 font-bold animate-pulse">
                <div className="inline-block p-4 bg-white border border-slate-300 rounded shadow-xs">
                  Loading Category Posts...
                </div>
              </div>
            }>
              <CategoryDetailView
                category={activeCategory}
                posts={categorySpecificPosts}
                onSelectPost={handleOpenPostFullPage}
                onBackToHome={() => setActiveCategory('all')}
                isHindi={isHindi}
              />
            </Suspense>
          ) : (
            <>
              {/* Primary 3-Column Core Grid: Result | Admit Card | Latest Jobs */}
              <SarkariThreeColumnGrid
                results={results}
                admitCards={admitCards}
                latestJobs={latestJobs}
                onSelectPost={handleOpenPostFullPage}
                onViewCategory={(cat) => setActiveCategory(cat)}
                isHindi={isHindi}
              />

              {/* Secondary 3-Column Grid: Answer Key | Syllabus | Admission (Lazy Loaded) */}
              <Suspense fallback={
                <div className="h-44 my-5 bg-white border-2 border-slate-200 rounded-xs flex items-center justify-center text-slate-400 font-bold text-sm animate-pulse">
                  Loading Answer Key, Syllabus & Admission Grids...
                </div>
              }>
                <SarkariSecondaryGrid
                  answerKeys={answerKeys}
                  syllabi={syllabi}
                  admissions={admissions}
                  onSelectPost={handleOpenPostFullPage}
                  onViewCategory={(cat) => setActiveCategory(cat)}
                  isHindi={isHindi}
                />
              </Suspense>

              {/* Certificate Verification & Important Links (Lazy Loaded) */}
              <Suspense fallback={
                <div className="h-44 my-5 bg-white border-2 border-slate-200 rounded-xs flex items-center justify-center text-slate-400 font-bold text-sm animate-pulse">
                  Loading Certificate Verification & Important Links...
                </div>
              }>
                <CertificateVerificationSection
                  certificates={certificates}
                  important={importantServices}
                  onSelectPost={handleOpenPostFullPage}
                  isHindi={isHindi}
                  onViewCategory={(cat) => setActiveCategory(cat)}
                />
              </Suspense>

              {/* Homepage FAQ Section (Lazy Loaded) */}
              <Suspense fallback={null}>
                <SarkariFAQSection isHindi={isHindi} />
              </Suspense>
            </>
          )}
        </main>
      )}

      {/* 4. Footer */}
      <SarkariFooter
        onOpenAgeCalculator={() => setIsAgeCalcOpen(true)}
        onOpenPhotoResizer={() => setIsPhotoResizerOpen(true)}
        onOpenJobFinder={() => setIsJobFinderOpen(true)}
        onOpenSitemap={() => setIsSitemapOpen(true)}
        onSelectPost={handleOpenPostFullPage}
        isHindi={isHindi}
      />

      {/* Candidate Tools Modals - Lazy loaded only when modal opens */}
      {isAgeCalcOpen && (
        <Suspense fallback={null}>
          <AgeCalculatorModal
            isOpen={isAgeCalcOpen}
            onClose={() => setIsAgeCalcOpen(false)}
          />
        </Suspense>
      )}

      {isPhotoResizerOpen && (
        <Suspense fallback={null}>
          <PhotoResizerTool
            isOpen={isPhotoResizerOpen}
            onClose={() => setIsPhotoResizerOpen(false)}
          />
        </Suspense>
      )}

      {isJobFinderOpen && (
        <Suspense fallback={null}>
          <EligibilityMatcherModal
            isOpen={isJobFinderOpen}
            onClose={() => setIsJobFinderOpen(false)}
            posts={mockSarkariPosts}
            onSelectPost={handleOpenPostFullPage}
          />
        </Suspense>
      )}

      {isBookmarksOpen && (
        <Suspense fallback={null}>
          <BookmarkedJobsModal
            isOpen={isBookmarksOpen}
            onClose={() => setIsBookmarksOpen(false)}
            bookmarkedPosts={bookmarkedPosts}
            onSelectPost={handleOpenPostFullPage}
            onRemoveBookmark={handleToggleBookmark}
            onClearAll={handleClearAllBookmarks}
          />
        </Suspense>
      )}

      {isSitemapOpen && (
        <Suspense fallback={null}>
          <SitemapModal
            isOpen={isSitemapOpen}
            onClose={() => setIsSitemapOpen(false)}
            onSelectPost={handleSelectSlug}
          />
        </Suspense>
      )}

      {isJobAlertsOpen && (
        <Suspense fallback={null}>
          <JobAlertsModal
            isOpen={isJobAlertsOpen}
            onClose={() => setIsJobAlertsOpen(false)}
          />
        </Suspense>
      )}

      <BackToTop />


    </div>
  );
}
