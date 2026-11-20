import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Mail, Phone } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  ENGAGEMENT_MODELS,
  PAGE_HERO_CAROUSELS,
  SERVICE_FAQS,
  ServicePhase,
} from '../data/defaults';
import { HeroCarousel } from './HeroCarousel';

interface ServicesPageProps {
  onBackHome: () => void;
  onRequestService: (serviceTitle: string) => void;
  onExploreWork: () => void;
}

type FilterPhase = 'All' | ServicePhase;

const LIFECYCLE_STAGES = [
  {
    step: '01',
    title: 'Discovery & Architecture',
    detail:
      'Aligning business goals, user journeys, database entities, SEO keyword hierarchy, and clear project milestones before design starts.',
  },
  {
    step: '02',
    title: 'Interface & Brand Design',
    detail:
      'Crafting minimalist, high-contrast responsive layouts tailored for desktop and mobile clarity with domain-matched feature imagery.',
  },
  {
    step: '03',
    title: 'Full-Stack Engineering',
    detail:
      'Building clean React & TypeScript interfaces backed by cloud databases, secure authentication, and real-time admin dashboards.',
  },
  {
    step: '04',
    title: 'Live Deployment & Care',
    detail:
      'Shipping to production on modern edge hosting with custom domains, SSL security, structured SEO data, and hands-on team training.',
  },
];

const FILTER_OPTIONS: FilterPhase[] = ['All', 'End-to-End', 'Design', 'Develop', 'Deliver'];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onBackHome,
  onRequestService,
  onExploreWork,
}) => {
  const { services, siteConfig } = usePortfolio();
  const [activePhase, setActivePhase] = useState<FilterPhase>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const filteredServices =
    activePhase === 'All'
      ? services
      : services.filter((service) => service.phase === activePhase);

  return (
    <div id="services-page" className="bg-white">
      {/* Full-Bleed Background Carousel Services Hero */}
      <HeroCarousel
        slides={[...PAGE_HERO_CAROUSELS.services]}
        ariaLabel="End-to-end services background carousel"
        contentClassName="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-16 lg:pt-14 lg:pb-24"
      >
        <div className="mb-8">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D] rounded-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-[#F5820D]">
            Services <span aria-hidden="true" className="mx-1.5 text-white/40">·</span> End-to-End
            Application Development
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-white [text-wrap:balance]">
            End-to-end digital applications—designed, developed, and delivered live.
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            From initial brand structure, SEO architecture, and responsive UI design to cloud
            databases, dynamic admin panels, and online technical classes, {siteConfig.studioName}{' '}
            handles every layer cleanly under one roof.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onRequestService('End-to-End Web Applications')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#F5820D] hover:bg-[#E07000] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onExploreWork}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>See Live Work</span>
            </button>
          </div>
        </div>
      </HeroCarousel>

      {/* 4-Stage End-to-End Delivery Process */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {LIFECYCLE_STAGES.map((stage) => (
            <div key={stage.step} className="space-y-2.5">
              <p className="font-mono text-sm font-medium text-[#C85A00] tabular-nums">
                {stage.step}.
              </p>
              <h2 className="font-display text-lg font-semibold text-[#07255A]">{stage.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{stage.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Catalog Section */}
      <section className="bg-[#F6F8FC] border-y border-slate-200 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-slate-200">
            <div className="space-y-2.5 max-w-2xl">
              <p className="text-sm font-medium text-[#C85A00]">What We Build</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A]">
                Complete capabilities across the product lifecycle.
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Filter services by phase"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl self-start lg:self-auto"
            >
              {FILTER_OPTIONS.map((phase) => {
                const isActive = activePhase === phase;
                return (
                  <button
                    key={phase}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActivePhase(phase)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] ${
                      isActive
                        ? 'bg-[#07255A] text-white'
                        : 'text-slate-600 hover:text-[#07255A]'
                    }`}
                  >
                    {phase}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="rounded-2xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col justify-between gap-6 hover:border-[#07255A]/30 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-[#C85A00] font-medium tabular-nums">
                      {service.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{service.phase}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{service.timeline}</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display text-2xl font-semibold text-[#07255A] tracking-[-0.02em]">
                      {service.title}
                    </h3>
                    <p className="text-sm font-medium text-[#C85A00]">{service.tagline}</p>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <p className="text-xs font-medium text-slate-500">Included Deliverables</p>
                    <ul className="space-y-2">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug"
                        >
                          <Check className="w-4 h-4 text-[#C85A00] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 max-w-xs">
                    <span className="font-medium text-[#07255A]">Ideal for:</span> {service.idealFor}
                  </p>

                  <button
                    type="button"
                    onClick={() => onRequestService(service.title)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C85A00] hover:text-[#07255A] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2 rounded-xs"
                  >
                    <span>Request Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models Section */}
      <section className="bg-white border-b border-slate-200 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-10">
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm font-medium text-[#C85A00]">Engagement Models</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
              Flexible collaboration tailored to businesses and learners.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {ENGAGEMENT_MODELS.map((model) => (
              <article
                key={model.index}
                className="rounded-2xl bg-[#F6F8FC] border border-slate-200 p-7 flex flex-col justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-[#C85A00] font-medium tabular-nums">
                      {model.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{model.cadence}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#07255A]">
                    {model.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{model.description}</p>
                </div>

                <ul className="pt-4 border-t border-slate-200/80 space-y-2 text-sm text-slate-700">
                  {model.includes.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#C85A00] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Backed by Schema.org FAQPage JSON-LD) */}
      <section className="bg-[#F6F8FC] border-b border-slate-200 py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-10">
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#C85A00]">Frequently Asked Questions</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A]">
              Common questions on timelines, SEO, dynamic updates &amp; classes.
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
            {SERVICE_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-[#F6F8FC]/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E8740C]"
                  >
                    <span className="font-display text-base sm:text-lg font-semibold text-[#07255A]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#C85A00] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Consultation Strip */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl bg-[#07255A] text-white p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm font-medium text-[#F5820D]">Ready to launch?</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] [text-wrap:balance]">
                Let&apos;s plan your end-to-end website or web application.
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm text-slate-200">
                <a
                  href={`mailto:${siteConfig.businessEmail}`}
                  className="inline-flex items-center gap-2 hover:text-[#F5820D] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#F5820D]" />
                  <span>{siteConfig.businessEmail}</span>
                </a>
                <a
                  href={`tel:+91${siteConfig.businessPhone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 hover:text-[#F5820D] transition-colors font-mono tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#F5820D]" />
                  <span>{siteConfig.businessPhone}</span>
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRequestService('End-to-End Web Applications')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#07255A] bg-white hover:bg-[#F5820D] hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Start a Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
