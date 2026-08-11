import { reader } from "../lib/content/reader";

/**
 * Collections that are legitimately empty right now, with the reason. Anything
 * not on this list failing the zero check is a schema or file-format mistake.
 */
const INTENTIONALLY_EMPTY: Record<string, string> = {
  team: "A fabricated colleague is an invented person (HANDOVER §5). Named profiles land when real ones exist.",
  partners: "MASTERPLAN §4.4 permits only accreditation marks that can be evidenced.",
  universities:
    "Only institutions we hold a written agreement with may be named. Publishing the rest promotes them at the expense of our actual partners, and MASTERPLAN §3.1 treats an unevidenced affiliation as a legal exposure rather than a taste issue. Add partners here as contracts are signed.",
  programs:
    "Superseded by subjects on the fields collection. We publish what can be studied rather than whose campus it sits on.",
};

/**
 * Build-time content validation (MASTERPLAN §7, Phase 3 acceptance).
 *
 * The previous version checked five collections and ignored services,
 * articles and scholarships entirely. That is why it reported success while
 * services and articles both read as zero entries and every /services/* URL
 * returned a 404: the one class of error this script exists to catch was in a
 * collection it never looked at.
 *
 * It now walks every collection, fails on a broken slug reference, and fails
 * on an empty collection, since an empty collection is almost always a schema
 * or file-format mistake rather than an intentional state.
 */

type Problem = string;

async function validateContent() {
  console.log("🔍 Validating content…");
  const problems: Problem[] = [];

  const [
    universities,
    programs,
    fields,
    countries,
    stories,
    scholarships,
    articles,
    services,
    pages,
    courses,
    faqs,
    offices,
    team,
    partners,
  ] = await Promise.all([
    reader.collections.universities.all(),
    reader.collections.programs.all(),
    reader.collections.fields.all(),
    reader.collections.countries.all(),
    reader.collections.stories.all(),
    reader.collections.scholarships.all(),
    reader.collections.articles.all(),
    reader.collections.services.all(),
    reader.collections.pages.all(),
    reader.collections.courses.all(),
    reader.collections.faqs.all(),
    reader.collections.offices.all(),
    reader.collections.team.all(),
    reader.collections.partners.all(),
  ]);

  const counts: Record<string, number> = {
    universities: universities.length,
    programs: programs.length,
    fields: fields.length,
    countries: countries.length,
    stories: stories.length,
    scholarships: scholarships.length,
    articles: articles.length,
    services: services.length,
    pages: pages.length,
    courses: courses.length,
    faqs: faqs.length,
    offices: offices.length,
    team: team.length,
    partners: partners.length,
  };

  for (const [name, count] of Object.entries(counts)) {
    if (count === 0 && !(name in INTENTIONALLY_EMPTY)) {
      problems.push(
        `Collection "${name}" read zero entries. Check that the files on disk match the format declared in keystatic.config.ts.`
      );
    }
  }

  const universitySlugs = new Set(universities.map((u) => u.slug));
  const fieldSlugs = new Set(fields.map((f) => f.slug));
  const programSlugs = new Set(programs.map((p) => p.slug));
  const countrySlugs = new Set(countries.map((c) => c.slug));

  const checkRef = (
    where: string,
    label: string,
    value: string | null | undefined,
    valid: Set<string>
  ) => {
    if (value && !valid.has(value)) {
      problems.push(`${where}: ${label} "${value}" does not exist.`);
    }
  };

  for (const program of programs) {
    checkRef(
      `Program "${program.slug}"`,
      "university",
      program.entry.university,
      universitySlugs
    );
    checkRef(`Program "${program.slug}"`, "field", program.entry.field, fieldSlugs);
  }

  for (const story of stories) {
    checkRef(
      `Story "${story.slug}"`,
      "university",
      story.entry.university,
      universitySlugs
    );
    checkRef(`Story "${story.slug}"`, "program", story.entry.program, programSlugs);
    checkRef(
      `Story "${story.slug}"`,
      "homeCountry",
      story.entry.homeCountry,
      countrySlugs
    );

    // HANDOVER §3.6 and MASTERPLAN §7: a story naming a real person cannot be
    // published without recorded consent. A named story without it is the one
    // content error that is not retractable once forwarded on WhatsApp.
    if (story.entry.studentName && !story.entry.consentOnFile) {
      problems.push(
        `Story "${story.slug}" names a student but consentOnFile is false. Either record consent or remove the name.`
      );
    }
  }

  // reviewedOn is required on every collection carrying factual claims (§4.4).
  const needsReview: Array<
    [string, Array<{ slug: string; entry: { reviewedOn?: string | null } }>]
  > = [
    ["universities", universities],
    ["programs", programs],
    ["scholarships", scholarships],
    ["countries", countries],
    ["services", services],
    ["articles", articles],
    ["stories", stories],
    ["pages", pages],
    ["courses", courses],
    ["faqs", faqs],
    ["offices", offices],
  ];
  for (const [name, entries] of needsReview) {
    for (const entry of entries) {
      if (!entry.entry.reviewedOn) {
        problems.push(`${name}/${entry.slug} is missing reviewedOn.`);
      }
    }
  }

  const summary = Object.entries(counts)
    .map(([k, v]) => `${k} ${v}`)
    .join(", ");
  console.log(`   ${summary}`);

  if (problems.length > 0) {
    console.error(`\n💥 Content validation failed with ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`   ✗ ${problem}`);
    process.exit(1);
  }

  console.log("✅ Content validation passed.");
}

validateContent().catch((err) => {
  console.error("❌ Failed to read content during validation:", err);
  process.exit(1);
});
