import React, { useState } from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';

interface CriticalAlertBannerProps {
  onSelectSlug?: (slug: string) => void;
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ onSelectSlug }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('sarkari_critical_banner_dismissed') === 'true';
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('sarkari_critical_banner_dismissed', 'true');
  };

  return (
    <aside aria-label="Critical Alert" className="w-full bg-gradient-to-r from-amber-500 via-orange-600 to-red-700 text-white shadow-md border-b-2 border-yellow-300 py-2.5 px-3 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="bg-white/20 p-1 rounded animate-pulse shrink-0">
            <AlertTriangle className="w-4 h-4 text-yellow-200" />
          </span>
          <p className="font-bold tracking-tight leading-snug truncate sm:whitespace-normal">
            <span className="bg-yellow-300 text-red-950 px-1.5 py-0.5 rounded uppercase text-[10px] font-black mr-1.5">
              CRITICAL UPDATE
            </span>
            UPSC Civil Services 2026 & SSC CGL Last Dates Extended! Check Revised Schedule & Eligibility Before Apply.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onSelectSlug && (
            <button
              type="button"
              onClick={() => onSelectSlug('upsc-civil-services-ias-ifs-2026')}
              className="bg-white hover:bg-yellow-100 text-red-900 font-extrabold px-2.5 py-1 rounded-xs text-xs transition-colors shadow-2xs inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Notice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 text-white/80 hover:text-white hover:bg-black/20 rounded transition-colors cursor-pointer"
            title="Dismiss Announcement"
            aria-label="Dismiss Announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
