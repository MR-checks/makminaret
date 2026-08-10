import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getCourses } from "@/lib/content/reader";
import { Card, PageHero, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Skills Academy",
  description:
    "Short vocational courses in Ankara: tailoring, fashion design, turban making, baking, culinary arts, plumbing and entrepreneurship. Come to Türkiye, learn a trade, go home with it.",
};

const FORMAT_LABEL: Record<string, string> = {
  "in-person": "In person, Ankara",
  online: "Online",
  hybrid: "Hybrid",
};

export default async function SkillsAcademyPage() {
  const courses = await getCourses();

  return (
    <>
      <PageHero
        eyebrow="Minaret Skills Academy"
        title="Learn a trade in Türkiye"
        intro="Short, practical, hands-on courses in Ankara. Come for a few weeks, learn a skill properly, and go home able to earn from it. We handle the invitation letter, the visa paperwork and accommodation."
        trail={[{ label: "Skills Academy" }]}
      />

      <Section tone="paper" heading="Courses">
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.slug} className="hover:border-navy">
              <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                {FORMAT_LABEL[course.entry.format] ?? course.entry.format}
              </p>
              <h2 className="mt-2 font-display text-xl text-navy">
                <Link href={`/skills-academy/${course.slug}`}>{course.entry.title}</Link>
              </h2>
              <p className="mt-3 font-sans text-sm text-ink-soft">
                {course.entry.summary}
              </p>
              <p className="mt-4 font-mono text-[0.8125rem] text-ink-soft">
                {course.entry.durationWeeks
                  ? `${course.entry.durationWeeks} weeks · `
                  : ""}
                {course.entry.feeBand}
              </p>
              <ReviewStamp date={course.entry.reviewedOn} className="mt-4" />
            </Card>
          ))}
        </div>

        <div className="mt-10 max-prose rounded-md border border-rule bg-paper-raised p-6">
          <h3 className="font-display text-lg text-navy">Coming here for a course</h3>
          <p className="mt-3 font-sans leading-relaxed text-ink-soft">
            Most people on these courses travel to Türkiye for them. That is a short-stay
            visa rather than a student visa, and it is a much lighter process: no denklik,
            no transcripts, no academic assessment. We provide the invitation letter and
            the supporting documents, and we can arrange accommodation for the dates you
            are here.
          </p>
          <p className="mt-3 font-sans leading-relaxed text-ink-soft">
            Cohorts run through the year rather than on fixed annual dates. Tell us
            roughly when you can travel and we will tell you what is actually scheduled.
          </p>
        </div>
      </Section>

      <CtaPanel
        heading="Ask about a course."
        body="Tell us which trade and roughly when you can travel. We will come back with what is running, what it costs, and what the visa involves."
        context="Hi, I would like to ask about a Skills Academy vocational course in Türkiye."
      />
    </>
  );
}
