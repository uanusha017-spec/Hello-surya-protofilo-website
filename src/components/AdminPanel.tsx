import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Briefcase,
  Check,
  Database,
  Edit3,
  Eye,
  EyeOff,
  FolderKanban,
  Inbox,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Settings,
  ShieldAlert,
  Trash2,
  User as UserIcon,
  X,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  EXPERIENCE_TYPES,
  ExperienceItem,
  ExperienceType,
  InquiryStatus,
  PAGE_HERO_CAROUSELS,
  PRESET_PROJECT_IMAGES,
  PROJECT_CATEGORY_OPTIONS,
  ProjectCategoryValue,
  ProjectItem,
  SERVICE_PHASES,
  ServiceItem,
  ServicePhase,
  SiteConfig,
  THEMED_FOUNDER_PHOTO_SRC,
} from '../data/defaults';
import {
  ADMIN_DEFAULT_USERNAME,
  FIREBASE_CONSOLE_AUTH_PROVIDERS_URL,
  resolveAdminEmail,
} from '../firebase';
import { HeroCarousel } from './HeroCarousel';

interface AdminPanelProps {
  onBackHome: () => void;
}

type AdminTab = 'projects' | 'services' | 'experience' | 'settings' | 'inquiries';

const INQUIRY_STATUSES: InquiryStatus[] = ['new', 'reviewed', 'replied', 'archived'];

const ORIGINAL_FOUNDER_PHOTO_SRC =
  '/assets/aistudio/7006CB60-0E33-4D03-96BF-0C2674620D83_bfdf2fab.png';

const EMPTY_PROJECT_FORM: Omit<ProjectItem, 'id'> = {
  index: '07',
  title: '',
  subtitle: '',
  category: 'Custom Web Apps',
  discipline: '',
  location: 'Karnataka, India',
  year: String(new Date().getFullYear()),
  liveUrl: 'https://',
  displayDomain: '',
  image: PRESET_PROJECT_IMAGES[0].url,
  imageAlt: '',
  summary: '',
  challenge: '',
  approach: '',
  deliverables: ['Responsive Web Design', 'Cloud Deployment'],
  platform: 'Vercel',
  order: 7,
};

const EMPTY_SERVICE_FORM: Omit<ServiceItem, 'id'> = {
  index: '07',
  title: '',
  tagline: '',
  phase: 'End-to-End',
  description: '',
  deliverables: ['Discovery & Architecture', 'Responsive Engineering', 'Production Launch'],
  timeline: '2–4 Weeks',
  idealFor: 'Growing businesses & startups',
  order: 7,
};

const EMPTY_EXPERIENCE_FORM: Omit<ExperienceItem, 'id'> = {
  index: '06',
  role: '',
  organization: '',
  type: 'Industry',
  duration: 'Present',
  location: 'Bengaluru, Karnataka',
  summary: '',
  current: false,
  order: 6,
};

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] || '';
  }
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackHome }) => {
  const {
    user,
    authReady,
    isAdmin,
    signInWithGoogle,
    signInWithCredentials,
    registerAdminCredentials,
    sendAdminPasswordReset,
    resendVerificationEmail,
    refreshVerificationStatus,
    signOutUser,
    projects,
    services,
    experiences,
    siteConfig,
    inquiries,
    hasDbProjects,
    hasDbServices,
    hasDbExperiences,
    hasDbSiteConfig,
    saveProject,
    deleteProject,
    saveService,
    deleteService,
    saveExperience,
    deleteExperience,
    saveSiteConfig,
    updateInquiryStatus,
    deleteInquiry,
    seedDatabaseDefaults,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // Username & Password Auth Form State
  const [authMode, setAuthMode] = useState<'signin' | 'setup'>('signin');
  const [usernameInput, setUsernameInput] = useState(ADMIN_DEFAULT_USERNAME);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [providerNotEnabled, setProviderNotEnabled] = useState(false);

  // Project Editor State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<ProjectItem, 'id'>>(EMPTY_PROJECT_FORM);
  const [projectDeliverablesText, setProjectDeliverablesText] = useState(
    EMPTY_PROJECT_FORM.deliverables.join('\n')
  );
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);

  // Service Editor State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState<Omit<ServiceItem, 'id'>>(EMPTY_SERVICE_FORM);
  const [serviceDeliverablesText, setServiceDeliverablesText] = useState(
    EMPTY_SERVICE_FORM.deliverables.join('\n')
  );
  const [confirmDeleteServiceId, setConfirmDeleteServiceId] = useState<string | null>(null);

  // Experience Editor State
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [showExpForm, setShowExpForm] = useState(false);
  const [expForm, setExpForm] = useState<Omit<ExperienceItem, 'id'>>(EMPTY_EXPERIENCE_FORM);
  const [confirmDeleteExpId, setConfirmDeleteExpId] = useState<string | null>(null);

  // Site Settings State
  const [settingsForm, setSettingsForm] = useState<SiteConfig>(siteConfig);

  // Inquiry Filter & Delete Confirm
  const [inquiryFilter, setInquiryFilter] = useState<'all' | InquiryStatus>('all');
  const [confirmDeleteInquiryId, setConfirmDeleteInquiryId] = useState<string | null>(null);

  useEffect(() => {
    setSettingsForm(siteConfig);
  }, [siteConfig]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setNotice({ type, text });
    window.setTimeout(() => {
      setNotice((curr) => (curr?.text === text ? null : curr));
    }, 6000);
  };

  const formatAuthError = (err: unknown): string => {
    const code = (err as { code?: string })?.code ?? '';
    if (code === 'auth/operation-not-allowed') {
      setProviderNotEnabled(true);
      return 'Email/Password sign-in is not yet enabled in your Firebase Console. Use the 3-step setup card below to enable it.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'Invalid username or password. If this is your first time signing in with a password, switch to the "First-Time Setup" tab above.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'This admin username already has a password configured. Switch to "Sign In" or use "Forgot Password".';
    }
    if (code === 'auth/weak-password') {
      return 'Please choose a stronger password (at least 6 characters).';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many attempts. Please wait a moment and try again.';
    }
    return err instanceof Error ? err.message : 'Unable to authenticate with those credentials.';
  };

  const handleGoogleSignIn = async () => {
    setBusy(true);
    setNotice(null);
    setProviderNotEnabled(false);
    try {
      await signInWithGoogle();
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        showToast('error', 'Google sign-in popup was closed. Please try again.');
      } else {
        showToast('error', formatAuthError(err));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleCredentialsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!usernameInput.trim() || !passwordInput) return;
    setBusy(true);
    setProviderNotEnabled(false);
    setNotice(null);
    try {
      if (authMode === 'setup') {
        await registerAdminCredentials(usernameInput, passwordInput);
        showToast(
          'success',
          `Admin password created! A one-time verification link was sent to ${resolveAdminEmail(
            usernameInput
          )}.`
        );
      } else {
        await signInWithCredentials(usernameInput, passwordInput);
      }
      setPasswordInput('');
    } catch (err) {
      showToast('error', formatAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!usernameInput.trim()) {
      showToast('error', 'Enter your admin username (e.g. hellosurya) first.');
      return;
    }
    setBusy(true);
    setProviderNotEnabled(false);
    try {
      await sendAdminPasswordReset(usernameInput);
      showToast(
        'success',
        `Password reset link sent to ${resolveAdminEmail(usernameInput)}.`
      );
    } catch (err) {
      showToast('error', formatAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleRefreshVerification = async () => {
    setBusy(true);
    try {
      const unlocked = await refreshVerificationStatus();
      if (unlocked) {
        showToast('success', 'Email verified—full Admin Console access unlocked!');
      } else {
        showToast(
          'error',
          'Email is not verified yet. Please click the verification link in your inbox, then click Refresh Access again.'
        );
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Could not refresh status.');
    } finally {
      setBusy(false);
    }
  };

  const handleResendVerification = async () => {
    setBusy(true);
    try {
      await resendVerificationEmail();
      showToast('success', `Verification link resent to ${user?.email ?? 'your email'}.`);
    } catch (err) {
      showToast('error', formatAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSeedDefaults = async () => {
    setBusy(true);
    try {
      await seedDatabaseDefaults();
      showToast(
        'success',
        'All starter projects, services, experiences, and profile details are synced to Firestore.'
      );
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to initialize database.');
    } finally {
      setBusy(false);
    }
  };

  // --- Project CRUD Handlers ---
  const openNewProjectForm = () => {
    const nextNum = projects.length + 1;
    const nextIdx = String(nextNum).padStart(2, '0');
    setEditingProjectId(null);
    setProjectForm({ ...EMPTY_PROJECT_FORM, index: nextIdx, order: nextNum });
    setProjectDeliverablesText(EMPTY_PROJECT_FORM.deliverables.join('\n'));
    setShowProjectForm(true);
  };

  const openEditProjectForm = (project: ProjectItem) => {
    setEditingProjectId(project.id);
    setProjectForm({
      index: project.index,
      title: project.title,
      subtitle: project.subtitle,
      category: project.category,
      discipline: project.discipline,
      location: project.location,
      year: project.year,
      liveUrl: project.liveUrl,
      displayDomain: project.displayDomain,
      image: project.image,
      imageAlt: project.imageAlt,
      summary: project.summary,
      challenge: project.challenge,
      approach: project.approach,
      deliverables: project.deliverables,
      platform: project.platform,
      order: project.order,
    });
    setProjectDeliverablesText(project.deliverables.join('\n'));
    setShowProjectForm(true);
  };

  const handleProjectSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectForm.title.trim() || !projectForm.liveUrl.trim()) return;
    setBusy(true);
    try {
      const deliverables = projectDeliverablesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 8);
      const computedDomain = projectForm.displayDomain.trim() || extractDomain(projectForm.liveUrl);

      await saveProject(
        {
          ...projectForm,
          displayDomain: computedDomain,
          imageAlt: projectForm.imageAlt.trim() || `${projectForm.title.trim()} website showcase`,
          deliverables: deliverables.length > 0 ? deliverables : ['Responsive Web Design'],
        },
        editingProjectId ?? undefined
      );
      setShowProjectForm(false);
      setEditingProjectId(null);
      showToast(
        'success',
        editingProjectId
          ? 'Project updated—Home page and Directory updated automatically.'
          : 'New project published—live across your Home page automatically.'
      );
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setBusy(true);
    try {
      await deleteProject(id);
      setConfirmDeleteProjectId(null);
      showToast('success', 'Project removed from database and public pages.');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete project.');
    } finally {
      setBusy(false);
    }
  };

  // --- Service CRUD Handlers ---
  const openNewServiceForm = () => {
    const nextNum = services.length + 1;
    const nextIdx = String(nextNum).padStart(2, '0');
    setEditingServiceId(null);
    setServiceForm({ ...EMPTY_SERVICE_FORM, index: nextIdx, order: nextNum });
    setServiceDeliverablesText(EMPTY_SERVICE_FORM.deliverables.join('\n'));
    setShowServiceForm(true);
  };

  const openEditServiceForm = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setServiceForm({
      index: service.index,
      title: service.title,
      tagline: service.tagline,
      phase: service.phase,
      description: service.description,
      deliverables: service.deliverables,
      timeline: service.timeline,
      idealFor: service.idealFor,
      order: service.order,
    });
    setServiceDeliverablesText(service.deliverables.join('\n'));
    setShowServiceForm(true);
  };

  const handleServiceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!serviceForm.title.trim()) return;
    setBusy(true);
    try {
      const deliverables = serviceDeliverablesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 8);
      await saveService(
        {
          ...serviceForm,
          deliverables: deliverables.length > 0 ? deliverables : ['End-to-End Implementation'],
        },
        editingServiceId ?? undefined
      );
      setShowServiceForm(false);
      setEditingServiceId(null);
      showToast(
        'success',
        editingServiceId
          ? 'Service updated—Services page updated automatically.'
          : 'New service published to your Services page automatically.'
      );
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save service.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    setBusy(true);
    try {
      await deleteService(id);
      setConfirmDeleteServiceId(null);
      showToast('success', 'Service removed from Services page.');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete service.');
    } finally {
      setBusy(false);
    }
  };

  // --- Experience CRUD Handlers ---
  const openNewExpForm = () => {
    const nextNum = experiences.length + 1;
    const nextIdx = String(nextNum).padStart(2, '0');
    setEditingExpId(null);
    setExpForm({ ...EMPTY_EXPERIENCE_FORM, index: nextIdx, order: nextNum });
    setShowExpForm(true);
  };

  const openEditExpForm = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    setExpForm({
      index: exp.index,
      role: exp.role,
      organization: exp.organization,
      type: exp.type,
      duration: exp.duration,
      location: exp.location,
      summary: exp.summary,
      current: exp.current,
      order: exp.order,
    });
    setShowExpForm(true);
  };

  const handleExpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!expForm.organization.trim() || !expForm.role.trim()) return;
    setBusy(true);
    try {
      await saveExperience(expForm, editingExpId ?? undefined);
      setShowExpForm(false);
      setEditingExpId(null);
      showToast(
        'success',
        editingExpId
          ? 'Experience updated—Home & About Us pages updated automatically.'
          : 'New experience added—live across Home & About Us automatically.'
      );
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save experience.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteExp = async (id: string) => {
    setBusy(true);
    try {
      await deleteExperience(id);
      setConfirmDeleteExpId(null);
      showToast('success', 'Experience removed from database.');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete experience.');
    } finally {
      setBusy(false);
    }
  };

  // --- Site Settings Handler ---
  const handleSettingsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await saveSiteConfig(settingsForm);
      showToast(
        'success',
        'Site profile, photo, qualifications, and contact details updated automatically across all pages.'
      );
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update site settings.');
    } finally {
      setBusy(false);
    }
  };

  const needsInitialSeed =
    !hasDbProjects || !hasDbServices || !hasDbExperiences || !hasDbSiteConfig;
  const newInquiryCount = inquiries.filter((i) => i.status === 'new').length;

  // --- Loading Auth State ---
  if (!authReady) {
    return (
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 text-center">
        <p className="text-sm text-slate-500">Checking administrator session...</p>
      </section>
    );
  }

  // --- Unauthenticated Username & Password Sign-In Gate with Full-Bleed Background Carousel ---
  if (!user) {
    return (
      <div className="bg-[#F6F8FC] min-h-[82vh]">
        <HeroCarousel
          slides={[...PAGE_HERO_CAROUSELS.admin]}
          ariaLabel="HK Surya Admin Console background carousel"
          contentClassName="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-14 lg:pt-14 lg:pb-20"
        >
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </button>

          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium text-[#F5820D]">HK Surya Admin Console</p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-white [text-wrap:balance]">
              Dynamic cloud control for your entire portfolio.
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Sign in with your administrator username and password to publish new projects,
              services, experience, mission, vision, and contact details in real time.
            </p>
          </div>
        </HeroCarousel>

        <section className="max-w-xl mx-auto px-6 py-12 lg:py-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-10 space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[#C85A00]">Administrator Sign In</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#07255A]">
                Access your live Admin Console
              </h2>
              <p className="text-sm text-slate-600">
                Sign in immediately with your verified Google account, or use your admin username
                and password below.
              </p>
            </div>

            {notice && (
              <div
                role="status"
                className={`p-3.5 rounded-lg text-sm border ${
                  notice.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                {notice.text}
              </div>
            )}

            {/* Instant 1-Click Google Admin Sign-In (Works Immediately Without Console Setup) */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={busy}
                onClick={handleGoogleSignIn}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 text-sm font-semibold text-white bg-[#C85A00] hover:bg-[#07255A] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {busy ? 'Opening Google Sign-In...' : 'Sign In Instantly with Google (Recommended)'}
                </span>
              </button>
              <p className="text-xs text-slate-500 text-center">
                Works immediately with <span className="font-mono text-[#07255A]">uanusha017@gmail.com</span> or{' '}
                <span className="font-mono text-[#07255A]">youanusha1997@gmail.com</span> — no Firebase Console setup needed.
              </p>
            </div>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-slate-200" />
              <span className="mx-3 text-xs text-slate-400 shrink-0">
                Or use Username &amp; Password
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            {/* Username & Password Mode Switcher */}
            <div
              role="tablist"
              aria-label="Username and password authentication mode"
              className="inline-flex items-center gap-1 p-1 bg-[#F6F8FC] border border-slate-200 rounded-xl"
            >
              <button
                type="button"
                role="tab"
                aria-selected={authMode === 'signin'}
                onClick={() => {
                  setAuthMode('signin');
                  setNotice(null);
                }}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-[#07255A] text-white'
                    : 'text-slate-600 hover:text-[#07255A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authMode === 'setup'}
                onClick={() => {
                  setAuthMode('setup');
                  setNotice(null);
                }}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  authMode === 'setup'
                    ? 'bg-[#07255A] text-white'
                    : 'text-slate-600 hover:text-[#07255A]'
                }`}
              >
                First-Time Setup
              </button>
            </div>

              {providerNotEnabled && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 text-xs sm:text-sm text-amber-950">
                  <p className="font-semibold">
                    Email/Password Sign-In Is Disabled in Firebase Console
                  </p>
                  <p className="text-amber-900 leading-relaxed">
                    You can enter your Admin Panel right now using the{' '}
                    <strong>Sign In Instantly with Google</strong> button above. If you also want{' '}
                    <span className="font-mono">hellosurya</span> + password login enabled:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-900">
                    <li>
                      Open{' '}
                      <a
                        href={FIREBASE_CONSOLE_AUTH_PROVIDERS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold text-[#07255A] hover:text-[#C85A00]"
                      >
                        Firebase Authentication → Sign-in method
                      </a>
                      .
                    </li>
                    <li>
                      Click <strong>Add new provider</strong> → choose{' '}
                      <strong>Email/Password</strong> → toggle <strong>Enable</strong> →{' '}
                      <strong>Save</strong>.
                    </li>
                    <li>
                      Return here and submit your username &amp; password under{' '}
                      <strong>First-Time Setup</strong>.
                    </li>
                  </ol>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-username"
                    className="block text-xs font-medium text-[#07255A]"
                  >
                    Admin Username or Email
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="admin-username"
                      type="text"
                      required
                      autoComplete="username"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="hellosurya"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm text-[#07255A] bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C] focus:ring-2 focus:ring-[#E8740C]/20"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Maps to:{' '}
                    <span className="font-mono text-[#07255A]">
                      {resolveAdminEmail(usernameInput || ADMIN_DEFAULT_USERNAME)}
                    </span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-medium text-[#07255A]"
                    >
                      Password
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={handlePasswordReset}
                        className="text-xs font-medium text-[#C85A00] hover:text-[#07255A] transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete={authMode === 'setup' ? 'new-password' : 'current-password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter your admin password"
                      className="w-full pl-10 pr-11 py-2.5 text-sm text-[#07255A] bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C] focus:ring-2 focus:ring-[#E8740C]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#07255A] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#07255A] hover:bg-[#C85A00] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                >
                  {authMode === 'signin' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{busy ? 'Signing in...' : 'Sign In to Admin Panel'}</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>{busy ? 'Creating Admin Credentials...' : 'Create Admin Password'}</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
                Secured with Firebase Authentication &amp; verified email Firestore rules. Accepted
                owner usernames: <span className="font-mono text-[#07255A]">hellosurya</span>{' '}
                (youanusha1997@gmail.com) or{' '}
                <span className="font-mono text-[#07255A]">anusha</span> (uanusha017@gmail.com).
              </p>
          </div>
        </section>
      </div>
    );
  }

  // --- Signed In But Email Not Yet Verified ---
  if (!user.emailVerified) {
    return (
      <section className="bg-[#F6F8FC] min-h-[75vh] py-16 lg:py-24">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-6">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#C85A00] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#C85A00]">One-Time Security Check</p>
              <h1 className="font-display text-2xl font-semibold text-[#07255A]">
                Verify your admin email to unlock writes
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                You are signed in as{' '}
                <span className="font-mono text-[#07255A]">{user.email}</span>. Please open the
                verification link sent to your inbox, then click{' '}
                <strong>I&apos;ve Verified — Refresh Access</strong> below.
              </p>
            </div>

            {notice && (
              <div
                role="status"
                className={`p-3.5 rounded-lg text-sm border ${
                  notice.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                {notice.text}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={handleRefreshVerification}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{busy ? 'Checking...' : "I've Verified — Refresh Access"}</span>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={handleResendVerification}
                className="px-4 py-2.5 text-sm font-medium text-[#07255A] border border-slate-300 hover:border-[#07255A] rounded-lg transition-colors cursor-pointer"
              >
                Resend Email
              </button>

              <button
                type="button"
                onClick={signOutUser}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-[#07255A] cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- Signed In & Verified, But Not Authorized Admin ---
  if (!isAdmin) {
    return (
      <section className="bg-[#F6F8FC] min-h-[75vh] py-16 lg:py-24">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-6">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#C85A00] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-semibold text-[#07255A]">
                Administrator access required
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                You are signed in as{' '}
                <span className="font-mono text-[#07255A]">{user.email}</span>, which is not listed
                as an authorized admin for this portfolio. Please sign in with the owner username (
                <span className="font-mono text-[#07255A]">hellosurya</span>).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={signOutUser}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out &amp; Switch Account</span>
              </button>
              <button
                type="button"
                onClick={onBackHome}
                className="px-4 py-2.5 text-sm font-medium text-[#07255A] border border-slate-200 rounded-lg hover:border-[#07255A] transition-colors cursor-pointer"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- Authenticated Admin Dashboard ---
  return (
    <div className="bg-[#F6F8FC] min-h-[82vh]">
      {/* Full-Bleed Admin Background Carousel Header */}
      <HeroCarousel
        slides={[...PAGE_HERO_CAROUSELS.admin]}
        ariaLabel="Admin dashboard workspace background carousel"
        contentClassName="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-12 lg:pt-12 lg:pb-14"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-white mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </button>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
              Dynamic Portfolio Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Signed in as <span className="font-mono text-[#F5820D]">{user.email}</span>
              <span aria-hidden="true" className="mx-2 text-white/40">
                ·
              </span>
              Changes publish automatically across all pages in real time
            </p>
          </div>

          <button
            type="button"
            onClick={signOutUser}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-[#F5820D] border border-white/25 rounded-lg transition-colors self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </HeroCarousel>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-12 space-y-8">

        {/* Manual Sync Fallback if any collection is still pending */}
        {needsInitialSeed && (
          <div className="rounded-xl bg-[#07255A] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-display text-base font-semibold">
                Syncing starter records to Firestore database
              </p>
              <p className="text-xs sm:text-sm text-slate-200">
                Your starter projects, services, experiences, and profile details sync automatically
                on sign-in—or click Sync Now to refresh any empty collections.
              </p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={handleSeedDefaults}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#07255A] bg-white hover:bg-[#F5820D] hover:text-white disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>{busy ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        )}

        {/* Inline Action Toast */}
        {notice && (
          <div
            role="status"
            className={`p-4 rounded-xl text-sm border flex items-center justify-between gap-4 ${
              notice.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <span>{notice.text}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-current opacity-70 hover:opacity-100 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4 Interactive Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`text-left bg-white rounded-xl border p-5 transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'border-[#07255A]'
                : 'border-slate-200 hover:border-[#07255A]/40'
            }`}
          >
            <p className="text-xs text-slate-500">Portfolio Projects</p>
            <p className="font-mono text-2xl font-semibold text-[#07255A] tabular-nums mt-1">
              {projects.length}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Live on Home &amp; Work</p>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`text-left bg-white rounded-xl border p-5 transition-colors cursor-pointer ${
              activeTab === 'services'
                ? 'border-[#07255A]'
                : 'border-slate-200 hover:border-[#07255A]/40'
            }`}
          >
            <p className="text-xs text-slate-500">End-to-End Services</p>
            <p className="font-mono text-2xl font-semibold text-[#07255A] tabular-nums mt-1">
              {services.length}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Live on Services Page</p>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`text-left bg-white rounded-xl border p-5 transition-colors cursor-pointer ${
              activeTab === 'experience'
                ? 'border-[#07255A]'
                : 'border-slate-200 hover:border-[#07255A]/40'
            }`}
          >
            <p className="text-xs text-slate-500">Experience Entries</p>
            <p className="font-mono text-2xl font-semibold text-[#07255A] tabular-nums mt-1">
              {experiences.length}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Live on Home &amp; About Us</p>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`text-left bg-white rounded-xl border p-5 transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-[#C85A00]'
                : 'border-slate-200 hover:border-[#C85A00]/60'
            }`}
          >
            <p className="text-xs text-slate-500">Contact Form Inquiries</p>
            <p className="font-mono text-2xl font-semibold text-[#07255A] tabular-nums mt-1">
              {inquiries.length}
            </p>
            <p className="text-xs text-[#C85A00] font-medium mt-0.5 tabular-nums">
              {newInquiryCount} new unread · Open Inbox →
            </p>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Admin sections"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl"
        >
          {(
            [
              { id: 'projects', label: 'Projects', icon: FolderKanban },
              { id: 'services', label: 'Services', icon: Briefcase },
              { id: 'experience', label: 'Experience', icon: Award },
              { id: 'settings', label: 'Site, About & Contact', icon: Settings },
              { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Inbox },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'bg-[#07255A] text-white' : 'text-slate-600 hover:text-[#07255A]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#07255A]">
                  Manage Portfolio Projects
                </h2>
                <p className="text-sm text-slate-500">
                  Updates reflect immediately on the Home page Selected Works, Directory, and Footer.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewProjectForm}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {showProjectForm && (
              <form
                onSubmit={handleProjectSubmit}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <h3 className="font-display text-lg font-semibold text-[#07255A]">
                    {editingProjectId ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowProjectForm(false)}
                    className="p-1.5 text-slate-500 hover:text-[#07255A] cursor-pointer"
                    aria-label="Close form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Project Title *</label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Touchstone Atelier"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Subtitle / Tagline *</label>
                    <input
                      type="text"
                      required
                      maxLength={180}
                      value={projectForm.subtitle}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      placeholder="Luxury Interior Architecture Studio"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Category *</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          category: e.target.value as ProjectCategoryValue,
                        })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#E8740C]"
                    >
                      {PROJECT_CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">External Live URL *</label>
                    <input
                      type="url"
                      required
                      maxLength={400}
                      value={projectForm.liveUrl}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          liveUrl: e.target.value,
                          displayDomain: extractDomain(e.target.value),
                        })
                      }
                      placeholder="https://your-project.vercel.app/"
                      className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Discipline *</label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={projectForm.discipline}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, discipline: e.target.value })
                      }
                      placeholder="Full-Stack Web App"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Location *</label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                      placeholder="Hubballi, Karnataka"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Year</label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      value={projectForm.year}
                      onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Hosting Platform</label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={projectForm.platform}
                      onChange={(e) => setProjectForm({ ...projectForm, platform: e.target.value })}
                      placeholder="Vercel / Netlify / Cloudflare"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-[#07255A]">Index</label>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        value={projectForm.index}
                        onChange={(e) => setProjectForm({ ...projectForm, index: e.target.value })}
                        placeholder="07"
                        className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-[#07255A]">Sort Order</label>
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={projectForm.order}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, order: Number(e.target.value) || 1 })
                        }
                        className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Cover Image URL or Preset *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={500}
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Quick Studio Cover Presets
                    </label>
                    <select
                      value={
                        PRESET_PROJECT_IMAGES.some((p) => p.url === projectForm.image)
                          ? projectForm.image
                          : ''
                      }
                      onChange={(e) => {
                        if (e.target.value) {
                          setProjectForm({ ...projectForm, image: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#E8740C]"
                    >
                      <option value="">Select a studio cover image...</option>
                      {PRESET_PROJECT_IMAGES.map((preset) => (
                        <option key={preset.url} value={preset.url}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#07255A]">
                    Short Card Summary *
                  </label>
                  <textarea
                    rows={2}
                    required
                    minLength={10}
                    maxLength={600}
                    value={projectForm.summary}
                    onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Case Study: The Challenge *
                    </label>
                    <textarea
                      rows={3}
                      required
                      minLength={5}
                      maxLength={1200}
                      value={projectForm.challenge}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, challenge: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Case Study: Design &amp; Engineering Approach *
                    </label>
                    <textarea
                      rows={3}
                      required
                      minLength={5}
                      maxLength={1200}
                      value={projectForm.approach}
                      onChange={(e) => setProjectForm({ ...projectForm, approach: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#07255A]">
                    Key Deliverables (one per line, up to 8)
                  </label>
                  <textarea
                    rows={3}
                    value={projectDeliverablesText}
                    onChange={(e) => setProjectDeliverablesText(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowProjectForm(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#07255A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{busy ? 'Saving...' : 'Save Project'}</span>
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono text-[#C85A00] font-medium tabular-nums">
                        {project.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.platform}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#07255A]">
                      {project.title}
                    </h3>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-[#C85A00] hover:underline break-all"
                    >
                      <span>{project.liveUrl}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditProjectForm(project)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#07255A] bg-[#F6F8FC] hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {confirmDeleteProjectId === project.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteProjectId(null)}
                          className="px-2.5 py-2 text-xs text-slate-600 hover:text-[#07255A] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteProjectId(project.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES MANAGER */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#07255A]">
                  Manage End-to-End Services
                </h2>
                <p className="text-sm text-slate-500">
                  Every update appears automatically on the Services page and Contact scope dropdown.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewServiceForm}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            {showServiceForm && (
              <form
                onSubmit={handleServiceSubmit}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <h3 className="font-display text-lg font-semibold text-[#07255A]">
                    {editingServiceId ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowServiceForm(false)}
                    className="p-1.5 text-slate-500 hover:text-[#07255A] cursor-pointer"
                    aria-label="Close service form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Service Title *</label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Tagline *</label>
                    <input
                      type="text"
                      required
                      maxLength={180}
                      value={serviceForm.tagline}
                      onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Lifecycle Phase *</label>
                    <select
                      value={serviceForm.phase}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, phase: e.target.value as ServicePhase })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#E8740C]"
                    >
                      {SERVICE_PHASES.map((phase) => (
                        <option key={phase} value={phase}>
                          {phase}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Typical Timeline</label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={serviceForm.timeline}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, timeline: e.target.value })
                      }
                      placeholder="2–4 Weeks"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Ideal Client Fit</label>
                    <input
                      type="text"
                      required
                      maxLength={160}
                      value={serviceForm.idealFor}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, idealFor: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-[#07255A]">Index</label>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        value={serviceForm.index}
                        onChange={(e) => setServiceForm({ ...serviceForm, index: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-[#07255A]">Order</label>
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={serviceForm.order}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, order: Number(e.target.value) || 1 })
                        }
                        className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#07255A]">Description *</label>
                  <textarea
                    rows={3}
                    required
                    minLength={10}
                    maxLength={900}
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#07255A]">
                    Included Deliverables (one per line, up to 8)
                  </label>
                  <textarea
                    rows={4}
                    value={serviceDeliverablesText}
                    onChange={(e) => setServiceDeliverablesText(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowServiceForm(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#07255A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{busy ? 'Saving...' : 'Save Service'}</span>
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono text-[#C85A00] font-medium tabular-nums">
                        {service.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{service.phase}</span>
                      <span aria-hidden="true">·</span>
                      <span>{service.timeline}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#07255A]">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600">{service.tagline}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditServiceForm(service)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#07255A] bg-[#F6F8FC] hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {confirmDeleteServiceId === service.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDeleteService(service.id)}
                          className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteServiceId(null)}
                          className="px-2.5 py-2 text-xs text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteServiceId(service.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TEACHING & INDUSTRY EXPERIENCE MANAGER */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#07255A]">
                  Manage Industry &amp; Teaching Experience
                </h2>
                <p className="text-sm text-slate-500">
                  Updates automatically across your Home page overview and About Us career timeline.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewExpForm}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>

            {showExpForm && (
              <form
                onSubmit={handleExpSubmit}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <h3 className="font-display text-lg font-semibold text-[#07255A]">
                    {editingExpId ? 'Edit Experience' : 'Add New Experience'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowExpForm(false)}
                    className="p-1.5 text-slate-500 hover:text-[#07255A] cursor-pointer"
                    aria-label="Close experience form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Company / College / School *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={expForm.organization}
                      onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                      placeholder="e.g. Natton.ai, IBMR College"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Role / Title *</label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      placeholder="Software Developer / Lecturer"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Track *</label>
                    <select
                      value={expForm.type}
                      onChange={(e) =>
                        setExpForm({ ...expForm, type: e.target.value as ExperienceType })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#E8740C]"
                    >
                      {EXPERIENCE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Duration *</label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={expForm.duration}
                      onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                      placeholder="Present / 1 Year / 6 Months"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">Location / Context *</label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      placeholder="IT Industry / College Faculty"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-[#07255A]">Index</label>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        value={expForm.index}
                        onChange={(e) => setExpForm({ ...expForm, index: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-[#07255A]">Order</label>
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={expForm.order}
                        onChange={(e) =>
                          setExpForm({ ...expForm, order: Number(e.target.value) || 1 })
                        }
                        className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#07255A]">Summary *</label>
                  <textarea
                    rows={3}
                    required
                    minLength={10}
                    maxLength={700}
                    value={expForm.summary}
                    onChange={(e) => setExpForm({ ...expForm, summary: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                  />
                </div>

                <label className="inline-flex items-center gap-2.5 text-sm text-[#07255A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expForm.current}
                    onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })}
                    className="w-4 h-4 accent-[#07255A]"
                  />
                  <span>Mark as current / ongoing position</span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowExpForm(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#07255A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{busy ? 'Saving...' : 'Save Experience'}</span>
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono text-[#C85A00] font-medium tabular-nums">
                        {exp.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{exp.type}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[#07255A] font-medium">{exp.duration}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#07255A]">
                      {exp.organization} — {exp.role}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{exp.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditExpForm(exp)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#07255A] bg-[#F6F8FC] hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {confirmDeleteExpId === exp.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDeleteExp(exp.id)}
                          className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteExpId(null)}
                          className="px-2.5 py-2 text-xs text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteExpId(exp.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SITE PROFILE, PHOTO, CONTACT & QUALIFICATIONS */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSettingsSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8"
          >
            <div className="pb-4 border-b border-slate-200">
              <h2 className="font-display text-xl font-semibold text-[#07255A]">
                Site Profile, Portrait, Contact Us &amp; Qualifications
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Changes saved here automatically update Home, About Us, Services, Contact Us, and
                Footer in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">Studio Name</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={settingsForm.studioName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, studioName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">Brand Tagline</label>
                <input
                  type="text"
                  required
                  maxLength={140}
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">Location</label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={settingsForm.location}
                  onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">Contact Mail ID</label>
                <input
                  type="email"
                  required
                  maxLength={120}
                  value={settingsForm.businessEmail}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, businessEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={settingsForm.businessPhone}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, businessPhone: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">
                  Founder Portrait Photo
                </label>
                <select
                  value={
                    settingsForm.founderPhoto === ORIGINAL_FOUNDER_PHOTO_SRC
                      ? ORIGINAL_FOUNDER_PHOTO_SRC
                      : THEMED_FOUNDER_PHOTO_SRC
                  }
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, founderPhoto: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#E8740C]"
                >
                  <option value={THEMED_FOUNDER_PHOTO_SRC}>
                    Theme-Matched Navy &amp; Amber Backdrop (Recommended)
                  </option>
                  <option value={ORIGINAL_FOUNDER_PHOTO_SRC}>Original Uploaded Photo</option>
                </select>
              </div>
            </div>

            <div className="space-y-5 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">Hero Headline</label>
                <input
                  type="text"
                  required
                  maxLength={180}
                  value={settingsForm.heroHeadline}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">Hero Lead Copy</label>
                <textarea
                  rows={2}
                  required
                  maxLength={500}
                  value={settingsForm.heroLead}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroLead: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">
                  About Section Headline
                </label>
                <input
                  type="text"
                  required
                  maxLength={180}
                  value={settingsForm.aboutHeadline}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, aboutHeadline: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#07255A]">
                    Home Page About Summary
                  </label>
                  <textarea
                    rows={4}
                    required
                    maxLength={800}
                    value={settingsForm.aboutSummary}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, aboutSummary: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#07255A]">
                    About Us Page Extended Story
                  </label>
                  <textarea
                    rows={4}
                    required
                    maxLength={1500}
                    value={settingsForm.aboutExtended}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, aboutExtended: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                  />
                </div>
              </div>

              {/* Dynamic Mission & Vision Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Our Mission Headline
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={160}
                      value={settingsForm.missionTitle}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, missionTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Our Mission Statement
                    </label>
                    <textarea
                      rows={4}
                      required
                      maxLength={900}
                      value={settingsForm.missionStatement}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, missionStatement: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Our Vision Headline
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={160}
                      value={settingsForm.visionTitle}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, visionTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#07255A]">
                      Our Vision Statement
                    </label>
                    <textarea
                      rows={4}
                      required
                      maxLength={900}
                      value={settingsForm.visionStatement}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, visionStatement: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">MCA Qualification</label>
                <input
                  type="text"
                  required
                  maxLength={160}
                  value={settingsForm.mcaDegree}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mcaDegree: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">MCA University</label>
                <input
                  type="text"
                  required
                  maxLength={140}
                  value={settingsForm.mcaInstitution}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, mcaInstitution: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">BCA Qualification</label>
                <input
                  type="text"
                  required
                  maxLength={160}
                  value={settingsForm.bcaDegree}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bcaDegree: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#07255A]">BCA College</label>
                <input
                  type="text"
                  required
                  maxLength={140}
                  value={settingsForm.bcaInstitution}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, bcaInstitution: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E8740C]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#07255A] hover:bg-[#C85A00] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{busy ? 'Saving Changes...' : 'Save Site Configuration'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: INQUIRIES INBOX */}
        {activeTab === 'inquiries' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#07255A]">
                  Contact Form Inquiries Inbox
                </h2>
                <p className="text-sm text-slate-500">
                  Every message submitted on the Contact Us page is stored here in real time.
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Filter inquiries by status"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl self-start sm:self-auto"
              >
                {(['all', ...INQUIRY_STATUSES] as const).map((statusKey) => {
                  const isActive = inquiryFilter === statusKey;
                  const count =
                    statusKey === 'all'
                      ? inquiries.length
                      : inquiries.filter((i) => i.status === statusKey).length;
                  return (
                    <button
                      key={statusKey}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setInquiryFilter(statusKey)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#07255A] text-white'
                          : 'text-slate-600 hover:text-[#07255A]'
                      }`}
                    >
                      {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {inquiries.filter((i) => inquiryFilter === 'all' || i.status === inquiryFilter)
              .length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-2">
                <p className="font-display text-lg font-semibold text-[#07255A]">
                  {inquiries.length === 0
                    ? 'No contact form inquiries yet'
                    : `No ${inquiryFilter} inquiries`}
                </p>
                <p className="text-sm text-slate-500">
                  When visitors submit the Contact Us form, their name, email, phone, project scope,
                  and message are saved directly here automatically.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
                {inquiries
                  .filter((i) => inquiryFilter === 'all' || i.status === inquiryFilter)
                  .map((inq) => {
                    const phoneDigits = inq.phone.replace(/\D/g, '');
                    const waReplyDigits =
                      phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
                    return (
                      <div key={inq.id} className="p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span className="font-semibold text-[#07255A] text-base font-display">
                                {inq.name}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#C85A00] font-medium">{inq.projectType}</span>
                              {inq.createdAt && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono tabular-nums">
                                    {inq.createdAt.toLocaleDateString()} ·{' '}
                                    {inq.createdAt.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                              <a
                                href={`mailto:${inq.email}?subject=${encodeURIComponent(
                                  `Re: ${inq.projectType} — ${siteConfig.studioName}`
                                )}`}
                                className="inline-flex items-center gap-1.5 hover:text-[#C85A00]"
                              >
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <span>{inq.email}</span>
                              </a>
                              {inq.phone && (
                                <a
                                  href={`tel:${inq.phone}`}
                                  className="inline-flex items-center gap-1.5 font-mono tabular-nums hover:text-[#C85A00]"
                                >
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{inq.phone}</span>
                                </a>
                              )}
                              {waReplyDigits.length >= 10 && (
                                <a
                                  href={`https://wa.me/${waReplyDigits}?text=${encodeURIComponent(
                                    `Hi ${inq.name}, thank you for contacting ${siteConfig.studioName} regarding ${inq.projectType}.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 font-semibold text-[#168C44] hover:underline"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Reply on WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <label htmlFor={`status-${inq.id}`} className="sr-only">
                              Inquiry status
                            </label>
                            <select
                              id={`status-${inq.id}`}
                              value={inq.status}
                              onChange={async (e) => {
                                try {
                                  await updateInquiryStatus(
                                    inq.id,
                                    e.target.value as InquiryStatus
                                  );
                                  showToast('success', 'Inquiry status updated.');
                                } catch (err) {
                                  showToast(
                                    'error',
                                    err instanceof Error ? err.message : 'Status update failed.'
                                  );
                                }
                              }}
                              className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-[#07255A] focus:outline-none focus:border-[#E8740C]"
                            >
                              {INQUIRY_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  Status: {st.charAt(0).toUpperCase() + st.slice(1)}
                                </option>
                              ))}
                            </select>

                            {confirmDeleteInquiryId === inq.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await deleteInquiry(inq.id);
                                    setConfirmDeleteInquiryId(null);
                                    showToast('success', 'Inquiry deleted.');
                                  }}
                                  className="px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteInquiryId(null)}
                                  className="px-2 py-1.5 text-xs text-slate-500 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteInquiryId(inq.id)}
                                className="p-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                aria-label={`Delete inquiry from ${inq.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-[#F6F8FC] p-4 rounded-xl border border-slate-100">
                          {inq.message}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
