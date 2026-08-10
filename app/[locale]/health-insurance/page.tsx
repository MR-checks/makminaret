import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("health-insurance", "Health insurance");
}

export default function Page() {
  return (
    <StaticPage
      slug="health-insurance"
      eyebrow="After you arrive"
      trail={[{ label: "Health insurance" }]}
    />
  );
}
