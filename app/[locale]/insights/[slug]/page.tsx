import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { documentNodes, getArticle, getArticles } from "@/lib/content/reader";
import { PageHero, Prose, ReviewStamp, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";
import { CATEGORY_LABELS } from "../page";

export async function generateStaticParams() {
  const all = await getArticles();
  return all.map((a) => ({ locale: "en", slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getArticle(slug);
  if (!entry) return {};
  return {
    title: entry.seo?.title || entry.title,
    description: entry.seo?.description || entry.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getArticle(slug);
  if (!entry) notFound();

  const body = await documentNodes(entry.body);
  const related = (await getArticles()).filter((a) => a.slug !== slug).slice(0, 3);
  const category = CATEGORY_LABELS[entry.category] ?? entry.category;

  return (
    <>
      <PageHero
        eyebrow={category}
        title={entry.title}
        intro={entry.excerpt}
        trail={[
          { label: "Insights", href: "/insights" },
          { label: category, href: `/insights/category/${entry.category}` },
          { label: entry.title },
        ]}
      />

      <Section tone="paper">
        <article className="max-prose">
          <Prose nodes={body} />
          <ReviewStamp date={entry.reviewedOn} className="mt-10" />
        </article>
      </Section>

      {related.length > 0 && (
        <Section tone="sand" heading="Related reading">
          <ul className="grid gap-4 md:grid-cols-3">
            {related.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/insights/${a.slug}`}
                  className="block rounded-md border border-rule bg-paper-raised p-5 transition-colors hover:border-navy"
                >
                  <span className="font-display text-lg text-navy">{a.entry.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaPanel />
    </>
  );
}
