import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentNodes, getCourse, getCourses } from "@/lib/content/reader";
import {
  Card,
  DefinitionList,
  PageHero,
  Prose,
  ReviewStamp,
  Section,
} from "@/components/page/PageChrome";
import { CourseEnquiryForm } from "@/components/forms/ContactForms";

const FORMAT_LABEL: Record<string, string> = {
  "in-person": "In person, Ankara",
  online: "Online",
  hybrid: "Hybrid",
};

export async function generateStaticParams() {
  const all = await getCourses();
  return all.map((c) => ({ locale: "en", slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getCourse(slug);
  if (!entry) return {};
  return {
    title: entry.seo?.title || entry.title,
    description: entry.seo?.description || entry.summary,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getCourse(slug);
  if (!entry) notFound();

  const curriculum = await documentNodes(entry.curriculum);

  return (
    <>
      <PageHero
        eyebrow="Skills Academy"
        title={entry.title}
        intro={entry.summary}
        trail={[
          { label: "Skills Academy", href: "/skills-academy" },
          { label: entry.title },
        ]}
      />

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <h2 className="font-display text-2xl tracking-tight text-navy">
              What it covers
            </h2>
            <Prose nodes={curriculum} />

            <h2 className="mt-10 font-display text-2xl tracking-tight text-navy">
              Who it is for
            </h2>
            <p className="mt-4 max-prose font-sans leading-relaxed text-ink-soft">
              {entry.whoItIsFor}
            </p>

            <ReviewStamp date={entry.reviewedOn} className="mt-10" />
          </div>

          <aside className="flex flex-col gap-6">
            <Card>
              <h2 className="font-display text-lg text-navy">At a glance</h2>
              <div className="mt-4">
                <DefinitionList
                  items={[
                    {
                      term: "Format",
                      value: FORMAT_LABEL[entry.format] ?? entry.format,
                    },
                    ...(entry.durationWeeks
                      ? [{ term: "Duration", value: `${entry.durationWeeks} weeks` }]
                      : []),
                    { term: "Fee", value: entry.feeBand },
                    { term: "Certification", value: entry.certification },
                  ]}
                />
              </div>
            </Card>

            <Card>
              <h2 className="font-display text-lg text-navy">Ask about this course</h2>
              <div className="mt-6">
                <CourseEnquiryForm course={slug} />
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
