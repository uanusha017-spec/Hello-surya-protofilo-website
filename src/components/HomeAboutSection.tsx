import React from 'react';
import { ArrowRight, Briefcase, GraduationCap } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { THEMED_FOUNDER_PHOTO_SRC } from '../data/defaults';
import { SmartImage } from './SmartImage';

interface HomeAboutSectionProps {
  onViewMore: () => void;
}

export const HomeAboutSection: React.FC<HomeAboutSectionProps> = ({ onViewMore }) => {
  const { siteConfig, experiences } = usePortfolio();

  const qualifications = [
    {
      degree: siteConfig.mcaDegree,
      institution: siteConfig.mcaInstitution,
      detail:
        'Advanced postgraduate study in software engineering, modern web architecture, database systems, and full-stack product delivery.',
    },
    {
      degree: siteConfig.bcaDegree,
      institution: siteConfig.bcaInstitution,
      detail:
        'Strong academic foundation in computer science fundamentals, structured programming, UI design principles, and web technologies.',
    },
  ];

  return (
    <section id="about-preview" className="bg-[#F6F8FC] border-b border-slate-200 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-10 lg:gap-14">
          {/* Left Column: Theme-Matched Founder Portrait Photo */}
          <div className="lg:col-span-5">
            <div className="h-full min-h-[380px] lg:min-h-[520px] rounded-2xl overflow-hidden border border-[#07255A]/15 bg-[#07255A]/5">
              <SmartImage
                src={siteConfig.founderPhoto || THEMED_FOUNDER_PHOTO_SRC}
                alt="Founder portrait in tailored navy coat for hello surya — HK Surya Digital Solutions"
                title="hello surya"
                className="w-full h-full object-cover object-[66%_18%]"
              />
            </div>
          </div>

          {/* Right Column: Brief Introduction, Qualifications, Experience Highlights & View More CTA */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-7">
            <div className="space-y-4">
              <p className="text-sm font-medium text-[#C85A00]">
                01. About Me, Qualifications &amp; Experience
              </p>

              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
                {siteConfig.aboutHeadline}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {siteConfig.aboutSummary}
              </p>
            </div>

            {/* Qualifications Block */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <GraduationCap className="w-4 h-4 text-[#C85A00]" />
                <span>Academic Qualifications</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {qualifications.map((item) => (
                  <div
                    key={item.degree}
                    className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 space-y-1"
                  >
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#07255A] leading-snug">
                      {item.degree}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-[#C85A00]">
                      {item.institution}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Industry & Teaching Experience Strip */}
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Briefcase className="w-4 h-4 text-[#C85A00]" />
                <span>Industry &amp; Teaching Experience</span>
              </div>

              <div className="divide-y divide-slate-200/80 bg-white rounded-xl border border-slate-200 px-5">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
                  >
                    <div className="min-w-0">
                      <span className="font-display text-sm font-semibold text-[#07255A]">
                        {exp.organization}
                      </span>
                      <span aria-hidden="true" className="mx-2 text-slate-300">
                        ·
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600">{exp.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs shrink-0">
                      <span className="text-slate-500">{exp.type}</span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span
                        className={`font-mono tabular-nums font-medium ${
                          exp.current ? 'text-[#C85A00]' : 'text-[#07255A]'
                        }`}
                      >
                        {exp.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission & Vision Snapshot */}
            <div className="border-t border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="text-xs font-medium text-[#C85A00]">Our Mission</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {siteConfig.missionStatement}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="text-xs font-medium text-[#C85A00]">Our Vision</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {siteConfig.visionStatement}
                </p>
              </div>
            </div>

            {/* View More Action -> Navigates to Full About Us Page */}
            <div className="pt-1 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={onViewMore}
                className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2"
              >
                <span>View More</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs sm:text-sm text-slate-500">
                Our mission, vision, full career timeline &amp; brand story
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
