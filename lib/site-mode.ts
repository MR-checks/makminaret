/**
 * Site mode (HANDOVER §3.4, extended).
 *
 *   showcase   default. Placeholder content allowed. Emits noindex, nofollow
 *              and renders the dismissible preview bar.
 *   unlisted   placeholder content allowed, still noindex, but no preview bar.
 *              The site looks finished on the real domain while staying
 *              invisible to search.
 *   live       indexable, no bar. The build FAILS if any placeholder: true
 *              remains, so shipping fake data stays structurally impossible
 *              rather than something anybody has to remember.
 *
 * `unlisted` was added because those two properties are genuinely separable.
 * The preview bar is a courtesy to a human who has been handed the link;
 * noindex is what stops draft legal pages and unverified university write-ups
 * being crawled, cached and surfaced to strangers. The second is the one with
 * teeth, so it stays welded to the placeholder gate: **the only route to an
 * indexable site is `live`, and `live` still requires an empty registry.**
 * Removing the bar cannot accidentally publish anything to search.
 *
 * The gate itself lives in scripts/generate-placeholders.mjs and runs before
 * next build. This module is what the runtime reads.
 */

export type SiteMode = "showcase" | "unlisted" | "live";

const MODES: readonly SiteMode[] = ["showcase", "unlisted", "live"];

export function getSiteMode(): SiteMode {
  const mode = process.env.SITE_MODE as SiteMode | undefined;
  return mode && MODES.includes(mode) ? mode : "showcase";
}

/** True while placeholder content is permitted, which is every mode but live. */
export function allowsPlaceholders(): boolean {
  return getSiteMode() !== "live";
}

/** The preview bar renders in showcase only. */
export function showsPreviewBar(): boolean {
  return getSiteMode() === "showcase";
}

/**
 * Indexable in live mode only. Both other modes emit noindex, nofollow, and
 * live is unreachable while content/PLACEHOLDERS.md has anything in it.
 */
export function isIndexable(): boolean {
  return getSiteMode() === "live";
}

/**
 * Canonical origin. Every absolute URL derives from this so nothing is
 * hardcoded to a domain (MASTERPLAN §1.1, portability).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  // Vercel supplies this per deployment, which is right for previews: each one
  // should canonicalise to itself rather than to production.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
