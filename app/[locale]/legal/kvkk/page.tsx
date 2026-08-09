import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("legal-kvkk", "KVKK notice");
}

export default function Page() {
  return (
    <StaticPage slug="legal-kvkk" eyebrow="Legal" trail={[{ label: "KVKK notice" }]} />
  );
}
