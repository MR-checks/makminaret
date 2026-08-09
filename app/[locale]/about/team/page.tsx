import type { Metadata } from "next";
import { getTeam } from "@/lib/content/reader";
import { Card, PageHero, Section } from "@/components/page/PageChrome";
import { CtaPanel } from "@/components/page/Cta";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Who you will deal with at Minaret. Named profiles with photographs are added as consent and images are collected.",
};

/**
 * The roles are described; the people are not invented.
 *
 * MASTERPLAN §4.4 wants named team members with real photographs, and that is
 * right. Until those exist, HANDOVER §5 forbids fabricating them, so this page
 * describes the roles honestly and says plainly what is missing. An anonymous
 * "our expert counsellors" page reads as a call centre; an honest gap does not.
 */
const ROLES = [
  {
    title: "Admissions counsellor",
    body: "Your first and main contact. Assesses whether the route you want is realistic, builds the shortlist, and stays with your file through to enrolment.",
  },
  {
    title: "Documents and denklik",
    body: "Handles the equivalency process and the document set. This is the role that catches the laminated certificate and the mismatched name before they cost you an intake.",
  },
  {
    title: "In-country support",
    body: "Based in Ankara. Meets students on arrival, goes with them to enrolment and to the residence permit appointment, and deals with the offices in person when something needs a person.",
  },
];

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <>
      <PageHero
        eyebrow="About Minaret"
        title="The people you will deal with"
        intro="Small team, in Ankara. Here are the roles that will handle your file."
        trail={[{ label: "About", href: "/about" }, { label: "Team" }]}
      />

      <Section tone="paper">
        {team.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.slug}>
                <h2 className="font-display text-lg text-navy">{member.entry.name}</h2>
                <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                  {member.entry.role}
                </p>
                <p className="mt-3 font-sans text-sm text-ink-soft">{member.entry.bio}</p>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {ROLES.map((role) => (
                <Card key={role.title}>
                  <h2 className="font-display text-lg text-navy">{role.title}</h2>
                  <p className="mt-3 font-sans text-sm text-ink-soft">{role.body}</p>
                </Card>
              ))}
            </div>
            <div className="mt-10 max-prose rounded-md border border-rule bg-sand p-6">
              <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                Named profiles pending
              </p>
              <p className="mt-3 font-sans leading-relaxed text-ink-soft">
                Individual profiles with real names and real photographs are being
                collected. We have deliberately not filled this page with invented
                colleagues or stock portraits in the meantime, because in this sector that
                is exactly what a fraudulent agency does.
              </p>
            </div>
          </>
        )}
      </Section>

      <CtaPanel
        heading="Talk to a person."
        body="You will be dealing with a named counsellor from the first conversation, not a form."
      />
    </>
  );
}
