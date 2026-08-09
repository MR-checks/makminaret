import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/lib/content/reader";
import { Card, PageHero, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Business consultancy, import and export advisory, publishing and printing, and school supplies. The rest of the group, kept deliberately simpler than the education pages.",
};

export default async function ServicesIndexPage() {
  const services = await getServices();
  const byDivision = services.reduce<Record<string, typeof services>>((acc, service) => {
    const division = service.entry.division || "Other";
    (acc[division] ||= []).push(service);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="Also from Minaret"
        title="Services"
        intro="Education is the flagship and carries most of our attention. These divisions exist because they serve the same institutions and the same relationships."
        trail={[{ label: "Services" }]}
      />

      {Object.entries(byDivision).map(([division, items], i) => (
        <Section key={division} tone={i % 2 === 0 ? "paper" : "sand"} heading={division}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <Card key={service.slug} className="hover:border-navy">
                <h3 className="font-display text-lg text-navy">
                  <Link href={`/services/${service.slug}`}>{service.entry.title}</Link>
                </h3>
                <p className="mt-3 font-sans text-sm text-ink-soft">
                  {service.entry.summary}
                </p>
                <ReviewStamp date={service.entry.reviewedOn} className="mt-4" />
              </Card>
            ))}
          </div>
        </Section>
      ))}

      <CtaPanel
        heading="Tell us what you need."
        body="Scope, quantities and timelines. We come back with what is achievable and what it costs."
        context="Hi, I would like to ask about your business services."
      />
    </>
  );
}
