import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { documentText, getScholarships } from "@/lib/content/reader";
import { Card, PageHero, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Scholarships",
  description:
    "Two tiers, kept clearly separate: the government full ride, and the university tuition waivers where most students actually get money.",
};

const TIERS = [
  {
    type: "government",
    heading: "Government scholarships",
    blurb:
      "Full funding, highly competitive, one application window a year, and the programme places you rather than you choosing freely.",
  },
  {
    type: "university",
    heading: "University tuition waivers",
    blurb:
      "Far more attainable, awarded with the admission decision, and where the majority of our students actually receive money. Worth equal attention.",
  },
] as const;

export default async function ScholarshipsPage() {
  const scholarships = await getScholarships();
  const withText = await Promise.all(
    scholarships.map(async (s) => ({
      slug: s.slug,
      entry: s.entry,
      eligibility: await documentText(s.entry.eligibility),
    }))
  );

  return (
    <>
      <PageHero
        eyebrow="Pay for it"
        title="Scholarships"
        intro="Students confuse these two constantly, so we keep them apart. One is a full ride you probably will not get. The other is a discount you quite possibly will."
        trail={[{ label: "Scholarships" }]}
      />

      {TIERS.map((tier, i) => {
        const items = withText.filter((s) => s.entry.type === tier.type);
        if (items.length === 0) return null;
        return (
          <Section
            key={tier.type}
            tone={i % 2 === 0 ? "paper" : "sand"}
            heading={tier.heading}
          >
            <p className="max-prose font-sans text-slate">{tier.blurb}</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {items.map((s) => (
                <Card key={s.slug} className="hover:border-navy">
                  <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                    {s.entry.provider}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-navy">
                    <Link href={`/scholarships/${s.slug}`}>{s.entry.name}</Link>
                  </h3>
                  <p className="mt-2 font-mono text-[0.8125rem] text-ink-soft">
                    {s.entry.coverageBand}
                  </p>
                  {s.eligibility && (
                    <p className="mt-3 line-clamp-4 font-sans text-sm text-ink-soft">
                      {s.eligibility}
                    </p>
                  )}
                  <ReviewStamp date={s.entry.reviewedOn} className="mt-4" />
                </Card>
              ))}
            </div>
          </Section>
        );
      })}

      <CtaPanel
        heading="Find out which of these you are actually in range for."
        body="We will tell you whether a government application is worth your time, or whether a tuition waiver is the realistic route."
      />
    </>
  );
}
