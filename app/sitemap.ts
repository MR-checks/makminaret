import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexable } from "@/lib/site-mode";
import {
  getScholarships,
  getArticles,
  getCountries,
  getServices,
  getCourses,
  getStories,
} from "@/lib/content/reader";

/**
 * Dynamic sitemap (MASTERPLAN §11.2).
 *
 * Empty until the site is live. Advertising URLs that carry a noindex is how
 * a draft site ends up part-indexed, and Search Console reports it as an error
 * besides. Once live, every reachable route belongs here: the previous version
 * listed seven static paths and left roughly half the site undiscoverable
 * except by crawling.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable()) return [];

  const siteUrl = getSiteUrl();

  const [scholarships, articles, countries, services, courses, stories] =
    await Promise.all([
      getScholarships(),
      getArticles(),
      getCountries(),
      getServices(),
      getCourses(),
      getStories(),
    ]);

  const reviewed = (entry: { reviewedOn?: string | null }) =>
    entry.reviewedOn ? new Date(entry.reviewedOn) : new Date();

  // Priority reflects how much of the decision a page carries, not how much we
  // would like it to rank. The eligibility check and the money pages come
  // first because they are what a student actually arrives looking for.
  const staticPaths = [
    ["", 1.0],
    ["/eligibility", 0.9],
    ["/programs", 0.9],
    ["/costs", 0.9],
    ["/application-process", 0.8],
    ["/scholarships", 0.8],
    ["/entry-requirements", 0.8],
    ["/visa-and-residence", 0.8],
    ["/contact", 0.7],
    ["/why-turkiye", 0.7],
    ["/accommodation", 0.7],
    ["/health-insurance", 0.6],
    ["/student-support", 0.6],
    ["/skills-academy", 0.6],
    ["/services", 0.6],
    ["/insights", 0.6],
    ["/stories", 0.5],
    ["/about", 0.5],
    ["/about/offices", 0.4],
    ["/about/team", 0.4],
    ["/about/partners", 0.3],
    ["/about/careers", 0.3],
    ["/legal/privacy", 0.2],
    ["/legal/terms", 0.2],
    ["/legal/cookies", 0.2],
    ["/legal/kvkk", 0.2],
  ] as const;

  const entry = (
    path: string,
    priority: number,
    lastModified: Date,
    changeFrequency: "monthly" | "yearly"
  ) => ({ url: `${siteUrl}${path}`, lastModified, changeFrequency, priority });

  return [
    ...staticPaths.map(([path, priority]) =>
      entry(path, priority, new Date(), "monthly")
    ),
    ...countries.map((c) => entry(`/from/${c.slug}`, 0.9, reviewed(c.entry), "yearly")),
    ...scholarships.map((s) =>
      entry(`/scholarships/${s.slug}`, 0.7, reviewed(s.entry), "yearly")
    ),
    ...articles.map((a) =>
      entry(`/insights/${a.slug}`, 0.6, reviewed(a.entry), "yearly")
    ),
    ...courses.map((c) =>
      entry(`/skills-academy/${c.slug}`, 0.5, reviewed(c.entry), "yearly")
    ),
    ...services.map((s) =>
      entry(`/services/${s.slug}`, 0.5, reviewed(s.entry), "yearly")
    ),
    ...stories.map((s) => entry(`/stories/${s.slug}`, 0.4, reviewed(s.entry), "yearly")),
  ];
}
