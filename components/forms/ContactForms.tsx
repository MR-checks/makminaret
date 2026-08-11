"use client";

import React, { useActionState } from "react";
import {
  submitCallback,
  submitContact,
  submitCourse,
  submitQuote,
} from "@/lib/actions/submit";
import type { FormState } from "@/lib/validation/forms";
import {
  AbuseControls,
  ConsentFields,
  Field,
  FormError,
  SelectInput,
  SubmitButton,
  TextArea,
  TextInput,
} from "./FormKit";
import { WhatsAppLink } from "@/components/page/Cta";
import { COUNTRY_OPTIONS } from "@/lib/countries";

const initial: FormState = { ok: false };

function Success({ state, message }: { state: FormState; message: string }) {
  return (
    <div className="rounded-md border border-rule bg-paper-raised p-8">
      <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
        Reference {state.reference}
      </p>
      <h3 className="mt-3 font-display text-2xl tracking-tight text-navy">{message}</h3>
      <p className="mt-3 font-sans leading-relaxed text-ink-soft">
        We reply within four working hours. Quote your reference if you message us on
        WhatsApp.
      </p>
      {state.delivered === false && (
        <p className="mt-4 rounded-sm border border-warning p-3 font-sans text-sm text-ink-soft">
          We could not send the confirmation email just now. Your reference above is still
          valid.
        </p>
      )}
      <div className="mt-6">
        <WhatsAppLink
          context={`Hi, I just sent an enquiry. My reference is ${state.reference}.`}
        >
          Continue on WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  if (state.ok) return <Success state={state} message="We have your message." />;

  return (
    <form action={action} className="flex flex-col gap-6">
      <AbuseControls />
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
      <Field
        label="WhatsApp number"
        name="phone"
        hint="Include your country code."
        error={state.errors?.phone}
      >
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            describedBy={describedBy}
          />
        )}
      </Field>
      <Field label="Country" name="country" error={state.errors?.country}>
        {({ id, describedBy }) => (
          <SelectInput id={id} name="country" defaultValue="" describedBy={describedBy}>
            <option value="">Choose a country</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </SelectInput>
        )}
      </Field>
      <Field label="Subject" name="subject" required error={state.errors?.subject}>
        {({ id, describedBy }) => (
          <TextInput id={id} name="subject" required describedBy={describedBy} />
        )}
      </Field>
      <Field label="Your message" name="message" required error={state.errors?.message}>
        {({ id, describedBy }) => (
          <TextArea id={id} name="message" required describedBy={describedBy} />
        )}
      </Field>
      <ConsentFields error={state.errors?.consent} />
      <FormError message={state.errors?._form} />
      <SubmitButton pending={pending}>Send message</SubmitButton>
    </form>
  );
}

/**
 * Callback booking (MASTERPLAN §4.3). The visitor picks a window in their own
 * local time and the browser reports the timezone, so the team sees both. No
 * third-party scheduling embed: that costs 300KB and a third-party cookie for
 * a job a select element does.
 */
export function CallbackForm() {
  const [state, action, pending] = useActionState(submitCallback, initial);
  if (state.ok) return <Success state={state} message="Your callback is booked." />;

  const timezone =
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";

  return (
    <form action={action} className="flex flex-col gap-6">
      <AbuseControls />
      <input type="hidden" name="timezone" value={timezone} />
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
        hint="Include your country code."
        error={state.errors?.phone}
      >
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            required
            describedBy={describedBy}
          />
        )}
      </Field>
      <Field label="Country" name="country" error={state.errors?.country}>
        {({ id, describedBy }) => (
          <SelectInput id={id} name="country" defaultValue="" describedBy={describedBy}>
            <option value="">Choose a country</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </SelectInput>
        )}
      </Field>
      <Field
        label="Preferred window"
        name="window"
        required
        hint="In your own local time. We will confirm before calling."
        error={state.errors?.window}
      >
        {({ id, describedBy }) => (
          <SelectInput
            id={id}
            name="window"
            defaultValue=""
            required
            describedBy={describedBy}
          >
            <option value="" disabled>
              Choose a window
            </option>
            <option value="morning">Morning, 09:00 to 11:00</option>
            <option value="midday">Midday, 11:00 to 13:00</option>
            <option value="afternoon">Afternoon, 13:00 to 15:00</option>
            <option value="late">Late afternoon, 15:00 to 17:00</option>
          </SelectInput>
        )}
      </Field>
      <ConsentFields error={state.errors?.consent} />
      <FormError message={state.errors?._form} />
      <SubmitButton pending={pending}>Request a callback</SubmitButton>
    </form>
  );
}

export function QuoteRequestForm({ division }: { division: string }) {
  const [state, action, pending] = useActionState(submitQuote, initial);
  if (state.ok) return <Success state={state} message="We have your request." />;

  return (
    <form action={action} className="flex flex-col gap-6">
      <AbuseControls />
      <input type="hidden" name="division" value={division} />
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
      <Field label="Organisation" name="organisation" error={state.errors?.organisation}>
        {({ id, describedBy }) => (
          <TextInput id={id} name="organisation" describedBy={describedBy} />
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
      <Field
        label="Phone"
        name="phone"
        hint="Include your country code."
        error={state.errors?.phone}
      >
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            describedBy={describedBy}
          />
        )}
      </Field>
      <Field
        label="What do you need?"
        name="requirement"
        required
        hint="Quantities, timelines and any constraints help us come back with something useful."
        error={state.errors?.requirement}
      >
        {({ id, describedBy }) => (
          <TextArea id={id} name="requirement" required describedBy={describedBy} />
        )}
      </Field>
      <ConsentFields error={state.errors?.consent} />
      <FormError message={state.errors?._form} />
      <SubmitButton pending={pending}>Request a quote</SubmitButton>
    </form>
  );
}

export function CourseEnquiryForm({ course }: { course: string }) {
  const [state, action, pending] = useActionState(submitCourse, initial);
  if (state.ok)
    return <Success state={state} message="We have your enrolment enquiry." />;

  return (
    <form action={action} className="flex flex-col gap-6">
      <AbuseControls />
      <input type="hidden" name="course" value={course} />
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
      <Field
        label="Phone"
        name="phone"
        hint="Include your country code."
        error={state.errors?.phone}
      >
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            describedBy={describedBy}
          />
        )}
      </Field>
      <Field label="Anything to add?" name="message" error={state.errors?.message}>
        {({ id, describedBy }) => (
          <TextArea id={id} name="message" describedBy={describedBy} />
        )}
      </Field>
      <ConsentFields error={state.errors?.consent} />
      <FormError message={state.errors?._form} />
      <SubmitButton pending={pending}>Ask about this course</SubmitButton>
    </form>
  );
}
