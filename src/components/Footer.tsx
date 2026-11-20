import React from 'react';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ActivePage, PAGE_PATHS } from '../utils/router';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { projects, siteConfig } = usePortfolio();
  const cleanPhoneHref = `+91${siteConfig.businessPhone.replace(/\D/g, '')}`;

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
    onNavigate(page);
  };

  const footerLinks: { label: string; page: ActivePage; href: string }[] = [
    { label: 'Home', page: 'home', href: PAGE_PATHS.home },
    { label: 'Selected Works', page: 'work', href: PAGE_PATHS.work },
    { label: 'End-to-End Services', page: 'services', href: PAGE_PATHS.services },
    { label: 'About Us', page: 'about', href: PAGE_PATHS.about },
    { label: 'Contact Us', page: 'contact', href: PAGE_PATHS.contact },
    { label: 'Admin Panel', page: 'admin', href: PAGE_PATHS.admin },
  ];

  return (
    <footer className="bg-[#07255A] text-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/15">
          {/* Brand & Direct Contact Column */}
          <div className="md:col-span-5 space-y-4">
            <a
              href={PAGE_PATHS.home}
              onClick={(e) => handleLinkClick(e, 'home')}
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D] rounded-sm"
              aria-label="Back to home"
            >
              <BrandLogo variant="dark" size="md" />
            </a>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {siteConfig.studioName} — {siteConfig.tagline}. End-to-end web design and full-stack
              application engineering for businesses and institutions.
            </p>
            <div className="space-y-2 pt-1 text-sm">
              <a
                href={`mailto:${siteConfig.businessEmail}`}
                className="flex items-center gap-2 text-slate-200 hover:text-[#F5820D] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#F5820D] shrink-0" />
                <span className="break-all">{siteConfig.businessEmail}</span>
              </a>
              <a
                href={`tel:${cleanPhoneHref}`}
                className="flex items-center gap-2 text-slate-200 hover:text-[#F5820D] transition-colors font-mono tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#F5820D] shrink-0" />
                <span>{siteConfig.businessPhone}</span>
              </a>
            </div>

            {/* Social Media Links: Facebook & Instagram */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1LZeqkeQQn/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow HK Surya on Facebook"
                className="inline-flex items-center gap-2 px-3.5 py-2 min-h-10 rounded-lg bg-white/10 hover:bg-[#F5820D] border border-white/15 hover:border-[#F5820D] text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href="https://www.instagram.com/hellosurya2026?avpt=dm8waW5obTJwODU2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow hello surya on Instagram"
                className="inline-flex items-center gap-2 px-3.5 py-2 min-h-10 rounded-lg bg-white/10 hover:bg-[#F5820D] border border-white/15 hover:border-[#F5820D] text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-medium text-[#F5820D]">Pages</p>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.map((link) => (
                <li key={link.page}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.page)}
                    className="text-slate-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* External Live Projects Column */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-medium text-[#F5820D]">Live Shipped Websites</p>
            <ul className="space-y-2.5 text-sm">
              {projects.slice(0, 8).map((project) => (
                <li key={project.id}>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
                  >
                    <span className="truncate">{project.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#F5820D] shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} hello surya · {siteConfig.studioName}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};
