import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  DEFAULT_EXPERIENCES,
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  DEFAULT_SITE_CONFIG,
  ExperienceItem,
  InquiryItem,
  InquiryStatus,
  ProjectItem,
  ServiceItem,
  SiteConfig,
  THEMED_FOUNDER_PHOTO_SRC,
} from '../data/defaults';
import {
  BOOTSTRAPPED_ADMIN_EMAILS,
  OperationType,
  auth,
  db,
  handleFirestoreError,
  resolveAdminEmail,
} from '../firebase';

interface PortfolioContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithCredentials: (usernameOrEmail: string, password: string) => Promise<void>;
  registerAdminCredentials: (usernameOrEmail: string, password: string) => Promise<void>;
  sendAdminPasswordReset: (usernameOrEmail: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshVerificationStatus: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
  projects: ProjectItem[];
  services: ServiceItem[];
  experiences: ExperienceItem[];
  siteConfig: SiteConfig;
  inquiries: InquiryItem[];
  hasDbProjects: boolean;
  hasDbServices: boolean;
  hasDbExperiences: boolean;
  hasDbSiteConfig: boolean;
  loadingData: boolean;
  saveProject: (project: Omit<ProjectItem, 'id'>, existingId?: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveService: (service: Omit<ServiceItem, 'id'>, existingId?: string) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveExperience: (exp: Omit<ExperienceItem, 'id'>, existingId?: string) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  saveSiteConfig: (config: SiteConfig) => Promise<void>;
  submitInquiry: (input: {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    message: string;
  }) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  seedDatabaseDefaults: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function sanitizeId(raw: string, fallbackPrefix: string): string {
  const cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return cleaned.length >= 2 ? cleaned : `${fallbackPrefix}-${Date.now()}`;
}

function clampString(val: string, maxLen: number): string {
  return val.trim().slice(0, maxLen);
}

function sanitizeStringList(items: string[], maxItems = 8): string[] {
  const cleaned = items
    .map((item) => item.trim().slice(0, 160))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
  return cleaned.length > 0 ? cleaned : ['Custom Digital Delivery'];
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenVersion, setTokenVersion] = useState(0);

  const [dbProjects, setDbProjects] = useState<ProjectItem[]>([]);
  const [dbServices, setDbServices] = useState<ServiceItem[]>([]);
  const [dbExperiences, setDbExperiences] = useState<ExperienceItem[]>([]);
  const [dbSiteConfig, setDbSiteConfig] = useState<SiteConfig | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [experiencesLoaded, setExperiencesLoaded] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  const autoSeededRef = useRef(false);
  const inquiryRetryRef = useRef(0);

  // Verify both Auth user state AND fresh JWT ID token claims before granting Admin access
  // so Firestore never receives a stale unverified JWT right after email verification.
  const verifyAdminWithFreshToken = async (
    targetUser: User | null,
    forceRefresh = false
  ): Promise<boolean> => {
    if (!targetUser) {
      setIsAdmin(false);
      return false;
    }

    let tokenResult = await targetUser.getIdTokenResult(forceRefresh);
    let claimVerified = Boolean(tokenResult.claims.email_verified);

    // If user verified their email in another tab or recently, force a fresh JWT so Firestore sees email_verified == true
    if (!claimVerified) {
      try {
        await targetUser.reload();
        if (targetUser.emailVerified) {
          tokenResult = await targetUser.getIdTokenResult(true);
          claimVerified = Boolean(tokenResult.claims.email_verified);
        }
      } catch {
        // Ignore transient reload error and fall through with current claim state
      }
    } else if (forceRefresh) {
      // Allow Firestore's internal onIdTokenChanged observer a brief tick to attach the refreshed JWT
      await new Promise((resolve) => window.setTimeout(resolve, 180));
    }

    if (!claimVerified) {
      setIsAdmin(false);
      return false;
    }

    const emailLower = String(tokenResult.claims.email || targetUser.email || '').toLowerCase();
    if (BOOTSTRAPPED_ADMIN_EMAILS.includes(emailLower)) {
      setIsAdmin(true);
      return true;
    }

    try {
      const adminDoc = await getDoc(doc(db, 'admins', targetUser.uid));
      const allowed = adminDoc.exists();
      setIsAdmin(allowed);
      return allowed;
    } catch {
      setIsAdmin(false);
      return false;
    }
  };

  // Track Firebase Auth & ID Token Changes so Firestore rules always see up-to-date claims
  useEffect(() => {
    let active = true;
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (!active) return;
      setUser(currentUser);
      if (!currentUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      try {
        await verifyAdminWithFreshToken(currentUser, false);
      } finally {
        if (active) {
          setAuthReady(true);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Subscribe to Public Projects Collection
  useEffect(() => {
    const path = 'projects';
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: ProjectItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            index: String(data.index ?? '01'),
            title: String(data.title ?? ''),
            subtitle: String(data.subtitle ?? ''),
            category: data.category ?? 'Custom Web Apps',
            discipline: String(data.discipline ?? ''),
            location: String(data.location ?? ''),
            year: String(data.year ?? '2026'),
            liveUrl: String(data.liveUrl ?? ''),
            displayDomain: String(data.displayDomain ?? ''),
            image: String(data.image ?? ''),
            imageAlt: String(data.imageAlt ?? ''),
            summary: String(data.summary ?? ''),
            challenge: String(data.challenge ?? ''),
            approach: String(data.approach ?? ''),
            deliverables: Array.isArray(data.deliverables) ? data.deliverables.map(String) : [],
            platform: String(data.platform ?? 'Cloud'),
            order: typeof data.order === 'number' ? data.order : 1,
          };
        });
        setDbProjects(items);
        setProjectsLoaded(true);
      },
      (error) => {
        setProjectsLoaded(true);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to Public Services Collection
  useEffect(() => {
    const path = 'services';
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: ServiceItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            index: String(data.index ?? '01'),
            title: String(data.title ?? ''),
            tagline: String(data.tagline ?? ''),
            phase: data.phase ?? 'End-to-End',
            description: String(data.description ?? ''),
            deliverables: Array.isArray(data.deliverables) ? data.deliverables.map(String) : [],
            timeline: String(data.timeline ?? ''),
            idealFor: String(data.idealFor ?? ''),
            order: typeof data.order === 'number' ? data.order : 1,
          };
        });
        setDbServices(items);
        setServicesLoaded(true);
      },
      (error) => {
        setServicesLoaded(true);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to Public Experiences Collection
  useEffect(() => {
    const path = 'experiences';
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: ExperienceItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            index: String(data.index ?? '01'),
            role: String(data.role ?? ''),
            organization: String(data.organization ?? ''),
            type: data.type ?? 'Industry',
            duration: String(data.duration ?? ''),
            location: String(data.location ?? ''),
            summary: String(data.summary ?? ''),
            current: Boolean(data.current),
            order: typeof data.order === 'number' ? data.order : 1,
          };
        });
        setDbExperiences(items);
        setExperiencesLoaded(true);
      },
      (error) => {
        setExperiencesLoaded(true);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to Public Site Config Document
  useEffect(() => {
    const path = 'siteConfig/main';
    const unsubscribe = onSnapshot(
      doc(db, 'siteConfig', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDbSiteConfig({
            studioName: String(data.studioName ?? DEFAULT_SITE_CONFIG.studioName),
            tagline: String(data.tagline ?? DEFAULT_SITE_CONFIG.tagline),
            businessEmail: String(data.businessEmail ?? DEFAULT_SITE_CONFIG.businessEmail),
            businessPhone: String(data.businessPhone ?? DEFAULT_SITE_CONFIG.businessPhone),
            location: String(data.location ?? DEFAULT_SITE_CONFIG.location),
            heroHeadline: String(data.heroHeadline ?? DEFAULT_SITE_CONFIG.heroHeadline),
            heroLead: String(data.heroLead ?? DEFAULT_SITE_CONFIG.heroLead),
            aboutHeadline: String(data.aboutHeadline ?? DEFAULT_SITE_CONFIG.aboutHeadline),
            aboutSummary: String(data.aboutSummary ?? DEFAULT_SITE_CONFIG.aboutSummary),
            aboutExtended: String(data.aboutExtended ?? DEFAULT_SITE_CONFIG.aboutExtended),
            mcaDegree: String(data.mcaDegree ?? DEFAULT_SITE_CONFIG.mcaDegree),
            mcaInstitution: String(data.mcaInstitution ?? DEFAULT_SITE_CONFIG.mcaInstitution),
            bcaDegree: String(data.bcaDegree ?? DEFAULT_SITE_CONFIG.bcaDegree),
            bcaInstitution: String(data.bcaInstitution ?? DEFAULT_SITE_CONFIG.bcaInstitution),
            founderPhoto: String(data.founderPhoto ?? THEMED_FOUNDER_PHOTO_SRC),
            missionTitle: String(data.missionTitle ?? DEFAULT_SITE_CONFIG.missionTitle),
            missionStatement: String(data.missionStatement ?? DEFAULT_SITE_CONFIG.missionStatement),
            visionTitle: String(data.visionTitle ?? DEFAULT_SITE_CONFIG.visionTitle),
            visionStatement: String(data.visionStatement ?? DEFAULT_SITE_CONFIG.visionStatement),
          });
        } else {
          setDbSiteConfig(null);
        }
        setConfigLoaded(true);
      },
      (error) => {
        setConfigLoaded(true);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to Visitor Inquiries ONLY when authenticated as verified Admin with fresh JWT
  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setInquiries([]);
      inquiryRetryRef.current = 0;
      return;
    }

    const path = 'inquiries';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        inquiryRetryRef.current = 0;
        const items: InquiryItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name ?? ''),
            email: String(data.email ?? ''),
            phone: String(data.phone ?? ''),
            projectType: String(data.projectType ?? ''),
            message: String(data.message ?? ''),
            status: (data.status as InquiryStatus) ?? 'new',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          };
        });
        setInquiries(items);
      },
      async (error) => {
        // If Firestore still held a pre-verification JWT, force-refresh once and re-attach cleanly
        if (inquiryRetryRef.current < 1 && auth.currentUser) {
          inquiryRetryRef.current += 1;
          try {
            await auth.currentUser.getIdToken(true);
            window.setTimeout(() => {
              setTokenVersion((v) => v + 1);
            }, 250);
            return;
          } catch {
            // Fall through to structured error logging
          }
        }
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (wrapped) {
          console.error(wrapped);
        }
      }
    );

    return () => unsubscribe();
  }, [authReady, user, isAdmin, tokenVersion]);

  const seedDatabaseDefaults = async () => {
    const path = 'batch/seedDefaults';
    try {
      const batch = writeBatch(db);
      let hasWrites = false;

      if (dbProjects.length === 0) {
        hasWrites = true;
        DEFAULT_PROJECTS.forEach((proj) => {
          const ref = doc(db, 'projects', proj.id);
          batch.set(ref, {
            index: proj.index,
            title: proj.title,
            subtitle: proj.subtitle,
            category: proj.category,
            discipline: proj.discipline,
            location: proj.location,
            year: proj.year,
            liveUrl: proj.liveUrl,
            displayDomain: proj.displayDomain,
            image: proj.image,
            imageAlt: proj.imageAlt,
            summary: proj.summary,
            challenge: proj.challenge,
            approach: proj.approach,
            deliverables: proj.deliverables,
            platform: proj.platform,
            order: proj.order,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      }

      if (dbServices.length === 0) {
        hasWrites = true;
        DEFAULT_SERVICES.forEach((svc) => {
          const ref = doc(db, 'services', svc.id);
          batch.set(ref, {
            index: svc.index,
            title: svc.title,
            tagline: svc.tagline,
            phase: svc.phase,
            description: svc.description,
            deliverables: svc.deliverables,
            timeline: svc.timeline,
            idealFor: svc.idealFor,
            order: svc.order,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      }

      if (dbExperiences.length === 0) {
        hasWrites = true;
        DEFAULT_EXPERIENCES.forEach((exp) => {
          const ref = doc(db, 'experiences', exp.id);
          batch.set(ref, {
            index: exp.index,
            role: exp.role,
            organization: exp.organization,
            type: exp.type,
            duration: exp.duration,
            location: exp.location,
            summary: exp.summary,
            current: exp.current,
            order: exp.order,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      }

      if (!dbSiteConfig) {
        hasWrites = true;
        const cfgRef = doc(db, 'siteConfig', 'main');
        batch.set(cfgRef, {
          ...DEFAULT_SITE_CONFIG,
          updatedAt: serverTimestamp(),
        });
      }

      if (hasWrites) {
        await batch.commit();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Auto-seed empty Firestore collections automatically on first verified Admin sign-in
  // so every edit/delete immediately updates all pages dynamically with zero manual setup.
  useEffect(() => {
    if (
      !authReady ||
      !isAdmin ||
      !projectsLoaded ||
      !servicesLoaded ||
      !experiencesLoaded ||
      !configLoaded ||
      autoSeededRef.current
    ) {
      return;
    }

    const needsSeed =
      dbProjects.length === 0 ||
      dbServices.length === 0 ||
      dbExperiences.length === 0 ||
      !dbSiteConfig;

    if (needsSeed) {
      autoSeededRef.current = true;
      seedDatabaseDefaults().catch((err) => {
        console.error('Auto-seed skipped:', err);
      });
    }
  }, [
    authReady,
    isAdmin,
    projectsLoaded,
    servicesLoaded,
    experiencesLoaded,
    configLoaded,
    dbProjects.length,
    dbServices.length,
    dbExperiences.length,
    dbSiteConfig,
  ]);

  const evaluateAdminStatus = async (targetUser: User | null): Promise<boolean> => {
    return verifyAdminWithFreshToken(targetUser, true);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    setUser(cred.user);
    await evaluateAdminStatus(cred.user);
  };

  const signInWithCredentials = async (usernameOrEmail: string, password: string) => {
    const resolvedEmail = resolveAdminEmail(usernameOrEmail);
    const cred = await signInWithEmailAndPassword(auth, resolvedEmail, password);
    setUser(cred.user);
    await evaluateAdminStatus(cred.user);
  };

  const registerAdminCredentials = async (usernameOrEmail: string, password: string) => {
    const resolvedEmail = resolveAdminEmail(usernameOrEmail);
    if (!BOOTSTRAPPED_ADMIN_EMAILS.includes(resolvedEmail)) {
      throw new Error(
        'Only authorized owner usernames (hellosurya) or admin emails (youanusha1997@gmail.com / uanusha017@gmail.com) can initialize Admin credentials.'
      );
    }
    const cred = await createUserWithEmailAndPassword(auth, resolvedEmail, password);
    await sendEmailVerification(cred.user);
    setUser(cred.user);
    await verifyAdminWithFreshToken(cred.user, false);
  };

  const sendAdminPasswordReset = async (usernameOrEmail: string) => {
    const resolvedEmail = resolveAdminEmail(usernameOrEmail);
    await sendPasswordResetEmail(auth, resolvedEmail);
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error('Please sign in first to resend the verification email.');
    }
    await sendEmailVerification(auth.currentUser);
  };

  const refreshVerificationStatus = async (): Promise<boolean> => {
    if (!auth.currentUser) {
      return false;
    }
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    setUser(auth.currentUser);
    setTokenVersion((v) => v + 1);
    return verifyAdminWithFreshToken(auth.currentUser, true);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const saveProject = async (project: Omit<ProjectItem, 'id'>, existingId?: string) => {
    const docId = existingId ? existingId : sanitizeId(project.title, 'project');
    const path = `projects/${docId}`;

    const basePayload = {
      index: clampString(project.index || '01', 8),
      title: clampString(project.title, 120),
      subtitle: clampString(project.subtitle || project.discipline, 180),
      category: project.category,
      discipline: clampString(project.discipline, 80),
      location: clampString(project.location || 'India', 80),
      year: clampString(project.year || '2026', 12),
      liveUrl: clampString(project.liveUrl, 400),
      displayDomain: clampString(project.displayDomain, 160),
      image: clampString(project.image, 500),
      imageAlt: clampString(project.imageAlt || `${project.title} preview`, 240),
      summary: clampString(project.summary, 600),
      challenge: clampString(project.challenge || project.summary, 1200),
      approach: clampString(project.approach || project.summary, 1200),
      deliverables: sanitizeStringList(project.deliverables, 8),
      platform: clampString(project.platform || 'Cloud', 60),
      order: Math.max(0, Math.min(1000, Number(project.order) || 1)),
      updatedAt: serverTimestamp(),
    };

    try {
      const ref = doc(db, 'projects', docId);
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        await updateDoc(ref, basePayload);
      } else {
        await setDoc(ref, {
          ...basePayload,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteProject = async (id: string) => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const saveService = async (service: Omit<ServiceItem, 'id'>, existingId?: string) => {
    const docId = existingId ? existingId : sanitizeId(service.title, 'service');
    const path = `services/${docId}`;

    const basePayload = {
      index: clampString(service.index || '01', 8),
      title: clampString(service.title, 120),
      tagline: clampString(service.tagline, 180),
      phase: service.phase,
      description: clampString(service.description, 900),
      deliverables: sanitizeStringList(service.deliverables, 8),
      timeline: clampString(service.timeline || '2–4 Weeks', 60),
      idealFor: clampString(service.idealFor || 'Growing businesses', 160),
      order: Math.max(0, Math.min(1000, Number(service.order) || 1)),
      updatedAt: serverTimestamp(),
    };

    try {
      const ref = doc(db, 'services', docId);
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        await updateDoc(ref, basePayload);
      } else {
        await setDoc(ref, {
          ...basePayload,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteService = async (id: string) => {
    const path = `services/${id}`;
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const saveExperience = async (exp: Omit<ExperienceItem, 'id'>, existingId?: string) => {
    const docId = existingId
      ? existingId
      : sanitizeId(`${exp.organization}-${exp.role}`, 'experience');
    const path = `experiences/${docId}`;

    const basePayload = {
      index: clampString(exp.index || '01', 8),
      role: clampString(exp.role, 120),
      organization: clampString(exp.organization, 120),
      type: exp.type,
      duration: clampString(exp.duration, 60),
      location: clampString(exp.location || 'Karnataka, India', 80),
      summary: clampString(exp.summary, 700),
      current: Boolean(exp.current),
      order: Math.max(0, Math.min(1000, Number(exp.order) || 1)),
      updatedAt: serverTimestamp(),
    };

    try {
      const ref = doc(db, 'experiences', docId);
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        await updateDoc(ref, basePayload);
      } else {
        await setDoc(ref, {
          ...basePayload,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteExperience = async (id: string) => {
    const path = `experiences/${id}`;
    try {
      await deleteDoc(doc(db, 'experiences', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const saveSiteConfig = async (config: SiteConfig) => {
    const path = 'siteConfig/main';
    const payload = {
      studioName: clampString(config.studioName, 100),
      tagline: clampString(config.tagline, 140),
      businessEmail: clampString(config.businessEmail, 120),
      businessPhone: clampString(config.businessPhone, 30),
      location: clampString(config.location, 120),
      heroHeadline: clampString(config.heroHeadline, 180),
      heroLead: clampString(config.heroLead, 500),
      aboutHeadline: clampString(config.aboutHeadline, 180),
      aboutSummary: clampString(config.aboutSummary, 800),
      aboutExtended: clampString(config.aboutExtended, 1500),
      mcaDegree: clampString(config.mcaDegree, 160),
      mcaInstitution: clampString(config.mcaInstitution, 140),
      bcaDegree: clampString(config.bcaDegree, 160),
      bcaInstitution: clampString(config.bcaInstitution, 140),
      founderPhoto: clampString(config.founderPhoto || THEMED_FOUNDER_PHOTO_SRC, 500),
      missionTitle: clampString(config.missionTitle || DEFAULT_SITE_CONFIG.missionTitle, 160),
      missionStatement: clampString(
        config.missionStatement || DEFAULT_SITE_CONFIG.missionStatement,
        900
      ),
      visionTitle: clampString(config.visionTitle || DEFAULT_SITE_CONFIG.visionTitle, 160),
      visionStatement: clampString(
        config.visionStatement || DEFAULT_SITE_CONFIG.visionStatement,
        900
      ),
      updatedAt: serverTimestamp(),
    };

    try {
      const ref = doc(db, 'siteConfig', 'main');
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        await updateDoc(ref, payload);
      } else {
        await setDoc(ref, payload);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const submitInquiry = async (input: {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    message: string;
  }) => {
    const docId = `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const path = `inquiries/${docId}`;

    try {
      await setDoc(doc(db, 'inquiries', docId), {
        name: clampString(input.name, 100),
        email: clampString(input.email, 120),
        phone: clampString(input.phone, 30),
        projectType: clampString(input.projectType, 100),
        message: clampString(input.message, 2000),
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    const path = `inquiries/${id}`;
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteInquiry = async (id: string) => {
    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const value = useMemo<PortfolioContextValue>(
    () => ({
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
      projects: dbProjects.length > 0 ? dbProjects : DEFAULT_PROJECTS,
      services: dbServices.length > 0 ? dbServices : DEFAULT_SERVICES,
      experiences: dbExperiences.length > 0 ? dbExperiences : DEFAULT_EXPERIENCES,
      siteConfig: dbSiteConfig ?? DEFAULT_SITE_CONFIG,
      inquiries,
      hasDbProjects: dbProjects.length > 0,
      hasDbServices: dbServices.length > 0,
      hasDbExperiences: dbExperiences.length > 0,
      hasDbSiteConfig: dbSiteConfig !== null,
      loadingData: !projectsLoaded || !servicesLoaded || !experiencesLoaded,
      saveProject,
      deleteProject,
      saveService,
      deleteService,
      saveExperience,
      deleteExperience,
      saveSiteConfig,
      submitInquiry,
      updateInquiryStatus,
      deleteInquiry,
      seedDatabaseDefaults,
    }),
    [
      user,
      authReady,
      isAdmin,
      dbProjects,
      dbServices,
      dbExperiences,
      dbSiteConfig,
      inquiries,
      projectsLoaded,
      servicesLoaded,
      experiencesLoaded,
    ]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
}
