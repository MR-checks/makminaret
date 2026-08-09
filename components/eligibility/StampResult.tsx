"use client";

import type { Verdict } from "@/lib/validation/forms";

/**
 * The stamp (MASTERPLAN §6.6).
 *
 * One memorable moment, executed once. An oxide-red seal drawn as SVG with a
 * deliberately irregular edge and imperfect ink coverage, landing onto the
 * result card with a short firm animation: scale 1.15 to 1.0 over 180ms on
 * cubic-bezier(0.2, 0.8, 0.2, 1). No bounce, no rotation wobble.
 *
 * It marks the conversion point, reinforces the registry language, makes a
 * negative verdict read as a considered professional judgement rather than a
 * rejection, and gives the visitor something worth screenshotting to a parent.
 *
 * prefers-reduced-motion is handled by the global rule in globals.css, which
 * collapses the animation duration so the stamp simply appears.
 *
 * It appears nowhere else. Not on cards, not on buttons, not in the footer.
 */

const LABELS: Record<Verdict, string> = {
  eligible: "ELIGIBLE",
  conditional: "ELIGIBLE WITH CONDITIONS",
  "not-recommended": "NOT RECOMMENDED",
};

export function StampResult({
  verdict,
  reference,
  date,
}: {
  verdict: Verdict;
  reference: string;
  date: string;
}) {
  const label = LABELS[verdict];
  const isLong = label.length > 12;

  return (
    <div className="stamp-land relative mx-auto grid h-56 w-56 shrink-0 place-items-center">
      <svg
        viewBox="0 0 240 240"
        role="img"
        aria-label={`Verdict: ${label}`}
        className="h-full w-full"
      >
        <title>{`Verdict: ${label}`}</title>
        <defs>
          {/* Imperfect ink coverage: a coarse turbulence knocks holes in the
              fill so the seal reads as pressed rather than printed. */}
          <filter id="stamp-ink">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              seed="7"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.4 1.1"
            />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>
        </defs>

        <g filter="url(#stamp-ink)" fill="none" stroke="var(--seal)">
          {/* Slightly irregular outer ring: the radii vary just enough to read
              as hand-pressed without looking broken. */}
          <path
            strokeWidth="6"
            d="M120 16
               C 172 16, 224 62, 224 118
               C 224 176, 174 224, 119 224
               C 63 224, 16 175, 16 119
               C 16 63, 66 16, 120 16 Z"
          />
          <path
            strokeWidth="2"
            d="M120 32
               C 166 33, 208 70, 208 118
               C 208 167, 167 208, 119 208
               C 71 208, 32 168, 32 119
               C 32 70, 73 32, 120 32 Z"
          />
        </g>

        <g filter="url(#stamp-ink)" fill="var(--seal)">
          <text
            x="120"
            y={isLong ? 104 : 116}
            textAnchor="middle"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            fontSize={isLong ? 19 : 26}
            letterSpacing="1.5"
            fontWeight="500"
          >
            {isLong ? label.split(" ")[0] : label}
          </text>
          {isLong && (
            <>
              <text
                x="120"
                y="128"
                textAnchor="middle"
                fontFamily="var(--font-ibm-plex-mono), monospace"
                fontSize="15"
                letterSpacing="1.2"
              >
                {label.split(" ")[1]}
              </text>
              <text
                x="120"
                y="148"
                textAnchor="middle"
                fontFamily="var(--font-ibm-plex-mono), monospace"
                fontSize="15"
                letterSpacing="1.2"
              >
                {label.split(" ").slice(2).join(" ")}
              </text>
            </>
          )}
          <text
            x="120"
            y={isLong ? 176 : 148}
            textAnchor="middle"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            fontSize="11"
            letterSpacing="1"
          >
            {reference}
          </text>
          <text
            x="120"
            y={isLong ? 192 : 166}
            textAnchor="middle"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            fontSize="10"
            letterSpacing="1"
            opacity="0.85"
          >
            {date}
          </text>
        </g>
      </svg>
    </div>
  );
}
