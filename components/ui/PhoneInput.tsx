"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountryCode?: string;
}

const COUNTRY_CODES = [
  { code: "+233", country: "GH" },
  { code: "+234", country: "NG" },
  { code: "+90", country: "TR" },
];

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, defaultCountryCode = "+233", ...props }, ref) => {
    // Basic extraction if value includes a country code
    const initialCode =
      COUNTRY_CODES.find((c) => value.startsWith(c.code))?.code || defaultCountryCode;
    const initialNumber = value.startsWith(initialCode)
      ? value.slice(initialCode.length).trim()
      : value;

    const [countryCode, setCountryCode] = React.useState(initialCode);
    const [phoneNumber, setPhoneNumber] = React.useState(initialNumber);

    const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCode = e.target.value;
      setCountryCode(newCode);
      onChange?.(`${newCode} ${phoneNumber}`);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNumber = e.target.value;
      setPhoneNumber(newNumber);
      onChange?.(`${countryCode} ${newNumber}`);
    };

    return (
      <div
        className={cn(
          "flex w-full rounded-md border border-[var(--border-input)] bg-[var(--paper-raised)] transition-colors duration-140 focus-within:border-[var(--navy)] focus-within:ring-2 focus-within:ring-[var(--navy)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--paper)]",
          className
        )}
      >
        <div className="relative flex items-center border-r border-[var(--border-input)]">
          <select
            className="h-full w-full appearance-none bg-transparent py-2 pl-3 pr-8 text-sm text-[var(--ink)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={countryCode}
            onChange={handleCodeChange}
            disabled={props.disabled}
            aria-label="Country Code"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.country} ({c.code})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[var(--slate)]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <input
          ref={ref}
          type="tel"
          className="flex h-10 w-full flex-1 bg-transparent px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--slate)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={phoneNumber}
          onChange={handleNumberChange}
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
