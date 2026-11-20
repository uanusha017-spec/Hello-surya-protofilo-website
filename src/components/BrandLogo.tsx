import React from 'react';

export const HK_SURYA_LOGO_SRC =
  '/assets/aistudio/529A0428-546D-4806-A071-216BA823C9B9_c684cf78.png';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

/**
 * Official HK SURYA Digital Solutions brand lockup using the uploaded emblem.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const isDark = variant === 'dark';

  const imgDimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <span className={`inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0 ${className}`}>
      <span
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden ${
          isDark
            ? 'rounded-lg bg-white p-1'
            : 'rounded-lg bg-white'
        }`}
      >
        <img
          src={HK_SURYA_LOGO_SRC}
          alt="HK Surya Digital Solutions logo"
          referrerPolicy="no-referrer"
          className={`${imgDimensions[size]} object-contain ${isDark ? '' : 'mix-blend-multiply'}`}
        />
      </span>

      {showWordmark && (
        <span
          className={`font-display font-bold tracking-[-0.025em] leading-none ${textSizes[size]} ${
            isDark ? 'text-white' : 'text-[#07255A]'
          }`}
        >
          HK <span className={isDark ? 'text-[#F5820D]' : 'text-[#E8740C]'}>Surya</span>
        </span>
      )}
    </span>
  );
};
