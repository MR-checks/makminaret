import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexable } from "@/lib/site-mode";

/**
 * Programmatic robots.txt (MASTERPLAN §10.7, HANDOVER §3.4).
 *
 * Showcase and unlisted stay out of the index, but they do it with the
 * `noindex` meta tag rather than by blocking the crawl. Disallowing a URL
 * stops Google reading the page at all, which means it never sees the noindex
 * and is free to index the bare URL from a link or a sitemap. That is exactly
 * the "Indexed, though blocked by robots.txt" state, and it makes a page
 * harder to remove rather than easier: a blocked URL cannot be de-indexed,
 * because the signal that would remove it is unreachable.
 *
 * So a crawler is let in and told not to index. Preview deployments stay fully
 * blocked; they live on throwaway hostnames where nothing needs de-indexing.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const isPreview = process.env.VERCEL_ENV !== "production";

  if (isPreview) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const privatePaths = ["/keystatic/", "/dev/", "/verification", "/api/"];

  // Not live yet: crawlable so the noindex is legible, but nothing is
  // advertised through a sitemap while the content is still placeholder.
  if (!isIndexable()) {
    return {
      rules: { userAgent: "*", allow: "/", disallow: privatePaths },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: privatePaths },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
