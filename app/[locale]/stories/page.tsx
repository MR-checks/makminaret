import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { documentText, getStories } from "@/lib/content/reader";
import { Card, PageHero, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Student stories",
  description:
    "Accounts from students we placed, published with written consent. Where consent is not yet recorded, the story stays unnamed.",
};

export default async function StoriesPage() {
  const stories = await getStories();
  const cards = (
    await Promise.all(
      stories.map(async (s) => ({
        slug: s.slug,
        name: s.entry.studentName || null,
        isPlaceholder: s.entry.placeholder === true,
        quote: await documentText(s.entry.quote),
      }))
    )
  ).filter((s) => s.quote);

  return (
    <>
      <PageHero
        eyebrow="Choose"
        title="Student stories"
        intro="Real people at real universities, published with written consent. Nothing here is a stock photograph with a name attached to it."
        trail={[{ label: "Student stories" }]}
      />

      <Section tone="paper">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((story) => (
            <Card key={story.slug}>
              <div className="mb-5 grid aspect-square place-items-center rounded-sm border border-rule bg-sand p-6 text-center">
                <span className="font-mono text-xs uppercase tracking-[0.04em] text-slate">
                  Photograph pending consent
                </span>
              </div>
              <blockquote className="font-sans leading-relaxed text-ink-soft">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <p className="mt-4 font-sans font-bold text-navy">
                {story.name ?? "Name withheld until consent is recorded"}
              </p>
              <Link
                href={`/stories/${story.slug}`}
                className="mt-3 inline-block font-sans text-sm font-medium text-navy hover:underline"
              >
                Read the story
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-10 max-prose rounded-md border border-rule bg-sand p-6">
          <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
            Why these are unnamed
          </p>
          <p className="mt-3 font-sans leading-relaxed text-ink-soft">
            A named testimonial with a stock portrait is the single most common
            fabrication in this sector, and once it has been forwarded on WhatsApp it
            cannot be retracted. Names and photographs appear here only with written
            consent on file.
          </p>
        </div>
      </Section>

      <CtaPanel />
    </>
  );
}
