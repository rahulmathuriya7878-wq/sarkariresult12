/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { mockSarkariPosts } from './data/mockJobs';
import { SarkariPost, PostCategory, Department, Qualification } from './types/job';
import { Header } from './components/Header';
import { MarqueeTicker } from './components/MarqueeTicker';
import { QuickHighlightsGrid } from './components/QuickHighlightsGrid';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { SarkariThreeColumnGrid } from './components/SarkariThreeColumnGrid';
import { SarkariSecondaryGrid } from './components/SarkariSecondaryGrid';
import { CertificateVerificationSection } from './components/CertificateVerificationSection';
import { CategoryDetailView } from './components/CategoryDetailView';
import { FullPagePostView } from './components/FullPagePostView';
import { AgeCalculatorModal } from './components/tools/AgeCalculatorModal';
import { PhotoResizerTool } from './components/tools/PhotoResizerTool';
import { EligibilityMatcherModal } from './components/tools/EligibilityMatcherModal';
import { BookmarkedJobsModal } from './components/BookmarkedJobsModal';
import { SarkariFooter } from './components/SarkariFooter';
import { BackToTop } from './components/BackToTop';
import { CriticalAlertBanner } from './components/CriticalAlertBanner';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // Navigation & Category filter state
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedQual, setSelectedQual] = useState<Qualification | 'All'>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');

  // Full-page active post state
  const [selectedPost, setSelectedPost] = useState<SarkariPost | null>(null);

  // Modals state for tools
  const [isAgeCalcOpen, setIsAgeCalcOpen] = useState<boolean>(false);
  const [isPhotoResizerOpen, setIsPhotoResizerOpen] = useState<boolean>(false);
  const [isJobFinderOpen, setIsJobFinderOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

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

      return true;
    });
  }, [searchQuery, selectedDept, selectedQual, selectedState]);

  // Categorized slices
  const results = useMemo(() => filteredPosts.filter((p) => p.category === 'result'), [filteredPosts]);
  const admitCards = useMemo(() => filteredPosts.filter((p) => p.category === 'admit_card'), [filteredPosts]);
  const latestJobs = useMemo(() => filteredPosts.filter((p) => p.category === 'latest_jobs'), [filteredPosts]);
  const answerKeys = useMemo(() => filteredPosts.filter((p) => p.category === 'answer_key'), [filteredPosts]);
  const syllabi = useMemo(() => filteredPosts.filter((p) => p.category === 'syllabus'), [filteredPosts]);
  const admissions = useMemo(() => filteredPosts.filter((p) => p.category === 'admission'), [filteredPosts]);
  const certificates = useMemo(() => filteredPosts.filter((p) => p.category === 'certificate_verification'), [filteredPosts]);
  const importantServices = useMemo(() => filteredPosts.filter((p) => p.category === 'important'), [filteredPosts]);

  // Category specific list for drill-down view
  const categorySpecificPosts = useMemo(() => {
    if (activeCategory === 'all') return [];
    return filteredPosts.filter((p) => p.category === activeCategory);
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
        isHindi={isHindi}
        onToggleHindi={() => setIsHindi(!isHindi)}
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
        <FullPagePostView
          post={selectedPost}
          onBack={handleBackToHome}
          isBookmarked={bookmarkedIds.includes(selectedPost.id)}
          onToggleBookmark={handleToggleBookmark}
          onOpenAgeCalculator={() => setIsAgeCalcOpen(true)}
          onOpenPhotoResizer={() => setIsPhotoResizerOpen(true)}
          isHindi={isHindi}
        />
      ) : (
        /* Home Main View */
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3">
          {/* Quick Highlights 8-box Grid (Top Trending Vacancies) */}
          <QuickHighlightsGrid onSelectHighlight={handleSelectSlug} />



          {/* Dynamic Content: Drill-down Category view or Authentic 3-Column Tables */}
          {activeCategory !== 'all' ? (
            <CategoryDetailView
              category={activeCategory}
              posts={categorySpecificPosts}
              onSelectPost={handleOpenPostFullPage}
              onBackToHome={() => setActiveCategory('all')}
              isHindi={isHindi}
            />
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

              {/* Secondary 3-Column Grid: Answer Key | Syllabus | Admission */}
              <SarkariSecondaryGrid
                answerKeys={answerKeys}
                syllabi={syllabi}
                admissions={admissions}
                onSelectPost={handleOpenPostFullPage}
                onViewCategory={(cat) => setActiveCategory(cat)}
                isHindi={isHindi}
              />

              {/* Certificate Verification & Important Links */}
              <CertificateVerificationSection
                certificates={certificates}
                important={importantServices}
                onSelectPost={handleOpenPostFullPage}
                isHindi={isHindi}
              />
            </>
          )}
        </main>
      )}

      {/* 4. Footer */}
      <SarkariFooter
        onOpenAgeCalculator={() => setIsAgeCalcOpen(true)}
        onOpenPhotoResizer={() => setIsPhotoResizerOpen(true)}
        onOpenJobFinder={() => setIsJobFinderOpen(true)}
        isHindi={isHindi}
      />

      {/* Candidate Tools Modals */}
      <AgeCalculatorModal
        isOpen={isAgeCalcOpen}
        onClose={() => setIsAgeCalcOpen(false)}
      />

      <PhotoResizerTool
        isOpen={isPhotoResizerOpen}
        onClose={() => setIsPhotoResizerOpen(false)}
      />

      <EligibilityMatcherModal
        isOpen={isJobFinderOpen}
        onClose={() => setIsJobFinderOpen(false)}
        posts={mockSarkariPosts}
        onSelectPost={handleOpenPostFullPage}
      />

      <BookmarkedJobsModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedPosts={bookmarkedPosts}
        onSelectPost={handleOpenPostFullPage}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={handleClearAllBookmarks}
      />

      <BackToTop />

      <MobileBottomNav
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setSelectedPost(null);
          setActiveCategory(cat);
        }}
        bookmarkCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
      />
    </div>
  );
}
