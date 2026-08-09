import React from "react";
import { Link } from "@/i18n/navigation";
import { MapPin, Clock, Languages, ArrowRight, CheckCircle2 } from "lucide-react";
import { JoinedProgram } from "@/lib/data/programs";

type Props = {
  program: JoinedProgram;
};

export function ProgramCard({ program }: Props) {
  // The band string as authored, not a formatted figure. HANDOVER §4.1 keeps
  // exact prices off the site because they change yearly and go stale silently.
  const formattedTuition = program.tuitionBand;

  // A requirements summary derived from the programme level. This is a
  // generated default rather than authored content, so it stays deliberately
  // general: a specific grade threshold here would be a fabricated claim.
  let reqSummary = "Secondary certificate, subject to denklik";
  if (program.level === "master" || program.level === "phd") {
    reqSummary = "Bachelor's degree, subject to recognition";
  }
  if (program.yosRequired) {
    reqSummary += ", YÖS required";
  } else if (program.satAccepted) {
    reqSummary += " (SAT Accepted)";
  }

  // Next intake logic (mocking realistically based on standard Turkish cycles)
  const currentMonth = new Date().getMonth();
  const nextIntake = currentMonth > 7 ? "Spring (Feb)" : "Fall (Sep)";

  return (
    <div className="bg-white border border-slate/10 p-6 flex flex-col transition-colors hover:border-slate/30 h-full">
      {/* Header Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-2 py-0.5 bg-slate/5 text-slate text-xs font-semibold uppercase tracking-wider rounded-md">
            {program.level}
          </span>
          {program.scholarshipAvailable && (
            <span className="inline-block px-2 py-0.5 bg-sand text-navy text-xs font-semibold uppercase tracking-wider rounded-md">
              Scholarship
            </span>
          )}
        </div>

        <h3 className="font-display text-xl text-navy leading-snug mb-1">
          {program.title}
        </h3>
        <p className="font-sans text-sm text-slate font-medium">
          {program.universityName}
        </p>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-y-3 mb-6">
        <div className="flex items-center gap-2 font-sans text-sm text-slate">
          <MapPin size={16} className="text-navy" />
          <span>{program.city}</span>
        </div>
        <div className="flex items-center gap-2 font-sans text-sm text-slate">
          <Languages size={16} className="text-navy" />
          <span>{program.language}</span>
        </div>
        <div className="flex items-center gap-2 font-sans text-sm text-slate">
          <Clock size={16} className="text-navy" />
          <span>{program.durationYears} Years</span>
        </div>
        <div className="flex items-center gap-2 font-sans text-sm text-slate">
          <span className="font-semibold text-navy">{formattedTuition}</span>{" "}
          <span className="text-xs">/ yr</span>
        </div>
      </div>

      {/* Entry Requirements & Intake */}
      <div className="bg-slate/5 p-4 mb-6 rounded-md flex-grow">
        <div className="flex gap-2 items-start mb-2">
          <CheckCircle2 size={16} className="text-navy mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate mb-0.5">
              Requirements
            </span>
            <span className="block text-sm text-navy leading-tight">{reqSummary}</span>
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <Clock size={16} className="text-navy mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate mb-0.5">
              Next Intake
            </span>
            <span className="block text-sm text-navy leading-tight">{nextIntake}</span>
          </div>
        </div>
      </div>

      {/* Deep-link CTA */}
      <Link
        href={`/eligibility?program=${program.slug}`}
        className="mt-auto w-full flex items-center justify-center gap-2 bg-navy text-white h-12 font-sans font-medium hover:bg-navy/90 transition-colors on-dark"
      >
        Check my eligibility for this
        <ArrowRight size={18} />
      </Link>

      {/* Detail Page Link */}
      <Link
        href={`/programs/${program.slug}`}
        className="mt-3 text-center text-sm font-medium text-navy hover:text-nold/80 transition-colors"
      >
        View full program details
      </Link>
    </div>
  );
}
