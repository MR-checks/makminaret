/**
 * Seed content generator.
 *
 * Writes every /content entry against the schema in keystatic.config.ts.
 *
 * Everything this produces is tagged `placeholder: true` (HANDOVER §3.2) and
 * therefore appears in content/PLACEHOLDERS.md as a swap checklist. The prose
 * is written to be structurally realistic so the pages can be judged at full
 * length, while deliberately avoiding checkable assertions: no rankings, no
 * student counts, no fee figures, no dates. Those are exactly the claims that
 * would be wrong if published, and §4.1 rules most of them out permanently.
 *
 * Fields of study live in scripts/seed-fields.ts, which also carries the
 * subject lists. Universities and university-specific programmes are no longer
 * generated at all: only institutions we hold a written agreement with may be
 * named, and we had none to name.
 *
 * Run: npx tsx scripts/seed-content.ts
 */

import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const REVIEWED = "2026-08-01";

type Block = Record<string, unknown>;
const p = (text: string): Block => ({ type: "paragraph", children: [{ text }] });
const h = (text: string, level = 2): Block => ({
  type: "heading",
  level,
  children: [{ text }],
});
const doc = (...blocks: Block[]) => blocks;

function write(dir: string, slug: string, data: unknown) {
  mkdirSync(join(ROOT, dir), { recursive: true });
  writeFileSync(join(ROOT, dir, `${slug}.json`), JSON.stringify(data, null, 2) + "\n");
}

// Wipe the collection directories before writing rather than after. Removing
// stale files at the end deletes freshly written entries wherever an old slug
// matches a new one, which is exactly what happened on the first run.
for (const dir of [
  "content/scholarships",
  "content/stories",
  "content/articles",
  "content/countries",
  "content/services",
]) {
  const full = join(ROOT, dir);
  if (existsSync(full)) rmSync(full, { recursive: true });
}

// ── Scholarships ────────────────────────────────────────────

write("content/scholarships", "turkiye-burslari", {
  name: "Türkiye Bursları",
  placeholder: true,
  reviewedOn: REVIEWED,
  type: "government",
  provider: "Republic of Türkiye",
  coverageBand:
    "Full tuition, accommodation, monthly stipend, health insurance and one return flight",
  coversTuition: true,
  coversAccommodation: true,
  coversStipend: true,
  eligibility: doc(
    p(
      "Türkiye Bursları is the Turkish government scholarship programme. It is the most generous funding available to international students in Türkiye, and correspondingly the most competitive. Applicants are assessed on academic record, and the process includes an interview stage for shortlisted candidates."
    ),
    p(
      "It is a full scholarship rather than a tuition discount. Successful applicants are placed at a university by the programme rather than choosing freely, which is the trade-off for the level of funding."
    ),
    p(
      "Placeholder entry. The eligibility detail here is written to a realistic shape and must be checked against the official programme before publication."
    )
  ),
  applicationWindowNote:
    "The application window opens once a year and runs for a fixed period. We do not publish the dates here because they move, and a stale deadline on this page would be worse than no deadline at all. Check the official site for the current window, and talk to us well before it opens, because a strong application takes weeks to assemble rather than days.",
  officialUrl: "https://www.turkiyeburslari.gov.tr/",
  howWeHelp:
    "We review whether your record is genuinely competitive before you invest time in the application, help assemble the document set, and prepare you for the interview stage. We will tell you if we think your time is better spent on a university tuition waiver instead.",
  seo: { title: "", description: "" },
});

write("content/scholarships", "university-merit-waivers", {
  name: "University merit waivers",
  placeholder: true,
  reviewedOn: REVIEWED,
  type: "university",
  provider: "Individual universities",
  coverageBand: "25% to 75% of tuition, varying by university and programme",
  coversTuition: true,
  coversAccommodation: false,
  coversStipend: false,
  eligibility: doc(
    p(
      "Most Turkish foundation universities operate their own tuition waivers, awarded on academic record at the point of admission. These are far more attainable than the government scholarship, and this is where the majority of our students actually receive funding."
    ),
    p(
      "A waiver reduces tuition and nothing else. Accommodation, living costs, the residence permit, health insurance and travel remain the student's responsibility, and a 50% waiver on a high tuition figure can still leave a larger total than full tuition at a cheaper institution. Compare the total, not the percentage."
    ),
    p(
      "Placeholder entry. Waiver levels vary by university, by programme and by intake, and the specific figures must be confirmed per institution before publication."
    )
  ),
  applicationWindowNote:
    "These are awarded on a rolling basis as part of the admission decision rather than through a separate application with its own deadline. Applying earlier in the cycle generally helps, because waiver budgets are finite.",
  officialUrl: "",
  howWeHelp:
    "We know which universities discount most readily for the grade profile you have, and we apply to a shortlist rather than to a single institution, which is what puts you in a position to compare offers.",
  seo: { title: "", description: "" },
});

// ── Countries ───────────────────────────────────────────────

write("content/countries", "ghana", {
  name: "Ghana",
  placeholder: true,
  reviewedOn: REVIEWED,
  isoCode: "GH",
  dialCode: "+233",
  secondaryCertificate: "WASSCE / WAEC",
  certificateNotes: doc(
    p(
      "WASSCE results are a recognised route into Turkish universities, subject to denklik. Aggregate matters less than most applicants expect, and subject grades matter more, particularly for health sciences where biology and chemistry are looked at directly."
    ),
    p(
      "Placeholder entry. The grade mapping used here must be confirmed against current practice before publication."
    )
  ),
  denklikRoute: doc(
    p(
      "Denklik is the Turkish recognition of a foreign secondary qualification. It is the step that delays more applications than any other, and it runs in parallel with the university application rather than after it."
    ),
    p(
      "The process requires the original certificate and transcript, authenticated in Ghana before they are submitted in Türkiye. Starting it late is the single most common reason a student misses an intake."
    )
  ),
  denklikTimingNote:
    "Denklik typically takes several weeks rather than days, and the range is wide enough that planning to the optimistic end is a mistake. Start it as early as your results allow.",
  authenticationOffice: {
    name: "Ministry of Foreign Affairs and Regional Integration",
    address: "Accra",
    process:
      "Original WAEC certificate and transcript are submitted for verification and stamping. Do not laminate documents before they are stamped.",
    timingNote:
      "Turnaround varies by season and by volume. Allow more time than the counter estimate, particularly in the months after results are released.",
  },
  turkishEmbassy: {
    city: "Accra",
    address: "Placeholder. Confirm the current embassy address before publication.",
    appointmentNotes:
      "Student visa appointments are booked in advance and availability tightens considerably in the months before the September intake. Book as soon as your acceptance letter is issued rather than waiting until the documents are complete.",
  },
  flightRoutings: doc(
    p(
      "Accra has reasonable connections to Istanbul, with onward domestic connections to other Turkish cities. Fares vary widely by season and by how far in advance the ticket is booked."
    )
  ),
  seo: { title: "", description: "" },
});

write("content/countries", "nigeria", {
  name: "Nigeria",
  placeholder: true,
  reviewedOn: REVIEWED,
  isoCode: "NG",
  dialCode: "+234",
  secondaryCertificate: "WAEC / NECO / SSCE",
  certificateNotes: doc(
    p(
      "WAEC, NECO and SSCE results are recognised routes, subject to denklik. Where a student holds results from more than one sitting, the combination needs handling carefully, and it is worth raising early rather than at submission."
    ),
    p(
      "Placeholder entry. Confirm current practice on combined sittings before publication."
    )
  ),
  denklikRoute: doc(
    p(
      "Denklik is the Turkish recognition of a foreign secondary qualification, and it is the step most likely to delay a Nigerian application. It runs alongside the university application rather than after it."
    ),
    p(
      "Certificates are authenticated in Nigeria before submission in Türkiye. Where results come from multiple sittings, expect additional scrutiny."
    )
  ),
  denklikTimingNote:
    "Denklik typically takes several weeks, and the range is wide. Applications with results from more than one sitting generally take longer than single-sitting applications.",
  authenticationOffice: {
    name: "Ministry of Foreign Affairs",
    address: "Abuja",
    process:
      "Certificates and transcripts are authenticated before submission. Confirm the current document list directly, as requirements are revised periodically.",
    timingNote:
      "Turnaround varies considerably. Allow substantially more time than the minimum quoted at the counter.",
  },
  turkishEmbassy: {
    city: "Abuja",
    address: "Placeholder. Confirm the current embassy address before publication.",
    appointmentNotes:
      "Student visa appointments are booked in advance and become scarce ahead of the September intake. Book as soon as the acceptance letter is issued.",
  },
  flightRoutings: doc(
    p(
      "Lagos and Abuja both have connections to Istanbul, with onward domestic connections within Türkiye. Fares vary widely by season and booking lead time."
    )
  ),
  seo: { title: "", description: "" },
});

// ── Stories: unnamed placeholder cards ──────────────────────
// HANDOVER §3.6: no stock photo of a person may be captioned as a Minaret
// student, and no fake name is used. These carry no name and no photograph.

const stories = [
  {
    slug: "placeholder-story-engineering",
    country: "ghana",
    quote:
      "Placeholder story. This card is deliberately unnamed and carries no photograph. It will be replaced with a real student account, published with written consent, a real name and a real photograph, or removed entirely.",
  },
  {
    slug: "placeholder-story-health",
    country: "nigeria",
    quote:
      "Placeholder story. This card is deliberately unnamed and carries no photograph. It will be replaced with a real student account, published with written consent, a real name and a real photograph, or removed entirely.",
  },
];
for (const s of stories) {
  write("content/stories", s.slug, {
    title: "Placeholder student story",
    placeholder: true,
    reviewedOn: REVIEWED,
    studentName: "",
    homeCountry: s.country,
    // No university or programme reference: we only name institutions we hold
    // a written agreement with, and a story does not need one to be true.
    university: null,
    program: null,
    quote: doc(p(s.quote)),
    consentOnFile: false,
    featured: true,
  });
}

// ── Services: the six non-education divisions (MASTERPLAN §2.4) ──

const services = [
  [
    "business-consultancy",
    "Business Consultancy",
    "Minaret Business Solutions",
    "Company formation in Türkiye, market entry advisory, supplier verification and trade documentation.",
    "Businesses outside Türkiye that want a presence, a supplier, or a route to market inside it.",
    [
      "Company formation in Türkiye",
      "Market entry advisory",
      "Supplier verification and sourcing",
      "Trade documentation",
    ],
  ],
  [
    "import-export-advisory",
    "Import and Export Advisory",
    "Minaret Business Solutions",
    "Sourcing, factory verification, quality inspection and freight coordination between Türkiye and West Africa.",
    "Importers who need someone physically present at the supplier rather than an intermediary working from a catalogue.",
    [
      "Sourcing agent services",
      "Factory verification",
      "Quality inspection",
      "Freight coordination",
      "Customs documentation",
    ],
  ],
  [
    "book-publishing",
    "Book Publishing",
    "Minaret Publishing & Printing",
    "Book publishing including ISBN registration, layout and print runs, alongside commercial printing.",
    "Authors, schools and institutions that need print production handled end to end.",
    ["Book publishing, ISBN and layout", "Print runs", "Commercial printing"],
  ],
  [
    "printing",
    "Printing",
    "Minaret Publishing & Printing",
    "Commercial printing for institutions, from short runs to bulk production.",
    "Schools, businesses and organisations with recurring print requirements.",
    ["Commercial printing", "Short and bulk runs", "Finishing and binding"],
  ],
  [
    "educational-materials",
    "Educational Materials",
    "Minaret School Supplies",
    "Development and supply of educational materials for schools and training providers.",
    "Schools and training providers specifying materials for a curriculum.",
    [
      "Educational materials development",
      "Curriculum-aligned supply",
      "Institutional quantities",
    ],
  ],
  [
    "school-supplies",
    "School Supplies",
    "Minaret School Supplies",
    "Bulk supply and procurement for schools, including laboratory and library equipment.",
    "School owners and administrators handling procurement.",
    [
      "Bulk supply to schools",
      "Laboratory equipment",
      "Library equipment",
      "Institutional procurement",
    ],
  ],
];

for (const [slug, title, division, summary, whoFor, items] of services as [
  string,
  string,
  string,
  string,
  string,
  string[],
][]) {
  write("content/services", slug, {
    title,
    placeholder: true,
    reviewedOn: REVIEWED,
    division,
    summary,
    whoItIsFor: whoFor,
    serviceItems: items,
    whatWeDo: doc(
      p(summary),
      p(
        "Placeholder page. The capability described here is real in outline, but the detail, the case example and the process below must be confirmed with the division before this page goes live."
      ),
      p(
        "We work from Ankara, which means the verification and coordination steps happen where the supplier or the printer actually is, rather than being passed to a third party and reported back."
      )
    ),
    process: [
      {
        title: "Enquiry",
        description:
          "You tell us what you need and the constraints you are working within.",
      },
      {
        title: "Scope and quote",
        description:
          "We come back with what is achievable, what it involves, and what it costs.",
      },
      {
        title: "Delivery",
        description:
          "We carry out the work and report on it directly rather than through an intermediary.",
      },
    ],
    seo: { title: "", description: "" },
  });
}

// ── Articles: evergreen explainers only (HANDOVER §4.1) ─────

const articles = [
  [
    "what-denklik-is-and-why-it-takes-so-long",
    "What denklik is, and why it takes so long",
    "visa-and-residence",
    "Denklik is the Turkish recognition of a foreign secondary qualification, and it delays more applications than any other single step. This explains what it is, what it needs, and why it is worth starting early.",
    [
      "Denklik is the process by which Türkiye recognises a secondary school qualification issued in another country. Without it, an acceptance letter cannot become an enrolment.",
      "The reason it delays applications is structural rather than bureaucratic obstruction. The certificate has to be authenticated in the issuing country first, which is a separate process with its own queue, and only then can it be submitted in Türkiye.",
      "Placeholder article. The process description here is written to a realistic shape and must be verified against current practice before publication.",
    ],
  ],
  [
    "what-wassce-and-waec-results-mean-for-turkish-admission",
    "What WASSCE and WAEC results mean for Turkish admission",
    "study-in-turkiye",
    "How West African secondary results are read by Turkish universities, why subject grades matter more than the aggregate, and what that means for competitive programmes.",
    [
      "Turkish universities read a West African secondary certificate through denklik, and then assess it against the requirements of the specific programme applied for.",
      "The most common misunderstanding is that the aggregate is what counts. For competitive programmes, particularly in health sciences, individual subject grades in biology, chemistry and mathematics carry more weight than the overall result.",
      "Placeholder article. The grade mapping described here must be confirmed before publication.",
    ],
  ],
  [
    "state-versus-private-universities-in-turkiye",
    "State versus private universities in Türkiye",
    "university-guides",
    "The practical differences between state and foundation universities in Türkiye: cost, language of instruction, admission route, and who each one actually suits.",
    [
      "The headline difference is cost. State university tuition sits far below private tuition, and for many families that alone decides the question.",
      "The less obvious differences matter too. State universities more often teach in Turkish, which means a language year for most international students, and their admission routes more often involve an entrance examination.",
      "Placeholder article. The comparison here is written to a realistic shape and must be verified before publication.",
    ],
  ],
];

for (const [slug, title, category, excerpt, paras] of articles as [
  string,
  string,
  string,
  string,
  string[],
][]) {
  write("content/articles", slug, {
    title,
    placeholder: true,
    reviewedOn: REVIEWED,
    excerpt,
    category,
    body: doc(...paras.map((t) => p(t))),
    seo: { title: "", description: "" },
  });
}

// ── Settings and navigation ─────────────────────────────────
// Real values are the four the user confirmed. Everything else is tagged.

writeFileSync(
  join(ROOT, "content/settings.json"),
  JSON.stringify(
    {
      brandName: "Minaret",
      legalName: "MAK Minaret",
      primaryPhone: "+233 53 979 9795",
      whatsappNumber: "233539799795",
      officePhone: "",
      email: "info@makminaret.com",
      registrationNumber: "",
      officeAddress: ["Ankara", "Türkiye"],
      officeMapsUrl: "",
      officeHours: "09:00 to 18:00 GMT+3",
      responseTimePromise: "We reply within 4 working hours.",
      socials: [
        { label: "Facebook", url: "https://www.facebook.com/share/14jBjefQzit/" },
      ],
      placeholderFields: [
        "legalName",
        "registrationNumber",
        "officeAddress",
        "officePhone",
      ],
    },
    null,
    2
  ) + "\n"
);

console.log("✅ Seed content written. Every entry is tagged placeholder: true.");
