export type ProjectCategory =
  | 'All'
  | 'Architecture & Real Estate'
  | 'Wellness & Hospitality'
  | 'Commerce & Systems'
  | 'Custom Web Apps';

export type ProjectCategoryValue = Exclude<ProjectCategory, 'All'>;

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: ProjectCategoryValue;
  discipline: string;
  location: string;
  year: string;
  liveUrl: string;
  displayDomain: string;
  image: string;
  imageAlt: string;
  summary: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  platform: string;
  order: number;
  highlights?: { label: string; value: string }[];
}

export type ServicePhase = 'Design' | 'Develop' | 'Deliver' | 'End-to-End';

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  tagline: string;
  phase: ServicePhase;
  description: string;
  deliverables: string[];
  timeline: string;
  idealFor: string;
  order: number;
}

export type ExperienceType = 'Industry' | 'Teaching' | 'Online Teaching';

export interface ExperienceItem {
  id: string;
  index: string;
  role: string;
  organization: string;
  type: ExperienceType;
  duration: string;
  location: string;
  summary: string;
  current: boolean;
  order: number;
}

export interface SiteConfig {
  studioName: string;
  tagline: string;
  businessEmail: string;
  businessPhone: string;
  location: string;
  heroHeadline: string;
  heroLead: string;
  aboutHeadline: string;
  aboutSummary: string;
  aboutExtended: string;
  mcaDegree: string;
  mcaInstitution: string;
  bcaDegree: string;
  bcaInstitution: string;
  founderPhoto: string;
  missionTitle: string;
  missionStatement: string;
  visionTitle: string;
  visionStatement: string;
}

export type InquiryStatus = 'new' | 'reviewed' | 'replied' | 'archived';

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  status: InquiryStatus;
  createdAt?: Date | null;
}

export const THEMED_FOUNDER_PHOTO_SRC =
  '/src/assets/images/founder_portrait_themed_1795158962469.jpg';

export const PAGE_FEATURE_IMAGES = {
  home: '/src/assets/images/hero_studio_desk_1795156737109.jpg',
  work: '/src/assets/images/carousel_work_showcase_1795160992366.jpg',
  services: '/src/assets/images/feature_services_engineering_1795159720491.jpg',
  about: '/src/assets/images/feature_about_mission_1795159720565.jpg',
  contact: '/src/assets/images/feature_contact_studio_1795159719956.jpg',
  admin: '/src/assets/images/feature_admin_workspace_1795159719898.jpg',
} as const;

export const PAGE_HERO_CAROUSELS = {
  home: [
    {
      src: '/src/assets/images/hero_studio_desk_1795156737109.jpg',
      alt: 'Sunlit studio design desk at HK Surya Digital Solutions',
      subcaption: 'Design',
      caption: 'Minimalist digital interfaces engineered for clarity',
    },
    {
      src: '/src/assets/images/carousel_home_studio_craft_1795160366146.jpg',
      alt: 'Web architecture grid systems on studio monitor in deep navy and amber',
      subcaption: 'Develop',
      caption: 'Structured grid systems & tailored brand architecture',
    },
    {
      src: '/src/assets/images/carousel_home_delivery_1795160365976.jpg',
      alt: 'Responsive mobile and tablet digital products resting on travertine surface',
      subcaption: 'Deliver',
      caption: 'Mobile-first responsive websites shipped live to production',
    },
  ],
  work: [
    {
      src: '/src/assets/images/carousel_work_showcase_1795160992366.jpg',
      alt: 'Minimalist digital design gallery table showcasing multi-device live client websites',
      subcaption: 'Selected Works',
      caption: 'Live websites & applications shipped across real estate, wellness & education',
    },
    {
      src: '/src/assets/images/carousel_work_case_studies_1795160992669.jpg',
      alt: 'Curated web design moodboards, dark navy portfolio binder and drafting tools on studio desk',
      subcaption: 'Case Studies',
      caption: 'Detailed problem statements, architectural decisions & live demo links',
    },
  ],
  services: [
    {
      src: '/src/assets/images/feature_services_engineering_1795159720491.jpg',
      alt: 'End-to-end web design and wireframing studio workspace',
      subcaption: 'UI/UX & Web',
      caption: 'From discovery wireframes to live web applications',
    },
    {
      src: '/src/assets/images/carousel_services_fullstack_1795160366477.jpg',
      alt: 'Full-stack cloud architecture blueprints and software engineering desk',
      subcaption: 'Full-Stack',
      caption: 'Cloud databases, dynamic admin panels & scalable architecture',
    },
    {
      src: '/src/assets/images/carousel_services_mentorship_1795160365766.jpg',
      alt: 'Online computer science classes and technical mentorship studio desk',
      subcaption: 'Online Classes',
      caption: 'Interactive remote coaching in web development & CS',
    },
  ],
  aboutSecondary: [
    {
      src: '/src/assets/images/feature_about_mission_1795159720565.jpg',
      alt: 'Architectural sunlit studio and academic library symbolizing HK Surya mission and vision',
      subcaption: 'Mission & Vision',
      caption: 'Combining software craftsmanship with approachable education',
    },
    {
      src: '/src/assets/images/carousel_about_education_1795160366747.jpg',
      alt: 'Modern sunlit university computer science seminar studio reflecting teaching experience',
      subcaption: 'Teaching & CS Roots',
      caption: 'PES University, P. C. Jabin College, IBMR & Chinmaya Vidyalaya',
    },
  ],
  contact: [
    {
      src: '/src/assets/images/feature_contact_studio_1795159719956.jpg',
      alt: 'Client consultation workspace at HK Surya Digital Solutions with project brief notebook',
      subcaption: 'Start a Conversation',
      caption: 'Direct email, phone & live inquiry tracking with 24-hour response',
    },
    {
      src: '/src/assets/images/carousel_contact_collaboration_1795160992305.jpg',
      alt: 'Golden hour architectural client consultation studio room with oak conference table',
      subcaption: 'Discovery & Roadmap',
      caption: 'From initial idea to scoped timeline, design & live cloud launch',
    },
  ],
  admin: [
    {
      src: '/src/assets/images/feature_admin_workspace_1795159719898.jpg',
      alt: 'Dark navy and solar amber executive studio desk for HK Surya Admin Console',
      subcaption: 'Admin Console',
      caption: 'Manage projects, services, experience, mission & vision',
    },
    {
      src: '/src/assets/images/carousel_admin_sync_1795160366059.jpg',
      alt: 'Real-time cloud synchronization control room workstation in deep navy and amber',
      subcaption: 'Live Firestore Sync',
      caption: 'Every saved edit updates public pages automatically',
    },
  ],
} as const;

export const DELIVERY_STANDARDS = [
  {
    index: '01.',
    title: 'Search-Ready Architecture',
    detail:
      'Semantic HTML5 structure, per-page SEO metadata, OpenGraph social cards, and Schema.org structured data built directly into every website.',
  },
  {
    index: '02.',
    title: 'Real-Time Dynamic Control',
    detail:
      'Every project, service, testimonial, or profile detail can be backed by a cloud database and Admin Console so you can update content anytime without developer bottlenecks.',
  },
  {
    index: '03.',
    title: 'Responsive Mobile Ergonomics',
    detail:
      'Interfaces engineered for effortless thumb navigation, crisp typography, and rapid load speeds on Indian mobile networks as well as desktop displays.',
  },
  {
    index: '04.',
    title: 'Educator-Grade Onboarding',
    detail:
      'Backed by school, college, and online teaching experience, every handover includes clear walkthroughs so your team feels confident operating the platform from day one.',
  },
];

export const STUDIO_VALUES = [
  {
    index: '01.',
    title: 'Clarity Over Complexity',
    description:
      'Good software removes friction. Every layout, navigation path, and database workflow is simplified until visitors and teams immediately understand their next step.',
  },
  {
    index: '02.',
    title: 'Computer Science Rigor',
    description:
      'Rooted in BCA and MCA training and sharpened in production IT roles at Clickcrawl and Natton.ai, every line of code is structured for reliability, security, and maintainability.',
  },
  {
    index: '03.',
    title: 'Educator’s Empathy',
    description:
      'Teaching students at IBMR College, Chinmaya Vidyalaya School, and in online batches shapes how we collaborate—with patience, transparent communication, and practical guidance.',
  },
  {
    index: '04.',
    title: 'Honest Live Delivery',
    description:
      'We focus on real, shipped results—live deployments on Vercel, Netlify, Cloudflare Workers, and Firebase that perform reliably for real customers and students.',
  },
];

export const ENGAGEMENT_MODELS = [
  {
    index: '01',
    title: 'Turnkey Website or Web App',
    cadence: 'Fixed Scope · 2–6 Weeks',
    description:
      'Ideal when you want a complete business website, real estate showcase, e-commerce store, or custom full-stack application designed, built, and launched end to end.',
    includes: [
      'Discovery workshop & visual system',
      'Responsive React & cloud database build',
      'Custom Admin Panel & SEO setup',
    ],
  },
  {
    index: '02',
    title: 'Ongoing Evolution & Care',
    cadence: 'Monthly Retainer · Flexible',
    description:
      'Continuous feature additions, seasonal landing pages, SEO updates, performance tuning, and priority technical support after your website or portal goes live.',
    includes: [
      'Monthly content & feature updates',
      'Core Web Vitals & SEO checks',
      'Direct phone & email support',
    ],
  },
  {
    index: '03',
    title: 'Online Classes & Mentorship',
    cadence: 'Weekly Live Batches · Remote',
    description:
      'Structured computer science and web development coaching for school learners, BCA/MCA students, and aspiring developers seeking practical project guidance.',
    includes: [
      'Live concept & coding walkthroughs',
      'Real-world portfolio project reviews',
      'Exam, viva & career preparation',
    ],
  },
];

export const SERVICE_FAQS = [
  {
    question: 'Can I update projects, services, and text myself after the website launches?',
    answer:
      'Yes. End-to-end applications and dynamic portfolios include a secure Admin Panel backed by Firebase Firestore so whenever you add or edit an item, your public website updates automatically in real time.',
  },
  {
    question: 'How long does it take to design and launch a complete website or application?',
    answer:
      'Focused business or institutional websites typically launch in 2–3 weeks. Full-stack web applications with custom databases, booking workflows, and admin dashboards typically take 3–6 weeks depending on scope.',
  },
  {
    question: 'Are websites optimized for Google Search (SEO) and mobile devices?',
    answer:
      'Every build includes responsive mobile-first layouts, tailored page titles and meta descriptions, OpenGraph & Twitter share cards, clean URL structures, fast image delivery, and Schema.org structured data.',
  },
  {
    question: 'Do you also conduct online computer science and web development classes?',
    answer:
      'Yes. Drawing on teaching experience at IBMR College and Chinmaya Vidyalaya School alongside IT industry work, we offer live online classes covering programming fundamentals, web design, and hands-on capstone projects.',
  },
  {
    question: 'How do we get started on a new project or class enrollment?',
    answer:
      'Use the Contact Us form or reach out directly via email (youanusha1997@gmail.com) or phone (9989581311). We respond within 24 hours to schedule a short discovery conversation and share a clear roadmap.',
  },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'All',
  'Architecture & Real Estate',
  'Wellness & Hospitality',
  'Commerce & Systems',
  'Custom Web Apps',
];

export const PROJECT_CATEGORY_OPTIONS: ProjectCategoryValue[] = [
  'Architecture & Real Estate',
  'Wellness & Hospitality',
  'Commerce & Systems',
  'Custom Web Apps',
];

export const SERVICE_PHASES: ServicePhase[] = ['End-to-End', 'Design', 'Develop', 'Deliver'];

export const EXPERIENCE_TYPES: ExperienceType[] = ['Industry', 'Teaching', 'Online Teaching'];

export const PRESET_PROJECT_IMAGES = [
  {
    label: 'Interior Architecture',
    url: '/src/assets/images/project_touchstone_atelier_1795156738821.jpg',
  },
  {
    label: 'Real Estate & Villas',
    url: '/src/assets/images/project_durga_developers_1795156737679.jpg',
  },
  {
    label: 'Wellness Sanctuary',
    url: '/src/assets/images/project_bodhi_wellness_1795156738100.jpg',
  },
  {
    label: 'Luxury Salon Studio',
    url: '/src/assets/images/project_lumiere_salon_1795156738383.jpg',
  },
  {
    label: 'Wellness E-Commerce',
    url: '/src/assets/images/project_wellness_market_1795156736827.jpg',
  },
  {
    label: 'School Campus',
    url: '/src/assets/images/project_sdk_school_1795156738103.jpg',
  },
  {
    label: 'Design Studio Desk',
    url: '/src/assets/images/hero_studio_desk_1795156737109.jpg',
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  studioName: 'HK Surya Digital Solutions',
  tagline: 'Design · Develop · Deliver',
  businessEmail: 'youanusha1997@gmail.com',
  businessPhone: '9989581311',
  location: 'Hubballi & Bengaluru, Karnataka',
  heroHeadline: 'Thoughtful web design & end-to-end apps built for the real world.',
  heroLead:
    'hello surya · HK Surya Digital Solutions crafts responsive websites, full-stack web applications, and cloud-backed business platforms—engineered cleanly and shipped live.',
  aboutHeadline: 'Combining computer science discipline, industry craft, and teaching clarity.',
  aboutSummary:
    'Hello, I am the creator behind hello surya · HK Surya Digital Solutions—presently working at Natton.ai, with IT industry experience at Clickcrawl and classroom & online teaching experience across IBMR College and Chinmaya Vidyalaya School.',
  aboutExtended:
    'My academic path started with a BCA at P. C. Jabin Science College in Hubballi and advanced to an MCA (Master in Computer Science) at PES University, Bengaluru. Along the way, I have combined real-world software delivery in the IT industry—at Clickcrawl and currently at Natton.ai—with a deep love for education, teaching college learners at IBMR College, school students at Chinmaya Vidyalaya School, and remote learners through online classes. That dual background helps me build websites and end-to-end applications that are both technically rock-solid and effortlessly intuitive.',
  mcaDegree: 'MCA — Master of Computer Applications (Master in Computer Science)',
  mcaInstitution: 'PES University, Bengaluru',
  bcaDegree: 'BCA — Bachelor of Computer Applications',
  bcaInstitution: 'P. C. Jabin Science College, Hubballi',
  founderPhoto: THEMED_FOUNDER_PHOTO_SRC,
  missionTitle: 'Build honest, high-craft digital products and empower learners with practical skills.',
  missionStatement:
    'Our mission at HK Surya Digital Solutions is to partner with businesses, institutions, and founders to design and engineer fast, intuitive, and maintainable web applications—while using our classroom and online teaching roots to make modern technology approachable for both clients and students.',
  visionTitle: 'Bridge real-world software engineering with accessible digital education.',
  visionStatement:
    'Our vision is to become a trusted digital studio and learning hub recognized across Karnataka and beyond for enduring web design, dependable full-stack cloud systems, and a new generation of confident young developers mentored through real-world projects.',
};

export const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'natton-ai-present',
    index: '01',
    role: 'Technology & Digital Product Professional',
    organization: 'Natton.ai',
    type: 'Industry',
    duration: 'Present',
    location: 'IT & AI Industry',
    summary:
      'Currently working at Natton.ai, contributing to modern AI-enabled software solutions, web interfaces, and end-to-end digital product delivery.',
    current: true,
    order: 1,
  },
  {
    id: 'clickcrawl-industry',
    index: '02',
    role: 'Software & Web Developer',
    organization: 'Clickcrawl',
    type: 'Industry',
    duration: '1 Year',
    location: 'IT Industry',
    summary:
      'Spent 1 year in the IT industry at Clickcrawl building responsive web interfaces, digital client platforms, and production-ready front-end experiences.',
    current: false,
    order: 2,
  },
  {
    id: 'ibmr-college-teaching',
    index: '03',
    role: 'College Lecturer — Computer Applications',
    organization: 'IBMR College',
    type: 'Teaching',
    duration: '1 Year',
    location: 'College Faculty',
    summary:
      'Taught undergraduate students at IBMR College for 1 year, guiding coursework in computer science fundamentals, programming concepts, and practical web projects.',
    current: false,
    order: 3,
  },
  {
    id: 'chinmaya-vidyalaya-school',
    index: '04',
    role: 'Computer Science Educator',
    organization: 'Chinmaya Vidyalaya School',
    type: 'Teaching',
    duration: '6 Months',
    location: 'School Faculty',
    summary:
      'Taught school students at Chinmaya Vidyalaya School for 6 months, fostering strong foundations in computing, logical thinking, and digital literacy.',
    current: false,
    order: 4,
  },
  {
    id: 'online-classes-mentor',
    index: '05',
    role: 'Online Instructor & Technical Mentor',
    organization: 'Independent Online Classes',
    type: 'Online Teaching',
    duration: 'Ongoing',
    location: 'Remote / Online',
    summary:
      'Conducting interactive online classes for students and aspiring developers covering web design, programming fundamentals, and hands-on project building.',
    current: true,
    order: 5,
  },
];

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'touchstone-atelier',
    index: '01',
    title: 'Touchstone Atelier',
    subtitle: 'Luxury Interior Architecture & Palette Studio',
    category: 'Architecture & Real Estate',
    discipline: 'Interior Architecture',
    location: 'Hubli, Karnataka',
    year: '2026',
    liveUrl: 'https://weathered-water-338e.uanusha017.workers.dev/',
    displayDomain: 'weathered-water-338e.uanusha017.workers.dev',
    image: '/src/assets/images/project_touchstone_atelier_1795156738821.jpg',
    imageAlt:
      'Bespoke residential interior with fluted natural oak millwork and honed travertine stone island for Touchstone Atelier',
    summary:
      'Turnkey interior design and architectural execution studio showcase highlighting bespoke residential spaces, modular kitchens, wardrobes, and curated material palettes.',
    challenge:
      'Translate tactile architectural craft—fluted timber, natural stone, and bespoke color palettes—into a calm, high-trust digital flagship that converts discerning homeowners into studio consultations.',
    approach:
      'Structured the layout around generous gallery framing, disciplined architectural typography, and an interactive palette-forward browsing flow so prospective clients can evaluate finish quality before booking a turnkey consultation.',
    deliverables: [
      'Brand & Visual Direction',
      'Responsive Showcase Website',
      'Curated Material & Palette Presentation',
      'Consultation Lead Flow',
    ],
    platform: 'Cloudflare Workers',
    order: 1,
  },
  {
    id: 'shri-durga-developers',
    index: '02',
    title: 'Shri Durga Developers & Promoters',
    subtitle: 'Hubballi Real Estate & Residential Developments',
    category: 'Architecture & Real Estate',
    discipline: 'Real Estate Web Experience',
    location: 'Hubballi, Karnataka',
    year: '2026',
    liveUrl: 'https://durga-developers.vercel.app/',
    displayDomain: 'durga-developers.vercel.app',
    image: '/src/assets/images/project_durga_developers_1795156737679.jpg',
    imageAlt:
      'Contemporary residential villas and landscaped courtyard architecture for Shri Durga Developers in Hubballi',
    summary:
      'Digital property showcase and developer credibility platform for Shri Durga Developers & Promoters, presenting residential layouts, architectural quality, and buyer inquiry pathways.',
    challenge:
      'Regional real estate sites often overwhelm buyers with cluttered banners and unclear project availability. The goal was to establish immediate institutional trust and effortless property exploration.',
    approach:
      'Crafted a clear property hierarchy with prominent architectural visuals, structured layout highlights, and frictionless direct inquiry pathways tailored for local and NRI property buyers.',
    deliverables: [
      'Property Showcase UI',
      'Mobile-First Buyer Navigation',
      'Direct Site-Visit Inquiry Flow',
      'Fast Edge Deployment',
    ],
    platform: 'Vercel',
    order: 2,
  },
  {
    id: 'bodhi-wellness',
    index: '03',
    title: 'BODHI Wellness Centre',
    subtitle: 'Unravel the Inner Wisdom — Holistic Therapy',
    category: 'Wellness & Hospitality',
    discipline: 'Wellness & Brand Website',
    location: 'Dharwad, Karnataka',
    year: '2025',
    liveUrl: 'https://stunning-hamster-7b9beb.netlify.app/',
    displayDomain: 'stunning-hamster-7b9beb.netlify.app',
    image: '/src/assets/images/project_bodhi_wellness_1795156738100.jpg',
    imageAlt:
      'Tranquil minimalist meditation and holistic wellness sanctuary interior for BODHI Wellness Centre',
    summary:
      'Serene editorial web presence for BODHI Wellness Centre guided by Mrs. Veena Tikare, introducing holistic healing practices, Past Life Regression therapy, and Clinical Hypnotherapy.',
    challenge:
      'Communicate deeply personal therapeutic modalities with warmth, clarity, and professionalism so first-time visitors feel grounded and confident reaching out.',
    approach:
      'Paired unhurried editorial pacing with breathable typography and clearly articulated therapy overviews, turning complex holistic disciplines into an approachable, comforting reading experience.',
    deliverables: [
      'Editorial Web Design',
      'Therapy & Practice Architecture',
      'Practitioner Profile Storytelling',
      'Session Inquiry Pathways',
    ],
    platform: 'Netlify',
    order: 3,
  },
  {
    id: 'lumiere-salon',
    index: '04',
    title: 'Lumière Salon & Booking',
    subtitle: 'Editorial Beauty Studio & Online Scheduling',
    category: 'Wellness & Hospitality',
    discipline: 'Hospitality & Booking UI',
    location: 'Modern Studio',
    year: '2026',
    liveUrl: 'https://salon-booking-websit-btz1.bolt.host/',
    displayDomain: 'salon-booking-websit-btz1.bolt.host',
    image: '/src/assets/images/project_lumiere_salon_1795156738383.jpg',
    imageAlt:
      'Minimalist luxury beauty salon interior with arched brass mirrors and sculpted stone styling stations for Lumière',
    summary:
      'Refined luxury salon storefront and integrated appointment booking experience allowing guests to browse curated hair and beauty treatments and reserve sessions effortlessly.',
    challenge:
      'Balance high-fashion editorial salon atmosphere with a pragmatic, low-friction appointment booking workflow that feels fast and intuitive on mobile devices.',
    approach:
      'Combined clean service menus, clear duration and treatment framing, and a guided booking interaction that eliminates phone-tag while reinforcing a boutique salon identity.',
    deliverables: [
      'Boutique Visual Identity',
      'Service Menu Architecture',
      'Interactive Appointment Flow',
      'Responsive Mobile Booking UX',
    ],
    platform: 'Bolt Host',
    order: 4,
  },
  {
    id: 'wellness-forever-market',
    index: '05',
    title: 'Wellness Forever Market',
    subtitle: 'Health, Nutrition & Pharmacy Storefront',
    category: 'Commerce & Systems',
    discipline: 'E-Commerce Interface',
    location: 'Digital Retail',
    year: '2026',
    liveUrl: 'https://wellness-forever-market.lovable.app/',
    displayDomain: 'wellness-forever-market.lovable.app',
    image: '/src/assets/images/project_wellness_market_1795156736827.jpg',
    imageAlt:
      'Curated amber glass wellness supplements and botanical health essentials arranged on alabaster stone for Wellness Forever Market',
    summary:
      'Clean contemporary health and pharmacy e-commerce storefront engineered for quick everyday product discovery, category filtering, and reliable wellness essentials shopping.',
    challenge:
      'Online health marketplaces frequently suffer from visual noise and dense promotional clutter that erode customer trust during health-sensitive purchases.',
    approach:
      'Designed an uncluttered retail grid with crisp category organization, clear product presentation, and straightforward cart interactions prioritizing speed and legibility.',
    deliverables: [
      'E-Commerce Storefront UI',
      'Category & Catalog Structure',
      'Product Card System',
      'Responsive Retail Experience',
    ],
    platform: 'Lovable Cloud',
    order: 5,
  },
  {
    id: 'sdk-public-school',
    index: '06',
    title: 'Smt Drakshayani Kalyanshettar Public School',
    subtitle: 'CBSE Institution Website & Integrated Management Portal',
    category: 'Commerce & Systems',
    discipline: 'Education & Web Platform',
    location: 'Hubli, Karnataka',
    year: '2025',
    liveUrl: 'https://elaborate-biscotti-90e92c.netlify.app/',
    displayDomain: 'elaborate-biscotti-90e92c.netlify.app',
    image: '/src/assets/images/project_sdk_school_1795156738103.jpg',
    imageAlt:
      'Sunlit contemporary school campus courtyard and brick-and-glass library facade for Smt Drakshayani Kalyanshettar Public School',
    summary:
      'Official website and integrated school management system for Smt Drakshayani Kalyanshettar Public School, Hubli—managed by J K Education Society (CBSE Affiliation No. 830277).',
    challenge:
      'Serve three distinct audiences—prospective parents, enrolled families, and school administrators—inside one cohesive, accessible platform without overwhelming visitors.',
    approach:
      'Built clear institutional information architecture presenting CBSE accreditation, academics, and admissions alongside streamlined access to integrated school management workflows.',
    deliverables: [
      'Institutional Website Design',
      'Integrated Management Portal UX',
      'Admissions & Academic Navigation',
      'Accessible Multi-Device Layout',
    ],
    platform: 'Netlify',
    order: 6,
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'end-to-end-web-applications',
    index: '01',
    title: 'End-to-End Web Applications',
    tagline: 'From discovery and database architecture to live cloud launch',
    phase: 'End-to-End',
    description:
      'Complete full-stack web application delivery tailored to your operations—combining custom UI/UX design, responsive front-end engineering, cloud database modeling, user authentication, and role-based admin dashboards.',
    deliverables: [
      'Product Architecture & Data Modeling',
      'Responsive React & TypeScript Front-End',
      'Cloud Database & Secure Authentication',
      'Role-Based Admin Dashboard & Analytics',
      'Production Hosting & Domain Setup',
    ],
    timeline: '3–6 Weeks',
    idealFor: 'Growing businesses, institutions & custom digital products',
    order: 1,
  },
  {
    id: 'ui-ux-brand-web-design',
    index: '02',
    title: 'UI/UX & Brand Web Design',
    tagline: 'Minimalist interfaces crafted for trust and conversion',
    phase: 'Design',
    description:
      'High-clarity visual direction and interface design grounded in your brand identity. Every layout is crafted for readability, mobile ergonomics, and strong visual hierarchy before a single line of code ships.',
    deliverables: [
      'Information Architecture & Wireframes',
      'Custom Color & Typography System',
      'Desktop & Mobile Interactive Prototypes',
      'Conversion-Focused Landing Flows',
    ],
    timeline: '1–2 Weeks',
    idealFor: 'Studios, founders & businesses refreshing their digital identity',
    order: 2,
  },
  {
    id: 'business-institutional-websites',
    index: '03',
    title: 'Business & Institutional Websites',
    tagline: 'Authoritative digital presence for real estate, schools & studios',
    phase: 'Develop',
    description:
      'Purpose-built websites for real estate developers, architectural firms, schools, clinics, and wellness practices—structured to build instant credibility and route inquiries seamlessly.',
    deliverables: [
      'Multi-Page Responsive Website',
      'SEO Metadata & Fast Page Loads',
      'Project, Property, or Academic Showcases',
      'Lead Capture & Direct Call Links',
    ],
    timeline: '2–3 Weeks',
    idealFor: 'Real estate promoters, interior ateliers, schools & clinics',
    order: 3,
  },
  {
    id: 'ecommerce-booking-platforms',
    index: '04',
    title: 'E-Commerce & Online Booking Systems',
    tagline: 'Frictionless retail catalogs and appointment scheduling flows',
    phase: 'End-to-End',
    description:
      'Custom online storefronts and service booking platforms engineered for effortless mobile browsing, clear catalog organization, appointment slot selection, and real-time order or booking management.',
    deliverables: [
      'Product or Service Menu Architecture',
      'Category Filtering & Search Experience',
      'Appointment Booking or Cart Workflow',
      'Admin Order & Inventory Tracking',
    ],
    timeline: '3–5 Weeks',
    idealFor: 'Salons, wellness markets, retail brands & hospitality studios',
    order: 4,
  },
  {
    id: 'admin-panels-cms-portals',
    index: '05',
    title: 'Custom Admin Panels & Portals',
    tagline: 'Manage your projects, content, and inquiries without touching code',
    phase: 'Develop',
    description:
      'Dedicated cloud-backed admin dashboards with secure username/password authentication and hardened database rules, empowering your team to publish new listings, update services, and track customer inquiries in real time.',
    deliverables: [
      'Authenticated Admin Portal',
      'Real-Time Create, Edit & Delete Workflows',
      'Customer Inquiry Inbox & Status Tracking',
      'Hardened Database Security Rules',
    ],
    timeline: '1–3 Weeks',
    idealFor: 'Teams managing dynamic listings, portfolios & school/client portals',
    order: 5,
  },
  {
    id: 'online-classes-mentorship',
    index: '06',
    title: 'Online Classes & Technical Mentorship',
    tagline: 'Structured remote learning in web development & computer science',
    phase: 'Deliver',
    description:
      'Guided online classes and practical mentoring rooted in college and school teaching experience—helping students and beginners master programming logic, modern web design, and real project building.',
    deliverables: [
      'Live Interactive Online Sessions',
      'Web Design & Programming Foundations',
      'Hands-On Portfolio Project Reviews',
      'Exam & Career Readiness Guidance',
    ],
    timeline: 'Flexible Batches',
    idealFor: 'School/college students, BCA/MCA learners & aspiring developers',
    order: 6,
  },
];
