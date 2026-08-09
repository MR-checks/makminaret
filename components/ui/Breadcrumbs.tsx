"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();

  // Example pathname: /en/universities/istanbul-aydin-university
  // Remove the locale part from the breadcrumb calculation
  const segments = pathname.split("/").filter(Boolean);
  const isLocale = (seg: string) => ["en", "tr", "ar", "fr"].includes(seg);

  const pathSegments = segments.filter((seg) => !isLocale(seg));

  if (pathSegments.length === 0) return null;

  // Generate paths for each segment
  const breadcrumbs = pathSegments.map((segment, index) => {
    // Reconstruct path while preserving locale if present
    const localePart = isLocale(segments[0]) ? `/${segments[0]}` : "";
    const href = `${localePart}/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return { label, href };
  });

  // JSON-LD Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://makminaret.com${isLocale(segments[0]) ? `/${segments[0]}` : ""}`,
      },
      ...breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.label,
        item: `https://makminaret.com${crumb.href}`,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="py-4 px-4 md:px-8 border-b border-slate/5 bg-paper/50"
      >
        <ol className="flex items-center gap-2 font-sans text-sm text-slate/60 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <li>
            <Link
              href="/"
              className="hover:text-navy transition-colors focus-visible:outline-2 focus-visible:outline-navy rounded-md flex items-center"
              aria-label="Home"
            >
              <Home size={14} />
            </Link>
          </li>

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={crumb.href} className="flex items-center gap-2">
                <ChevronRight size={14} className="text-slate/30" />
                {isLast ? (
                  <span className="text-slate font-medium" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-navy transition-colors focus-visible:outline-2 focus-visible:outline-navy rounded-md"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
