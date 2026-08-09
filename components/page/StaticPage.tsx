import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage, documentNodes } from "@/lib/content/reader";
import { PageHero, Prose, ReviewStamp, Section } from "./PageChrome";
import { CtaPanel } from "./Cta";

/**
 * Renders a page from the `pages` collection.
 *
 * Most of the site's static pages differ only in their content, so they share
 * this renderer and their route files stay one line long. That is what keeps
 * HANDOVER §3.1 honest: the copy lives in /content where the real copy will
 * eventually live, not scattered through JSX.
 */

type Trail = Array<{ label: string; href?: string }>;

export async function buildPageMetadata(
  slug: string,
  fallbackTitle: string
): Promise<Metadata> {
  const entry = await getPage(slug);
  if (!entry) return { title: fallbackTitle };
  return {
    title: entry.seo?.title || entry.title,
    description: entry.seo?.description || entry.intro || undefined,
  };
}

export async function StaticPage({
  slug,
  eyebrow,
  trail,
  image,
  cta = true,
  children,
}: {
  slug: string;
  eyebrow?: string;
  trail?: Trail;
  image?: { src: string; alt: string; width: number; height: number };
  cta?: boolean;
  children?: React.ReactNode;
}) {
  const entry = await getPage(slug);
  if (!entry) notFound();

  const sections = await Promise.all(
    (entry.sections ?? []).map(async (section) => ({
      heading: section.heading,
      nodes: await documentNodes(section.body),
    }))
  );

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={entry.title}
        intro={entry.intro}
        trail={trail}
        image={image}
      />

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-2xl tracking-tight text-navy md:text-3xl">
                  {section.heading}
                </h2>
                <Prose nodes={section.nodes} />
              </div>
            ))}
            <ReviewStamp date={entry.reviewedOn} className="mt-4" />
          </div>

          {sections.length > 2 && (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <nav
                aria-label="On this page"
                className="rounded-md border border-rule p-5"
              >
                <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                  On this page
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {sections.map((section) => (
                    <li key={section.heading}>
                      <span className="font-sans text-sm text-ink-soft">
                        {section.heading}
                      </span>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
      </Section>

      {children}
      {cta && <CtaPanel />}
    </>
  );
}
