import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentNodes, getStories, getStory } from "@/lib/content/reader";
import { PageHero, Prose, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export async function generateStaticParams() {
  const all = await getStories();
  return all.map((s) => ({ locale: "en", slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getStory(slug);
  if (!entry) return {};
  return { title: entry.studentName || "Student story" };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getStory(slug);
  if (!entry) notFound();

  const quote = await documentNodes(entry.quote);
  const title = entry.studentName || "A student story";

  return (
    <>
      <PageHero
        eyebrow="Student story"
        title={title}
        trail={[{ label: "Student stories", href: "/stories" }, { label: title }]}
      />

      <Section tone="paper">
        <div className="max-prose">
          <Prose nodes={quote} />
          {!entry.studentName && (
            <div className="mt-8 rounded-md border border-rule bg-sand p-6">
              <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                Unnamed by design
              </p>
              <p className="mt-3 font-sans leading-relaxed text-ink-soft">
                This story carries no name and no photograph because written consent is
                not yet on file. We would rather publish an incomplete story than a
                fabricated one.
              </p>
            </div>
          )}
          <ReviewStamp date={entry.reviewedOn} className="mt-8" />
        </div>
      </Section>

      <CtaPanel />
    </>
  );
}
