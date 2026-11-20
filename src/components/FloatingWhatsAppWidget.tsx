import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle,
  Phone,
  Send,
  X,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SERVICE_FAQS } from '../data/defaults';

interface FloatingWhatsAppWidgetProps {
  onOpenContact: () => void;
}

function formatWhatsAppNumber(rawPhone: string): {
  waDigits: string;
  telHref: string;
  displayPhone: string;
} {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) {
    return {
      waDigits: '919989581311',
      telHref: 'tel:+919989581311',
      displayPhone: '9989581311',
    };
  }

  // Standard 10-digit Indian mobile number -> prefix with 91
  const waDigits = digits.length === 10 ? `91${digits}` : digits;
  const telHref = `tel:+${waDigits}`;
  return {
    waDigits,
    telHref,
    displayPhone: rawPhone.trim(),
  };
}

export const FloatingWhatsAppWidget: React.FC<FloatingWhatsAppWidgetProps> = ({
  onOpenContact,
}) => {
  const { siteConfig } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'connect' | 'faq'>('connect');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [customMessage, setCustomMessage] = useState('');

  const { waDigits, telHref, displayPhone } = useMemo(
    () => formatWhatsAppNumber(siteConfig.businessPhone),
    [siteConfig.businessPhone]
  );

  // Close widget on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const buildWhatsAppUrl = (text?: string) => {
    const fallback = `Hello ${siteConfig.studioName}, I would like to discuss a website, app, or online class.`;
    const finalMessage = (text || customMessage).trim() || fallback;
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(finalMessage)}`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Expandable Floating Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="WhatsApp, Call and Frequently Asked Questions"
          className="w-[calc(100vw-2.5rem)] max-w-[370px] rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[78vh]"
        >
          {/* Header */}
          <div className="bg-[#07255A] text-white px-5 py-4 flex items-start justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-medium text-[#F5820D]">
                hello surya · Quick Connect
              </p>
              <h2 className="font-display text-base font-semibold text-white truncate">
                {siteConfig.studioName}
              </h2>
              <p className="text-xs text-slate-300 font-mono tabular-nums">
                +91 {displayPhone.replace(/^\+?91\s*/, '')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp and FAQ menu"
              className="w-9 h-9 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 inline-flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Tabs: Call & WhatsApp vs Frequently Asked Questions */}
          <div className="bg-[#F6F8FC] border-b border-slate-200 p-2 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView('connect')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'connect'
                  ? 'bg-[#07255A] text-white'
                  : 'text-slate-600 hover:text-[#07255A] bg-white border border-slate-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Call &amp; WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('faq')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'faq'
                  ? 'bg-[#07255A] text-white'
                  : 'text-slate-600 hover:text-[#07255A] bg-white border border-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ Chat ({SERVICE_FAQS.length})</span>
            </button>
          </div>

          {/* Panel Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {activeView === 'connect' ? (
              <>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Choose how you want to connect directly with our studio number{' '}
                  <span className="font-mono font-semibold text-[#07255A] tabular-nums">
                    {displayPhone}
                  </span>
                  :
                </p>

                {/* Two Core Requested Options: 1) Call Button, 2) WhatsApp Chat */}
                <div className="grid grid-cols-1 gap-2.5">
                  <a
                    href={telHref}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-[#07255A] hover:bg-[#0D357D] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-[#F5820D]" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight">Call Directly</p>
                        <p className="text-xs text-slate-200 font-mono tabular-nums mt-0.5">
                          {displayPhone}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-200 shrink-0" />
                  </a>

                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-[#168C44] hover:bg-[#127337] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168C44]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight">WhatsApp Chat</p>
                        <p className="text-xs text-emerald-100 font-mono tabular-nums mt-0.5">
                          Chat on +{waDigits}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-100 shrink-0" />
                  </a>
                </div>

                {/* Quick WhatsApp Message Composer */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <label
                    htmlFor="wa-quick-msg"
                    className="block text-xs font-medium text-[#07255A]"
                  >
                    Or type a quick message for WhatsApp
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="wa-quick-msg"
                      type="text"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Hi, I need a website / app..."
                      className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm text-[#07255A] bg-[#F6F8FC] border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#E8740C]"
                    />
                    <a
                      href={buildWhatsAppUrl(customMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Send message on WhatsApp"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#168C44] hover:bg-[#127337] text-white transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Quick Jump to Interactive FAQs */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveView('faq')}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#C85A00] hover:text-[#07255A] transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Browse Frequently Asked Questions</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select a question below for an instant answer, or continue directly on WhatsApp or
                  our Contact form.
                </p>

                <div className="space-y-2">
                  {SERVICE_FAQS.map((faq, idx) => {
                    const expanded = openFaqIdx === idx;
                    return (
                      <div
                        key={faq.question}
                        className="rounded-xl border border-slate-200 bg-[#F6F8FC] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIdx(expanded ? null : idx)}
                          aria-expanded={expanded}
                          className="w-full px-3.5 py-3 text-left flex items-start justify-between gap-2.5 cursor-pointer hover:bg-slate-100/70 transition-colors"
                        >
                          <span className="text-xs font-semibold text-[#07255A] leading-snug">
                            {faq.question}
                          </span>
                          {expanded ? (
                            <ChevronUp className="w-4 h-4 text-[#C85A00] shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                        </button>

                        {expanded && (
                          <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-slate-200/70 bg-white">
                            <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                            <a
                              href={buildWhatsAppUrl(`Hi ${siteConfig.studioName}, I have a question about: ${faq.question}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#168C44] hover:underline"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Ask this on WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Strip inside FAQ Chat */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                  <a
                    href={telHref}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenContact();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#07255A] bg-[#F6F8FC] hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Contact Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close WhatsApp and FAQ assistant' : 'Open WhatsApp, Call and FAQ assistant'}
        className="w-14 h-14 rounded-full bg-[#168C44] hover:bg-[#127337] text-white shadow-lg flex items-center justify-center transition-transform duration-150 hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07255A] focus-visible:ring-offset-2"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg
            viewBox="0 0 32 32"
            fill="currentColor"
            className="w-7 h-7"
            aria-hidden="true"
          >
            <path d="M16.01 3.2C9.04 3.2 3.38 8.86 3.38 15.83c0 2.23.58 4.4 1.69 6.32L3.2 28.8l6.83-1.79a12.56 12.56 0 0 0 5.98 1.52h.01c6.97 0 12.63-5.66 12.63-12.63 0-3.37-1.31-6.54-3.7-8.93a12.56 12.56 0 0 0-8.94-3.77zm0 23.2h-.01a10.45 10.45 0 0 1-5.33-1.46l-.38-.23-4.05 1.06 1.08-3.95-.25-.4a10.43 10.43 0 0 1-1.6-5.59c0-5.78 4.7-10.48 10.49-10.48 2.8 0 5.43 1.09 7.41 3.07a10.42 10.42 0 0 1 3.07 7.42c0 5.79-4.7 10.56-10.43 10.56zm5.75-7.87c-.31-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.37.24-.68.08-.31-.16-1.33-.49-2.53-1.56-.94-.84-1.57-1.87-1.75-2.18-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.62 0 1.55 1.13 3.04 1.28 3.25.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.86-.76 2.12-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37z" />
          </svg>
        )}
      </button>
    </div>
  );
};
