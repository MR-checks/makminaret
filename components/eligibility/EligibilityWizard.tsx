"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { submitEligibility } from "@/lib/actions/submit";
import type { FormState } from "@/lib/validation/forms";
import {
  AbuseControls,
  ConsentFields,
  Field,
  FormError,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/forms/FormKit";
import { StampResult } from "./StampResult";
import { WhatsAppLink } from "@/components/page/Cta";
import { useIsClient } from "@/lib/use-is-client";

/**
 * The eligibility wizard (MASTERPLAN §3.2).
 *
 * Nine steps, one question per screen, contact details last so the visitor has
 * invested effort before being asked for them. Answers persist to localStorage
 * so a visitor who leaves can resume, with no account.
 *
 * Abandonment is deliberately not acted on: if someone gives an email at step
 * nine and does not submit, nothing happens. Anything else is a KVKK problem.
 */

const STORAGE_KEY = "minaret:eligibility";

type Choice = { value: string; label: string; note?: string };

type Step = {
  name: string;
  question: string;
  help?: string;
  choices?: Choice[];
  kind?: "choices" | "contact";
};

const STEPS: Step[] = [
  {
    name: "level",
    question: "What do you want to study?",
    choices: [
      { value: "foundation", label: "Foundation or language year" },
      { value: "bachelor", label: "Bachelor's degree" },
      { value: "master", label: "Master's degree" },
      { value: "phd", label: "PhD" },
    ],
  },
  {
    name: "field",
    question: "Which field?",
    choices: [
      { value: "medicine-and-health", label: "Medicine and health" },
      { value: "engineering", label: "Engineering" },
      { value: "business", label: "Business" },
      { value: "computer-science", label: "Computer science" },
      { value: "architecture", label: "Architecture" },
      { value: "social-sciences", label: "Social sciences" },
    ],
  },
  {
    name: "qualification",
    question: "What is your highest completed qualification?",
    choices: [
      { value: "wassce", label: "WASSCE or WAEC" },
      { value: "neco", label: "NECO or SSCE" },
      { value: "a-levels", label: "A Levels" },
      { value: "ib", label: "International Baccalaureate" },
      { value: "bachelor", label: "Bachelor's degree" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    name: "qualificationYear",
    question: "What year did you complete it?",
    help: "If you are still waiting on results, choose the year you expect them.",
    choices: [
      { value: "this-year", label: "This year" },
      { value: "last-year", label: "Last year" },
      { value: "2-4-years", label: "Two to four years ago" },
      { value: "5-plus", label: "Five or more years ago" },
      { value: "pending", label: "Still waiting on results" },
    ],
  },
  {
    name: "grade",
    question: "Roughly what were your grades?",
    help: "An estimate is fine. Not knowing does not stop you going forward.",
    choices: [
      { value: "strong", label: "Strong, mostly A and B" },
      { value: "good", label: "Good, mostly B and C" },
      { value: "average", label: "Average, mostly C" },
      { value: "below-50", label: "Below average" },
      { value: "not-sure", label: "I am not sure" },
    ],
  },
  {
    name: "language",
    question: "Do you have an English or Turkish certificate?",
    choices: [
      { value: "ielts-toefl", label: "Yes, IELTS or TOEFL" },
      { value: "turkish", label: "Yes, Turkish at B2 or above" },
      { value: "school-english", label: "I studied in English but have no certificate" },
      { value: "none", label: "No certificate yet" },
    ],
  },
  {
    name: "budget",
    question: "What can you spend per year on tuition?",
    help: "Tuition only. Living costs and the residence permit sit on top.",
    choices: [
      { value: "under-3000", label: "Under $3,000" },
      { value: "under-5000", label: "$3,000 to $5,000" },
      { value: "5000-10000", label: "$5,000 to $10,000" },
      { value: "10000-20000", label: "$10,000 to $20,000" },
      { value: "over-20000", label: "Over $20,000" },
    ],
  },
  {
    name: "intake",
    question: "Which intake are you aiming for?",
    help: "Intakes are typically September and February.",
    choices: [
      { value: "next-september", label: "The next September intake" },
      { value: "next-february", label: "The next February intake" },
      { value: "following-year", label: "The year after" },
      { value: "unsure", label: "I am not sure yet" },
    ],
  },
  {
    name: "citizenship",
    question: "What is your country of citizenship?",
    choices: [
      { value: "Ghana", label: "Ghana" },
      { value: "Nigeria", label: "Nigeria" },
      { value: "Kenya", label: "Kenya" },
      { value: "Cameroon", label: "Cameroon" },
      { value: "Uganda", label: "Uganda" },
      { value: "Tanzania", label: "Tanzania" },
      { value: "Other", label: "Somewhere else" },
    ],
  },
  {
    name: "contact",
    question: "Where should we send your result?",
    kind: "contact",
  },
];

const initialState: FormState = { ok: false };

function readSavedAnswers(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * The wizard is interactive-only, so it mounts on the client and renders a
 * static first step on the server. That lets the saved answers be read in a
 * lazy state initialiser rather than an effect, which avoids both a
 * setState-in-effect cascade and a hydration mismatch from restored answers.
 */
export function EligibilityWizard({ programSlug }: { programSlug?: string }) {
  const isClient = useIsClient();
  if (!isClient) return <WizardSkeleton />;
  return <Wizard programSlug={programSlug} />;
}

function WizardSkeleton() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
        Step 1 of {STEPS.length}
      </p>
      <h2 className="mt-6 font-display text-2xl tracking-tight text-navy md:text-3xl">
        {STEPS[0].question}
      </h2>
      <div className="mt-8 flex flex-col gap-3">
        {STEPS[0].choices?.map((choice) => (
          <div
            key={choice.value}
            className="min-h-11 rounded-md border border-rule bg-paper-raised p-4 font-sans text-ink"
          >
            {choice.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Wizard({ programSlug }: { programSlug?: string }) {
  const [state, formAction, pending] = useActionState(submitEligibility, initialState);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(readSavedAnswers);

  // Save and resume. Contact details are never persisted: only the answers
  // that describe the enquiry.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* storage full or blocked, resume is a convenience not a requirement */
    }
  }, [answers]);

  useEffect(() => {
    if (state.ok) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* nothing to clean up */
      }
    }
  }, [state.ok]);

  if (state.ok && state.verdict && state.reference) {
    return <Result state={state} />;
  }

  const current = STEPS[step];
  const total = STEPS.length;
  const progress = Math.round(((step + 1) / total) * 100);

  const choose = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.name]: value }));
    if (step < total - 1) setStep(step + 1);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
            Step {step + 1} of {total}
          </p>
          <p className="font-mono text-[0.8125rem] text-slate">{progress}%</p>
        </div>
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-sm bg-rule"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label="Progress through the eligibility check"
        >
          <div
            className="h-full bg-navy transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="font-display text-2xl tracking-tight text-navy md:text-3xl">
        {current.question}
      </h2>
      {current.help && <p className="mt-3 font-sans text-slate">{current.help}</p>}

      {current.kind === "contact" ? (
        <form action={formAction} className="mt-8 flex flex-col gap-6">
          <AbuseControls />
          {Object.entries(answers).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          {programSlug && <input type="hidden" name="programSlug" value={programSlug} />}

          <Field label="Your name" name="name" required error={state.errors?.name}>
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                name="name"
                autoComplete="name"
                required
                describedBy={describedBy}
              />
            )}
          </Field>

          <Field
            label="WhatsApp number"
            name="phone"
            required
            hint="Include your country code, for example +233 or +234."
            error={state.errors?.phone}
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+233 24 010 1057"
                required
                describedBy={describedBy}
              />
            )}
          </Field>

          <Field label="Email" name="email" required error={state.errors?.email}>
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                name="email"
                type="email"
                autoComplete="email"
                required
                describedBy={describedBy}
              />
            )}
          </Field>

          <ConsentFields error={state.errors?.consent} />
          <FormError message={state.errors?._form} />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-navy px-5 font-sans text-sm font-medium text-navy transition-colors hover:bg-sand"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back
            </button>
            <SubmitButton pending={pending}>See my result</SubmitButton>
          </div>
          <p className="font-sans text-sm text-slate">
            Free. No documents needed yet. We will tell you honestly if this route does
            not suit you.
          </p>
        </form>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-3">
            {current.choices?.map((choice) => {
              const selected = answers[current.name] === choice.value;
              return (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() => choose(choice.value)}
                  aria-pressed={selected}
                  className={`flex min-h-11 items-center justify-between gap-4 rounded-md border p-4 text-left font-sans transition-colors ${
                    selected
                      ? "border-navy bg-sand text-navy"
                      : "border-rule bg-paper-raised text-ink hover:border-navy"
                  }`}
                >
                  <span>
                    {choice.label}
                    {choice.note && (
                      <span className="mt-1 block font-sans text-sm text-slate">
                        {choice.note}
                      </span>
                    )}
                  </span>
                  {selected && (
                    <Check size={18} aria-hidden="true" className="shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-navy px-5 font-sans text-sm font-medium text-navy transition-colors hover:bg-sand"
              >
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
            )}
            {answers[current.name] && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-navy px-5 font-sans text-sm font-medium text-paper transition-colors hover:bg-navy-deep"
              >
                Next <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const VERDICT_COPY: Record<
  NonNullable<FormState["verdict"]>,
  { heading: string; body: string }
> = {
  eligible: {
    heading: "You are in range.",
    body: "Based on what you told us, there are programmes we place into that fit your level, field and budget. Here are the closest matches.",
  },
  conditional: {
    heading: "Possible, with conditions.",
    body: "There is a route here, but something needs attention first. The matches below are the ones worth talking about.",
  },
  "not-recommended": {
    heading: "We would not recommend this route.",
    body: "On what you have told us, this combination is unlikely to work, and we would rather say so now than after you have paid anything. There is usually an alternative worth discussing.",
  },
};

function Result({ state }: { state: FormState }) {
  const verdict = state.verdict!;
  const copy = VERDICT_COPY[verdict];
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-md border border-rule bg-paper-raised p-8 md:p-12">
        <StampResult verdict={verdict} reference={state.reference!} date={today} />

        <h2 className="mt-8 text-center font-display text-3xl tracking-tight text-navy md:text-4xl">
          {copy.heading}
        </h2>
        <p className="mx-auto mt-4 max-prose text-center font-sans leading-relaxed text-ink-soft">
          {copy.body}
        </p>

        <p className="mt-6 text-center font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
          Reference {state.reference}
        </p>

        {state.delivered === false && (
          <p className="mx-auto mt-4 max-w-md rounded-sm border border-warning p-3 text-center font-sans text-sm text-ink-soft">
            We could not send the confirmation email just now. Your reference above is
            still valid, so message us on WhatsApp and quote it.
          </p>
        )}
      </div>

      {state.matches && state.matches.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-2xl tracking-tight text-navy">
            Programmes worth looking at
          </h3>
          <div className="mt-6 grid gap-4">
            {state.matches.map((match) => (
              <Link
                key={match.slug}
                href={`/programs/${match.slug}`}
                className="flex flex-col gap-1 rounded-md border border-rule bg-paper-raised p-5 transition-colors hover:border-navy"
              >
                <span className="font-display text-lg text-navy">{match.title}</span>
                <span className="font-sans text-sm text-slate">
                  {match.university}, {match.city}
                </span>
                <span className="font-mono text-[0.8125rem] text-ink-soft">
                  {match.tuitionBand} per year, taught in {match.language}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <WhatsAppLink
          context={`Hi, I completed the eligibility check. My reference is ${state.reference}.`}
        >
          Continue on WhatsApp
        </WhatsAppLink>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-navy px-6 font-sans text-sm font-medium text-navy transition-colors hover:bg-sand"
        >
          Book a call
        </Link>
      </div>

      <p className="mt-6 font-sans text-sm text-slate">
        We have emailed this result to you. A counsellor will follow up within four
        working hours.
      </p>
    </div>
  );
}
