import React, { useState, useEffect, useMemo } from 'react';
import { SarkariPost } from '../types/job';
import { 
  Flame, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  TrendingUp, 
  ExternalLink,
  Briefcase,
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';

export interface StateBannerConfig {
  id: string;
  stateKey: string;
  stateName: string;
  hindiName: string;
  badgeText: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
  gradient: string;
  accentColor: string;
  targetFilter: string; // state or department name to filter posts
  highlightKeywords: string[];
}

export const STATE_BANNERS: StateBannerConfig[] = [
  {
    id: 'banner-up',
    stateKey: 'UP',
    stateName: 'Uttar Pradesh (UP)',
    hindiName: 'उत्तर प्रदेश सरकारी नौकरी',
    badgeText: '🔥 Trending #1 in North India',
    title: 'UP Government Jobs & Competitive Exams 2026',
    subtitle: 'UPPSC, UPSSSC, UP Police Constable & SI, UPTET & Secondary Teacher Recruitment',
    imageSrc: '/src/assets/images/up_govt_jobs_1793852916579.jpg',
    altText: 'Uttar Pradesh Government Jobs & Examinations Official Banner',
    gradient: 'from-amber-600/90 to-red-900/95',
    accentColor: '#ab1616',
    targetFilter: 'Uttar Pradesh',
    highlightKeywords: ['UPPSC', 'UPSSSC', 'UP Police', 'UP TGT', 'Lekhpal', 'RO ARO']
  },
  {
    id: 'banner-bihar',
    stateKey: 'Bihar',
    stateName: 'Bihar (BPSC / BSSC)',
    hindiName: 'बिहार प्रतियोगिता परीक्षा व शिक्षक भर्ती',
    badgeText: '⚡ Massive Hiring Wave (33,000+ Posts)',
    title: 'Bihar State Competitive Exams & Teacher TRE 4.0',
    subtitle: 'BPSC Civil Services, Bihar Teacher TRE 4.0, Bihar Police SI, BCECEB & BSSC Special Drives',
    imageSrc: '/src/assets/images/bihar_exams_banner_1793852916550.jpg',
    altText: 'Bihar State Competitive Exams Official Banner',
    gradient: 'from-orange-600/90 to-blue-950/95',
    accentColor: '#ea580c',
    targetFilter: 'Bihar',
    highlightKeywords: ['BPSC', 'BSSC', 'Bihar Teacher', 'BCECEB', 'TRE 4.0', 'Bihar Police']
  },
  {
    id: 'banner-rajasthan',
    stateKey: 'Rajasthan',
    stateName: 'Rajasthan (RPSC / RSSB)',
    hindiName: 'राजस्थान सरकारी भर्ती व परिणाम',
    badgeText: '👑 High Demand Vacancies 2026',
    title: 'Rajasthan Government Vacancies & Recruitment Portal',
    subtitle: 'RPSC 2nd Grade, RSSB Driver, REET Teaching, Rajasthan Police & Administrative Services',
    imageSrc: '/src/assets/images/rajasthan_recruitment_banner_1793852917662.jpg',
    altText: 'Rajasthan Government Vacancies and Recruitment Official Banner',
    gradient: 'from-amber-700/90 to-red-950/95',
    accentColor: '#d97706',
    targetFilter: 'Rajasthan',
    highlightKeywords: ['RPSC', 'RSSB', 'REET', 'Rajasthan Police', 'Driver', '2nd Grade']
  },
  {
    id: 'banner-central',
    stateKey: 'All India',
    stateName: 'All India Central Jobs',
    hindiName: 'केंद्रीय सरकारी नौकरी (UPSC / SSC / Railway)',
    badgeText: '🇮🇳 Nationwide Central Drives',
    title: 'All India Central Government Recruitment 2026',
    subtitle: 'UPSC Civil Services, SSC CGL & GD, Railway RRB NTPC (5,000+ Posts), Banking IBPS & Defence',
    imageSrc: '/src/assets/images/all_india_central_1793852917896.jpg',
    altText: 'All India Central Government Jobs Official Banner',
    gradient: 'from-blue-900/90 to-slate-950/95',
    accentColor: '#1e3a8a',
    targetFilter: 'All India',
    highlightKeywords: ['UPSC', 'SSC', 'Railway RRB', 'Banking', 'Defence', 'NTPC']
  }
];

interface StatePromotionalBannersProps {
  posts: SarkariPost[];
  onSelectStateFilter?: (stateName: string) => void;
  onSelectPostSlug?: (slug: string) => void;
}

export const StatePromotionalBanners: React.FC<StatePromotionalBannersProps> = ({
  posts,
  onSelectStateFilter,
  onSelectPostSlug
}) => {
  const [selectedBannerIndex, setSelectedBannerIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Calculate dynamic trends based on active posts
  const stateTrendStats = useMemo(() => {
    const counts: Record<string, number> = {
      'Uttar Pradesh': 0,
      'Bihar': 0,
      'Rajasthan': 0,
      'All India': 0
    };

    posts.forEach((post) => {
      const text = `${post.state} ${post.title} ${post.department}`.toLowerCase();
      if (text.includes('uttar pradesh') || text.includes('up ') || text.includes('uppsc') || text.includes('upsssc') || text.includes('upessc')) {
        counts['Uttar Pradesh']++;
      }
      if (text.includes('bihar') || text.includes('bpsc') || text.includes('bssc') || text.includes('bceceb')) {
        counts['Bihar']++;
      }
      if (text.includes('rajasthan') || text.includes('rpsc') || text.includes('rssb') || text.includes('reet')) {
        counts['Rajasthan']++;
      }
      if (post.state === 'All India' || post.department === 'Railway' || post.department === 'SSC' || post.department === 'UPSC') {
        counts['All India']++;
      }
    });

    return counts;
  }, [posts]);

  // Determine current trending banner (defaults to UP or highest post volume)
  useEffect(() => {
    // Check if user has a preference or let it cycle
    const timer = setInterval(() => {
      if (isAutoPlay) {
        setSelectedBannerIndex((prev) => (prev + 1) % STATE_BANNERS.length);
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  if (isDismissed) return null;

  const currentBanner = STATE_BANNERS[selectedBannerIndex];
  const postCount = stateTrendStats[currentBanner.targetFilter] || 0;

  // Filter top 3 related posts for the current banner to display live pills
  const relatedPosts = posts.filter((p) => {
    const text = `${p.state} ${p.title} ${p.department}`.toLowerCase();
    const filterKey = currentBanner.targetFilter.toLowerCase();
    if (filterKey === 'all india') {
      return p.state === 'All India' || p.department === 'Railway' || p.department === 'SSC' || p.department === 'UPSC';
    }
    return text.includes(filterKey) || currentBanner.highlightKeywords.some((k) => text.includes(k.toLowerCase()));
  }).slice(0, 3);

  const handleNext = () => {
    setIsAutoPlay(false);
    setSelectedBannerIndex((prev) => (prev + 1) % STATE_BANNERS.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setSelectedBannerIndex((prev) => (prev - 1 + STATE_BANNERS.length) % STATE_BANNERS.length);
  };

  const handleStateClick = (filter: string) => {
    if (onSelectStateFilter) {
      onSelectStateFilter(filter);
    }
  };

  return (
    <div 
      className="my-3 rounded-md overflow-hidden border-2 border-[#ab1616] shadow-md bg-white select-none transition-all"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Top Trend Indicator Strip */}
      <div className="bg-[#ab1616] text-white px-3 py-1.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-2xs">
            <Flame className="w-3 h-3 fill-current text-red-700" />
            <span>State Trending Jobs</span>
          </span>
          <span className="font-bold text-white tracking-wide">
            {currentBanner.badgeText}
          </span>
        </div>

        {/* State Selection Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {STATE_BANNERS.map((banner, idx) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => {
                setIsAutoPlay(false);
                setSelectedBannerIndex(idx);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                selectedBannerIndex === idx
                  ? 'bg-amber-300 text-red-950 shadow-xs'
                  : 'text-amber-100 hover:bg-white/20'
              }`}
            >
              {banner.stateKey}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-white/70 hover:text-white p-0.5 ml-1 cursor-pointer transition-colors"
            title="Dismiss promotional banners"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Banner Visual Container */}
      <div className="relative group overflow-hidden bg-slate-900 min-h-[170px] sm:min-h-[220px] md:min-h-[260px] flex items-center">
        {/* The Branded Generated High-Quality Image */}
        <img
          src={currentBanner.imageSrc}
          alt={currentBanner.altText}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center max-h-[340px] transform hover:scale-[1.01] transition-transform duration-700"
        />

        {/* Dynamic State Overlay with Actionable Links */}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 via-black/60 to-transparent flex flex-col justify-end sm:justify-center p-3.5 sm:p-6 text-white space-y-2">
          <div className="max-w-xl space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-red-950 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>{currentBanner.hindiName}</span>
            </div>

            <h3 className="text-base sm:text-2xl font-black font-serif text-white leading-tight drop-shadow-md">
              {currentBanner.title}
            </h3>

            <p className="text-xs sm:text-sm text-amber-100/90 font-medium line-clamp-2 max-w-lg drop-shadow-xs">
              {currentBanner.subtitle}
            </p>

            {/* Trending Quick Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-amber-400" />
                <span>Active: <strong>{postCount || '15+'} Posts</strong></span>
              </span>
              <span className="text-slate-400 text-[10px]">•</span>
              {currentBanner.highlightKeywords.slice(0, 4).map((kw, i) => (
                <span 
                  key={i}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/30 cursor-pointer transition-colors"
                  onClick={() => handleStateClick(kw)}
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleStateClick(currentBanner.targetFilter)}
                className="bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs px-3.5 py-1.5 rounded shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
              >
                <span>View All {currentBanner.stateKey} Jobs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (relatedPosts.length > 0 && onSelectPostSlug) {
                    onSelectPostSlug(relatedPosts[0].slug || relatedPosts[0].id);
                  } else {
                    handleStateClick(currentBanner.targetFilter);
                  }
                }}
                className="bg-red-800/90 hover:bg-red-800 text-white font-bold text-xs px-3 py-1.5 rounded border border-red-500 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Latest Notification</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Prev / Next Controls */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Banner"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Banner"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-2 right-3 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full backdrop-blur-xs">
          {STATE_BANNERS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => {
                setIsAutoPlay(false);
                setSelectedBannerIndex(dotIdx);
              }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                selectedBannerIndex === dotIdx ? 'bg-amber-400 w-4' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to banner ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Live Ticker for State Highlights */}
      {relatedPosts.length > 0 && (
        <div className="bg-amber-50 border-t border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-900 shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>Hot in {currentBanner.stateKey}:</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar text-xs">
            {relatedPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => onSelectPostSlug && onSelectPostSlug(post.slug || post.id)}
                className="text-[#ab1616] hover:underline font-bold text-[11px] truncate max-w-[260px] sm:max-w-xs flex items-center gap-1 cursor-pointer"
                title={post.title}
              >
                <span>&bull;</span>
                <span className="truncate">{post.shortTitle || post.title}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleStateClick(currentBanner.targetFilter)}
            className="text-[11px] font-black text-[#ab1616] hover:text-red-900 flex items-center gap-0.5 ml-auto cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
