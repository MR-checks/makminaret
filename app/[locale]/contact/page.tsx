import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  documentNodes,
  getOffices,
  getPage,
  getSiteSettings,
} from "@/lib/content/reader";
import {
  Card,
  PageHero,
  Prose,
  ReviewStamp,
  Section,
} from "@/components/page/PageChrome";
import { WhatsAppLink } from "@/components/page/Cta";
import { CallbackForm, ContactForm } from "@/components/forms/ContactForms";
import { OfficeHours } from "@/components/layout/OfficeHours";
import { buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact", "Contact");
}

export default async function ContactPage() {
  const [entry, settings, offices] = await Promise.all([
    getPage("contact"),
    getSiteSettings(),
    getOffices(),
  ]);

  const sections = await Promise.all(
    (entry?.sections ?? []).map(async (s) => ({
      heading: s.heading,
      nodes: await documentNodes(s.body),
    }))
  );

  const address = offices[0]?.entry.addressLines?.filter(Boolean) ?? [];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={entry?.title ?? "Contact"}
        intro={entry?.intro}
        trail={[{ label: "Contact" }]}
      >
        <div className="flex flex-wrap gap-3">
          <WhatsAppLink context="Hi, I would like to ask about studying in Türkiye." />
          {settings?.primaryPhone && (
            <a
              href={`tel:${settings.primaryPhone.replace(/\s/g, "")}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-paper/30 px-6 font-sans text-sm font-medium text-paper transition-colors hover:bg-paper/10"
            >
              <Phone size={18} aria-hidden="true" />
              {settings.primaryPhone}
            </a>
          )}
        </div>
      </PageHero>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <h2 className="font-display text-2xl tracking-tight text-navy md:text-3xl">
              Send us a message
            </h2>
            <p className="mt-3 max-prose font-sans text-slate">
              Tell us what you want to study, roughly what your grades were, and what you
              can spend. That is enough for a useful first answer.
            </p>
            <div className="mt-8 max-w-xl">
              <ContactForm />
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <Card>
              <h2 className="font-display text-lg text-navy">The office</h2>
              <div className="mt-4 flex flex-col gap-3 font-sans text-sm text-ink-soft">
                {address.length > 0 && (
                  <p className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-slate"
                    />
                    <span>{address.join(", ")}</span>
                  </p>
                )}
                {settings?.email && (
                  <p className="flex items-center gap-2">
                    <Mail size={16} aria-hidden="true" className="shrink-0 text-slate" />
                    <a href={`mailto:${settings.email}`} className="hover:text-navy">
                      {settings.email}
                    </a>
                  </p>
                )}
                {settings?.whatsappNumber && (
                  <p className="flex items-center gap-2">
                    <MessageCircle
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-slate"
                    />
                    <span>{settings.primaryPhone} on WhatsApp</span>
                  </p>
                )}
              </div>
              {offices[0]?.entry.hours && (
                <p className="mt-4 font-sans text-sm text-ink-soft">
                  {offices[0].entry.hours}
                </p>
              )}
              <p className="mt-4 font-sans text-sm text-slate">
                {settings?.responseTimePromise}
              </p>
            </Card>

            <Card>
              <h2 className="font-display text-lg text-navy">Book a callback</h2>
              <p className="mt-2 font-sans text-sm text-slate">
                Pick a window in your own local time. We will confirm before calling.
              </p>
              <div className="mt-6">
                <CallbackForm />
              </div>
            </Card>
          </aside>
        </div>
      </Section>

      {sections.length > 0 && (
        <Section tone="sand">
          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-2xl tracking-tight text-navy">
                  {section.heading}
                </h2>
                <Prose nodes={section.nodes} />
              </div>
            ))}
            <ReviewStamp date={entry?.reviewedOn} />
          </div>
        </Section>
      )}
    </>
  );
}
