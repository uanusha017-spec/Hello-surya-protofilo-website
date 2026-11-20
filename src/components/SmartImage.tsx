import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  priority?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  title,
  className = '',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F4F4F5] text-zinc-600 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Globe className="w-6 h-6 text-zinc-400 mb-3" strokeWidth={1.5} />
        <span className="font-display text-sm font-medium text-zinc-700">
          {title || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
