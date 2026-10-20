import React from 'react';

/**
 * Skeleton Loader for 8-box Headlight / Quick Highlights Grid
 */
export const QuickHighlightsSkeleton: React.FC = () => {
  return (
    <div className="w-full pt-2 pb-3 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div 
            key={idx} 
            className="bg-slate-200/90 rounded-xs min-h-[58px] sm:min-h-[64px] border border-slate-300/60 p-2 flex items-center justify-center text-center"
          >
            <div className="w-full space-y-1.5">
              <div className="h-3 bg-slate-300 rounded w-5/6 mx-auto"></div>
              <div className="h-2.5 bg-slate-300/80 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for 3-Column / Secondary Grid Sections (Home Page)
 */
export const GridSectionSkeleton: React.FC = () => {
  return (
    <div className="w-full my-4 space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, colIdx) => (
          <div key={colIdx} className="bg-white border border-slate-300 rounded-sm overflow-hidden shadow-2xs">
            {/* Column Header */}
            <div className="bg-slate-300 h-10 w-full flex items-center justify-center p-2">
              <div className="h-4 bg-slate-400 rounded w-1/2"></div>
            </div>

            {/* List items */}
            <div className="divide-y divide-slate-200 p-2 space-y-3">
              {Array.from({ length: 8 }).map((_, rowIdx) => (
                <div key={rowIdx} className="pt-2.5 first:pt-0 pb-1.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 bg-slate-200/70 rounded w-1/3"></div>
                    <div className="h-2.5 bg-slate-200/70 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Full Page Post View (Detail View)
 */
export const PostViewSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] pb-20 animate-pulse font-sans">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-5 space-y-3">
        
        {/* Breadcrumb Bar Skeleton */}
        <div className="bg-white border border-slate-200 rounded-t-xs px-4 py-3 flex items-center justify-between shadow-2xs">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-6"></div>
        </div>

        {/* Paper Document Container */}
        <div className="bg-white rounded-b-xs border border-slate-300 p-4 sm:p-6 space-y-6 shadow-xs">
          
          {/* Post Header Table Skeleton */}
          <div className="border border-slate-200 rounded-xs p-4 space-y-3 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row gap-3 border-b border-slate-200 pb-3">
              <div className="h-5 bg-red-200 rounded w-32 shrink-0"></div>
              <div className="h-6 bg-red-200/80 rounded w-3/4"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 border-b border-slate-200 pb-3">
              <div className="h-4 bg-slate-200 rounded w-32 shrink-0"></div>
              <div className="h-4 bg-slate-200/80 rounded w-1/2"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-4 bg-slate-200 rounded w-32 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200/80 rounded w-full"></div>
                <div className="h-4 bg-slate-200/80 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200/80 rounded w-2/3"></div>
              </div>
            </div>
          </div>

          {/* Social Channels Pills Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-11 bg-slate-200 rounded-lg"></div>
            <div className="h-11 bg-slate-200 rounded-lg"></div>
          </div>

          {/* Center Title Skeleton */}
          <div className="text-center py-4 space-y-2 border-b border-slate-200">
            <div className="h-6 bg-emerald-200 rounded w-1/2 mx-auto"></div>
            <div className="h-5 bg-purple-200 rounded w-2/3 mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div>
          </div>

          {/* 2-Column Side-by-Side Table Skeleton (Dates & Fees) */}
          <div className="border border-slate-300 rounded grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            <div className="space-y-3">
              <div className="h-5 bg-emerald-200 rounded w-1/2 mx-auto"></div>
              <div className="space-y-2 pt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-3.5 bg-slate-200 rounded w-full"></div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-5 bg-emerald-200 rounded w-1/2 mx-auto"></div>
              <div className="space-y-2 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3.5 bg-slate-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Age Limit Box Skeleton */}
          <div className="border border-slate-300 rounded p-5 space-y-3">
            <div className="h-5 bg-emerald-200 rounded w-2/3"></div>
            <div className="space-y-2 pt-1">
              <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3.5 bg-slate-200 rounded w-2/5"></div>
              <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>

          {/* Vacancy Breakdown Table Skeleton */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-emerald-300 h-10 w-full"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200/80 rounded w-full"></div>
              <div className="h-4 bg-slate-200/60 rounded w-5/6"></div>
            </div>
          </div>

          {/* Direct Links Table Skeleton */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-red-300 h-10 w-full"></div>
            <div className="p-4 space-y-3 divide-y divide-slate-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="pt-2 flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-8 bg-blue-300 rounded w-28"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
