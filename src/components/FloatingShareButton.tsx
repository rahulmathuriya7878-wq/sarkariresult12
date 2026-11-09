import React, { useState } from 'react';
import { Share2, Check, Send } from 'lucide-react';
import { SarkariPost } from '../types/job';
import { getCategoryShareText } from './FullPagePostView';
import { getCleanShareUrl } from '../utils/urlUtils';

interface FloatingShareButtonProps {
  currentPost?: SarkariPost | null;
  isHindi?: boolean;
}

export const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({ currentPost, isHindi }) => {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sarkariresult12.vercel.app';
  const shareUrl = getCleanShareUrl(currentPost ? (currentPost.slug || currentPost.id) : undefined, baseUrl);

  const shareTitle = currentPost 
    ? (currentPost.shortTitle || currentPost.title) 
    : 'Sarkari Result Portal 2026';

  const shareMessage = currentPost
    ? `🚨 *Sarkari Result Alert 2026*\n\n📌 *${currentPost.title}*\n🏢 विभाग: ${currentPost.department || 'Government'}\n📅 अंतिम तिथि: ${currentPost.lastDate || 'जल्द आवेदन करें'}\n🎓 योग्यता: ${currentPost.qualifications?.join(', ') || '10th/12th/Graduate'}\n\n🔗 *आधिकारिक आवेदन व विवरण लिंक:*\n${shareUrl}\n\n📲 *व्हाट्सएप चैनल जॉइन करें:* https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j\n✈️ *टेलीग्राम चैनल:* https://t.me/newsarkariresultt\n\n👉 अपने सभी दोस्तों और स्टडी ग्रुप्स में शेयर करें!`
    : `🚨 *Sarkari Result 2026 - Official Portal*\n\nसभी सरकारी भर्ती (Sarkari Naukri), एडमिट कार्ड, रिजल्ट और आंसर की के सबसे तेज अपडेट्स!\n\n🔗 *पोर्टल लिंक:*\n${shareUrl}\n\n📲 *व्हाट्सएप चैनल:* https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j\n✈️ *टेलीग्राम:* https://t.me/newsarkariresultt\n\n👉 ग्रुप में शेयर करें और सबसे पहले अपडेट पाएं!`;

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share && !window.matchMedia('(min-width: 1024px)').matches) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareMessage,
            url: shareUrl,
          });
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') {
            return;
          }
        }
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareMessage);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareMessage;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 select-none">
      {/* 1-Click WhatsApp Viral Share Button */}
      <button
        onClick={handleWhatsAppShare}
        aria-label="Share on WhatsApp"
        type="button"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs sm:text-sm border-2 border-emerald-400"
        title="Share on WhatsApp Groups"
      >
        <span className="text-base sm:text-lg">💬</span>
        <span className="tracking-wide">WhatsApp Share</span>
      </button>

      {/* Copy / Native Share Pill */}
      <button
        onClick={handleNativeShare}
        aria-label="Copy Share Link"
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-lg transition-all duration-200 cursor-pointer border bg-white hover:bg-slate-50 text-slate-800 border-slate-300 font-bold text-xs sm:text-sm"
        title="Copy Link to share"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-blue-600" />}
        <span>{copied ? 'Copied!' : 'Share Link'}</span>
      </button>
    </div>
  );
};
