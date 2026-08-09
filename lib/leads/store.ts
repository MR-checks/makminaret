import { Resend } from "resend";

/**
 * The single lead sink (MASTERPLAN §8.4, §9.2).
 *
 * Every lead action writes through here. The launch implementation generates a
 * reference, sends two emails and returns. When volume justifies a datastore,
 * the body of `saveLead` changes and nothing else does. Do not scatter email
 * sending across handlers.
 */

export type LeadType =
  "eligibility" | "contact" | "callback" | "quote" | "course" | "story";

export type Lead = {
  type: LeadType;
  division?: string;
  name?: string;
  email?: string;
  phoneE164?: string;
  country?: string;
  payload: Record<string, unknown>;
  sourcePage: string;
  consentMarketing: boolean;
  consentTimestamp: string;
  /** Hash of the exact consent wording shown, so consent is provable (KVKK, §10.6). */
  consentTextHash: string;
};

export type SaveLeadResult = {
  reference: string;
  /** False when the notification could not be sent. The caller must still show
   *  the reference and the WhatsApp route rather than a bare error (§9.2). */
  delivered: boolean;
};

const FROM = process.env.RESEND_FROM ?? "Minaret <onboarding@resend.dev>";
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO ?? "info@makminaret.com";

/**
 * Timestamp-based reference. With no database there is no sequence to draw
 * from, and this is unique without coordination and short enough to read aloud
 * on a WhatsApp call. Format: MIN-YYMMDD-XXXX.
 */
export function generateReference(now = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1
  let suffix = "";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) suffix += alphabet[byte % alphabet.length];
  return `MIN-${yy}${mm}${dd}-${suffix}`;
}

export async function hashConsentText(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function formatPayload(payload: Record<string, unknown>): string {
  return Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
      const rendered = Array.isArray(value) ? value.join(", ") : String(value);
      return `${label}: ${rendered}`;
    })
    .join("\n");
}

/**
 * The internal notification is the record, so it is plain text with one field
 * per line and a sortable subject (§9.2).
 */
function buildNotification(lead: Lead, reference: string) {
  const shortName = lead.name ? lead.name.split(" ")[0] : "No name";
  const subject = `[${lead.type.toUpperCase()}] ${lead.country ?? "Unknown"} - ${reference} - ${shortName}`;
  const body = [
    `Reference: ${reference}`,
    `Type: ${lead.type}`,
    lead.division ? `Division: ${lead.division}` : null,
    `Source page: ${lead.sourcePage}`,
    "",
    `Name: ${lead.name ?? "not given"}`,
    `Email: ${lead.email ?? "not given"}`,
    `Phone: ${lead.phoneE164 ?? "not given"}`,
    `Country: ${lead.country ?? "not given"}`,
    "",
    formatPayload(lead.payload),
    "",
    `Marketing consent: ${lead.consentMarketing ? "yes" : "no"}`,
    `Consent timestamp: ${lead.consentTimestamp}`,
    `Consent text hash: ${lead.consentTextHash}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
  return { subject, body };
}

function buildConfirmation(lead: Lead, reference: string) {
  const subject = `We have your enquiry. Reference ${reference}`;
  const body = [
    `Hello${lead.name ? ` ${lead.name.split(" ")[0]}` : ""},`,
    "",
    "We have your enquiry and a counsellor will come back to you.",
    "",
    `Your reference is ${reference}. Quote it if you message us on WhatsApp.`,
    "",
    "We reply within 4 working hours. Our office is open 09:00 to 18:00 in Türkiye.",
    "",
    "If it is urgent, message us on WhatsApp: https://wa.me/233240101057",
    "",
    "Minaret Educational Consultancy",
    "Ankara, Türkiye",
  ].join("\n");
  return { subject, body };
}

export async function saveLead(lead: Lead): Promise<SaveLeadResult> {
  const reference = generateReference();
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Local development without a key. The submission still resolves with a
    // reference so the result screen and its WhatsApp route work end to end.
    console.warn(
      `[leads] RESEND_API_KEY is not set. Lead ${reference} was not emailed.\n` +
        buildNotification(lead, reference).body
    );
    return { reference, delivered: false };
  }

  const resend = new Resend(apiKey);
  const notification = buildNotification(lead, reference);
  const confirmation = buildConfirmation(lead, reference);

  try {
    const sends: Array<Promise<unknown>> = [
      resend.emails.send({
        from: FROM,
        to: NOTIFY_TO,
        subject: notification.subject,
        text: notification.body,
        // So a counsellor can reply straight from the inbox (§9.2).
        ...(lead.email ? { replyTo: lead.email } : {}),
      }),
    ];

    if (lead.email) {
      sends.push(
        resend.emails.send({
          from: FROM,
          to: lead.email,
          subject: confirmation.subject,
          text: confirmation.body,
        })
      );
    }

    await Promise.all(sends);
    return { reference, delivered: true };
  } catch (error) {
    // Never let a delivery failure strand the visitor with no route to us.
    console.error(`[leads] Failed to deliver ${reference}:`, error);
    return { reference, delivered: false };
  }
}
