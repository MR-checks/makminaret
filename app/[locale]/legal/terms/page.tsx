import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("legal-terms", "Terms");
}

export default function Page() {
  return <StaticPage slug="legal-terms" eyebrow="Legal" trail={[{ label: "Terms" }]} />;
}
