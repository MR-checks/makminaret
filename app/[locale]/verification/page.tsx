import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Design System Verification",
  robots: { index: false, follow: false },
};

/**
 * Verification page — Phase 1 acceptance criterion.
 *
 * Renders:
 * - Body text in --slate on --paper (must pass 4.5:1 contrast)
 * - A form input with --border-input border (must pass 3:1 for interactive boundaries)
 * - A focusable button with visible focus ring
 * - All 12 Turkish diacritics in all three typefaces
 *
 * This page must score Lighthouse Accessibility 100.
 * It is blocked from indexing via robots meta.
 */
export default function VerificationPage() {
  const t = useTranslations("verification");

  return (
    <div className="paper-grain min-h-screen">
      <div className="mx-auto px-6 py-16" style={{ maxWidth: "var(--container-max)" }}>
        {/* Heading in Newsreader display */}
        <h1
          className="text-navy mb-6"
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "var(--fs-h2)",
            lineHeight: "var(--lh-display)",
          }}
        >
          {t("heading")}
        </h1>

        {/* Body text in --slate on --paper (5.17:1 contrast) */}
        <p
          className="mb-8 max-prose"
          style={{
            color: "var(--slate)",
            fontSize: "var(--fs-body)",
            lineHeight: "var(--lh-body)",
          }}
        >
          {t("bodyText")}
        </p>

        {/* Turkish diacritics verification — all three faces */}
        <section className="mb-12" aria-label="Turkish diacritics verification">
          <h2
            className="text-ink mb-4"
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "var(--fs-h3)",
            }}
          >
            Turkish Diacritics
          </h2>

          {/* Newsreader (Display) */}
          <p
            className="mb-3"
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "var(--fs-body-lg)",
              color: "var(--ink)",
            }}
          >
            <strong>Newsreader:</strong> ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü: Türkiye, öğrenci,
            başarılı
          </p>

          {/* Instrument Sans (Body) */}
          <p
            className="mb-3"
            style={{
              fontSize: "var(--fs-body)",
              color: "var(--ink)",
            }}
          >
            <strong>Instrument Sans:</strong> ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü: Türkiye, öğrenci,
            başarılı
          </p>

          {/* IBM Plex Mono (Utility) */}
          <p
            className="mb-3"
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "var(--fs-mono)",
              color: "var(--ink)",
              letterSpacing: "0.04em",
            }}
          >
            <strong>IBM Plex Mono:</strong> ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü: Türkiye, öğrenci,
            başarılı
          </p>
        </section>

        {/* Form input verification */}
        <section className="mb-12" aria-label="Form input verification">
          <h2
            className="text-ink mb-4"
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "var(--fs-h3)",
            }}
          >
            Form Input
          </h2>

          <form>
            <div className="mb-4">
              <label
                htmlFor="verification-name"
                className="mb-2 block"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: "var(--fs-mono)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--slate)",
                }}
              >
                {t("sampleLabel")}
              </label>
              <input
                type="text"
                id="verification-name"
                name="name"
                placeholder={t("samplePlaceholder")}
                className="block w-full px-4 py-3"
                style={{
                  backgroundColor: "var(--paper-raised)",
                  border: "1px solid var(--border-input)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "var(--fs-body)",
                  color: "var(--ink)",
                  maxWidth: "24rem",
                }}
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 text-white"
              style={{
                backgroundColor: "var(--seal)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--fs-body)",
                fontWeight: 500,
                cursor: "pointer",
                border: "none",
              }}
            >
              {t("sampleButton")}
            </button>
          </form>
        </section>

        {/* Colour token verification */}
        <section aria-label="Colour token verification">
          <h2
            className="text-ink mb-4"
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "var(--fs-h3)",
            }}
          >
            Colour Tokens
          </h2>

          <div className="flex flex-wrap gap-4">
            {[
              { name: "--ink", bg: "var(--ink)", text: "white" },
              { name: "--ink-soft", bg: "var(--ink-soft)", text: "white" },
              { name: "--navy", bg: "var(--navy)", text: "white" },
              { name: "--seal", bg: "var(--seal)", text: "white" },
              { name: "--paper", bg: "var(--paper)", text: "var(--ink)" },
              {
                name: "--paper-raised",
                bg: "var(--paper-raised)",
                text: "var(--ink)",
              },
              { name: "--sand", bg: "var(--sand)", text: "var(--ink)" },
              { name: "--success", bg: "var(--success)", text: "white" },
              { name: "--warning", bg: "var(--warning)", text: "white" },
            ].map((token) => (
              <div
                key={token.name}
                className="px-4 py-3"
                style={{
                  backgroundColor: token.bg,
                  color: token.text,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--rule)",
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: "var(--fs-mono)",
                  minWidth: "8rem",
                }}
              >
                {token.name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
