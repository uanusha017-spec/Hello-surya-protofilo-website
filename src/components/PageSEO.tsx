import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PAGE_FEATURE_IMAGES, ProjectItem, SERVICE_FAQS } from '../data/defaults';
import { ActivePage, PAGE_PATHS } from '../utils/router';

interface PageSEOProps {
  activePage: ActivePage;
  selectedProject?: ProjectItem | null;
}

function upsertMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(data: Record<string, unknown>) {
  let script = document.getElementById('hk-surya-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'hk-surya-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return `${window.location.origin}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export const PageSEO: React.FC<PageSEOProps> = ({ activePage, selectedProject }) => {
  const { siteConfig, projects, services, experiences } = usePortfolio();

  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${PAGE_PATHS[activePage]}`;

    let title = `hello surya — Web Design, Full-Stack Apps & Portfolio`;
    let description = `Explore ${projects.length} live websites, end-to-end web apps, and case studies by ${siteConfig.studioName}—combining MCA engineering and teaching craft.`;
    let featureImage: string = PAGE_FEATURE_IMAGES.home;
    let robots = 'index, follow';
    let jsonLd: Record<string, unknown>;

    if (selectedProject) {
      title = `${selectedProject.title} Case Study — hello surya`;
      description = `${selectedProject.subtitle}. ${selectedProject.summary}`.slice(0, 158);
      featureImage = selectedProject.image || PAGE_FEATURE_IMAGES.work;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: selectedProject.title,
        headline: selectedProject.subtitle,
        description: selectedProject.summary,
        url: selectedProject.liveUrl,
        image: toAbsoluteUrl(featureImage),
        creator: {
          '@type': 'Organization',
          name: siteConfig.studioName,
        },
        datePublished: selectedProject.year,
      };
    } else if (activePage === 'work') {
      title = `Selected Works & Case Studies — hello surya · ${siteConfig.studioName}`;
      description = `Browse ${projects.length} live websites and interactive case studies across real estate, interior architecture, wellness, e-commerce, and schools.`;
      featureImage = PAGE_FEATURE_IMAGES.work;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Selected Works — ${siteConfig.studioName}`,
        description,
        url: canonicalUrl,
        primaryImageOfPage: toAbsoluteUrl(featureImage),
        mainEntity: {
          '@type': 'ItemList',
          name: 'Selected Live Web Projects',
          itemListElement: projects.map((proj, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: proj.title,
            url: proj.liveUrl,
          })),
        },
      };
    } else if (activePage === 'services') {
      title = `End-to-End Web & App Services — ${siteConfig.studioName}`;
      description =
        'Custom UI/UX design, full-stack web applications, e-commerce, admin panels, and online coding classes delivered end to end by HK Surya.';
      featureImage = PAGE_FEATURE_IMAGES.services;
      jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ProfessionalService',
            name: siteConfig.studioName,
            url: canonicalUrl,
            image: toAbsoluteUrl(featureImage),
            email: siteConfig.businessEmail,
            telephone: `+91${siteConfig.businessPhone.replace(/\D/g, '')}`,
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'End-to-End Digital Services',
              itemListElement: services.map((svc, idx) => ({
                '@type': 'Offer',
                position: idx + 1,
                itemOffered: {
                  '@type': 'Service',
                  name: svc.title,
                  description: svc.description,
                },
              })),
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: SERVICE_FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ],
      };
    } else if (activePage === 'about') {
      title = `About Us, Mission & Vision — hello surya · HK Surya`;
      description =
        'Discover our mission, vision, MCA & BCA qualifications, IT experience at Natton.ai & Clickcrawl, and teaching at IBMR & Chinmaya Vidyalaya.';
      featureImage = PAGE_FEATURE_IMAGES.about;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: `About ${siteConfig.studioName}`,
        description: siteConfig.aboutSummary,
        url: canonicalUrl,
        primaryImageOfPage: toAbsoluteUrl(featureImage),
        mainEntity: {
          '@type': 'Person',
          name: 'hello surya',
          jobTitle: 'Founder, Full-Stack Designer & Computer Science Educator',
          email: siteConfig.businessEmail,
          telephone: `+91${siteConfig.businessPhone.replace(/\D/g, '')}`,
          image: toAbsoluteUrl(siteConfig.founderPhoto),
          alumniOf: [
            { '@type': 'CollegeOrUniversity', name: siteConfig.mcaInstitution },
            { '@type': 'CollegeOrUniversity', name: siteConfig.bcaInstitution },
          ],
          worksFor: experiences
            .filter((e) => e.current)
            .map((e) => ({ '@type': 'Organization', name: e.organization })),
        },
      };
    } else if (activePage === 'contact') {
      title = `Contact Us — hello surya · ${siteConfig.studioName}`;
      description = `Get in touch with ${siteConfig.studioName} via email (${siteConfig.businessEmail}), phone (${siteConfig.businessPhone}), or our live project brief form.`;
      featureImage = PAGE_FEATURE_IMAGES.contact;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: `Contact ${siteConfig.studioName}`,
        description,
        url: canonicalUrl,
        primaryImageOfPage: toAbsoluteUrl(featureImage),
        mainEntity: {
          '@type': 'Organization',
          name: siteConfig.studioName,
          email: siteConfig.businessEmail,
          telephone: `+91${siteConfig.businessPhone.replace(/\D/g, '')}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: siteConfig.location,
            addressCountry: 'IN',
          },
        },
      };
    } else if (activePage === 'admin') {
      title = `Admin Console — ${siteConfig.studioName}`;
      description =
        'Secure administrator workspace to manage live portfolio projects, services, career experience, mission, vision, and client inquiries.';
      featureImage = PAGE_FEATURE_IMAGES.admin;
      robots = 'noindex, nofollow';
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${siteConfig.studioName} Admin Console`,
        description,
        url: canonicalUrl,
      };
    } else {
      jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            name: `hello surya · ${siteConfig.studioName}`,
            url: `${origin}/`,
            description,
          },
          {
            '@type': 'ProfessionalService',
            name: siteConfig.studioName,
            alternateName: 'hello surya',
            description: siteConfig.heroLead,
            image: toAbsoluteUrl(featureImage),
            email: siteConfig.businessEmail,
            telephone: `+91${siteConfig.businessPhone.replace(/\D/g, '')}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: siteConfig.location,
              addressCountry: 'IN',
            },
          },
          {
            '@type': 'ItemList',
            name: 'Selected Live Web Projects',
            itemListElement: projects.map((proj, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: proj.title,
              url: proj.liveUrl,
            })),
          },
        ],
      };
    }

    const absoluteImage = toAbsoluteUrl(featureImage);

    document.title = title;
    upsertMetaTag('name', 'description', description);
    upsertMetaTag('name', 'robots', robots);
    upsertCanonical(canonicalUrl);

    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:site_name', `hello surya · ${siteConfig.studioName}`);
    upsertMetaTag('property', 'og:title', title);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', absoluteImage);

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', title);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('name', 'twitter:image', absoluteImage);

    upsertJsonLd(jsonLd);
  }, [activePage, selectedProject, siteConfig, projects, services, experiences]);

  return null;
};
