import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexable } from "@/lib/site-mode";

/**
 * Programmatic robots.txt (MASTERPLAN §10.7, HANDOVER §3.4).
 *
 * Showcase mode blocks everything. This previously keyed off
 * VERCEL_ENV === "production", which would have indexed the whole placeholder
 * site the moment it was promoted, regardless of SITE_MODE.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const isPreview = process.env.VERCEL_ENV !== "production";

  // Only `live` is indexable, and `live` is unreachable while any placeholder
  // remains. Preview deployments are always blocked regardless of mode.
  if (!isIndexable() || isPreview) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic/", "/dev/", "/verification", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
