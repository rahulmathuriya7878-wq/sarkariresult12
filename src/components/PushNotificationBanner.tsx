import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

export const PushNotificationBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    // Check if user already responded to push notification prompt
    const status = localStorage.getItem('sarkari_push_notif_status');
    if (!status && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        localStorage.setItem('sarkari_push_notif_status', 'granted');
        return;
      }
      if (Notification.permission === 'denied') {
        localStorage.setItem('sarkari_push_notif_status', 'denied');
        return;
      }

      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    setShowBanner(false);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        localStorage.setItem('sarkari_push_notif_status', permission);
        if (permission === 'granted') {
          new Notification('🔔 Sarkari Result Notifications Enabled!', {
            body: 'You will now receive instant alerts for Latest Jobs, Admit Cards & Results.',
            icon: '/favicon.ico'
          });
        }
      } catch (e) {
        console.error('Error requesting notification permission:', e);
      }
    } else {
      localStorage.setItem('sarkari_push_notif_status', 'denied');
    }
  };

  const handleDeny = () => {
    setShowBanner(false);
    localStorage.setItem('sarkari_push_notif_status', 'denied');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center relative border border-slate-200 transform transition-all scale-100">
        
        {/* Close Button */}
        <button
          onClick={handleDeny}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ringing Bell Icon */}
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner">
          <Bell className="w-7 h-7 animate-bounce" />
        </div>

        {/* Title */}
        <h3 className="text-slate-900 font-bold text-base sm:text-lg mb-2 leading-snug">
          sarkariresult wants to notify you about the latest updates
        </h3>

        {/* Subtitle */}
        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
          You can unsubscribe from notifications anytime.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDeny}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer text-sm"
          >
            Deny
          </button>
          <button
            onClick={handleAllow}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer text-sm"
          >
            Allow
          </button>
        </div>

        {/* Powered by */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1">
          <span>powered by</span>
          <span className="font-bold text-slate-600">SarkariPush</span>
        </div>

      </div>
    </div>
  );
};
