import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";

/**
 * Font configuration for Minaret.
 *
 * Three roles, three faces (MASTERPLAN §6.5):
 * - Display: Newsreader (variable, optical size) — H1, H2, pull quotes
 * - Body: Instrument Sans — all body copy, nav, buttons, forms
 * - Utility: IBM Plex Mono — timings, deadlines, costs, labels
 *
 * All self-hosted via next/font/google (no external requests at runtime).
 * Subsets: latin, latin-ext (covers Turkish diacritics: ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü).
 * font-display: swap for all.
 * Max 3 weights total per the masterplan.
 */

// Display face — Newsreader (variable with optical size axis)
// Used for: H1, H2, pull quotes, student story quotes
// Weight 400 for display, italic for quotes
export const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  // Narrow the variable weight axis. The display face is set at 400 with 600
  // for the few bold headings, and the full axis is a large download for
  // weights nothing uses. MASTERPLAN §6.2 caps usage at three weights anyway.
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
});

// Body face — Instrument Sans
// Used for: all body copy, navigation, buttons, forms
// Weights: 400 (regular), 500 (medium for nav/buttons), 600 (semibold for emphasis)
export const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-instrument-sans",
});

// Utility / data face — IBM Plex Mono
// Used for: timings, deadlines, reference numbers, costs, form labels, eyebrows
// letterspacing 0.04em, uppercase for labels (applied in CSS)
export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  // Mono is labels, timings and reference codes. One weight covers it.
  weight: ["400"],
});
