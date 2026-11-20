import React from 'react';
import { ArrowLeft, ArrowRight, Mail, Phone } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PAGE_HERO_CAROUSELS } from '../data/defaults';
import { ContactSection } from './ContactSection';
import { HeroCarousel } from './HeroCarousel';

interface ContactPageProps {
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  initialProjectType?: string;
  onBackHome: () => void;
  onExploreWork: () => void;
  onOpenServices: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  nameInputRef,
  initialProjectType,
  onBackHome,
  onExploreWork,
  onOpenServices,
}) => {
  const { siteConfig } = usePortfolio();
  const cleanPhoneHref = `+91${siteConfig.businessPhone.replace(/\D/g, '')}`;

  return (
    <div className="bg-white">
      {/* Full-Bleed Background Image Carousel Hero */}
      <HeroCarousel
        slides={[...PAGE_HERO_CAROUSELS.contact]}
        ariaLabel="Contact HK Surya Digital Solutions background carousel"
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
              Contact Us{' '}
              <span aria-hidden="true" className="mx-1.5 text-white/40">
                ·
              </span>{' '}
              {siteConfig.studioName}
            </p>
            <h1 className="font-display font-semibold text-white tracking-[-0.03em] leading-[1.08] text-[clamp(2.25rem,4.2vw,3.75rem)] [text-wrap:balance]">
              Let&apos;s plan your website, application, or online class.
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              Connect directly by email or phone, or submit your project brief below. Every inquiry
              is saved directly to our live Admin Console so we can review your goals and reply
              within 24 hours.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${siteConfig.businessEmail}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#F5820D] hover:bg-[#E07000] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>{siteConfig.businessEmail}</span>
              </a>

              <a
                href={`tel:${cleanPhoneHref}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg transition-colors font-mono tabular-nums whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4 text-[#F5820D]" />
                <span>{siteConfig.businessPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </HeroCarousel>

      {/* Main Contact Form & Direct Studio Details */}
      <ContactSection
        nameInputRef={nameInputRef}
        initialProjectType={initialProjectType}
        standalonePage
      />

      {/* Secondary Navigation Band */}
      <section className="bg-[#F6F8FC] border-t border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#C85A00]">Explore Before You Reach Out</p>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#07255A]">
              Review our live shipped projects or end-to-end service packages.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={onExploreWork}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>View Live Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenServices}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#07255A] bg-white border border-slate-200 hover:border-[#07255A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Explore Services</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
