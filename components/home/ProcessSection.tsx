import React from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

/**
 * The signature section (MASTERPLAN §3.1 section 2, §6.6).
 *
 * Laid out as an official checklist on a document ground, with a mono-set
 * timing column. This single section out-converts three pages of adjectives,
 * because it demonstrates competence rather than claiming it.
 *
 * Timings are qualified ranges rather than promises. HANDOVER §4.1 rules out
 * exact turnaround figures: they vary by embassy load and by season, and a
 * published number that proves wrong costs more trust than a range that does
 * not.
 *
 * Offset left by two columns, which is one of the two deliberate grid breaks
 * per page permitted by §6.7.
 */

const STEPS = [
  ["01", "Eligibility review", "Same day", "We tell you honestly if you qualify"],
  [
    "02",
    "University and programme shortlist",
    "Days",
    "Matched to your grades and budget",
  ],
  ["03", "Document preparation", "Weeks", "Transcripts, passport, translations"],
  ["04", "Denklik, diploma recognition", "Weeks", "The step that delays most applicants"],
  ["05", "University application", "Weeks", "We apply to several, not just one"],
  ["06", "Acceptance and tuition deposit", "Weeks", "You compare offers and choose"],
  ["07", "Student visa at the embassy", "Weeks", "Book the appointment early"],
  ["08", "Arrival, ikamet and enrolment", "After arrival", "We go with you"],
];

export function ProcessSection() {
  return (
    <section className="paper-grain relative bg-paper px-6 py-16 md:py-24 lg:px-12">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="lg:pl-[16.666%]">
          <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
            The process
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-navy md:text-4xl">
            Eight steps, and the one that catches everybody
          </h2>

          <div className="mt-10 border-t border-rule">
            {STEPS.map(([number, title, timing, note]) => (
              <div
                key={number}
                className="grid grid-cols-1 gap-1 border-b border-rule py-4 sm:grid-cols-[3rem_minmax(0,1fr)_9rem]"
              >
                <span className="font-mono text-[0.8125rem] tracking-[0.04em] text-slate">
                  {number}
                </span>
                <div>
                  <p className="font-sans font-medium text-navy">{title}</p>
                  <p className="font-sans text-sm text-slate">{note}</p>
                </div>
                <span className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-ink-soft sm:text-right">
                  {timing}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 max-prose font-sans text-lg leading-relaxed text-ink">
            Plan on several months from first document to boarding pass, not several
            weeks. For a September intake, students who start early in the year are
            comfortable. Students who start in July are already late, and we will say so
            rather than take the fee.
          </p>

          <Link
            href="/application-process"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm border border-navy px-5 font-sans text-sm font-medium text-navy transition-colors hover:bg-sand"
          >
            The full process
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
