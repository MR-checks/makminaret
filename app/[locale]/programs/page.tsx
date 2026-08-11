import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getCourses, getFields } from "@/lib/content/reader";
import { PageHero, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";
import { SubjectFinder } from "@/components/programs/SubjectFinder";

export const metadata: Metadata = {
  title: "What you can study",
  description:
    "Subjects taught in Türkiye, by field and by level. Tell us what you want to study and we will tell you honestly whether it is worth doing here.",
};

/**
 * Subjects, not university listings.
 *
 * This page used to name institutions. It no longer does: presenting
 * universities we hold no written agreement with advertises them for free at
 * the expense of the ones we actually have contracts with, and MASTERPLAN §3.1
 * already treats an unevidenced affiliation as a legal exposure rather than a
 * matter of taste. Which university a student ends up at is the outcome of a
 * consultation, not a browse.
 *
 * There are deliberately no per-subject detail pages either. 124 near-identical
 * templated pages is the exact pattern §3.4 warns against.
 */
export default async function ProgramsPage() {
  const [fieldEntries, courses] = await Promise.all([getFields(), getCourses()]);

  const fields = fieldEntries
    .map((f) => ({
      slug: f.slug,
      name: f.entry.name,
      description: f.entry.description ?? "",
      subjects: [...(f.entry.subjects ?? [])],
      mastersSubjects: [...(f.entry.mastersSubjects ?? [])],
      reviewedOn: f.entry.reviewedOn ?? null,
    }))
    // "Something else" belongs last wherever it appears.
    .sort((a, b) => (a.slug === "other" ? 1 : b.slug === "other" ? -1 : 0));

  const vocational = courses.map((c) => ({
    slug: c.slug,
    title: c.entry.title,
    summary: c.entry.summary ?? "",
  }));

  const reviewedOn = fields.find((f) => f.reviewedOn)?.reviewedOn ?? null;

  return (
    <>
      <PageHero
        eyebrow="Choose"
        title="What you can study"
        intro="Subjects taught in Türkiye, grouped by field. Some things are deliberately not on this list, because they do not transfer home well and we would rather say so than sell you years you cannot use."
        trail={[{ label: "What you can study" }]}
      />

      <Section tone="paper">
        <SubjectFinder fields={fields} vocational={vocational} />
        <ReviewStamp date={reviewedOn} className="mt-10" />
      </Section>

      <Section tone="sand" heading="Why there are no university names here">
        <div className="max-prose">
          <p className="font-sans leading-relaxed text-ink-soft">
            Most consultancy sites list institutions they have no agreement with, because
            a long list looks reassuring. We are not doing that. Naming a university we do
            not represent advertises it for free at the expense of the ones we actually
            hold contracts with, and it implies a relationship that does not exist.
          </p>
          <p className="mt-4 font-sans leading-relaxed text-ink-soft">
            Which university suits you depends on your grades, your budget, the language
            you can study in and the city you can afford to live in. That is a
            conversation, and it is the one we are useful for. Tell us the subject and we
            will come back with a shortlist matched to your file.
          </p>
          <Link
            href="/eligibility"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm bg-seal px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
          >
            Tell us what you want to study
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Section>

      <CtaPanel />
    </>
  );
}
