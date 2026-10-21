import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string;
  mobileWebpSrc?: string;
  placeholderColor?: string;
  aspectRatio?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

/**
 * Reusable LazyImage Component
 * - Native loading="lazy" and decoding="async"
 * - Responsive WebP format switching (<picture>)
 * - Smooth skeleton / shimmer placeholder to eliminate CLS (Cumulative Layout Shift)
 * - Error boundary fallback
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  webpSrc,
  mobileWebpSrc,
  placeholderColor = 'bg-slate-200',
  aspectRatio,
  className = '',
  containerClassName = '',
  priority = false,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px 0px', // Pre-load 200px before scrolling into viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${placeholderColor} ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Shimmer skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      )}

      {isInView && (
        <picture>
          {mobileWebpSrc && (
            <source
              type="image/webp"
              media="(max-width: 640px)"
              srcSet={mobileWebpSrc}
            />
          )}
          {webpSrc && (
            <source
              type="image/webp"
              srcSet={webpSrc}
            />
          )}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            {...props}
          />
        </picture>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-xs p-2 text-center">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
};
