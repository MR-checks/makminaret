import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentNodes, getScholarship, getScholarships } from "@/lib/content/reader";
import {
  Card,
  DefinitionList,
  PageHero,
  Prose,
  ReviewStamp,
  Section,
} from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export async function generateStaticParams() {
  const all = await getScholarships();
  return all.map((s) => ({ locale: "en", slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getScholarship(slug);
  if (!entry) return {};
  return {
    title: entry.seo?.title || entry.name,
    description: entry.seo?.description || `How ${entry.name} works and how we help.`,
  };
}

export default async function ScholarshipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getScholarship(slug);
  if (!entry) notFound();

  const eligibility = await documentNodes(entry.eligibility);

  return (
    <>
      <PageHero
        eyebrow={
          entry.type === "government" ? "Government scholarship" : "University waiver"
        }
        title={entry.name}
        intro={entry.coverageBand}
        trail={[{ label: "Scholarships", href: "/scholarships" }, { label: entry.name }]}
      />

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <h2 className="font-display text-2xl tracking-tight text-navy">
              How it works
            </h2>
            <Prose nodes={eligibility} />

            <h2 className="mt-10 font-display text-2xl tracking-tight text-navy">
              When to apply
            </h2>
            <p className="mt-4 max-prose font-sans leading-relaxed text-ink-soft">
              {entry.applicationWindowNote}
            </p>

            <h2 className="mt-10 font-display text-2xl tracking-tight text-navy">
              How we help
            </h2>
            <p className="mt-4 max-prose font-sans leading-relaxed text-ink-soft">
              {entry.howWeHelp}
            </p>

            <ReviewStamp date={entry.reviewedOn} className="mt-10" />
          </div>

          <aside>
            <Card>
              <h2 className="font-display text-lg text-navy">At a glance</h2>
              <div className="mt-4">
                <DefinitionList
                  items={[
                    { term: "Provider", value: entry.provider },
                    { term: "Coverage", value: entry.coverageBand },
                    {
                      term: "Tuition",
                      value: entry.coversTuition ? "Covered" : "Not covered",
                    },
                    {
                      term: "Accommodation",
                      value: entry.coversAccommodation ? "Covered" : "Not covered",
                    },
                    { term: "Stipend", value: entry.coversStipend ? "Included" : "None" },
                  ]}
                />
              </div>
              {entry.officialUrl && (
                <a
                  href={entry.officialUrl}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-sm border border-navy px-4 font-sans text-sm font-medium text-navy transition-colors hover:bg-sand"
                >
                  Official source
                </a>
              )}
            </Card>
          </aside>
        </div>
      </Section>

      <CtaPanel />
    </>
  );
}
