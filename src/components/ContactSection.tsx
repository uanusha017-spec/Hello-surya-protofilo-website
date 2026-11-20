import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail, Phone, Send } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PAGE_FEATURE_IMAGES } from '../data/defaults';
import { SmartImage } from './SmartImage';

interface ContactSectionProps {
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  initialProjectType?: string;
  standalonePage?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  nameInputRef,
  initialProjectType,
  standalonePage = false,
}) => {
  const { siteConfig, services, submitInquiry } = usePortfolio();

  const scopeOptions = useMemo(() => {
    const titles = services.map((s) => s.title);
    const extras = ['Website Redesign', 'General Consultation'];
    return Array.from(new Set([...titles, ...extras]));
  }, [services]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState(
    initialProjectType || scopeOptions[0] || 'End-to-End Web Applications'
  );
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  useEffect(() => {
    if (initialProjectType) {
      setProjectType(initialProjectType);
    }
  }, [initialProjectType]);

  const handleCopy = async (value: string, field: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2500);
    } catch {
      setCopiedField(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2) {
      setSubmitError('Please enter your name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (cleanMessage.length < 5) {
      setSubmitError('Please share a brief message (at least 5 characters) about your project.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitInquiry({
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim(),
        projectType: projectType || 'General Consultation',
        message: cleanMessage,
      });
      setSubmitted(true);
    } catch {
      setSubmitError(
        'Could not save your inquiry right now. Please try again or reach out directly via WhatsApp, email, or phone.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setProjectType(scopeOptions[0] || 'End-to-End Web Applications');
    setMessage('');
    setSubmitted(false);
    setSubmitError(null);
  };

  const cleanPhoneHref = `+91${siteConfig.businessPhone.replace(/\D/g, '')}`;

  return (
    <section id="contact" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Contact Details & Consultation Feature Image */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#C85A00]">
                {standalonePage ? '01. Direct Contact & Project Brief' : '05. Contact Us'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#07255A] [text-wrap:balance]">
                Have a website, end-to-end app, or online class in mind?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Reach out directly by email or phone, or send your brief using the form. Whether you
                need a custom business platform, a dynamic portfolio, or guided online computer
                science classes, every inquiry is answered directly within 24 hours.
              </p>
            </div>

            {!standalonePage && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] bg-[#F6F8FC]">
                <SmartImage
                  src={PAGE_FEATURE_IMAGES.contact}
                  alt="Client consultation workspace at HK Surya Digital Solutions with project brief notebook"
                  title="Contact HK Surya Digital Solutions"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 space-y-5">
              {/* Mail ID */}
              <div className="space-y-1">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-[#C85A00]" />
                  <span>Mail ID</span>
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${siteConfig.businessEmail}`}
                    className="font-display text-lg font-semibold text-[#07255A] hover:text-[#C85A00] transition-colors break-all"
                  >
                    {siteConfig.businessEmail}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(siteConfig.businessEmail, 'email')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#07255A] hover:text-[#C85A00] bg-[#F6F8FC] border border-slate-200 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C]"
                  >
                    {copiedField === 'email' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C85A00]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-[#C85A00]" />
                  <span>Phone Number</span>
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${cleanPhoneHref}`}
                    className="font-mono text-lg font-semibold text-[#07255A] hover:text-[#C85A00] transition-colors tabular-nums"
                  >
                    {siteConfig.businessPhone}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(siteConfig.businessPhone, 'phone')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#07255A] hover:text-[#C85A00] bg-[#F6F8FC] border border-slate-200 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C]"
                  >
                    {copiedField === 'phone' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C85A00]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-500 pt-1">
                <span>{siteConfig.location}</span>
                <span aria-hidden="true" className="mx-2">
                  ·
                </span>
                <span>Mon–Sat, 9:30 AM – 7:00 PM IST</span>
              </div>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-3 text-xs">
                <div className="space-y-0.5">
                  <p className="font-mono text-[#C85A00] font-medium">01.</p>
                  <p className="font-medium text-[#07255A]">Discovery Call</p>
                  <p className="text-slate-500">Goals &amp; scope</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-mono text-[#C85A00] font-medium">02.</p>
                  <p className="font-medium text-[#07255A]">Clear Roadmap</p>
                  <p className="text-slate-500">Timeline &amp; plan</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-mono text-[#C85A00] font-medium">03.</p>
                  <p className="font-medium text-[#07255A]">Live Launch</p>
                  <p className="text-slate-500">Handover &amp; care</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Firestore Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#F6F8FC] rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10">
              {submitted ? (
                <div className="py-6 space-y-5">
                  <div className="w-11 h-11 rounded-xl bg-[#F5820D]/15 text-[#C85A00] flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold text-[#07255A]">
                      Inquiry received by {siteConfig.studioName}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                      Thank you, <span className="font-medium text-[#07255A]">{name}</span>. Your{' '}
                      <span className="font-medium text-[#07255A]">{projectType}</span> inquiry has
                      been saved cleanly. I will get back to you within 24 hours.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href={`mailto:${siteConfig.businessEmail}?subject=${encodeURIComponent(
                        `Project Inquiry: ${projectType} — ${name}`
                      )}&body=${encodeURIComponent(
                        `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nProject Scope: ${projectType}\n\n${message}`
                      )}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#C85A00] hover:bg-[#07255A] rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Also Send via Email</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2.5 text-sm font-medium text-[#07255A] bg-white border border-slate-200 hover:border-[#07255A] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="block text-sm font-medium text-[#07255A]">
                        Your Name *
                      </label>
                      <input
                        ref={nameInputRef}
                        id="contact-name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aarav Kulkarni"
                        className="w-full px-3.5 py-2.5 text-sm text-[#07255A] bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-[#E8740C] focus:ring-2 focus:ring-[#E8740C]/20 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="block text-sm font-medium text-[#07255A]">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        maxLength={120}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2.5 text-sm text-[#07255A] bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-[#E8740C] focus:ring-2 focus:ring-[#E8740C]/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-[#07255A]">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        maxLength={30}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-sm text-[#07255A] bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-[#E8740C] focus:ring-2 focus:ring-[#E8740C]/20 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-type" className="block text-sm font-medium text-[#07255A]">
                        Service / Project Scope
                      </label>
                      <select
                        id="contact-type"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm text-[#07255A] bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C] focus:ring-2 focus:ring-[#E8740C]/20 transition-colors"
                      >
                        {scopeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="block text-sm font-medium text-[#07255A]">
                      Project Details *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      minLength={5}
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me about what you are building, your timeline, and any references you admire..."
                      className="w-full px-3.5 py-2.5 text-sm text-[#07255A] bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-[#E8740C] focus:ring-2 focus:ring-[#E8740C]/20 transition-colors resize-y"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <p className="text-xs text-slate-500">Typical response time within 24 hours.</p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] disabled:opacity-60 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8740C] focus-visible:ring-offset-2"
                    >
                      <span>{submitting ? 'Submitting...' : 'Send Inquiry'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
