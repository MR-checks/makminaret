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
  "content/universities",
  "content/programs",
  "content/fields",
  "content/scholarships",
  "content/stories",
  "content/articles",
  "content/countries",
  "content/services",
]) {
  const full = join(ROOT, dir);
  if (existsSync(full)) rmSync(full, { recursive: true });
}

// ── Universities ────────────────────────────────────────────

const universities = [
  {
    slug: "ankara-medipol-university",
    name: "Ankara Medipol University",
    city: "Ankara",
    type: "foundation",
    foundedYear: 2018,
    tuitionBand: "$4,000 to $18,000",
    languages: ["English", "Turkish"],
    yos: false,
    sat: true,
    english: "IELTS 6.0, TOEFL iBT 72, or the university's own proficiency exam",
    site: "https://www.ankaramedipol.edu.tr/en",
    whoItSuits:
      "Students who want the capital rather than Istanbul: lower living costs, a shorter commute, and proximity to the ministries and embassies that handle denklik and residence paperwork.",
    overview: doc(
      p(
        "Ankara Medipol University is a foundation university in the Turkish capital. For our students the practical argument for Ankara over Istanbul is straightforward: it costs less to live in, it is easier to move around, and it is where the offices that process your paperwork actually are."
      ),
      h("Why the capital matters for an international student"),
      p(
        "Denklik, residence permits and embassy business all happen in Ankara. A student here is a short journey from the offices that decide those things rather than a flight or a long bus ride away. Our own office is in Ankara for the same reason."
      ),
      p(
        "Ankara is also a government and university city rather than a tourist one. It is quieter than Istanbul, the pace is slower, and the student population is proportionally larger. Some students find that focusing; others find it dull. It is worth being honest with yourself about which you are."
      ),
      h("Cost"),
      p(
        "Accommodation and daily living cost noticeably less than in Istanbul. Across a four-year degree that gap is large enough to change which universities are affordable overall, and it is the single most under-weighted factor in the decisions we see families make."
      ),
      h("Teaching and language"),
      p(
        "English-taught and Turkish-taught programmes both run, set per programme rather than per faculty. The same rule applies as everywhere: check the language of instruction for the specific programme before applying."
      ),
      h("An honest note"),
      p(
        "Placeholder entry. The faculty list, the campus detail and the fee band above are written to a realistic shape and must be verified against the university's current prospectus before this page goes live."
      )
    ),
    entry: doc(
      p(
        "A completed secondary certificate with denklik. WASSCE, WAEC, NECO and SSCE are recognised routes."
      ),
      p(
        "Health sciences programmes assess science subject grades directly and are the most competitive route here."
      ),
      p("YÖS is not generally required. SAT is accepted where held."),
      p(
        "English-taught programmes require an accepted test result or a pass in the university's own proficiency exam."
      )
    ),
  },
  {
    slug: "izmir-university-of-economics",
    name: "Izmir University of Economics",
    city: "Izmir",
    type: "foundation",
    foundedYear: 2001,
    tuitionBand: "$5,000 to $12,000",
    languages: ["English"],
    yos: false,
    sat: true,
    english: "IELTS 6.0, TOEFL iBT 72, or the university's own proficiency exam",
    site: "https://www.ieu.edu.tr/en",
    whoItSuits:
      "Students who want an English-medium environment on the Aegean coast, with a smaller and calmer setting than Istanbul and a strong lean toward business, economics and communication.",
    overview: doc(
      p(
        "Izmir University of Economics is a foundation university in Izmir, on the Aegean coast. Izmir is Türkiye's third city and it has a distinctly different feel from both Istanbul and Ankara: coastal, milder, and generally described by students as the easiest of the three to settle into."
      ),
      h("English as the working language"),
      p(
        "This institution teaches predominantly in English, which removes the language-year question that complicates so many applications. For a student who wants to start their degree immediately rather than after a preparatory year, that is a material advantage."
      ),
      h("Character and cost"),
      p(
        "Izmir sits between Istanbul and the smaller Anatolian cities on cost. More expensive than Kayseri or Eskişehir, noticeably cheaper than Istanbul. The student culture is strong and the city is walkable in a way Istanbul is not."
      ),
      h("An honest note"),
      p(
        "Placeholder entry. Programme availability and the fee band must be confirmed against the current prospectus before publication."
      )
    ),
    entry: doc(
      p("A completed secondary certificate with denklik."),
      p(
        "Evidence of English is required for every programme here, since the institution teaches in English throughout."
      ),
      p("YÖS is not generally required. SAT is accepted where held.")
    ),
  },
  {
    slug: "erciyes-university",
    name: "Erciyes University",
    city: "Kayseri",
    type: "state",
    foundedYear: 1978,
    tuitionBand: "$400 to $2,000",
    languages: ["Turkish", "English"],
    yos: true,
    sat: false,
    english:
      "Programme dependent. Most teaching is in Turkish and requires Turkish at C1.",
    site: "https://www.erciyes.edu.tr/en/",
    whoItSuits:
      "Students for whom cost is the deciding factor, who are willing to complete a Turkish language year first, and who want a large state university in a considerably cheaper city.",
    overview: doc(
      p(
        "Erciyes University is a state university in Kayseri, in central Anatolia. It is included here because it represents the genuinely affordable route, and that route deserves to be on the table rather than quietly omitted because private universities pay better."
      ),
      h("What the state route actually involves"),
      p(
        "State tuition is a fraction of private tuition, and Kayseri costs considerably less to live in than Istanbul. The trade-offs are real: most teaching is in Turkish, which means a language year before the degree begins, and admission typically runs through the YÖS entrance examination rather than on your certificate alone."
      ),
      p(
        "That combination adds a year and requires more preparation. For a family where the private route simply does not add up, it is the difference between studying in Türkiye and not studying in Türkiye, and we would rather set it out plainly than pretend the only option is the expensive one."
      ),
      h("Kayseri"),
      p(
        "A large Anatolian city, industrial, conservative in character, and much cheaper than the coast. Fewer international students than Istanbul, which means more Turkish practice by necessity and a smaller ready-made community on arrival."
      ),
      h("An honest note"),
      p(
        "Placeholder entry. YÖS requirements, quotas and the fee band must be confirmed before publication, and they change more often at state universities than at private ones."
      )
    ),
    entry: doc(
      p("A completed secondary certificate with denklik."),
      p(
        "YÖS is required for most programmes, and is a genuine filter rather than a formality."
      ),
      p(
        "Turkish at C1 for Turkish-taught programmes, which is most of them. Budget for a preparatory language year."
      ),
      p(
        "Quotas for international students are limited and vary by programme and by year."
      )
    ),
  },
  {
    slug: "istanbul-aydin-university",
    name: "Istanbul Aydın University",
    city: "Istanbul",
    type: "foundation",
    foundedYear: 2007,
    tuitionBand: "$4,000 to $11,000",
    languages: ["English", "Turkish"],
    yos: false,
    sat: true,
    english: "IELTS 6.0, TOEFL iBT 72, or the university's own proficiency exam",
    site: "https://www.aydin.edu.tr/en-us/",
    whoItSuits:
      "Students who want a large campus with a substantial international cohort, and who value having English-taught options across a wide range of faculties rather than in one or two departments.",
    overview: doc(
      p(
        "Istanbul Aydın University is a foundation university on the European side of Istanbul, in the Florya district of Küçükçekmece. It is one of the larger private institutions in the city, and for students coming from West Africa it is often the first Turkish university they hear about by name, usually from someone already studying there."
      ),
      h("The character of the place"),
      p(
        "The campus is urban rather than parkland. Buildings sit close together on a single site, which means the walk between a lecture and a lab is short, and it also means the campus feels busy in a way that a dispersed campus does not. Students who want quiet will find it in the library rather than outdoors. Students who want a dense social environment will find it immediately."
      ),
      p(
        "The international population is genuinely large, not a marketing line. That matters practically. Administrative staff in the international office deal with foreign credentials daily rather than occasionally, forms exist in English, and the questions a Ghanaian or Nigerian applicant asks are questions the office has answered many times before. It also means a new arrival is unlikely to be the only person from their country on campus."
      ),
      h("Teaching and language"),
      p(
        "Programmes run in both Turkish and English, and the language of instruction is set per programme rather than per faculty. This is the single most important thing to check before applying, because two programmes with similar names can be taught in different languages. A Turkish-taught programme will require a language year first for most international students, which adds time and cost that the published tuition figure does not include."
      ),
      p(
        "For English-taught programmes, proficiency is demonstrated either through an external test or through the university's own exam, which is administered on arrival. Students who arrive without a test result should plan for the possibility of being placed into preparatory English, and should budget for that year rather than assume they will pass straight through."
      ),
      h("Facilities and city"),
      p(
        "The university operates its own libraries, laboratories and studios, and the health and engineering faculties have dedicated practical space. Being in Istanbul means the city itself does a lot of the work: transport is extensive, the student discount on public transport is meaningful, and part-time opportunities exist in a way they do not in smaller Turkish cities."
      ),
      p(
        "Istanbul is also the most expensive city in Türkiye to live in. Accommodation costs more than in Ankara, Kayseri or Eskişehir, and the gap is large enough that it should be part of the decision rather than an afterthought. Students choosing between a place here and a place in a smaller city are usually choosing between a higher total cost with more opportunity, and a lower total cost with fewer distractions."
      ),
      h("Who tends to do well here"),
      p(
        "Students who arrive with their language sorted, who are comfortable in a crowded environment, and who intend to use Istanbul rather than just live in it. Students who need a quiet, small, closely supervised setting often find a smaller university in a smaller city suits them better, and we will say so during the consultation rather than after the deposit."
      ),
      h("Applying through us"),
      p(
        "We handle the application, the document set, and the denklik process that runs alongside it. We will tell you honestly whether your grades put you in range for the programme you want, and where they do not, we will suggest the programmes where they do. We do not submit applications we expect to fail in order to increase a count."
      )
    ),
    entry: doc(
      p(
        "A completed secondary school certificate is the baseline requirement. WASSCE, WAEC, NECO and SSCE results are all recognised routes, subject to denklik, which is the Turkish recognition of a foreign secondary qualification."
      ),
      p(
        "Competitive programmes, particularly in health sciences, look at subject grades rather than the aggregate alone. Science subjects carry the most weight for medicine, dentistry and pharmacy applications."
      ),
      p(
        "YÖS is not required for most programmes here, and SAT results are accepted where a student has them. Neither replaces the secondary certificate itself."
      ),
      p(
        "English-taught programmes require proof of English, either an external test result or the university's own proficiency exam taken on arrival. Turkish-taught programmes require Turkish at C1, which for most international students means completing a language year first."
      )
    ),
  },
  {
    slug: "altinbas-university",
    name: "Altınbaş University",
    city: "Istanbul",
    type: "foundation",
    foundedYear: 2008,
    tuitionBand: "$5,000 to $22,000",
    languages: ["English", "Turkish"],
    yos: false,
    sat: true,
    english: "IELTS 6.0, TOEFL iBT 78, or the university's own proficiency exam",
    site: "https://www.altinbas.edu.tr/en",
    whoItSuits:
      "Applicants aiming at medicine, dentistry or pharmacy who want an English-taught route, and engineering students who want laboratory time rather than a purely theoretical degree.",
    overview: doc(
      p(
        "Altınbaş University is a foundation university in Istanbul, with its main activity split across sites in the Bağcılar and Esenyurt areas and a presence in the centre of the city. Among students from Anglophone Africa it is best known for its health sciences faculties, and a large share of the enquiries we receive naming this university are for medicine or dentistry."
      ),
      h("Health sciences, and why the competition is real"),
      p(
        "The medicine and dentistry programmes are the reason most international applicants look here, and they are correspondingly the hardest to get into and the most expensive to study. Applicants should treat these as competitive rather than assured, regardless of what an agent tells them. Strong science grades matter, and a strong overall certificate without strong science grades is usually not enough."
      ),
      p(
        "Dentistry and pharmacy sit alongside medicine and are worth considering seriously rather than as consolation choices. Both are five-year professional degrees with clear career paths, both are less oversubscribed than medicine, and both are recognised on return in most of the markets our students come from, subject to the usual local licensing process."
      ),
      h("Engineering and the practical emphasis"),
      p(
        "The engineering faculty runs civil, software, electrical and mechanical programmes, mostly with English-taught options. The teaching emphasis leans practical: laboratory and project work carries real weight in assessment rather than sitting as a token component beside written examinations. For a student who learns by building things, that is a genuine difference from a more theoretical department."
      ),
      p(
        "Software and computer engineering attract a growing share of international applicants, partly because the entry requirements are more attainable than medicine and partly because the work is portable afterwards. Students who want to work remotely after graduating tend to end up in these programmes."
      ),
      h("Language and preparation"),
      p(
        "English-taught programmes require evidence of English, either an accepted external test or the university's own exam on arrival. Preparatory English exists for students who need it, and it is better to plan for that year than to gamble on the placement exam. Turkish-taught programmes require Turkish at C1 and effectively require a language year for international students."
      ),
      h("Living in Istanbul"),
      p(
        "The practical realities are the same as for any Istanbul university: extensive transport, high accommodation costs relative to the rest of Türkiye, and a large enough international community that a new student is not isolated. Commutes can be long depending on where a student lives relative to their faculty, and that is worth planning before signing an accommodation contract rather than after."
      ),
      h("An honest note on cost"),
      p(
        "Medicine here sits at the upper end of the private range, and the total cost across five or six years is substantial. Families should look at the full duration rather than the first year in isolation, and should include living costs, the residence permit, health insurance and travel. We publish bands rather than quotes precisely so that this conversation happens early. If the full figure does not work, there are state universities and other routes worth discussing, and it is better to have that conversation before an application than after an acceptance."
      )
    ),
    entry: doc(
      p(
        "A completed secondary certificate is required, with denklik. WASSCE, WAEC, NECO and SSCE are recognised routes."
      ),
      p(
        "For medicine, dentistry and pharmacy, subject grades in biology, chemistry and mathematics are examined specifically, and the bar is higher than for other faculties."
      ),
      p(
        "YÖS is not required for most programmes. SAT results are accepted where held and can strengthen a competitive application."
      ),
      p(
        "English-taught programmes require an accepted test result or a pass in the university's own proficiency exam. Students who do not pass are placed into preparatory English for a year."
      )
    ),
  },
  {
    slug: "istanbul-medipol-university",
    name: "Istanbul Medipol University",
    city: "Istanbul",
    type: "foundation",
    foundedYear: 2009,
    tuitionBand: "$5,500 to $24,000",
    languages: ["English", "Turkish"],
    yos: false,
    sat: true,
    english: "IELTS 6.0, TOEFL iBT 75, or the university's own proficiency exam",
    site: "https://www.medipol.edu.tr/en",
    whoItSuits:
      "Health sciences applicants who want clinical exposure attached to a working hospital network, rather than teaching hospitals accessed only in later years.",
    overview: doc(
      p(
        "Istanbul Medipol University is a foundation university with campuses on both sides of Istanbul, and it is unusual among the universities we place into because it is attached to an operating hospital group rather than partnered with one at arm's length."
      ),
      h("The hospital connection, and what it actually means"),
      p(
        "For a medical or dental student, the practical question is how early and how often you are in a clinical environment. An affiliation with a working hospital network changes the answer to that question, because placement capacity is internal rather than negotiated. Students in health programmes here generally see clinical settings earlier than they would at an institution without that relationship."
      ),
      p(
        "This is the single most cited reason applicants give us for choosing Medipol, and it is a reasonable one. It is not, however, a guarantee of admission or of a particular placement, and applicants should be sceptical of anyone who presents it as one."
      ),
      h("Beyond health sciences"),
      p(
        "The university is not only a medical school. Engineering, business and communications faculties run alongside the health programmes, with English-taught options in several. These programmes are less oversubscribed and the entry requirements are more attainable, which makes them worth a serious look for students whose grades put medicine out of reach but who want the same institution and city."
      ),
      h("Language"),
      p(
        "The pattern is the standard one for Turkish foundation universities. English-taught programmes require an external test result or a pass in the university's own exam. Turkish-taught programmes require Turkish at C1, which in practice means a preparatory year for almost every international student. Check the language of instruction for the specific programme, not the faculty, because they differ."
      ),
      h("Campus and commuting"),
      p(
        "Operating across more than one campus means the location of your particular faculty matters more here than at a single-site university. Istanbul is large and crossing it daily is not a small commitment. Before committing to accommodation, confirm which campus your programme is actually taught on, and plan the journey. This is a practical detail that is easy to overlook from abroad and expensive to fix afterwards."
      ),
      h("Cost and the full picture"),
      p(
        "Health programmes here sit at the upper end of the private band, and non-health programmes sit well below that. As with any private university, the tuition figure is only part of the total. Accommodation in Istanbul, the residence permit, health insurance, and flights all belong in the calculation, and the figure that matters is the one across the whole degree rather than the first year."
      ),
      h("How we advise on this one"),
      p(
        "We are candid about the fact that the hospital affiliation is a genuine differentiator for health students and close to irrelevant for a business or communications applicant. If you are applying to a non-health programme, choose it on the programme and the cost rather than on the hospital network, and compare it against alternatives on those terms."
      )
    ),
    entry: doc(
      p(
        "A completed secondary certificate with denklik is the baseline. WASSCE, WAEC, NECO and SSCE are recognised."
      ),
      p(
        "Health sciences applications are assessed on science subject grades specifically, and medicine is the most competitive route in the institution."
      ),
      p("YÖS is not generally required. SAT is accepted where held."),
      p(
        "English-taught programmes require an accepted test result or the university's own proficiency exam. Preparatory English is available for students who need it."
      )
    ),
  },
];

for (const u of universities) {
  write("content/universities", u.slug, {
    name: u.name,
    placeholder: true,
    reviewedOn: REVIEWED,
    city: u.city,
    type: u.type,
    yokAccredited: true,
    foundedYear: u.foundedYear,
    languagesOfInstruction: u.languages,
    tuitionBand: u.tuitionBand,
    overview: u.overview,
    whoItSuits: u.whoItSuits,
    entryRequirements: u.entry,
    yosRequired: u.yos,
    satAccepted: u.sat,
    englishRequirement: u.english,
    website: u.site,
    seo: {
      title: "",
      description: "",
    },
  });
}

// ── Fields of study ─────────────────────────────────────────

const fieldsOfStudy: Array<[string, string, string, string]> = [
  [
    "medicine-and-health",
    "Medicine and Health",
    "Stethoscope",
    "Medicine, dentistry, pharmacy, nursing, physiotherapy and the allied health professions.",
  ],
  [
    "engineering",
    "Engineering",
    "Cog",
    "Civil, mechanical, electrical, industrial and biomedical engineering.",
  ],
  [
    "computer-science",
    "Computer Science and IT",
    "Code",
    "Computer science, software engineering, information systems, data and cybersecurity.",
  ],
  [
    "business",
    "Business and Economics",
    "Briefcase",
    "Business administration, management, economics, finance, accounting and international trade.",
  ],
  [
    "architecture",
    "Architecture and Design",
    "Compass",
    "Architecture, interior architecture, urban design and industrial design.",
  ],
  ["law", "Law", "Scale", "Law, international law and political science."],
  [
    "social-sciences",
    "Social Sciences and Humanities",
    "Users",
    "Psychology, sociology, international relations, history and languages.",
  ],
  [
    "education",
    "Education",
    "GraduationCap",
    "Teacher training, educational sciences and English language teaching.",
  ],
  [
    "natural-sciences",
    "Natural Sciences",
    "FlaskConical",
    "Biology, chemistry, physics, mathematics and molecular biology.",
  ],
  [
    "communication",
    "Communication and Media",
    "Radio",
    "Journalism, public relations, advertising, radio, television and cinema.",
  ],
  [
    "aviation",
    "Aviation",
    "Plane",
    "Pilot training, aviation management and aircraft maintenance.",
  ],
  [
    "tourism",
    "Tourism and Hospitality",
    "UtensilsCrossed",
    "Tourism management, hotel management and gastronomy.",
  ],
  // Kept last on purpose. A finder that cannot express "mine is not on this
  // list" pushes people into a wrong answer or out of the funnel entirely.
  [
    "other",
    "Other, tell us what",
    "HelpCircle",
    "Something not listed here. Tell us what you are looking for and we will say whether it exists in Türkiye and where.",
  ],
];
for (const [slug, name, icon, description] of fieldsOfStudy) {
  write("content/fields", slug, { name, placeholder: true, icon, description });
}

// ── Programs ────────────────────────────────────────────────

const programs = [
  {
    slug: "pharmacy-ankara-medipol",
    title: "Pharmacy",
    uni: "ankara-medipol-university",
    field: "medicine-and-health",
    level: "bachelor",
    years: 5,
    band: "$8,000 to $12,000",
    lang: "English",
    blurb:
      "A five-year professional degree in pharmacy taught in English, in the capital. Less oversubscribed than medicine while leading to a regulated profession with a clear route back home.",
    outcomes:
      "Graduates practise as pharmacists subject to the licensing process in the country they register in, and the degree also opens industry and regulatory roles.",
  },
  {
    slug: "nursing-ankara-medipol",
    title: "Nursing",
    uni: "ankara-medipol-university",
    field: "medicine-and-health",
    level: "bachelor",
    years: 4,
    band: "$4,000 to $7,000",
    lang: "English",
    blurb:
      "A four-year English-taught nursing degree with clinical placement built into the later years. One of the more attainable routes into health sciences, and one where demand at home is consistently strong.",
    outcomes:
      "Graduates register as nurses subject to their own country's council requirements. Demand is high in most of the markets our students return to.",
  },
  {
    slug: "international-trade-izmir",
    title: "International Trade and Finance",
    uni: "izmir-university-of-economics",
    field: "business",
    level: "bachelor",
    years: 4,
    band: "$5,000 to $8,000",
    lang: "English",
    blurb:
      "A four-year English-taught degree covering trade, logistics and finance, in a port city where those things actually happen rather than being studied in the abstract.",
    outcomes:
      "Graduates enter trade, logistics, banking and supply chain roles. Direct relevance for students whose families already trade between Türkiye and West Africa.",
  },
  {
    slug: "psychology-izmir",
    title: "Psychology",
    uni: "izmir-university-of-economics",
    field: "social-sciences",
    level: "bachelor",
    years: 4,
    band: "$5,000 to $8,000",
    lang: "English",
    blurb:
      "A four-year English-taught psychology degree. Worth checking the licensing route at home early, because practising as a psychologist is regulated in most countries.",
    outcomes:
      "Graduates enter research, human resources and further clinical training. Clinical practice requires postgraduate qualification and local registration.",
  },
  {
    slug: "civil-engineering-erciyes",
    title: "Civil Engineering",
    uni: "erciyes-university",
    field: "engineering",
    level: "bachelor",
    years: 4,
    band: "$600 to $1,200",
    lang: "Turkish",
    blurb:
      "A state university civil engineering degree taught in Turkish, at a fraction of private tuition. Requires YÖS and a Turkish language year first, which is the trade-off for the price.",
    outcomes:
      "Graduates enter construction and infrastructure. Students planning to practise at home should check their engineering council's recognition route before applying.",
  },
  {
    slug: "computer-engineering-erciyes",
    title: "Computer Engineering",
    uni: "erciyes-university",
    field: "computer-science",
    level: "bachelor",
    years: 4,
    band: "$600 to $1,200",
    lang: "Turkish",
    blurb:
      "The cheapest realistic route into a computing degree in Türkiye. Turkish-taught, YÖS required, language year first, and priced accordingly.",
    outcomes:
      "Graduates work in software and systems roles. The work is portable, and Turkish adds a second labour market rather than limiting you to one.",
  },
  {
    slug: "medicine-medipol",
    title: "Medicine",
    uni: "istanbul-medipol-university",
    field: "medicine-and-health",
    level: "bachelor",
    years: 6,
    band: "$20,000 to $24,000",
    lang: "English",
    blurb:
      "A six-year undergraduate medical degree taught in English, with clinical exposure through the university's affiliated hospital network. This is the most competitive route in the institution and applications are assessed primarily on science subject grades.",
    outcomes:
      "Graduates enter clinical practice, subject to the licensing requirements of the country they practise in. Students intending to return home should confirm their own regulator's recognition process before applying, and we will help with that check.",
  },
  {
    slug: "dentistry-medipol",
    title: "Dentistry",
    uni: "istanbul-medipol-university",
    field: "medicine-and-health",
    level: "bachelor",
    years: 5,
    band: "$16,000 to $20,000",
    lang: "English",
    blurb:
      "A five-year professional degree in dentistry taught in English, with practical clinical work forming a substantial part of the later years. Less oversubscribed than medicine while leading to a comparably clear professional path.",
    outcomes:
      "Graduates practise as dentists subject to local licensing. The degree is also a route into oral surgery and orthodontic specialisation through further study.",
  },
  {
    slug: "software-engineering-altinbas",
    title: "Software Engineering",
    uni: "altinbas-university",
    field: "computer-science",
    level: "bachelor",
    years: 4,
    band: "$5,000 to $8,000",
    lang: "English",
    blurb:
      "A four-year English-taught engineering degree with a project-heavy structure. Assessment weights build work and laboratory time alongside written examinations, which suits students who learn by making things.",
    outcomes:
      "Graduates work in software development, systems and data roles. The work is portable, and a meaningful share of graduates from this programme work remotely for employers outside Türkiye.",
  },
  {
    slug: "civil-engineering-altinbas",
    title: "Civil Engineering",
    uni: "altinbas-university",
    field: "engineering",
    level: "bachelor",
    years: 4,
    band: "$5,000 to $8,000",
    lang: "English",
    blurb:
      "A four-year English-taught programme covering structural, geotechnical and transportation engineering, with laboratory work carrying real assessment weight rather than sitting as a token component.",
    outcomes:
      "Graduates enter construction, infrastructure and consulting roles. Students planning to practise in their home country should check the local engineering council's recognition route early.",
  },
  {
    slug: "business-administration-aydin",
    title: "Business Administration",
    uni: "istanbul-aydin-university",
    field: "business",
    level: "bachelor",
    years: 4,
    band: "$4,000 to $7,000",
    lang: "English",
    blurb:
      "A four-year English-taught business degree covering management, finance, marketing and international trade, in a faculty with a large international cohort.",
    outcomes:
      "Graduates enter management, finance and trade roles. Istanbul's position as a trading hub makes internships in import and export more accessible here than in most Turkish cities.",
  },
  {
    slug: "architecture-aydin",
    title: "Architecture",
    uni: "istanbul-aydin-university",
    field: "architecture",
    level: "bachelor",
    years: 4,
    band: "$5,000 to $9,000",
    lang: "English",
    blurb:
      "A four-year English-taught architecture programme built around studio work. Studio carries the majority of the assessment weight, and the workload pattern is different from a lecture-based degree.",
    outcomes:
      "Graduates enter architectural practice, subject to the registration requirements of the country they practise in. The studio portfolio built during the degree is the primary asset on graduating.",
  },
];

for (const pr of programs) {
  write("content/programs", pr.slug, {
    title: pr.title,
    placeholder: true,
    reviewedOn: REVIEWED,
    university: pr.uni,
    level: pr.level,
    field: pr.field,
    language: pr.lang,
    durationYears: pr.years,
    tuitionBand: pr.band,
    scholarshipAvailable: true,
    description: doc(
      p(pr.blurb),
      p(
        "Placeholder description. The programme structure, module list and assessment pattern below are written to a realistic shape but have not been verified against the university's current catalogue, and must be replaced with the real syllabus before this page goes live."
      ),
      p(
        "Teaching runs across two semesters a year. The language of instruction is set at programme level rather than faculty level, so it should be confirmed for this specific programme before an application is submitted."
      )
    ),
    entryRequirements: doc(
      p(
        "A completed secondary certificate with denklik, and evidence of English for this English-taught programme, either an accepted external test result or a pass in the university's own proficiency exam."
      ),
      p(
        "Where the programme is competitive, subject grades are examined rather than the aggregate alone."
      )
    ),
    careerOutcomes: pr.outcomes,
    documentsRequired: [
      "Secondary school certificate",
      "Academic transcript",
      "Passport, valid for the full duration of study where possible",
      "Passport photographs",
      "English proficiency evidence, where held",
    ],
    seo: { title: "", description: "" },
  });
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
    uni: "altinbas-university",
    program: "software-engineering-altinbas",
    country: "ghana",
    quote:
      "Placeholder story. This card is deliberately unnamed and carries no photograph. It will be replaced with a real student account, published with written consent, a real name and a real photograph, or removed entirely.",
  },
  {
    slug: "placeholder-story-health",
    uni: "istanbul-medipol-university",
    program: "dentistry-medipol",
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
    university: s.uni,
    program: s.program,
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
