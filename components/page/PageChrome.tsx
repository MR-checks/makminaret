import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import type { DocNode } from "@/lib/content/reader";

/**
 * Shared page furniture.
 *
 * Vertical rhythm follows MASTERPLAN §6.7: 96px hero to first section, 64px
 * between sections, 32px within. Radius follows HANDOVER §1.2 and §1.8.
 */

export function Breadcrumbs({
  trail,
}: {
  trail: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 font-mono text-[0.8125rem] tracking-[0.04em] text-paper/70">
        <li>
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
        </li>
        {trail.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-1">
            <ChevronRight size={12} aria-hidden="true" className="text-paper/40" />
            {crumb.href && i < trail.length - 1 ? (
              <Link href={crumb.href} className="hover:text-gold transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-paper">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  trail,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string | null;
  trail?: Array<{ label: string; href?: string }>;
  /** Licensed place-and-atmosphere photograph. Every one is registered in
   *  content/image-credits.json with its source, photographer and licence. */
  image?: { src: string; alt: string; width: number; height: number };
  children?: React.ReactNode;
}) {
  if (image) {
    return (
      <header className="on-dark bg-navy text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-[3fr_2fr] lg:items-center lg:px-12">
          <div>
            {trail && <Breadcrumbs trail={trail} />}
            {eyebrow && (
              <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-gold">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight md:text-5xl">
              {title}
            </h1>
            {intro && (
              <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-paper/85">
                {intro}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="w-full rounded-lg border border-paper/15 object-cover"
          />
        </div>
      </header>
    );
  }

  return (
    <header className="on-dark bg-navy text-paper">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-12">
        {trail && <Breadcrumbs trail={trail} />}
        {eyebrow && (
          <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-paper/85">
            {intro}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}

export function Section({
  heading,
  eyebrow,
  children,
  tone = "paper",
  id,
}: {
  heading?: string;
  eyebrow?: string;
  children: React.ReactNode;
  tone?: "paper" | "sand" | "navy";
  id?: string;
}) {
  const tones = {
    paper: "bg-paper text-ink",
    sand: "bg-sand text-ink",
    navy: "bg-navy on-dark text-paper",
  } as const;
  return (
    <section id={id} className={`${tones[tone]} px-6 py-16 md:py-20 lg:px-12`}>
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p
            className={`font-mono text-[0.8125rem] uppercase tracking-[0.04em] ${
              tone === "navy" ? "text-gold" : "text-slate"
            }`}
          >
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2
            className={`mt-3 max-w-3xl font-display text-3xl tracking-tight md:text-4xl ${
              tone === "navy" ? "text-paper" : "text-navy"
            }`}
          >
            {heading}
          </h2>
        )}
        <div className={heading || eyebrow ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}

/** Renders Keystatic document nodes. Headings and paragraphs only, which is
 *  what the content actually uses, and it avoids dangerouslySetInnerHTML. */
export function Prose({
  nodes,
  tone = "light",
}: {
  nodes: DocNode[] | null;
  tone?: "light" | "dark";
}) {
  if (!nodes || nodes.length === 0) return null;
  const body = tone === "dark" ? "text-paper/85" : "text-ink-soft";
  const heading = tone === "dark" ? "text-paper" : "text-navy";
  return (
    <div className="max-prose">
      {nodes.map((node, i) => {
        const text = node.children?.map((c) => c.text ?? "").join("") ?? "";
        if (!text.trim()) return null;
        if (node.type === "heading") {
          return (
            <h3
              key={i}
              className={`mt-8 font-display text-xl tracking-tight md:text-2xl ${heading}`}
            >
              {text}
            </h3>
          );
        }
        return (
          <p key={i} className={`mt-4 font-sans leading-[1.65] ${body}`}>
            {text}
          </p>
        );
      })}
    </div>
  );
}

/**
 * "Reviewed August 2026" (HANDOVER §4.4). Set in mono and muted, at the foot of
 * any page carrying figures, requirements or process timings. It turns
 * "possibly stale" into "last checked on a date you can see".
 */
export function ReviewStamp({
  date,
  className = "",
}: {
  date?: string | null;
  className?: string;
}) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  const label = parsed.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return (
    <p
      className={`font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate ${className}`}
    >
      Reviewed {label}
    </p>
  );
}

export function DefinitionList({
  items,
  tone = "light",
}: {
  items: Array<{ term: string; value: React.ReactNode }>;
  tone?: "light" | "dark";
}) {
  const termClass = tone === "dark" ? "text-paper/70" : "text-slate";
  const valueClass = tone === "dark" ? "text-paper" : "text-ink";
  return (
    <dl className="divide-y divide-rule">
      {items.map((item) => (
        <div key={item.term} className="flex justify-between gap-6 py-3">
          <dt
            className={`font-mono text-[0.8125rem] uppercase tracking-[0.04em] ${termClass}`}
          >
            {item.term}
          </dt>
          <dd className={`text-right font-sans text-sm font-medium ${valueClass}`}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  // A --rule border OR --shadow-sm, never both (HANDOVER §1.2).
  return (
    <Tag
      className={`rounded-md border border-rule bg-paper-raised p-6 transition-colors ${className}`}
    >
      {children}
    </Tag>
  );
}
