import React, { useState, useEffect } from 'react';
import { SarkariPost } from '../types/job';
import { Bookmark, X, ArrowRight, Trash2, Calendar, Bell, BellRing, CheckCircle2 } from 'lucide-react';
import { isPostAlertActive, getPostStatus } from '../utils/alertManager';

interface BookmarkedJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedPosts: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onRemoveBookmark: (postId: string) => void;
  onClearAll: () => void;
}

export const BookmarkedJobsModal: React.FC<BookmarkedJobsModalProps> = ({
  isOpen,
  onClose,
  bookmarkedPosts,
  onSelectPost,
  onRemoveBookmark,
  onClearAll
}) => {
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, [isOpen]);

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop push notifications.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);

      if (permission === 'granted') {
        // Show test push notification
        new Notification('Sarkari Result Alerts Activated 🔔', {
          body: `Push notifications enabled! You are tracking ${bookmarkedPosts.length} bookmarked exam notifications.`,
          icon: '/favicon.ico'
        });
        setSuccessToast('Browser push notifications successfully enabled!');
        setTimeout(() => setSuccessToast(null), 3500);
      } else if (permission === 'denied') {
        alert('Notification permission was denied. Please enable notifications in your browser settings.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#ab1616] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-yellow-300" />
            <h2 className="text-lg font-bold tracking-tight">
              Saved Govt Jobs & Alerts (सहेजे गए पद) ({bookmarkedPosts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* 'Get Notified' Push Notification Toggle Banner */}
          <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-red-700" />
                Get Notified (पुश नोटिफिकेशन अलर्ट)
              </span>
              <p className="text-[11px] text-amber-900">
                {notifPermission === 'granted'
                  ? 'Push notifications are ACTIVE for your saved exam deadlines.'
                  : 'Enable browser alerts for last date warnings & exam admit cards.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`px-3.5 py-2 rounded font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                notifPermission === 'granted'
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-red-700 text-white hover:bg-red-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{notifPermission === 'granted' ? 'Notifications Active ✓' : 'Get Notified (Enable)'}</span>
            </button>
          </div>

          {successToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {bookmarkedPosts.length > 0 ? (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>Click any item to view full details and apply links</span>
                <button
                  onClick={onClearAll}
                  className="text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>

              <div className="space-y-2.5">
                {bookmarkedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                  >
                    <div 
                      className="cursor-pointer flex-1"
                      onClick={() => {
                        onSelectPost(post);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-1 flex-wrap">
                        <span className="font-bold text-[#ab1616] bg-red-100 px-1.5 py-0.5 rounded">
                          {post.department}
                        </span>
                        <span>{post.category.replace('_', ' ').toUpperCase()}</span>
                        {isPostAlertActive(post.id) && (
                          <span className="font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded flex items-center gap-1 text-[10px]">
                            <BellRing className="w-3 h-3 text-amber-600 animate-pulse" />
                            <span>Alert Active</span>
                          </span>
                        )}
                        {getPostStatus(post) === 'upcoming' && (
                          <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded text-[10px]">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 hover:text-[#ab1616] transition-colors">
                        {post.shortTitle}
                      </h4>
                      {post.lastDate && (
                        <p className="text-[11px] text-red-700 font-semibold mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last Date: {post.lastDate}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPost(post);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-[#ab1616] hover:bg-red-800 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveBookmark(post.id)}
                        className="p-1.5 text-slate-400 hover:text-red-700 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No saved jobs yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the bookmark icon on any job or exam notification to save it here for quick access later.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
