import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../data/defaults';

interface CaseStudiesIndexProps {
  onOpenCaseStudy: (project: ProjectItem) => void;
}

export const CaseStudiesIndex: React.FC<CaseStudiesIndexProps> = ({ onOpenCaseStudy }) => {
  const { projects } = usePortfolio();

  return (
    <section id="case-studies" className="bg-[#F6F8FC] border-y border-slate-200 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm font-medium text-[#C85A00]">02. Live Project Directory</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
              Direct links to every live build &amp; case study.
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-sm">
            Every external link opens the live production website in a new tab. Select any case
            study for architecture and design notes.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {projects.map((project) => (
            <div
              key={project.id}
              className="py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 items-start lg:items-center gap-4 lg:gap-6 group"
            >
              <div className="lg:col-span-5 flex items-baseline gap-4 min-w-0">
                <span className="font-mono text-xs text-[#C85A00] font-medium tabular-nums shrink-0">
                  {project.index}
                </span>
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onOpenCaseStudy(project)}
                    className="font-display text-lg sm:text-xl font-semibold text-[#07255A] group-hover:text-[#C85A00] transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:underline"
                  >
                    {project.title}
                  </button>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {project.discipline} <span aria-hidden="true">·</span> {project.location}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 pl-8 lg:pl-0 min-w-0">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-slate-500 hover:text-[#C85A00] transition-colors truncate block"
                  title={project.liveUrl}
                >
                  {project.displayDomain}
                </a>
              </div>

              <div className="lg:col-span-3 pl-8 lg:pl-0 flex items-center lg:justify-end gap-5 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenCaseStudy(project)}
                  className="text-sm font-medium text-[#07255A] hover:text-[#C85A00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2 rounded-xs"
                >
                  Case Study
                </button>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#C85A00] hover:text-[#9E4500] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2 rounded-xs"
                >
                  <span>Visit Live</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
