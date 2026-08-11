"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Search } from "lucide-react";

/**
 * Browse subjects by level and field, with a text filter.
 *
 * Every subject links into the eligibility check with itself pre-filled, so a
 * browse turns into an enquiry in one click rather than dead-ending on a
 * listing page.
 */

export type FinderField = {
  slug: string;
  name: string;
  description: string;
  subjects: string[];
  mastersSubjects: string[];
};

const LEVELS = [
  { value: "bachelor", label: "Bachelor's degree" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD" },
  { value: "vocational", label: "Vocational studies" },
] as const;

type Level = (typeof LEVELS)[number]["value"];

export function SubjectFinder({
  fields,
  vocational,
}: {
  fields: FinderField[];
  vocational: Array<{ slug: string; title: string; summary: string }>;
}) {
  const [level, setLevel] = useState<Level>("bachelor");
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (level === "vocational") return [];
    return fields
      .map((field) => {
        // PhD follows the master's subject list where one exists, because
        // doctoral study is research in the same discipline rather than a
        // separate catalogue.
        const source =
          level === "bachelor"
            ? field.subjects
            : field.mastersSubjects.length > 0
              ? field.mastersSubjects
              : field.subjects;
        const subjects = needle
          ? source.filter((s) => s.toLowerCase().includes(needle))
          : source;
        return { ...field, matched: subjects };
      })
      .filter((f) => f.matched.length > 0 || f.slug === "other");
  }, [fields, level, needle]);

  const visibleVocational = useMemo(
    () =>
      needle
        ? vocational.filter((c) => c.title.toLowerCase().includes(needle))
        : vocational,
    [vocational, needle]
  );

  const total =
    level === "vocational"
      ? visibleVocational.length
      : visible.reduce((n, f) => n + f.matched.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <fieldset>
          <legend className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
            Level of study
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {LEVELS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLevel(option.value)}
                aria-pressed={level === option.value}
                className={`min-h-11 rounded-sm border px-4 font-sans text-sm transition-colors ${
                  level === option.value
                    ? "border-navy bg-navy text-paper"
                    : "border-rule bg-paper-raised text-ink hover:border-navy"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="lg:w-80">
          <label
            htmlFor="subject-search"
            className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate"
          >
            Search subjects
          </label>
          <div className="relative mt-3">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate"
            />
            <input
              id="subject-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nursing, software, logistics…"
              className="min-h-11 w-full rounded-sm border border-border-input bg-paper-raised pl-9 pr-3 font-sans text-base text-ink"
            />
          </div>
        </div>
      </div>

      <p className="mt-6 border-b border-rule pb-4 font-display text-2xl text-navy">
        {total} {total === 1 ? "subject" : "subjects"}
      </p>

      {level === "vocational" ? (
        <div className="mt-8">
          <p className="max-prose font-sans text-slate">
            Vocational training runs through the Skills Academy in Ankara. These are short
            practical courses you travel here for, on a short-stay visa rather than a
            student visa.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {visibleVocational.map((course) => (
              <li key={course.slug}>
                <Link
                  href={`/skills-academy/${course.slug}`}
                  className="flex h-full flex-col rounded-md border border-rule bg-paper-raised p-5 transition-colors hover:border-navy"
                >
                  <span className="font-display text-lg text-navy">{course.title}</span>
                  <span className="mt-2 font-sans text-sm text-ink-soft">
                    {course.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {visible.map((field) => (
            <section key={field.slug}>
              <h2 className="font-display text-xl text-navy md:text-2xl">{field.name}</h2>
              <p className="mt-2 max-prose font-sans text-sm text-slate">
                {field.description}
              </p>

              {field.matched.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {field.matched.map((subject) => (
                    <li key={subject}>
                      <Link
                        href={`/eligibility?field=${field.slug}&level=${level}&subject=${encodeURIComponent(subject)}`}
                        className="inline-flex min-h-11 items-center rounded-sm border border-rule bg-paper-raised px-4 font-sans text-sm text-ink transition-colors hover:border-navy hover:text-seal"
                      >
                        {subject}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                field.slug === "other" && (
                  <Link
                    href="/eligibility"
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-sm bg-seal px-5 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
                  >
                    Tell us what you are looking for
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )
              )}
            </section>
          ))}

          {total === 0 && (
            <div className="rounded-md border border-rule bg-paper-raised p-10 text-center">
              <h3 className="font-display text-xl text-navy">
                Nothing matches &ldquo;{query}&rdquo;
              </h3>
              <p className="mx-auto mt-3 max-w-prose font-sans text-slate">
                This list is not exhaustive, and some subjects are deliberately left off
                because they do not transfer home well. Tell us what you are after and we
                will give you a straight answer.
              </p>
              <Link
                href="/eligibility"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
              >
                Ask us
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
