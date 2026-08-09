import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("why-turkiye", "Why Türkiye");
}

export default function Page() {
  return (
    <StaticPage
      slug="why-turkiye"
      eyebrow="Study in Türkiye"
      image={{
        src: "/images/ankara-building.jpg",
        alt: "Ankara rooftops, with a mosque and minaret above the city",
        width: 1600,
        height: 1184,
      }}
      trail={[{ label: "Why Türkiye" }]}
    />
  );
}
