/**
 * Fields of study and the subjects within them.
 *
 * This list is the client's, not ours. Two editorial rules came with it and
 * both are deliberate:
 *
 *   - Subjects that are not pursued in Ghana are left off entirely.
 *   - Subjects that are a poor idea to study abroad are left off even where
 *     Turkish universities teach them. Law is the clearest case: a Turkish law
 *     degree does not transfer to a Ghanaian or Nigerian bar, so listing it
 *     would be selling somebody four years they cannot use.
 *
 * No university is named anywhere in here. We publish what can be studied, not
 * whose campus it happens on, because presenting institutions we hold no
 * written agreement with promotes them at the expense of the ones we do
 * (MASTERPLAN §3.1 makes the same point about logo walls).
 *
 * Run: npx tsx scripts/seed-fields.ts
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const REVIEWED = "2026-08-01";

for (const dir of ["content/fields"]) {
  const full = join(ROOT, dir);
  if (existsSync(full)) rmSync(full, { recursive: true });
  mkdirSync(full, { recursive: true });
}

type Field = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  subjects: string[];
  mastersSubjects?: string[];
};

const FIELDS: Field[] = [
  {
    slug: "medicine-and-healthcare",
    name: "Medicine and Healthcare",
    icon: "Stethoscope",
    description:
      "The largest field we place into, and the most competitive. Science subject grades matter more here than the overall aggregate.",
    subjects: [
      "Medicine",
      "Dentistry",
      "Pharmacy",
      "Nursing",
      "Physiotherapy and Rehabilitation",
      "Nutrition and Dietetics",
      "Midwifery",
      "Occupational Therapy",
      "Audiology",
      "Speech and Language Therapy",
      "Health Management",
      "Biomedical Engineering",
      "Molecular Biology and Genetics",
      "Genetics and Bioengineering",
      "Medical and Health Sciences",
      "Sports Sciences",
      "Sports Management",
      "Coaching",
      "Recreation",
    ],
    mastersSubjects: [
      "Public Health",
      "Health Management",
      "Health Economics",
      "Health Informatics",
      "Nursing",
      "Nutrition and Dietetics",
      "Physiotherapy and Rehabilitation",
      "Midwifery",
      "Audiology",
      "Occupational Therapy",
      "Speech and Language Therapy",
      "Medical Pharmacology",
      "Clinical Pharmacy",
      "Pharmacology",
      "Pharmaceutical Chemistry",
      "Pharmaceutical Toxicology",
      "Pharmacognosy",
      "Drug Research and Development",
      "Medical Biochemistry",
      "Medical Microbiology",
      "Medical Biology",
      "Molecular Medicine",
      "Cellular and Molecular Medicine",
      "Medical Physiology",
      "Histology and Embryology",
      "Neuroscience",
      "Biomedical Sciences",
      "Biotechnology",
      "Genetics and Bioengineering",
      "Health Systems Engineering",
      "Occupational Safety and Health",
      "Clinical Psychology",
      "Orthotics and Prosthetics",
      "Oral and Maxillofacial Surgery",
      "Orthodontics",
      "Periodontology",
      "Pedodontics",
      "Oral Implantology",
      "Prosthodontics",
      "Endodontics",
      "Restorative Dentistry",
    ],
  },
  {
    slug: "engineering-and-technology",
    name: "Engineering and Technology",
    icon: "Cog",
    description:
      "Widely taught in English, with strong laboratory and project components. The most portable set of qualifications on this list.",
    subjects: [
      "Computer Engineering",
      "Software Engineering and Software Development",
      "Artificial Intelligence Engineering",
      "Electrical and Electronics Engineering",
      "Biomedical Engineering",
      "Civil Engineering",
      "Mechanical Engineering",
      "Industrial Engineering",
      "Chemical Engineering",
      "Mechatronics Engineering",
      "Environmental Engineering",
      "Food Engineering",
      "Materials Science and Nanotechnology Engineering",
      "Genetics and Bioengineering",
      "Information Systems and Technologies",
      "Information Security Technology",
      "Management Information Systems",
      "Mathematics",
      "Physics",
    ],
  },
  {
    slug: "business-economics-and-finance",
    name: "Business, Economics and Finance",
    icon: "Briefcase",
    description:
      "Broad entry requirements relative to health sciences, and directly useful for families already trading between Türkiye and West Africa.",
    subjects: [
      "Business Administration",
      "International Business",
      "International Business and Trade",
      "International Trade and Finance",
      "International Finance",
      "Economics",
      "Finance",
      "Management Information Systems",
      "Logistics Management",
      "International Logistics",
      "Human Resource Management",
      "Electronic Commerce and Management",
      "Tourism Management",
      "Agricultural Trade and Management",
      "Real Estate Development and Management",
      "Islamic Economics and Finance",
    ],
  },
  {
    slug: "social-sciences-and-humanities",
    name: "Social Sciences and Humanities",
    icon: "Users",
    description:
      "Check the recognition route at home before applying for anything leading to a regulated profession, psychology in particular.",
    subjects: [
      "Psychology",
      "International Relations",
      "Political Science",
      "Political Science and International Relations",
      "Sociology",
      "Public Administration",
      "History",
      "Philosophy",
      "Anthropology",
      "Islamic Studies",
      "English Language and Literature",
      "Translation and Interpreting",
      "Russian Language and Literature",
    ],
  },
  {
    slug: "communication-and-media",
    name: "Communication and Media",
    icon: "Radio",
    description:
      "Practical, portfolio-driven programmes. What you leave with matters more than the certificate.",
    subjects: [
      "Journalism",
      "Advertising Design and Communication",
      "Public Relations and Publicity",
      "Radio, Television and Film",
      "New Media and Communication",
      "Communication and Design",
    ],
  },
  {
    slug: "education",
    name: "Education",
    icon: "GraduationCap",
    description:
      "Teaching qualifications are registered nationally, so confirm your own country's route to the classroom before you apply.",
    subjects: [
      "Primary Education",
      "Preschool and Early Childhood Education",
      "Special Education",
      "Guidance and Psychological Counselling",
      "Mathematics Education",
      "Science Education",
      "Computer Education and Instructional Technology",
    ],
  },
  {
    slug: "agriculture-and-related",
    name: "Agriculture and Related Fields",
    icon: "Sprout",
    description:
      "Under-applied for and directly relevant to West African economies, which makes it worth a serious look.",
    subjects: [
      "Agricultural Trade and Management",
      "Plant and animal agricultural programmes",
      "Landscape Architecture",
    ],
  },
  {
    // Always last. A finder that cannot express "mine is not on this list"
    // pushes people into a wrong answer or out of the funnel entirely.
    slug: "other",
    name: "Something else, tell us what",
    icon: "HelpCircle",
    description:
      "Not everything is on this list, and some things are deliberately left off because they do not transfer home well. Tell us what you want to study and we will tell you honestly whether it is worth doing here.",
    subjects: [],
  },
];

for (const field of FIELDS) {
  writeFileSync(
    join(ROOT, "content/fields", `${field.slug}.json`),
    JSON.stringify(
      {
        name: field.name,
        placeholder: true,
        reviewedOn: REVIEWED,
        icon: field.icon,
        description: field.description,
        subjects: field.subjects,
        mastersSubjects: field.mastersSubjects ?? [],
      },
      null,
      2
    ) + "\n"
  );
}

const totalSubjects = FIELDS.reduce(
  (n, f) => n + f.subjects.length + (f.mastersSubjects?.length ?? 0),
  0
);
console.log(`✅ ${FIELDS.length} fields, ${totalSubjects} subjects written.`);
