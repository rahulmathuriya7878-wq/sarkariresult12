import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { SarkariPost } from '../types/job';

import { getCategoryShareText } from './FullPagePostView';

interface FloatingShareButtonProps {
  currentPost?: SarkariPost | null;
  isHindi?: boolean;
}

export const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({ currentPost, isHindi }) => {
  const [copied, setCopied] = useState(false);

  // Get current page URL & title
  const shareTitle = currentPost 
    ? `${currentPost.title} - Sarkari Result` 
    : 'Sarkari Result - Latest Govt Jobs, Admit Card & Exam Results';

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.sarkariresult.com';
  const shareUrl = currentPost 
    ? `${baseUrl}/#post/${currentPost.slug}?ref=share`
    : `${baseUrl}/?ref=share`;

  const shareText = currentPost
    ? getCategoryShareText(currentPost, shareUrl)
    : `Sarkari Result 2026 - Check Official Govt Jobs, Admit Cards, Answer Keys & Results:\n${shareUrl}`;

  const handleDirectShare = async () => {
    // 1. First priority: Direct Native System Share Dialog (No popup)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled native share or not allowed
        if ((err as Error).name !== 'AbortError') {
          console.log('Native share error, falling back to direct link action', err);
        } else {
          return; // User cancelled intent intentionally
        }
      }
    }

    // 2. Second priority (Fallback for Desktop/Unsupported browsers): Open WhatsApp directly
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.open(whatsappUrl, '_blank');
    } else {
      // On desktop, copy link directly to clipboard and show quick button badge feedback
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = `${shareText}\n${shareUrl}`;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  return (
    <div className="fixed bottom-5 left-4 z-40 flex items-center gap-2">
      <button
        onClick={handleDirectShare}
        aria-label="Share"
        className={`group relative inline-flex items-center gap-2 px-3.5 py-2.5 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 border border-white/20 ${
          copied 
            ? 'bg-emerald-600 hover:bg-emerald-700' 
            : 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className="font-bold text-[13px] tracking-wide pr-1">
          {copied 
            ? (isHindi ? 'लिंक कॉपी हो गया!' : 'Link Copied!') 
            : (isHindi ? 'शेयर करें' : 'Share')
          }
        </span>

        {/* Pulse ring animation */}
        {!copied && (
          <span className="absolute -inset-0.5 rounded-full bg-red-500 opacity-30 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};
