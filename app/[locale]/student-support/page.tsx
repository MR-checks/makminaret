import type { Metadata } from "next";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("student-support", "Student support");
}

export default function Page() {
  return (
    <StaticPage
      slug="student-support"
      eyebrow="After you arrive"
      trail={[{ label: "Student support" }]}
    />
  );
}
