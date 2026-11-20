import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Briefcase, Compass, Eye, GraduationCap } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  ExperienceType,
  PAGE_FEATURE_IMAGES,
  PAGE_HERO_CAROUSELS,
  STUDIO_VALUES,
  THEMED_FOUNDER_PHOTO_SRC,
} from '../data/defaults';
import { HK_SURYA_LOGO_SRC } from './BrandLogo';
import { HeroCarousel } from './HeroCarousel';
import { SmartImage } from './SmartImage';

interface AboutPageProps {
  onBackHome: () => void;
  onExploreWork: () => void;
  onStartProject: () => void;
}

type ExperienceFilter = 'All' | ExperienceType;

const EXPERIENCE_FILTERS: ExperienceFilter[] = ['All', 'Industry', 'Teaching', 'Online Teaching'];

const STUDIO_PILLARS = [
  {
    number: '01.',
    title: 'Design',
    description:
      'Every website starts with listening to your audience and business goals. I shape clear information architecture, cohesive color systems, and calm editorial layouts that earn immediate credibility.',
  },
  {
    number: '02.',
    title: 'Develop',
    description:
      'Using modern front-end frameworks, cloud databases, and responsive engineering standards, every application is written for speed, clean accessibility, and crisp rendering across every device.',
  },
  {
    number: '03.',
    title: 'Deliver',
    description:
      'Projects do not stay in static mockups—they ship live to production on Vercel, Netlify, Cloudflare Workers, and modern cloud platforms, ready for your clients from day one.',
  },
];

const CRAFT_AND_TEACHING_DOMAINS = [
  {
    category: 'Web & Application Engineering',
    items: [
      'React, TypeScript & Modern JavaScript (ES2022+)',
      'Responsive UI Systems & Tailwind CSS Architecture',
      'Firebase Firestore, Authentication & Cloud Admin Portals',
      'Per-Page SEO, OpenGraph Social Cards & Core Web Vitals',
    ],
  },
  {
    category: 'Teaching & Online Mentorship Focus',
    items: [
      'Computer Science Fundamentals for School & College Learners',
      'BCA & MCA Core Programming, Web Technologies & Project Labs',
      'Practical Portfolio & Live Deployment Coaching',
      '1-on-1 Doubt Resolution & Career Readiness Mentorship',
    ],
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackHome,
  onExploreWork,
  onStartProject,
}) => {
  const { siteConfig, experiences } = usePortfolio();
  const [expFilter, setExpFilter] = useState<ExperienceFilter>('All');

  const filteredExperiences =
    expFilter === 'All'
      ? experiences
      : experiences.filter((item) => item.type === expFilter);

  const educationHistory = [
    {
      index: '01',
      degree: siteConfig.mcaDegree,
      institution: siteConfig.mcaInstitution,
      location: 'Bengaluru, Karnataka',
      summary:
        'Completed postgraduate studies in Computer Science at PES University, Bengaluru—deepening expertise in software architecture, web application engineering, user interface systems, databases, and structured problem solving.',
      focusAreas: [
        'Full-Stack Web & Application Architecture',
        'Software Engineering & System Design',
        'Database Management & Cloud Deployment',
      ],
    },
    {
      index: '02',
      degree: siteConfig.bcaDegree,
      institution: siteConfig.bcaInstitution,
      location: 'Hubballi, Karnataka',
      summary:
        'Built a disciplined foundation in computing at P. C. Jabin Science College, Hubballi—covering core programming languages, data structures, web fundamentals, and practical software project execution.',
      focusAreas: [
        'Core Computer Science & Programming Logic',
        'Front-End Web Development & Design Fundamentals',
        'Practical Project Building & Problem Solving',
      ],
    },
  ];

  return (
    <div id="about-us" className="bg-white">
      {/* Full-Bleed Background Carousel About Hero */}
      <HeroCarousel
        slides={[...PAGE_HERO_CAROUSELS.aboutSecondary]}
        ariaLabel="About hello surya studio and academic background carousel"
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

        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-medium text-[#F5820D]">
            About Us <span aria-hidden="true" className="mx-1.5 text-white/40">·</span>{' '}
            {siteConfig.studioName}
          </p>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-white [text-wrap:balance]">
            Designing digital homes that feel clear, trustworthy, and unmistakably yours.
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            {siteConfig.aboutSummary}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStartProject}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#F5820D] hover:bg-[#E07000] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onExploreWork}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Explore Live Projects</span>
            </button>
          </div>
        </div>
      </HeroCarousel>

      {/* Founder Coat Portrait & Story Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-10 lg:gap-14">
          {/* Crisp Theme-Matched Founder Portrait */}
          <div className="lg:col-span-5">
            <div className="h-full min-h-[380px] lg:min-h-[480px] rounded-2xl overflow-hidden border border-[#07255A]/15 bg-[#07255A]/5">
              <SmartImage
                src={siteConfig.founderPhoto || THEMED_FOUNDER_PHOTO_SRC}
                alt="Portrait of founder in navy blazer coat for hello surya and HK Surya Digital Solutions"
                title="hello surya"
                className="w-full h-full object-cover object-[66%_18%]"
              />
            </div>
          </div>

          {/* Extended Founder Story */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-5">
            <p className="text-sm font-medium text-[#C85A00]">Founder&apos;s Story</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
              {siteConfig.aboutHeadline}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">{siteConfig.aboutExtended}</p>
            <p className="text-base text-slate-600 leading-relaxed">
              Whether launching a luxury interior showcase like Touchstone Atelier, a real estate
              platform for Shri Durga Developers, a serene wellness space like BODHI, or an
              end-to-end web application with a custom admin panel, every build is crafted to be
              easy to navigate, fast to load, and built to last.
            </p>
          </div>
        </div>
      </section>

      {/* Dedicated Our Mission & Our Vision Section + About Page Feature Image */}
      <section className="bg-[#07255A] text-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8 lg:gap-12">
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#F5820D]">
                  Our Mission &amp; Our Vision
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] leading-[1.12] [text-wrap:balance]">
                  Purposeful technology guided by engineering discipline and teaching clarity.
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Every product we design and every student we mentor is shaped by two enduring
                  commitments—making digital platforms effortless to own and making computer science
                  accessible in practice.
                </p>
              </div>

              <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-4 text-xs sm:text-sm">
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-medium text-[#F5820D] tabular-nums">
                    06+
                  </p>
                  <p className="text-slate-300 mt-0.5">Live Web Launches</p>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-medium text-[#F5820D] tabular-nums">
                    IT + Edu
                  </p>
                  <p className="text-slate-300 mt-0.5">Dual Industry &amp; Faculty</p>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-medium text-[#F5820D] tabular-nums">
                    100%
                  </p>
                  <p className="text-slate-300 mt-0.5">Dynamic Cloud Ready</p>
                </div>
              </div>
            </div>

            {/* About Us Feature Image */}
            <div className="lg:col-span-6">
              <div className="h-full min-h-[260px] lg:min-h-[340px] rounded-2xl overflow-hidden border border-white/15 bg-white/5">
                <SmartImage
                  src={PAGE_FEATURE_IMAGES.about}
                  alt="Architectural sunlit studio and academic library symbolizing HK Surya Digital Solutions mission and vision"
                  title="Our Mission & Vision — HK Surya Digital Solutions"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards (Dynamic from Firestore) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <article className="rounded-2xl bg-white text-[#07255A] p-7 sm:p-9 space-y-4">
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#C85A00]">
                <Compass className="w-4 h-4" />
                <span>Our Mission</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] leading-snug">
                {siteConfig.missionTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {siteConfig.missionStatement}
              </p>
            </article>

            <article className="rounded-2xl bg-[#0B3175] border border-white/15 text-white p-7 sm:p-9 space-y-4">
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#F5820D]">
                <Eye className="w-4 h-4" />
                <span>Our Vision</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] leading-snug">
                {siteConfig.visionTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {siteConfig.visionStatement}
              </p>
            </article>
          </div>

          {/* 4 Studio Core Values */}
          <div className="pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STUDIO_VALUES.map((val) => (
              <div key={val.index} className="space-y-2">
                <p className="font-mono text-xs font-medium text-[#F5820D] tabular-nums">
                  {val.index}
                </p>
                <h4 className="font-display text-lg font-semibold text-white">{val.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Industry & Teaching Experience Section */}
      <section className="bg-[#F6F8FC] border-y border-slate-200 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-slate-200">
            <div className="space-y-3 max-w-2xl">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-[#C85A00]">
                <Briefcase className="w-4 h-4" />
                <span>Industry &amp; Teaching Experience</span>
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
                Hands-on IT engineering paired with classroom &amp; online teaching.
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Filter experience by track"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl self-start lg:self-auto"
            >
              {EXPERIENCE_FILTERS.map((filter) => {
                const isActive = expFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setExpFilter(filter)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] ${
                      isActive
                        ? 'bg-[#07255A] text-white'
                        : 'text-slate-600 hover:text-[#07255A]'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {filteredExperiences.map((exp) => (
              <article
                key={exp.id}
                className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start"
              >
                <div className="lg:col-span-4 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-[#C85A00] font-medium tabular-nums">
                      {exp.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.type}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-mono tabular-nums font-medium ${
                        exp.current ? 'text-[#C85A00]' : 'text-[#07255A]'
                      }`}
                    >
                      {exp.duration}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#07255A]">
                    {exp.organization}
                  </h3>
                  <p className="text-sm font-medium text-[#C85A00]">{exp.role}</p>
                  <p className="text-xs text-slate-500">{exp.location}</p>
                </div>

                <div className="lg:col-span-8">
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {exp.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Academic Qualifications & Technical Curriculum Section */}
      <section className="bg-white border-b border-slate-200 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-14">
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200">
              <div className="space-y-3 max-w-2xl">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-[#C85A00]">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education &amp; Academic Qualifications</span>
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
                  Grounded in Computer Science from Hubballi to Bengaluru.
                </h2>
              </div>
              <p className="text-sm text-slate-600 max-w-sm">
                Formal academic training in software engineering and computer applications that
                powers every production website and application I ship.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {educationHistory.map((edu) => (
                <article
                  key={edu.index}
                  className="rounded-2xl bg-[#F6F8FC] border border-slate-200 p-7 sm:p-8 flex flex-col justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono text-[#C85A00] font-medium tabular-nums">
                        {edu.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{edu.location}</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#07255A] leading-snug">
                      {edu.degree}
                    </h3>

                    <p className="text-sm font-semibold text-[#C85A00]">{edu.institution}</p>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                      {edu.summary}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-200/80 space-y-2">
                    <p className="text-xs font-medium text-slate-500">Key Focus Areas</p>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {edu.focusAreas.map((area) => (
                        <li key={area} className="flex items-baseline gap-2.5">
                          <span className="text-[#F5820D] font-bold" aria-hidden="true">
                            —
                          </span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Core Engineering & Teaching Domains */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
            {CRAFT_AND_TEACHING_DOMAINS.map((domain) => (
              <div key={domain.category} className="space-y-3">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-[#07255A]">
                  {domain.category}
                </h3>
                <ul className="space-y-2 text-sm sm:text-base text-slate-600">
                  {domain.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-2.5">
                      <span className="text-[#F5820D] font-bold" aria-hidden="true">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Identity & Design · Develop · Deliver Pillars */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#C85A00]">Brand Identity</p>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.025em] text-[#07255A]">
                  {siteConfig.studioName}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Our identity brings together deep architectural navy for technical dependability
                  and vibrant solar orange representing Surya—clarity, warmth, and forward momentum.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#F6F8FC] p-8 flex items-center justify-center">
                <img
                  src={HK_SURYA_LOGO_SRC}
                  alt="Official HK Surya Digital Solutions — Design, Develop, Deliver logo"
                  referrerPolicy="no-referrer"
                  className="w-56 h-56 object-contain mix-blend-multiply"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#07255A] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-[#07255A]">Deep Navy</p>
                    <p className="font-mono text-xs text-slate-500">#07255A</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#F5820D] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-[#07255A]">Solar Orange</p>
                    <p className="font-mono text-xs text-slate-500">#F5820D</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 divide-y divide-slate-200 border-t border-slate-200 lg:border-t-0">
              {STUDIO_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.number}
                  className={`${
                    idx === 0 ? 'pt-8 lg:pt-0 pb-8' : 'py-8'
                  } grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6`}
                >
                  <div className="sm:col-span-4">
                    <h3 className="font-display text-xl font-semibold text-[#07255A]">
                      <span className="font-mono text-sm text-[#C85A00] mr-2 tabular-nums">
                        {pillar.number}
                      </span>
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="sm:col-span-8 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
