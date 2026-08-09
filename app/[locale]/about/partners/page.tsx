import type { Metadata } from "next";
import { getPartners } from "@/lib/content/reader";
import { Card, PageHero, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Partners and accreditation",
  description:
    "What we can evidence, and what we will not claim. We do not publish a logo wall of universities we have no written agreement with.",
};

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      <PageHero
        eyebrow="About Minaret"
        title="Partners and accreditation"
        intro="Only marks we can evidence appear here."
        trail={[{ label: "About", href: "/about" }, { label: "Partners" }]}
      />

      <Section tone="paper">
        {partners.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <Card key={partner.slug}>
                <h2 className="font-display text-lg text-navy">{partner.entry.name}</h2>
                <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                  {partner.entry.kind}
                </p>
                <p className="mt-3 font-sans text-sm text-ink-soft">
                  {partner.entry.evidence}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-prose">
            <h2 className="font-display text-2xl tracking-tight text-navy">
              Why this page is empty
            </h2>
            <p className="mt-4 font-sans leading-relaxed text-ink-soft">
              Most consultancy websites in this sector carry a wall of university logos.
              In a large number of cases there is no written agreement behind any of them,
              and the logos are there because they look reassuring.
            </p>
            <p className="mt-4 font-sans leading-relaxed text-ink-soft">
              We are not going to do that. A logo goes on this page when there is a
              written agreement we can show you, and not before. Publishing an
              unsubstantiated affiliation is a legal exposure as well as a dishonest one.
            </p>
            <p className="mt-4 font-sans leading-relaxed text-ink-soft">
              What we can tell you today: we place students into YÖK-accredited
              institutions, we are registered in Türkiye, and our registration number is
              published in the footer of every page. Ask us for anything else and we will
              either evidence it or say we cannot.
            </p>
          </div>
        )}
      </Section>

      <CtaPanel
        heading="Ask us anything you want evidenced."
        body="If we cannot show you a document for a claim, we will tell you that rather than repeat the claim."
      />
    </>
  );
}
