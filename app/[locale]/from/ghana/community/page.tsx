import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

/**
 * A static segment sitting alongside /from/[country]. Next.js matches the
 * static route first, so this does not disturb the country pages.
 *
 * Ghana only for now, deliberately. A community page is worth nothing unless
 * the community behind it is real, and Ghana is the market where it is.
 */
export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("ghana-community", "The Ghanaian community in Türkiye");
}

export default function Page() {
  return (
    <StaticPage
      slug="ghana-community"
      eyebrow="From Ghana"
      trail={[{ label: "From Ghana", href: "/from/ghana" }, { label: "Community" }]}
      image={{
        src: "/images/ankara-building.jpg",
        alt: "Ankara rooftops, with a mosque and minaret above the city",
        width: 1600,
        height: 1184,
      }}
    />
  );
}
