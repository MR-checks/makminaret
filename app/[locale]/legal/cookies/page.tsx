import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("legal-cookies", "Cookies");
}

export default function Page() {
  return (
    <StaticPage slug="legal-cookies" eyebrow="Legal" trail={[{ label: "Cookies" }]} />
  );
}
