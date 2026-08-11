/**
 * Navigation structure (MASTERPLAN §2.2, §2.3, HANDOVER §1.8).
 *
 * Seven slots, one of which is a button. Skills Academy holds its own
 * top-level slot rather than being buried inside Services: navigation clarity
 * across an unequal set of divisions was the original brief, and the previous
 * four-slot nav lost it.
 *
 * The four mega-menu column headers are the student's actual sequence of
 * questions, not a taxonomy of our services. That ordering is the whole point.
 */

export type NavLink = { label: string; href: string };
export type NavColumn = { heading: string; links: NavLink[] };

export type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "mega"; label: string; columns: NavColumn[]; promo?: Promo }
  | { kind: "dropdown"; label: string; links: NavLink[] };

export type Promo = {
  heading: string;
  lines: string[];
  cta: NavLink;
};

export const STUDY_MEGA_MENU: NavColumn[] = [
  {
    heading: "Start here",
    links: [
      { label: "Why Türkiye", href: "/why-turkiye" },
      { label: "Entry requirements", href: "/entry-requirements" },
      { label: "From Ghana", href: "/from/ghana" },
      { label: "Ghana community", href: "/from/ghana/community" },
      { label: "From Nigeria", href: "/from/nigeria" },
    ],
  },
  {
    heading: "Choose",
    links: [
      { label: "What you can study", href: "/programs" },
      { label: "Student stories", href: "/stories" },
    ],
  },
  {
    heading: "Pay for it",
    links: [
      { label: "Tuition and costs", href: "/costs" },
      { label: "Scholarships", href: "/scholarships" },
    ],
  },
  {
    // Visa sits in its own column rather than under "after you arrive",
    // because the visa is applied for at home before departure. Grouping it
    // with arrival topics implied a sequence that is the wrong way round.
    heading: "Process",
    links: [
      { label: "Application process", href: "/application-process" },
      { label: "Visa and residence", href: "/visa-and-residence" },
    ],
  },
  {
    heading: "After you arrive",
    links: [
      { label: "Accommodation", href: "/accommodation" },
      { label: "Health insurance", href: "/health-insurance" },
      { label: "Student support", href: "/student-support" },
    ],
  },
];

export const STUDY_PROMO: Promo = {
  heading: "Free eligibility check",
  lines: ["Nine questions", "About two minutes", "No documents needed yet"],
  cta: { label: "Start", href: "/eligibility" },
};

export const NAV_ITEMS: NavItem[] = [
  {
    kind: "mega",
    label: "Study in Türkiye",
    columns: STUDY_MEGA_MENU,
    promo: STUDY_PROMO,
  },
  {
    kind: "dropdown",
    label: "Skills Academy",
    links: [
      { label: "All courses", href: "/skills-academy" },
      { label: "Corporate training", href: "/skills-academy" },
    ],
  },
  {
    kind: "dropdown",
    label: "Services",
    links: [
      { label: "All services", href: "/services" },
      { label: "Business consultancy", href: "/services/business-consultancy" },
      { label: "Import and export advisory", href: "/services/import-export-advisory" },
      { label: "Book publishing", href: "/services/book-publishing" },
      { label: "Printing", href: "/services/printing" },
      { label: "Educational materials", href: "/services/educational-materials" },
      { label: "School supplies", href: "/services/school-supplies" },
    ],
  },
  { kind: "link", label: "Insights", href: "/insights" },
  {
    kind: "dropdown",
    label: "About",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Team", href: "/about/team" },
      { label: "Offices", href: "/about/offices" },
      { label: "Partners and accreditation", href: "/about/partners" },
      { label: "Careers", href: "/about/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const FOOTER_COLUMNS: NavColumn[] = [
  {
    heading: "Minaret Educational Consultancy",
    links: [
      { label: "Why Türkiye", href: "/why-turkiye" },
      { label: "What you can study", href: "/programs" },
      { label: "Scholarships", href: "/scholarships" },
      { label: "Tuition and costs", href: "/costs" },
      { label: "Application process", href: "/application-process" },
      { label: "Entry requirements", href: "/entry-requirements" },
      { label: "Visa and residence", href: "/visa-and-residence" },
      { label: "Health insurance", href: "/health-insurance" },
      { label: "Student support", href: "/student-support" },
    ],
  },
  {
    heading: "More from Minaret",
    links: [
      { label: "Skills Academy", href: "/skills-academy" },
      { label: "Business consultancy", href: "/services/business-consultancy" },
      { label: "Import and export", href: "/services/import-export-advisory" },
      { label: "Publishing and printing", href: "/services/book-publishing" },
      { label: "School supplies", href: "/services/school-supplies" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Team", href: "/about/team" },
      { label: "Offices", href: "/about/offices" },
      { label: "Partners", href: "/about/partners" },
      { label: "Careers", href: "/about/careers" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Terms", href: "/legal/terms" },
  { label: "KVKK notice", href: "/legal/kvkk" },
];
