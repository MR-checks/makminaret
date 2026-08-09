import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("legal-privacy", "Privacy");
}

export default function Page() {
  return (
    <StaticPage slug="legal-privacy" eyebrow="Legal" trail={[{ label: "Privacy" }]} />
  );
}
