import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Open Graph image: the white logo on --navy.
 *
 * HANDOVER §1.6 singles this out as mattering more than usual here, because
 * most traffic arrives as a link pasted into WhatsApp and a link with no
 * preview image reads as untrustworthy.
 *
 * Deliberately no extra text: the logo already carries the wordmark, so this
 * needs no font loading and cannot break on a missing glyph. Turkish
 * diacritics in a rendered string would be the obvious failure mode.
 */

export const alt = "Minaret Educational Consultancy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = readFileSync(join(process.cwd(), "public/logo-white.svg"));
  const logoDataUri = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // --navy. Tokens cannot be read from CSS in this rendering context,
        // so this literal must be kept in step with styles/tokens.css.
        backgroundColor: "#01224D",
      }}
    >
      {}
      <img src={logoDataUri} alt="" width={720} height={525} />
    </div>,
    size
  );
}
