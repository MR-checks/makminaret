import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-mode";
import {
  getScholarships,
  getArticles,
  getCountries,
  getServices,
} from "@/lib/content/reader";

/**
 * Dynamic sitemap (MASTERPLAN §11.2).
 *
 * Was a one-entry skeleton emitting a hardcoded localhost URL. Now derives the
 * origin from NEXT_PUBLIC_SITE_URL and enumerates every content entry, with
 * lastModified taken from each entry's reviewedOn so the date reflects when the
 * content was actually checked rather than when the build ran.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [scholarships, articles, countries, services] = await Promise.all([
    getScholarships(),
    getArticles(),
    getCountries(),
    getServices(),
  ]);

  const reviewed = (entry: { reviewedOn?: string | null }) =>
    entry.reviewedOn ? new Date(entry.reviewedOn) : new Date();

  const staticPaths = [
    ["", 1.0],
    ["/programs", 0.9],
    ["/scholarships", 0.8],
    ["/skills-academy", 0.6],
    ["/stories", 0.6],
    ["/student-support", 0.6],
    ["/application-process", 0.8],
  ] as const;

  return [
    ...staticPaths.map(([path, priority]) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...scholarships.map((s) => ({
      url: `${siteUrl}/scholarships/${s.slug}`,
      lastModified: reviewed(s.entry),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...countries.map((c) => ({
      url: `${siteUrl}/from/${c.slug}`,
      lastModified: reviewed(c.entry),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    })),
    ...services.map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified: reviewed(s.entry),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...articles.map((a) => ({
      url: `${siteUrl}/insights/${a.slug}`,
      lastModified: reviewed(a.entry),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
