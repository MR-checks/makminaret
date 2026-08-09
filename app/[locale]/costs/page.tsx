import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { documentNodes, getPage } from "@/lib/content/reader";
import { PageHero, Prose, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CostTable } from "@/components/blocks/CostTable";
import { CtaPanel } from "@/components/page/Cta";
import { buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("costs", "Tuition and costs");
}

/**
 * Static USD band table with a visible review stamp (HANDOVER §4.3).
 *
 * There is deliberately no calculator and no local-currency conversion. Rates
 * move weekly, a stale rate on a costs page is the worst place to be wrong, and
 * a calculator needs more maintenance than anything else on a site like this.
 */
export default async function CostsPage() {
  const entry = await getPage("costs");
  const reviewedOn = entry?.reviewedOn ?? null;
  const reviewLabel = reviewedOn
    ? new Date(reviewedOn).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "recently";

  const sections = await Promise.all(
    (entry?.sections ?? []).map(async (s) => ({
      heading: s.heading,
      nodes: await documentNodes(s.body),
    }))
  );

  return (
    <>
      <PageHero
        eyebrow="Pay for it"
        title={entry?.title ?? "Tuition and costs"}
        intro={entry?.intro}
        trail={[{ label: "Tuition and costs" }]}
      />

      <Section tone="paper" heading="What a year costs">
        <CostTable reviewedOn={reviewLabel} />
        <p className="mt-6 max-prose font-sans text-sm text-slate">
          These are bands, not quotes. Where you study matters as much as what you study:
          a lower tuition figure in Istanbul can total more across a year than a higher
          one in a smaller city.
        </p>
        <div className="mt-8">
          <Link
            href="/eligibility"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
          >
            See which programmes fit your budget
          </Link>
        </div>
      </Section>

      <Section tone="sand">
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-2xl tracking-tight text-navy md:text-3xl">
                {section.heading}
              </h2>
              <Prose nodes={section.nodes} />
            </div>
          ))}
          <ReviewStamp date={reviewedOn} />
        </div>
      </Section>

      <CtaPanel
        heading="Get a figure that applies to you."
        body="The bands above are the honest general answer. Two minutes gets you a shortlist priced against your own budget."
      />
    </>
  );
}
