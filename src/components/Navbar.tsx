import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ActivePage, PAGE_PATHS } from '../utils/router';
import { BrandLogo } from './BrandLogo';

export type { ActivePage };

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onStartProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onStartProject,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    page: ActivePage
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const navItems: { label: string; page: ActivePage; href: string }[] = [
    { label: 'Home', page: 'home', href: PAGE_PATHS.home },
    { label: 'Work', page: 'work', href: PAGE_PATHS.work },
    { label: 'Services', page: 'services', href: PAGE_PATHS.services },
    { label: 'About Us', page: 'about', href: PAGE_PATHS.about },
    { label: 'Admin', page: 'admin', href: PAGE_PATHS.admin },
  ];

  const isContactActive = activePage === 'contact';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Uploaded HK Surya brand lockup */}
        <a
          href={PAGE_PATHS.home}
          onClick={(e) => handleLinkClick(e, 'home')}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-4 rounded-sm shrink-0"
          aria-label="HK Surya Digital Solutions home"
        >
          <BrandLogo variant="light" size="md" />
        </a>

        {/* Zone 2: 5 clean single-line page navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isCurrent = activePage === item.page;
            return (
              <a
                key={item.page}
                href={item.href}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={(e) => handleLinkClick(e, item.page)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#E8740C] after:origin-left after:transition-transform after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-4 rounded-xs ${
                  isCurrent
                    ? 'text-[#07255A] font-semibold after:scale-x-100'
                    : 'text-slate-600 hover:text-[#07255A] after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action -> Redirects to dedicated /contact page */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={PAGE_PATHS.contact}
            aria-current={isContactActive ? 'page' : undefined}
            onClick={(e) => {
              if (
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey ||
                e.button !== 0
              ) {
                return;
              }
              e.preventDefault();
              setMobileMenuOpen(false);
              onStartProject();
            }}
            className={`hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2 ${
              isContactActive
                ? 'bg-[#C85A00]'
                : 'bg-[#07255A] hover:bg-[#C85A00]'
            }`}
          >
            Contact Us
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#07255A] hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-1">
          {navItems.map((item) => {
            const isCurrent = activePage === item.page;
            return (
              <a
                key={item.page}
                href={item.href}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={(e) => handleLinkClick(e, item.page)}
                className={`block py-2.5 text-base font-medium transition-colors ${
                  isCurrent
                    ? 'text-[#C85A00] font-semibold'
                    : 'text-[#07255A] hover:text-[#C85A00]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <div className="pt-3 border-t border-slate-100">
            <a
              href={PAGE_PATHS.contact}
              aria-current={isContactActive ? 'page' : undefined}
              onClick={(e) => {
                if (
                  e.metaKey ||
                  e.ctrlKey ||
                  e.shiftKey ||
                  e.altKey ||
                  e.button !== 0
                ) {
                  return;
                }
                e.preventDefault();
                setMobileMenuOpen(false);
                onStartProject();
              }}
              className="block w-full text-center py-2.5 px-4 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
