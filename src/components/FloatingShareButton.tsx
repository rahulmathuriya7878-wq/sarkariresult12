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

  // Get current page URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sarkariresult12.vercel.app';
  const shareUrl = currentPost 
    ? `${baseUrl}/#post/${currentPost.slug || currentPost.id}?ref=share`
    : `${baseUrl}/?ref=share`;

  const shareTitle = currentPost 
    ? (currentPost.shortTitle || currentPost.title) 
    : 'Sarkari Result';

  // Construct full formatted Hindi share message
  const shareMessage = currentPost
    ? getCategoryShareText(currentPost, shareUrl)
    : `🚨 *Sarkari Result 2026 - Official Portal* 🚨\n\n📋 *सभी सरकारी भर्ती, रिजल्ट, एडमिट कार्ड व आंसर की अपडेट्स*\n\n👇 *आधिकारिक पोर्टल देखें व आवेदन करें:*\n${shareUrl}`;

  const handleDirectShare = async () => {
    // 1. First priority: Direct Native System Share Dialog (Sharing full formatted message)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
        });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
      }
    }

    // 2. Second priority: Open WhatsApp directly with full formatted message
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.open(whatsappUrl, '_blank');
    } else {
      try {
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
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
      <button
        onClick={handleDirectShare}
        aria-label="Share Post Link"
        type="button"
        className={`group relative inline-flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 border border-emerald-400/30 ${
          copied 
            ? 'bg-emerald-700 hover:bg-emerald-800 ring-2 ring-emerald-300' 
            : 'bg-emerald-600 hover:bg-emerald-700 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className="font-extrabold text-[13px] sm:text-sm tracking-wide pr-1">
          {copied 
            ? (isHindi ? 'लिंक कॉपी हो गया!' : 'Link Copied!') 
            : (isHindi ? 'शेयर करें' : 'Share')
          }
        </span>

        {/* Pulse ring animation */}
        {!copied && (
          <span className="absolute -inset-0.5 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};
