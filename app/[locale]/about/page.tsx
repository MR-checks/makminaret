import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { StaticPage, buildPageMetadata } from "@/components/page/StaticPage";
import { Card, Section } from "@/components/page/PageChrome";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("about", "About");
}

const LINKS = [
  { href: "/about/team", label: "Team", body: "Who you will actually deal with." },
  { href: "/about/offices", label: "Offices", body: "Where we are, and how to visit." },
  {
    href: "/about/partners",
    label: "Partners and accreditation",
    body: "What we can evidence, and what we will not claim.",
  },
  { href: "/about/careers", label: "Careers", body: "How we hire, and who fits." },
];

export default function AboutPage() {
  return (
    <StaticPage
      slug="about"
      eyebrow="About Minaret"
      trail={[{ label: "About" }]}
      image={{
        src: "/images/ankara-building.jpg",
        alt: "Ankara rooftops, with a mosque and minaret above the city",
        width: 1600,
        height: 1184,
      }}
    >
      <Section tone="sand" heading="More about us">
        <div className="grid gap-4 sm:grid-cols-2">
          {LINKS.map((link) => (
            <Card key={link.href} className="hover:border-navy">
              <Link href={link.href} className="font-display text-lg text-navy">
                {link.label}
              </Link>
              <p className="mt-2 font-sans text-sm text-slate">{link.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </StaticPage>
  );
}
