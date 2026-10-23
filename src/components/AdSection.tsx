import React, { useEffect, useRef } from 'react';

interface AdSectionProps {
  slotId?: string;
  clientPublisherId?: string;
  format?: 'auto' | 'fluid' | 'horizontal' | 'rectangle';
  label?: string;
  className?: string;
  showPlaceholderNotice?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export const AdSection: React.FC<AdSectionProps> = ({
  slotId = '8892103412',
  clientPublisherId = 'ca-pub-XXXXXXXXXXXXXXXX',
  format = 'horizontal',
  className = '',
  showPlaceholderNotice = true
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && adRef.current) {
          const width = adRef.current.clientWidth;
          if (width > 0) {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
          }
        }
      } catch (e) {
        console.debug('AdSense initialization:', e);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={adRef}
      className={`w-full my-4 sm:my-6 py-4 px-2 sm:px-4 bg-slate-50 border border-slate-200 rounded-xs text-center shadow-2xs overflow-hidden transition-all ${className}`}
      role="region"
      aria-label="Advertisement"
    >
      {/* AdSense Unit Wrapper with strict CLS protection and min-height constraint */}
      <div className="min-h-[110px] sm:min-h-[130px] max-h-[300px] w-full flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-xs overflow-hidden p-2">
        {/* Live AdSense Tag Structure */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={clientPublisherId}
          data-ad-slot={slotId}
          data-ad-format={format === 'horizontal' ? 'auto' : format}
          data-full-width-responsive="true"
        />

        {/* Placeholder for future AdSense loading if needed */}
        {showPlaceholderNotice && (
          <div className="py-2 px-4 text-center space-y-1 mt-1">
            <span className="inline-block px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wide">
              Ad Space
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
