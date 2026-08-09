import React from "react";
import { getProgram, getUniversity, getPrograms } from "@/lib/content/reader";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  MapPin,
  Clock,
  Languages,
  ArrowRight,
  GraduationCap,
  Building,
  Banknote,
  CheckCircle2,
} from "lucide-react";

export async function generateStaticParams() {
  const programs = await getPrograms();
  // Generate statically for 'en' for all programs
  return programs.map((p) => ({
    locale: "en",
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const program = await getProgram(p.slug);
  if (!program) return {};

  return {
    title: `${program.title} | Minaret Educational Consultancy`,
    description: `Study ${program.title} in Türkiye. View requirements, tuition, and apply now.`,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const program = await getProgram(p.slug);
  if (!program) {
    notFound();
  }

  // Fetch the related university
  let university = null;
  if (program.university) {
    university = await getUniversity(program.university);
  }

  const uniName = university ? university.name : "University";
  const city = university?.city || "Türkiye";

  const formattedTuition = program.tuitionBand || "On request";

  // Construct JSON-LD Course Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description: program.careerOutcomes || `Study ${program.title} at ${uniName}.`,
    provider: {
      "@type": "Organization",
      name: uniName,
      sameAs: university?.website || "",
    },
    educationalCredentialAwarded: program.level,
    timeRequired: `P${program.durationYears || 4}Y`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      location: {
        "@type": "Place",
        name: uniName,
        address: {
          "@type": "PostalAddress",
          addressLocality: city,
          addressCountry: "TR",
        },
      },
    },
  };

  // Documents processing
  const docs = program.documentsRequired || [
    "High School Diploma",
    "Passport Copy",
    "Passport-size Photo",
    "Transcript",
  ];

  return (
    <div className="bg-sand min-h-screen">
      {/* JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <header className="bg-navy text-white pt-24 pb-16 px-6 lg:px-12 on-dark">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-md">
              {program.level}
            </span>
            <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider rounded-md">
              {city}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            {program.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 font-sans text-white/90">
            <div className="flex items-center gap-2">
              <Building size={20} className="text-gold" />
              <span className="text-lg">{uniName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages size={20} className="text-gold" />
              <span className="text-lg">{program.language || "English"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gold" />
              <span className="text-lg">{program.durationYears || 4} Years</span>
            </div>
          </div>
        </div>
      </header>

      {/* Action Bar (Sticky on mobile, static on desktop) */}
      <div className="bg-white border-b border-slate/10 sticky top-16 z-20 md:static md:top-auto">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-slate font-medium">
              Annual Tuition
            </span>
            <span className="font-display text-2xl text-navy">{formattedTuition}</span>
          </div>

          <Link
            href={`/eligibility?program=${p.slug}`}
            className="flex items-center justify-center gap-2 bg-seal text-white px-8 h-12 font-sans font-medium uppercase tracking-wide hover:bg-seal/90 transition-colors"
          >
            Check my eligibility
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column (Content) */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          {/* Overview */}
          <section>
            <h2 className="font-display text-3xl text-navy mb-6">Overview</h2>
            <div className="prose prose-slate max-w-none font-sans text-slate">
              {program.careerOutcomes ? (
                <p>{program.careerOutcomes}</p>
              ) : (
                <p>
                  This program offers a comprehensive curriculum designed to prepare
                  students for a successful career. Taught entirely in{" "}
                  {program.language || "English"}, it combines theoretical knowledge with
                  practical application in state-of-the-art facilities.
                </p>
              )}
            </div>
          </section>

          {/* Entry Requirements */}
          <section>
            <h2 className="font-display text-3xl text-navy mb-6">Entry Requirements</h2>
            <div className="bg-white border border-slate/10 p-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <CheckCircle2 className="text-navy shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy mb-1">Academic Requirement</h4>
                    <p className="text-slate text-sm">
                      {program.level === "master" || program.level === "phd"
                        ? "Relevant Bachelor's Degree with a minimum GPA of 2.5/4.0."
                        : "High School Diploma with a minimum average of 60%."}
                    </p>
                  </div>
                </div>

                {university?.yosRequired && (
                  <div className="flex gap-4">
                    <CheckCircle2 className="text-navy shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-navy mb-1">Entrance Exam</h4>
                      <p className="text-slate text-sm">
                        YÖS (Foreign Student Exam) is strictly required for this state
                        university program.
                      </p>
                    </div>
                  </div>
                )}

                {university?.satAccepted && (
                  <div className="flex gap-4">
                    <CheckCircle2 className="text-navy shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-navy mb-1">Standardized Tests</h4>
                      <p className="text-slate text-sm">
                        SAT scores are accepted in place of the YÖS exam. Minimum score:
                        1100 (Math: 600).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Required Documents */}
          <section>
            <h2 className="font-display text-3xl text-navy mb-6">Required Documents</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map((doc, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 bg-white p-4 border border-slate/10 text-slate text-sm font-medium"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-navy shrink-0"></div>
                  {doc}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column (Sidebar stats & University card) */}
        <div className="flex flex-col gap-8">
          {/* Quick Facts */}
          <div className="bg-navy text-white p-8 on-dark">
            <h3 className="font-display text-2xl mb-6">Quick Facts</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/70">Language</span>
                <span className="font-medium">{program.language || "English"}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/70">Duration</span>
                <span className="font-medium">{program.durationYears || 4} Years</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/70">Tuition</span>
                <span className="font-medium text-gold">{formattedTuition} / yr</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-white/70">Scholarships</span>
                <span className="font-medium">
                  {program.scholarshipAvailable ? "Available" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* City Profile Stub */}
          <div className="bg-white border border-slate/10 p-8">
            <div className="flex items-center gap-3 mb-4 text-navy">
              <MapPin className="text-navy" />
              <h3 className="font-display text-xl">Living in {city}</h3>
            </div>
            <p className="font-sans text-slate text-sm mb-4">
              {city} is a major hub for international students, offering a blend of rich
              history and modern infrastructure.
            </p>
            <Link href="/costs" className="text-navy text-sm font-medium hover:underline">
              Calculate living costs in {city}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
