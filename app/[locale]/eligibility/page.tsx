import type { Metadata } from "next";
import { EligibilityWizard } from "@/components/eligibility/EligibilityWizard";
import { PageHero, Section } from "@/components/page/PageChrome";

export const metadata: Metadata = {
  title: "Check your eligibility",
  description:
    "Nine questions, about two minutes, and an honest answer at the end. Free, and you do not need any documents yet.",
};

export default async function EligibilityPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Free eligibility check"
        title="Find out where you stand."
        intro="Nine questions, about two minutes. We will tell you honestly whether the route you want is realistic, and if it is not, what we would suggest instead."
        trail={[{ label: "Check your eligibility" }]}
      />

      <Section tone="paper">
        <EligibilityWizard programSlug={params.program} />
      </Section>
    </>
  );
}
