import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getCourses } from "@/lib/content/reader";
import { Card, PageHero, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Skills Academy",
  description:
    "Short practical courses run from Ankara: Turkish for beginners, academic English, digital skills, and training delivered for organisations.",
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
        title="Short courses, run from Ankara"
        intro="Education does not stop at university placement. These are the courses that make the first year easier, plus training delivered for organisations."
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

        <p className="mt-8 max-prose font-sans text-sm text-slate">
          Cohorts start through the year rather than on fixed annual dates. Ask us what is
          next and we will tell you what is actually scheduled.
        </p>
      </Section>

      <CtaPanel
        heading="Ask about a course."
        body="Tell us what you need and which format suits you, and we will come back with what is running."
        context="Hi, I would like to ask about a Skills Academy course."
      />
    </>
  );
}
