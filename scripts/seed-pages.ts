/**
 * Seed generator for pages, courses, FAQs, offices, team and partners.
 *
 * Everything here is tagged `placeholder: true` (HANDOVER §3.2) and appears in
 * content/PLACEHOLDERS.md. The prose is written to be structurally real so the
 * pages can be judged at full length, while carrying no claim that would be
 * wrong if published: no dates, no rates, no counts, no named people.
 *
 * Two collections are deliberately left empty:
 *
 *   team     - a fabricated colleague is an invented person, which HANDOVER §5
 *              rules out. The page describes the roles you will deal with and
 *              says plainly that named profiles are being added.
 *   partners - MASTERPLAN §4.4 permits only accreditation marks that can be
 *              evidenced. An empty partners page that says so is a stronger
 *              trust signal than a wall of logos we cannot stand behind.
 *
 * Run: npx tsx scripts/seed-pages.ts
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const REVIEWED = "2026-08-01";

type Block = Record<string, unknown>;
const p = (text: string): Block => ({ type: "paragraph", children: [{ text }] });
const h = (text: string): Block => ({ type: "heading", level: 3, children: [{ text }] });

for (const dir of [
  "content/pages",
  "content/courses",
  "content/faqs",
  "content/offices",
  "content/team",
  "content/partners",
]) {
  const full = join(ROOT, dir);
  if (existsSync(full)) rmSync(full, { recursive: true });
  mkdirSync(full, { recursive: true });
}

function write(dir: string, slug: string, data: unknown) {
  writeFileSync(join(ROOT, dir, `${slug}.json`), JSON.stringify(data, null, 2) + "\n");
}

type Section = { heading: string; body: Block[] };

function page(
  slug: string,
  title: string,
  intro: string,
  sections: Section[],
  opts: { placeholder?: boolean } = {}
) {
  write("content/pages", slug, {
    title,
    placeholder: opts.placeholder ?? true,
    reviewedOn: REVIEWED,
    intro,
    sections: sections.map((s) => ({ heading: s.heading, body: s.body })),
    seo: { title: "", description: "" },
  });
}

// ── Why Türkiye ─────────────────────────────────────────────

page(
  "why-turkiye",
  "Why Türkiye",
  "Recognised degrees, costs well below western Europe, English-taught programmes, and a straightforward student visa route. Here is the honest version, including what Türkiye is not good for.",
  [
    {
      heading: "The degrees are recognised",
      body: [
        p(
          "Turkish universities are regulated by YÖK, the Council of Higher Education, and a degree from a YÖK-accredited institution is recognised across most of the world. What matters for a student planning to return home is the recognition process in their own country, which is a separate step run by their own regulator."
        ),
        p(
          "We will tell you what that process looks like for your country before you apply, rather than after you graduate. For regulated professions in particular, medicine and dentistry above all, this is the question to settle first."
        ),
      ],
    },
    {
      heading: "The cost sits well below western Europe",
      body: [
        p(
          "State university tuition is a fraction of the UK, the United States or Canada. Private universities cost more but still sit below equivalents in western Europe, and living costs outside Istanbul are lower again."
        ),
        p(
          "Cost is the most common reason our students choose Türkiye, and it is a good reason. It is not the only one, and it should not be the only one, because the cheapest option is not always the one a student finishes."
        ),
      ],
    },
    {
      heading: "You can study in English",
      body: [
        p(
          "A large number of programmes are taught entirely in English, particularly at private universities and particularly in engineering, business, computer science and health sciences. This removes the single biggest barrier for students from Anglophone Africa."
        ),
        p(
          "The language of instruction is set per programme rather than per university, so it must be checked for the specific programme. Two programmes with almost the same name at the same university can be taught in different languages."
        ),
      ],
    },
    {
      heading: "Geography, and what it means practically",
      body: [
        p(
          "Istanbul is roughly six hours from Accra and Lagos with direct or single-connection routings. That matters for a first-year student who may want to go home, and it matters for a parent who may want to visit."
        ),
        p(
          "It also means the time difference is small. Türkiye is two or three hours ahead of Ghana and Nigeria, so a call home is not a middle-of-the-night arrangement."
        ),
      ],
    },
    {
      heading: "What Türkiye is not good for",
      body: [
        p(
          "If your plan is to work while studying and cover your fees from that work, Türkiye is a poor fit. Work rights for international students are limited, wages in student-accessible jobs are low, and no realistic amount of part-time work covers private university tuition."
        ),
        p(
          "If you need to graduate and stay permanently, this is also not the most direct route. Türkiye is a good place to study and a harder place to settle than some alternatives, and anyone who tells you otherwise is selling something."
        ),
        p(
          "And if your grades are weak and your budget is small at the same time, the honest answer is that the options narrow sharply. We would rather say that at the enquiry stage than after a deposit."
        ),
      ],
    },
  ]
);

// ── Application process ─────────────────────────────────────

page(
  "application-process",
  "The application process",
  "Eight steps from first conversation to enrolment. The timings below are typical rather than promised, and the step that delays most applicants is denklik.",
  [
    {
      heading: "01. Eligibility review",
      body: [
        p(
          "We look at your qualification, your grades and your budget, and tell you honestly whether the programme you want is in range. If it is not, we say which programmes are. This is usually a same-day conversation."
        ),
      ],
    },
    {
      heading: "02. University and programme shortlist",
      body: [
        p(
          "We put together a shortlist matched to your grades, your budget and the language you can study in. We apply to several institutions rather than one, because that is what puts you in a position to compare offers rather than accept whatever arrives."
        ),
      ],
    },
    {
      heading: "03. Document preparation",
      body: [
        p(
          "Transcripts, certificate, passport, photographs and translations. Most delays at this stage are caused by a document that was laminated before it was stamped, or a name that does not match across documents. Both are avoidable if caught early."
        ),
      ],
    },
    {
      heading: "04. Denklik, the diploma recognition step",
      body: [
        p(
          "Denklik is the Turkish recognition of your secondary certificate. It delays more applications than any other single step, and it runs in parallel with the university application rather than after it."
        ),
        p(
          "Start it as early as your results allow. Applications that begin denklik late are the ones that miss an intake."
        ),
      ],
    },
    {
      heading: "05. University application",
      body: [
        p(
          "We submit to the shortlist and track each application. Where a university asks for something extra, we handle it rather than forwarding the request to you and waiting."
        ),
      ],
    },
    {
      heading: "06. Acceptance and tuition deposit",
      body: [
        p(
          "Offers arrive, we go through them together, and you choose. A deposit secures the place and produces the acceptance letter the embassy will want to see."
        ),
      ],
    },
    {
      heading: "07. Student visa at the embassy",
      body: [
        p(
          "You apply at the Turkish embassy in your own country with the acceptance letter and the supporting document set. Appointment availability tightens considerably in the months before the September intake, so book as soon as the acceptance letter is issued."
        ),
      ],
    },
    {
      heading: "08. Arrival, ikamet and enrolment",
      body: [
        p(
          "You arrive, we meet you, and we handle enrolment and the ikamet residence permit application. This is the part that a local agent five thousand kilometres away cannot do, and it is the reason we operate from Ankara."
        ),
      ],
    },
    {
      heading: "How long the whole thing takes",
      body: [
        p(
          "Plan on several months from first document to boarding pass, not several weeks. For a September intake, students who start in February or March are comfortable. Students who start in July are already late, and we will tell them so rather than take the fee."
        ),
      ],
    },
  ]
);

// ── Entry requirements ──────────────────────────────────────

page(
  "entry-requirements",
  "Entry requirements",
  "What Turkish universities actually ask for, what they look at closely, and what they do not care about as much as you might expect.",
  [
    {
      heading: "The secondary certificate",
      body: [
        p(
          "A completed secondary school certificate is the baseline for undergraduate admission. WASSCE, WAEC, NECO, SSCE, A Levels and the International Baccalaureate are all recognised routes, subject to denklik."
        ),
        p(
          "The certificate itself is necessary but not sufficient. What the university does with it depends on the programme."
        ),
      ],
    },
    {
      heading: "Subject grades matter more than the aggregate",
      body: [
        p(
          "This is the most common misunderstanding we correct. For competitive programmes, particularly in health sciences, the university looks at individual subject grades rather than the overall result. Biology, chemistry and mathematics carry the weight for medicine, dentistry and pharmacy."
        ),
        p(
          "A strong aggregate built on humanities subjects will not open a medicine place. A moderate aggregate with strong sciences sometimes will."
        ),
      ],
    },
    {
      heading: "YÖS and SAT",
      body: [
        p(
          "YÖS is an entrance examination used by many state universities and some private ones. Where it is required, it is a real filter. Many private universities do not require it at all, which is one reason they are the more common route for international students."
        ),
        p(
          "SAT results are accepted at a number of institutions and can strengthen a competitive application. Neither YÖS nor SAT replaces the secondary certificate."
        ),
      ],
    },
    {
      heading: "Language",
      body: [
        p(
          "For an English-taught programme you need either an accepted external test result, usually IELTS or TOEFL, or a pass in the university's own proficiency exam taken on arrival. Students who arrive without a test result should budget for the possibility of a preparatory year rather than assume they will pass."
        ),
        p(
          "For a Turkish-taught programme you need Turkish at C1, which for almost every international student means a language year first. That year has a cost and a duration, and neither appears in the tuition figure."
        ),
      ],
    },
    {
      heading: "Postgraduate entry",
      body: [
        p(
          "A recognised bachelor's degree, transcripts, and usually a statement of purpose and references. Some programmes interview. Recognition of the first degree is handled through the same equivalency principle as denklik, and it is worth starting early for the same reason."
        ),
      ],
    },
  ]
);

// ── Visa and residence ──────────────────────────────────────

page(
  "visa-and-residence",
  "Visa and residence",
  "The student visa is issued in your country. The residence permit is issued after you arrive. They are different things and the second one catches people out.",
  [
    {
      heading: "The student visa",
      body: [
        p(
          "You apply at the Turkish embassy or consulate in your own country, with your acceptance letter and the supporting documents they specify. The visa gets you into Türkiye and it is tied to your studies."
        ),
        p(
          "Appointment availability is the practical constraint rather than the decision itself. Slots become scarce in the months before the September intake, so the appointment should be booked as soon as the acceptance letter exists, not once every other document is ready."
        ),
      ],
    },
    {
      heading: "Ikamet, the residence permit",
      body: [
        p(
          "Once you arrive you apply for a residence permit, the ikamet. This is a separate process handled inside Türkiye, and it is the one that most commonly goes wrong for students who came through an agent with no presence here."
        ),
        p(
          "There is a window after arrival within which the application must be made. Missing it creates problems that are far more troublesome to fix than to avoid. We go with our students to the appointment rather than sending instructions."
        ),
      ],
    },
    {
      heading: "Health insurance",
      body: [
        p(
          "Health cover is required and is part of the residence permit process rather than an optional extra. Budget for it as a fixed annual cost alongside the permit fee."
        ),
      ],
    },
    {
      heading: "If a visa is refused",
      body: [
        p(
          "It happens, and it is usually a document problem rather than a judgement about the student. A refusal is not necessarily the end of the route, and the first thing to establish is the stated reason."
        ),
        p(
          "We would rather tell an applicant that their file has a weakness before it is submitted than manage a refusal afterwards. That is the whole reason the document stage is as slow and as fussy as it is."
        ),
      ],
    },
  ]
);

// ── Accommodation ───────────────────────────────────────────

page(
  "accommodation",
  "Accommodation",
  "Where students actually live, what each option costs relative to the others, and the trade-offs nobody mentions until you have signed something.",
  [
    {
      heading: "University dormitories",
      body: [
        p(
          "The cheapest and the simplest option, and the one we suggest for a first year. Rooms are usually shared, meals are often included, and the contract runs with the academic year so there is no separate deposit negotiation in a language you do not yet speak."
        ),
        p(
          "Places are finite and they go early. A student who waits until arrival to think about accommodation will usually end up in a shared flat by default rather than by choice."
        ),
      ],
    },
    {
      heading: "Private dormitories",
      body: [
        p(
          "More expensive than university dormitories, generally with better facilities and more privacy. A reasonable middle option, and widely available in the larger university cities."
        ),
      ],
    },
    {
      heading: "Shared flats",
      body: [
        p(
          "Cheaper per person than a studio and the most common choice from the second year onwards, once a student knows the city and has people to share with. It requires a deposit, a contract, and usually a guarantor arrangement, which is why it is a difficult first-year option from abroad."
        ),
      ],
    },
    {
      heading: "Studios",
      body: [
        p(
          "The most expensive option and the least common among the students we place. It suits postgraduate students and those arriving with family, and it is rarely the right answer for an eighteen-year-old arriving alone."
        ),
      ],
    },
    {
      heading: "The thing to know about Istanbul",
      body: [
        p(
          "Accommodation in Istanbul costs considerably more than in Ankara or a smaller university city, and the gap is large enough to change which universities are affordable overall. A cheaper tuition figure in an expensive city can total more than a higher one in a cheaper city."
        ),
        p(
          "Also check which campus your programme is actually taught on before signing anything. Istanbul is large, universities operate across multiple sites, and a daily cross-city commute is a real cost in both money and attendance."
        ),
      ],
    },
  ]
);

// ── Student support ─────────────────────────────────────────

page(
  "student-support",
  "Student support",
  "What we do after you land, which is the part that separates a consultancy in Ankara from an agent five thousand kilometres away.",
  [
    {
      heading: "Arrival",
      body: [
        p(
          "We meet you, help you get to your accommodation, and get you a local SIM and a transport card on the first day. Small things, but they are the difference between a first week spent settling in and a first week spent lost."
        ),
      ],
    },
    {
      heading: "Enrolment and the ikamet",
      body: [
        p(
          "We go with you to enrolment and to the residence permit appointment. Both involve queues, forms and a language you do not speak yet, and both have consequences if they go wrong."
        ),
      ],
    },
    {
      heading: "Banking and the practical set-up",
      body: [
        p(
          "Opening a bank account, understanding what your student card gets you, and knowing which pharmacy near campus has someone who speaks English. This is the layer of knowledge that takes a new student a semester to build and takes us an afternoon to hand over."
        ),
      ],
    },
    {
      heading: "When something goes wrong",
      body: [
        p(
          "A requirement changes, a document is questioned, a deadline is missed, a student falls behind. These things happen, and they are the reason to work with someone who can walk into the relevant office rather than send an email into it."
        ),
        p(
          "We are in Ankara, not in Accra. When something needs a person in a room, there is a person in a room."
        ),
      ],
    },
    {
      heading: "What we do not do",
      body: [
        p(
          "We do not sit exams for anyone, we do not guarantee admission, and we do not promise a visa outcome. Anyone offering those things is describing something that is either impossible or fraudulent."
        ),
      ],
    },
  ]
);

// ── Costs ───────────────────────────────────────────────────

page(
  "costs",
  "Tuition and costs",
  "Published bands rather than a quote, in US dollars, with the date they were last reviewed. We confirm your exact total in cedis or naira during consultation, at the rate on the day.",
  [
    {
      heading: "Why bands and not exact figures",
      body: [
        p(
          "Tuition changes annually, exchange rates change weekly, and a precise figure published on a website is wrong within months. A band that is honest about being a range is more useful than a number that looks precise and is not."
        ),
        p(
          "This is also why you will not find a cost calculator here. A calculator implies a precision this information does not have, and it needs more maintenance than anything else on a site like this."
        ),
      ],
    },
    {
      heading: "What sits on top of tuition",
      body: [
        p(
          "Accommodation, food, transport, health insurance, the residence permit fee, one-off setup costs on arrival, and flights. For most students the non-tuition costs across a year are comparable to state university tuition, so leaving them out distorts the picture badly."
        ),
      ],
    },
    {
      heading: "Our fee",
      body: [
        p(
          "Our fee is confirmed at your first consultation and before any payment. We tell you what it covers and what it does not, in writing, before you commit to anything."
        ),
      ],
    },
    {
      heading: "The cheapest realistic route",
      body: [
        p(
          "A state university, in a city other than Istanbul, with a dormitory place, studying in Turkish after a language year. That combination is genuinely affordable. It is also the route that requires the most preparation and the most patience, and it is not what most students picture when they imagine studying abroad."
        ),
        p(
          "We will lay out that option honestly alongside the more expensive ones, because for some families it is the one that works."
        ),
      ],
    },
  ]
);

// ── About ───────────────────────────────────────────────────

page(
  "about",
  "About Minaret",
  "We are a Turkish-registered education consultancy operating from Ankara, placing students from Anglophone Africa into accredited Turkish universities.",
  [
    {
      heading: "Where we are, and why it matters",
      body: [
        p(
          "Almost every consultancy a Ghanaian or Nigerian student meets is based in Accra, Kumasi, Lagos or Abuja. They take a fee, forward documents to a partner in Türkiye, and lose visibility the moment the student lands."
        ),
        p(
          "We are in Ankara. When denklik stalls, when a university changes a requirement, when an ikamet appointment is missed, we can walk into the office in question. That is the whole proposition, and it is the reason the business is structured the way it is."
        ),
      ],
    },
    {
      heading: "What we do",
      body: [
        p(
          "Eligibility assessment, university and programme shortlisting, document preparation, denklik, university applications, visa support, and everything after arrival: enrolment, the residence permit, and the practical set-up of a life in a new country."
        ),
      ],
    },
    {
      heading: "How we work",
      body: [
        p(
          "We publish our cost bands, we publish our process, and we tell applicants when a route will not work for them. A negative assessment costs us a fee today and earns the referral that arrives next year."
        ),
        p(
          "We apply to a shortlist rather than a single institution, because a student with several offers is in a position to choose and a student with one is not."
        ),
      ],
    },
    {
      heading: "The rest of the group",
      body: [
        p(
          "Minaret also operates in skills training, business consultancy, import and export advisory, publishing and printing, and school supplies. Education is the flagship and carries most of our attention. The other divisions exist because they serve the same institutions and the same relationships."
        ),
      ],
    },
  ]
);

// ── Contact, careers ────────────────────────────────────────

page(
  "contact",
  "Contact",
  "WhatsApp is the fastest way to reach us. The office is in Ankara and runs on Turkish time, which is ahead of Ghana and Nigeria.",
  [
    {
      heading: "How quickly we reply",
      body: [
        p(
          "We reply within four working hours. Our office is open 09:00 to 18:00 in Türkiye, which is shown converted to your own local time in the footer of every page."
        ),
      ],
    },
    {
      heading: "What to send us",
      body: [
        p(
          "For a first enquiry: what you want to study, roughly what your grades were, and what you can spend. That is enough for us to tell you something useful rather than something generic."
        ),
        p(
          "You do not need documents yet. Nothing has to be scanned, translated or notarised before a first conversation."
        ),
      ],
    },
  ]
);

page(
  "careers",
  "Careers",
  "We hire occasionally, mostly in Ankara, and we are always interested in hearing from people who have been through this process themselves.",
  [
    {
      heading: "What we look for",
      body: [
        p(
          "Counsellors who have studied abroad themselves and remember what it felt like to arrive somewhere with no language and no network. That experience is not a nice-to-have in this work, it is the job."
        ),
        p(
          "We also look for people who are comfortable telling an applicant that a route will not work for them. Anyone who finds that conversation difficult will not last here."
        ),
      ],
    },
    {
      heading: "Open roles",
      body: [
        p(
          "Placeholder. There are no roles advertised at present. Send us a note if you think you would fit and we will keep it on file."
        ),
      ],
    },
  ]
);

// ── Legal ───────────────────────────────────────────────────

const LAWYER_NOTE =
  "This is a standard draft, not legal advice. It requires review by a Turkish lawyer before launch, and a second opinion on the Ghana and Nigeria registration thresholds (MASTERPLAN §10.6).";

page("legal-privacy", "Privacy policy", LAWYER_NOTE, [
  {
    heading: "Who controls your data",
    body: [
      p(
        "MAK Minaret, operating as Minaret Educational Consultancy, registered and operating in Ankara, Türkiye, is the data controller for the personal data described here."
      ),
      p(
        "Placeholder draft. The registered entity name, registration number and registered address must be confirmed before publication."
      ),
    ],
  },
  {
    heading: "What we collect and why",
    body: [
      p(
        "When you complete the eligibility check or any other form on this site, we collect the details you enter: your name, contact details, country, and the answers describing your educational background and budget. We use them to respond to your enquiry and to advise you on your options."
      ),
      p(
        "We do not run advertising or analytics trackers on this site, so we do not build a profile of your browsing."
      ),
    ],
  },
  {
    heading: "The legal basis",
    body: [
      p(
        "We process enquiry data on the basis of your explicit consent, given at the point of submission. Marketing communication requires a separate, unbundled consent which you may give or withhold independently, and neither box is pre-ticked."
      ),
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      p(
        "An enquiry that does not become an application is retained for 24 months and then deleted. An application record is retained for as long as we are advising you and for a defined period afterwards."
      ),
    ],
  },
  {
    heading: "Cross-border transfer",
    body: [
      p(
        "If you are in Ghana or Nigeria, your personal data is transferred to Türkiye, where we operate, and to our transactional email provider. This transfer is a necessary part of providing the service you asked for, and it is named here explicitly rather than buried."
      ),
    ],
  },
  {
    heading: "Your rights",
    body: [
      p(
        "Under Article 11 of KVKK, and equivalently under Ghanaian and Nigerian data protection law, you may ask what we hold about you, ask us to correct it, ask us to delete it, and withdraw consent at any time. Write to us and we will respond within 30 days."
      ),
    ],
  },
]);

page("legal-terms", "Terms of service", LAWYER_NOTE, [
  {
    heading: "What we provide",
    body: [
      p(
        "We provide advisory and application support services for students seeking admission to universities in Türkiye. We are a consultancy. We are not a university, we do not make admission decisions, and we do not issue visas."
      ),
    ],
  },
  {
    heading: "What we cannot promise",
    body: [
      p(
        "We cannot guarantee admission to any institution, the award of any scholarship, or the issue of any visa or residence permit. Those decisions are made by universities, by scholarship bodies and by the Turkish authorities respectively."
      ),
      p(
        "Anyone who guarantees those outcomes is describing something they do not control. Treat such a guarantee as a warning sign, from us or from anybody else."
      ),
    ],
  },
  {
    heading: "Fees",
    body: [
      p(
        "Our fee is confirmed in writing at your first consultation and before any payment is taken. What it covers and what it excludes is set out at the same time."
      ),
      p(
        "Placeholder draft. The refund position and the cancellation terms must be settled and stated here before launch."
      ),
    ],
  },
  {
    heading: "Your responsibilities",
    body: [
      p(
        "The information and documents you give us must be accurate and genuine. A fabricated or altered document ends the engagement immediately and without refund, and we report it where we are required to."
      ),
    ],
  },
]);

page("legal-cookies", "Cookie policy", LAWYER_NOTE, [
  {
    heading: "We do not track you",
    body: [
      p(
        "This site runs no analytics, no advertising pixels and no third-party tracking scripts. There is no consent banner because there is nothing to consent to."
      ),
      p(
        "If that changes, this page changes first, and a genuine consent mechanism is added that blocks the scripts until you accept, with rejecting exactly as easy as accepting."
      ),
    ],
  },
  {
    heading: "What is stored on your device",
    body: [
      p(
        "The eligibility check saves your answers in your browser's local storage so that you can leave and come back without starting again. That data stays on your device and is cleared when you submit. It is not a cookie and it is not sent anywhere until you submit the form."
      ),
      p(
        "A dismissal of the preview notice is stored for the length of your browsing session so it does not reappear on every page."
      ),
    ],
  },
]);

page("legal-kvkk", "KVKK notice", LAWYER_NOTE, [
  {
    heading: "Aydınlatma Metni",
    body: [
      p(
        "This notice is provided under Law No. 6698 on the Protection of Personal Data, the Turkish data protection regime that governs our processing as an entity registered and operating in Türkiye."
      ),
      p(
        "Placeholder draft. A Turkish-language version must be published alongside this one, and both require review by a Turkish lawyer before launch."
      ),
    ],
  },
  {
    heading: "Data controller",
    body: [
      p(
        "MAK Minaret, registered in Türkiye. The registration number and registered address must be confirmed and stated here before publication."
      ),
    ],
  },
  {
    heading: "Purpose and legal basis",
    body: [
      p(
        "Personal data is processed for the purpose of responding to and advising on education enquiries, on the basis of the explicit consent given at the point of submission."
      ),
    ],
  },
  {
    heading: "Rights under Article 11",
    body: [
      p(
        "You have the right to learn whether your data is processed, to request information about the processing, to learn the purpose and whether it is used accordingly, to know any third parties to whom it is transferred, to request correction or deletion, and to object to conclusions drawn by automated analysis."
      ),
      p(
        "Requests should be sent to the email address published on our contact page and are answered within 30 days."
      ),
    ],
  },
  {
    heading: "Registration thresholds",
    body: [
      p(
        "Whether VERBİS registration applies to us in Türkiye, and whether registration with the Ghana Data Protection Commission or the Nigeria Data Protection Commission applies given that we market to residents of those countries, are open questions requiring legal advice rather than assumption."
      ),
    ],
  },
]);

// ── Health insurance ────────────────────────────────────────

page(
  "health-insurance",
  "Health insurance",
  "Cover is required, it is tied to your residence permit, and it is the cost students most often leave out of their budget.",
  [
    {
      heading: "It is not optional",
      body: [
        p(
          "Health cover is a condition of the residence permit rather than a sensible extra. Without it in place, the ikamet application does not complete, so it belongs in your plan from the start and not as something to sort out later."
        ),
      ],
    },
    {
      heading: "Your two routes",
      body: [
        p(
          "International students can generally either enrol in the Turkish state scheme, or take private cover from an insurer. There is a window after arrival within which the state option can be taken up, and missing it usually means going private instead."
        ),
        p(
          "The state scheme is typically the cheaper of the two and covers state hospitals. Private policies cost more, and in exchange usually mean shorter waits and easier access to private hospitals where English is more widely spoken."
        ),
        p(
          "Placeholder detail. The enrolment window, the current premium levels and the exact scope of each option must be confirmed before this page goes live, and they are the kind of figures that change."
        ),
      ],
    },
    {
      heading: "Budget for it as a fixed annual cost",
      body: [
        p(
          "Whichever route you take, treat it as a known yearly cost alongside the residence permit fee rather than a variable. It is small next to tuition and it is the one people forget."
        ),
      ],
    },
    {
      heading: "What we do",
      body: [
        p(
          "We tell you which route suits your situation before you arrive, we go with you to sort it out in the first weeks, and we make sure it is in place before the residence permit appointment rather than after it."
        ),
        p(
          "If you fall ill in your first month and have not sorted cover, that is an expensive problem. It is one of the specific things having someone here rather than in Accra actually prevents."
        ),
      ],
    },
  ]
);

// ── Ghana community ─────────────────────────────────────────

page(
  "ghana-community",
  "The Ghanaian community in Türkiye",
  "You will not be the only one. There is an established Ghanaian student community across the main university cities, and getting connected to it in the first month makes more difference than almost anything else we do.",
  [
    {
      heading: "Why this matters more than it sounds",
      body: [
        p(
          "The students who struggle are rarely the ones who found the coursework hard. They are the ones who spent the first semester alone, did not know who to ask about a form, and lost confidence before they found their feet."
        ),
        p(
          "A community that already knows which office to go to, which shop sells the right ingredients and which lecturer is approachable removes most of that. It is the difference between a difficult first year and a fine one."
        ),
      ],
    },
    {
      heading: "What actually exists",
      body: [
        p(
          "Ghanaian students are present in Istanbul, Ankara and the other main university cities, with informal groups on WhatsApp, church and mosque communities, and student associations at the larger universities."
        ),
        p(
          "Placeholder detail. The specific groups, associations and contacts must be confirmed and named here before this page goes live, with the permission of the people running them."
        ),
      ],
    },
    {
      heading: "How we connect you",
      body: [
        p(
          "Before you travel, we introduce you to students already at your university where they are willing to be introduced. Not a directory, an actual introduction to someone who was in your position a year ago."
        ),
        p(
          "On arrival, we point you at the groups that are active rather than the ones that merely exist. There is a difference, and it is not visible from outside."
        ),
      ],
    },
    {
      heading: "Practical things people ask about",
      body: [
        p(
          "Where to find familiar food and ingredients, which neighbourhoods other students live in, how to send and receive money, where to worship, and how to get a Ghanaian SIM to keep working alongside a Turkish one."
        ),
        p(
          "None of it is complicated once somebody tells you. All of it is frustrating to work out alone in a language you do not speak yet."
        ),
      ],
    },
    {
      heading: "Bringing people together",
      body: [
        p(
          "We are building this deliberately rather than leaving it to chance, because a connected community is also our best source of honest feedback about which universities actually treat international students well."
        ),
        p(
          "If you are already studying here and want to be part of that, tell us. If you are applying, ask us to introduce you before you travel rather than after."
        ),
      ],
    },
  ]
);

// ── Offices ─────────────────────────────────────────────────

write("content/offices", "ankara", {
  name: "Ankara",
  placeholder: true,
  reviewedOn: REVIEWED,
  addressLines: ["Ankara", "Türkiye"],
  city: "Ankara",
  country: "Türkiye",
  mapsUrl: "",
  hours: "09:00 to 18:00 GMT+3, Monday to Friday",
  phone: "",
  note: "Placeholder. The street address, the landline and a photograph of the actual premises must be added before launch. These carry the claim that we are physically in Türkiye, which is the central trust signal on this site, so they cannot be approximated.",
});

// ── Courses ─────────────────────────────────────────────────

const courses: Array<[string, string, string, string, number, string, string, string]> = [
  [
    "tailoring",
    "Tailoring",
    "in-person",
    "Practical garment construction: pattern cutting, machine work, finishing and fitting. Taught hands-on in a workshop rather than from a book.",
    8,
    "On request",
    "Certificate of completion",
    "People who want a trade they can earn from immediately, whether back home or here.",
  ],
  [
    "fashion-design",
    "Fashion Design",
    "in-person",
    "Design fundamentals alongside the making: sketching, fabric selection, construction and building a small collection. Pairs naturally with the tailoring course.",
    12,
    "On request",
    "Certificate of completion",
    "Anyone who wants to design as well as sew, and who plans to sell their own work.",
  ],
  [
    "turban-making",
    "Turban and Headwrap Making",
    "in-person",
    "Wrapping, styling, fabric handling and finishing for turbans and headwraps, including the styles most in demand for weddings and events.",
    4,
    "On request",
    "Certificate of completion",
    "People building a styling business, and salon owners adding a service.",
  ],
  [
    "baking",
    "Baking",
    "in-person",
    "Bread, pastry and cake work in a working kitchen: doughs, laminations, fillings, finishing and the production discipline a bakery actually runs on.",
    8,
    "On request",
    "Certificate of completion",
    "People opening a bakery or adding baked goods to an existing food business.",
  ],
  [
    "culinary",
    "Culinary Arts",
    "in-person",
    "Kitchen fundamentals through to service: knife work, stocks and sauces, Turkish and international dishes, kitchen hygiene and running a section under pressure.",
    12,
    "On request",
    "Certificate of completion",
    "People heading into professional kitchens, catering, or their own food business.",
  ],
  [
    "entrepreneurship",
    "Entrepreneurship",
    "in-person",
    "Turning a trade into a business: costing and pricing, sourcing, basic bookkeeping, and selling. Built to sit alongside a practical course rather than replace it.",
    6,
    "On request",
    "Certificate of completion",
    "Anyone finishing a vocational course who intends to work for themselves.",
  ],
  [
    "plumbing",
    "Plumbing",
    "in-person",
    "Pipework, fittings, installation and fault-finding for domestic systems, taught practically with tools in hand.",
    8,
    "On request",
    "Certificate of completion",
    "People wanting a licensed trade with steady demand.",
  ],
  [
    "corporate-training",
    "Corporate and Group Training",
    "in-person",
    "Any of the courses above delivered for a group rather than individuals, scoped around what the team actually needs. Content, duration and format are agreed before anything is scheduled.",
    0,
    "On request",
    "Certificate of completion",
    "Organisations, cooperatives and associations training a group together.",
  ],
];

for (const [slug, title, format, summary, weeks, fee, cert, who] of courses) {
  write("content/courses", slug, {
    title,
    placeholder: true,
    reviewedOn: REVIEWED,
    summary,
    format,
    durationWeeks: weeks || null,
    feeBand: fee,
    certification: cert,
    curriculum: [
      p(summary),
      h("How it is taught"),
      p(
        "Hands-on, in a workshop or kitchen in Ankara, in small groups. These are practical trades and they are learned by doing them repeatedly under someone who already does them well."
      ),
      p(
        "Instruction is in English with Turkish support. You do not need Turkish to take a course, though you will pick some up."
      ),
      h("Coming to Türkiye for a short course"),
      p(
        "Most people on these courses travel here for them. That means a short-stay visa rather than a student visa, and we handle the invitation letter and the supporting documents as part of the enrolment."
      ),
      p(
        "We can also arrange accommodation for the duration. Tell us your dates and we will tell you what is available and what it costs."
      ),
      h("What you leave with"),
      p(
        "A certificate of completion and, more importantly, the skill itself. These courses are built around being able to do the work on the last day, not around passing an examination."
      ),
      p(
        "Placeholder detail. The module breakdown, contact hours, workshop capacity and fees must be confirmed with the academy before this page goes live."
      ),
    ],
    whoItIsFor: who,
    seo: { title: "", description: "" },
  });
}

// ── FAQs (MASTERPLAN §3.1 section 9) ────────────────────────

const faqs: Array<[string, string, string[], boolean]> = [
  [
    "do-i-need-to-speak-turkish",
    "Do I need to speak Turkish to study in Türkiye?",
    [
      "Not if you study on an English-taught programme, and there are many of them, particularly at private universities.",
      "You will need Turkish for daily life outside campus, and you will pick some up whether you plan to or not. For a Turkish-taught programme you need Turkish at C1, which means a language year first for almost every international student.",
    ],
    true,
  ],
  [
    "what-is-denklik",
    "What is denklik and why does it take so long?",
    [
      "Denklik is the Turkish recognition of a secondary school qualification issued in another country. Without it, an acceptance letter cannot become an enrolment.",
      "It takes time because your certificate has to be authenticated in the country that issued it first, which is a separate process with its own queue, and only then can it be assessed in Türkiye. Starting it late is the most common reason a student misses an intake.",
    ],
    true,
  ],
  [
    "can-i-work-while-studying",
    "Can I work while studying?",
    [
      "Work rights for international students in Türkiye are limited, and wages in the jobs realistically open to a student are low.",
      "If your plan depends on covering tuition from part-time work, the plan will not survive contact with reality. Budget as though you cannot work, and treat anything you do earn as a bonus.",
    ],
    true,
  ],
  [
    "is-my-degree-recognised-at-home",
    "Is a Turkish degree recognised in my home country?",
    [
      "A degree from a YÖK-accredited Turkish university is widely recognised, but recognition at home is a process run by your own country's regulator rather than something Türkiye grants.",
      "For regulated professions, medicine and dentistry above all, settle this question before you apply rather than after you graduate. We will tell you what the process looks like for your country.",
    ],
    true,
  ],
  [
    "cheapest-realistic-total",
    "What is the cheapest realistic total for one year?",
    [
      "A state university outside Istanbul, in a dormitory, studying in Turkish after a language year, is the genuinely cheap route. It is also the one requiring the most preparation and patience.",
      "We publish cost bands rather than a single figure because the honest answer depends on the city, the university type and how you live. See the costs page.",
    ],
    true,
  ],
  [
    "do-i-need-yos",
    "Do I need the YÖS exam?",
    [
      "Often not. Many private universities do not require YÖS at all, which is one reason they are the more common route for international students.",
      "Where it is required, usually at state universities, it is a real filter and needs real preparation. We will tell you whether the universities on your shortlist ask for it.",
    ],
    true,
  ],
  [
    "what-if-my-visa-is-refused",
    "What happens if my visa is refused?",
    [
      "It is usually a document problem rather than a judgement about you, and the first step is establishing the stated reason.",
      "A refusal does not automatically end the route. This is also why we are as slow and fussy about the document stage as we are: a weak file is much easier to fix before submission than after a refusal.",
    ],
    true,
  ],
  [
    "what-does-your-fee-cover",
    "What exactly does your fee cover, and what does it not?",
    [
      "It covers the eligibility assessment, the shortlist, document preparation and checking, denklik support, the university applications themselves, visa guidance, and support after arrival including enrolment and the residence permit.",
      "It does not cover tuition, accommodation, the visa fee, the residence permit fee, health insurance, translation and notarisation charges, or flights. Those are paid to the universities and the authorities directly, not to us.",
      "Our fee is confirmed at your first consultation and before any payment.",
    ],
    true,
  ],
];

faqs.forEach(([slug, question, answer, onHome], i) => {
  write("content/faqs", slug, {
    question,
    placeholder: true,
    reviewedOn: REVIEWED,
    answer: answer.map((text) => p(text)),
    category: "General",
    order: i,
    showOnHomepage: onHome,
  });
});

console.log(
  "✅ Pages, courses, FAQs and offices written. Team and partners are intentionally empty."
);
