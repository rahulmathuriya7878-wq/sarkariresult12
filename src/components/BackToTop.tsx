import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 bg-[#ab1616] hover:bg-red-900 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer group hover:scale-110 active:scale-95 border-2 border-white"
      title="Back to Top (ऊपर जाएं)"
      aria-label="Back to Top"
    >
      <ArrowUp className="w-5 h-5 text-yellow-300 group-hover:translate-y-[-2px] transition-transform" />
    </button>
  );
};
