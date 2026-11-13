import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { getAdsConfig, AdsConfig, DEFAULT_ADS_CONFIG } from '../../utils/adsConfig';

interface AdBannerProps {
  placement: 'homeTop' | 'homeMid' | 'postTop' | 'postMid' | 'postBottom';
  format?: 'leaderboard' | 'banner' | 'in-feed';
  className?: string;
  onOpenTool?: () => void;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement,
  className = '',
  onOpenTool
}) => {
  const [config, setConfig] = useState<AdsConfig>(getAdsConfig);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getAdsConfig());
    };

    window.addEventListener('sarkari_ads_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sarkari_ads_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Inject Google AdSense script if Publisher ID is present
  useEffect(() => {
    if (config.enabled && config.adSensePublisherId && typeof window !== 'undefined') {
      const scriptId = 'google-adsense-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adSensePublisherId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Try triggering adsbygoogle push
      try {
        if (adRef.current && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        // Safe catch for AdSense double-call errors
      }
    }
  }, [config.enabled, config.adSensePublisherId]);

  if (!config.enabled) return null;

  // Check placement toggle
  const isPlacementActive = {
    homeTop: config.placements.homeLeaderboard,
    homeMid: config.placements.homeMidGrid,
    postTop: config.placements.postTop,
    postMid: config.placements.postMidLinks,
    postBottom: config.placements.postBottom
  }[placement];

  if (!isPlacementActive) return null;

  const bannerData = config.customBanners[placement] || DEFAULT_ADS_CONFIG.customBanners[placement];

  // If Real Google AdSense is configured with publisher ID & ad slot
  const slotId = {
    homeTop: config.adSenseSlots.leaderboard,
    homeMid: config.adSenseSlots.inContent,
    postTop: config.adSenseSlots.leaderboard,
    postMid: config.adSenseSlots.inContent,
    postBottom: config.adSenseSlots.footer
  }[placement];

  const hasAdSense = Boolean(config.adSensePublisherId && slotId);

  const handleClickBanner = () => {
    if (bannerData.linkUrl === '#' && onOpenTool) {
      onOpenTool();
      return;
    }
    if (bannerData.linkUrl && bannerData.linkUrl !== '#') {
      window.open(bannerData.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBookAdSpace = (e: React.MouseEvent) => {
    e.stopPropagation();
    const contactUrl = config.adContactUrl || 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j';
    if (contactUrl.startsWith('#') && typeof window !== 'undefined') {
      window.location.hash = contactUrl;
    } else {
      window.open(contactUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`my-3 sm:my-4 w-full transition-all ${className}`}
      data-ad-placement={placement}
    >
      {/* Authentic Ad Container matching user screenshot */}
      <div 
        onClick={handleClickBanner}
        className="w-full rounded-2xl border border-slate-200/90 bg-[#f8fafc] p-3 sm:p-5 flex flex-col items-center justify-start min-h-[120px] sm:min-h-[160px] relative transition-all shadow-2xs"
      >
        {/* Centered Top Label matching screenshot: विज्ञापन (ADVERTISEMENT) */}
        <div className="w-full text-center text-xs sm:text-sm font-semibold text-[#64748b] tracking-wider uppercase select-none mb-1">
          विज्ञापन (ADVERTISEMENT)
        </div>

        {hasAdSense && config.adDisplayType === 'adsense' ? (
          /* Real Google AdSense Container */
          <div ref={adRef} className="w-full flex-1 flex items-center justify-center pt-1 min-h-[90px]">
            <ins
              className="adsbygoogle"
              style={{ display: 'block', minHeight: '90px', width: '100%' }}
              data-ad-client={config.adSensePublisherId}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : config.customHtmlCode ? (
          /* Custom 3rd-Party HTML Ad Code */
          <div 
            className="w-full flex-1 flex items-center justify-center pt-1 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: config.customHtmlCode }}
          />
        ) : config.adDisplayType === 'sponsored' ? (
          /* Sponsored Creative within the clean card */
          <div className="w-full flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-left">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                {bannerData.badge && (
                  <span className="bg-red-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    {bannerData.badge}
                  </span>
                )}
                <h4 className="font-bold text-sm sm:text-base text-slate-900 font-serif">
                  {bannerData.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                {bannerData.subtitle}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 px-4 py-2 bg-[#ab1616] hover:bg-red-800 text-white font-extrabold text-xs rounded shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>{bannerData.buttonText || 'Click Here'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Clean Ad Space Placeholder matching the screenshot 1:1 */
          <div 
            onClick={handleBookAdSpace}
            className="w-full flex-1 flex flex-col items-center justify-center py-3 sm:py-6 cursor-pointer group"
          >
            {/* Subtle, polite booking info on hover/tap */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                <span className="hidden sm:inline">728×90 / </span>320×50
              </span>
              <span className="text-red-700 font-bold flex items-center gap-1">
                <span>Book This Ad Space</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
