# Brand asset derivation

`logo-source.jpeg` is the only original we have. It lives here rather than in
`public/` because it is a design source, not something the site should serve.

MASTERPLAN §6.9 asks for the source file (`.ai`, `.eps`, `.svg`, `.fig`) from
whoever designed the logo, and says to auto-trace only if no source exists.
**Nobody has asked the designer yet. That request is still worth making**, and a
real vector source should replace the traced files below when it arrives.

## What was generated, and how

The JPEG is a flat two-colour mark, which §6.9 notes traces well. Derivation:

1. Classify every pixel to the nearest of navy `#01224D`, gold `#B99257`, or
   white, with a distance cut-off so anti-aliased edge pixels are dropped
   rather than assigned. Both brand values were sampled from the JPEG itself;
   the navy measures 15.70:1 against white, so §1.1 keeps the true logo colour.
2. Morphological opening on the navy mask (1 iteration) and on the gold mask
   above y=855 (2 iterations). Without this, the gold mask picks up a one-pixel
   halo tracing every navy edge, which inflated the path data roughly tenfold.
   Below y=855 the `CONSULTANCY` line is too thin to erode, so it is cleaned by
   the colour threshold alone.
3. Crop. The full lockup is `(170, 250) → (1082, 915)`, the mark alone is
   `(380, 250) → (875, 690)`. Both stop short of y=955, which excludes the
   `EDUCATE / EMPOWER / ELEVATE` tagline: HANDOVER §1.6 keeps it off the
   website, and two of those words are on the §5 banned list.
4. Trace each mask with potrace (`turdSize: 2`, `alphaMax: 1.0`,
   `optCurve: true`, `optTolerance: 0.2`), then compose the paths.

Tooling used: Python with Pillow and numpy for the masks, the `potrace` npm
package for the trace. Neither is a project dependency, since this is a one-off
asset generation step rather than part of the build.

## Outputs

| File                                 | What it is                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `public/logo.svg`                    | Full two-colour lockup. Mark, `MINARET`, gold `CONSULTANCY`.                                     |
| `public/logo-white.svg`              | Single-colour white variant for navy panels: header, footer, OG image.                           |
| `app/icon.svg`                       | The M mark alone, padded square, for the favicon.                                                |
| `app/icon.png`, `app/apple-icon.png` | Raster fallbacks, rendered on `--paper` because Apple touch icons do not composite transparency. |

Inspected at 800px per §6.9: curves are smooth, the wordmark counters are
clean, and there is no stair-stepping. The thin arc does drop out below about
24px, which is normal for a mark at this level of detail; if the favicon needs
to read at 16px, that wants a simplified mark rather than a finer trace.
