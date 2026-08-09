import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("accommodation", "Accommodation");
}

export default function Page() {
  return (
    <StaticPage
      slug="accommodation"
      eyebrow="After you arrive"
      trail={[{ label: "Accommodation" }]}
    />
  );
}
