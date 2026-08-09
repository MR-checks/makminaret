import React from "react";
import { getCountry, getCountries, getStories } from "@/lib/content/reader";
import { getBespokeCountryData } from "@/lib/data/countries";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  MapPin,
  Plane,
  Building,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((c) => ({
    locale: "en",
    country: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const p = await params;
  const country = await getCountry(p.country);
  if (!country) return {};
  return {
    title: `Study in Türkiye from ${country.name} | Minaret`,
    description: `Guide for students from ${country.name}: denklik, document authentication, Turkish embassy requirements, and what it costs.`,
  };
}

export default async function CountryLandingPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const p = await params;
  const country = await getCountry(p.country);

  if (!country) {
    notFound();
  }

  const bespokeData = getBespokeCountryData(p.country);

  // Filter stories from this country
  const allStories = await getStories();
  const countryStories = allStories.filter((s) => s.entry.homeCountry === p.country);

  const WA_LINK = `https://wa.me/${bespokeData?.localContactNumber?.replace(/[^0-9]/g, "") || "905550000000"}?text=Hi, I am interested in studying in Türkiye from ${country.name}. Ref: /from/${p.country}`;

  return (
    <div className="bg-sand min-h-screen pb-24">
      {/* Hero Header */}
      <header className="bg-navy text-white pt-24 pb-16 px-6 lg:px-12 on-dark">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider rounded-md mb-4">
            Country Guide
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Study in Türkiye from {country.name}
          </h1>
          <p className="font-sans text-lg text-white/80 max-w-2xl">
            How your {country.secondaryCertificate || "secondary certificate"} is
            recognised in Türkiye, which office authenticates it, and what the Turkish
            embassy asks for.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Col (Process Blocks) */}
        <div className="lg:col-span-2 flex flex-col gap-16">
          {/* Qualifications Block */}
          <section>
            <div className="flex items-center gap-3 mb-6 text-navy">
              <FileText className="text-navy" size={28} />
              <h2 className="font-display text-3xl">Your Qualifications</h2>
            </div>
            <div className="bg-white border border-slate/10 p-8 prose prose-slate max-w-none font-sans text-slate">
              <p className="font-medium text-navy text-lg mb-2">
                What your {country.secondaryCertificate || "certificate"} means for
                admission
              </p>
              <p>
                Your local secondary certificate is widely accepted by Turkish Foundation
                and Private universities. State universities will typically require an
                additional YÖS exam.
              </p>
            </div>
          </section>

          {/* Denklik & Document Authentication */}
          <section>
            <div className="flex items-center gap-3 mb-6 text-navy">
              <Building className="text-navy" size={28} />
              <h2 className="font-display text-3xl">Document Authentication & Denklik</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Authentication */}
              <div className="bg-white border-l-4 border-navy p-6 text-slate font-sans">
                <h3 className="font-bold text-navy mb-2">Step 1: Local Authentication</h3>
                <p className="mb-4">
                  Before applying for a visa, your documents must be legalized.
                </p>
                {bespokeData ? (
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong className="text-navy">Location:</strong>{" "}
                      {bespokeData.documentAuthBuilding},{" "}
                      {bespokeData.documentAuthLocation}
                    </li>
                    <li>
                      <strong className="text-navy">Process:</strong>{" "}
                      {bespokeData.documentAuthProcess}
                    </li>
                    <li>
                      <strong className="text-navy">Turnaround:</strong>{" "}
                      {bespokeData.documentAuthTurnaround}
                    </li>
                  </ul>
                ) : (
                  <p className="text-sm">
                    Please contact our team for specific authentication offices in{" "}
                    {country.name}.
                  </p>
                )}
              </div>

              {/* Denklik */}
              <div className="bg-white border border-slate/10 p-6 text-slate font-sans">
                <h3 className="font-bold text-navy mb-2">
                  Step 2: Denklik (Equivalency)
                </h3>
                <p className="text-sm mb-3">
                  The Turkish Ministry of Education must issue an equivalency certificate
                  (Denklik) for your {country.secondaryCertificate}.
                </p>
                <div className="inline-flex items-center gap-2 bg-slate/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy rounded-md">
                  <ClockIcon size={14} aria-hidden="true" /> {country.denklikTimingNote}
                </div>
              </div>
            </div>
          </section>

          {/* Turkish Embassy */}
          <section>
            <div className="flex items-center gap-3 mb-6 text-navy">
              <MapPin className="text-navy" size={28} />
              <h2 className="font-display text-3xl">The Turkish Embassy</h2>
            </div>
            <div className="bg-white border border-slate/10 p-8">
              {bespokeData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-navy mb-1 text-sm uppercase tracking-wider">
                      Location
                    </h4>
                    <p className="text-slate">{bespokeData.embassyAddress}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1 text-sm uppercase tracking-wider">
                      Appointment Reality
                    </h4>
                    <p className="text-slate">{bespokeData.embassyWaitTime}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate">
                  Please verify the embassy location in {country.name} on the official MFA
                  website.
                </p>
              )}
            </div>
          </section>

          {/* Flights */}
          <section>
            <div className="flex items-center gap-3 mb-6 text-navy">
              <Plane className="text-navy" size={28} />
              <h2 className="font-display text-3xl">Getting to Türkiye</h2>
            </div>
            <div className="bg-white border border-slate/10 p-6 text-slate">
              <p>
                Major carriers like Turkish Airlines and EgyptAir offer reliable
                connections from {country.name} to Istanbul.
              </p>
            </div>
          </section>
        </div>

        {/* Right Col (Sidebar) */}
        <div className="flex flex-col gap-8">
          {/* Action Box */}
          <div className="bg-navy text-white p-8 sticky top-8 on-dark">
            <h3 className="font-display text-2xl mb-4">Start your application</h3>
            <p className="text-white/80 font-sans text-sm mb-8">
              We are based in Türkiye, but our {country.name} desk handles your case
              locally.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#25D366", color: "white" }}
                className="flex items-center justify-center gap-2 w-full h-12 font-sans font-medium hover:opacity-90 transition-opacity rounded-md"
              >
                Chat on WhatsApp
              </Link>

              <Link
                href="/eligibility"
                className="flex items-center justify-center gap-2 bg-gold text-navy w-full h-12 font-sans font-medium uppercase tracking-wide hover:bg-gold/90 transition-colors"
              >
                Check Eligibility
              </Link>
            </div>

            {bespokeData && (
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                  Local Contact
                </p>
                <p className="font-medium text-lg">{bespokeData.localContactNumber}</p>
              </div>
            )}
          </div>

          {/* Stories from this country */}
          {countryStories.length > 0 && (
            <div className="bg-white border border-slate/10 p-8">
              <h3 className="font-display text-xl text-navy mb-6">
                Students from {country.name}
              </h3>
              <div className="flex flex-col gap-6">
                {countryStories.slice(0, 2).map((story, idx) => (
                  <div
                    key={idx}
                    className="border-b border-slate/10 last:border-0 pb-6 last:pb-0"
                  >
                    <p className="font-display text-slate italic mb-3">
                      &ldquo;An excellent experience studying in Türkiye.&rdquo;
                    </p>
                    <p className="font-bold text-navy text-sm">
                      {story.entry.studentName}
                    </p>
                    <p className="text-xs text-slate">
                      {story.entry.university?.replace(/-/g, " ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ClockIcon(props: React.ComponentProps<typeof CheckCircle2>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
