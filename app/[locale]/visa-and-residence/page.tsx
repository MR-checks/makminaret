import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("visa-and-residence", "Visa and residence");
}

export default function Page() {
  return (
    <StaticPage
      slug="visa-and-residence"
      eyebrow="After you arrive"
      trail={[{ label: "Visa and residence" }]}
    />
  );
}
