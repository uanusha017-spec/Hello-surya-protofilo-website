import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DELIVERY_STANDARDS } from '../data/defaults';

interface StudioStandardsSectionProps {
  onOpenServices: () => void;
  onOpenAbout: () => void;
}

const CORE_CAPABILITIES = [
  { label: 'Front-End Engineering', value: 'React, TypeScript, Tailwind CSS, Accessibility' },
  { label: 'Cloud & Dynamic Data', value: 'Firebase Firestore, Auth, Real-Time Admin Panels' },
  { label: 'Search & Performance', value: 'Per-Page SEO, OpenGraph, Schema.org, Edge Hosting' },
  { label: 'Education & Mentorship', value: 'College, School & Live Online Computer Science Classes' },
];

export const StudioStandardsSection: React.FC<StudioStandardsSectionProps> = ({
  onOpenServices,
  onOpenAbout,
}) => {
  return (
    <section id="standards" className="bg-white border-b border-slate-200 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm font-medium text-[#C85A00]">
              03. Engineering Standards &amp; Craft
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
              Built for search visibility, everyday control, and long-term reliability.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenServices}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C85A00] hover:text-[#07255A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>View Full Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <button
              type="button"
              onClick={onOpenAbout}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#07255A] hover:text-[#C85A00] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Our Mission &amp; Vision</span>
            </button>
          </div>
        </div>

        {/* 4 Core Delivery Standards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DELIVERY_STANDARDS.map((item) => (
            <article key={item.index} className="space-y-2.5">
              <p className="font-mono text-sm font-medium text-[#C85A00] tabular-nums">
                {item.index}
              </p>
              <h3 className="font-display text-lg font-semibold text-[#07255A]">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
            </article>
          ))}
        </div>

        {/* Clean Stack & Practice Ledger */}
        <div className="rounded-2xl bg-[#F6F8FC] border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {CORE_CAPABILITIES.map((cap, idx) => (
              <div
                key={cap.label}
                className={`${idx > 0 ? 'pt-5 md:pt-0 md:pl-6' : ''} space-y-1.5`}
              >
                <p className="text-xs font-medium text-[#C85A00]">{cap.label}</p>
                <p className="text-sm font-medium text-[#07255A] leading-snug">{cap.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
