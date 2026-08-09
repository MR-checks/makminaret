/**
 * Site mode (HANDOVER §3.4).
 *
 *   showcase  default. Placeholder content is allowed. The whole site emits
 *             noindex, nofollow, and a dismissible preview bar renders.
 *   live      the build fails if any placeholder: true remains, so shipping
 *             fake data is structurally impossible rather than something
 *             anybody has to remember.
 *
 * The gate itself lives in scripts/generate-placeholders.mjs and runs before
 * next build. This module is what the runtime reads.
 */

export type SiteMode = "showcase" | "live";

export function getSiteMode(): SiteMode {
  return process.env.SITE_MODE === "live" ? "live" : "showcase";
}

export function isShowcase(): boolean {
  return getSiteMode() === "showcase";
}

/**
 * Canonical origin. Every absolute URL derives from this so nothing is
 * hardcoded to a domain (MASTERPLAN §1.1, portability).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  // Vercel supplies this on preview deployments, which is where the showcase
  // lives (HANDOVER §7). Falling back to it keeps preview canonicals correct.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
