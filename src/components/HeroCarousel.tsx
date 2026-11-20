import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SmartImage } from './SmartImage';

export interface HeroCarouselSlide {
  src: string;
  alt: string;
  caption: string;
  subcaption?: string;
  imageClassName?: string;
}

interface HeroCarouselProps {
  slides: HeroCarouselSlide[];
  ariaLabel: string;
  children: React.ReactNode;
  autoPlayMs?: number;
  className?: string;
  contentClassName?: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  ariaLabel,
  children,
  autoPlayMs = 5200,
  className = '',
  contentClassName = 'max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-20 lg:pt-16 lg:pb-24',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeIndex = slides.length > 0 ? activeIndex % slides.length : 0;

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayMs);

    return () => window.clearInterval(timer);
  }, [slides.length, isPaused, autoPlayMs]);

  const goPrev = () => {
    if (slides.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    if (slides.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  const currentSlide = slides[safeIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full overflow-hidden bg-[#07255A] text-white ${className}`}
    >
      {/* Full-Bleed Background Crossfading Image Stack */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {slides.map((slide, idx) => {
          const isActive = idx === safeIndex;
          return (
            <div
              key={`${slide.src}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <SmartImage
                src={slide.src}
                alt={slide.alt}
                title={slide.caption}
                priority={idx === 0}
                className={`w-full h-full object-cover ${slide.imageClassName ?? 'object-center'}`}
              />
            </div>
          );
        })}
      </div>

      {/* Measured High-Contrast Deep Navy Gradient Scrims for Legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-r from-[#07255A]/92 via-[#07255A]/76 to-[#07255A]/45 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-t from-[#07255A]/85 via-transparent to-[#07255A]/35 pointer-events-none"
      />

      {/* Foreground Hero Content */}
      <div className={`relative z-20 ${contentClassName}`}>{children}</div>

      {/* Subtle Bottom Carousel Control Strip */}
      {slides.length > 1 && currentSlide && (
        <div className="relative z-20 border-t border-white/15 bg-[#07255A]/45 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 text-xs">
              <span className="font-mono font-medium text-[#F5820D] tabular-nums shrink-0">
                {String(safeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
              {currentSlide.subcaption && (
                <>
                  <span aria-hidden="true" className="text-white/35">
                    ·
                  </span>
                  <span className="font-medium text-white shrink-0">{currentSlide.subcaption}</span>
                </>
              )}
              <span aria-hidden="true" className="hidden sm:inline text-white/35">
                ·
              </span>
              <span className="hidden sm:inline text-slate-200 truncate">
                {currentSlide.caption}
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose background slide">
                {slides.map((slide, idx) => {
                  const active = idx === safeIndex;
                  return (
                    <button
                      key={slide.caption}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`Background slide ${idx + 1}: ${slide.caption}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D] ${
                        active ? 'w-7 bg-[#F5820D]' : 'w-3 bg-white/40 hover:bg-white/75'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous hero background image"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#F5820D] text-white border border-white/20 flex items-center justify-center transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next hero background image"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#F5820D] text-white border border-white/20 flex items-center justify-center transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
