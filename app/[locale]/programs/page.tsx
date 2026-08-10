import React from "react";
import { getJoinedPrograms } from "@/lib/data/programs";
import { getFields } from "@/lib/content/reader";
import { ProgramFilterSidebar } from "@/components/programs/ProgramFilterSidebar";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const metadata = {
  title: "Program Finder | Minaret Educational Consultancy",
  description:
    "Search and filter university programs in Türkiye. Find the exact match for your budget, field, and requirements.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProgramsPage({ searchParams }: Props) {
  // Await search params in Next.js 15
  const params = await searchParams;

  // Fetch data
  const [allPrograms, allFields] = await Promise.all([getJoinedPrograms(), getFields()]);

  // Extract unique cities for the filter
  const availableCities = Array.from(new Set(allPrograms.map((p) => p.city))).sort();

  // Format fields for the filter
  const availableFields = allFields
    .map((f) => ({
      slug: f.slug,
      name: f.entry.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // "Other" is a real answer, not a failed search: it means the visitor's
  // subject is not on our shortlist, which is a prompt to talk to us.
  const isOtherField = params.field === "other";

  // Apply filters
  let filteredPrograms = allPrograms;

  const filterLevel = params.level as string;
  if (filterLevel) {
    filteredPrograms = filteredPrograms.filter((p) => p.level === filterLevel);
  }

  const filterField = params.field as string;
  if (filterField) {
    filteredPrograms = filteredPrograms.filter((p) => p.fieldSlug === filterField);
  }

  const filterCity = params.city as string;
  if (filterCity) {
    filteredPrograms = filteredPrograms.filter((p) => p.city === filterCity);
  }

  const filterLanguage = params.language as string;
  if (filterLanguage) {
    filteredPrograms = filteredPrograms.filter((p) => p.language === filterLanguage);
  }

  const filterType = params.type as string;
  if (filterType) {
    filteredPrograms = filteredPrograms.filter((p) => p.universityType === filterType);
  }

  const filterYos = params.yos as string;
  if (filterYos === "no") {
    filteredPrograms = filteredPrograms.filter((p) => p.yosRequired === false);
  }

  const filterScholarship = params.scholarship as string;
  if (filterScholarship === "yes") {
    filteredPrograms = filteredPrograms.filter((p) => p.scholarshipAvailable === true);
  }

  const filterTuition = params.tuition as string;
  if (filterTuition) {
    filteredPrograms = filteredPrograms.filter((p) => {
      if (filterTuition === "<1000") return p.tuitionFrom < 1000;
      if (filterTuition === "1000-3000")
        return p.tuitionFrom >= 1000 && p.tuitionFrom <= 3000;
      if (filterTuition === "3000-10000")
        return p.tuitionFrom > 3000 && p.tuitionFrom <= 10000;
      if (filterTuition === ">10000") return p.tuitionFrom > 10000;
      return true;
    });
  }

  return (
    <div className="bg-sand min-h-screen py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-navy mb-4">
            Program Finder
          </h1>
          <p className="font-sans text-lg text-slate max-w-2xl">
            Filter through our verified partner universities to find the exact program for
            your budget and background.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <ProgramFilterSidebar
              availableFields={availableFields}
              availableCities={availableCities}
            />
          </aside>

          {/* Results Area */}
          <main className="flex-1">
            <div className="mb-6 pb-4 border-b border-slate/10 flex justify-between items-end">
              <h2 className="font-display text-2xl text-navy">
                {filteredPrograms.length}{" "}
                {filteredPrograms.length === 1 ? "Program" : "Programs"} Found
              </h2>
            </div>

            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredPrograms.map((program) => (
                  <ProgramCard key={program.slug} program={program} />
                ))}
              </div>
            ) : (
              /*
                An empty result is a conversation, not a dead end. The listing
                here is a shortlist of what we place into rather than a catalogue
                of everything in Türkiye, so "nothing matched" usually means
                "ask us" rather than "it does not exist". Sending someone away
                with only "adjust your filters" wastes the highest-intent
                moment on the page.
              */
              <div className="rounded-md border border-rule bg-paper-raised p-10 text-center">
                <Search
                  size={40}
                  aria-hidden="true"
                  className="mx-auto mb-4 text-slate"
                />
                <h3 className="font-display text-xl text-navy">
                  {isOtherField
                    ? "Tell us what you are looking for"
                    : "Nothing here matches that combination"}
                </h3>
                <p className="mx-auto mt-3 max-w-prose font-sans text-slate">
                  {isOtherField
                    ? "This list is a shortlist of programmes we place into, not a catalogue of everything on offer in Türkiye. If your subject is not here, it very likely still exists somewhere. Tell us what you want to study and we will tell you where it is taught, in which language, and what it costs."
                    : "This list is a shortlist rather than a full catalogue, so a combination with no results does not mean the programme does not exist. Widen a filter, or ask us directly and we will check."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/eligibility"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
                  >
                    Tell us what you want to study
                  </Link>
                  <Link
                    href="/programs"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-navy px-6 font-sans text-sm font-medium text-navy transition-colors hover:bg-sand"
                  >
                    Clear all filters
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
