import React from 'react';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PAGE_HERO_CAROUSELS } from '../data/defaults';
import { HeroCarousel } from './HeroCarousel';

const MARQUEE_ITEMS = [
  'hk surya digital solutions',
  'design · develop · deliver',
  'end-to-end applications',
  'selected works',
  'live web deployments',
  'interior & real estate',
  'wellness & hospitality',
  'education & e-commerce',
];

interface HeroProps {
  onExploreWork: () => void;
  onOpenServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onOpenServices }) => {
  const { projects, services, siteConfig } = usePortfolio();

  const proofMetrics = [
    {
      value: String(projects.length).padStart(2, '0'),
      label: 'Live Shipped Projects',
      detail: 'Public external demos',
    },
    {
      value: String(services.length).padStart(2, '0'),
      label: 'End-to-End Services',
      detail: 'Design to cloud delivery',
    },
    {
      value: 'MCA',
      label: siteConfig.mcaInstitution,
      detail: 'Master in Computer Science',
    },
    {
      value: 'BCA',
      label: siteConfig.bcaInstitution,
      detail: 'Computer Applications',
    },
  ];

  return (
    <section id="top" className="bg-white">
      {/* Full-Bleed Background Image Carousel Hero */}
      <HeroCarousel
        slides={[...PAGE_HERO_CAROUSELS.home]}
        ariaLabel="HK Surya studio highlights background carousel"
        contentClassName="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-28"
      >
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-[#F5820D] tracking-tight">
            {siteConfig.studioName}{' '}
            <span aria-hidden="true" className="mx-1.5 text-white/40">
              ·
            </span>{' '}
            {siteConfig.tagline}
          </p>

          <h1 className="font-display font-semibold text-white tracking-[-0.03em] leading-[1.06] text-[clamp(2.35rem,4.6vw,4.25rem)] [text-wrap:balance]">
            {siteConfig.heroHeadline}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            {siteConfig.heroLead}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={onExploreWork}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#F5820D] hover:bg-[#E07000] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07255A]"
            >
              <span>Explore Selected Work</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenServices}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D]"
            >
              <span>End-to-End Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </HeroCarousel>

      {/* Full-Width Proof & Scope Row Below Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-12 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {proofMetrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="font-mono text-2xl sm:text-3xl font-medium tracking-tight text-[#07255A] tabular-nums">
                {metric.value}
              </p>
              <p className="text-sm font-semibold text-[#07255A]">{metric.label}</p>
              <p className="text-xs text-slate-500">{metric.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Editorial Marquee Divider */}
      <div
        className="border-b border-[#07255A]/15 bg-[#07255A] py-3.5 overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dupIndex) => (
            <div key={dupIndex} className="flex items-center shrink-0">
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={`${dupIndex}-${item}`}
                  className="inline-flex items-center text-xs sm:text-sm font-medium tracking-tight text-slate-200"
                >
                  <span className="px-5">{item}</span>
                  <span className="text-[#F5820D]">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
