"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Props = {
  availableFields: { slug: string; name: string }[];
  availableCities: string[];
};

export function ProgramFilterSidebar({ availableFields, availableCities }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Helper to handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset pagination to page 1 if filtering changes (even though we don't have pagination yet)
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const currentLevel = searchParams.get("level") || "";
  const currentField = searchParams.get("field") || "";
  const currentCity = searchParams.get("city") || "";
  const currentLanguage = searchParams.get("language") || "";
  const currentType = searchParams.get("type") || "";
  const currentTuition = searchParams.get("tuition") || "";
  const currentYos = searchParams.get("yos") || "";
  const currentScholarship = searchParams.get("scholarship") || "";

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div
      className={`flex flex-col gap-8 ${isPending ? "opacity-70 pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-navy">Filters</h3>
        {Array.from(searchParams.keys()).length > 0 && (
          <button
            onClick={clearAll}
            className="font-sans text-xs text-navy hover:text-navy/80 transition-colors uppercase tracking-wider font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Level */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="filter-level"
          className="font-sans font-medium text-sm text-slate uppercase tracking-wide"
        >
          Level of Study
        </label>
        <select
          id="filter-level"
          value={currentLevel}
          onChange={(e) => handleFilterChange("level", e.target.value)}
          className="w-full h-10 px-3 bg-white border border-slate/20 rounded-md font-sans text-sm text-slate focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="">All Levels</option>
          <option value="foundation">Foundation</option>
          <option value="bachelor">Bachelor&rsquo;s</option>
          <option value="master">Master&rsquo;s</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      {/* Field */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="filter-field"
          className="font-sans font-medium text-sm text-slate uppercase tracking-wide"
        >
          Field
        </label>
        <select
          id="filter-field"
          value={currentField}
          onChange={(e) => handleFilterChange("field", e.target.value)}
          className="w-full h-10 px-3 bg-white border border-slate/20 rounded-md font-sans text-sm text-slate focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="">All Fields</option>
          {availableFields.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="filter-city"
          className="font-sans font-medium text-sm text-slate uppercase tracking-wide"
        >
          City
        </label>
        <select
          id="filter-city"
          value={currentCity}
          onChange={(e) => handleFilterChange("city", e.target.value)}
          className="w-full h-10 px-3 bg-white border border-slate/20 rounded-md font-sans text-sm text-slate focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="">All Cities</option>
          {availableCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="filter-language"
          className="font-sans font-medium text-sm text-slate uppercase tracking-wide"
        >
          Language
        </label>
        <select
          id="filter-language"
          value={currentLanguage}
          onChange={(e) => handleFilterChange("language", e.target.value)}
          className="w-full h-10 px-3 bg-white border border-slate/20 rounded-md font-sans text-sm text-slate focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="">Any Language</option>
          <option value="English">English</option>
          <option value="Turkish">Turkish</option>
        </select>
      </div>

      {/* University Type */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="filter-type"
          className="font-sans font-medium text-sm text-slate uppercase tracking-wide"
        >
          University Type
        </label>
        <select
          id="filter-type"
          value={currentType}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="w-full h-10 px-3 bg-white border border-slate/20 rounded-md font-sans text-sm text-slate focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="">Any Type</option>
          <option value="state">State</option>
          <option value="private">Private</option>
          <option value="foundation">Foundation</option>
        </select>
      </div>

      {/* Tuition Band */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="filter-tuition"
          className="font-sans font-medium text-sm text-slate uppercase tracking-wide"
        >
          Tuition Band (USD)
        </label>
        <select
          id="filter-tuition"
          value={currentTuition}
          onChange={(e) => handleFilterChange("tuition", e.target.value)}
          className="w-full h-10 px-3 bg-white border border-slate/20 rounded-md font-sans text-sm text-slate focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="">Any Budget</option>
          <option value="<1000">Under $1,000 / yr</option>
          <option value="1000-3000">$1,000 - $3,000 / yr</option>
          <option value="3000-10000">$3,000 - $10,000 / yr</option>
          <option value=">10000">Over $10,000 / yr</option>
        </select>
      </div>

      {/* Requirements (Checkboxes) */}
      <div className="flex flex-col gap-4 pt-4 border-t border-slate/10">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={currentYos === "no"}
            onChange={(e) => handleFilterChange("yos", e.target.checked ? "no" : "")}
            className="w-4 h-4 rounded-md border-slate/30 text-navy focus:ring-navy cursor-pointer"
          />
          <span className="font-sans text-sm text-slate group-hover:text-navy transition-colors">
            No YÖS Required
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={currentScholarship === "yes"}
            onChange={(e) =>
              handleFilterChange("scholarship", e.target.checked ? "yes" : "")
            }
            className="w-4 h-4 rounded-md border-slate/30 text-navy focus:ring-navy cursor-pointer"
          />
          <span className="font-sans text-sm text-slate group-hover:text-navy transition-colors">
            Scholarship Available
          </span>
        </label>
      </div>
    </div>
  );
}
