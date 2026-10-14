import React, { useState, useEffect } from 'react';
import { BellRing, X, CheckCircle, Mail, Globe, Send, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface JobAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobAlertsModal: React.FC<JobAlertsModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [enableBrowserPush, setEnableBrowserPush] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'all',
    'latest_jobs',
    'admit_card',
    'result'
  ]);
  const [qualification, setQualification] = useState('All Qualifications');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<string>('default');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
    const saved = localStorage.getItem('sarkari_job_alerts_subscribed');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.categories) setSelectedCategories(parsed.categories);
        if (parsed.qualification) setQualification(parsed.qualification);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCategoryToggle = (cat: string) => {
    if (cat === 'all') {
      if (selectedCategories.includes('all')) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(['all', 'latest_jobs', 'admit_card', 'result', 'rajasthan']);
      }
      return;
    }

    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat && c !== 'all'));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email && !enableBrowserPush) {
      setErrorMessage('Please provide an email address or enable browser push notifications.');
      return;
    }

    if (email && !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // If browser push is requested, ask permission
    if (enableBrowserPush && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        if (perm === 'granted') {
          try {
            new Notification('Sarkari Job Alerts Active 🔔', {
              body: 'You will receive immediate alerts for new Govt Jobs, Admit Cards, and Results!',
              icon: '/favicon.ico'
            });
          } catch {
            // Notification display fallback
          }
        }
      } catch (err) {
        console.warn('Browser notification permission issue:', err);
      }
    }

    // Save preference to localStorage
    const alertData = {
      email,
      enableBrowserPush,
      categories: selectedCategories,
      qualification,
      subscribedAt: new Date().toISOString()
    };
    localStorage.setItem('sarkari_job_alerts_subscribed', JSON.stringify(alertData));
    localStorage.setItem('sarkari_job_alerts_seen', 'true');
    setIsSubscribed(true);
  };

  const handleDismiss = () => {
    localStorage.setItem('sarkari_job_alerts_seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl border-2 border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with authentic styling */}
        <div className="bg-[#ab1616] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-xs shrink-0">
              <BellRing className="w-5 h-5 text-slate-900 animate-bounce" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base leading-tight uppercase tracking-wide">
                Get Free Sarkari Job Alerts
              </h2>
              <p className="text-[11px] text-amber-200 font-medium">
                निःशुल्क सरकारी नौकरी व रिजल्ट अलर्ट्स (Direct on Browser & Email)
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-black/20 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {isSubscribed ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  You're Successfully Subscribed! 🎉
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Alerts will be sent for new vacancies matching your preferences. You will never miss an application deadline!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3 text-left space-y-1.5 text-xs text-slate-800">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  Active Subscription Summary:
                </div>
                {email && <div><strong>Email Alerts:</strong> {email}</div>}
                <div>
                  <strong>Browser Push:</strong>{' '}
                  <span className={browserPermission === 'granted' ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                    {browserPermission === 'granted' ? 'Enabled (Active)' : 'Requested'}
                  </span>
                </div>
                <div><strong>Qualification:</strong> {qualification}</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                      new Notification('Sample Job Alert: UPSC / Police Bharti 🔔', {
                        body: 'This is a test notification from Sarkari Result Portal.',
                        icon: '/favicon.ico'
                      });
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Send Test Notification
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2 bg-[#ab1616] hover:bg-red-800 text-white font-bold rounded text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              {/* Highlight strip */}
              <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-xs text-amber-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Stay ahead of competition! Get instant notifications as soon as UPSC, SSC, Railways, State PSC, Police, and Teacher notifications are released.
                </span>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-300 rounded p-2 text-xs text-red-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#ab1616]" />
                  <span>Email Address for Daily Job Digest (Daily Updates)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email (e.g. candidate@email.in)"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#ab1616] focus:ring-1 focus:ring-[#ab1616]"
                />
              </div>

              {/* Browser Push Notification Toggle */}
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBrowserPush}
                    onChange={(e) => setEnableBrowserPush(e.target.checked)}
                    className="mt-0.5 rounded text-[#ab1616] focus:ring-[#ab1616] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-sky-600" />
                      Instant Browser Push Notifications (Recommended)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Receive immediate popup alerts on your device whenever an admit card or new vacancy is live.
                    </span>
                  </div>
                </label>
              </div>

              {/* Category Preferences */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Select Alert Categories (अपनी पसंद चुनें):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('all')}
                      onChange={() => handleCategoryToggle('all')}
                      className="rounded text-[#ab1616] focus:ring-[#ab1616]"
                    />
                    <span className="font-semibold text-slate-800">All Updates (सभी)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('latest_jobs')}
                      onChange={() => handleCategoryToggle('latest_jobs')}
                      className="rounded text-[#ab1616] focus:ring-[#ab1616]"
                    />
                    <span className="font-semibold text-slate-800">Latest Jobs / Forms</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('admit_card')}
                      onChange={() => handleCategoryToggle('admit_card')}
                      className="rounded text-[#ab1616] focus:ring-[#ab1616]"
                    />
                    <span className="font-semibold text-slate-800">Admit Cards & Dates</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('result')}
                      onChange={() => handleCategoryToggle('result')}
                      className="rounded text-[#ab1616] focus:ring-[#ab1616]"
                    />
                    <span className="font-semibold text-slate-800">Results & Answer Key</span>
                  </label>
                </div>
              </div>

              {/* Qualification Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Highest Qualification:
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#ab1616] bg-white cursor-pointer"
                >
                  <option value="All Qualifications">All Qualifications (सभी योग्यताएं)</option>
                  <option value="10th Pass">10th Pass (Matric)</option>
                  <option value="12th Pass">12th Pass (Intermediate)</option>
                  <option value="Graduate">Graduate (Any Stream)</option>
                  <option value="Post Graduate">Post Graduate (PG)</option>
                  <option value="Diploma / ITI">Diploma / ITI</option>
                  <option value="B.Tech / BE">B.Tech / BE Engineering</option>
                  <option value="Medical / Nursing">Medical / Nursing</option>
                </select>
              </div>

              {/* Social / Telegram fast link option */}
              <div className="bg-sky-50 border border-sky-200 rounded p-2.5 text-xs text-sky-900 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Send className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span>Also get alerts on Telegram Channel</span>
                </span>
                <button
                  type="button"
                  onClick={() => window.open('https://t.me/newsarkariresultt', '_blank')}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-2.5 py-1 rounded text-[11px] font-bold shrink-0 cursor-pointer"
                >
                  Join Telegram
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  No thanks, remind me later
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ab1616] hover:bg-red-800 text-white font-extrabold text-xs uppercase tracking-wider rounded shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Activate Job Alerts</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>100% Free · No spam · Unsubscribe anytime with 1 click</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
