import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/content/reader";
import { Card, PageHero, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Evergreen explainers on denklik, entry requirements and choosing between state and private universities. No news, nothing time-anchored.",
};

export const CATEGORY_LABELS: Record<string, string> = {
  "study-in-turkiye": "Study in Türkiye",
  "university-guides": "University guides",
  scholarships: "Scholarships",
  "visa-and-residence": "Visa and residence",
  "student-life": "Student life",
};

export default async function InsightsPage() {
  const articles = await getArticles();
  const categories = Array.from(new Set(articles.map((a) => a.entry.category)));

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="The boring questions, answered properly"
        intro="Explainers that stay true for years rather than news that ages in weeks. If a fact genuinely changes annually, we explain how the thing works and link to the official source instead of restating a number."
        trail={[{ label: "Insights" }]}
      />

      <Section tone="paper">
        <nav aria-label="Categories" className="mb-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/insights/category/${category}`}
              className="inline-flex min-h-11 items-center rounded-sm border border-rule px-4 font-sans text-sm text-ink transition-colors hover:border-navy"
            >
              {CATEGORY_LABELS[category] ?? category}
            </Link>
          ))}
        </nav>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.slug} className="hover:border-navy">
              <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                {CATEGORY_LABELS[article.entry.category] ?? article.entry.category}
              </p>
              <h2 className="mt-2 font-display text-lg leading-snug text-navy">
                <Link href={`/insights/${article.slug}`}>{article.entry.title}</Link>
              </h2>
              <p className="mt-3 font-sans text-sm text-ink-soft">
                {article.entry.excerpt}
              </p>
              <ReviewStamp date={article.entry.reviewedOn} className="mt-4" />
            </Card>
          ))}
        </div>
      </Section>

      <CtaPanel />
    </>
  );
}
