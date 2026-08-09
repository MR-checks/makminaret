import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("application-process", "Application process");
}

export default function Page() {
  return (
    <StaticPage
      slug="application-process"
      eyebrow="Study in Türkiye"
      trail={[{ label: "Application process" }]}
    />
  );
}
