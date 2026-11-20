import React from 'react';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PAGE_HERO_CAROUSELS, ProjectItem } from '../data/defaults';
import { CaseStudiesIndex } from './CaseStudiesIndex';
import { HeroCarousel } from './HeroCarousel';
import { WorkShowcase } from './WorkShowcase';

interface WorkPageProps {
  onBackHome: () => void;
  onOpenCaseStudy: (project: ProjectItem) => void;
  onOpenServices: () => void;
  onStartProject: () => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({
  onBackHome,
  onOpenCaseStudy,
  onOpenServices,
  onStartProject,
}) => {
  const { projects, siteConfig } = usePortfolio();

  const distinctCategories = new Set(projects.map((p) => p.category)).size;
  const distinctPlatforms = new Set(projects.map((p) => p.platform)).size;

  return (
    <div className="bg-white">
      {/* Full-Bleed Background Image Carousel Hero */}
      <HeroCarousel
        slides={[...PAGE_HERO_CAROUSELS.work]}
        ariaLabel="Selected works and case studies background carousel"
        contentClassName="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-16 lg:pt-16 lg:pb-24"
      >
        <div className="space-y-8">
          <div>
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-[#F5820D] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D] rounded-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-medium text-[#F5820D]">
              Selected Works &amp; Case Studies{' '}
              <span aria-hidden="true" className="mx-1.5 text-white/40">
                ·
              </span>{' '}
              {siteConfig.studioName}
            </p>
            <h1 className="font-display font-semibold text-white tracking-[-0.03em] leading-[1.08] text-[clamp(2.25rem,4.2vw,3.75rem)] [text-wrap:balance]">
              Live websites, platforms &amp; architectural case studies.
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              Explore every live project built and shipped by hello surya—dynamically synced from
              our cloud database. Filter by industry, search by discipline, open full case studies,
              or launch any external live demo directly.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartProject}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#F5820D] hover:bg-[#E07000] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Start a Similar Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenServices}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore Services</span>
              </button>
            </div>
          </div>
        </div>
      </HeroCarousel>

      {/* Dynamic Portfolio Summary Metrics Bar */}
      <section className="bg-[#F6F8FC] border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="font-mono text-2xl font-medium text-[#07255A] tabular-nums">
              {String(projects.length).padStart(2, '0')}
            </p>
            <p className="text-sm font-semibold text-[#07255A]">Live External Demos</p>
            <p className="text-xs text-slate-500">Updated dynamically from Admin</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-medium text-[#07255A] tabular-nums">
              {String(distinctCategories).padStart(2, '0')}
            </p>
            <p className="text-sm font-semibold text-[#07255A]">Industry Verticals</p>
            <p className="text-xs text-slate-500">Real estate, wellness, retail &amp; schools</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-medium text-[#07255A] tabular-nums">
              {String(distinctPlatforms).padStart(2, '0')}
            </p>
            <p className="text-sm font-semibold text-[#07255A]">Cloud Hosting Platforms</p>
            <p className="text-xs text-slate-500">Vercel, Netlify, Cloudflare &amp; Firebase</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-medium text-[#C85A00] tabular-nums">100%</p>
            <p className="text-sm font-semibold text-[#07255A]">Responsive Delivery</p>
            <p className="text-xs text-slate-500">Mobile-first UX &amp; search-ready builds</p>
          </div>
        </div>
      </section>

      {/* Interactive Full Project Showcase with Search & Category Filter */}
      <WorkShowcase showSearch onOpenCaseStudy={onOpenCaseStudy} />

      {/* Complete Case Studies Ledger */}
      <CaseStudiesIndex onOpenCaseStudy={onOpenCaseStudy} />

      {/* Bottom Project Inquiry CTA */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl bg-[#07255A] text-white p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#F5820D]">
                <Layers className="w-4 h-4" />
                <span>Custom Websites &amp; End-to-End Applications</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white [text-wrap:balance]">
                Want your business or institution showcased with this level of craft?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Share your goals and timeline. Every build includes responsive design, per-page SEO,
                and optional dynamic Admin Panel control so you can publish updates anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={onStartProject}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#F5820D] hover:bg-[#E07000] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenServices}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View Services</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
