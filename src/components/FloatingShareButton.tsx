import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
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

  const shareMessage = currentPost
    ? getCategoryShareText(currentPost, shareUrl)
    : `Sarkari Result 2026 - Official Portal\n\nसभी सरकारी भर्ती, रिजल्ट, एडमिट कार्ड व आंसर की अपडेट्स\n\nआधिकारिक पोर्टल देखें व आवेदन करें:\n${shareUrl}`;

  const handleClick = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share && !window.matchMedia('(min-width: 1024px)').matches) {
        try {
          await navigator.share({
            title: currentPost ? (currentPost.shortTitle || currentPost.title) : 'Sarkari Result',
            text: shareMessage,
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
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
      <button
        onClick={handleClick}
        aria-label="Share Post Link"
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg transition-all duration-200 cursor-pointer border bg-white text-blue-900 hover:bg-blue-50 border-blue-600 font-bold text-sm sm:text-base"
      >
        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-blue-600 text-white shadow-sm">
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5 text-white" />}
        </div>
        <span>
          {copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'शेयर करें' : 'Share')}
        </span>
      </button>
    </div>
  );
};
