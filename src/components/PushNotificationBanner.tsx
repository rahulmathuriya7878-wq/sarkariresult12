import React, { useState, useEffect } from 'react';
import { requestFcmPermissionAndToken } from '../utils/fcm';

const PROMPT_STORAGE_KEY = 'sarkari_push_prompt_v2';

export const PushNotificationBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedDecision = localStorage.getItem(PROMPT_STORAGE_KEY);
    if (savedDecision) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      localStorage.setItem(PROMPT_STORAGE_KEY, 'granted');
      localStorage.setItem('sarkari_push_notif_status', 'granted');
      return;
    }

    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    setShowBanner(false);
    localStorage.setItem(PROMPT_STORAGE_KEY, 'granted');

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        localStorage.setItem('sarkari_push_notif_status', permission);
        if (permission === 'granted') {
          void requestFcmPermissionAndToken().catch(() => {});
          try {
            new Notification('Sarkari Result Updates Enabled', {
              body: 'You will now receive instant alerts for Latest Jobs, Admit Cards & Results.',
              icon: '/favicon.ico',
            });
          } catch {
            // Ignore notification constructor failures in restricted contexts
          }
        }
      } catch (e) {
        console.error('Error requesting notification permission:', e);
        localStorage.setItem('sarkari_push_notif_status', 'granted');
      }
    } else {
      localStorage.setItem('sarkari_push_notif_status', 'granted');
    }
  };

  const handleDeny = () => {
    setShowBanner(false);
    localStorage.setItem(PROMPT_STORAGE_KEY, 'denied');
    localStorage.setItem('sarkari_push_notif_status', 'denied');
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sr-push-alert-title"
    >
      <div className="bg-white rounded-[14px] shadow-[0_10px_35px_rgba(0,0,0,0.22)] border border-[#e5e7eb] max-w-[355px] sm:max-w-[390px] w-full px-5 pt-5 pb-3.5 sm:px-6 sm:pt-6 sm:pb-4">
        {/* Top Row: Golden Ringing Bell + Message */}
        <div className="flex items-start gap-3.5 text-left">
          {/* Golden 3D Ringing Bell Icon */}
          <div className="shrink-0 mt-0.5 select-none" aria-hidden="true">
            <svg
              viewBox="0 0 64 64"
              className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-xs"
              fill="none"
            >
              <defs>
                <linearGradient id="srBellGold" x1="12" y1="8" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="55%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="srBellHighlight" x1="18" y1="12" x2="34" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g transform="rotate(-12 32 30)">
                {/* Top loop */}
                <circle cx="32" cy="11" r="3.5" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
                {/* Bell body */}
                <path
                  d="M32 13C23.5 13 18 19.5 18 28.5V37.5L13.5 43.5C12.8 44.5 13.5 46 14.8 46H49.2C50.5 46 51.2 44.5 50.5 43.5L46 37.5V28.5C46 19.5 40.5 13 32 13Z"
                  fill="url(#srBellGold)"
                  stroke="#92400e"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                {/* Gloss highlight */}
                <path
                  d="M28 16C23.5 17.8 21 22.5 21 28.5V37L18 42H26L27 28.5C27 22 28.5 18 31 16H28Z"
                  fill="url(#srBellHighlight)"
                />
                {/* Clapper */}
                <ellipse cx="32" cy="48.5" rx="4.5" ry="3.2" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
              </g>
              {/* Small ring motion ticks below bell */}
              <path d="M24 54L22 57" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M32 55V59" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M40 54L42 57" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="sr-push-alert-title"
              className="text-[#202124] font-normal text-[15.5px] sm:text-[16.5px] leading-[1.35] m-0"
            >
              sarkariresult want to notify you about the latest updates
            </h3>
            <p className="mt-2 mb-0 text-[#5f6368] text-[12.5px] sm:text-[13px] leading-[1.4]">
              You can unsubscribe from notifications anytime.
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDeny}
            className="w-full py-2.5 px-4 bg-white hover:bg-[#f1f3f4] text-[#5f6368] font-medium text-[14px] rounded-[6px] transition-colors cursor-pointer text-center border-0"
          >
            Deny
          </button>
          <button
            type="button"
            onClick={handleAllow}
            className="w-full py-2.5 px-4 bg-[#007bff] hover:bg-[#0069d9] active:bg-[#0062cc] text-white font-medium text-[14px] rounded-[6px] shadow-xs transition-colors cursor-pointer text-center border-0"
          >
            Allow
          </button>
        </div>

        {/* Powered By Footer */}
        <div className="mt-3 pt-1 flex items-center justify-center gap-1.5 text-[11px] text-[#5f6368]">
          <span>powered by</span>
          <span className="inline-flex items-center gap-1 font-medium text-[#3c4043]">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#007bff]" fill="none" aria-hidden="true">
              <path
                d="M12 3L3 20H21L12 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M12 9L7.5 17.5H16.5L12 9Z"
                fill="currentColor"
                opacity="0.25"
              />
            </svg>
            <span>SarkariPush</span>
          </span>
        </div>
      </div>
    </div>
  );
};
