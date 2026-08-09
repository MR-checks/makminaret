import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/content/reader";
import { Card, PageHero, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";
import { CATEGORY_LABELS } from "../../page";

export async function generateStaticParams() {
  const all = await getArticles();
  const categories = Array.from(new Set(all.map((a) => a.entry.category)));
  return categories.map((slug) => ({ locale: "en", slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = CATEGORY_LABELS[slug] ?? slug;
  return { title: `${label} | Insights` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = (await getArticles()).filter((a) => a.entry.category === slug);
  if (articles.length === 0) notFound();
  const label = CATEGORY_LABELS[slug] ?? slug;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={label}
        trail={[{ label: "Insights", href: "/insights" }, { label }]}
      />

      <Section tone="paper">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.slug} className="hover:border-navy">
              <h2 className="font-display text-lg leading-snug text-navy">
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
