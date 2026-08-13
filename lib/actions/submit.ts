"use server";

import { z } from "zod";
import {
  callbackSchema,
  checkTiming,
  contactSchema,
  courseSchema,
  eligibilitySchema,
  quoteSchema,
  toFieldErrors,
  CONSENT_TEXT,
  MARKETING_CONSENT_TEXT,
  type FormState,
  type MatchedProgram,
  type Verdict,
} from "@/lib/validation/forms";
import { hashConsentText, saveLead, type Lead } from "@/lib/leads/store";
import { getFields } from "@/lib/content/reader";

/**
 * Server actions for every public form (MASTERPLAN §9.1).
 *
 * The chain is: honeypot, timing floor, Zod parse, then the single lead sink.
 * Turnstile and rate limiting are deliberately not in this build.
 */

async function runChain<S extends z.ZodType>(
  schema: S,
  formData: FormData
): Promise<{ ok: false; state: FormState } | { ok: true; data: z.infer<S> }> {
  const raw = Object.fromEntries(formData.entries());

  // Echoed back on every rejection so the visitor never retypes a form. The
  // abuse controls are stripped: the honeypot must stay empty and the timing
  // stamp is reissued on the next render.
  const values: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    // React's own action plumbing rides along in the FormData under $-prefixed
    // keys. Echoing those back would bloat the state for no purpose.
    if (key.startsWith("$")) continue;
    if (key === "company" || key === "renderedAt") continue;
    if (typeof value === "string") values[key] = value;
  }

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      state: { ok: false, errors: toFieldErrors(parsed.error), values },
    };
  }

  const data = parsed.data as { company: string; renderedAt: number };

  // Honeypot. A filled hidden field means an automated submission, so fail
  // quietly rather than explaining which control caught it.
  if (data.company) {
    return {
      ok: false,
      state: {
        ok: false,
        errors: { _form: "Could not submit. Please try again." },
        values,
      },
    };
  }

  const timingError = checkTiming(data.renderedAt);
  if (timingError) {
    return { ok: false, state: { ok: false, errors: { _form: timingError }, values } };
  }

  return { ok: true, data: parsed.data };
}

async function consentFields(marketing: boolean) {
  return {
    consentMarketing: marketing,
    consentTimestamp: new Date().toISOString(),
    consentTextHash: await hashConsentText(
      marketing ? `${CONSENT_TEXT}\n${MARKETING_CONSENT_TEXT}` : CONSENT_TEXT
    ),
  };
}

async function dispatch(lead: Lead): Promise<FormState> {
  const { reference, delivered } = await saveLead(lead);
  return { ok: true, reference, delivered };
}

// ── Eligibility ─────────────────────────────────────────────

/**
 * Verdict logic. Deliberately conservative, and a negative verdict is a
 * feature rather than a failure: MASTERPLAN §3.2 treats an honest "we would
 * not recommend this route" as the thing that builds enough credibility to
 * close the next student.
 */
function decideVerdict(input: {
  level: string;
  grade: string;
  budget: string;
  field: string;
  language: string;
}): { verdict: Verdict; reasons: string[] } {
  const reasons: string[] = [];
  const lowBudget = input.budget === "under-5000";
  const veryLowBudget = input.budget === "under-3000";
  const medicine = input.field === "medicine-and-health";
  const weakGrades = input.grade === "below-50";
  const unsureGrades = input.grade === "not-sure";
  const noLanguage = input.language === "none";

  if (medicine && (veryLowBudget || lowBudget)) {
    reasons.push(
      "Medicine at a private Turkish university sits well above the budget you gave. State university medicine is far cheaper but is highly competitive and usually taught in Turkish."
    );
    return { verdict: "not-recommended", reasons };
  }

  if (weakGrades && medicine) {
    reasons.push(
      "Health sciences programmes assess science subject grades directly, and the grades you gave are below what they admit on."
    );
    return { verdict: "not-recommended", reasons };
  }

  if (weakGrades) {
    reasons.push(
      "Your grades put the more competitive programmes out of reach, but there are programmes that admit at this level."
    );
  }
  if (veryLowBudget) {
    reasons.push(
      "That budget points at state universities rather than private ones, which usually means a Turkish language year first."
    );
  }
  if (noLanguage) {
    reasons.push(
      "With no English or Turkish certificate yet, plan for a preparatory language year, or take a test before you apply."
    );
  }
  if (unsureGrades) {
    reasons.push("We will confirm the shortlist once we see your actual results.");
  }

  if (reasons.length > 0) return { verdict: "conditional", reasons };

  reasons.push(
    "Your level, field and budget line up with programmes we place into regularly."
  );
  return { verdict: "eligible", reasons };
}

/**
 * Suggest subjects within the chosen field rather than named university
 * programmes. Which university a student ends up at is the outcome of a
 * consultation, and we only name institutions we hold agreements with.
 */
async function matchPrograms(input: {
  level: string;
  field: string;
}): Promise<MatchedProgram[]> {
  const fields = await getFields();
  const chosen = fields.find((f) => f.slug === input.field);
  if (!chosen) return [];

  const source =
    input.level === "bachelor"
      ? chosen.entry.subjects
      : (chosen.entry.mastersSubjects?.length ?? 0) > 0
        ? chosen.entry.mastersSubjects
        : chosen.entry.subjects;

  return [...(source ?? [])].slice(0, 6).map((subject) => ({
    slug: chosen.slug,
    title: subject,
    field: chosen.entry.name,
  }));
}

export async function submitEligibility(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const result = await runChain(eligibilitySchema, formData);
  if (!result.ok) return result.state;
  const data = result.data;

  const { verdict, reasons } = decideVerdict(data);
  const matches = await matchPrograms(data);

  const state = await dispatch({
    type: "eligibility",
    name: data.name,
    email: data.email,
    phoneE164: data.phone,
    country: data.citizenship,
    sourcePage: "/eligibility",
    payload: {
      verdict,
      reasons: reasons.join(" "),
      level: data.level,
      field: data.field,
      qualification: data.qualification,
      qualificationYear: data.qualificationYear,
      grade: data.grade,
      language: data.language,
      budget: data.budget,
      intake: data.intake,
      suggestedSubjects: matches.map((m) => m.title).join(", "),
      fromProgram: data.programSlug,
    },
    ...(await consentFields(data.marketingConsent === "on")),
  });

  return { ...state, verdict, matches };
}

// ── Contact, quote, callback, course ────────────────────────

export async function submitContact(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const result = await runChain(contactSchema, formData);
  if (!result.ok) return result.state;
  const data = result.data;
  return dispatch({
    type: "contact",
    name: data.name,
    email: data.email,
    phoneE164: data.phone || undefined,
    country: data.country,
    sourcePage: "/contact",
    payload: { subject: data.subject, message: data.message },
    ...(await consentFields(data.marketingConsent === "on")),
  });
}

export async function submitQuote(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const result = await runChain(quoteSchema, formData);
  if (!result.ok) return result.state;
  const data = result.data;
  return dispatch({
    type: "quote",
    division: data.division,
    name: data.name,
    email: data.email,
    phoneE164: data.phone || undefined,
    sourcePage: `/services/${data.division}`,
    payload: { organisation: data.organisation, requirement: data.requirement },
    ...(await consentFields(data.marketingConsent === "on")),
  });
}

export async function submitCallback(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const result = await runChain(callbackSchema, formData);
  if (!result.ok) return result.state;
  const data = result.data;
  return dispatch({
    type: "callback",
    name: data.name,
    phoneE164: data.phone,
    country: data.country,
    sourcePage: "/contact",
    payload: {
      preferredWindow: data.window,
      visitorTimezone: data.timezone,
    },
    ...(await consentFields(data.marketingConsent === "on")),
  });
}

export async function submitCourse(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const result = await runChain(courseSchema, formData);
  if (!result.ok) return result.state;
  const data = result.data;
  return dispatch({
    type: "course",
    name: data.name,
    email: data.email,
    phoneE164: data.phone || undefined,
    sourcePage: `/skills-academy/${data.course}`,
    payload: { course: data.course, message: data.message },
    ...(await consentFields(data.marketingConsent === "on")),
  });
}
