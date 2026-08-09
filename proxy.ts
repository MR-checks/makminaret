import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Proxy (Next.js 16 convention, formerly middleware.ts)
 *
 * Two responsibilities:
 * 1. next-intl locale routing with localePrefix: 'as-needed'
 * 2. Nonce-based CSP and security headers (MASTERPLAN §10.1)
 *
 * The nonce must be set on the REQUEST headers, not only the response.
 * Next.js reads the incoming Content-Security-Policy header, extracts the
 * nonce, and stamps it onto every script tag it emits (6 inline bootstrap
 * scripts plus 11 external chunks on the homepage). Setting it only on the
 * response leaves those tags bare, and because 'strict-dynamic' makes
 * browsers ignore 'self', every chunk is then blocked and React never
 * hydrates. next-intl copies request.headers into its rewrite (see
 * next-intl/dist/.../middleware.js), so mutating the request first carries
 * the nonce through.
 */

const intlMiddleware = createIntlMiddleware(routing);

function buildCsp(nonce: string, isDev: boolean) {
  return [
    "default-src 'self'",
    // 'strict-dynamic' intentionally discards 'self' for scripts: only the
    // nonce grants execution, and scripts it loads inherit trust.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-inline'" : ""}`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "frame-src https://challenges.cloudflare.com",
    "connect-src 'self' https://www.google-analytics.com",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const SECURITY_HEADERS: Array<[string, string]> = [
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
  ["X-Content-Type-Options", "nosniff"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  [
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  ],
  ["X-Frame-Options", "DENY"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
];

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const cspHeader = buildCsp(nonce, isDev);

  // 1. Put the nonce and CSP on the request so Next.js can nonce its scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // 2. Run next-intl routing against a request carrying those headers.
  //    next-intl clones request.headers into its rewrite/next response.
  const intlRequest = new NextRequest(request, { headers: requestHeaders });
  const response = intlMiddleware(intlRequest);

  // 3. A redirect (e.g. /en/programs -> /programs) carries no document to
  //    protect, but the headers are harmless and keep the policy uniform.
  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", cspHeader);

  for (const [key, value] of SECURITY_HEADERS) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - any path ending in opengraph-image, so social scrapers get a direct
     *   200 rather than a 307 through locale routing. The metadata emits
     *   /en/opengraph-image, so this has to match mid-path rather than only
     *   at the start. WhatsApp and Facebook do follow redirects, but this is
     *   the preview image on the channel most traffic arrives through
     *   (HANDOVER §1.6), so it is worth not betting on a scraper's redirect
     *   handling.
     * - files with extensions (favicon.ico, fonts, textures, etc.)
     */
    "/((?!api|keystatic|_next/static|_next/image|.*\\..*|_vercel|.*opengraph-image).*)",
  ],
};
