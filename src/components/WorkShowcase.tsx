import React, { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, FileText, Search, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PROJECT_CATEGORIES, ProjectCategory, ProjectItem } from '../data/defaults';
import { SmartImage } from './SmartImage';

interface WorkShowcaseProps {
  onOpenCaseStudy: (project: ProjectItem) => void;
  limit?: number;
  showSearch?: boolean;
  onViewAll?: () => void;
}

export const WorkShowcase: React.FC<WorkShowcaseProps> = ({
  onOpenCaseStudy,
  limit,
  showSearch = false,
  onViewAll,
}) => {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Show only categories that have projects (plus All)
  const visibleCategories = useMemo(() => {
    const used = new Set(projects.map((p) => p.category));
    return PROJECT_CATEGORIES.filter((cat) => cat === 'All' || used.has(cat));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        project.title.toLowerCase().includes(query) ||
        project.subtitle.toLowerCase().includes(query) ||
        project.discipline.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.summary.toLowerCase().includes(query)
      );
    });
  }, [projects, activeCategory, searchQuery]);

  const displayedProjects =
    typeof limit === 'number' && limit > 0
      ? filteredProjects.slice(0, limit)
      : filteredProjects;

  const getGridSpanClass = (idx: number, total: number) => {
    if (activeCategory !== 'All' || searchQuery.trim() !== '' || total % 2 !== 0) {
      return 'lg:col-span-6';
    }
    const pattern = [
      'lg:col-span-7',
      'lg:col-span-5',
      'lg:col-span-5',
      'lg:col-span-7',
    ];
    return pattern[idx % pattern.length];
  };

  return (
    <section id="work" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm font-medium text-[#C85A00]">
              {limit ? '02. Featured Works' : '01. Project Archive'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
              {limit
                ? 'Recent websites & digital experiences.'
                : 'Filter & explore all shipped projects.'}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-start lg:self-auto w-full lg:w-auto">
            {showSearch && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  className="w-full pl-9 pr-8 py-2 text-sm text-[#07255A] bg-[#F6F8FC] border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#E8740C] focus:ring-2 focus:ring-[#E8740C]/20 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#07255A] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <div
              role="tablist"
              aria-label="Filter projects by category"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl"
            >
              {visibleCategories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] ${
                      isActive
                        ? 'bg-[#07255A] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#07255A]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {displayedProjects.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-[#F6F8FC] p-12 text-center space-y-3">
            <p className="font-display text-lg font-semibold text-[#07255A]">
              No projects match &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-sm text-slate-600">
              Try a different keyword or reset the category filter to view all live builds.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {displayedProjects.map((project, idx) => (
              <article
                key={project.id}
                className={`${getGridSpanClass(
                  idx,
                  displayedProjects.length
                )} group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden transition-colors duration-200 hover:border-[#07255A]/30`}
              >
                <button
                  type="button"
                  onClick={() => onOpenCaseStudy(project)}
                  className="relative w-full aspect-[16/10] bg-[#F6F8FC] overflow-hidden text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E8740C]"
                  aria-label={`Open case study for ${project.title}`}
                >
                  <SmartImage
                    src={project.image}
                    alt={project.imageAlt}
                    title={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </button>

                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="font-mono tabular-nums text-[#C85A00] font-medium">
                        {project.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.discipline}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{project.year}</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-[#07255A]">
                      <button
                        type="button"
                        onClick={() => onOpenCaseStudy(project)}
                        className="text-left hover:text-[#C85A00] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:underline"
                      >
                        {project.title}
                      </button>
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C85A00] hover:text-[#9E4500] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2 rounded-xs"
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onOpenCaseStudy(project)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#07255A] hover:text-[#C85A00] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2 rounded-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Case Study</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {onViewAll && (
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              Showing{' '}
              <span className="font-mono tabular-nums font-semibold text-[#07255A]">
                {displayedProjects.length}
              </span>{' '}
              of{' '}
              <span className="font-mono tabular-nums font-semibold text-[#07255A]">
                {projects.length}
              </span>{' '}
              live projects. Open the dedicated Work page for search, filters &amp; complete case
              studies.
            </p>
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>View All {projects.length} Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
