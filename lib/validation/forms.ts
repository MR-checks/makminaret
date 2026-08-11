import { z } from "zod";
import parsePhoneNumberFromString from "libphonenumber-js";

/**
 * Server-side validation for every public form (MASTERPLAN §10.2).
 *
 * Client validation is a convenience, never a control. Turnstile and rate
 * limiting are deliberately out of scope for this build; the honeypot and the
 * timing floor below are the abuse controls that remain, and both are checked
 * on the server.
 */

/** Submitted less than this after render is treated as automated (§10.3). */
export const MIN_SUBMIT_MS = 2000;

export const CONSENT_TEXT =
  "I agree that Minaret may use the details above to respond to my enquiry.";
export const MARKETING_CONSENT_TEXT =
  "I would also like to receive occasional updates about intakes and scholarships. This is optional.";

/** Present on every form. Bots fill it; humans never see it. */
const abuseControls = {
  // Named innocuously so an autofilling bot is tempted by it.
  company: z.string().max(0, "Rejected."),
  renderedAt: z.coerce.number().int().positive(),
};

export function checkTiming(renderedAt: number): string | null {
  const elapsed = Date.now() - renderedAt;
  if (!Number.isFinite(elapsed) || elapsed < 0) return "Could not verify the submission.";
  if (elapsed < MIN_SUBMIT_MS) return "That was too quick. Please try again.";
  return null;
}

const phone = z
  .string()
  .min(5, "Enter your phone number.")
  .transform((value, ctx) => {
    const parsed = parsePhoneNumberFromString(
      value.startsWith("+") ? value : `+${value}`
    );
    if (!parsed || !parsed.isValid()) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid phone number with country code.",
      });
      return z.NEVER;
    }
    return parsed.number;
  });

const email = z.string().trim().toLowerCase().email("Enter a valid email address.");
const name = z.string().trim().min(2, "Enter your name.").max(120);

export const eligibilitySchema = z.object({
  ...abuseControls,
  level: z.string().min(1, "Choose a level of study."),
  field: z.string().min(1, "Choose a field of study."),
  qualification: z.string().min(1, "Tell us your highest qualification."),
  qualificationYear: z.string().min(1, "Tell us the year."),
  grade: z.string().min(1),
  language: z.string().min(1),
  budget: z.string().min(1, "Choose a budget band."),
  intake: z.string().min(1, "Choose an intake."),
  citizenship: z.string().min(1, "Choose your country of citizenship."),
  name,
  email,
  phone,
  consent: z.literal("on", { message: "Please confirm so we can reply to you." }),
  marketingConsent: z.union([z.literal("on"), z.undefined()]).optional(),
  programSlug: z.string().optional(),
});

export const contactSchema = z.object({
  ...abuseControls,
  name,
  email,
  phone: z.union([phone, z.literal("")]).optional(),
  country: z.string().optional(),
  subject: z.string().trim().min(2, "Tell us what this is about.").max(160),
  message: z.string().trim().min(10, "Tell us a little more.").max(4000),
  consent: z.literal("on", { message: "Please confirm so we can reply to you." }),
  marketingConsent: z.union([z.literal("on"), z.undefined()]).optional(),
});

export const quoteSchema = z.object({
  ...abuseControls,
  name,
  email,
  phone: z.union([phone, z.literal("")]).optional(),
  organisation: z.string().trim().max(160).optional(),
  division: z.string().min(1),
  requirement: z.string().trim().min(10, "Tell us what you need.").max(4000),
  consent: z.literal("on", { message: "Please confirm so we can reply to you." }),
  marketingConsent: z.union([z.literal("on"), z.undefined()]).optional(),
});

export const callbackSchema = z.object({
  ...abuseControls,
  name,
  phone,
  country: z.string().optional(),
  window: z.string().min(1, "Choose a time window."),
  timezone: z.string().optional(),
  consent: z.literal("on", { message: "Please confirm so we can reply to you." }),
  marketingConsent: z.union([z.literal("on"), z.undefined()]).optional(),
});

export const courseSchema = z.object({
  ...abuseControls,
  name,
  email,
  phone: z.union([phone, z.literal("")]).optional(),
  course: z.string().min(1),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal("on", { message: "Please confirm so we can reply to you." }),
  marketingConsent: z.union([z.literal("on"), z.undefined()]).optional(),
});

export type FormState = {
  ok: boolean;
  reference?: string;
  delivered?: boolean;
  /** Field-keyed messages, plus `_form` for anything global. */
  errors?: Record<string, string>;
  verdict?: Verdict;
  matches?: MatchedProgram[];
};

export type Verdict = "eligible" | "conditional" | "not-recommended";

/** A suggested subject within a field. No institution is named. */
export type MatchedProgram = {
  /** The field slug, used to deep-link back into the finder. */
  slug: string;
  title: string;
  field: string;
};

/** Flattens a ZodError into the field-keyed shape the forms render. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
