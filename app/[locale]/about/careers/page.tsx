import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("careers", "Careers");
}

export default function Page() {
  return (
    <StaticPage
      slug="careers"
      eyebrow="About Minaret"
      trail={[{ label: "About", href: "/about" }, { label: "Careers" }]}
    />
  );
}
