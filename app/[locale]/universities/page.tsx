import React from "react";
import { getUniversities } from "@/lib/content/reader";
import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Universities in Türkiye | Minaret",
  description:
    "Browse our partner universities in Türkiye. Verified institutions in Istanbul, Ankara, and Izmir.",
};

export default async function UniversitiesPage() {
  const universities = await getUniversities();

  return (
    <div className="bg-sand min-h-screen pb-24">
      {/* Hero Header */}
      <header className="bg-navy text-white pt-24 pb-16 px-6 lg:px-12 on-dark">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider rounded-md mb-4">
            Education
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Partner Universities
          </h1>
          <p className="font-sans text-lg text-white/80 max-w-2xl">
            We only work with institutions we have fully vetted. Browse our verified
            partner universities across Türkiye&rsquo;s major cities.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.map((uni) => (
            <Link
              key={uni.slug}
              href={`/universities/${uni.slug}`}
              className="group bg-white border border-slate/10 overflow-hidden flex flex-col hover:border-navy transition-colors"
            >
              <div className="aspect-video bg-slate/10 relative overflow-hidden">
                {/* Fallback image if no photo */}
                <div className="absolute inset-0 bg-navy/5 group-hover:scale-105 transition-transform duration-500 on-dark"></div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy/60">
                    {uni.entry.type}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-navy mb-2 group-hover:text-navy transition-colors">
                  {uni.entry.name}
                </h2>
                <div className="flex items-center gap-1 text-slate font-sans text-sm mb-6">
                  <MapPin size={16} className="text-navy" />
                  <span>{uni.entry.city}</span>
                </div>
                <div className="mt-auto flex items-center justify-between text-navy font-medium font-sans">
                  <span>View Details</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
