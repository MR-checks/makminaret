import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import {
  documentText,
  getFaqs,
  getPages,
  getScholarships,
  getStories,
} from "@/lib/content/reader";
import { getJoinedPrograms } from "@/lib/data/programs";
import { getSiteUrl } from "@/lib/site-mode";
import { Card, Section } from "@/components/page/PageChrome";
import { CostTable } from "@/components/blocks/CostTable";
import { CtaPanel, WhatsAppLink } from "@/components/page/Cta";
import { HeroSection } from "@/components/home/HeroSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { FaqAccordion } from "@/components/home/FaqAccordion";

// No `revalidate`. Content lives in the repo, so a content edit is a commit and
// the commit triggers a deploy; there is no ISR to schedule (MASTERPLAN §8.3).

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const DIVISIONS = [
  { label: "Skills Academy", href: "/skills-academy" },
  { label: "Business Consultancy", href: "/services/business-consultancy" },
  { label: "Import and Export", href: "/services/import-export-advisory" },
  { label: "Publishing and Printing", href: "/services/book-publishing" },
  { label: "School Supplies", href: "/services/school-supplies" },
];

export default async function HomePage() {
  const [programs, stories, scholarships, faqs, pages] = await Promise.all([
    getJoinedPrograms(),
    getStories(),
    getScholarships(),
    getFaqs(),
    getPages(),
  ]);

  const costsPage = pages.find((p) => p.slug === "costs");
  const reviewLabel = costsPage?.entry.reviewedOn
    ? new Date(costsPage.entry.reviewedOn).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : "recently";

  const topPrograms = programs.slice(0, 3);

  const topStories = (
    await Promise.all(
      stories.slice(0, 3).map(async (s) => ({
        slug: s.slug,
        name: s.entry.studentName || null,
        quote: await documentText(s.entry.quote),
      }))
    )
  ).filter((s) => s.quote);

  const homepageFaqs = (
    await Promise.all(
      faqs
        .filter((f) => f.entry.showOnHomepage)
        .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0))
        .map(async (f) => ({
          slug: f.slug,
          question: f.entry.question,
          answer: (await documentText(f.entry.answer)) ?? "",
        }))
    )
  ).filter((f) => f.answer);

  // FAQPage and Organization schema (MASTERPLAN §11.3). Rendered as a data
  // block, which browsers do not execute, so it needs no CSP nonce.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Minaret Educational Consultancy",
        legalName: "MAK Minaret",
        url: getSiteUrl(),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ankara",
          addressCountry: "TR",
        },
        telephone: "+233240101057",
        email: "info@makminaret.com",
      },
      {
        "@type": "FAQPage",
        mainEntity: homepageFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection />
      <ProcessSection />

      <Section
        tone="sand"
        eyebrow="Choose"
        heading="Programmes we place into"
        id="programs"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {topPrograms.map((program) => (
            <Card key={program.slug} className="hover:border-navy">
              <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                {program.level}
              </p>
              <h3 className="mt-2 font-display text-lg text-navy">
                <Link href={`/programs/${program.slug}`}>{program.title}</Link>
              </h3>
              <p className="mt-1 font-sans text-sm text-slate">
                {program.universityName}
              </p>
              <p className="mt-4 font-mono text-[0.8125rem] text-ink-soft">
                {program.tuitionBand} per year
              </p>
              <p className="font-mono text-[0.8125rem] text-slate">
                {program.city} · taught in {program.language}
              </p>
            </Card>
          ))}
        </div>
        <Link
          href="/programs"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm border border-navy px-5 font-sans text-sm font-medium text-navy transition-colors hover:bg-paper"
        >
          Open the full finder
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Section>

      <Section tone="paper" eyebrow="Pay for it" heading="What a year actually costs">
        <CostTable reviewedOn={reviewLabel} />
        <p className="mt-6 max-prose font-sans text-slate">
          No hidden fees and no &ldquo;contact us for pricing&rdquo;. Our own fee is
          confirmed at your first consultation and before any payment.
        </p>
        <Link
          href="/costs"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm border border-navy px-5 font-sans text-sm font-medium text-navy transition-colors hover:bg-sand"
        >
          What our fee covers
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Section>

      <Section tone="sand" eyebrow="Pay for it" heading="Two kinds of scholarship">
        <div className="grid gap-6 md:grid-cols-2">
          {scholarships.map((s) => (
            <Card key={s.slug} className="hover:border-navy">
              <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                {s.entry.type === "government" ? "Government" : "University"}
              </p>
              <h3 className="mt-2 font-display text-xl text-navy">
                <Link href={`/scholarships/${s.slug}`}>{s.entry.name}</Link>
              </h3>
              <p className="mt-2 font-mono text-[0.8125rem] text-ink-soft">
                {s.entry.coverageBand}
              </p>
              <p className="mt-3 font-sans text-sm text-ink-soft">{s.entry.howWeHelp}</p>
            </Card>
          ))}
        </div>
      </Section>

      {topStories.length > 0 && (
        <Section tone="paper" eyebrow="Proof" heading="Students we placed">
          <div className="grid gap-6 md:grid-cols-3">
            {topStories.map((story) => (
              <Card key={story.slug}>
                <blockquote className="font-sans leading-relaxed text-ink-soft">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <p className="mt-4 font-sans font-bold text-navy">
                  {story.name ?? "Name withheld until consent is recorded"}
                </p>
              </Card>
            ))}
          </div>
          <Link
            href="/stories"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm border border-navy px-5 font-sans text-sm font-medium text-navy transition-colors hover:bg-sand"
          >
            All student stories
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Section>
      )}

      {/* Deliberately subordinate (MASTERPLAN §3.1 section 8): one compact
          band, muted, no icons in circles, no hover lift. It exists so a
          returning business client can find their way, and it must not compete
          with the education message. */}
      <Section tone="sand" heading="Also from Minaret">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {DIVISIONS.map((division) => (
            <li key={division.href}>
              <Link
                href={division.href}
                className="font-sans text-sm text-slate transition-colors hover:text-navy"
              >
                {division.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {homepageFaqs.length > 0 && (
        <Section tone="paper" eyebrow="Questions" heading="The ones people actually ask">
          <FaqAccordion items={homepageFaqs} />
        </Section>
      )}

      <CtaPanel />
    </>
  );
}
