import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("entry-requirements", "Entry requirements");
}

export default function Page() {
  return (
    <StaticPage
      slug="entry-requirements"
      eyebrow="Study in Türkiye"
      trail={[{ label: "Entry requirements" }]}
    />
  );
}
