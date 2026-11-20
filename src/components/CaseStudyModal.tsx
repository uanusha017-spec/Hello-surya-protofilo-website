import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ExternalLink, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../data/defaults';
import { SmartImage } from './SmartImage';

interface CaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onSelectProject,
}) => {
  const { projects } = usePortfolio();

  useEffect(() => {
    if (!project || projects.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        const currentIndex = projects.findIndex((p) => p.id === project.id);
        const nextProject = projects[(currentIndex + 1) % projects.length];
        onSelectProject(nextProject);
      } else if (event.key === 'ArrowLeft') {
        const currentIndex = projects.findIndex((p) => p.id === project.id);
        const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
        onSelectProject(prevProject);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, projects, onClose, onSelectProject]);

  if (!project) return null;

  const currentIndex = Math.max(
    0,
    projects.findIndex((p) => p.id === project.id)
  );
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length] ?? project;
  const nextProject = projects[(currentIndex + 1) % projects.length] ?? project;

  const highlights = project.highlights ?? [
    { label: 'Category', value: project.category },
    { label: 'Discipline', value: project.discipline },
    { label: 'Deployment', value: project.platform },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#04173B]/80 backdrop-blur-xs p-4 sm:p-6 lg:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 min-w-0">
            <span className="font-mono tabular-nums text-[#07255A] font-medium shrink-0">
              Case Study {project.index} / {String(projects.length).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="shrink-0">
              ·
            </span>
            <span className="truncate">{project.discipline}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectProject(prevProject)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-[#07255A] hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C]"
              aria-label={`Previous project: ${prevProject.title}`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelectProject(nextProject)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-[#07255A] hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C]"
              aria-label={`Next project: ${nextProject.title}`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#07255A] text-white hover:bg-[#C85A00] transition-colors cursor-pointer ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2"
              aria-label="Close case study"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs sm:text-sm text-slate-500">
                {project.location} <span aria-hidden="true">·</span> {project.year}{' '}
                <span aria-hidden="true">·</span> Hosted on {project.platform}
              </p>
              <h2
                id="case-study-title"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]"
              >
                {project.title}
              </h2>
              <p className="text-base text-slate-600">{project.subtitle}</p>
            </div>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#C85A00] hover:bg-[#07255A] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2"
            >
              <span>Visit Live Website</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#F6F8FC] aspect-[16/9]">
            <SmartImage
              src={project.image}
              alt={project.imageAlt}
              title={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-slate-200">
            {highlights.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="font-display text-base font-semibold text-[#07255A]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-[#07255A]">The Challenge</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-[#07255A]">
                  Design &amp; Engineering Approach
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {project.approach}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-xl bg-[#F6F8FC] border border-slate-200 space-y-4">
                <h3 className="font-display text-base font-semibold text-[#07255A]">
                  Key Deliverables
                </h3>
                <ul className="space-y-2.5">
                  {project.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug"
                    >
                      <Check className="w-4 h-4 text-[#C85A00] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <p className="text-xs text-slate-500">External Live URL</p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#C85A00] hover:underline break-all"
                  >
                    <span>{project.liveUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
