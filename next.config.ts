import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /**
   * Ship the content directory with the server bundle.
   *
   * lib/content/reader.ts calls createReader(process.cwd(), config), which
   * reads /content off the filesystem at request time. Nothing imports those
   * JSON files, so Next.js's output file tracing has no reason to include
   * them, and on Vercel the function bundle shipped without them: every
   * collection read as empty in production while working perfectly in local
   * dev and in `next start`, where the whole repo is on disk.
   *
   * The symptom was subtle. Pages still rendered, because the layout and
   * navigation are ordinary TypeScript. Only the parts driven by content went
   * missing: no courses, no programmes, no socials, and 404s on every detail
   * route whose params come from a collection.
   */
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },

  // lucide-react is imported in 40 files. Barrel-file optimisation keeps that
  // from pulling the whole icon set into the client bundle.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Image optimization: prefer AVIF with WebP fallback (MASTERPLAN §12)
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Defence-in-depth security headers (MASTERPLAN §10.1)
  // These are fallbacks; proxy.ts sets the per-request nonce-based CSP.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },

  // Redirects from MASTERPLAN §2.4
  async redirects() {
    return [
      {
        source: "/study-in-turkiye",
        destination: "/why-turkiye",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/insights",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/insights/:slug",
        permanent: true,
      },
      {
        source: "/publishing",
        destination: "/services/book-publishing",
        permanent: true,
      },
      {
        source: "/school-supplies",
        destination: "/services/school-supplies",
        permanent: true,
      },
      {
        source: "/business-solutions",
        destination: "/services/business-consultancy",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
