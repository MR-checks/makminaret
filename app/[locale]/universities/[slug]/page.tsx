import React from "react";
import { getUniversity, getUniversities } from "@/lib/content/reader";
import { getProgramsByUniversity } from "@/lib/data/programs";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { MapPin, Users, Building, ShieldCheck, ArrowRight } from "lucide-react";
import { ProgramCard } from "@/components/programs/ProgramCard";

export async function generateStaticParams() {
  const universities = await getUniversities();
  return universities.map((u) => ({
    locale: "en",
    slug: u.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const uni = await getUniversity(p.slug);
  if (!uni) return {};
  return {
    title: `${uni.name} | Study in Türkiye | Minaret`,
    description: `Complete guide to ${uni.name} in ${uni.city}. Entry requirements, tuition fees, and available programs for international students.`,
  };
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const uni = await getUniversity(p.slug);

  if (!uni) {
    notFound();
  }

  const relatedPrograms = await getProgramsByUniversity(p.slug);

  return (
    <div className="bg-sand min-h-screen pb-24">
      {/* Hero */}
      <header className="bg-navy text-white pt-24 pb-16 px-6 lg:px-12 relative overflow-hidden on-dark">
        {/* If we had campus photos, we'd render them as a subtle background here */}
        <div className="absolute inset-0 opacity-10 bg-black"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-md">
              {uni.type} University
            </span>
            {uni.yokAccredited && (
              <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider rounded-md flex items-center gap-1">
                <ShieldCheck size={14} />
                YÖK Accredited
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            {uni.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 font-sans text-white/90">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-gold" />
              <span className="text-lg">{uni.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building size={20} className="text-gold" />
              <span className="text-lg">Est. {uni.foundedYear}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Col (Text) */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          <section>
            <h2 className="font-display text-3xl text-navy mb-6">Overview</h2>
            <div className="prose prose-slate max-w-none font-sans text-slate">
              {uni.whoItSuits ? (
                <p>{uni.whoItSuits}</p>
              ) : (
                <p>
                  {uni.name} is a leading institution in {uni.city}, offering
                  state-of-the-art facilities and a strong international community.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-navy mb-6">Who it suits</h2>
            <div className="bg-white border-l-4 border-navy p-6 text-slate font-sans italic">
              {uni.whoItSuits ||
                `Ideal for students seeking high-quality education in ${uni.city} with strong industry connections.`}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-navy mb-6">Entry Requirements</h2>
            <div className="bg-white border border-slate/10 p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-navy mb-2 uppercase text-xs tracking-wider">
                  Exam Requirements
                </h4>
                <ul className="text-slate text-sm flex flex-col gap-2">
                  <li className="flex justify-between border-b border-slate/10 pb-1">
                    <span>YÖS Exam</span>
                    <span className="font-medium">
                      {uni.yosRequired ? "Required" : "Not Required"}
                    </span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span>SAT</span>
                    <span className="font-medium">
                      {uni.satAccepted ? "Accepted" : "Not Accepted"}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-navy mb-2 uppercase text-xs tracking-wider">
                  Language
                </h4>
                <p className="text-slate text-sm">
                  {uni.englishRequirement ||
                    "TOEFL IBT 79+ or University Proficiency Exam. English prep year available."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Col (Sidebar) */}
        <div>
          <div className="bg-navy text-white p-8 sticky top-8 on-dark">
            <h3 className="font-display text-2xl mb-6">At a glance</h3>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/70">Tuition Range</span>
                <span className="font-medium text-gold">{uni.tuitionBand}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/70">Languages of instruction</span>
                <span className="font-medium">
                  {uni.languagesOfInstruction.join(", ")}
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-white/70">Status</span>
                <span className="font-medium capitalize">{uni.type}</span>
              </div>
            </div>

            <Link
              href="/eligibility"
              className="flex items-center justify-center gap-2 bg-gold text-navy w-full h-12 font-sans font-medium uppercase tracking-wide hover:bg-gold/90 transition-colors"
            >
              Am I Eligible?
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      {/* Programs List */}
      <section className="bg-white py-16 border-t border-slate/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-navy mb-2">
                Programs at {uni.name}
              </h2>
              <p className="text-slate font-sans">
                Browse {relatedPrograms.length} verified programs for international
                students.
              </p>
            </div>
            <Link
              href={`/programs?city=${uni.city}`}
              className="text-navy font-medium hover:underline flex items-center gap-1"
            >
              View all in {uni.city} <ArrowRight size={16} />
            </Link>
          </div>

          {relatedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPrograms.slice(0, 6).map((program) => (
                <ProgramCard key={program.slug} program={program} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-slate/10 bg-sand/30">
              <p className="text-slate">
                No specific programs have been added for this university yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
