import React, { useState, useEffect } from 'react';
import { SarkariPost } from '../types/job';
import { 
  BellRing, 
  X, 
  CheckCircle2, 
  Bell, 
  Clock,
  Trash2
} from 'lucide-react';
import { isPostAlertActive, togglePostAlert, getPostStatus } from '../utils/alertManager';

interface PostAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: SarkariPost;
  onAlertChange?: (isAlertSet: boolean) => void;
}

export const PostAlertModal: React.FC<PostAlertModalProps> = ({
  isOpen,
  onClose,
  post,
  onAlertChange
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentStatus = getPostStatus(post);

  useEffect(() => {
    if (isOpen) {
      setIsSubscribed(isPostAlertActive(post.id));
      setSuccessMessage(null);
    }
  }, [isOpen, post.id]);

  if (!isOpen) return null;

  const handleToggle = async () => {
    const result = await togglePostAlert(post);
    setIsSubscribed(result.isAlertSet);
    
    if (onAlertChange) {
      onAlertChange(result.isAlertSet);
    }

    if (result.isAlertSet) {
      if (result.permission === 'granted') {
        setSuccessMessage('🔔 अलर्ट सक्रिय! पद एक्टिव होते ही तुरंत नोटिफिकेशन मिलेगा।');
      } else if (result.permission === 'denied') {
        setSuccessMessage('✓ वॉचलिस्ट में सेव! ब्राउज़र में नोटिफिकेशन ब्लॉक है, कृपया साइट सेटिंग्स में अनुमति दें।');
      } else {
        setSuccessMessage('🔔 अलर्ट सेट! पद सक्रिय होते ही नोटिफिकेशन भेजा जाएगा।');
      }
    } else {
      setSuccessMessage('🔕 अलर्ट हटा दिया गया है।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-3 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-[340px] sm:max-w-[360px] w-full border border-slate-300 overflow-hidden my-auto">
        
        {/* Compact Header */}
        <div className="bg-[#ab1616] text-white px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-black shrink-0">
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <h3 className="text-sm font-bold tracking-tight">
              Job Alert Me (जॉब अलर्ट)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-black/20 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3.5 space-y-3">
          
          {/* Post Summary Card */}
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-xs space-y-1.5">
            <div className="flex items-center justify-between gap-1 flex-wrap text-[10px]">
              <span className="font-bold text-[#ab1616] bg-red-100 px-1.5 py-0.5 rounded">
                {post.department}
              </span>
              <span className="font-semibold text-slate-500 uppercase">
                {post.category.replace('_', ' ')}
              </span>
            </div>

            <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
              {post.shortTitle || post.title}
            </h4>

            <div className="pt-1 flex items-center justify-between border-t border-slate-200 text-[11px]">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                स्थिति:
              </span>
              {currentStatus === 'upcoming' ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 rounded font-bold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  Upcoming (आगामी)
                </span>
              ) : currentStatus === 'active' ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded font-bold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Active (आवेदन जारी)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded font-bold text-[10px]">
                  Closed
                </span>
              )}
            </div>
          </div>

          {/* Feedback Message */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-2 rounded text-xs font-semibold flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Alert Description */}
          <p className="text-[11px] text-slate-600 leading-relaxed">
            जैसे ही इस भर्ती का ऑनलाइन आवेदन लिंक <strong>'Upcoming' से 'Active'</strong> होगा, आपको ब्राउज़र में तुरंत नोटिफिकेशन मिल जाएगा।
          </p>

          {/* Action Button */}
          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggle}
              className={`flex-1 py-2 px-3 rounded font-bold text-xs text-white shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isSubscribed
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#ab1616] hover:bg-red-800'
              }`}
            >
              {isSubscribed ? (
                <>
                  <BellRing className="w-3.5 h-3.5" />
                  <span>अलर्ट सक्रिय है ✓</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>अलर्ट ऑन करें (Alert Me)</span>
                </>
              )}
            </button>

            {isSubscribed && (
              <button
                type="button"
                onClick={handleToggle}
                className="p-2 bg-slate-100 hover:bg-red-50 text-red-700 border border-slate-300 rounded text-xs transition-colors cursor-pointer"
                title="अलर्ट हटाएं"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Compact Footer */}
        <div className="bg-slate-100 px-3.5 py-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Sarkari Result Alerts</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-black cursor-pointer text-xs"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
