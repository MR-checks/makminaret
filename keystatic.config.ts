import { config, fields, collection, singleton } from "@keystatic/core";

/**
 * Keystatic content schema (MASTERPLAN §7, HANDOVER §3 and §4).
 *
 * Two conventions apply to every collection here.
 *
 * `placeholder` (HANDOVER §3.2) marks demo data. It defaults to false, and
 * scripts/generate-placeholders.mjs turns every true into a line in
 * content/PLACEHOLDERS.md. With SITE_MODE=live the build fails while any
 * remain, so shipping fake data is structurally impossible rather than
 * something anybody has to remember.
 *
 * `reviewedOn` (HANDOVER §4.4) is required on every collection carrying
 * factual claims, and renders as "Reviewed August 2026" at the foot of the
 * page. This is a static site updated by hand and infrequently, so the honest
 * move is to show when a claim was last checked rather than to imply it is
 * current. Entries older than 12 months are surfaced in PLACEHOLDERS.md.
 *
 * Every collection uses `format: { data: 'json' }`. Services and articles were
 * previously declared with `format: { contentField }`, which makes Keystatic
 * look for .mdoc files while the repo actually held .json and .yaml. Both
 * collections therefore read as empty, every /services/* URL 404'd, and the
 * content validator never noticed because it did not check them. Keeping one
 * storage format across all eight collections removes that whole failure mode.
 */

const placeholder = fields.checkbox({
  label: "Placeholder",
  description: "Demo data. Replace before going live. Listed in content/PLACEHOLDERS.md.",
  defaultValue: false,
});

const reviewedOn = fields.date({
  label: "Reviewed on",
  description: "When these facts were last checked. Shown on the page.",
  validation: { isRequired: true },
});

const seo = fields.object(
  {
    title: fields.text({ label: "SEO title" }),
    description: fields.text({ label: "SEO description", multiline: true }),
  },
  { label: "SEO" }
);

/**
 * Storage mode.
 *
 * Local mode writes straight to the filesystem, which is fine in development
 * and impossible on Vercel, where the filesystem is read only. That is why
 * /keystatic loaded on the deployment but could never save anything.
 *
 * GitHub mode commits each edit to the repository instead, which is what makes
 * the whole no-database design work: an edit is a commit, the commit triggers a
 * deploy, and content gets version history, diffs and one-click revert for free
 * (MASTERPLAN §8.4).
 *
 * This is gated on the credentials rather than on NODE_ENV, because declaring
 * github mode without them fails the build outright. So it stays in local mode
 * until the four variables below exist, and switches itself the moment they do:
 * add them in Vercel, redeploy, and editing works with no code change.
 *
 *   KEYSTATIC_GITHUB_CLIENT_ID
 *   KEYSTATIC_GITHUB_CLIENT_SECRET
 *   KEYSTATIC_SECRET
 *   NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
 *
 * Editors then sign in with GitHub, so access is governed by repository
 * permissions and there are no separate CMS passwords to manage (§10.4).
 */
const hasGitHubApp = Boolean(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET
);

const storage = hasGitHubApp
  ? ({
      kind: "github",
      repo: { owner: "MR-checks", name: "makminaret" },
    } as const)
  : ({ kind: "local" } as const);

export default config({
  storage,
  ui: {
    brand: { name: "Minaret" },
  },
  singletons: {
    siteSettings: singleton({
      label: "Site Settings",
      path: "content/settings",
      format: { data: "json" },
      schema: {
        brandName: fields.text({ label: "Brand name" }),
        legalName: fields.text({ label: "Legal name" }),
        primaryPhone: fields.text({ label: "Primary phone (Ghana line)" }),
        whatsappNumber: fields.text({ label: "WhatsApp number, digits only" }),
        officePhone: fields.text({ label: "Ankara office landline" }),
        email: fields.text({ label: "Email" }),
        registrationNumber: fields.text({ label: "MERSİS / registration number" }),
        officeAddress: fields.array(fields.text({ label: "Address line" }), {
          label: "Ankara office address",
          itemLabel: (props) => props.value,
        }),
        officeMapsUrl: fields.text({ label: "Maps URL" }),
        officeHours: fields.text({ label: "Office hours" }),
        responseTimePromise: fields.text({ label: "Response time promise" }),
        socials: fields.array(
          fields.object({
            label: fields.text({ label: "Network" }),
            url: fields.text({ label: "URL" }),
          }),
          { label: "Socials", itemLabel: (props) => props.fields.label.value }
        ),
        // Scalar values that are still demo data. HANDOVER §3.2 asks for
        // placeholder tagging on settings.json too, and these are the exact
        // fields the user flagged as unconfirmed.
        placeholderFields: fields.array(fields.text({ label: "Field name" }), {
          label: "Fields still holding placeholder values",
          itemLabel: (props) => props.value,
        }),
      },
    }),
    navigation: singleton({
      label: "Navigation",
      path: "content/navigation",
      format: { data: "json" },
      schema: {
        primary: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            href: fields.text({ label: "URL" }),
            children: fields.array(
              fields.object({
                label: fields.text({ label: "Label" }),
                href: fields.text({ label: "URL" }),
                column: fields.text({ label: "Mega menu column" }),
              }),
              { label: "Children", itemLabel: (props) => props.fields.label.value }
            ),
          }),
          { label: "Primary links", itemLabel: (props) => props.fields.label.value }
        ),
      },
    }),
  },
  collections: {
    pages: collection({
      label: "Pages",
      slugField: "title",
      path: "content/pages/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        placeholder,
        reviewedOn,
        intro: fields.text({ label: "Intro", multiline: true }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: "Heading" }),
            body: fields.document({ label: "Body", formatting: true, links: true }),
          }),
          { label: "Sections", itemLabel: (props) => props.fields.heading.value }
        ),
        seo,
      },
    }),
    team: collection({
      label: "Team",
      slugField: "name",
      path: "content/team/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        placeholder,
        role: fields.text({ label: "Role" }),
        bio: fields.text({ label: "Bio", multiline: true }),
        languages: fields.array(fields.text({ label: "Language" }), {
          label: "Languages",
          itemLabel: (props) => props.value,
        }),
        email: fields.text({ label: "Email" }),
      },
    }),
    offices: collection({
      label: "Offices",
      slugField: "name",
      path: "content/offices/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        placeholder,
        reviewedOn,
        addressLines: fields.array(fields.text({ label: "Line" }), {
          label: "Address",
          itemLabel: (props) => props.value,
        }),
        city: fields.text({ label: "City" }),
        country: fields.text({ label: "Country" }),
        mapsUrl: fields.text({ label: "Maps URL" }),
        hours: fields.text({ label: "Hours" }),
        phone: fields.text({ label: "Phone" }),
        note: fields.text({ label: "Note", multiline: true }),
      },
    }),
    courses: collection({
      label: "Courses",
      slugField: "title",
      path: "content/courses/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        placeholder,
        reviewedOn,
        summary: fields.text({ label: "Summary", multiline: true }),
        format: fields.select({
          label: "Format",
          options: [
            { label: "In person, Ankara", value: "in-person" },
            { label: "Online", value: "online" },
            { label: "Hybrid", value: "hybrid" },
          ],
          defaultValue: "in-person",
        }),
        durationWeeks: fields.integer({ label: "Duration (weeks)" }),
        feeBand: fields.text({ label: "Fee band, USD" }),
        certification: fields.text({ label: "Certification" }),
        curriculum: fields.document({ label: "Curriculum", formatting: true }),
        whoItIsFor: fields.text({ label: "Who it is for", multiline: true }),
        seo,
      },
    }),
    faqs: collection({
      label: "FAQs",
      slugField: "question",
      path: "content/faqs/*",
      format: { data: "json" },
      schema: {
        question: fields.slug({ name: { label: "Question" } }),
        placeholder,
        reviewedOn,
        answer: fields.document({ label: "Answer", formatting: true, links: true }),
        category: fields.text({ label: "Category" }),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
        showOnHomepage: fields.checkbox({
          label: "Show on homepage",
          defaultValue: false,
        }),
      },
    }),
    partners: collection({
      label: "Partners and accreditation",
      slugField: "name",
      path: "content/partners/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        placeholder,
        reviewedOn,
        kind: fields.text({ label: "Kind" }),
        evidence: fields.text({
          label: "Evidence we can show",
          description:
            "MASTERPLAN §4.4 permits only marks that can be evidenced. No entry without this.",
          multiline: true,
        }),
      },
    }),
    universities: collection({
      label: "Universities",
      slugField: "name",
      path: "content/universities/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        placeholder,
        reviewedOn,
        city: fields.text({ label: "City" }),
        type: fields.select({
          label: "Type",
          options: [
            { label: "State", value: "state" },
            { label: "Private", value: "private" },
            { label: "Foundation", value: "foundation" },
          ],
          defaultValue: "foundation",
        }),
        yokAccredited: fields.checkbox({ label: "YÖK accredited", defaultValue: true }),
        foundedYear: fields.integer({ label: "Founded year" }),
        languagesOfInstruction: fields.array(fields.text({ label: "Language" }), {
          label: "Languages of instruction",
          itemLabel: (props) => props.value,
        }),
        // Tuition is a band, not a figure. HANDOVER §4.1 bans exact prices:
        // they change yearly and go stale silently.
        tuitionBand: fields.text({
          label: 'Tuition band, USD (e.g. "$3,500 to $9,000")',
        }),
        overview: fields.document({ label: "Overview", formatting: true, links: true }),
        whoItSuits: fields.text({ label: "Who it suits", multiline: true }),
        entryRequirements: fields.document({
          label: "Entry requirements",
          formatting: true,
        }),
        yosRequired: fields.checkbox({ label: "YÖS required", defaultValue: false }),
        satAccepted: fields.checkbox({ label: "SAT accepted", defaultValue: true }),
        englishRequirement: fields.text({ label: "English requirement" }),
        website: fields.text({ label: "Website URL" }),
        seo,
      },
    }),
    programs: collection({
      label: "Programs",
      slugField: "title",
      path: "content/programs/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        placeholder,
        reviewedOn,
        university: fields.relationship({
          label: "University",
          collection: "universities",
        }),
        level: fields.select({
          label: "Level",
          options: [
            { label: "Foundation", value: "foundation" },
            { label: "Bachelor", value: "bachelor" },
            { label: "Master", value: "master" },
            { label: "PhD", value: "phd" },
          ],
          defaultValue: "bachelor",
        }),
        field: fields.relationship({ label: "Field", collection: "fields" }),
        language: fields.text({
          label: "Language of instruction",
          defaultValue: "English",
        }),
        durationYears: fields.integer({ label: "Duration (years)" }),
        tuitionBand: fields.text({ label: "Tuition band per year, USD" }),
        scholarshipAvailable: fields.checkbox({
          label: "Scholarship available",
          defaultValue: true,
        }),
        description: fields.document({
          label: "Description",
          formatting: true,
          links: true,
        }),
        entryRequirements: fields.document({
          label: "Entry requirements",
          formatting: true,
        }),
        careerOutcomes: fields.text({ label: "Career outcomes", multiline: true }),
        documentsRequired: fields.array(fields.text({ label: "Document" }), {
          label: "Documents required",
          itemLabel: (props) => props.value,
        }),
        seo,
      },
    }),
    fields: collection({
      label: "Fields of Study",
      slugField: "name",
      path: "content/fields/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        placeholder,
        icon: fields.text({ label: "Icon (Lucide name)" }),
        description: fields.text({ label: "Description", multiline: true }),
      },
    }),
    scholarships: collection({
      label: "Scholarships",
      slugField: "name",
      path: "content/scholarships/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        placeholder,
        reviewedOn,
        type: fields.select({
          label: "Type",
          options: [
            { label: "Government", value: "government" },
            { label: "University", value: "university" },
            { label: "External", value: "external" },
          ],
          defaultValue: "university",
        }),
        provider: fields.text({ label: "Provider" }),
        coverageBand: fields.text({
          label: 'Coverage band (e.g. "25% to 75% of tuition")',
        }),
        coversTuition: fields.checkbox({ label: "Covers tuition" }),
        coversAccommodation: fields.checkbox({ label: "Covers accommodation" }),
        coversStipend: fields.checkbox({ label: "Covers stipend" }),
        eligibility: fields.document({ label: "Eligibility", formatting: true }),
        // Deliberately no deadline field. HANDOVER §4.1 bans dated windows and
        // §4.5 prefers explaining how a thing works with a link to the official
        // source, because explanation ages slowly and dates do not.
        applicationWindowNote: fields.text({
          label: "How the application window works (no specific dates)",
          multiline: true,
        }),
        officialUrl: fields.text({ label: "Official source URL" }),
        howWeHelp: fields.text({ label: "How we help", multiline: true }),
        seo,
      },
    }),
    stories: collection({
      label: "Stories",
      slugField: "title",
      path: "content/stories/*",
      format: { data: "json" },
      schema: {
        // Not a student name. While placeholder is true these are unnamed
        // cards: HANDOVER §3.6 is absolute that no stock photo of a person may
        // be captioned as a Minaret student, and a named fake testimonial
        // forwarded on WhatsApp is not retractable.
        title: fields.slug({ name: { label: "Internal title" } }),
        placeholder,
        reviewedOn,
        studentName: fields.text({
          label: "Student name (leave empty while placeholder)",
        }),
        homeCountry: fields.relationship({
          label: "Home country",
          collection: "countries",
        }),
        university: fields.relationship({
          label: "University",
          collection: "universities",
        }),
        program: fields.relationship({ label: "Program", collection: "programs" }),
        quote: fields.document({ label: "Quote", formatting: true }),
        consentOnFile: fields.checkbox({
          label: "Consent on file",
          description: "A story naming a real person cannot be published without this.",
          defaultValue: false,
        }),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
      },
    }),
    articles: collection({
      label: "Articles",
      slugField: "title",
      path: "content/articles/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        placeholder,
        reviewedOn,
        excerpt: fields.text({ label: "Excerpt", multiline: true }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Study in Türkiye", value: "study-in-turkiye" },
            { label: "University Guides", value: "university-guides" },
            { label: "Scholarships", value: "scholarships" },
            { label: "Visa & Residence", value: "visa-and-residence" },
            { label: "Student Life", value: "student-life" },
          ],
          defaultValue: "study-in-turkiye",
        }),
        body: fields.document({
          label: "Body",
          formatting: true,
          dividers: true,
          links: true,
        }),
        seo,
      },
    }),
    countries: collection({
      label: "Countries",
      slugField: "name",
      path: "content/countries/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        placeholder,
        reviewedOn,
        isoCode: fields.text({ label: "ISO code" }),
        dialCode: fields.text({ label: "Dial code" }),
        secondaryCertificate: fields.text({ label: "Secondary certificate" }),
        certificateNotes: fields.document({
          label: "Certificate notes",
          formatting: true,
        }),
        denklikRoute: fields.document({ label: "Denklik route", formatting: true }),
        // Prose, not a number of weeks. HANDOVER §4.1 rules out exact
        // turnarounds: they vary by embassy load and by season.
        denklikTimingNote: fields.text({
          label: "Denklik timing, qualified",
          multiline: true,
        }),
        authenticationOffice: fields.object(
          {
            name: fields.text({ label: "Office name" }),
            address: fields.text({ label: "Address", multiline: true }),
            process: fields.text({ label: "Process", multiline: true }),
            timingNote: fields.text({ label: "Timing, qualified", multiline: true }),
          },
          { label: "Document authentication office" }
        ),
        turkishEmbassy: fields.object(
          {
            city: fields.text({ label: "City" }),
            address: fields.text({ label: "Address", multiline: true }),
            appointmentNotes: fields.text({
              label: "Appointment notes",
              multiline: true,
            }),
          },
          { label: "Turkish embassy" }
        ),
        flightRoutings: fields.document({ label: "Flight routings", formatting: true }),
        seo,
      },
    }),
    services: collection({
      label: "Services",
      slugField: "title",
      path: "content/services/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        placeholder,
        reviewedOn,
        division: fields.text({ label: "Division" }),
        summary: fields.text({ label: "Summary", multiline: true }),
        whoItIsFor: fields.text({ label: "Who it is for", multiline: true }),
        serviceItems: fields.array(fields.text({ label: "Item" }), {
          label: "Service items",
          itemLabel: (props) => props.value,
        }),
        whatWeDo: fields.document({ label: "What we do", formatting: true, links: true }),
        process: fields.array(
          fields.object({
            title: fields.text({ label: "Step title" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          { label: "How we work", itemLabel: (props) => props.fields.title.value }
        ),
        seo,
      },
    }),
  },
});
