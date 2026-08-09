"use client";

import React, { useEffect, useId, useRef } from "react";
import { CONSENT_TEXT, MARKETING_CONSENT_TEXT } from "@/lib/validation/forms";

/**
 * Shared form primitives.
 *
 * Every input has a real <label>, errors are announced via aria-live and tied
 * to the field with aria-describedby, inputs use --border-input rather than
 * --rule, and touch targets clear 44px (MASTERPLAN §12).
 */

export function Field({
  label,
  error,
  hint,
  children,
  required,
}: {
  label: string;
  /** Kept for call-site readability; the control itself carries the name. */
  name?: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; describedBy: string | undefined }) => React.ReactNode;
  required?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate"
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {!required && <span className="normal-case tracking-normal"> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="font-sans text-sm text-slate">
          {hint}
        </p>
      )}
      {children({ id, describedBy })}
      {error && (
        <p id={errorId} className="font-sans text-sm font-medium text-seal">
          {error}
        </p>
      )}
    </div>
  );
}

const controlClass =
  "min-h-11 w-full rounded-sm border border-border-input bg-paper-raised px-3 font-sans text-base text-ink transition-colors focus-visible:border-navy";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { describedBy?: string }
) {
  const { describedBy, className, ...rest } = props;
  return (
    <input
      {...rest}
      aria-describedby={describedBy}
      className={`${controlClass} ${className ?? ""}`}
    />
  );
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { describedBy?: string }
) {
  const { describedBy, className, children, ...rest } = props;
  return (
    <select
      {...rest}
      aria-describedby={describedBy}
      className={`${controlClass} ${className ?? ""}`}
    >
      {children}
    </select>
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { describedBy?: string }
) {
  const { describedBy, className, ...rest } = props;
  return (
    <textarea
      {...rest}
      aria-describedby={describedBy}
      className={`${controlClass} min-h-32 py-3 ${className ?? ""}`}
    />
  );
}

/**
 * Honeypot plus the timing floor. The honeypot is hidden with clip rather than
 * display:none on the input itself, so a bot reading computed styles is less
 * likely to skip it (MASTERPLAN §10.3).
 */
export function AbuseControls() {
  const stampRef = useRef<HTMLInputElement>(null);

  // The timestamp is written after mount rather than read during render:
  // Date.now() is impure, and reading a ref during render is not allowed.
  // The schema rejects a non-positive value, so a submission where this never
  // ran is refused rather than silently bypassing the timing floor.
  useEffect(() => {
    if (stampRef.current) stampRef.current.value = String(Date.now());
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        <label htmlFor="company-field">Company (leave this empty)</label>
        <input
          id="company-field"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={stampRef} type="hidden" name="renderedAt" defaultValue="0" />
    </>
  );
}

/**
 * Two checkboxes, unbundled, neither pre-ticked (KVKK, MASTERPLAN §10.6).
 */
export function ConsentFields({ error }: { error?: string }) {
  const consentId = useId();
  const marketingId = useId();
  return (
    <fieldset className="flex flex-col gap-4 rounded-md border border-rule p-4">
      <legend className="px-2 font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
        Consent
      </legend>
      <div className="flex items-start gap-3">
        <input
          id={consentId}
          type="checkbox"
          name="consent"
          className="mt-1 h-5 w-5 shrink-0 rounded-sm border-border-input"
        />
        <label htmlFor={consentId} className="font-sans text-sm text-ink-soft">
          {CONSENT_TEXT}
        </label>
      </div>
      <div className="flex items-start gap-3">
        <input
          id={marketingId}
          type="checkbox"
          name="marketingConsent"
          className="mt-1 h-5 w-5 shrink-0 rounded-sm border-border-input"
        />
        <label htmlFor={marketingId} className="font-sans text-sm text-ink-soft">
          {MARKETING_CONSENT_TEXT}
        </label>
      </div>
      {error && <p className="font-sans text-sm font-medium text-seal">{error}</p>}
    </fieldset>
  );
}

export function FormError({ message }: { message?: string }) {
  return (
    <div aria-live="polite" className="empty:hidden">
      {message && (
        <p className="rounded-sm border border-seal bg-paper-raised p-3 font-sans text-sm font-medium text-seal">
          {message}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90 disabled:opacity-60"
    >
      {pending ? "Sending…" : children}
    </button>
  );
}
