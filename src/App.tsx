import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { AboutPage } from './components/AboutPage';
import { AdminPanel } from './components/AdminPanel';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ContactPage } from './components/ContactPage';
import { FloatingWhatsAppWidget } from './components/FloatingWhatsAppWidget';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HomeAboutSection } from './components/HomeAboutSection';
import { Navbar } from './components/Navbar';
import { PageSEO } from './components/PageSEO';
import { ServicesPage } from './components/ServicesPage';
import { StudioStandardsSection } from './components/StudioStandardsSection';
import { WorkPage } from './components/WorkPage';
import { WorkShowcase } from './components/WorkShowcase';
import { usePortfolio } from './context/PortfolioContext';
import { ProjectItem } from './data/defaults';
import { ActivePage, parseRouteFromLocation, pushRoute } from './utils/router';

export default function App() {
  const { siteConfig } = usePortfolio();
  const initialRoute = parseRouteFromLocation();

  const [activePage, setActivePage] = useState<ActivePage>(initialRoute.page);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [prefilledService, setPrefilledService] = useState<string | undefined>(
    initialRoute.serviceParam
  );
  const contactNameRef = useRef<HTMLInputElement | null>(null);

  // Sync with browser Back / Forward buttons and direct URL changes
  useEffect(() => {
    const handlePopState = () => {
      const next = parseRouteFromLocation();
      setActivePage(next.page);
      setPrefilledService(next.serviceParam);
      setSelectedProject(null);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = useCallback((page: ActivePage, options?: { service?: string }) => {
    setSelectedProject(null);
    if (options?.service) {
      setPrefilledService(options.service);
    } else if (page !== 'contact') {
      setPrefilledService(undefined);
    }
    setActivePage(page);
    pushRoute(page, options);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleStartProject = useCallback(
    (serviceTitle?: string) => {
      navigateTo('contact', serviceTitle ? { service: serviceTitle } : undefined);
      window.setTimeout(() => {
        contactNameRef.current?.focus();
      }, 120);
    },
    [navigateTo]
  );

  const cleanPhoneHref = `+91${siteConfig.businessPhone.replace(/\D/g, '')}`;

  return (
    <div className="min-h-screen bg-white text-[#07255A] flex flex-col">
      <PageSEO activePage={activePage} selectedProject={selectedProject} />

      <Navbar
        activePage={activePage}
        onNavigate={(page) => navigateTo(page)}
        onStartProject={() => handleStartProject()}
      />

      <main key={activePage} className="flex-1">
        {activePage === 'home' && (
          <>
            <Hero
              onExploreWork={() => navigateTo('work')}
              onOpenServices={() => navigateTo('services')}
            />
            <HomeAboutSection onViewMore={() => navigateTo('about')} />
            <WorkShowcase
              limit={4}
              onOpenCaseStudy={setSelectedProject}
              onViewAll={() => navigateTo('work')}
            />
            <StudioStandardsSection
              onOpenServices={() => navigateTo('services')}
              onOpenAbout={() => navigateTo('about')}
            />

            {/* Direct CTA Band Redirecting to Dedicated Contact Page */}
            <section className="bg-[#F6F8FC] py-20 lg:py-24">
              <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="rounded-2xl bg-[#07255A] text-white p-8 sm:p-10 lg:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-3 max-w-2xl">
                    <p className="text-sm font-medium text-[#F5820D]">
                      04. Start a Project or Enroll in Online Classes
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-white [text-wrap:balance]">
                      Ready to launch a custom website or dynamic application?
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Visit our dedicated Contact page to send your brief, or connect directly via
                      email or phone. Every inquiry is answered within 24 hours.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-slate-200">
                      <a
                        href={`mailto:${siteConfig.businessEmail}`}
                        className="inline-flex items-center gap-2 hover:text-[#F5820D] transition-colors"
                      >
                        <Mail className="w-4 h-4 text-[#F5820D]" />
                        <span>{siteConfig.businessEmail}</span>
                      </a>
                      <a
                        href={`tel:${cleanPhoneHref}`}
                        className="inline-flex items-center gap-2 hover:text-[#F5820D] transition-colors font-mono tabular-nums"
                      >
                        <Phone className="w-4 h-4 text-[#F5820D]" />
                        <span>{siteConfig.businessPhone}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartProject()}
                      className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#F5820D] hover:bg-[#E07000] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Go to Contact Page</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('services')}
                      className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Explore Services</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activePage === 'work' && (
          <WorkPage
            onBackHome={() => navigateTo('home')}
            onOpenCaseStudy={setSelectedProject}
            onOpenServices={() => navigateTo('services')}
            onStartProject={() => handleStartProject()}
          />
        )}

        {activePage === 'services' && (
          <ServicesPage
            onBackHome={() => navigateTo('home')}
            onRequestService={(serviceTitle) => handleStartProject(serviceTitle)}
            onExploreWork={() => navigateTo('work')}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            onBackHome={() => navigateTo('home')}
            onExploreWork={() => navigateTo('work')}
            onStartProject={() => handleStartProject()}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage
            nameInputRef={contactNameRef}
            initialProjectType={prefilledService}
            onBackHome={() => navigateTo('home')}
            onExploreWork={() => navigateTo('work')}
            onOpenServices={() => navigateTo('services')}
          />
        )}

        {activePage === 'admin' && (
          <AdminPanel onBackHome={() => navigateTo('home')} />
        )}
      </main>

      <Footer onNavigate={(page) => navigateTo(page)} />

      {activePage !== 'admin' && (
        <FloatingWhatsAppWidget onOpenContact={() => handleStartProject()} />
      )}

      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
      />
    </div>
  );
}
