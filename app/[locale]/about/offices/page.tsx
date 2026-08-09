import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { getOffices } from "@/lib/content/reader";
import { Card, PageHero, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Offices",
  description:
    "We operate from Ankara, Türkiye. Being inside the country is the reason we can handle denklik, enrolment and the residence permit in person.",
};

export default async function OfficesPage() {
  const offices = await getOffices();

  return (
    <>
      <PageHero
        eyebrow="About Minaret"
        title="Where we are"
        intro="Ankara, Türkiye. Not Accra, not Lagos. That is the difference between forwarding your documents and handling them."
        trail={[{ label: "About", href: "/about" }, { label: "Offices" }]}
      />

      <Section tone="paper">
        <div className="grid gap-6 md:grid-cols-2">
          {offices.map((office) => (
            <Card key={office.slug}>
              <h2 className="font-display text-xl text-navy">{office.entry.name}</h2>
              <p className="mt-3 flex items-start gap-2 font-sans text-sm text-ink-soft">
                <MapPin
                  size={16}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-slate"
                />
                <span>
                  {(office.entry.addressLines ?? []).filter(Boolean).join(", ")}
                </span>
              </p>
              {office.entry.hours && (
                <p className="mt-2 font-sans text-sm text-ink-soft">
                  {office.entry.hours}
                </p>
              )}
              {office.entry.note && (
                <p className="mt-4 rounded-sm border border-rule bg-sand p-4 font-sans text-sm text-ink-soft">
                  {office.entry.note}
                </p>
              )}
              <ReviewStamp date={office.entry.reviewedOn} className="mt-4" />
            </Card>
          ))}
        </div>

        <div className="mt-10 max-prose">
          <h2 className="font-display text-2xl tracking-tight text-navy">Visiting</h2>
          <p className="mt-4 font-sans leading-relaxed text-ink-soft">
            Families are welcome to visit the office, and we would encourage it if you are
            able to. Message us first so somebody who speaks your language is there.
          </p>
          <p className="mt-4 font-sans leading-relaxed text-ink-soft">
            We use a static map image rather than an embedded live map, because an embed
            costs real performance on a mid-range phone and sets third-party cookies for
            no benefit to you.
          </p>
        </div>
      </Section>

      <CtaPanel heading="Come and see us." body="Or start with two minutes online." />
    </>
  );
}
